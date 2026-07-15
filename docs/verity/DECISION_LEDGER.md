# BidRoom Verity — Decision Ledger

Format follows the collaborative model from the BidRoom Nexus accuracy review:
each entry records the proposal, its evidence, the official source, implementation
impact, verification, and status.

---

## VER-001 — Controlling-source chain for NYC Current Solicitations

- **Proposal**: Expose a per-record official destination instead of the dataset-level
  link only, and document the full chain: NYC Open Data mirror → City Record Online
  notice → PASSPort (controlling RFx documents and response submission).
- **Research evidence**: Dataset `3khw-qi8f` is attributed to DCAS and mirrors City
  Record procurement notices. `request_id` is present on 100/100 sampled live rows.
  `https://a856-cityrecord.nyc.gov/RequestDetail/{request_id}` returned HTTP 200 and
  contained the exact notice content (title, PIN, agency, selection method) for
  request 20260706047. Record text itself instructs vendors to respond in PASSPort
  (nyc.gov/passport); public browse at passport.cityofnewyork.us returned 200.
- **Official source**: data.cityofnewyork.us/api/views/3khw-qi8f (metadata),
  a856-cityrecord.nyc.gov, passport.cityofnewyork.us. Retrieved 2026-07-15.
- **Confidence**: Verified (direct retrieval of primary sources), not inferred.
- **Implementation impact**: `recordUrl` field on `CivicBidOpportunity`;
  `recordUrlTemplate` context option in `normalizeOpenDataOpportunity`; evidence
  linkage tier `record` (uncapped) in `evidenceQuality.ts`; Verity UI shows
  "Official notice (City Record)" as the primary verify action.
- **Verification**: Unit tests (normalizer golden fixture asserts the constructed
  URL; evidence tests assert linkage tiers). Live page E2E after deploy.
- **Owner / status**: Claude / **Accepted, shipped**.
- **Known limit**: PASSPort RFx documents are NOT read; a City Record notice is the
  official published notice but addenda and bid documents remain in PASSPort.

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
- **Evidence**: 3 archival City Record rows (2002–2003, stable forever) captured to
  `tests/fixtures/nyc-current-solicitations-snapshot.json` and hand-checked.
- **Implementation impact**: vitest devDependency, `npm test`. 34 tests: urgency
  brackets, tier boundaries, the documented "expired record can still reach tier B"
  characterization (5×30% + 100×70% = 71.5 → 72 → B), source-confidence map,
  evidence gates, coverage independence, monotonicity, and score/confidence
  independence properties.
- **Owner / status**: Claude / **Accepted, shipped**.

## VER-004 — Not done, deliberately

- Opportunity monetary scale stays absent (no published estimate in the source; no
  illustrative bands are substituted). Requires published estimates or bid-item data.
- Contractor FIT stays absent (no contractor profile schema yet).
- Score calibration against labeled bid/no-bid outcomes remains open — scores are
  still labeled uncalibrated heuristics.
- Timezone assumption (source-local ET) remains an assumption; the source publishes
  no explicit timezone.
