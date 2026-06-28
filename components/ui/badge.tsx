import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Small label chip used for categories, tags, and statuses. */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-gold-soft",
        className,
      )}
      {...props}
    />
  );
}
