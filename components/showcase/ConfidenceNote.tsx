import * as React from "react";
import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Level = "Low" | "Moderate" | "High";

const levelTone: Record<Level, string> = {
  Low: "text-silver",
  Moderate: "text-blueprint",
  High: "text-gold",
};

/**
 * Transparent confidence indicator. Communicates executive-ready precision
 * with a stated confidence level rather than an absolute claim.
 */
export function ConfidenceNote({
  level = "Moderate",
  children,
  className,
}: {
  level?: Level;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-border/60 bg-navy-deep/40 px-3 py-2",
        className,
      )}
    >
      <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-blueprint" aria-hidden />
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-mono uppercase tracking-wider text-muted-foreground">Confidence: </span>
        <span className={cn("font-mono uppercase tracking-wider", levelTone[level])}>{level}</span>
        {children ? <span className="ml-1">— {children}</span> : null}
      </p>
    </div>
  );
}
