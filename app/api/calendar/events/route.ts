import { NextRequest, NextResponse } from 'next/server';
import { refreshGoogleAccessToken } from '@/src/dayos/connectors/googleOAuth';
import {
  DAYOS_SUPABASE_ACCESS_COOKIE,
  DAYOS_SUPABASE_REFRESH_COOKIE,
  dayosRest,
  deterministicEvidenceUuid,
  refreshSupabaseSession,
  userIdFromSupabaseAccessToken,
} from '@/src/dayos/connectors/supabaseRest';
import { classifyCalendarAnchor } from '@/src/dayos/core/operatingEvent';

export const runtime = 'nodejs';

interface GoogleCalendarEvent {
  id: string;
  status?: string;
  summary?: string;
  location?: string;
  htmlLink?: string;
  transparency?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  attendees?: Array<{ self?: boolean; responseStatus?: string }>;
}

interface GoogleEventsResponse {
  items?: GoogleCalendarEvent[];
  error?: { message?: string };
}

type NormalizedCalendarEvent = ReturnType<typeof normalize>[number];

interface PersistedOperatingEvent {
  id: string;
  provider_event_id: string | null;
}

function buildCalendarUrl() {
  const now = new Date();
  const horizon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', '25');
  url.searchParams.set('timeMin', now.toISOString());
  url.searchParams.set('timeMax', horizon.toISOString());
  return url;
}

async function fetchGoogleEvents(accessToken: string) {
  return fetch(buildCalendarUrl(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

function normalize(items: GoogleCalendarEvent[]) {
  return items
    .filter((event) => event.status !== 'cancelled')
    .map((event) => {
      const self = event.attendees?.find((attendee) => attendee.self);
      const isAllDay = Boolean(event.start?.date && !event.start?.dateTime);
      const transparency = event.transparency ?? 'opaque';
      const attendance = self?.responseStatus ?? null;
      const start = event.start?.dateTime ?? event.start?.date ?? null;
      const end = event.end?.dateTime ?? event.end?.date ?? null;
      const anchorClass = classifyCalendarAnchor({ isAllDay, transparency, attendance });

      return {
        id: event.id,
        operatingEventId: `calendar:${event.id}`,
        title: event.summary ?? '(Untitled event)',
        start,
        end,
        isAllDay,
        location: event.location ?? null,
        status: event.status ?? 'confirmed',
        transparency,
        attendance,
        htmlLink: event.htmlLink ?? null,
        source: 'google.calendar',
        epistemic: 'REPORTED' as const,
        temporalRole: 'SCHEDULED' as const,
        anchorClass,
        confidence: 1,
        evidenceRefs: [
          {
            id: `evidence:calendar:${event.id}`,
            kind: 'CALENDAR' as const,
            source: 'google.calendar',
            epistemic: 'REPORTED' as const,
            contentTimeUtc: start,
            confidence: 1,
            label: 'Google Calendar event',
          },
        ],
      };
    });
}

async function persistCalendarEvents(events: NormalizedCalendarEvent[], supabaseAccessToken: string) {
  const userId = userIdFromSupabaseAccessToken(supabaseAccessToken);
  if (!userId) return { ok: false, status: 401, error: 'Supabase session has no user subject' };
  if (events.length === 0) return { ok: true, status: 200, count: 0 };

  const eventRows = events.map((event) => ({
    user_id: userId,
    provider_event_id: event.id,
    title: event.title,
    starts_at: event.start,
    ends_at: event.end,
    is_all_day: event.isAllDay,
    anchor_class: event.anchorClass,
    location_label: event.location,
    source: event.source,
    epistemic: event.epistemic,
    temporal_role: event.temporalRole,
    confidence: event.confidence,
    external_url: event.htmlLink,
  }));

  const eventResult = await dayosRest<PersistedOperatingEvent[]>('operating_events', supabaseAccessToken, {
    method: 'POST',
    query: 'on_conflict=user_id,source,provider_event_id',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(eventRows),
  });

  if (!eventResult.ok || !eventResult.data) {
    return { ok: false, status: eventResult.status, error: eventResult.text ?? 'Operating event persistence failed' };
  }

  const evidenceRows = events.map((event) => ({
    id: deterministicEvidenceUuid(event.id),
    user_id: userId,
    kind: 'CALENDAR',
    source: 'google.calendar',
    epistemic: 'REPORTED',
    temporal_role: 'SCHEDULED',
    confidence: 1,
    content_time_utc: event.start,
    payload: {
      providerEventId: event.id,
      title: event.title,
      status: event.status,
      transparency: event.transparency,
      attendance: event.attendance,
      location: event.location,
      htmlLink: event.htmlLink,
      isAllDay: event.isAllDay,
      end: event.end,
    },
  }));

  const evidenceResult = await dayosRest<unknown>('evidence_records', supabaseAccessToken, {
    method: 'POST',
    query: 'on_conflict=id',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(evidenceRows),
  });

  if (!evidenceResult.ok) {
    return { ok: false, status: evidenceResult.status, error: evidenceResult.text ?? 'Evidence persistence failed' };
  }

  const eventIdByProviderId = new Map(
    eventResult.data
      .filter((row) => row.provider_event_id)
      .map((row) => [row.provider_event_id as string, row.id]),
  );

  const links = events.flatMap((event) => {
    const eventId = eventIdByProviderId.get(event.id);
    if (!eventId) return [];
    return [
      {
        event_id: eventId,
        evidence_id: deterministicEvidenceUuid(event.id),
        relationship: 'SUPPORTS',
      },
    ];
  });

  const linkResult = await dayosRest<unknown>('event_evidence_links', supabaseAccessToken, {
    method: 'POST',
    query: 'on_conflict=event_id,evidence_id',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(links),
  });

  if (!linkResult.ok) {
    return { ok: false, status: linkResult.status, error: linkResult.text ?? 'Evidence link persistence failed' };
  }

  return { ok: true, status: 200, count: eventResult.data.length };
}

export async function GET(request: NextRequest) {
  let accessToken = request.cookies.get('dayos_google_access')?.value;
  const encryptedRefreshToken = request.cookies.get('dayos_google_refresh')?.value;
  let refreshed = false;

  if (!accessToken) {
    if (!encryptedRefreshToken) {
      return NextResponse.json({ connected: false, events: [] }, { status: 401 });
    }
    const refresh = await refreshGoogleAccessToken(encryptedRefreshToken);
    if (!refresh.ok) {
      return NextResponse.json(
        { connected: false, error: 'Google token refresh failed', status: refresh.status },
        { status: 401 },
      );
    }
    accessToken = refresh.accessToken;
    refreshed = true;
  }

  let googleResponse = await fetchGoogleEvents(accessToken);

  if (googleResponse.status === 401 && encryptedRefreshToken) {
    const refresh = await refreshGoogleAccessToken(encryptedRefreshToken);
    if (!refresh.ok) {
      return NextResponse.json(
        { connected: false, error: 'Google token refresh failed', status: refresh.status },
        { status: 401 },
      );
    }
    accessToken = refresh.accessToken;
    refreshed = true;
    googleResponse = await fetchGoogleEvents(accessToken);
  }

  const payload = (await googleResponse.json()) as GoogleEventsResponse;

  if (!googleResponse.ok) {
    return NextResponse.json(
      {
        connected: true,
        error: payload.error?.message ?? 'Google Calendar request failed',
        status: googleResponse.status,
      },
      { status: 502 },
    );
  }

  const events = normalize(payload.items ?? []);
  let supabaseAccessToken = request.cookies.get(DAYOS_SUPABASE_ACCESS_COOKIE)?.value;
  let supabaseRefreshToken = request.cookies.get(DAYOS_SUPABASE_REFRESH_COOKIE)?.value;
  let supabaseRefreshed = false;

  if (!supabaseAccessToken && supabaseRefreshToken) {
    const refresh = await refreshSupabaseSession(supabaseRefreshToken);
    if (refresh.ok) {
      supabaseAccessToken = refresh.payload.access_token;
      supabaseRefreshToken = refresh.payload.refresh_token;
      supabaseRefreshed = true;
    }
  }

  let persistence: { ok: boolean; status: number; count?: number; error?: string } = {
    ok: false,
    status: 401,
    error: 'Supabase Auth session missing; reconnect Google once to enable persistence',
  };

  if (supabaseAccessToken) {
    persistence = await persistCalendarEvents(events, supabaseAccessToken);
    if (!persistence.ok && persistence.status === 401 && supabaseRefreshToken) {
      const refresh = await refreshSupabaseSession(supabaseRefreshToken);
      if (refresh.ok) {
        supabaseAccessToken = refresh.payload.access_token;
        supabaseRefreshToken = refresh.payload.refresh_token;
        supabaseRefreshed = true;
        persistence = await persistCalendarEvents(events, supabaseAccessToken);
      }
    }
  }

  const response = NextResponse.json({
    connected: true,
    fetchedAt: new Date().toISOString(),
    source: 'google.calendar',
    persistence,
    events,
  });

  if (refreshed && accessToken) {
    response.cookies.set('dayos_google_access', accessToken, {
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 55 * 60,
    });
  }

  if (supabaseRefreshed && supabaseAccessToken && supabaseRefreshToken) {
    const secure = request.nextUrl.protocol === 'https:';
    response.cookies.set(DAYOS_SUPABASE_ACCESS_COOKIE, supabaseAccessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 55 * 60,
    });
    response.cookies.set(DAYOS_SUPABASE_REFRESH_COOKIE, supabaseRefreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
