import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/helper/sendVerificationMail";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const {
    firstName,
    lastName,
    email,
    password,
    department,
    jobRole,
    birthday,
  } = body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@linkorgnet\.com$/.test(email)) {
      return NextResponse.json(
        { error: "Only work emails ending with @linkorgnet.com are allowed." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      department,
      jobRole,
      birthday,
      images: [],
      emailVerified: false,
      profileCompleted: false,
      verificationCode: code,
      verificationCodeExpires: codeExpires,
    });

    await sendVerificationMail(email, code);

    return NextResponse.json(
      { message: "Registration successful. Please check your email for a verification code." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}