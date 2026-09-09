import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    const otp = String(body.otp || "").trim();

    const password = String(body.password || "");

    if (!email || !otp || !password) {
      return NextResponse.json(
        {
          error: "Email, OTP and new password are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Find the latest OTP
    const records = await sql`
      SELECT
        id,
        email,
        otp_hash,
        expires_at,
        attempts,
        verified
      FROM password_reset_otps
      WHERE email = ${email}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (records.length === 0) {
      return NextResponse.json(
        {
          error: "OTP not found. Please request a new OTP.",
        },
        { status: 404 }
      );
    }

    const record = records[0];

    // OTP must have been verified first
    if (!record.verified) {
      return NextResponse.json(
        {
          error: "Please verify your OTP before resetting your password.",
        },
        { status: 400 }
      );
    }

    // Check OTP expiry
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        {
          error: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Verify OTP one more time
    const validOtp = await bcrypt.compare(
      otp,
      record.otp_hash
    );

    if (!validOtp) {
      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password
    const updatedUsers = await sql`
      UPDATE users
      SET
        password_hash = ${passwordHash},
        updated_at = ${new Date()}
      WHERE email = ${email}
      RETURNING id, email
    `;

    if (updatedUsers.length === 0) {
      return NextResponse.json(
        {
          error: "User account was not found.",
        },
        { status: 404 }
      );
    }

    // Delete OTP after successful password reset
    await sql`
      DELETE FROM password_reset_otps
      WHERE email = ${email}
    `;

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to reset password. Please try again.",
      },
      { status: 500 }
    );
  }
}