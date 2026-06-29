import { artemisBridgeValueChain } from "@/data/proofLibrary";

type ValueChainStripProps = {
  steps?: readonly string[];
};

export function ValueChainStrip({ steps = artemisBridgeValueChain }: ValueChainStripProps) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-navy-deep/45 p-5 shadow-panel">
      <div className="flex flex-wrap items-center gap-2" aria-label={steps.join(" to ")}>
        {steps.map((step, index) => (
          <div key={step} className="flex min-w-0 items-center gap-2">
            <span className="rounded-md border border-border/70 bg-background/45 px-3 py-2 text-sm text-foreground/88">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span className="font-mono text-xs text-gold-soft" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
