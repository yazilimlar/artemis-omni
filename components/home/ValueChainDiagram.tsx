/**
 * ValueChainDiagram — the 13-stage Artemis value chain as a visual flow.
 *
 * The static diagram renders first and is also the reduced-motion fallback:
 * every stage label stays readable with animation off. With `animated`, nodes
 * light in sequence (CSS opacity only, ~10s loop) gated on
 * `prefers-reduced-motion: no-preference` — see `.vc-signal-glow` in
 * app/globals.css.
 */
type ValueChainDiagramProps = {
  /** Unique prefix for the accessible title/description ids. */
  idPrefix: string;
  /** Light the nodes in sequence. Default false (static diagram). */
  animated?: boolean;
  /** Extra classes for the panel (e.g. stronger backdrop over photography). */
  className?: string;
};

export const VALUE_CHAIN_STAGES = [
  "Design",
  "Geometry",
  "Quantities",
  "Schedule",
  "Field Production",
  "Actual Cost",
  "Billing Revenue",
  "PM Forecast",
  "System Projections",
  "Cashflow",
  "Risk / Opportunity",
  "Executive Action",
  "Operating Story",
] as const;

const LOOP_SECONDS = 10;

export function ValueChainDiagram({ idPrefix, animated = false, className }: ValueChainDiagramProps) {
  const titleId = `${idPrefix}-title`;
  const descId = `${idPrefix}-desc`;
  return (
    <div
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={`rounded-2xl border border-border/60 bg-navy-deep/40 p-6 ${className ?? ""}`}
    >
      <span id={titleId} className="sr-only">
        Artemis value chain
      </span>
      <span id={descId} className="sr-only">
        Thirteen stages, in order: {VALUE_CHAIN_STAGES.join(", ")}.
      </span>
      <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
        {VALUE_CHAIN_STAGES.map((stage, index) => (
          <span key={stage} className="flex min-w-0 items-center gap-2">
            <span className="relative inline-block rounded-md border border-border/70 bg-background/45 px-3 py-2 text-sm text-foreground/90">
              {animated ? (
                <span
                  className="vc-signal-glow"
                  style={{
                    animationDelay: `${(index * LOOP_SECONDS) / VALUE_CHAIN_STAGES.length}s`,
                  }}
                />
              ) : null}
              <span className="relative">{stage}</span>
            </span>
            {index < VALUE_CHAIN_STAGES.length - 1 ? (
              <span className="font-mono text-xs text-gold-soft">→</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
