# Handover: Session 2026-07-11 — CivicBid Live Cockpit Rescue v1

Standardized, parse-friendly handover. Historical states remain available through Git, pull requests, issues, and dated files under `docs/evolution/`.

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical integration branch: `main`
- GitHub default branch: `main`
- PR #9 merged to `main`: `8a5435ee82da774fa0e9255289de09c04730b64d`
- Public Evolution & Structure route is now part of `main`
- Current work branch: `rescue/civicbid-live-cockpit-v1`
- Rescue baseline: exact post-PR-#9 `main` commit `8a5435ee82da774fa0e9255289de09c04730b64d`
- Tracking issue: GitHub Issue #11
- Vercel production deployment for PR #9 was triggered from `main`; verify READY state and custom-domain alias before closing the publication step

## Division and Product Ownership

- Division: Infrastructure & Construction
- Product family: civicbid
- Product: CivicBid
- Change class: selective rescue and public API foundation
- Lifecycle: rescue
- Visibility: public-safe demo
- Data mode: mixed_explicit
- Governing ADRs: ADR-005 and ADR-006
- Feature passport: `ENGINEERING/FEATURE_PASSPORTS/CIVICBID_LIVE_COCKPIT_V1.md`

## Completed Before This Branch

PR #8 established the multi-division AIEOS v2 governance and registries.

PR #9 published the public-safe Artemis Evolution & Structure record, branch-lifecycle explanation, public JSON projection, and memorialization policy.

## Rescue Rule

Do not merge any CivicBid donor branch wholesale.

Allowed selective donors:

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

## What This Branch Adds

### CivicBid data contract

- `types/civicbid.ts` now declares explicit live/sample record modes without breaking existing product records
- `lib/civicbid/normalizeOpportunity.ts` normalizes official public rows, timestamps dates, labels official API confidence, and retains raw evidence only internally
- `lib/civicbid/connectors/socrata.ts` adds bounded row limits, an eight-second timeout, response-shape validation, and a credential-free official-source connector

### Canonical scoring

- `lib/civicbid/signalForgeScoring.ts` defines one executable five-factor model:
  - due-date urgency: 30%
  - document availability: 25%
  - source confidence: 20%
  - construction fit: 15%
  - compliance clarity: 10%
- Runtime invariant requires weights to total exactly 100%
- Queue responses carry the scoring model used for computation so future UI cannot maintain a separate contradictory formula

### Explicit sample behavior

- `lib/civicbid/signalForgeSamples.ts` contains synthetic records only
- Every sample has a `CIVICBID-SAMPLE-*` ID, a `SAMPLE —` title, `sample_data` confidence, and `recordMode: sample`
- No sample record may impersonate a current solicitation

### API foundation

- `/api/civicbid/signal-forge`
- Supported response modes:
  - `live_official`
  - `sample_fallback`
  - `source_unavailable`
- Default behavior may use clearly labeled sample fallback
- `fallback=none` returns HTTP 503 with `source_unavailable` and no fabricated records
- `view=queue` returns deterministic scores and the canonical scoring-model definition
- Raw upstream rows are omitted from the public response

### Governance records

- Product Registry records the active rescue branch, Issue #11, donor scope, blockers, and next gate
- Feature passport records provenance, product boundaries, data truth, security boundary, validation gates, and roadmap

## Verification Required

Run through GitHub Actions and Vercel preview:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- inspect default API response
- inspect `?view=queue`
- inspect `?fallback=none`
- confirm the live source reports `live_official` when reachable
- confirm fallback records report `sample_fallback` and remain unmistakably synthetic
- confirm unavailable mode returns HTTP 503 and no sample data
- confirm no raw upstream payload, credentials, private records, or unrelated donor code is exposed

## Known Review Points

- Upstream Socrata schema may change and requires schema-drift monitoring before production maturity
- A published due date can still be stale or amended; official bid documents remain controlling
- Compliance scoring detects published signals, not legal sufficiency
- No unit-test runner is currently configured; the first slice relies on strict TypeScript, runtime invariants, CI, and deployed integration checks
- The public cockpit UI is intentionally deferred until the API contract passes validation

## Next Recommended Tasks

1. Open a draft PR from `rescue/civicbid-live-cockpit-v1` to `main`.
2. Complete CI and deployed API verification.
3. Correct any type, lint, build, source-state, or disclosure defect before UI work.
4. Add a CivicBid-owned cockpit component that imports `SIGNAL_FORGE_SCORING_MODEL` directly.
5. Connect the canonical CivicBid public route to explicit live/sample/unavailable states.
6. Review contractor-president and chief-estimator usability before merge to production.
