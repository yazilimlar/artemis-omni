import * as React from "react";
import { cn } from "@/lib/utils/cn";
import type { StatusTone } from "@/data/proofLibrary";

const toneStyles: Record<StatusTone, string> = {
  public: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  synthetic: "border-sky-400/35 bg-sky-400/10 text-sky-200",
  private: "border-rose-300/35 bg-rose-400/10 text-rose-200",
  sanitize: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  pilot: "border-gold/35 bg-gold/10 text-gold-soft",
  reference: "border-silver/35 bg-silver/10 text-silver",
  test: "border-violet-300/35 bg-violet-400/10 text-violet-100",
};

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

export function StatusBadge({ tone = "pilot", className, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.66rem] uppercase tracking-wider",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
