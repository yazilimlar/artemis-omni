# 04 — DeepSeek Engineering Review Prompt

Role: **DeepSeek** — engineering / math / formula review.

## Task

Audit the correctness, performance, and engineering soundness of `artemis-omni/`.

## Focus areas

### Formulas & calculators
- Verify the **Fuel Price Adjustment** model in
  `components/tools/FuelPriceAdjustmentCalculator.tsx`:
  - `pctChange = (current - base) / base`
  - `effective = sign(pctChange) * max(0, |pctChange| - deadband)`
  - `adjustment = contractValue * fuelShare * effective`
  - Edge cases: base = 0, negative inputs, deadband ≥ change, symmetric behavior.
- Sanity-check the cost-curve / earned-value concepts in
  `content/academy/5d-cost-control.mdx` (CPI, SPI, EAC definitions).

### Performance
- Confirm the cinematic layer is genuinely lazy-loaded (`ssr: false`, dynamic import)
  and excluded from the critical path.
- Look for unnecessary client components, large bundles, or layout thrash from the
  pointer-parallax.

### Correctness & types
- `npm run typecheck` clean. Any `any`, unsafe casts, or unhandled async.
- Content loader (`lib/content`) — file IO only at build/server, no runtime surprises.

### Output
Findings with severity, the reasoning, and a corrected formula/snippet where applicable.
