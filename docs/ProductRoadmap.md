# Artemis Omni — Product Roadmap

> **Internal strategy document.** Sequencing for how Artemis expands from a focused
> construction beachhead to a broader AI implementation/automation company. The public
> homepage must **not** jump ahead of this sequence (see `BrandArchitecture.md`).

## Guiding principle

Earn the right to broaden. Lead with the **5D Construction Intelligence Bridge**, prove
it on real heavy-civil/infrastructure data, then introduce horizontal **Artemis Core**
modules and additional verticals only as credibility compounds.

## Phase 0 — Foundation *(current)*

- Public site prototype: focused 5D construction positioning, content system, sample
  tool, cinematic hero + fallback, docs/ADRs.
- No backend, no auth, no analytics, no 3D engine.
- Messaging aligned to strict construction product rules (this branch).

## Phase 1 — Construction beachhead credibility *(next)*

- Make the pilot/contact form live (server action + email; keys in env vars).
- Add real project-controls tools (cashflow forecast, earned-value dashboard).
- First genuine case studies (Artemis Construct).
- Deepen Academy: 2D–5D explainers, PM Forecast vs system projection, ERP/CMiC.
- **Public scope stays: construction / infrastructure only.**

## Phase 2 — Digital twin & data depth

- Artemis **Twin**: 3D/4D/5D digital-twin and engineering visualization (this is where
  a lazy-loaded React Three Fiber scene with Draco-compressed GLB assets is justified).
- Artemis **Atlas**: geospatial / map intelligence for infrastructure.
- Supabase for the first authenticated dashboards (only when explicitly requested).
- ERP/CMiC connectors hardened.

## Phase 3 — Horizontal platform (begin introducing Core)

- Introduce **Artemis Core** modules gradually, starting with the ones nearest to the
  construction buyer's pain:
  - **Flow** (cashflow / AI CFO) — closest adjacency to 5D forecasting; the first module
    to surface. Positioning defined in [`ArtemisFlow.md`](./ArtemisFlow.md).
  - **Docs** (contracts, bids, unstructured extraction) — closest adjacency to estimating.
  - then **Connect**, **Ops**, **Desk**.
- Public site evolves from "5D Construction Intelligence Bridge" to "Artemis Omni — AI
  implementation & automation, starting with construction intelligence."

## Phase 4 — AI Business OS for SMBs

- Full horizontal positioning: Flow, Desk, Docs, Connect, Ops as a Business OS for small
  and mid-sized businesses, with industry verticals (Construct, Twin, Atlas) as proof.
- Only after the construction beachhead is unambiguously credible.

## What gates each phase

- Real outcomes/case studies before broadening the public claim.
- No public mention of a layer until there is a working surface or a concrete pilot.
- Security/secrets discipline maintained at every step (`SecurityRules.md`).

## Explicit "not yet" list (public homepage)

- ❌ SMB / Business OS framing
- ❌ Artemis Core module marketing pages
- ❌ 6D/7D/8D claims
- ❌ Backend-dependent promises
- ❌ React Three Fiber / WebGL scenes (until Phase 2)
