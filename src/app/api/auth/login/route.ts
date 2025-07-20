import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Acceptable domain(s)
const allowedDomain = "linkorgnet.com";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const emailDomain = email.split("@")[1];
    if (emailDomain !== allowedDomain) {
      return NextResponse.json(
        { error: "Only company emails are allowed. Please use your work email." },
        { status: 400 }
      );
    }

  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ user, token }, { status: 200 });
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`
    );

    return response;
  }
}
