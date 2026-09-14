import { NextRequest, NextResponse } from 'next/server';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  dayosRest,
  refreshSupabaseSession,
} from '@/src/dayos/connectors/supabaseRest';

export const runtime = 'nodejs';

interface TimelineImportRow {
  id: string;
  import_source: string;
  source_filename: string | null;
  source_sha256: string | null;
  record_count: number;
  imported_at: string;
}

function setSessionCookies(response: NextResponse, request: NextRequest, accessToken: string, refreshToken: string) {
  const secure = request.nextUrl.protocol === 'https:';
  response.cookies.set(DAYOS_SUPABASE_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 55 * 60,
  });
  response.cookies.set(DAYOS_SUPABASE_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function GET(request: NextRequest) {
  let accessToken = request.cookies.get(DAYOS_SUPABASE_ACCESS_COOKIE)?.value;
  let refreshToken = request.cookies.get(DAYOS_SUPABASE_REFRESH_COOKIE)?.value;
  let refreshed = false;

  if (!accessToken && refreshToken) {
    const refresh = await refreshSupabaseSession(refreshToken);
    if (refresh.ok) {
      accessToken = refresh.payload.access_token;
      refreshToken = refresh.payload.refresh_token;
      refreshed = true;
    }
  }

  if (!accessToken) {
    return NextResponse.json({ ok: false, imports: [], error: 'Supabase session required' }, { status: 401 });
  }

  const result = await dayosRest<TimelineImportRow[]>('timeline_imports', accessToken, {
    method: 'GET',
    query: 'select=id,import_source,source_filename,source_sha256,record_count,imported_at&order=imported_at.desc&limit=20',
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, imports: [], error: result.text ?? 'Timeline import read failed' },
      { status: result.status || 500 },
    );
  }

  const response = NextResponse.json({ ok: true, imports: result.data ?? [] });
  if (refreshed && accessToken && refreshToken) {
    setSessionCookies(response, request, accessToken, refreshToken);
  }
  return response;
}
