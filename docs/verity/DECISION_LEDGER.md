# BidRoom Verity — Decision Ledger

Format follows the collaborative model from the BidRoom Nexus accuracy review:
each entry records the proposal, its evidence, the official source, implementation
impact, verification, and status.

---

## VER-001 — Controlling-source chain for NYC Current Solicitations

- **Proposal**: Expose a per-record City Record Online destination instead of the
  dataset-level link only, while preserving the legal/source distinction: NYC Open
  Data discovery feed → City Record Online electronic convenience copy → the
  notice's agency-designated system (often PASSPort) for controlling RFx documents,
  addenda, and response submission. The City Record print edition is the official
  publication.
- **Research evidence**: Dataset `3khw-qi8f` is attributed to DCAS and mirrors City
  Record procurement notices. `request_id` is present on 100/100 sampled live rows.
  `https://a856-cityrecord.nyc.gov/RequestDetail/{request_id}` returned HTTP 200 and
  contained the exact notice content (title, PIN, agency, selection method) for
  request 20260706047. Record text itself instructs vendors to respond in PASSPort
  (nyc.gov/passport); public browse at passport.cityofnewyork.us returned 200. This
  establishes the canonical CROL URL pattern but does not content-verify every
  derived destination at scoring time.
- **Official source**: data.cityofnewyork.us/api/views/3khw-qi8f (metadata),
  a856-cityrecord.nyc.gov, passport.cityofnewyork.us. Retrieved 2026-07-15.
- **Confidence**: Verified (direct retrieval of primary sources), not inferred.
- **Implementation impact**: `recordUrl` field on `CivicBidOpportunity`;
  `recordUrlTemplate` context option in `normalizeOpenDataOpportunity`; evidence
  linkage tier `record` (uncapped, normalized rather than published) in
  `evidenceQuality.ts`; Verity UI shows "City Record Online notice" as the primary
  verify action and discloses that the destination is derived but not fetched during scoring.
- **Verification**: Unit tests (normalizer golden fixture asserts the constructed
  URL; evidence tests assert linkage tiers). Live page E2E after deploy.
- **Owner / status**: Claude / **Accepted, shipped**.
- **Known limit**: The City Record Online page is an electronic convenience copy,
  not the legally official print publication. PASSPort/agency RFx documents are not
  read, and a direct PASSPort destination is not available for every normalized row.

## VER-002 — Normalizer field-mapping corrections (round 2)

- **Proposal**: Map `selection_method_description` → procurementMethod and
  `category_description` → category.
- **Research evidence**: Both fields present on 100/100 sampled live rows while the
  normalizer's previous key lists matched neither — which is why the public API
  returned `procurementMethod: null` and `category: null` for every record.
- **Official source**: Live rows from data.cityofnewyork.us/resource/3khw-qi8f.json,
  retrieved 2026-07-15.
- **Implementation impact**: Documentation score (+20 for method) and evidence
  coverage rise for most records; both are computed values, so displayed scores
  change by design.
- **Verification**: Golden-fixture tests pin the mapping; smoke run against live rows.
- **Owner / status**: Claude / **Accepted, shipped**.

## VER-003 — Golden fixtures and boundary/property tests

- **Proposal**: Pin scoring and evidence formulas with executable tests before any
  calibration work, per the verification protocol in the accuracy review.
- **Evidence**: 3 archival City Record rows (2002–2003) captured as a versioned
  repository snapshot in `tests/fixtures/nyc-current-solicitations-snapshot.json`
  and hand-checked. The fixture is stable while unchanged in version control; the
  availability of external source pages is not assumed permanent.
- **Implementation impact**: vitest devDependency, `npm test`. The suite exercises
  urgency boundaries on both sides, production tier classification at 75/55, the
  documented "expired record can still reach tier B" characterization
  (5×30% + 100×70% = 71.5 → 72 → B), the full source-confidence map, evidence
  gates, exhaustive material-field monotonicity combinations, score/confidence
  independence, fixed golden scoring output, and timezone conversion regressions.
- **Owner / status**: Claude / **Accepted, shipped**.

## VER-004 — Not done, deliberately

- Opportunity monetary scale stays absent (no published estimate in the source; no
  illustrative bands are substituted). Requires published estimates or bid-item data.
- Contractor FIT stays absent (no contractor profile schema yet).
- Score calibration against labeled bid/no-bid outcomes remains open — scores are
  still labeled uncalibrated heuristics.
- Source-local America/New_York remains a documented interpretation because the
  source publishes floating timestamps without an explicit timezone. The conversion
  is deterministic and no longer depends on the deployment server's timezone.

## VER-005 — Floating NYC timestamp production correction

- **Defect**: JavaScript parsed timezone-free Socrata values in the deployment
  server's timezone. On Vercel, `2026-08-27T14:00:00.000` became `14:00Z`; formatting
  that instant in Eastern displayed 10:00 AM instead of the published 2:00 PM.
- **Correction**: Interpret floating source timestamps explicitly in
  `America/New_York`, including daylight-saving offsets, before storing UTC ISO.
- **Verification**: Fixed summer and winter conversion tests under multiple process
  timezones, explicit-zone preservation test, golden fixture expectation, typecheck,
  lint, production build, and live production API check against City Record PIN 521210.
- **Owner / status**: Codex / **Accepted, shipped**.
