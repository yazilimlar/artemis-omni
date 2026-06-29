import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConstructionDisclaimer } from "@/components/labs/ConstructionDisclaimer";
import { ConstructionKpiGrid } from "@/components/labs/ConstructionKpiGrid";
import { ConstructionForecastPanel } from "@/components/labs/ConstructionForecastPanel";
import { ConstructionRiskRegister } from "@/components/labs/ConstructionRiskRegister";
import { ConstructionControlsMatrix } from "@/components/labs/ConstructionControlsMatrix";
import { ConstructionAuditPanel } from "@/components/labs/ConstructionAuditPanel";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import {
  syntheticProject,
  thesis,
  framing,
  formulaTrace,
  riskInterpretation,
} from "@/lib/artemis/data/syntheticWorkbenchData";

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

      {/* Executive thesis + decision improved */}
      <div className="rounded-2xl border border-gold/25 bg-navy-deep/40 p-6">
        <p className="eyebrow">Executive thesis</p>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{thesis.statement}</p>
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            Decision improved
          </p>
          <p className="mt-1 text-sm text-foreground/85">{thesis.decisionImproved}</p>
        </div>
      </div>

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
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{k}</dt>
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
        <ConfidenceNote level="Moderate" className="mt-4">
          system projection exceeds PM forecast; driven by Package A production trend.
        </ConfidenceNote>
      </Section>

      <Section eyebrow="Risk" title="Risk and opportunity matrix">
        <ConstructionRiskRegister />
        <div className="mt-5 rounded-xl border border-border/60 bg-navy-deep/40 p-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            Interpretation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">{riskInterpretation}</p>
        </div>
      </Section>

      <Section eyebrow="Controls" title="Change / exposure register">
        <ConstructionControlsMatrix />
      </Section>

      <Section eyebrow="Trust" title="Data path, audit-awareness, and assumptions">
        <ConstructionAuditPanel />
      </Section>

      <Section eyebrow="Traceability" title="Formula traceability">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-navy-deep/40">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="px-4 py-3 font-mono text-[0.6rem] uppercase tracking-wider">Output</th>
                <th className="px-4 py-3 font-mono text-[0.6rem] uppercase tracking-wider">Formula</th>
                <th className="px-4 py-3 font-mono text-[0.6rem] uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody>
              {formulaTrace.map((f) => (
                <tr key={f.output} className="border-b border-border/40 last:border-0 align-top">
                  <td className="px-4 py-3 text-foreground/90">{f.output}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blueprint-soft">{f.formula}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{f.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Every computed value exposes its inputs and source. Audit-grade logic — not a black box.
        </p>
      </Section>

      <Section eyebrow="Scope" title="What it is / what it is not">
        <WhatItIsNotBox is={framing.isList} isNot={framing.isNotList} />
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
            <Button href="/contact" size="lg">Request a Pilot</Button>
            <Button href="/solutions/construction-intelligence" variant="outline" size="lg">
              Construction Intelligence
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
