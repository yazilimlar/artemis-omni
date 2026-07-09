"use client";

import { useEffect, useState } from "react";
import {
  getReadinessColor,
  getTierColor,
  getUrgencyColor,
  type SignalForgeScore,
} from "@/lib/civicbid/signalForgeScoring";

interface QueueResponse {
  sourceName: string;
  count: number;
  fromLive: boolean;
  retrievedAt: string;
  warning?: string;
  data: SignalForgeScore[];
}

export default function BidReadinessQueue() {
  const [response, setResponse] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/civicbid/signal-forge?view=queue")
      .then((res) => res.json())
      .then((json: QueueResponse) => setResponse(json))
      .catch(() => setResponse(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        <p className="mt-3 text-sm text-slate-400">Scoring bid readiness…</p>
      </div>
    );
  }

  const scores = response?.data ?? [];

  return (
    <div className="space-y-3">
      {response?.warning ? (
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-4 py-3">
          <p className="text-xs text-amber-300/80">⚠️ {response.warning}</p>
        </div>
      ) : null}

      <p className="text-[11px] text-slate-500">
        Composite = 40% urgency (time to close) + 35% readiness (scope clarity) + 25% source
        confidence. Tier A ≥ 75 · Tier B ≥ 55.
      </p>

      <div className="space-y-2">
        {scores.map((score) => (
          <div
            key={score.opportunityId}
            className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-600"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span
                  className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold ${getTierColor(score.tier)}`}
                >
                  {score.tier}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-slate-200">{score.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{score.agency}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {score.rationale.slice(0, 3).map((note) => (
                      <span key={note} className="text-[10px] text-slate-500">
                        • {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5 text-right">
                <div>
                  <p className={`text-lg font-bold ${getUrgencyColor(score.urgencyScore)}`}>
                    {score.urgencyScore}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">Urgency</p>
                </div>
                <div>
                  <p className={`text-lg font-bold ${getReadinessColor(score.readinessScore)}`}>
                    {score.readinessScore}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">Ready</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-cyan-300">{score.compositeScore}</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">Composite</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
