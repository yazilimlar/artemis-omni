import { NextRequest, NextResponse } from 'next/server';
import { encryptSecret, googleOAuthConfig } from '@/src/dayos/connectors/googleOAuth';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  signInSupabaseWithGoogleIdToken,
} from '@/src/dayos/connectors/supabaseRest';

export const runtime = 'nodejs';

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

function flightDeckUrl(request: NextRequest, params?: Record<string, string>) {
  const url = new URL('/dayos-next/flight-deck', request.nextUrl.origin);
  for (const [key, value] of Object.entries(params ?? {})) url.searchParams.set(key, value);
  return url;
}

export async function GET(request: NextRequest) {
  const returnedState = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get('dayos_google_oauth_state')?.value;
  const code = request.nextUrl.searchParams.get('code');
  const oauthError = request.nextUrl.searchParams.get('error');

  if (oauthError) {
    return NextResponse.redirect(flightDeckUrl(request, { google: 'error', reason: oauthError }));
  }

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return NextResponse.json({ error: 'OAuth state validation failed' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing Google OAuth authorization code' }, { status: 400 });
  }

  const { clientId, clientSecret, redirectUri } = googleOAuthConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    return NextResponse.json(
      {
        error: 'Google token exchange failed',
        status: tokenResponse.status,
        detail: tokenPayload.error_description ?? tokenPayload.error ?? 'Unknown token response',
      },
      { status: 502 },
    );
  }

  if (!tokenPayload.id_token) {
    return NextResponse.json(
      { error: 'Google did not return an ID token. Reconnect after identity scopes are enabled.' },
      { status: 502 },
    );
  }

  const supabaseAuth = await signInSupabaseWithGoogleIdToken(tokenPayload.id_token, tokenPayload.access_token);
  if (!supabaseAuth.ok) {
    return NextResponse.json(
      {
        error: 'Supabase Auth sign-in failed',
        status: supabaseAuth.status,
        detail: supabaseAuth.payload.msg ?? supabaseAuth.payload.error ?? 'Unknown Supabase Auth response',
      },
      { status: 502 },
    );
  }

  const priorRefreshToken = request.cookies.get('dayos_google_refresh')?.value;
  const encryptedRefreshToken = tokenPayload.refresh_token
    ? encryptSecret(tokenPayload.refresh_token)
    : priorRefreshToken;

  if (!encryptedRefreshToken) {
    return NextResponse.json(
      { error: 'Google did not return a refresh token. Revoke prior consent and authorize again.' },
      { status: 502 },
    );
  }

  const response = NextResponse.redirect(flightDeckUrl(request, { google: 'connected', persistence: 'ready' }));
  const secure = request.nextUrl.protocol === 'https:';

  response.cookies.set('dayos_google_refresh', encryptedRefreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set('dayos_google_access', tokenPayload.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(60, (tokenPayload.expires_in ?? 3600) - 60),
  });

  response.cookies.set(DAYOS_SUPABASE_ACCESS_COOKIE, supabaseAuth.payload.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(60, (supabaseAuth.payload.expires_in ?? 3600) - 60),
  });

  response.cookies.set(DAYOS_SUPABASE_REFRESH_COOKIE, supabaseAuth.payload.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  response.cookies.set('dayos_google_oauth_state', '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
