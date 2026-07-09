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

const PURSUIT_CHECKS: { label: string; description: string }[] = [
  { label: "M/WBE", description: "M/WBE participation goals / subcontracting plan required" },
  { label: "PLA", description: "Project labor agreement may apply" },
  { label: "Bonding", description: "Bid bond, performance bond, and/or payment bond required" },
  { label: "Insurance", description: "Minimum insurance coverage requirements" },
  { label: "Pre-bid meeting", description: "Mandatory or recommended pre-bid conference" },
  { label: "Site visit", description: "Site visit scheduled or required" },
  { label: "Addenda", description: "Addenda may be issued during solicitation period" },
  { label: "Q&A deadline", description: "Deadline for written questions / RFIs" },
  { label: "PASSPort submission", description: "Submission via PASSPort portal required" },
  { label: "Prequalification", description: "Vendor prequalification required before bid" },
  { label: "Executive go/no-go", description: "Internal go/no-go gate before bid submission" },
];

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

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Pursuit checklist — human-reviewed
        </h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PURSUIT_CHECKS.map((check) => (
            <div
              key={check.label}
              className="flex items-start gap-2 rounded-lg border border-slate-800/60 bg-slate-900/30 px-3 py-2"
            >
              <span className="mt-0.5 shrink-0 text-slate-600">⬡</span>
              <div>
                <p className="text-[11px] font-medium text-slate-300">{check.label}</p>
                <p className="text-[10px] leading-snug text-slate-500">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-slate-600">
          Each opportunity must be independently reviewed against these criteria. Signal Forge flags
          known friction patterns but does not substitute for full pursuit due diligence.
        </p>
      </div>
    </div>
  );
}
