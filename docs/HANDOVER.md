# Handover: Session 2026-07-11 — CivicBid Canonical Bridge Integration

Standardized, parse-friendly handover. Historical states remain available through Git, pull requests, issues, and dated files under `docs/evolution/`.

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical integration branch: `main`
- GitHub default branch: `main`
- PR #9 merged to `main`: `8a5435ee82da774fa0e9255289de09c04730b64d`
- PR #12 merged to `main`: `7b0cd8b72be908b66ea648a1ac3791db87292306`
- PR #12 production deployment is READY on Vercel with `artemis.agoraxai.com` assigned and no alias error
- Permanent production review route: `https://artemis.agoraxai.com/labs/civicbid-signal-forge`
- Permanent production API: `https://artemis.agoraxai.com/api/civicbid/signal-forge`
- Current work branch: `feature/civicbid-canonical-bridge-integration-v1`
- Current draft PR: GitHub PR #13
- PR #13 baseline: exact production `main` commit `7b0cd8b72be908b66ea648a1ac3791db87292306`
- Tracking issue: GitHub Issue #11

## Division and Product Ownership

- Division: Infrastructure & Construction
- Product family: civicbid
- Product: CivicBid
- Change class: canonical public-route integration
- Lifecycle: rescue moving toward active lab
- Visibility: public canonical route plus no-index review route
- Data mode: mixed_explicit
- Governing ADRs: ADR-005 and ADR-006
- Feature passport: `ENGINEERING/FEATURE_PASSPORTS/CIVICBID_LIVE_COCKPIT_V1.md`

## Non-Negotiable Rescue Rule

Do not merge any historical CivicBid donor branch wholesale.

Preserved donor branches:

- `test/civicbid-signal-forge`
- `fix/civicbid-signal-forge-cockpit`
- `feature/civicbid-sourceledger-command-deck`

Explicitly excluded donor concerns:

- ArtemisIX19
- Studio or generation systems
- Time Atlas or Troy
- Evolution Console
- global brand or navigation redesign
- unrelated package changes
- standalone HTML libraries

## What PR #12 Established on Main

### CivicBid data contract

- `types/civicbid.ts` declares explicit live/sample record modes
- `lib/civicbid/normalizeOpportunity.ts` normalizes official public rows, timestamps dates, labels official API confidence, and retains raw evidence only internally
- `lib/civicbid/connectors/socrata.ts` applies bounded row limits, an eight-second timeout, response-shape validation, and a credential-free official-source connector
- An unverified upstream ordering clause was removed after deployed testing showed it could cause avoidable fallback

### Canonical scoring and contractor relevance

- Five-factor model:
  - due-date urgency: 30%
  - document availability: 25%
  - source confidence: 20%
  - construction fit: 15%
  - compliance clarity: 10%
- Runtime invariant requires weights to total exactly 100%
- Queue responses carry the model used for computation
- Composite pursuit score and contractor relevance remain separate
- Current contractor-relevance threshold: 43
- Default `scope=construction` filters the reviewed source pool
- `scope=all` preserves the complete retrieved procurement view
- Responses report source count, excluded count, returned count, scope, and relevance threshold

### Explicit source states

- `live_official`
- `sample_fallback`
- `source_unavailable`

Controls:

- `view=queue`
- `scope=construction` default
- `scope=all`
- bounded `limit`
- `fallback=none`

`fallback=none` returns HTTP 503 with zero fabricated records when the source is unavailable. Raw upstream rows are omitted from public responses.

### Production review cockpit

- Component: `components/labs/civicbid/CivicBidLiveCockpit.tsx`
- Route: `/labs/civicbid-signal-forge`
- Route remains no-index
- Displays source mode, retrieval time, official dataset link, reviewed/excluded/returned counts, contractor/all-procurement controls, ranked opportunities, score components, and human-review boundary
- UI reads scoring weights from the API response

## PR #12 Validation Completed

- GitHub Actions typecheck: passed
- GitHub Actions lint: passed
- GitHub Actions build: passed
- Governance checks: passed
- Vercel production deployment: READY
- Permanent-domain review route: HTTP 200 with no-index metadata
- Permanent-domain strict live API: HTTP 200, `mode: live_official`, `fallbackUsed: false`
- Validated production request reviewed 40 official rows, excluded 26, and returned 10 contractor-ranked records
- `scope=all` preserves the wider source feed
- Raw upstream payload omission verified
- Natural source outage verified explicit `sample_fallback`
- Natural source outage with `fallback=none` verified HTTP 503 `source_unavailable` with zero fabricated records
- Threshold 43 removed weak tire-retreading, hardware-only, and material-only false positives while retaining construction, renovation, sewer, façade, elevator, floor-tile installation, and design-build records

## What PR #13 Changes

PR #13 changes the indexed canonical route `/labs/civicbid-intelligence-bridge` only, plus governance records.

The route now:

- makes `CivicBidLiveCockpit` the primary live contractor surface
- preserves the existing product narrative, source registry, product modules, discipline translation, related proof, and pilot pathway
- retains `CivicBidWorkbench` as an explicitly synthetic deterministic scenario lab
- replaces obsolete no-live-feed claims with explicit live/sample/unavailable source-state language
- uses new local metric and publication-boundary statements aligned with the validated API
- keeps official agency records and bid documents controlling
- does not change the API, connector, normalization, scoring, or threshold

## PR #13 Scope

Expected changed paths:

- `app/labs/civicbid-intelligence-bridge/page.tsx`
- `ENGINEERING/FEATURE_PASSPORTS/CIVICBID_LIVE_COCKPIT_V1.md`
- `ENGINEERING/PRODUCT_REGISTRY.yaml`
- `docs/HANDOVER.md`

No other product or global platform path belongs in this PR.

## PR #13 Validation Required

- exact-head typecheck
- exact-head lint
- exact-head build
- Vercel preview READY
- canonical route renders the live cockpit
- live contractor request remains `live_official`
- all-procurement control remains available
- synthetic scenario lab remains clearly labeled
- obsolete no-live-feed language is absent from the canonical route
- source-state, official-record, and human-review boundaries remain visible
- desktop and mobile layout review
- public-route metadata and indexability review
- changed-file scope review

## Known Review Points

- Upstream Socrata schema may change and requires schema-drift monitoring before production maturity
- A published due date can still be stale or amended; official bid documents remain controlling
- Keyword relevance can produce false positives or false negatives and is not a certified trade classification
- Compliance scoring detects published signals, not legal sufficiency
- No unit-test runner is currently configured; this slice relies on strict TypeScript, runtime invariants, CI, deployed integration review, and human review
- The canonical route is indexed, so PR #13 must not merge with contradictory or overstated source claims
- The no-index `/labs/civicbid-signal-forge` route should remain available as a focused review/reference surface after canonical integration

## Next Recommended Tasks

1. Complete exact-head CI and Vercel preview validation for PR #13.
2. Correct any type, lint, build, visual, source-state, metadata, or disclosure defect.
3. Review the canonical route from contractor-president and chief-estimator perspectives.
4. Confirm the final PR contains only the four expected paths.
5. Mark PR #13 ready only after the indexed route is accepted.
6. Merge PR #13 to `main` and verify the production custom domain.
7. After an observation period, review whether CivicBid can move from `rescue` to `active_lab` and whether donor branches can receive final dispositions.
