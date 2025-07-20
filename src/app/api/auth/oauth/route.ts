/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/oauth';

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    return NextResponse.json({ accessToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    const response = NextResponse.json(
      { message: 'Access token stored in cookie' },
      { status: 200 }
    );

    response.cookies.set('ms_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
