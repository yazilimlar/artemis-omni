"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Fuel Price Adjustment (FPA) calculator.
 *
 * Models a common construction / haulage contract clause: a portion of the
 * contract value is exposed to fuel, and the price is adjusted when fuel moves
 * beyond a deadband relative to a baseline.
 *
 *   pctChange   = (current - base) / base
 *   effective   = sign(pctChange) * max(0, |pctChange| - deadband)
 *   adjustment  = contractValue * fuelShare * effective
 *
 * Purely client-side; no data leaves the browser.
 */

type Field = {
  key: string;
  label: string;
  suffix?: string;
  prefix?: string;
  step?: number;
  min?: number;
};

const fields: Field[] = [
  { key: "contractValue", label: "Contract value", prefix: "$", step: 1000, min: 0 },
  { key: "fuelShare", label: "Fuel-sensitive share", suffix: "%", step: 1, min: 0 },
  { key: "basePrice", label: "Baseline fuel price", prefix: "$", step: 0.01, min: 0 },
  { key: "currentPrice", label: "Current fuel price", prefix: "$", step: 0.01, min: 0 },
  { key: "deadband", label: "Deadband (no adjustment)", suffix: "%", step: 0.5, min: 0 },
];

const defaults: Record<string, number> = {
  contractValue: 2_500_000,
  fuelShare: 18,
  basePrice: 3.45,
  currentPrice: 4.12,
  deadband: 2,
};

function currency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function FuelPriceAdjustmentCalculator() {
  const [values, setValues] = React.useState<Record<string, number>>(defaults);

  const set = (key: string, raw: string) =>
    setValues((v) => ({ ...v, [key]: raw === "" ? 0 : Number(raw) }));

  const { contractValue, fuelShare, basePrice, currentPrice, deadband } = values;

  const pctChange = basePrice > 0 ? (currentPrice - basePrice) / basePrice : 0;
  const sign = Math.sign(pctChange);
  const effective = sign * Math.max(0, Math.abs(pctChange) - deadband / 100);
  const adjustment = contractValue * (fuelShare / 100) * effective;
  const adjustedTotal = contractValue + adjustment;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="space-y-4">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1.5 block text-sm text-foreground/80">{f.label}</span>
            <div className="flex items-center rounded-md border border-border bg-navy-deep/60 focus-within:border-gold/60">
              {f.prefix ? (
                <span className="pl-3 text-sm text-muted-foreground">{f.prefix}</span>
              ) : null}
              <input
                type="number"
                inputMode="decimal"
                step={f.step}
                min={f.min}
                value={Number.isFinite(values[f.key]) ? values[f.key] : 0}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 font-mono text-sm text-parchment outline-none"
              />
              {f.suffix ? (
                <span className="pr-3 text-sm text-muted-foreground">{f.suffix}</span>
              ) : null}
            </div>
          </label>
        ))}
      </div>

      {/* Results */}
      <div className="rounded-xl border border-gold/25 bg-navy-deep/50 p-6">
        <p className="eyebrow">Computed adjustment</p>

        <p
          className={cn(
            "display-serif mt-3 text-4xl",
            adjustment >= 0 ? "text-gold" : "text-silver",
          )}
        >
          {adjustment >= 0 ? "+" : "−"}
          {currency(Math.abs(adjustment))}
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Fuel price change" value={`${(pctChange * 100).toFixed(1)}%`} />
          <Row label="Deadband applied" value={`${deadband.toFixed(1)}%`} />
          <Row
            label="Effective adjustment rate"
            value={`${(effective * 100).toFixed(2)}%`}
          />
          <Row label="Fuel-sensitive base" value={currency(contractValue * (fuelShare / 100))} />
          <div className="border-t border-border/60 pt-3">
            <Row
              label="Adjusted contract total"
              value={currency(adjustedTotal)}
              emphasize
            />
          </div>
        </dl>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Illustrative model only. Real clauses vary (indices, caps, floors,
          symmetric vs one-way adjustment). Configure Artemis to match your
          specific contract language.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-mono",
          emphasize ? "text-base text-parchment" : "text-foreground/85",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
