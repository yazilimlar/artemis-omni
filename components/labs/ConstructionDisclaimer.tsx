import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * High-trust synthetic-data disclaimer for the public Construction Intelligence
 * Workbench. Renders the exact approved disclaimer text in the gold/navy language.
 */
export function ConstructionDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4",
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
      <div>
        <p className="eyebrow">Synthetic sample data</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/85">
          This public showcase uses synthetic sample data. It demonstrates Artemis
          construction-intelligence patterns without exposing real project, owner,
          contractor, employer, or client data.
        </p>
      </div>
    </div>
  );
}
