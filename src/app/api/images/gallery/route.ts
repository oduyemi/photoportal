import { NextResponse } from 'next/server';
import User from '@/models/user.model';
import { dbConnect } from '@/utils/db';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({ images: { $exists: true, $not: { $size: 0 } } });

    const images = users.flatMap(user => {
      const birthMonth = user.birthday
        ? MONTHS[new Date(user.birthday).getUTCMonth()] // getUTCMonth ensures consistent timezone parsing
        : 'Unknown';

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

      return user.images.map((img: string) => ({
        img,
        department: user.department || 'Unspecified',
        birthMonth,
        name: fullName || 'Unnamed',
      }));
    });

    return NextResponse.json(images);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
}
