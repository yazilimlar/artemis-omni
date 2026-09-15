import { NextRequest, NextResponse } from 'next/server';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  dayosRest,
  refreshSupabaseSession,
  userIdFromSupabaseAccessToken,
} from '@/src/dayos/connectors/supabaseRest';

export const runtime = 'nodejs';

interface NormalizeBody { importId?: string }
interface ImportRow { id: string; user_id: string; raw_payload: unknown }

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function probabilityToConfidence(value: number | null, fallback: number) {
  if (value === null) return fallback;
  const normalized = value > 1 ? value / 100 : value;
  return Math.max(0, Math.min(1, normalized));
}

function normalize(raw: unknown, userId: string, importId: string) {
  const records = Array.isArray(raw)
    ? raw
    : (() => {
        const object = asObject(raw);
        for (const key of ['semanticSegments', 'timelineObjects', 'locations']) {
          if (object && Array.isArray(object[key])) return object[key] as unknown[];
        }
        return [] as unknown[];
      })();

  return records.map((record, index) => {
    const root = asObject(record) ?? {};
    const visit = asObject(root.visit);
    const activity = asObject(root.activity);
    const visitCandidate = asObject(visit?.topCandidate);
    const activityCandidate = asObject(activity?.topCandidate);
    const segmentType = visit ? 'VISIT' : activity ? 'MOVEMENT' : 'UNKNOWN';
    const providerProbability =
      asNumber(visit?.probability) ??
      asNumber(visitCandidate?.probability) ??
      asNumber(activity?.probability) ??
      asNumber(activityCandidate?.probability);

    return {
      user_id: userId,
      timeline_import_id: importId,
      source_ordinal: index + 1,
      segment_type: segmentType,
      starts_at: asString(root.startTime),
      ends_at: asString(root.endTime),
      place_id: asString(visitCandidate?.placeID),
      place_location: asString(visitCandidate?.placeLocation),
      semantic_type: asString(visitCandidate?.semanticType),
      activity_type: asString(activityCandidate?.type),
      distance_meters: asNumber(activity?.distanceMeters),
      provider_probability: providerProbability,
      epistemic: 'INFERRED',
      temporal_role: 'ACTUAL',
      confidence: probabilityToConfidence(providerProbability, segmentType === 'UNKNOWN' ? 0.25 : 0.5),
      metadata: {
        sourceKeys: Object.keys(root).sort(),
        normalizedBy: 'dayos.timeline.v1',
      },
    };
  });
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

  const userId = userIdFromSupabaseAccessToken(accessToken);
  if (!userId) return NextResponse.json({ ok: false, error: 'Supabase session has no user subject' }, { status: 401 });

  let body: NormalizeBody;
  try { body = await request.json() as NormalizeBody; }
  catch { return NextResponse.json({ ok: false, error: 'Request body must be valid JSON' }, { status: 400 }); }
  if (!body.importId) return NextResponse.json({ ok: false, error: 'importId is required' }, { status: 400 });

  const importResult = await dayosRest<ImportRow[]>('timeline_imports', accessToken, {
    method: 'GET',
    query: `select=id,user_id,raw_payload&id=eq.${encodeURIComponent(body.importId)}&limit=1`,
  });
  const imported = importResult.data?.[0];
  if (!importResult.ok || !imported) {
    return NextResponse.json({ ok: false, error: importResult.text ?? 'Timeline import not found' }, { status: importResult.status || 404 });
  }
  if (imported.user_id !== userId) return NextResponse.json({ ok: false, error: 'Timeline import owner mismatch' }, { status: 403 });

  const rows = normalize(imported.raw_payload, userId, imported.id);
  if (!rows.length) return NextResponse.json({ ok: true, importId: imported.id, segmentCount: 0, counts: {} });

  const writeResult = await dayosRest<unknown>('timeline_segments', accessToken, {
    method: 'POST',
    query: 'on_conflict=timeline_import_id,source_ordinal',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!writeResult.ok) {
    return NextResponse.json({ ok: false, error: writeResult.text ?? 'Timeline normalization persistence failed' }, { status: writeResult.status || 500 });
  }

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.segment_type] = (acc[row.segment_type] ?? 0) + 1;
    return acc;
  }, {});
  const response = NextResponse.json({ ok: true, importId: imported.id, segmentCount: rows.length, counts, epistemic: 'INFERRED' });
  if (refreshed && accessToken && refreshToken) setSessionCookies(response, request, accessToken, refreshToken);
  return response;
}
