# CivicBid — The Bid Room v2.1 UI Integration

## Identity

- Product: CivicBid
- Interface: The Bid Room v2.1
- Owning division: Infrastructure & Construction
- Lifecycle status: interface review
- Visibility: no-index review route
- Data mode: live public direct-browser queries with explicit source-health states
- Tracking issue: #15
- Base production commit: `7d620ff7d935375a3c9ca59fce8b155c9818ac02`
- Active branch: `feature/civicbid-bid-room-v2-1-ui`

## Purpose

Evaluate the user-provided standalone Bid Room interface as the preferred contractor-facing
visual and workflow model for CivicBid. Preserve its editorial bid-board density, deadline-first
rows, Today digest, pursuit storage, award wire, agency intelligence, source health, exports,
and Day/Night/Auto theme behavior while retaining Artemis provenance and official-record boundaries.

## Canonical and Review Surfaces

- Canonical product route: `/labs/civicbid-intelligence-bridge`
- No-index interface review route: `/labs/civicbid-signal-forge`
- Controlled static artifact: `/civicbid/the-bid-room-v2-1.html`
- Existing governed queue API: `/api/civicbid/signal-forge`

The static review artifact is not yet the canonical data adapter. It runs the donor file's public
City Record queries client-side so visual and workflow parity can be reviewed before server-side
migration.

## Donor Capabilities Retained

- Today change digest
- Material-field fingerprints and disappeared-record alerts
- Open-bid deadline board
- Browser-local shortlist, notes, profile, watchlists, and pursuit planning
- Award Wire and agency notice-activity summaries
- PIN-family similarity review with confidence labels
- CSV formula-injection protection
- RFC-oriented calendar export
- Per-feed source-health states and refresh cooldown
- Accessible tab semantics, focus management, skip link, and reduced-motion behavior
- Day → Night → Auto appearance cycle with no-flash initialization

## Theme and Visibility Corrections

- Day secondary/faint text changed from `#8b93a0` to `#596472`.
- Night secondary/faint text changed from `#6b7684` to `#aab5c3`.
- Day amber changed from `#b06a12` to `#92540b`.
- Native form-control color scheme follows the effective theme.
- Theme control displays the current preference and announces the next preference.
- Auto mode continues to follow `prefers-color-scheme`.
- Existing `prefers-contrast`, visible focus, and reduced-motion rules remain.

## Public Boundaries

- The City Record publication and named agency systems remain authoritative.
- Trade tags are keyword detections, not official classifications.
- PIN grouping is identifier similarity, not confirmed contractual lineage.
- Probability-weighted scenario value is not a revenue forecast.
- Contractor planning milestones are not agency dates.
- No production secret or private record is used.
- No sample data may impersonate a live record.

## Migration Plan

1. Review exact visual parity and theme behavior on the no-index route.
2. Complete desktop and mobile day/night validation.
3. Map the donor solicitation and award fields to governed same-origin adapters.
4. Add automated contract tests and source-health monitoring under Issue #14.
5. Decide whether the Bid Room replaces the current canonical cockpit or becomes its primary
   workflow surface with the scoring cockpit retained as an analytical subview.

## Validation

- Donor HTML parsed successfully.
- Both inline script blocks pass `node --check`.
- Contrast corrections were calculated against day paper/sheet and night paper/sheet backgrounds.
- Typecheck, lint, build, Vercel preview, and browser screenshot review remain required on the branch.

## Explicit Exclusions

- No merge of historical CivicBid donor branches.
- No scoring-weight or contractor-threshold change.
- No unrelated site, product, package, or navigation redesign.
- No authenticated CRM, document ingestion, or automated submission.
- No promotion to `main` before exact-head review.
