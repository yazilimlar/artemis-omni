import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ConsoleView, EvidenceState } from "@/lib/tax-intelligence/ecosystem-console-manifest";

/**
 * Development timeline.
 *
 * Dates render exactly as recorded in the manifest view. A null date renders
 * as "date not set" — the projection strips any date that lacks commit
 * provenance, and this component never invents one. Each entry carries its
 * evidence-state badge and its source provenance.
 */

function shortSha(sha: string | null): string {
  return sha ? sha.slice(0, 8) : "no commit";
}

function evidenceBadgeClass(state: EvidenceState): string {
  switch (state) {
    case "verified":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
    case "observed":
      return "border-sky-400/40 bg-sky-400/10 text-sky-200";
    case "declared":
      return "border-amber-400/40 bg-amber-400/10 text-amber-200";
    case "inferred":
      return "border-violet-400/40 bg-violet-400/10 text-violet-200";
    case "blocked":
      return "border-rose-400/40 bg-rose-400/10 text-rose-200";
    case "stale":
      return "border-orange-400/40 bg-orange-400/10 text-orange-200";
    case "unknown":
    default:
      return "border-slate-500/50 bg-slate-500/10 text-slate-300";
  }
}

export function Timeline({ view }: { view: ConsoleView }) {
  return (
    <ol className="relative space-y-4 border-l border-slate-600/50 pl-6">
      {view.timeline.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-5 -left-[31px] h-2.5 w-2.5 rounded-full bg-amber-300"
          />
          <Card className="border-slate-600/50 bg-slate-900/50 p-5">
            <div className="flex flex-wrap items-center gap-3">
              {entry.date ? (
                <span className="font-mono text-sm text-amber-200">{entry.date}</span>
              ) : (
                <span className="font-mono text-sm text-slate-400 italic">date not set</span>
              )}
              <Badge className={evidenceBadgeClass(entry.evidenceState)}>{entry.evidenceState}</Badge>
            </div>
            <h3 className="mt-2 text-base font-medium text-slate-100">{entry.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{entry.state}</p>
            <p className="mt-3 border-t border-slate-700/50 pt-3 font-mono text-xs text-slate-400">
              {entry.provenance.sourcePath} · {shortSha(entry.provenance.commitSha)} ·{" "}
              {entry.provenance.sourceStatus}
            </p>
          </Card>
        </li>
      ))}
    </ol>
  );
}
