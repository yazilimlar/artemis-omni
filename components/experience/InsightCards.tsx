"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type Insight = {
  label: string;
  value: string;
  note?: string;
};

/**
 * Compact insight readouts for the experience (e.g. EAC, SPI, cash exposure).
 * Placeholder data shape; future scenes feed real, source-labeled values.
 */
export function InsightCards({
  insights,
  className,
}: {
  insights?: Insight[];
  className?: string;
}) {
  const data: Insight[] =
    insights ?? [
      { label: "Forecast", value: "System", note: "vs Bid / Actuals / PM" },
      { label: "Confidence", value: "—", note: "stated per output" },
      { label: "Review", value: "Human", note: "audit-aware" },
    ];
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {data.map((i) => (
        <div key={i.label} className="rounded-md border border-border/60 bg-navy-deep/40 p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            {i.label}
          </p>
          <p className="display-serif mt-1 text-lg text-gold">{i.value}</p>
          {i.note ? <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{i.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
