import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user.model';
import { dbConnect } from '@/utils/db';
import cloudinary from '@/utils/cloudinary';
import path from 'path';
import streamifier from 'streamifier';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const replaceIndex = Number(formData.get('replaceIndex'));
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or user ID' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!Array.isArray(user.images)) {
      user.images = [];
    }

    // Extract username from email
    const username = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');

    let index: number;

    // ✅ Safe logic AFTER user is available
    if (!isNaN(replaceIndex) && (replaceIndex === 0 || replaceIndex === 1)) {
      index = replaceIndex;
    } else {
      if (!user.images[0]) {
        index = 0;
      } else if (!user.images[1]) {
        index = 1;
      } else {
        return NextResponse.json({ error: 'Image limit reached' }, { status: 400 });
      }
    }

    const publicId = `${username}${index + 1}`;

    const imageUrl = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'user-uploads',
          public_id: publicId,
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    user.images[index] = imageUrl;
    await user.save();

    return NextResponse.json({ message: 'Image uploaded', imageUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
