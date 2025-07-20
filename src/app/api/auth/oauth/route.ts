import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


let cachedToken: { token: string; expiry: number } | null = null;

export const getAccessToken = async (): Promise<string> => {
  const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_TENANT_ID } = process.env;

  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_TENANT_ID) {
    throw new Error('OAuth credentials are missing in environment variables');
  }

  if (cachedToken && cachedToken.expiry > Date.now()) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: OAUTH_CLIENT_ID,
    client_secret: OAUTH_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  });

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${OAUTH_TENANT_ID}/oauth2/v2.0/token`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    cachedToken = {
      token: accessToken,
      expiry: Date.now() + expiresIn * 1000 - 60_000,
    };

    return accessToken;
  } catch (error: any) {
    console.error('Token fetch error:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};


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
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
