import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { sendPasswordResetOtp } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Please enter a valid Gmail address." },
        { status: 400 }
      );
    }

    // Check whether user exists
    const users = await sql`
      SELECT id, email
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No CivicConnect account was found with this Gmail address." },
        { status: 404 }
      );
    }

    // Generate random 4-digit OTP
    const otp = crypto.randomInt(1000, 10000).toString();

    // Hash OTP before storing it
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expires after 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remove previous OTPs for this email
    await sql`
      DELETE FROM password_reset_otps
      WHERE email = ${email}
    `;

    // Store new OTP
    await sql`
      INSERT INTO password_reset_otps (
        id,
        email,
        otp_hash,
        expires_at,
        attempts,
        verified,
        created_at
      )
      VALUES (
        ${crypto.randomUUID()},
        ${email},
        ${otpHash},
        ${expiresAt},
        0,
        false,
        ${new Date()}
      )
    `;

    // Send OTP through Gmail
    await sendPasswordResetOtp(email, otp);

    return NextResponse.json({
      success: true,
      message: "A 4-digit OTP has been sent to your Gmail address.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to send OTP. Please try again later.",
      },
      { status: 500 }
    );
  }
}