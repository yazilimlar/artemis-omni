import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ShowcaseStatus =
  | "Public-safe"
  | "Private Demo"
  | "Prototype"
  | "Production Candidate"
  | "Coming soon";

const styles: Record<ShowcaseStatus, string> = {
  "Public-safe": "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  "Private Demo": "border-silver/40 bg-silver/10 text-silver",
  Prototype: "border-blueprint/40 bg-blueprint/10 text-blueprint",
  "Production Candidate": "border-gold/40 bg-gold/10 text-gold",
  "Coming soon": "border-border bg-muted/40 text-muted-foreground",
};

/** Color-coded status chip for proof/demo cards. */
export function StatusBadge({
  status,
  className,
}: {
  status: ShowcaseStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
