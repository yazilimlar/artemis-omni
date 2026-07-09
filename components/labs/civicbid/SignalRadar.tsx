"use client";

import { getSampleOpportunities, sourceHealthSnapshot } from "@/lib/civicbid/signalForgeData";
import { getSourceById } from "@/lib/civicbid/sourceRegistry";
import { scoreOpportunity } from "@/lib/civicbid/signalForgeScoring";

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

const FRICTION_TAGS: Record<string, string> = {
  "nyc-open-data-current-solicitations": "Public API — automatable",
  "nyc-open-data-city-record": "Public API — automatable",
  "checkbook-nyc-contracts": "XML POST — needs integration",
  "passport-public": "Manual deep link",
  "passport-procurement-navigator": "Manual deep link",
  "nyscr": "Email alerts + manual",
  "mta-current-opportunities": "Manual deep link",
  "mta-cd-current-opportunities": "Manual deep link",
  "panynj-construction": "Manual deep link",
  "panynj-bonfire-open": "Login required",
  "ddc-construction-contracts": "Manual deep link",
  "dasny-rfps-bids": "Manual deep link",
  "bidexpress": "Login required",
};

export default function SignalRadar() {
  const opportunities = getSampleOpportunities();
  const scored = opportunities.map((opp) => ({
    opp,
    score: scoreOpportunity(opp),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-950/10 px-4 py-3">
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          ● Sample mode
        </span>
        <span className="text-xs text-slate-400">
          {opportunities.length} signals · Representative sample data
        </span>
        <span className="ml-auto text-[10px] text-slate-500">
          Not a certified live bid feed
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {scored.map(({ opp, score }) => (
          <div
            key={opp.id}
            className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-600"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold leading-snug text-slate-200">
                  {opp.title}
                </h4>
                <p className="mt-0.5 text-xs text-slate-400">{opp.agency}</p>
              </div>
              <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                {opp.jurisdiction}
              </span>
            </div>

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
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-800/50 pt-3">
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                  score.compositeScore >= 75
                    ? "bg-emerald-500/10 text-emerald-300"
                    : score.compositeScore >= 55
                      ? "bg-amber-500/10 text-amber-300"
                      : "bg-slate-500/10 text-slate-300"
                }`}
              >
                Score: {score.compositeScore}/100
              </span>
              <span className="text-[10px] text-slate-500">
                Confidence: {score.confidenceScore}/100
              </span>
              <span className="text-[10px] italic text-slate-600">
                {score.rationale[0]}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {opp.sourceUrl ? (
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300"
                >
                  Official source →
                </a>
              ) : null}
              <span className="ml-auto text-[9px] uppercase tracking-wider text-amber-600/70">
                {FRICTION_TAGS[opp.id.replace(/^SF-SAMPLE-\d+\s*/, "").toLowerCase()] ||
                  "Manual deep link"}
              </span>
            </div>

            <div className="mt-2 rounded bg-slate-900/60 px-2 py-1.5">
              <p className="text-[10px] leading-snug text-slate-500">
                <span className="font-medium text-slate-400">Why this score: </span>
                {score.rationale.slice(0, 2).join("; ")}
                {score.rationale.length > 2 ? `; +${score.rationale.length - 2} more factors` : ""}
              </p>
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
