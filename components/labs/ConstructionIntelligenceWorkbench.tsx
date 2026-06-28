import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConstructionDisclaimer } from "@/components/labs/ConstructionDisclaimer";
import { ConstructionKpiGrid } from "@/components/labs/ConstructionKpiGrid";
import { ConstructionForecastPanel } from "@/components/labs/ConstructionForecastPanel";
import { ConstructionRiskRegister } from "@/components/labs/ConstructionRiskRegister";
import { ConstructionControlsMatrix } from "@/components/labs/ConstructionControlsMatrix";
import { ConstructionAuditPanel } from "@/components/labs/ConstructionAuditPanel";
import { syntheticProject } from "@/lib/artemis/data/syntheticWorkbenchData";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/50 pt-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-serif mt-2 text-2xl text-parchment">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * Public Construction Intelligence Workbench (synthetic showcase).
 * Entirely data-driven from lib/artemis/data/syntheticWorkbenchData.ts.
 * No 3D, no maps, no external APIs, no RC2 code or data.
 */
export function ConstructionIntelligenceWorkbench() {
  const p = syntheticProject;
  return (
    <div className="space-y-10">
      <ConstructionDisclaimer />

      {/* Synthetic project profile */}
      <div className="rounded-2xl border border-border/60 bg-navy-deep/30 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Synthetic showcase</Badge>
          <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            As of {p.asOf}
          </span>
        </div>
        <h2 className="display-serif mt-3 text-2xl text-parchment">{p.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{p.program}</p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          {[
            ["Owner", p.owner],
            ["Prime", p.primeContractor],
            ["Trade partner", p.tradePartner],
            ["Program manager", p.programManager],
            ["Phase", p.phase],
            ["Packages", p.packages.join(", ")],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                {k}
              </dt>
              <dd className="mt-0.5 text-foreground/85">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">{p.contractType}</p>
      </div>

      <Section eyebrow="Executive" title="Project controls KPIs">
        <ConstructionKpiGrid />
      </Section>

      <Section eyebrow="5D · Cashflow" title="Bid vs Actuals vs PM Forecast vs System Projection">
        <ConstructionForecastPanel />
      </Section>

      <Section eyebrow="Risk" title="Risk and opportunity matrix">
        <ConstructionRiskRegister />
      </Section>

      <Section eyebrow="Controls" title="Change / exposure register">
        <ConstructionControlsMatrix />
      </Section>

      <Section eyebrow="Trust" title="Data path, audit-awareness, and assumptions">
        <ConstructionAuditPanel />
      </Section>

      {/* Pilot CTA */}
      <section className="border-t border-border/50 pt-10">
        <div className="rounded-2xl border border-gold/25 bg-navy-deep/50 p-8 text-center">
          <p className="eyebrow">Pilot Program</p>
          <h2 className="display-serif mx-auto mt-3 max-w-xl text-2xl text-parchment sm:text-3xl">
            See these patterns on your project data
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Pilot-ready implementation framework — human-reviewed and audit-aware, with
            source-labeled assumptions and controlled integrations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg">
              Request a Pilot
            </Button>
            <Button href="/solutions/construction-intelligence" variant="outline" size="lg">
              Construction Intelligence
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
