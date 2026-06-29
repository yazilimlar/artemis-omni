import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * What-it-is / what-it-is-not framing box. Sets honest scope on any Artemis
 * output — executive-ready precision without overpromising.
 */
export function WhatItIsNotBox({
  is,
  isNot,
  className,
}: {
  is: string[];
  isNot: string[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-xl border border-border/60 sm:grid-cols-2", className)}>
      <div className="bg-navy-deep/40 p-5">
        <p className="eyebrow text-gold-soft">What it is</p>
        <ul className="mt-3 space-y-2">
          {is.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-lunar/40 p-5">
        <p className="eyebrow text-silver">What it is not</p>
        <ul className="mt-3 space-y-2">
          {isNot.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-silver/70" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
