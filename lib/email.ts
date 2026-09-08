import nodemailer from "nodemailer";

console.log("GMAIL_USER loaded:", !!process.env.GMAIL_USER);
console.log("GMAIL_APP_PASSWORD loaded:", !!process.env.GMAIL_APP_PASSWORD);
console.log(
  "GMAIL_APP_PASSWORD length:",
  process.env.GMAIL_APP_PASSWORD?.length
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetOtp(
  email: string,
  otp: string
) {
  await transporter.sendMail({
    from: `"CivicConnect" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "CivicConnect Password Reset OTP",
    text: `Your CivicConnect password reset OTP is ${otp}. This OTP will expire in 10 minutes.`,
  });
}