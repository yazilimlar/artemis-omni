# CivicBid — The Bid Room v2.1 UI Integration

## Identity

- Product: CivicBid
- Interface: The Bid Room v2.1
- Owning division: Infrastructure & Construction
- Lifecycle status: public lab release candidate
- Visibility: public route with `noindex,nofollow` metadata
- Data mode: live public direct-browser queries with explicit source-health states
- Primary tracking issue: #15
- Deadline-sanity hotfix: #17
- Target branch: `main`
- Release branch: `feature/civicbid-bid-room-v2-1-ui`
- Hotfix branch: `hotfix/civicbid-deadline-sanity-v1`

## Purpose

Use the user-provided standalone Bid Room interface as the contractor-facing visual and workflow
model for CivicBid while preserving Artemis provenance, source-health disclosure, and official-record
boundaries. The interface retains its editorial bid-board density, deadline-first rows, Today digest,
pursuit storage, Award Wire, agency intelligence, exports, and Day/Night/Auto theme behavior.

## Public Surfaces

- Canonical CivicBid route: `/labs/civicbid-intelligence-bridge`
- Public Bid Room route: `/labs/civicbid-signal-forge`
- Full-screen artifact loader: `/civicbid/the-bid-room-v2-1.html`
- Generated payload chunks: `/civicbid/the-bid-room-v2-1.payload.0.txt` through `.3.txt`
- Existing governed queue API: `/api/civicbid/signal-forge`

The Bid Room route is publicly accessible but intentionally excluded from search indexing during the
public demonstration phase. It still runs the donor file's public City Record queries client-side.
The governed same-origin CivicBid adapter remains the production migration path.

## Complete Artifact Handling

The complete patched HTML is stored as four gzip/base64 payload chunks and reconstructed by a
same-origin loader. The loader verifies the expected decompressed byte length and fails visibly if a
chunk is missing or corrupt.

- Reconstructed artifact: 84,678 UTF-8 bytes / 1,165 source lines
- SHA-256: `fde9db8802d701af14908aa7290f381ef71309a75638ba5a96cb78d3ec65a51c`
- Private build attribution (George Oktem · IPC Resiliency Partners) removed in release v2.1

## Donor Capabilities Retained

- Today change digest
- Material-field fingerprints and disappeared-record alerts
- Open-bid deadline board
- Browser-local shortlist, notes, profile, watchlists, and pursuit planning
- Award Wire and agency notice-activity summaries
- PIN-family similarity review with confidence labels
- CSV and JSON exports, briefing copy, and formula-injection protection
- RFC-oriented calendar export
- Probability-weighted pursuit scenario math with explicit disclaimer
- Per-feed source-health states, last-good data handling, and refresh cooldown
- Accessible tab semantics, focus management, skip link, and reduced-motion behavior
- Day → Night → Auto appearance cycle with no-flash initialization

## Initial Tab Rule

After the Today badge first resolves from its loading state to a numeric value:

- `Today = 0`: activate **Open Bids** as the initial working tab.
- `Today > 0`: retain **Today** as the initial tab.
- Apply the decision once per page load so later refreshes and renders never override a user's manual
  tab selection.

The rule is injected by the verified artifact loader, so the complete payload and its checksum remain
unchanged.

## Deadline Sanity Rule

City Record records can contain far-future placeholder or open-ended dates that are not ordinary bid
deadlines. A visible value such as `26793 days left` maps from July 11, 2026 to November 18, 2099 and
must not be presented as a normal contractor countdown.

The runtime adapter therefore classifies a due date as `deadline_needs_verification` when any of the
following is true:

- the date cannot be parsed into a valid calendar date;
- the source year is 2090 or later; or
- the calculated due date is more than 730 calendar days ahead.

For these records:

- the countdown displays `VERIFY` and `placeholder date` or `date issue`;
- the official source date remains visible in the descriptive date text;
- `days` is set to `null` for derived workflow logic;
- the record is excluded from closing-soon KPIs, estimating-runway tests, readiness milestones, and
  calendar exports;
- CivicBid does not invent or silently substitute a replacement deadline;
- the contractor must verify the actual deadline in the controlling official notice and bid documents.

This correction is injected by the loader so the verified application payload and checksum remain
unchanged.

## Theme and Visibility Corrections

- Day secondary/faint text changed from `#8b93a0` to `#596472`.
- Night secondary/faint text changed from `#6b7684` to `#aab5c3`.
- Day amber changed from `#b06a12` to `#92540b`.
- Native form-control color scheme follows the effective theme.
- Theme control displays the current preference and announces the next preference.
- Auto mode follows `prefers-color-scheme`.
- Existing `prefers-contrast`, visible focus, and reduced-motion rules remain.

## Public Boundaries

- The City Record publication and named agency systems remain authoritative.
- Trade tags are keyword detections, not official classifications.
- PIN grouping is identifier similarity, not confirmed contractual lineage.
- Probability-weighted scenario value is not a revenue forecast.
- Contractor planning milestones are not agency dates.
- No production secret or private record is used.
- No sample data may impersonate a live record.
- Public access does not remove the route's explicit no-index and review disclosures.

## Validation

- Complete donor HTML parsed successfully.
- Both inline application script blocks pass `node --check`.
- Loader-injected initial-tab behavior passed an in-memory Chromium test with empty live feeds.
- The test confirmed Open Bids becomes selected when Today is zero.
- A subsequent manual selection remained selected after `renderAll()`, proving the rule is one-time.
- Deadline-sanity examples must confirm a normal 2026 date retains numeric countdown behavior and a
  2099 placeholder returns `VERIFY`, `days: null`, and `date: null`.
- Contrast corrections were reviewed against day and night principal surfaces.
- Release gate: exact-head typecheck, lint, build, governance, Vercel deployment, and public-domain
  verification must pass before merge.

## Migration Plan

1. Publish the no-index Bid Room route for contractor demonstration.
2. Observe public-source reliability and contractor workflow feedback.
3. Map solicitation and award fields to governed same-origin adapters.
4. Add automated contract tests and source-health monitoring under Issue #14.
5. Decide whether the Bid Room becomes the primary canonical surface while the scoring cockpit remains
   an analytical subview.

## Explicit Exclusions

- No merge of historical CivicBid donor branches.
- No scoring-weight or contractor-threshold change.
- No unrelated site, product, package, or navigation redesign.
- No authenticated CRM, document ingestion, or automated submission.
- No merge to `main` until the exact release head passes all gates.
