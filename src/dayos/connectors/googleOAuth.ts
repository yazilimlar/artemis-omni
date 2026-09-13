import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const TOKEN_VERSION = 'v1';

function authKey(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be configured with at least 32 characters');
  }
  return createHash('sha256').update(secret, 'utf8').digest();
}

export function encryptSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', authKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [TOKEN_VERSION, iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join('.');
}

export function decryptSecret(value: string): string {
  const [version, ivEncoded, tagEncoded, ciphertextEncoded] = value.split('.');
  if (version !== TOKEN_VERSION || !ivEncoded || !tagEncoded || !ciphertextEncoded) {
    throw new Error('Invalid encrypted token format');
  }
  const decipher = createDecipheriv('aes-256-gcm', authKey(), Buffer.from(ivEncoded, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagEncoded, 'base64url'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextEncoded, 'base64url')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

export function randomOAuthState(): string {
  return randomBytes(24).toString('base64url');
}

export function googleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_OAUTH_REDIRECT_URI');
  }

  return { clientId, clientSecret, redirectUri };
}

export async function refreshGoogleAccessToken(encryptedRefreshToken: string) {
  const { clientId, clientSecret } = googleOAuthConfig();
  const refreshToken = decryptSecret(encryptedRefreshToken);
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    return { ok: false as const, status: response.status };
  }

  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token) {
    return { ok: false as const, status: 502 };
  }

  return {
    ok: true as const,
    accessToken: payload.access_token,
    expiresIn: payload.expires_in ?? 3600,
  };
}
