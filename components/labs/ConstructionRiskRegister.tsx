import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { riskOpportunities } from "@/lib/artemis/data/syntheticWorkbenchData";

const level: Record<string, string> = {
  High: "text-gold",
  Medium: "text-silver",
  Low: "text-muted-foreground",
};

/** Risk and opportunity matrix — synthetic entries (R-001…, O-001…). */
export function ConstructionRiskRegister() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {riskOpportunities.map((r) => (
        <div key={r.id} className="rounded-xl border border-border/60 bg-navy-deep/40 p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge>{r.id}</Badge>
            <span
              className={cn(
                "font-mono text-[0.6rem] uppercase tracking-wider",
                r.type === "Opportunity" ? "text-gold-soft" : "text-silver",
              )}
            >
              {r.type}
            </span>
          </div>
          <p className="mt-3 text-sm text-parchment">{r.title}</p>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-muted-foreground">
              Likelihood <span className={level[r.likelihood]}>{r.likelihood}</span>
            </span>
            <span className="text-muted-foreground">
              Impact <span className={level[r.impact]}>{r.impact}</span>
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.response}</p>
          <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            Owner · {r.owner}
          </p>
        </div>
      ))}
    </div>
  );
}
