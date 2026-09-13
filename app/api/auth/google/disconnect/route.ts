import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const secure = request.nextUrl.protocol === 'https:';

  for (const name of ['dayos_google_access', 'dayos_google_refresh', 'dayos_google_oauth_state']) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }

  return response;
}
