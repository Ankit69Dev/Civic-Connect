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

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must contain exactly 4 digits." },
        { status: 400 }
      );
    }

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
        { error: "OTP not found. Please request a new OTP." },
        { status: 404 }
      );
    }

    const record = records[0];

    // Already verified
    if (record.verified) {
      return NextResponse.json(
        { error: "This OTP has already been used." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        {
          error: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Maximum 5 attempts
    if (Number(record.attempts) >= 5) {
      return NextResponse.json(
        {
          error: "Too many incorrect attempts. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    // Compare entered OTP with hashed OTP
    const validOtp = await bcrypt.compare(
      otp,
      record.otp_hash
    );

    if (!validOtp) {
      await sql`
        UPDATE password_reset_otps
        SET attempts = attempts + 1
        WHERE id = ${record.id}
      `;

      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await sql`
      UPDATE password_reset_otps
      SET verified = true
      WHERE id = ${record.id}
    `;

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to verify OTP. Please try again.",
      },
      { status: 500 }
    );
  }
}