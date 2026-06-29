import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** The canonical Artemis 5D value chain: design intent → executive action. */
export const ARTEMIS_VALUE_CHAIN = [
  "Design",
  "Geometry",
  "Quantities",
  "Schedule",
  "Field Production",
  "Actual Cost",
  "Billing Revenue",
  "PM Forecast",
  "System-Generated Projections",
  "Cashflow",
  "Risk / Opportunity",
  "Executive Action",
];

/**
 * Connected value-chain strip. Each link is traceable to the next, so a change
 * in the field reaches the cashflow forecast and the boardroom automatically.
 */
export function ValueChainStrip({
  steps = ARTEMIS_VALUE_CHAIN,
  className,
}: {
  steps?: string[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-3", className)}>
      {steps.map((step, i) => {
        const terminal = i === steps.length - 1;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm",
                terminal
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-border/70 bg-navy-deep/50 text-foreground/85",
              )}
            >
              {step}
            </span>
            {!terminal ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-blueprint/70" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
