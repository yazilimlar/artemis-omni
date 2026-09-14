import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  dayosRest,
  refreshSupabaseSession,
  userIdFromSupabaseAccessToken,
} from '@/src/dayos/connectors/supabaseRest';

export const runtime = 'nodejs';

interface TimelineImportBody {
  sourceFilename?: string;
  rawPayload: unknown;
  recordCount?: number;
}

interface TimelineImportRow {
  id: string;
  import_source: string;
  source_filename: string | null;
  source_sha256: string | null;
  record_count: number;
  imported_at: string;
}

function countTimelineRecords(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (!value || typeof value !== 'object') return 0;
  const object = value as Record<string, unknown>;
  for (const key of ['semanticSegments', 'timelineObjects', 'locations']) {
    if (Array.isArray(object[key])) return object[key].length;
  }
  return 0;
}

function sessionCookies(response: NextResponse, request: NextRequest, accessToken: string, refreshToken: string) {
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

  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'Supabase session required' }, { status: 401 });
  }

  const userId = userIdFromSupabaseAccessToken(accessToken);
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Supabase session has no user subject' }, { status: 401 });
  }

  let body: TimelineImportBody;
  try {
    body = (await request.json()) as TimelineImportBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (!Object.prototype.hasOwnProperty.call(body, 'rawPayload')) {
    return NextResponse.json({ ok: false, error: 'rawPayload is required' }, { status: 400 });
  }

  const canonical = JSON.stringify(body.rawPayload);
  const sourceSha256 = createHash('sha256').update(canonical).digest('hex');
  const recordCount = Number.isFinite(body.recordCount)
    ? Math.max(0, Math.floor(body.recordCount as number))
    : countTimelineRecords(body.rawPayload);

  const importResult = await dayosRest<TimelineImportRow[]>('timeline_imports', accessToken, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      user_id: userId,
      import_source: 'google.timeline.export',
      source_filename: body.sourceFilename ?? null,
      source_sha256: sourceSha256,
      record_count: recordCount,
      raw_payload: body.rawPayload,
    }),
  });

  if (!importResult.ok || !importResult.data?.[0]) {
    return NextResponse.json(
      { ok: false, error: importResult.text ?? 'Timeline import persistence failed' },
      { status: importResult.status || 500 },
    );
  }

  const imported = importResult.data[0];
  const evidenceResult = await dayosRest<unknown>('evidence_records', accessToken, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      user_id: userId,
      kind: 'TIMELINE',
      source: 'google.timeline.export',
      epistemic: 'REPORTED',
      temporal_role: 'ACTUAL',
      confidence: 1,
      observed_at_utc: imported.imported_at,
      payload: {
        timelineImportId: imported.id,
        sourceFilename: imported.source_filename,
        sourceSha256: imported.source_sha256,
        recordCount: imported.record_count,
      },
    }),
  });

  if (!evidenceResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        importId: imported.id,
        error: evidenceResult.text ?? 'Timeline evidence persistence failed',
      },
      { status: evidenceResult.status || 500 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    importId: imported.id,
    sourceSha256,
    recordCount,
    importedAt: imported.imported_at,
    epistemic: 'REPORTED',
  });

  if (refreshed && accessToken && refreshToken) {
    sessionCookies(response, request, accessToken, refreshToken);
  }

  return response;
}
