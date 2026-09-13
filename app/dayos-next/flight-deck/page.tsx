'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Tab = 'command' | 'timeline' | 'map' | 'photos' | 'evidence' | 'narrative' | 'money';
type AnchorClass = 'HARD' | 'PROTECTED' | 'ELASTIC' | 'OPTIONAL';

interface CalendarEvent {
  id: string;
  operatingEventId?: string;
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
  epistemic?: 'OBSERVED' | 'REPORTED' | 'INFERRED';
  temporalRole?: 'ACTUAL' | 'FORECAST' | 'SCHEDULED' | 'DERIVED';
  anchorClass?: AnchorClass;
  confidence?: number;
  evidenceRefs?: Array<{ id: string; kind: string; source: string; confidence: number }>;
}

interface CalendarPayload {
  connected?: boolean;
  fetchedAt?: string;
  events?: CalendarEvent[];
  error?: string;
}

interface TimelineImportState {
  fileName: string;
  recordCount: number;
  importedAt: string;
  status: 'READY' | 'ERROR';
  message: string;
}

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'command', label: 'Command' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'map', label: 'Map' },
  { id: 'photos', label: 'Photos' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'money', label: 'Money' },
];

const colors = {
  bg: '#071019',
  panel: '#0c1721',
  card: '#111f2b',
  border: '#2c4255',
  text: '#eef6ff',
  muted: '#8fa4b8',
  cyan: '#53c7ff',
  green: '#49dc9a',
  amber: '#ffbd55',
  purple: '#b79cff',
};

function displayTime(value: string | null, allDay = false) {
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

function eventTime(event: CalendarEvent) {
  if (!event.start) return Number.POSITIVE_INFINITY;
  const value = event.isAllDay ? `${event.start}T00:00:00` : event.start;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function mapsUrl(location: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
}

function countTimelineRecords(value: unknown): number {
  if (!value || typeof value !== 'object') return 0;
  const object = value as Record<string, unknown>;
  for (const key of ['semanticSegments', 'timelineObjects', 'locations']) {
    if (Array.isArray(object[key])) return object[key].length;
  }
  if (Array.isArray(value)) return value.length;
  return 0;
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section
      style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        borderRadius: 18,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function StatusPill({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'green' | 'amber' | 'purple' }) {
  const map = { cyan: colors.cyan, green: colors.green, amber: colors.amber, purple: colors.purple };
  return (
    <span
      style={{
        border: `1px solid ${map[tone]}`,
        color: map[tone],
        borderRadius: 999,
        padding: '3px 8px',
        fontSize: 11,
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </span>
  );
}

export default function FlightDeckPage() {
  const [payload, setPayload] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('command');
  const [timelineImport, setTimelineImport] = useState<TimelineImportState | null>(null);
  const [fieldNote, setFieldNote] = useState('');

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

  async function importTimeline(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const recordCount = countTimelineRecords(parsed);
      setTimelineImport({
        fileName: file.name,
        recordCount,
        importedAt: new Date().toISOString(),
        status: 'READY',
        message: recordCount > 0 ? 'Imported locally for this browser session.' : 'JSON loaded, but no known Timeline record array was detected.',
      });
    } catch {
      setTimelineImport({
        fileName: file.name,
        recordCount: 0,
        importedAt: new Date().toISOString(),
        status: 'ERROR',
        message: 'The selected file could not be parsed as JSON.',
      });
    }
  }

  const events = useMemo(() => [...(payload?.events ?? [])].sort((a, b) => eventTime(a) - eventTime(b)), [payload?.events]);
  const nowMs = Date.now();
  const activeEvent = events.find((event) => {
    if (!event.start || !event.end || event.isAllDay) return false;
    return new Date(event.start).getTime() <= nowMs && new Date(event.end).getTime() >= nowMs;
  });
  const nextEvent = events.find((event) => eventTime(event) > nowMs) ?? events[0];
  const hardAnchor = events.find((event) => (event.anchorClass ?? (event.transparency === 'transparent' ? 'OPTIONAL' : 'HARD')) === 'HARD' && eventTime(event) > nowMs);
  const mapTarget = hardAnchor?.location ? hardAnchor : events.find((event) => event.location);

  const narrative = useMemo(() => {
    const parts: string[] = [];
    if (events.length) {
      parts.push(`Calendar reports ${events.length} upcoming operational anchor${events.length === 1 ? '' : 's'} in the next seven days.`);
      const first = events[0];
      parts.push(`The next listed commitment is ${first.title} at ${displayTime(first.start, first.isAllDay)}.`);
    }
    if (timelineImport?.status === 'READY') parts.push(`A Timeline export is loaded with ${timelineImport.recordCount} detected records and remains reported evidence until reconciled.`);
    if (fieldNote.trim()) parts.push(`Field note: ${fieldNote.trim()}`);
    if (!parts.length) parts.push('No narrative evidence is loaded yet.');
    return parts.join(' ');
  }, [events, fieldNote, timelineImport]);

  const connectorRows = [
    ['Google Calendar', payload?.connected ? 'RUNNABLE' : 'CONNECT', 'READ · LIVE'],
    ['Google Maps', 'RUNNABLE', 'DEEPLINK · ROUTE'],
    ['Google Timeline', timelineImport?.status === 'READY' ? 'LOADED' : 'IMPORT', 'HISTORY · REPORTED'],
    ['Google Photos', 'NEXT', 'PICKER · USER SELECTED'],
    ['Voice / Text', fieldNote ? 'ACTIVE' : 'READY', 'USER INPUT'],
    ['Money Points', 'CONTRACT', 'ENGINE DEFERRED'],
  ];

  return (
    <main style={{ minHeight: '100vh', background: colors.bg, color: colors.text, padding: '24px clamp(14px, 2vw, 30px)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1540, margin: '0 auto' }}>
        <Panel style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', color: colors.muted }}>ARTEMIS DAYOS · MULTIMODAL OPERATING SURFACE</div>
            <h1 style={{ margin: '8px 0 4px', fontSize: 30 }}>Daily Operational Command Surface</h1>
            <div style={{ color: colors.muted, fontSize: 13 }}>Ideal · Expected · Actual · Evidence · Economic</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusPill tone="green">CALENDAR LIVE</StatusPill>
            <StatusPill>{payload?.fetchedAt ? `SYNC ${new Date(payload.fetchedAt).toLocaleTimeString()}` : 'SYNCING'}</StatusPill>
            <button onClick={() => void load()} style={{ padding: '8px 12px', borderRadius: 9, border: `1px solid ${colors.border}`, background: colors.card, color: colors.text }}>Reload</button>
          </div>
        </Panel>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)', gap: 16 }}>
          <aside>
            <Panel>
              <div style={{ fontSize: 11, letterSpacing: '0.14em', color: colors.muted, marginBottom: 14 }}>CONNECTED APPS HUB</div>
              <div style={{ display: 'grid', gap: 9 }}>
                {connectorRows.map(([name, status, detail]) => (
                  <div key={name} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, fontWeight: 700 }}><span>{name}</span><span style={{ color: colors.cyan, fontSize: 10 }}>{status}</span></div>
                    <div style={{ marginTop: 5, color: colors.muted, fontSize: 11 }}>{detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, borderRadius: 12, border: `1px solid ${colors.purple}`, background: '#241f3d' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>EVIDENCE RULE</div>
                <div style={{ marginTop: 6, color: colors.muted, fontSize: 11, lineHeight: 1.5 }}>AI proposes. Evidence controls authority. Imported history and provider data remain distinguishable from direct observation.</div>
              </div>
            </Panel>
          </aside>

          <section style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '9px 13px',
                    borderRadius: 10,
                    border: `1px solid ${tab === item.id ? colors.cyan : colors.border}`,
                    background: tab === item.id ? '#12314a' : colors.card,
                    color: colors.text,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {!loading && !payload?.connected ? (
              <Panel>
                <h2 style={{ marginTop: 0 }}>Google Calendar not connected</h2>
                <p style={{ color: colors.muted }}>{payload?.error ?? 'Authorize read-only calendar access.'}</p>
                <a href="/api/auth/google" style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 10, background: colors.cyan, color: '#071019', textDecoration: 'none', fontWeight: 700 }}>Authorize Google Calendar</a>
              </Panel>
            ) : null}

            {loading ? <Panel><p>Loading operational anchors…</p></Panel> : null}

            {!loading && payload?.connected && tab === 'command' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                  {[
                    ['NOW', activeEvent?.title ?? 'No timed event active', activeEvent ? displayTime(activeEvent.start) : 'Awaiting observed activity', colors.cyan],
                    ['NEXT', nextEvent?.title ?? 'No upcoming anchor', nextEvent ? displayTime(nextEvent.start, nextEvent.isAllDay) : 'Open horizon', colors.green],
                    ['HARD ANCHOR', hardAnchor?.title ?? 'No hard anchor found', hardAnchor ? displayTime(hardAnchor.start, hardAnchor.isAllDay) : 'No fixed commitment', colors.amber],
                  ].map(([label, title, detail, tone]) => (
                    <div key={String(label)} style={{ background: colors.card, border: `1px solid ${tone}`, borderRadius: 16, padding: 16, minHeight: 130 }}>
                      <div style={{ color: colors.muted, fontSize: 11, letterSpacing: '0.12em' }}>{label}</div>
                      <div style={{ marginTop: 14, fontWeight: 800, fontSize: 18 }}>{title}</div>
                      <div style={{ marginTop: 8, color: colors.muted, fontSize: 12 }}>{detail}</div>
                    </div>
                  ))}
                </div>

                <Panel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div><div style={{ fontSize: 11, color: colors.muted, letterSpacing: '0.12em' }}>ENRICHED OPERATIONAL TIMELINE</div><h2 style={{ margin: '7px 0 0' }}>Calendar anchors + evidence</h2></div>
                    <div style={{ color: colors.muted, fontSize: 12 }}>{events.length} live anchor{events.length === 1 ? '' : 's'}</div>
                  </div>
                  <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                    {events.map((event) => (
                      <article key={event.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                          <strong>{event.title}</strong>
                          <StatusPill tone={event.anchorClass === 'HARD' ? 'amber' : 'cyan'}>{event.anchorClass ?? 'SCHEDULED'}</StatusPill>
                        </div>
                        <div style={{ marginTop: 6, color: colors.muted, fontSize: 12 }}>{displayTime(event.start, event.isAllDay)} · {event.epistemic ?? 'REPORTED'} · {event.source}</div>
                        {event.location ? (
                          <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12 }}>{event.location}</span>
                            <a href={mapsUrl(event.location)} target="_blank" rel="noreferrer" style={{ color: colors.cyan, fontSize: 12 }}>Open route in Google Maps ↗</a>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            ) : null}

            {!loading && payload?.connected && tab === 'timeline' ? (
              <Panel>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>GOOGLE MAPS TIMELINE · HISTORY INGESTION</div>
                <h2>Import device-exported Timeline evidence</h2>
                <p style={{ color: colors.muted, lineHeight: 1.6 }}>Timeline is treated as historical reported evidence. Import stays in this browser session for now; DayOS does not silently promote imported locations to observed truth.</p>
                <input type="file" accept="application/json,.json" onChange={(event) => void importTimeline(event)} />
                {timelineImport ? (
                  <div style={{ marginTop: 16, background: colors.card, border: `1px solid ${timelineImport.status === 'READY' ? colors.green : colors.amber}`, borderRadius: 12, padding: 14 }}>
                    <strong>{timelineImport.fileName}</strong>
                    <div style={{ marginTop: 6, color: colors.muted }}>{timelineImport.recordCount} detected records · {timelineImport.message}</div>
                  </div>
                ) : null}
              </Panel>
            ) : null}

            {!loading && payload?.connected && tab === 'map' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <Panel>
                  <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>ROUTE / TRANSPORT MONITOR</div>
                  <h2>{mapTarget ? mapTarget.title : 'No located event available'}</h2>
                  <p style={{ color: colors.muted }}>{mapTarget?.location ?? 'Add a location to a Calendar event to activate routing.'}</p>
                  {mapTarget?.location ? <a href={mapsUrl(mapTarget.location)} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 6, color: colors.cyan }}>Open directions in Google Maps ↗</a> : null}
                </Panel>
                <Panel>
                  <strong>Next spatial layer</strong>
                  <p style={{ color: colors.muted, lineHeight: 1.6 }}>DayOS will add deterministic prep, departure, route, ETA and slack around the next hard anchor. Google Maps remains the mature navigation surface; DayOS orchestrates the decision layer around it.</p>
                </Panel>
              </div>
            ) : null}

            {!loading && payload?.connected && tab === 'photos' ? (
              <Panel>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>GOOGLE PHOTOS · SELECTED MEDIA EVIDENCE</div>
                <h2>Picker connector is the next media gate</h2>
                <p style={{ color: colors.muted, lineHeight: 1.65 }}>DayOS will request only user-selected photos/videos through Google Photos Picker, then attach timestamp/media metadata to candidate operating events. Broad whole-library read is intentionally not assumed.</p>
                <div style={{ background: colors.card, border: `1px solid ${colors.purple}`, borderRadius: 12, padding: 14 }}>
                  <div><strong>Status:</strong> connector contract ready for implementation</div>
                  <div style={{ marginTop: 6, color: colors.muted, fontSize: 12 }}>Required scope: photospicker.mediaitems.readonly · user selection remains explicit</div>
                </div>
              </Panel>
            ) : null}

            {!loading && payload?.connected && tab === 'evidence' ? (
              <Panel>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>EVIDENCE LEDGER · SESSION VIEW</div>
                <h2>{events.length + (timelineImport ? 1 : 0) + (fieldNote ? 1 : 0)} evidence groups active</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ background: colors.card, borderRadius: 12, padding: 13 }}><strong>Google Calendar</strong><div style={{ color: colors.muted, marginTop: 5 }}>{events.length} REPORTED scheduled anchors · confidence 1.00</div></div>
                  <div style={{ background: colors.card, borderRadius: 12, padding: 13 }}><strong>Timeline import</strong><div style={{ color: colors.muted, marginTop: 5 }}>{timelineImport ? `${timelineImport.recordCount} records · REPORTED` : 'Not loaded'}</div></div>
                  <div style={{ background: colors.card, borderRadius: 12, padding: 13 }}><strong>User field note</strong><div style={{ color: colors.muted, marginTop: 5 }}>{fieldNote ? 'REPORTED · available to narrative' : 'No note entered'}</div></div>
                </div>
              </Panel>
            ) : null}

            {!loading && payload?.connected && tab === 'narrative' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <Panel>
                  <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>DAILY NARRATIVE · DRAFT LAYER</div>
                  <h2>Evidence-backed day narration</h2>
                  <textarea value={fieldNote} onChange={(event) => setFieldNote(event.target.value)} placeholder="Add a correction, coordinate, field observation, voice transcription, or note…" rows={5} style={{ width: '100%', boxSizing: 'border-box', background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, padding: 12, resize: 'vertical' }} />
                </Panel>
                <Panel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><strong>Auto-narrative preview</strong><StatusPill tone="purple">DRAFT</StatusPill></div>
                  <p style={{ color: '#d9e7f4', lineHeight: 1.8 }}>{narrative}</p>
                  <div style={{ color: colors.muted, fontSize: 11 }}>This preview is deterministic and evidence-aware; AI synthesis comes after location/media evidence connectors are live.</div>
                </Panel>
              </div>
            ) : null}

            {!loading && payload?.connected && tab === 'money' ? (
              <Panel>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', color: colors.muted }}>MONEY POINTS</div>
                <h2>Economic contract frozen · activation follows actual activity evidence</h2>
                <p style={{ color: colors.muted, lineHeight: 1.65 }}>Earned, billed, collected, spent and reimbursable remain separate lifecycle concepts. The next activation will attach user-confirmed billable time to a real operating event after spatial evidence is working.</p>
                <StatusPill tone="amber">ENGINE DEFERRED BY DESIGN</StatusPill>
              </Panel>
            ) : null}
          </section>
        </div>

        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', color: colors.muted, fontSize: 11 }}>
          <span>Calendar → Map → Timeline → Photos → Evidence → Narrative → Money</span>
          <button onClick={() => void disconnect()} style={{ background: 'transparent', border: 0, color: colors.muted, cursor: 'pointer' }}>Disconnect Google Calendar</button>
        </div>
      </div>
    </main>
  );
}
