'use client';

import { useCallback, useEffect, useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string | null;
  end: string | null;
  isAllDay: boolean;
  location: string | null;
  status: string;
  transparency: string;
  attendance: string | null;
  htmlLink: string | null;
  source: string;
}

interface CalendarPayload {
  connected?: boolean;
  fetchedAt?: string;
  events?: CalendarEvent[];
  error?: string;
}

function displayTime(value: string | null, allDay: boolean) {
  if (!value) return 'Time unavailable';
  if (allDay) return new Date(`${value}T00:00:00`).toLocaleDateString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function FlightDeckPage() {
  const [payload, setPayload] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar/events', { cache: 'no-store' });
      setPayload((await response.json()) as CalendarPayload);
    } catch {
      setPayload({ connected: false, error: 'Unable to reach the DayOS calendar endpoint.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function disconnect() {
    await fetch('/api/auth/google/disconnect', { method: 'POST' });
    await load();
  }

  const events = payload?.events ?? [];

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>
          Artemis DayOS · Gate 1
        </div>
        <h1 style={{ margin: '8px 0 6px', fontSize: 32 }}>Flight Deck</h1>
        <p style={{ margin: 0, opacity: 0.72 }}>
          Live Google Calendar walking skeleton. Create an event in Google Calendar, reload here, and verify it appears.
        </p>
      </header>

      {!loading && !payload?.connected ? (
        <section style={{ border: '1px solid #bbb', borderRadius: 14, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Google Calendar not connected</h2>
          <p style={{ opacity: 0.72 }}>{payload?.error ?? 'Authorize read-only calendar access to cross Gate 1.'}</p>
          <a
            href="/api/auth/google"
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: 10,
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            Authorize Google Calendar
          </a>
        </section>
      ) : null}

      {loading ? <p>Loading calendar anchors…</p> : null}

      {!loading && payload?.connected ? (
        <>
          <section style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            <button onClick={() => void load()} style={{ padding: '9px 12px' }}>
              Reload real events
            </button>
            <button onClick={() => void disconnect()} style={{ padding: '9px 12px' }}>
              Disconnect
            </button>
            <span style={{ alignSelf: 'center', opacity: 0.6, fontSize: 13 }}>
              {payload.fetchedAt ? `Fetched ${new Date(payload.fetchedAt).toLocaleTimeString()}` : ''}
            </span>
          </section>

          {payload.error ? (
            <div style={{ border: '1px solid #c66', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              Calendar error: {payload.error}
            </div>
          ) : null}

          <section>
            <h2>Next calendar anchors</h2>
            {events.length === 0 ? <p>No upcoming events in the next 7 days.</p> : null}
            <div style={{ display: 'grid', gap: 10 }}>
              {events.map((event) => (
                <article key={event.id} style={{ border: '1px solid #ccc', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <strong>{event.title}</strong>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{event.source}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>{displayTime(event.start, event.isAllDay)}</div>
                  {event.location ? <div style={{ marginTop: 4, opacity: 0.7 }}>{event.location}</div> : null}
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
                    {event.status} · {event.transparency} · {event.attendance ?? 'no RSVP status'}
                  </div>
                  {event.htmlLink ? (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-block', marginTop: 8 }}
                    >
                      Open in Google Calendar
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
