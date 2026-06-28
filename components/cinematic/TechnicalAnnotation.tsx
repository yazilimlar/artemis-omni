import * as React from "react";
import { cn } from "@/lib/utils/cn";

type TechnicalAnnotationProps = {
  label: string;
  value?: string;
  className?: string;
  /** Direction the leader line points from the dot. */
  side?: "left" | "right";
};

/**
 * A fine technical drawing annotation: a node dot, a hairline leader, and a
 * monospace label/value. Used to label floating artifacts in the hero like a
 * project-controls / engineering blueprint annotation.
 */
export function TechnicalAnnotation({
  label,
  value,
  className,
  side = "right",
}: TechnicalAnnotationProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        side === "left" && "flex-row-reverse",
        className,
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-gold/60 animate-pulse-node" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <span
        className={cn(
          "h-px w-8 annotation-line",
          side === "left" && "rotate-180",
        )}
        aria-hidden
      />
      <span className="whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.18em] text-silver/80">
        {label}
        {value ? <span className="ml-1 text-gold-soft">{value}</span> : null}
      </span>
    </div>
  );
}
