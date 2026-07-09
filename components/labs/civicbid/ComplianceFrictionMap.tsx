"use client";

import { frictionFlags } from "@/lib/civicbid/signalForgeData";
import { getSourceById, type FrictionSeverity } from "@/lib/civicbid/sourceRegistry";

const SEVERITY_ORDER: Record<FrictionSeverity, number> = { high: 0, medium: 1, low: 2 };

const SEVERITY_CARD: Record<FrictionSeverity, string> = {
  high: "border-rose-500/30 bg-rose-950/10",
  medium: "border-amber-500/30 bg-amber-950/10",
  low: "border-emerald-500/30 bg-emerald-950/10",
};

const SEVERITY_DOT: Record<FrictionSeverity, string> = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

export default function ComplianceFrictionMap() {
  const sorted = [...frictionFlags].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  const counts = frictionFlags.reduce(
    (acc, flag) => {
      acc[flag.severity] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 } as Record<FrictionSeverity, number>,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((flag) => (
          <div
            key={flag.sourceId}
            className={`rounded-xl border p-4 transition-all hover:brightness-110 ${SEVERITY_CARD[flag.severity]}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${SEVERITY_DOT[flag.severity]}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {flag.severity} friction
              </span>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-slate-200">
              {getSourceById(flag.sourceId)?.name ?? flag.sourceId}
            </h4>
            <p className="mb-1 text-xs font-medium text-slate-300">{flag.label}</p>
            <p className="text-xs leading-relaxed text-slate-500">{flag.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Friction summary — {frictionFlags.length} registered sources
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-300">{counts.low}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              Low friction
              <br />
              (public API)
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-300">{counts.medium}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              Medium friction
              <br />
              (official deep link)
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-300">{counts.high}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              High friction
              <br />
              (login / commercial)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
