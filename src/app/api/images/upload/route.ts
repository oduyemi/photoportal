import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import User from '@/models/user.model';
import { dbConnect } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const replaceIndex = Number(formData.get('replaceIndex')); // 0 or 1
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or user ID' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name).toLowerCase();

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!Array.isArray(user.images)) {
      user.images = [];
    }

    // Determine the index to use
    let index: number;
    if (!isNaN(replaceIndex) && (replaceIndex === 0 || replaceIndex === 1)) {
      index = replaceIndex;
    } else {
      if (user.images.length >= 2) {
        return NextResponse.json({ error: 'Image limit reached' }, { status: 400 });
      }
      index = user.images[0] ? (user.images[1] ? -1 : 1) : 0;
      if (index === -1) {
        return NextResponse.json({ error: 'No available image slot' }, { status: 400 });
      }
    }

    // Extract username from email
    const username = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${username}${index + 1}${fileExtension}`;
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(publicDir, fileName);
    const imageUrl = `/uploads/${fileName}`;

    // Ensure uploads directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Remove old image if exists
    const existingImageUrl = user.images[index];
    if (existingImageUrl) {
      const oldImagePath = path.join(process.cwd(), 'public', existingImageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save the new image file
    fs.writeFileSync(filePath, buffer);

    // Update user images
    user.images[index] = imageUrl;
    await user.save();

    return NextResponse.json({ message: 'Image uploaded', imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
