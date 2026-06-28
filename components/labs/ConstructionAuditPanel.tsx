import * as React from "react";
import { ArrowRight } from "lucide-react";
import { auditPath, assumptions, framing } from "@/lib/artemis/data/syntheticWorkbenchData";

/**
 * Data-path / audit-awareness panel + human-review assumptions.
 * Shows the source → logic → human-review chain and the source-labeled assumptions,
 * with what-it-is / what-it-is-not framing. All synthetic.
 */
export function ConstructionAuditPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Data path */}
      <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-5">
        <p className="eyebrow">Data path · audit-aware</p>
        <ol className="mt-4 space-y-3">
          {auditPath.map((s, i) => (
            <li key={s.stage} className="flex items-start gap-3">
              <span className="mt-0.5 font-mono text-[0.6rem] text-gold">{i + 1}</span>
              <div className="text-sm">
                <p className="text-parchment">{s.stage}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {s.source}
                  <ArrowRight className="mx-1 inline h-3 w-3 text-gold/70" />
                  {s.logic}
                  <ArrowRight className="mx-1 inline h-3 w-3 text-gold/70" />
                  <span className="text-gold-soft">review: {s.review}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Assumptions + framing */}
      <div className="rounded-xl border border-border/60 bg-navy-deep/40 p-5">
        <p className="eyebrow">Human-review assumptions</p>
        <ul className="mt-4 space-y-3">
          {assumptions.map((a) => (
            <li key={a.id} className="text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  {a.id} · source: {a.source}
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gold-soft">
                  {a.confidence}
                </span>
              </div>
              <p className="mt-1 text-foreground/85">{a.statement}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border/50 pt-4 text-xs leading-relaxed">
          <p className="text-foreground/85">
            <span className="text-gold">What it is: </span>
            {framing.isA}
          </p>
          <p className="mt-2 text-muted-foreground">
            <span className="text-silver">What it is not: </span>
            {framing.isNot}
          </p>
        </div>
      </div>
    </div>
  );
}
