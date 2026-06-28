# Artemis Flow — Module Positioning

> **Internal strategy document. NOT public.** Artemis Flow is **not** on the public site,
> has no route (`/products/flow` does not exist yet), and no code. This document defines
> its positioning only. The public site continues to lead with **Artemis Construct / 5D
> Construction Intelligence** (see `BrandArchitecture.md` and `ProductRoadmap.md`).

## What Artemis Flow is

**Artemis Flow** is the **finance, banking, and cashflow intelligence module** of the
Artemis Core platform — an **AI CFO-style** layer for small and mid-sized businesses. It
turns banking, billing, AR/AP, and ledger data into live cashflow forecasts, variance
analysis, and recommended financial action.

Scope:

- **Cashflow forecasting** — projected inflows/outflows with scenario and what-if modeling.
- **Bank & account aggregation** — connected balances and transactions (read-level).
- **AR / AP & billing/revenue** — receivables, payables, and revenue recognition signals.
- **Variance & runway analytics** — Budget vs Actuals vs Forecast, burn, runway, covenants.
- **AI CFO narrative** — plain-language explanation of *why* the numbers moved and the
  recommended next action, with an auditable trail back to source.

## Relationship to the construction beachhead

Flow is the **horizontal generalization of the construction cashflow engine.** Artemis
Construct's 5D **Cashflow Intelligence Engine** — comparing **Bid Estimate vs Actuals vs
PM Forecast vs System-Generated Projections** — is the vertical, proving-ground instance
of the same pattern. Flow lifts that pattern to any SMB:

| Construction (Artemis Construct, public now) | General business (Artemis Flow, internal) |
| --- | --- |
| Bid Estimate | Budget / Plan |
| Actuals (ERP / CMiC) | Actuals (banking / accounting) |
| PM Forecast | Management Forecast |
| System-Generated Projections | System-Generated Projections |
| Project cashflow | Business cashflow / runway |

This adjacency is why Flow is the **first Core module to introduce after** the construction
positioning is credible — the engine is shared, the buyer pain (cashflow) is the same.

## Positioning statement (internal)

> Artemis Flow is the AI CFO for small and mid-sized businesses — turning banking, billing,
> and ledger data into a live cashflow forecast and the next financial decision. It is the
> horizontal expression of the 5D cashflow intelligence Artemis proves in heavy civil
> construction first.

## Guardrails

- ❌ Do **not** add Flow to the public homepage, navigation, or any public copy yet.
- ❌ Do **not** create `/products/flow`, `/demo`, or any Flow route yet.
- ❌ Do **not** wire backend, banking connectors, Supabase, analytics, or forms.
- ✅ Keep the public lead on **Artemis Construct / 5D Construction Intelligence**.
- ✅ Preserve the broader **Business OS** architecture (Flow/Desk/Docs/Connect/Ops +
  verticals) as internal roadmap (`BrandArchitecture.md`, `ProductRoadmap.md`).

## Sequencing

Flow is introduced in **Phase 3** of `ProductRoadmap.md` (begin introducing Core),
ordered first among the Core modules because of its direct adjacency to 5D cashflow
forecasting. It does not change Phases 0–2, which remain construction-only in public.
