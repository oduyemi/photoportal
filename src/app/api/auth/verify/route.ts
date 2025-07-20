/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified." });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    if (user.verificationCodeExpires < new Date()) {
      return NextResponse.json({ error: "Verification code expired." }, { status: 400 });
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate new token and update cookie
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "7d",
    });

    const res = NextResponse.json({ message: "Email verified successfully." });
    res.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
}
