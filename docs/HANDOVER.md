# Handover: Session 2026-07-11 — CivicBid Live Cockpit Rescue v1

Standardized, parse-friendly handover. Historical states remain available through Git, pull requests, issues, and dated files under `docs/evolution/`.

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical integration branch: `main`
- GitHub default branch: `main`
- PR #9 merged to `main`: `8a5435ee82da774fa0e9255289de09c04730b64d`
- Public Evolution & Structure route is live at `https://artemis.agoraxai.com/evolution`
- PR #9 production deployment was verified READY on Vercel with the custom domain assigned and no alias error
- Current work branch: `rescue/civicbid-live-cockpit-v1`
- Rescue baseline: exact post-PR-#9 `main` commit `8a5435ee82da774fa0e9255289de09c04730b64d`
- Tracking issue: GitHub Issue #11
- Draft implementation PR: GitHub PR #12

## Division and Product Ownership

- Division: Infrastructure & Construction
- Product family: civicbid
- Product: CivicBid
- Change class: selective rescue, public API, and no-index review cockpit
- Lifecycle: rescue
- Visibility: noindex_review
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

## What PR #12 Adds

### CivicBid data contract

- `types/civicbid.ts` declares explicit live/sample record modes without breaking existing product records
- `lib/civicbid/normalizeOpportunity.ts` normalizes official public rows, timestamps dates, labels official API confidence, and retains raw evidence only internally
- `lib/civicbid/connectors/socrata.ts` adds bounded row limits, an eight-second timeout, response-shape validation, publication-date ordering, and a credential-free official-source connector

### Canonical scoring and relevance

- `lib/civicbid/signalForgeScoring.ts` defines one executable five-factor model:
  - due-date urgency: 30%
  - document availability: 25%
  - source confidence: 20%
  - construction fit: 15%
  - compliance clarity: 10%
- Runtime invariant requires weights to total exactly 100%
- Queue responses carry the model used for computation so presentation code cannot maintain a separate contradictory formula
- Composite pursuit score and contractor relevance are separate
- Default contractor scope omits rows without detected construction signals; `scope=all` preserves the complete retrieved procurement view
- The response reports source count, excluded count, returned count, scope, and relevance threshold

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
- Supported views and controls:
  - `view=queue`
  - `scope=construction` default
  - `scope=all`
  - bounded `limit`
  - `fallback=none`
- Default behavior may use clearly labeled sample fallback
- `fallback=none` returns HTTP 503 with `source_unavailable` and no fabricated records when the source fails
- Raw upstream rows are omitted from the public response

### Live review cockpit

- `components/labs/civicbid/CivicBidLiveCockpit.tsx`
- `/labs/civicbid-signal-forge`
- Route is no-index during rescue review
- Displays source mode, retrieval time, official dataset link, reviewed/excluded/returned counts, contractor/all-procurement controls, ranked opportunity cards, score components, and human-review boundary
- The UI reads scoring weights from the API response rather than restating them independently
- The canonical `/labs/civicbid-intelligence-bridge` remains unchanged until the live route passes review

### Governance records

- Product Registry records the active rescue branch, Issue #11, donor scope, blockers, and next gate
- Feature passport records provenance, product boundaries, source scope, scoring truth, security boundary, validation gates, and roadmap

## Verification Completed Before Final UI Commit

A deployed preview of the API returned:

- HTTP 200
- `mode: live_official`
- real current records from NYC Open Data
- official source and retrieval metadata
- no raw upstream payload
- queue response with the canonical 30/25/20/15/10 model

That review identified and corrected a product defect: non-construction opportunities could rank highly because urgency and source confidence were strong. The final branch now separates contractor relevance from composite score and defaults to the contractor scope.

## Final Verification Required

Run against the final PR #12 head:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- inspect `/labs/civicbid-signal-forge` on desktop and mobile
- inspect default contractor queue
- inspect `scope=all`
- inspect API response metadata and raw-payload omission
- confirm the live source reports `live_official` when reachable
- confirm scoring weights total 100 and UI labels come from the API response
- confirm route metadata remains no-index during review
- confirm fallback and unavailable code paths remain unmistakably labeled and do not fabricate live records

## Known Review Points

- Upstream Socrata schema may change and requires schema-drift monitoring before production maturity
- A published due date can still be stale or amended; official bid documents remain controlling
- Keyword relevance can produce false positives or false negatives and is not a certified trade classification
- Compliance scoring detects published signals, not legal sufficiency
- No unit-test runner is currently configured; this slice relies on strict TypeScript, runtime invariants, CI, deployed integration review, and human review
- The canonical CivicBid product route still contains earlier public-safe language stating that it is not a live feed; do not revise that route until the new cockpit is approved and promoted

## Next Recommended Tasks

1. Complete final CI and preview validation for PR #12.
2. Correct any type, lint, build, visual, source-state, or disclosure defect.
3. Review the no-index live cockpit from contractor-president and chief-estimator perspectives.
4. Mark PR #12 ready only after the review route is accepted.
5. Merge the validated rescue to `main`.
6. In a later scoped PR, promote the live cockpit into `/labs/civicbid-intelligence-bridge` and revise obsolete no-live-feed language.
