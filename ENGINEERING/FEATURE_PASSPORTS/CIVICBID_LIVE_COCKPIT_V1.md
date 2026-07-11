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
- Visibility class: noindex_review
- Data mode: mixed_explicit
- Version: 0.2.0-rescue
- Created: 2026-07-11
- Modified: 2026-07-11

## Canonical Implementation

- Canonical product route: `/labs/civicbid-intelligence-bridge` remains the current public product narrative
- No-index rescue review route: `/labs/civicbid-signal-forge`
- Rescue API route: `/api/civicbid/signal-forge`
- Canonical branch: `main`
- Active rescue branch: `rescue/civicbid-live-cockpit-v1`
- Canonical commit or release tag: pending reviewed merge
- Product Registry entry: `civicbid`
- Division Registry entry: `infrastructure-construction`
- Source-of-truth data/system: official agency records and bid documents; NYC Open Data is the first machine-readable discovery source

## Purpose

Create a contractor-facing opportunity triage system that can ingest an official public source, preserve the full feed truth, identify contractor-relevant records, rank them deterministically, and state clearly whether the response is live, sample fallback, or unavailable.

## Scope

In scope:

- Official NYC Socrata connector
- Public opportunity normalization
- One executable five-factor scoring formula
- Explicit live, sample-fallback, and source-unavailable API states
- Explicit `construction` and `all` source scopes
- Public-safe source provenance and retrieval timestamps
- A CivicBid-owned live review cockpit consuming the API contract

Out of scope:

- Certified bid-feed claims
- Automated bidding or legal/compliance determinations
- Scraping login-protected or commercial systems
- Saved pursuits, CRM write-back, document custody, and authenticated contractor accounts
- ArtemisIX19, Studio, Time Atlas, Evolution Console, global redesign, and unrelated donor changes
- Credentials, client data, or private opportunity records

## Product and Division Boundaries

- Product-specific responsibilities: procurement-source connection, normalization, contractor relevance, triage scoring, source-state communication, and bid-room decision support
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
- Selected CivicBid concepts:
  - official public-source connector
  - normalization
  - deterministic ranking
  - bid-readiness presentation patterns
- Excluded donor concerns: all non-CivicBid routes, packages, branding, standalone libraries, and product code
- Migration disposition: selectively reimplemented and hardened from current `main`; no donor branch merge
- Migration record: GitHub Issue #11 and PR #12
- Retirement/deprecation condition: donor branches remain preserved until CivicBid-only capability parity and disposition are documented

## Dependencies

- Code: Next.js route handlers, React client component, and TypeScript
- Data: NYC Open Data Current Solicitations Socrata endpoint
- Third-party services: public Socrata API only
- Environment variables: none
- External assets: none
- Shared platform interfaces: `types/civicbid.ts`

## Data Truth

- Declared data mode: `mixed_explicit`
- Live source and retrieval method: official NYC Socrata JSON endpoint through a bounded server-side connector
- Sample/synthetic source: local records with `SAMPLE` titles, sample IDs, `sample_data` confidence, and `recordMode: sample`
- Fallback behavior: default fallback is explicit `sample_fallback`; `fallback=none` produces `source_unavailable` with HTTP 503 when the source cannot be reached
- Scope behavior:
  - default `scope=construction` filters the reviewed source pool by an exported contractor-relevance threshold
  - `scope=all` preserves access to all retrieved procurement categories
  - responses report source, excluded, and returned counts
- Timestamp/freshness behavior: every response and record carries retrieval time; server connector revalidation is bounded
- Human-review boundary: all opportunities, scores, compliance signals, dates, and documents require independent review against the official record
- Official source-of-truth statement: CivicBid assists discovery and triage; the official agency record and bid documents remain controlling

## Scoring Contract

- Due-date urgency: 30%
- Document availability: 25%
- Source confidence: 20%
- Construction fit: 15%
- Compliance clarity: 10%
- Runtime invariant: weights must total exactly 100%
- Presentation rule: UI reads the model from the API response and must not maintain a separate scoring formula
- Relevance rule: composite score and contractor relevance are separate; non-construction urgency cannot silently become contractor fit

## Architecture Links

- Related ADRs: ADR-005 and ADR-006
- Related docs: `ENGINEERING/PRODUCT_REGISTRY.yaml`, `ENGINEERING/BRANCH_LIFECYCLE.md`, `docs/HANDOVER.md`
- Related milestone: multi-division AIEOS v2 and CivicBid selective rescue
- Related issue: #11
- Related PR: #12

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public official data and clearly synthetic samples only
- User data handling: none in this slice
- Internal operational information exposed: none
- Authentication/authorization: public read-only API and no-index review page
- Known risks: upstream schema drift, date ambiguity, stale public records, keyword false positives/negatives, scoring overconfidence, and future UI label drift

## Validation

- Live official API preview: verified on the first deployed API slice
- Raw upstream payload omission: verified on the first deployed API slice
- Canonical scoring-model response: verified on the first deployed API slice
- Contractor filtering and review route: pending final branch CI and preview verification
- Typecheck: pending final branch CI
- Lint: pending final branch CI
- Build: pending final branch CI
- Unit tests: no test runner currently configured; scoring has a runtime 100-percent weight invariant
- Unavailable and fallback branches: code-path review complete; live source availability prevented an external outage-path execution during this session
- Browser QA: pending deployed desktop/mobile review
- Accessibility: keyboard controls, semantic buttons, status text, and native links implemented; visual review pending
- Performance: bounded source pool, 1–100 returned records, eight-second timeout, no raw rows returned publicly
- Security/secret scan: pending final CI/review
- Data-mode claim verification: required before merge
- Function-parity verification: live-source and scoring capability only; donor branch-wide UI parity is not a goal

## Lifecycle and Commercial Path

- Current lifecycle: rescue
- Current maturity: no-index public-safe review
- Next maturity gate: validated live cockpit preview and contractor workflow review
- Pilot requirements: source-state visibility, source links, scoring explanation, human-review disclaimer, source-health behavior, and contractor usability review
- Production requirements: monitoring, schema-drift handling, tests, source health, accessibility, and product-owner approval
- Subscription/auth requirements: none for this public demonstration slice
- Deprecation condition: superseded by a tested canonical CivicBid service with equal or better provenance and mode transparency

## Roadmap

- Next: validate PR #12 and the deployed `/labs/civicbid-signal-forge` route; correct defects before promotion
- Then: connect the reviewed live cockpit into the canonical CivicBid product bridge
- Later: add vetted official sources, saved pursuits, authenticated contractor workflows, document custody, and source-health monitoring
- Not planned: brittle scraping, automated bid submission, or silent inference presented as certified fact

## AI Notes

Before modifying this feature, read the Product Registry, ADR-006, this passport, Issue #11, and the exact donor-path exclusions. Do not merge donor branches wholesale, recreate scoring text separately from `SIGNAL_FORGE_SCORING_MODEL`, or represent keyword relevance as a certified construction classification.
