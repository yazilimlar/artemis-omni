import { NextRequest, NextResponse } from 'next/server';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  dayosRest,
  refreshSupabaseSession,
} from '@/src/dayos/connectors/supabaseRest';

export const runtime = 'nodejs';

interface QualityBody { importId?: string }
interface QualitySummary {
  total: number;
  pass_count: number;
  review_count: number;
  reject_count: number;
}

function setSessionCookies(response: NextResponse, request: NextRequest, accessToken: string, refreshToken: string) {
  const secure = request.nextUrl.protocol === 'https:';
  response.cookies.set(DAYOS_SUPABASE_ACCESS_COOKIE, accessToken, {
    httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 55 * 60,
  });
  response.cookies.set(DAYOS_SUPABASE_REFRESH_COOKIE, refreshToken, {
    httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}

export async function POST(request: NextRequest) {
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
  if (!accessToken) return NextResponse.json({ ok: false, error: 'Supabase session required' }, { status: 401 });

  let body: QualityBody;
  try { body = await request.json() as QualityBody; }
  catch { return NextResponse.json({ ok: false, error: 'Request body must be valid JSON' }, { status: 400 }); }
  if (!body.importId) return NextResponse.json({ ok: false, error: 'importId is required' }, { status: 400 });

  const result = await dayosRest<QualitySummary[]>('rpc/assess_timeline_quality', accessToken, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ p_import_id: body.importId }),
  });

  if (!result.ok || !result.data?.[0]) {
    return NextResponse.json({ ok: false, error: result.text ?? 'Timeline quality assessment failed' }, { status: result.status || 500 });
  }

  const response = NextResponse.json({ ok: true, importId: body.importId, ...result.data[0] });
  if (refreshed && accessToken && refreshToken) setSessionCookies(response, request, accessToken, refreshToken);
  return response;
}
