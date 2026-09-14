import { createHash } from 'crypto';

const DEFAULT_SUPABASE_URL = 'https://ukmirlafkecsvnpvqzyb.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_37afjptLkqzbZToxzPMO0w_7LzuMs_e';

export const DAYOS_SUPABASE_ACCESS_COOKIE = 'dayos_supabase_access';
export const DAYOS_SUPABASE_REFRESH_COOKIE = 'dayos_supabase_refresh';

export interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
  user?: { id?: string; email?: string };
}

export function supabaseConfig() {
  return {
    url: (process.env.DAYOS_SUPABASE_URL ?? DEFAULT_SUPABASE_URL).replace(/\/$/, ''),
    publishableKey: process.env.DAYOS_SUPABASE_PUBLISHABLE_KEY ?? DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  };
}

export async function signInSupabaseWithGoogleIdToken(idToken: string, googleAccessToken: string) {
  const { url, publishableKey } = supabaseConfig();
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const response = await fetch(`${url}/auth/v1/token?grant_type=id_token`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'google',
      id_token: idToken,
      access_token: googleAccessToken,
      ...(googleClientId ? { client_id: googleClientId } : {}),
    }),
    cache: 'no-store',
  });

  const payload = (await response.json()) as SupabaseAuthSession & { error?: string; msg?: string };
  return { ok: response.ok && Boolean(payload.access_token && payload.refresh_token), status: response.status, payload };
}

export async function refreshSupabaseSession(refreshToken: string) {
  const { url, publishableKey } = supabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: 'no-store',
  });

  const payload = (await response.json()) as SupabaseAuthSession & { error?: string; msg?: string };
  return { ok: response.ok && Boolean(payload.access_token && payload.refresh_token), status: response.status, payload };
}

export function userIdFromSupabaseAccessToken(accessToken: string): string | null {
  try {
    const [, payload] = accessToken.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const claims = JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as { sub?: string };
    return claims.sub ?? null;
  } catch {
    return null;
  }
}

export function deterministicEvidenceUuid(providerEventId: string) {
  const hex = createHash('sha256').update(`dayos:evidence:google.calendar:${providerEventId}`).digest('hex').slice(0, 32);
  const chars = hex.split('');
  chars[12] = '5';
  chars[16] = ((parseInt(chars[16], 16) & 0x3) | 0x8).toString(16);
  const v = chars.join('');
  return `${v.slice(0, 8)}-${v.slice(8, 12)}-${v.slice(12, 16)}-${v.slice(16, 20)}-${v.slice(20)}`;
}

export async function dayosRest<T>(
  table: string,
  accessToken: string,
  init: RequestInit & { query?: string } = {},
): Promise<{ ok: boolean; status: number; data: T | null; text?: string }> {
  const { url, publishableKey } = supabaseConfig();
  const method = (init.method ?? 'GET').toUpperCase();
  const profileHeader = method === 'GET' || method === 'HEAD' ? 'Accept-Profile' : 'Content-Profile';
  const query = init.query ? `?${init.query}` : '';
  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    ...init,
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
      [profileHeader]: 'dayos',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      // Preserve non-JSON error text for diagnostics.
    }
  }
  return { ok: response.ok, status: response.status, data, text: text || undefined };
}
