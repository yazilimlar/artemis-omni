"use client";

import { useMemo, useState } from "react";
import { calculateEntityTax } from "@/lib/tax/calculateEntityTax";
import { calculateIndividualTax } from "@/lib/tax/calculateIndividualTax";
import { consolidateTaxPosition } from "@/lib/tax/consolidateTaxPosition";
import { formatUSD } from "@/lib/tax/format";
import {
  INTERNAL_FLOW_TYPES,
  type TaxAmount,
  type TaxEntity,
  type TaxScenario,
} from "@/types/tax-architecture";
import { EvidenceAudit } from "@/components/tax/EvidenceAudit";
import { ScenarioCompare } from "@/components/tax/ScenarioCompare";
import { TaxFlowMap } from "@/components/tax/TaxFlowMap";
import { TaxModeSwitch, type TaxMode } from "@/components/tax/TaxModeSwitch";
import { TaxPositionCard } from "@/components/tax/TaxPositionCard";

const sum = (items: TaxAmount[]): number =>
  items.reduce((total, item) => total + item.amount, 0);

const MODE_HINT: Record<TaxMode, string> = {
  separate: "Individual and company as two independent tax universes.",
  combined: "The reconciled owner + entity picture, with internal transfers removed.",
  flow: "How money is routed from company revenue to retained cash.",
  scenario: "The same profit under four entity structures.",
  evidence: "How solid the numbers behind each input are.",
};

export function TaxAtlasApp({ scenario }: { scenario: TaxScenario }) {
  const [mode, setMode] = useState<TaxMode>("separate");

  const model = useMemo(() => {
    const individual =
      scenario.entities.find((e) => e.entityType === "individual") ?? scenario.entities[0];
    const company =
      scenario.entities.find((e) => e.entityType !== "individual") ?? scenario.entities[0];
    const ind = calculateIndividualTax(individual);
    const ent = calculateEntityTax(company);
    const con = consolidateTaxPosition(scenario);
    const ownerComp = scenario.flows
      .filter((f) => INTERNAL_FLOW_TYPES.includes(f.flowType))
      .reduce((t, f) => t + f.amount, 0);
    return { individual, company, ind, ent, con, ownerComp };
  }, [scenario]);

  const { individual, company, ind, ent, con, ownerComp } = model;
  const dueOrRefund = ind.remainingDueOrRefund; // + = due, − = refund

  return (
    <div className="min-h-screen bg-[#060a15] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Hero */}
        <header>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-amber-200/80">
            Artemis Labs · 5D Tax + Cashflow Architecture
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Artemis Tax Atlas
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            See your personal tax, company tax, and combined after-tax cash position in one view.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Model how money moves from company revenue to business profit, owner salary,
            distributions, personal tax, entity tax, and retained cash. Built for planning,
            scenario analysis, and financial visibility — not tax filing or legal advice.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/standalone/finance-architecture-5d.html"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
            >
              Open the 3D Tax Lab →
            </a>
            <span className="self-center text-xs text-white/40">
              Fictional demo data · not tax advice
            </span>
          </div>
        </header>

        {/* Three first-screen summary cards */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <TaxPositionCard
            title="Individual Tax Position"
            subtitle="Personal lens"
            accent="blue"
            primaryLabel="Personal cash after tax"
            primaryValue={formatUSD(ind.cashAfterTax)}
            confidencePercent={individual.confidencePercent}
            rows={[
              { label: "Taxable income", value: formatUSD(ind.taxableBase) },
              { label: "Total personal tax", value: formatUSD(ind.totalTax) },
              { label: "Payments / withholding", value: formatUSD(ind.totalPayments) },
              {
                label: dueOrRefund > 0 ? "Amount due" : "Refund",
                value: formatUSD(Math.abs(dueOrRefund)),
                emphasis: dueOrRefund > 0 ? "bad" : "good",
              },
            ]}
          />
          <TaxPositionCard
            title="Company Tax Position"
            subtitle="Entity lens"
            accent="gold"
            primaryLabel="Company cash after tax"
            primaryValue={formatUSD(ent.cashAfterTax)}
            confidencePercent={company.confidencePercent}
            rows={[
              { label: "Revenue", value: formatUSD(ent.revenue) },
              { label: "Expenses", value: formatUSD(ent.deductions) },
              { label: "Entity-level tax", value: formatUSD(ent.totalTax) },
              { label: "Owner compensation", value: formatUSD(ownerComp) },
            ]}
          />
          <TaxPositionCard
            title="Combined Owner / Entity"
            subtitle="Reconciled lens"
            accent="violet"
            primaryLabel="Total cash retained"
            primaryValue={formatUSD(con.combinedCashAfterTax)}
            confidencePercent={con.confidencePercent}
            rows={[
              { label: "Combined tax exposure", value: formatUSD(con.totalTax), emphasis: "bad" },
              { label: "External income", value: formatUSD(con.externalIncome) },
              { label: "Inter-entity flows", value: formatUSD(con.internalFlows) },
              { label: "Double-count eliminations", value: `− ${formatUSD(con.eliminatedInternalFlows)}` },
            ]}
          />
        </div>

        {/* Mode switch */}
        <div className="mt-12">
          <TaxModeSwitch value={mode} onChange={setMode} />
          <p className="mt-3 text-sm text-white/55">{MODE_HINT[mode]}</p>
        </div>

        {/* Mode content */}
        <div className="mt-6">
          {mode === "separate" ? (
            <SeparateView individual={individual} company={company} />
          ) : null}
          {mode === "combined" ? <CombinedView con={con} /> : null}
          {mode === "flow" ? <TaxFlowMap scenario={scenario} /> : null}
          {mode === "scenario" ? <ScenarioCompare /> : null}
          {mode === "evidence" ? <EvidenceAudit evidence={scenario.evidence} /> : null}
        </div>

        {/* Assumptions */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Demo assumptions
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm text-white/55">
            {scenario.assumptions.map((a) => (
              <li key={a} className="flex gap-2">
                <span aria-hidden className="text-amber-200/70">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Required disclaimer */}
        <section className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.06] p-5">
          <h2 className="text-sm font-semibold text-amber-100">Important — not tax advice</h2>
          <p className="mt-2 text-sm leading-6 text-amber-100/85">
            This prototype is a planning and visualization tool, not tax advice, accounting
            advice, legal advice, or a tax filing product. Results are simplified and depend on
            entity structure, jurisdiction, elections, timing, documentation, and taxpayer-specific
            facts. Review with a CPA, EA, or tax attorney before acting.
          </p>
        </section>
      </div>
    </div>
  );
}

function EntityPanel({
  entity,
  accent,
  universe,
}: {
  entity: TaxEntity;
  accent: string;
  universe: string;
}) {
  const cash = entity.cashAfterTax;
  const groups: { label: string; items: TaxAmount[] }[] = [
    { label: "Income", items: entity.income },
    { label: "Deductions", items: entity.deductions },
    { label: "Taxes", items: entity.taxes },
    { label: "Payments", items: entity.payments },
  ];
  return (
    <div className={`rounded-2xl border ${accent} bg-black/20 p-5`}>
      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/40">{universe}</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{entity.name}</h3>
      <p className="mt-0.5 text-xs text-white/45">
        {entity.entityType.replace(/_/g, " ")} · {entity.jurisdiction.state ?? entity.jurisdiction.country}
      </p>

      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
              {group.label}
            </p>
            <dl className="mt-1.5 space-y-1 text-sm">
              {group.items.length === 0 ? (
                <p className="text-white/40">—</p>
              ) : (
                group.items.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-3">
                    <dt className="text-white/60">{item.label}</dt>
                    <dd className="font-medium text-white/85">{formatUSD(item.amount)}</dd>
                  </div>
                ))
              )}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
        <span className="text-sm text-white/60">Cash after tax</span>
        <span className="text-lg font-semibold text-white">{formatUSD(cash)}</span>
      </div>
    </div>
  );
}

function SeparateView({ individual, company }: { individual: TaxEntity; company: TaxEntity }) {
  return (
    <section>
      <p className="mb-4 text-sm text-white/55">
        These are <span className="font-semibold text-white">two separate tax universes</span>.
        The company pays the owner; the owner is taxed personally. They are not simply added
        together — that reconciliation is the Combined View.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <EntityPanel entity={individual} accent="border-sky-300/25" universe="Personal universe" />
        <EntityPanel entity={company} accent="border-amber-300/25" universe="Entity universe" />
      </div>
    </section>
  );
}

function CombinedView({ con }: { con: ReturnType<typeof consolidateTaxPosition> }) {
  const waterfall: { label: string; value: number; op: "add" | "sub" | "total" }[] = [
    { label: "External income in", value: con.externalIncome, op: "add" },
    { label: "Business expenses (to outside vendors)", value: con.externalBusinessExpenses, op: "sub" },
    { label: "Total tax paid (personal + entity)", value: con.totalTax, op: "sub" },
    { label: "Combined cash retained", value: con.combinedCashAfterTax, op: "total" },
  ];
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <h3 className="text-2xl font-semibold text-white">Combined Owner / Entity Position</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
        Company and personal tax are <span className="font-semibold text-white">not naively added</span>.
        Salary, distributions, dividends, and K-1 pass-through are internal transfers of money that
        already existed as company revenue, so they are eliminated to avoid double counting.
      </p>

      <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm text-amber-100/85">
        Internal transfers eliminated: <span className="font-semibold">{formatUSD(con.eliminatedInternalFlows)}</span>{" "}
        (counted once, not twice).
      </div>

      <dl className="mt-6 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        {waterfall.map((row) => (
          <div
            key={row.label}
            className={
              "flex items-baseline justify-between gap-3 p-4 " +
              (row.op === "total" ? "bg-emerald-300/[0.06]" : "")
            }
          >
            <dt className={row.op === "total" ? "font-semibold text-white" : "text-white/65"}>
              {row.label}
            </dt>
            <dd
              className={
                row.op === "total"
                  ? "text-xl font-semibold text-emerald-300"
                  : row.op === "sub"
                    ? "font-medium text-rose-300"
                    : "font-medium text-white/85"
              }
            >
              {row.op === "sub" ? "− " : ""}
              {formatUSD(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
