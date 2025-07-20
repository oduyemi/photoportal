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

  const response = await axios.post(
    `https://login.microsoftonline.com/${OAUTH_TENANT_ID}/oauth2/v2.0/token`,
    params.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  const accessToken = response.data.access_token;
  const expiresIn = response.data.expires_in;

  cachedToken = {
    token: accessToken,
    expiry: Date.now() + expiresIn * 1000 - 60_000,
  };

  return accessToken;
};
