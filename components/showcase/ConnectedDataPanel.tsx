import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const DEFAULT_SOURCES = [
  "Design / model",
  "Schedule (P6, etc.)",
  "ERP / CMiC-style cost",
  "Field production",
  "Billing / revenue",
];

const DEFAULT_OUTPUTS = [
  "5D cashflow forecast",
  "Risk / opportunity",
  "Executive reporting",
];

/**
 * "What Artemis connects" — source systems → the Artemis implementation layer →
 * trusted outputs. Communicates controlled integrations, not a black box.
 */
export function ConnectedDataPanel({
  sources = DEFAULT_SOURCES,
  outputs = DEFAULT_OUTPUTS,
  className,
}: {
  sources?: string[];
  outputs?: string[];
  className?: string;
}) {
  const Col = ({ label, items, tone }: { label: string; items: string[]; tone: string }) => (
    <div className="flex-1">
      <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-2">
        {items.map((s) => (
          <div
            key={s}
            className={cn("rounded-md border px-3 py-2 text-sm", tone)}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "grid items-center gap-4 rounded-2xl border border-border/60 bg-navy-deep/30 p-6 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]",
        className,
      )}
    >
      <Col label="Connected sources" items={sources} tone="border-border/70 bg-navy-deep/50 text-foreground/85" />
      <ArrowRight className="mx-auto hidden h-5 w-5 text-blueprint/70 lg:block" aria-hidden />
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-center">
        <p className="eyebrow">Artemis</p>
        <p className="mt-1 text-sm text-parchment">Implementation layer</p>
        <p className="mt-1 text-xs text-muted-foreground">
          semantic model · source-labeled logic · human review
        </p>
      </div>
      <ArrowRight className="mx-auto hidden h-5 w-5 text-gold/70 lg:block" aria-hidden />
      <Col label="Trusted outputs" items={outputs} tone="border-gold/25 bg-gold/5 text-foreground/90" />
    </div>
  );
}
