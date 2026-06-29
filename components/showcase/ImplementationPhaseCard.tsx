import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ImplementationPhase = {
  phase: string; // e.g. "Phase 0"
  title: string;
  summary: string;
  marker?: string; // short tag e.g. "Diagnostic"
};

/** A single step in the Artemis transition method (Phase 0–6). */
export function ImplementationPhaseCard({
  phase,
  className,
}: {
  phase: ImplementationPhase;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-navy-deep/40 p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-blueprint">
          {phase.phase}
        </span>
        {phase.marker ? (
          <span className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
            {phase.marker}
          </span>
        ) : null}
      </div>
      <h3 className="display-serif mt-2 text-lg text-parchment">{phase.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phase.summary}</p>
    </div>
  );
}
