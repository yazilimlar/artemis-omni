# Feature Passport — CivicBid Live Cockpit v1

## Identity

- ID: civicbid-live-cockpit-v1
- Name: CivicBid Live Cockpit v1
- Division: Infrastructure & Construction
- Product family: civicbid
- Product: CivicBid
- Owner / review authority: Artemis product owner
- Lifecycle status: rescue
- Commercial maturity: public-safe demo under review
- Visibility class: public-safe demo
- Data mode: mixed_explicit
- Version: 0.1.0-rescue
- Created: 2026-07-11
- Modified: 2026-07-11

## Canonical Implementation

- Canonical route: `/labs/civicbid-intelligence-bridge` remains the current public product route
- Rescue API route: `/api/civicbid/signal-forge`
- Canonical branch: `main`
- Active rescue branch: `rescue/civicbid-live-cockpit-v1`
- Canonical commit or release tag: pending reviewed merge
- Product Registry entry: `civicbid`
- Division Registry entry: `infrastructure-construction`
- Source-of-truth data/system: official agency records and bid documents; NYC Open Data is the first machine-readable discovery source

## Purpose

Create a contractor-facing opportunity triage foundation that can ingest an official public source, normalize records, rank them deterministically, and state clearly whether the response is live, sample fallback, or unavailable.

## Scope

In scope:

- Official NYC Socrata connector
- Public opportunity normalization
- One executable five-factor scoring formula
- Explicit live, sample-fallback, and source-unavailable API states
- Public-safe source provenance and retrieval timestamps
- A later CivicBid-owned cockpit UI consuming this contract

Out of scope:

- Certified bid-feed claims
- Automated bidding or legal/compliance determinations
- Scraping login-protected or commercial systems
- ArtemisIX19, Studio, Time Atlas, Evolution Console, global redesign, and unrelated donor changes
- Credentials, client data, or private opportunity records

## Product and Division Boundaries

- Product-specific responsibilities: procurement-source connection, normalization, triage scoring, source-state communication, and bid-room decision support
- Shared Artemis Core capabilities consumed: public-safety language, provenance, deterministic computation, preview-first delivery, and human-review controls
- Cross-division dependencies: none in this slice
- Other products explicitly not owned by this feature: ArtemisIX19, Studio, Atlas, Utility Field Claims, and company-history surfaces
- Allowed import directions: CivicBid route/components → CivicBid libraries → shared types and platform UI
- Forbidden import directions: CivicBid libraries → unrelated product implementations

## Testbed and Donor Provenance

- Testbed ancestry: CivicBid Signal Forge and SourceLedger prototypes
- Donor branches:
  - `test/civicbid-signal-forge`
  - `fix/civicbid-signal-forge-cockpit`
  - `feature/civicbid-sourceledger-command-deck`
- Selected source paths:
  - `app/api/civicbid/signal-forge/route.ts`
  - `lib/civicbid/connectors/socrata.ts`
  - `lib/civicbid/normalizeOpportunity.ts`
  - `lib/civicbid/signalForgeScoring.ts`
- Excluded donor concerns: all non-CivicBid routes, packages, branding, standalone libraries, and product code
- Migration disposition: selectively reimplemented and hardened from current `main`; no donor branch merge
- Migration record: GitHub Issue #11 and the pull request from `rescue/civicbid-live-cockpit-v1`
- Retirement/deprecation condition: donor branches remain preserved until CivicBid-only capability parity and disposition are documented

## Dependencies

- Code: Next.js route handlers and TypeScript
- Data: NYC Open Data Current Solicitations Socrata endpoint
- Third-party services: public Socrata API only
- Environment variables: none
- External assets: none
- Shared platform interfaces: `types/civicbid.ts`

## Data Truth

- Declared data mode: `mixed_explicit`
- Live source and retrieval method: official NYC Socrata JSON endpoint through a bounded server-side connector
- Sample/synthetic source: local records with `SAMPLE` titles, sample IDs, `sample_data` confidence, and `recordMode: sample`
- Fallback behavior: default fallback is explicit `sample_fallback`; `fallback=none` produces `source_unavailable` with HTTP 503
- Timestamp/freshness behavior: every response and record carries retrieval time; server connector revalidation is bounded
- Human-review boundary: all opportunities, scores, compliance signals, dates, and documents require independent review against the official record
- Official source-of-truth statement: CivicBid assists discovery and triage; the official agency record and bid documents remain controlling

## Architecture Links

- Related ADRs: ADR-005 and ADR-006
- Related docs: `ENGINEERING/PRODUCT_REGISTRY.yaml`, `ENGINEERING/BRANCH_LIFECYCLE.md`, `docs/HANDOVER.md`
- Related milestone: multi-division AIEOS v2 and CivicBid selective rescue
- Related issue: #11

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public official data and clearly synthetic samples only
- User data handling: none in this slice
- Internal operational information exposed: none
- Authentication/authorization: public read-only route
- Known risks: upstream schema drift, date ambiguity, stale public records, scoring overconfidence, and future UI label drift

## Validation

- Typecheck: pending CI
- Lint: pending CI
- Build: pending CI
- Unit tests: no test runner currently configured; scoring has a runtime 100-percent weight invariant
- Integration tests: pending deployed API checks for all three response modes
- Browser QA: pending cockpit slice
- Accessibility: not applicable to API slice
- Performance: bounded 1–100 row request, eight-second timeout, no raw rows returned publicly
- Security/secret scan: pending CI/review
- Data-mode claim verification: required before merge
- Function-parity verification: scoring and live-source capability only; donor UI parity intentionally deferred

## Lifecycle and Commercial Path

- Current lifecycle: rescue
- Current maturity: public-safe API foundation under review
- Next maturity gate: validated preview plus CivicBid-owned cockpit integration
- Pilot requirements: source-state visibility, source links, scoring explanation, human-review disclaimer, and contractor workflow review
- Production requirements: monitoring, schema-drift handling, tests, source health, accessibility, and product-owner approval
- Subscription/auth requirements: none for this public demonstration slice
- Deprecation condition: superseded by a tested canonical CivicBid service with equal or better provenance and mode transparency

## Roadmap

- Next: deploy and verify the API contract; connect a public-safe cockpit that imports the scoring model directly
- Later: add vetted official sources, saved pursuits, authenticated contractor workflows, and source-health monitoring
- Not planned: brittle scraping, automated bid submission, or silent inference presented as certified fact

## AI Notes

Before modifying this feature, read the Product Registry, ADR-006, this passport, Issue #11, and the exact donor-path exclusions. Do not merge donor branches wholesale or recreate scoring text separately from `SIGNAL_FORGE_SCORING_MODEL`.
