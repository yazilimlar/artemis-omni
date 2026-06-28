import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { kpis } from "@/lib/artemis/data/syntheticWorkbenchData";

const toneClass: Record<string, string> = {
  good: "text-gold",
  watch: "text-silver",
  neutral: "text-parchment",
};

/** Executive KPI grid — synthetic project-controls indicators. */
export function ConstructionKpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-border/60 bg-navy-deep/40 p-5">
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            {k.label}
          </p>
          <p className={cn("display-serif mt-2 text-2xl", toneClass[k.tone])}>{k.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{k.caption}</p>
        </div>
      ))}
    </div>
  );
}
