"use client";

import { useEffect, useState } from "react";
import type { CivicBidOpportunity } from "@/lib/civicbid/normalizeOpportunity";
import { getSourceById } from "@/lib/civicbid/sourceRegistry";
import { sourceHealthSnapshot } from "@/lib/civicbid/signalForgeData";

interface RadarResponse {
  sourceName: string;
  count: number;
  fromLive: boolean;
  retrievedAt: string;
  warning?: string;
  data: CivicBidOpportunity[];
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const HEALTH_STYLES: Record<string, string> = {
  live: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  reachable: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  manual: "bg-slate-500/10 text-slate-300 border-slate-500/30",
};

export default function SignalRadar() {
  const [response, setResponse] = useState<RadarResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/civicbid/signal-forge?view=opportunities")
      .then((res) => res.json())
      .then((json: RadarResponse) => setResponse(json))
      .catch(() => setResponse(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        <p className="mt-3 text-sm text-slate-400">Scanning public bid signals…</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/10 p-6">
        <p className="text-sm text-rose-300">
          Signal Radar could not reach the API route. Reload the page to retry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            response.fromLive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          {response.fromLive ? "● Live public data" : "● Sample mode"}
        </span>
        <span className="text-xs text-slate-400">
          {response.count} signals · {response.sourceName}
        </span>
        <span className="ml-auto text-[10px] text-slate-500">
          Retrieved {new Date(response.retrievedAt).toLocaleTimeString()}
        </span>
      </div>

      {response.warning ? (
        <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-4 py-3">
          <p className="text-xs text-amber-300/80">⚠️ {response.warning}</p>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {response.data.map((opp) => (
          <div
            key={opp.id}
            className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-600"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold leading-snug text-slate-200">{opp.title}</h4>
              <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                {opp.jurisdiction}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{opp.agency}</p>
            {opp.description ? (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {opp.description}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
              <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                Due: <span className="text-slate-300">{formatDate(opp.dueDate)}</span>
              </span>
              {opp.category ? (
                <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                  {opp.category}
                </span>
              ) : null}
              {opp.procurementMethod ? (
                <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                  {opp.procurementMethod}
                </span>
              ) : null}
              {opp.sourceUrl ? (
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-cyan-400 hover:text-cyan-300"
                >
                  Official source →
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Pollable source health
        </h4>
        <div className="grid gap-2 sm:grid-cols-3">
          {sourceHealthSnapshot.map((health) => {
            const source = getSourceById(health.sourceId);
            return (
              <div
                key={health.sourceId}
                className={`rounded-lg border px-3 py-2 ${HEALTH_STYLES[health.status]}`}
              >
                <p className="text-xs font-medium">{source?.name ?? health.sourceId}</p>
                <p className="mt-0.5 text-[10px] opacity-80">{health.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
