import { formatUSD } from "@/lib/tax/format";

// Common fictional starting point so structures compare on equal footing.
const DEMO_PROFIT = 250000;

// Illustrative BLENDED effective rates — assumptions for teaching only, not a
// computed tax result. Real outcomes depend on salary levels, elections,
// state, deductions, distributions, and timing.
const STRUCTURES: {
  name: string;
  effectiveRate: number;
  note: string;
  assumption: string;
}[] = [
  {
    name: "Individual Only",
    effectiveRate: 0.35,
    note: "Taxed directly to the person; no separate entity layer.",
    assumption: "Self-employment tax on all profit + personal income tax.",
  },
  {
    name: "Single-Member LLC",
    effectiveRate: 0.35,
    note: "Disregarded by default — flows to the owner like a sole proprietor.",
    assumption: "Same default treatment as an individual in this demo.",
  },
  {
    name: "S Corporation",
    effectiveRate: 0.3,
    note: "Reasonable salary + distributions; payroll tax only on the salary.",
    assumption: "Requires payroll, a defensible salary, and compliance.",
  },
  {
    name: "C Corporation",
    effectiveRate: 0.38,
    note: "Entity tax now, plus a second tax on dividends if distributed.",
    assumption: "Double-taxation mechanics are heavily simplified here.",
  },
];

export function ScenarioCompare() {
  const rows = STRUCTURES.map((s) => {
    const tax = Math.round(DEMO_PROFIT * s.effectiveRate);
    return { ...s, tax, cash: DEMO_PROFIT - tax };
  });
  const lowestTax = Math.min(...rows.map((r) => r.tax));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-white">Scenario Compare</h3>
          <p className="mt-1 max-w-2xl text-sm text-white/60">
            The same fictional {formatUSD(DEMO_PROFIT)} of business profit under four structures,
            using illustrative blended effective rates.
          </p>
        </div>
        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/60">
          Illustrative only · not advice
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <article
            key={row.name}
            className="flex flex-col rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-lg font-semibold text-white">{row.name}</h4>
              {row.tax === lowestTax ? (
                <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-emerald-200">
                  Lowest demo tax
                </span>
              ) : null}
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-baseline justify-between">
                <dt className="text-white/50">Est. total tax</dt>
                <dd className="font-semibold text-rose-300">{formatUSD(row.tax)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-white/50">Cash retained</dt>
                <dd className="font-semibold text-emerald-300">{formatUSD(row.cash)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-white/50">Effective rate</dt>
                <dd className="font-medium text-white/80">{Math.round(row.effectiveRate * 100)}%</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-white/55">{row.note}</p>
            <p className="mt-auto pt-3 text-[0.7rem] leading-4 text-amber-200/70">
              Assumption: {row.assumption}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
