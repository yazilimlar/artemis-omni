"use client";

import { getSampleOpportunities } from "@/lib/civicbid/signalForgeData";
import {
  scoreQueue,
  getTierColor,
  getUrgencyColor,
  getReadinessColor,
} from "@/lib/civicbid/signalForgeScoring";

const SCORING_COMPONENTS = [
  { label: "Due-date urgency", weight: "30%", description: "How soon the opportunity closes" },
  { label: "Document availability", weight: "25%", description: "Scope, method, and deadline clarity" },
  { label: "Source confidence", weight: "20%", description: "Trust level of the originating feed" },
  { label: "Construction fit", weight: "15%", description: "Alignment with construction/engineering categories" },
  { label: "Compliance clarity", weight: "10%", description: "MWBE, prevailing wage, and other requirements visibility" },
];

export default function BidReadinessQueue() {
  const sampleData = getSampleOpportunities();
  const queue = scoreQueue(sampleData);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-900/30 bg-amber-950/15 px-5 py-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
          Scoring formula
        </h4>
        <div className="grid gap-2 sm:grid-cols-5">
          {SCORING_COMPONENTS.map((comp) => (
            <div key={comp.label} className="rounded-lg border border-amber-900/20 bg-amber-950/20 px-3 py-2">
              <p className="text-sm font-bold text-amber-200">{comp.weight}</p>
              <p className="text-[11px] font-medium text-amber-300/90">{comp.label}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-amber-400/70">
                {comp.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-amber-400/60">
          Composite = urgency × 0.30 + documentation × 0.25 + source confidence × 0.20 + construction fit × 0.15 + compliance clarity × 0.10
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
          <p className="text-sm text-slate-400">No opportunities scored yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {queue.map((score) => (
            <div
              key={score.opportunityId}
              className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-600"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold ${getTierColor(score.tier)}`}
                  >
                    Tier {score.tier}
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

              <div className="mt-2 flex items-center gap-2 border-t border-slate-800/40 pt-2">
                <span className="text-[10px] text-slate-500">
                  Confidence: {score.confidenceScore}/100
                </span>
                <span className="text-[10px] italic text-slate-600">
                  {score.rationale[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-600">
        Scores are based on sample data and the formula above. Tier A ≥ 75, Tier B ≥ 55, Tier C &lt; 55.
        Not a substitute for independent bid review.
      </p>
    </div>
  );
}
