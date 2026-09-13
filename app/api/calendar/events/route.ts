import { NextRequest, NextResponse } from 'next/server';
import { refreshGoogleAccessToken } from '@/src/dayos/connectors/googleOAuth';

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

function buildCalendarUrl() {
  const now = new Date();
  const horizon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('maxResults', '10');
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
      return {
        id: event.id,
        title: event.summary ?? '(Untitled event)',
        start: event.start?.dateTime ?? event.start?.date ?? null,
        end: event.end?.dateTime ?? event.end?.date ?? null,
        isAllDay: Boolean(event.start?.date && !event.start?.dateTime),
        location: event.location ?? null,
        status: event.status ?? 'confirmed',
        transparency: event.transparency ?? 'opaque',
        attendance: self?.responseStatus ?? null,
        htmlLink: event.htmlLink ?? null,
        source: 'google.calendar',
      };
    });
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

  const response = NextResponse.json({
    connected: true,
    fetchedAt: new Date().toISOString(),
    events: normalize(payload.items ?? []),
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

  return response;
}
