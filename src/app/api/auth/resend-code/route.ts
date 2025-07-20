import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user.model";
import { sendVerificationMail } from "@/helper/sendVerificationMail";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified." }, { status: 200 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    await user.save();
    await sendVerificationMail(email, code);
    return NextResponse.json({ message: "Verification code resent." }, { status: 200 });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to resend verification code." },
      { status: 500 }
    );
  }
}
