"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type {
  ConsoleView,
  EvidenceState,
  ItemStatus,
} from "@/lib/tax-intelligence/ecosystem-console-manifest";

/**
 * Open-task / decision board.
 *
 * Filtering is by the DERIVED status carried on each view item (the manifest
 * derivation caps a proposed item below "complete" and never lets a proposal
 * render as a recorded fact). Proposed items are flagged "Proposed — not
 * recorded" wherever they appear. Nothing here writes back: this is a
 * read-only projection of the manifest.
 */

type Filter = ItemStatus | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "blocked", label: "Blocked" },
  { key: "in_review", label: "In review" },
  { key: "complete", label: "Complete" },
  { key: "unknown", label: "Unknown" },
];

const STATUS_LABEL: Record<ItemStatus, string> = {
  open: "Open",
  blocked: "Blocked",
  in_review: "In review",
  complete: "Complete",
  unknown: "Unknown",
};

function statusBadgeClass(status: ItemStatus): string {
  switch (status) {
    case "complete":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
    case "open":
      return "border-sky-400/40 bg-sky-400/10 text-sky-200";
    case "in_review":
      return "border-amber-400/40 bg-amber-400/10 text-amber-200";
    case "blocked":
      return "border-rose-400/40 bg-rose-400/10 text-rose-200";
    case "unknown":
    default:
      return "border-slate-500/50 bg-slate-500/10 text-slate-300";
  }
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

function shortSha(sha: string | null): string {
  return sha ? sha.slice(0, 8) : "no commit";
}

export function TaskBoard({ view }: { view: ConsoleView }) {
  const [filter, setFilter] = useState<Filter>("all");
  const items = view.board.filter((item) => filter === "all" || item.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter items by status">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={
                active
                  ? "rounded-full border border-amber-300/70 bg-amber-300/15 px-4 py-1.5 text-sm font-medium text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
                  : "rounded-full border border-slate-600/60 bg-slate-900/50 px-4 py-1.5 text-sm text-slate-300 hover:border-amber-300/40 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">No items with this status.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="border-slate-600/50 bg-slate-900/50">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-slate-100">{item.id}</span>
                <Badge>{item.kind}</Badge>
                {item.origin === "proposed" && (
                  <Badge className="border-rose-400/40 bg-rose-400/10 text-rose-200">
                    Proposed — not recorded
                  </Badge>
                )}
              </div>

              <h3 className="mt-3 text-base leading-snug font-medium text-slate-100">{item.title}</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className={statusBadgeClass(item.status)}>{STATUS_LABEL[item.status]}</Badge>
                <Badge className={evidenceBadgeClass(item.evidenceState)}>
                  evidence: {item.evidenceState}
                </Badge>
              </div>

              <dl className="mt-4 space-y-1.5 text-sm text-slate-300">
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-400">Confidence:</dt>
                  <dd className="font-mono text-xs leading-5">{item.confidence}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-400">Next actor:</dt>
                  <dd className="font-mono text-xs leading-5">{item.nextActor}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-400">Depends on:</dt>
                  <dd>
                    {item.dependsOn.length === 0 ? (
                      <span className="text-slate-400">none</span>
                    ) : (
                      <span className="flex flex-wrap gap-1.5">
                        {item.dependsOn.map((dep) => (
                          <span
                            key={dep}
                            className="rounded border border-slate-600/60 bg-slate-800/60 px-1.5 py-0.5 font-mono text-xs text-slate-200"
                          >
                            {dep}
                          </span>
                        ))}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              {item.note && <p className="mt-3 text-sm text-slate-400">{item.note}</p>}

              <footer className="mt-4 border-t border-slate-700/50 pt-3 font-mono text-xs text-slate-400">
                {item.provenance.sourcePath}
                <span aria-hidden="true"> · </span>
                {shortSha(item.provenance.commitSha)}
                <span aria-hidden="true"> · </span>
                {item.provenance.sourceStatus}
              </footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
