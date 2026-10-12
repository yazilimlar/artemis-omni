# products/ - MEP product schema (Phase 1)

Owner: infrastructure-construction / `hvac-mechanical-intelligence-bridge`. Lifecycle active_lab, data mode **sample** (fixture: **synthetic**). Every row is *representative - verify against submittals, not sealed design*.

## Files
- `schema/mep-product.ts` - types. HVAC full; PLUMBING and FIRE_SUPPRESSION are stubs (no rows).
- `schema/qty-drivers.json` - driver registry (registered vs proposed), checked against the live lab.
- `hvac/hvac-products.sample.json` - the 10 rows. `hvac/index.ts` - typed export.
- `hvac/fixtures/allocation.fixture.json` - synthetic apportionment weights.
- `tools/check.mjs` - `node products/tools/check.mjs`: validates rows, then reconciles fixture sums = `qtyFor()` = `estimate()` rows[].qty for two scenarios (exact for integer units; declared tolerance 0).

## Rules
1. **No quantities, no prices on rows.** Quantity = `qtyFor(qtyDriver, g)`; cost = what `estimate()` already computes. The checker rejects price-like keys.
2. **Equipment cost** attaches at `g.equipEA` x `g.equipUnitCost` (index.html:2094-2095) into A07. The lab's `EQT` objects are proxy boxes, not products.
3. **System Lab is display-only.** Anything shown must trace to G/E/PLAN after `estimate()`, or be labelled synthetic/representative.
4. **Chain** exists only on linear activities (A02-A06, A10, A11, A13). It is derived from `ACTS[activityId]`, never stored; `spoolable:true` is allowed only on those activities (module invariant, not a lab rule).
5. **TAKEOFF_\*:** `TAKEOFF_EA` is in `qtyFor()` but is no ACTS driver; `estimate()` reads `g.takeoffEA` inside A04. Left alone; not used here.
6. `spec.confidence` = `'unverified'` if any key field is; `spec.fieldConfidence` gives per-field `manufacturer | secondary | unverified`. Unverifiable values are omitted, not guessed.
7. `DAMPER_FSD_EA` and `EXH_FAN_EA` are registered in `qtyFor()` (index.html:2113-2114), but `geometry()` does not supply `damperFsdEA`/`exhFanEA`, so their quantities are 0 and the rows are reported as WARN, not reconciled. `driverStatus:'proposed'` stays valid for future drivers not yet in `qtyFor()`.
8. `costCode` = `${ACTS[activityId].code}-M`; `clashClass`/`spoolable` are new proposed vocabularies (the lab has neither concept).
