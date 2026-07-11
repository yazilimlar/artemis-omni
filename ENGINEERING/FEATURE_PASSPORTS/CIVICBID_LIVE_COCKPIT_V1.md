# Feature Passport — CivicBid Live Cockpit v1

## Identity

- ID: civicbid-live-cockpit-v1
- Name: CivicBid Live Cockpit v1
- Division: Infrastructure & Construction
- Product family: civicbid
- Product: CivicBid
- Owner / review authority: Artemis product owner
- Lifecycle status: rescue
- Commercial maturity: public-safe demo moving into the canonical product route
- Visibility class: public canonical route plus noindex review route
- Data mode: mixed_explicit
- Version: 0.3.0-canonical-integration
- Created: 2026-07-11
- Modified: 2026-07-11

## Canonical Implementation

- Canonical product route: `/labs/civicbid-intelligence-bridge`
- No-index review route: `/labs/civicbid-signal-forge`
- Public API route: `/api/civicbid/signal-forge`
- Canonical branch: `main`
- Validated API/cockpit merge: PR #12, commit `7b0cd8b72be908b66ea648a1ac3791db87292306`
- Active canonical-integration branch: `feature/civicbid-canonical-bridge-integration-v1`
- Active canonical-integration PR: #13
- Product Registry entry: `civicbid`
- Division Registry entry: `infrastructure-construction`
- Source-of-truth data/system: official agency records and bid documents; NYC Open Data is the first machine-readable discovery source

## Purpose

Create a contractor-facing opportunity triage system that can ingest an official public source, preserve the full feed truth, identify contractor-relevant records, rank them deterministically, and state clearly whether the response is live, sample fallback, or unavailable. The canonical bridge must connect that live discovery layer to explicitly synthetic pursuit scenarios without confusing the two data modes.

## Scope

In scope:

- Official NYC Socrata connector
- Public opportunity normalization
- One executable five-factor scoring formula
- Explicit live, sample-fallback, and source-unavailable API states
- Explicit `construction` and `all` source scopes
- Public-safe source provenance and retrieval timestamps
- CivicBid-owned live cockpit consuming the API contract
- Canonical route integration
- Retention of the deterministic scenario workbench with explicit synthetic labeling

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
- Migration record: GitHub Issue #11, PR #12, and PR #13
- Retirement/deprecation condition: donor branches remain preserved until CivicBid-only capability parity and disposition are documented

## Dependencies

- Code: Next.js route handlers, React client components, and TypeScript
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
- Canonical-page behavior:
  - the live cockpit consumes the API contract
  - the retained pursuit-mode workbench is explicitly synthetic
  - live and synthetic content must never share an unlabeled state
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
- Presentation rule: live UI reads the model from the API response and must not maintain a separate scoring formula
- Relevance rule: composite score and contractor relevance are separate; non-construction urgency cannot silently become contractor fit
- Current contractor-relevance threshold: 43

## Architecture Links

- Related ADRs: ADR-005 and ADR-006
- Related docs: `ENGINEERING/PRODUCT_REGISTRY.yaml`, `ENGINEERING/BRANCH_LIFECYCLE.md`, `docs/HANDOVER.md`
- Related milestone: multi-division AIEOS v2 and CivicBid selective rescue
- Related issue: #11
- Related PRs: #12 and #13

## Security and Privacy

- Secrets involved: none
- Public/private data boundary: public official data and clearly synthetic samples only
- User data handling: none in this slice
- Internal operational information exposed: none
- Authentication/authorization: public read-only API, public canonical route, and no-index review route
- Known risks: upstream schema drift, date ambiguity, stale public records, keyword false positives/negatives, scoring overconfidence, and future UI label drift

## Validation

PR #12 / production foundation:

- Typecheck, lint, build, and governance checks: passed
- Vercel production deployment: READY on `main` commit `7b0cd8b72be908b66ea648a1ac3791db87292306`
- Permanent-domain API: verified HTTP 200 `live_official` with `fallback=none`
- Permanent-domain review route: verified HTTP 200 with no-index metadata
- Raw upstream payload omission: verified
- Canonical scoring-model response and 100-percent invariant: verified
- Contractor relevance threshold 43: verified against deployed live records
- Natural outage paths: explicit `sample_fallback` and HTTP 503 `source_unavailable` verified

PR #13 / canonical integration:

- Typecheck: pending exact-head CI
- Lint: pending exact-head CI
- Build: pending exact-head CI
- Vercel preview: pending
- Indexed canonical-route language review: pending
- Live/synthetic visual separation: pending deployed review
- Desktop/mobile review: pending
- Security/secret scan: pending final CI/review

## Lifecycle and Commercial Path

- Current lifecycle: rescue moving toward active lab
- Current maturity: public-safe live discovery capability with canonical integration under review
- Next maturity gate: validated canonical-route preview and contractor workflow review
- Pilot requirements: source-state visibility, source links, scoring explanation, human-review disclaimer, source-health behavior, and contractor usability review
- Production requirements: monitoring, schema-drift handling, tests, source health, accessibility, and product-owner approval
- Subscription/auth requirements: none for this public demonstration slice
- Deprecation condition: superseded by a tested canonical CivicBid service with equal or better provenance and mode transparency

## Roadmap

- Next: validate PR #13 on the canonical route and correct any claim, layout, or data-mode defect before merge
- Then: merge the canonical integration and update lifecycle from rescue to active lab when product-owner review is complete
- Later: add vetted official sources, saved pursuits, authenticated contractor workflows, document custody, and source-health monitoring
- Not planned: brittle scraping, automated bid submission, or silent inference presented as certified fact

## AI Notes

Before modifying this feature, read the Product Registry, ADR-006, this passport, Issue #11, and the exact donor-path exclusions. Do not merge donor branches wholesale, recreate live scoring text separately from `SIGNAL_FORGE_SCORING_MODEL`, represent keyword relevance as a certified construction classification, or blur the retained synthetic scenario lab with the live official cockpit.
