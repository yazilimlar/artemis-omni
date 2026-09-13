'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import './flight-deck.css';

type Tab = 'command' | 'timeline' | 'map' | 'photos' | 'evidence' | 'narrative' | 'money';
type Density = 'glance' | 'operate' | 'investigate';
type AnchorClass = 'HARD' | 'PROTECTED' | 'ELASTIC' | 'OPTIONAL';
type PillTone = 'live' | 'confirmed' | 'attention' | 'risk' | 'gold' | 'neutral';

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

const allTabs: Array<{ id: Tab; label: string }> = [
  { id: 'command', label: 'Command' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'map', label: 'Map' },
  { id: 'photos', label: 'Photos' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'money', label: 'Money' },
];

const densityTabs: Record<Density, Tab[]> = {
  glance: [],
  operate: ['command', 'timeline', 'map', 'photos', 'narrative'],
  investigate: ['command', 'timeline', 'map', 'photos', 'evidence', 'narrative', 'money'],
};

const densityLabels: Array<{ id: Density; label: string }> = [
  { id: 'glance', label: 'Glance' },
  { id: 'operate', label: 'Operate' },
  { id: 'investigate', label: 'Investigate' },
];

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

function anchorTone(anchorClass?: AnchorClass): PillTone {
  if (anchorClass === 'HARD') return 'gold';
  if (anchorClass === 'PROTECTED') return 'attention';
  return 'neutral';
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section className="fd-panel" style={style}>
      {children}
    </section>
  );
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: PillTone }) {
  const toneClass = tone === 'neutral' ? '' : ` fd-pill--${tone}`;
  return <span className={`fd-pill${toneClass}`}>{children}</span>;
}

export default function FlightDeckPage() {
  const [payload, setPayload] = useState<CalendarPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('command');
  const [density, setDensity] = useState<Density>('operate');
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

  function changeDensity(next: Density) {
    setDensity(next);
    if (next !== 'glance' && !densityTabs[next].includes(tab)) setTab('command');
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

  const visibleTabs = allTabs.filter((item) => densityTabs[density].includes(item.id));
  const connected = !loading && payload?.connected;

  const anchorTriad = (
    <div className="fd-triad">
      {[
        { key: 'now', label: 'NOW', title: activeEvent?.title ?? 'No timed event active', detail: activeEvent ? displayTime(activeEvent.start) : 'Awaiting observed activity' },
        { key: 'next', label: 'NEXT', title: nextEvent?.title ?? 'No upcoming anchor', detail: nextEvent ? displayTime(nextEvent.start, nextEvent.isAllDay) : 'Open horizon' },
        { key: 'hard', label: 'HARD ANCHOR', title: hardAnchor?.title ?? 'No hard anchor found', detail: hardAnchor ? displayTime(hardAnchor.start, hardAnchor.isAllDay) : 'No fixed commitment' },
      ].map((card) => (
        <div key={card.key} className={`fd-anchor-card fd-anchor-card--${card.key}`}>
          <div className="fd-label">{card.label}</div>
          <div style={{ marginTop: 14, fontWeight: 800, fontSize: 18 }}>{card.title}</div>
          <div className="fd-muted" style={{ marginTop: 8, fontSize: 12 }}>{card.detail}</div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="dayos">
      <div className="fd-shell">
        <Panel style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="fd-label">Artemis DayOS · Multimodal Operating Surface</div>
            <h1>Daily Operational Command Surface</h1>
            <div className="fd-muted" style={{ fontSize: 13 }}>Ideal · Expected · Actual · Evidence · Economic</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="fd-density" role="group" aria-label="Information density">
              {densityLabels.map((item) => (
                <button key={item.id} aria-pressed={density === item.id} onClick={() => changeDensity(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            <Pill tone={payload?.connected ? 'confirmed' : 'attention'}>{payload?.connected ? 'CALENDAR LIVE' : 'CALENDAR OFFLINE'}</Pill>
            <Pill tone="live">{payload?.fetchedAt ? `SYNC ${new Date(payload.fetchedAt).toLocaleTimeString()}` : 'SYNCING'}</Pill>
            <button className="fd-btn" onClick={() => void load()}>Reload</button>
          </div>
        </Panel>

        <div className={`fd-layout${density === 'investigate' ? ' fd-layout--investigate' : ''}`}>
          {density === 'investigate' ? (
            <aside>
              <Panel>
                <div className="fd-label" style={{ marginBottom: 14 }}>Connected Apps Hub</div>
                <div style={{ display: 'grid', gap: 9 }}>
                  {connectorRows.map(([name, status, detail]) => (
                    <div key={name} className="fd-card" style={{ padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13, fontWeight: 700 }}>
                        <span>{name}</span>
                        <span style={{ color: 'var(--dayos-navy)', fontSize: 10 }}>{status}</span>
                      </div>
                      <div className="fd-muted" style={{ marginTop: 5, fontSize: 11 }}>{detail}</div>
                    </div>
                  ))}
                </div>
                <div className="fd-card" style={{ marginTop: 14, borderColor: 'var(--dayos-gold)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>EVIDENCE RULE</div>
                  <div className="fd-muted" style={{ marginTop: 6, fontSize: 11, lineHeight: 1.5 }}>
                    AI proposes. Evidence controls authority. Imported history and provider data remain distinguishable from direct observation.
                  </div>
                </div>
              </Panel>
            </aside>
          ) : null}

          <section style={{ minWidth: 0 }}>
            {density !== 'glance' ? (
              <div className="fd-tabbar">
                {visibleTabs.map((item) => (
                  <button key={item.id} className={`fd-tab${tab === item.id ? ' fd-tab--active' : ''}`} onClick={() => setTab(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}

            {!loading && !payload?.connected ? (
              <Panel>
                <h2 style={{ marginTop: 0 }}>Google Calendar not connected</h2>
                <p className="fd-muted">{payload?.error ?? 'Authorize read-only calendar access.'}</p>
                <a href="/api/auth/google" className="fd-btn fd-btn--primary">Authorize Google Calendar</a>
              </Panel>
            ) : null}

            {loading ? <Panel><p>Loading operational anchors…</p></Panel> : null}

            {connected && density === 'glance' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {anchorTriad}
                <Panel>
                  <div className="fd-label">Today, in one line</div>
                  <p style={{ lineHeight: 1.8, marginBottom: 0 }}>{narrative}</p>
                </Panel>
              </div>
            ) : null}

            {connected && density !== 'glance' && tab === 'command' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {anchorTriad}
                <Panel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div className="fd-label">Enriched Operational Timeline</div>
                      <h2 style={{ margin: '7px 0 0' }}>Calendar anchors + evidence</h2>
                    </div>
                    <div className="fd-muted" style={{ fontSize: 12 }}>{events.length} live anchor{events.length === 1 ? '' : 's'}</div>
                  </div>
                  <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                    {events.map((event) => (
                      <article key={event.id} className="fd-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                          <strong>{event.title}</strong>
                          <Pill tone={anchorTone(event.anchorClass)}>{event.anchorClass ?? 'SCHEDULED'}</Pill>
                        </div>
                        <div className="fd-muted" style={{ marginTop: 6, fontSize: 12 }}>
                          {displayTime(event.start, event.isAllDay)} · {event.epistemic ?? 'REPORTED'} · {event.source}
                        </div>
                        {event.location ? (
                          <div style={{ marginTop: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12 }}>{event.location}</span>
                            <a href={mapsUrl(event.location)} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>Open route in Google Maps ↗</a>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            ) : null}

            {connected && density !== 'glance' && tab === 'timeline' ? (
              <Panel>
                <div className="fd-label">Google Maps Timeline · History Ingestion</div>
                <h2>Import device-exported Timeline evidence</h2>
                <p className="fd-muted" style={{ lineHeight: 1.6 }}>
                  Timeline is treated as historical reported evidence. Import stays in this browser session for now; DayOS does not silently promote imported locations to observed truth.
                </p>
                <input type="file" accept="application/json,.json" onChange={(event) => void importTimeline(event)} />
                {timelineImport ? (
                  <div className="fd-card" style={{ marginTop: 16, borderColor: timelineImport.status === 'READY' ? 'var(--dayos-green)' : 'var(--dayos-amber)' }}>
                    <strong>{timelineImport.fileName}</strong>
                    <div className="fd-muted" style={{ marginTop: 6 }}>{timelineImport.recordCount} detected records · {timelineImport.message}</div>
                  </div>
                ) : null}
              </Panel>
            ) : null}

            {connected && density !== 'glance' && tab === 'map' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <Panel>
                  <div className="fd-label">Route / Transport Monitor</div>
                  <h2>{mapTarget ? mapTarget.title : 'No located event available'}</h2>
                  <p className="fd-muted">{mapTarget?.location ?? 'Add a location to a Calendar event to activate routing.'}</p>
                  {mapTarget?.location ? (
                    <a href={mapsUrl(mapTarget.location)} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 6 }}>Open directions in Google Maps ↗</a>
                  ) : null}
                </Panel>
                <Panel>
                  <strong>Next spatial layer</strong>
                  <p className="fd-muted" style={{ lineHeight: 1.6 }}>
                    DayOS will add deterministic prep, departure, route, ETA and slack around the next hard anchor. Google Maps remains the mature navigation surface; DayOS orchestrates the decision layer around it.
                  </p>
                </Panel>
              </div>
            ) : null}

            {connected && density !== 'glance' && tab === 'photos' ? (
              <Panel>
                <div className="fd-label">Google Photos · Selected Media Evidence</div>
                <h2>Picker connector is the next media gate</h2>
                <p className="fd-muted" style={{ lineHeight: 1.65 }}>
                  DayOS will request only user-selected photos/videos through Google Photos Picker, then attach timestamp/media metadata to candidate operating events. Broad whole-library read is intentionally not assumed.
                </p>
                <div className="fd-card" style={{ borderColor: 'var(--dayos-navy)' }}>
                  <div><strong>Status:</strong> connector contract ready for implementation</div>
                  <div className="fd-muted" style={{ marginTop: 6, fontSize: 12 }}>Required scope: photospicker.mediaitems.readonly · user selection remains explicit</div>
                </div>
              </Panel>
            ) : null}

            {connected && density !== 'glance' && tab === 'evidence' ? (
              <Panel>
                <div className="fd-label">Evidence Ledger · Session View</div>
                <h2>{events.length + (timelineImport ? 1 : 0) + (fieldNote ? 1 : 0)} evidence groups active</h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className="fd-card"><strong>Google Calendar</strong><div className="fd-muted" style={{ marginTop: 5 }}>{events.length} REPORTED scheduled anchors · confidence 1.00</div></div>
                  <div className="fd-card"><strong>Timeline import</strong><div className="fd-muted" style={{ marginTop: 5 }}>{timelineImport ? `${timelineImport.recordCount} records · REPORTED` : 'Not loaded'}</div></div>
                  <div className="fd-card"><strong>User field note</strong><div className="fd-muted" style={{ marginTop: 5 }}>{fieldNote ? 'REPORTED · available to narrative' : 'No note entered'}</div></div>
                </div>
              </Panel>
            ) : null}

            {connected && density !== 'glance' && tab === 'narrative' ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <Panel>
                  <div className="fd-label">Daily Narrative · Draft Layer</div>
                  <h2>Evidence-backed day narration</h2>
                  <textarea
                    className="fd-input"
                    value={fieldNote}
                    onChange={(event) => setFieldNote(event.target.value)}
                    placeholder="Add a correction, coordinate, field observation, voice transcription, or note…"
                    rows={5}
                  />
                </Panel>
                <Panel>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <strong>Auto-narrative preview</strong>
                    <Pill tone="live">DRAFT</Pill>
                  </div>
                  <p style={{ lineHeight: 1.8 }}>{narrative}</p>
                  <div className="fd-muted" style={{ fontSize: 11 }}>This preview is deterministic and evidence-aware; AI synthesis comes after location/media evidence connectors are live.</div>
                </Panel>
              </div>
            ) : null}

            {connected && density !== 'glance' && tab === 'money' ? (
              <Panel>
                <div className="fd-label">Money Points</div>
                <h2>Economic contract frozen · activation follows actual activity evidence</h2>
                <p className="fd-muted" style={{ lineHeight: 1.65 }}>
                  Earned, billed, collected, spent and reimbursable remain separate lifecycle concepts. The next activation will attach user-confirmed billable time to a real operating event after spatial evidence is working.
                </p>
                <Pill tone="attention">ENGINE DEFERRED BY DESIGN</Pill>
              </Panel>
            ) : null}
          </section>
        </div>

        <div className="fd-muted" style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
          <span>Calendar → Map → Timeline → Photos → Evidence → Narrative → Money</span>
          <button className="fd-btn--ghost" onClick={() => void disconnect()}>Disconnect Google Calendar</button>
        </div>
      </div>
    </main>
  );
}
