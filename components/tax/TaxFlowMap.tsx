import { consolidateTaxPosition } from "@/lib/tax/consolidateTaxPosition";
import { formatUSD } from "@/lib/tax/format";
import {
  INTERNAL_FLOW_TYPES,
  type TaxAmount,
  type TaxScenario,
} from "@/types/tax-architecture";

const sum = (items: TaxAmount[]): number =>
  items.reduce((total, item) => total + item.amount, 0);

type Stage = { label: string; value: number; note: string; kind: "in" | "cost" | "bridge" | "tax" | "kept" };

type TaxFlowMapProps = { scenario: TaxScenario };

export function TaxFlowMap({ scenario }: TaxFlowMapProps) {
  const consolidated = consolidateTaxPosition(scenario);
  const company = scenario.entities.find((e) => e.entityType !== "individual");
  const individual = scenario.entities.find((e) => e.entityType === "individual");

  const revenue = company ? sum(company.income) : 0;
  const deductibleSalary = scenario.flows
    .filter((f) => f.flowType === "salary" || f.flowType === "guaranteed_payment")
    .reduce((t, f) => t + f.amount, 0);
  const opex = company ? Math.max(sum(company.deductions) - deductibleSalary, 0) : 0;
  const profit = revenue - opex;
  const ownerComp = scenario.flows
    .filter((f) => INTERNAL_FLOW_TYPES.includes(f.flowType))
    .reduce((t, f) => t + f.amount, 0);
  const personalReceipts = individual ? sum(individual.income) : 0;

  const stages: Stage[] = [
    { label: "Company Treasury", value: revenue, note: "Gross business revenue in", kind: "in" },
    { label: "Business Expenses", value: opex, note: "Paid to outside vendors", kind: "cost" },
    { label: "Business Profit", value: profit, note: "Revenue less operating cost", kind: "in" },
    { label: "Ownership Bridge", value: ownerComp, note: "Salary · K-1 · distributions", kind: "bridge" },
    { label: "Personal Treasury", value: personalReceipts, note: "Owner receipts (internal transfer)", kind: "bridge" },
    { label: "Tax Authority", value: consolidated.totalTax, note: "Personal + entity tax out", kind: "tax" },
    { label: "Retained Cash", value: consolidated.combinedCashAfterTax, note: "Kept by the owner-group", kind: "kept" },
  ];

  const TONE: Record<Stage["kind"], string> = {
    in: "border-sky-300/30 text-sky-100",
    cost: "border-rose-300/30 text-rose-100",
    bridge: "border-amber-300/30 text-amber-100",
    tax: "border-rose-400/40 text-rose-100",
    kept: "border-emerald-300/35 text-emerald-100",
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="mb-6">
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/45">
          Financial Infrastructure · Aqueduct Model
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Company Treasury → Ownership Bridge → Personal Treasury → Tax Authority → Retained Cash
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
          Money is routed like water through civic infrastructure: it enters at the company,
          is spent, bridges to the owner, is taxed, and settles as retained cash. Owner receipts
          are an internal transfer of money that already existed — they are not new income.
        </p>
      </div>

      {/* Aqueduct: staged pillars with arches + directional flow */}
      <div className="-mx-2 overflow-x-auto pb-2">
        <ol className="flex min-w-[860px] items-stretch gap-2 px-2">
          {stages.map((stage, index) => (
            <li key={stage.label} className="flex items-stretch gap-2">
              <div
                className={`flex w-[150px] flex-col rounded-b-xl rounded-t-[26px] border ${TONE[stage.kind]} bg-black/30 p-4`}
              >
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/40">
                  Stage {index + 1}
                </span>
                <span className="mt-2 text-sm font-semibold text-white">{stage.label}</span>
                <span className="mt-2 text-lg font-semibold tracking-tight">
                  {formatUSD(stage.value)}
                </span>
                <span className="mt-auto pt-3 text-[0.7rem] leading-4 text-white/50">
                  {stage.note}
                </span>
              </div>
              {index < stages.length - 1 ? (
                <span className="self-center text-white/35" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Reconciliation callout — the anti-double-count message */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-4">
          <p className="text-xs uppercase tracking-wider text-sky-200/80">External income in</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatUSD(consolidated.externalIncome)}</p>
          <p className="mt-1 text-xs text-white/50">New money entering the owner-group</p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
          <p className="text-xs uppercase tracking-wider text-amber-200/80">Internal transfers eliminated</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatUSD(consolidated.eliminatedInternalFlows)}</p>
          <p className="mt-1 text-xs text-white/50">Salary + K-1 counted once, not twice</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-200/80">Retained after tax</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatUSD(consolidated.combinedCashAfterTax)}</p>
          <p className="mt-1 text-xs text-white/50">Income − outside spend − all tax</p>
        </div>
      </div>

      {/* Individual flows ledger */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {scenario.flows.map((flow) => (
          <div key={flow.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{flow.label}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{flow.taxTreatment}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-white">{formatUSD(flow.amount)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
