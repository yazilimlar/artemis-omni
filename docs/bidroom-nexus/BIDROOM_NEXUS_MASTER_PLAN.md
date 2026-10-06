> **Provenance.** Stored from `BidRoom_Nexus_Codex_Handoff.zip` (uploaded 2026-10-05) as the versioned product plan for the BidRoom Nexus family. The plan below is reproduced verbatim; the Codex kickoff scripts and prompts from that package remain Mac-local tooling and are intentionally not committed here.
>
> ---

# BidRoom Nexus — Consolidated Product Plan

## Executive intent
BidRoom Nexus is an evidence-grounded operating platform for public construction procurement. It should help contractors discover opportunities, understand controlling bid documents, qualify pursuits, estimate work, manage addenda, and make bid/no-bid decisions.

## Product topology
- **Mission Control** — daily operational landing page
- **Live** — opportunities, addenda, awards
- **Signal Forge Classic** — frozen v2.1 public reference
- **Signal Forge X** — flagship operational workspace
- **Contractor** — specialty-scope pursuit intelligence
- **AtlasIQ** — multi-jurisdiction source federation
- **Evidence Engine** — bid-package digital twin
- **AI Estimator** — quantities, production, price, risk
- **Executive** — pipeline, backlog, capacity, KPIs
- **API/Developer** — governed integrations

## Design direction
Preserve Signal Forge Classic’s industrial typography, dense workspace, bold panels, fast scanning, full-screen format, and contractor terminology. Signal Forge X must not become a generic rounded-card SaaS dashboard.

## Primary workflows
1. Discover opportunity.
2. Determine scope relevance.
3. Confirm deadlines and mandatory actions.
4. retrieve complete package.
5. identify controlling documents/addenda.
6. extract qualifications, permits, bonds, insurance, participation, labor, terms.
7. understand scope/drawings/specifications.
8. generate risks, clarifications, bid/no-bid.
9. assign team and milestones.
10. build estimate and quote log.
11. submit and track award.
12. learn from outcomes.

## Signal Forge X layout
Top command bar: universal search, Ask BidRoom AI, saved views, alerts, source health.
Left navigation: Feed, Pursuit Board, Documents, Addenda, Estimating, Compliance, Awards, Source Health.
Main workspace: opportunity list/detail, pursuit state, evidence findings.
Right intelligence rail: fit, gaps, permits, addendum changes, next actions.

## Smart filters
Scope/synonyms; jurisdiction; agency; procurement method; prime/sub/design-build; due date; value; bonds; insurance; prequalification; licenses; labor; participation goals; mandatory meetings; permits; addenda/material changes; document/geotech availability; CSI/spec/drawing terms; fit/confidence/freshness.

## Source expansion
Proceed systematically: federal → states → major cities → transit/port/airport/water authorities → schools/universities → utilities → selected private owners.

Every adapter declares API/discovery method, authentication, rate limits, pagination, attachment retrieval, addendum behavior, refresh frequency, source health, data terms, and limitations.

## Knowledge graph
Agency, jurisdiction, opportunity, notice, document, addendum, drawing, specification, clause, bid item, quantity, scope, permit, qualification, bond, insurance, participation goal, milestone, award, contractor, project, person/role, evidence.

## Initial release roadmap
### 0.1 Preservation
Freeze Classic; stable route; hub listing; manifest/changelog; route tests.
### 0.2 Signal Forge X shell
Industrial design system; navigation; command bar; source health; workspace shell; screenshots/accessibility.
### 0.3 Shared schemas
Opportunity, source adapter, document, evidence, addendum delta, permit/qualification; fixtures/provenance.
### 0.4 First Evidence Engine pilot
One public package; hashes/classification/register; evidence extraction; human benchmark.
### 0.5 Pursuit workflow
Save, assign, milestones, bid/no-bid, tasks, comments, acknowledgements.
### 0.6 Controlled source expansion
Two or three authoritative adapters with telemetry.

## Definition of done
Direct route works; no Labs fallback; correct metadata/canonical; accurate data labels; types/build/tests/accessibility pass; screenshots reviewed; mobile usable; no console errors; old routes preserved; changelog updated.
