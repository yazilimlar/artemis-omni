'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface ImportResult {
  ok?: boolean;
  importId?: string;
  sourceSha256?: string;
  recordCount?: number;
  importedAt?: string;
  epistemic?: string;
  error?: string;
}

interface NormalizeResult {
  ok?: boolean;
  importId?: string;
  segmentCount?: number;
  counts?: Record<string, number>;
  epistemic?: string;
  error?: string;
}

interface ImportsPayload {
  ok?: boolean;
  imports?: Array<{ id: string; source_filename: string | null; record_count: number; imported_at: string }>;
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

export default function TimelineImportPage() {
  const [status, setStatus] = useState('Select a Google Timeline JSON export.');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [normalization, setNormalization] = useState<NormalizeResult | null>(null);
  const [busy, setBusy] = useState(false);

  const normalizeImport = useCallback(async (importId: string) => {
    setStatus('Normalizing provider-reported Timeline into DayOS derived segments…');
    const response = await fetch('/api/dayos/timeline/normalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ importId }),
    });
    const payload = await response.json() as NormalizeResult;
    setNormalization(payload);
    setStatus(payload.ok ? 'Timeline persisted and normalized.' : 'Timeline persisted, but normalization failed.');
    return payload;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch('/api/dayos/timeline/imports', { cache: 'no-store' });
        const payload = await response.json() as ImportsPayload;
        const latest = payload.imports?.[0];
        if (!cancelled && latest) {
          setResult({ ok: true, importId: latest.id, recordCount: latest.record_count, importedAt: latest.imported_at, epistemic: 'REPORTED' });
          await normalizeImport(latest.id);
        }
      } catch {
        // The explicit file-import path remains available even if latest-import recovery fails.
      }
    })();
    return () => { cancelled = true; };
  }, [normalizeImport]);

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setResult(null);
    setNormalization(null);
    try {
      setStatus(`Reading ${file.name}…`);
      const rawPayload = JSON.parse(await file.text()) as unknown;
      const recordCount = countTimelineRecords(rawPayload);
      setStatus(`Detected ${recordCount} Timeline records. Persisting as REPORTED evidence…`);

      const response = await fetch('/api/dayos/timeline/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceFilename: file.name, rawPayload, recordCount }),
      });
      const payload = (await response.json()) as ImportResult;
      setResult(payload);
      if (payload.ok && payload.importId) {
        await normalizeImport(payload.importId);
      } else {
        setStatus('Timeline import failed.');
      }
    } catch (error) {
      setStatus('The selected file could not be imported.');
      setResult({ error: error instanceof Error ? error.message : 'Unknown import error' });
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '48px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 12, opacity: 0.65 }}>Artemis DayOS · Phase 3 Acceptance</p>
      <h1>Google Timeline Persistence + Normalization</h1>
      <p style={{ lineHeight: 1.6, opacity: 0.78 }}>
        Timeline exports are stored as provider-reported historical evidence. Google semantic visits and activities are then normalized into DayOS derived segments marked INFERRED; normalization never promotes them to observed truth.
      </p>

      <section style={{ border: '1px solid #bbb', borderRadius: 12, padding: 20, marginTop: 24 }}>
        <input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => void importFile(event)} />
        <p style={{ marginTop: 16 }}>{status}</p>
        {result ? (
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: 'rgba(127,127,127,0.08)', padding: 14, borderRadius: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}
        {normalization ? (
          <>
            <h2 style={{ marginTop: 22, fontSize: 18 }}>Normalized segments</h2>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: 'rgba(127,127,127,0.08)', padding: 14, borderRadius: 8 }}>
              {JSON.stringify(normalization, null, 2)}
            </pre>
          </>
        ) : null}
      </section>

      <p style={{ marginTop: 24 }}><a href="/dayos-next/flight-deck">Return to Flight Deck</a></p>
    </main>
  );
}
