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

## Phase 2 - routing layer and spool engine
- `routing/route.schema.ts`, `routing/route-generator.mjs` - parametric route model (risers per floor, trunk per floor/zone, branches off trunks). Generated from `geometry()` + `qtyFor()`, not parsed from the 3D scene. Runs reference a P1 row (`productId`, `ductType|pipeType`) and a `qtyFor` driver (`DUCT_LBS` -> lb target; `PIPE_LF` -> LF target); horizontal lengths are calibrated so the run hits that target (LF exact; lb within a declared per-segment rounding).
- `spool/spool-engine.mjs`, `spool/spool.schema.ts`, `spool/standards.json` - `buildSpools()` and the named attach function `attachSpoolsToEstimate(E, result)` (display-only: adds `.spool` / `.spoolTable`, never touches qty or cost).
- `tools/check-spool.mjs` - P2 gate (second check; `check.mjs` is unchanged). Run `check.mjs` then `check-spool.mjs`.
- Spoolable P1 rows feed the engine; all other rows are returned in `exclusions` with a reason.
- **Clash-ready fields (P3, no clash rules here):** `Segment.extents` (centerline + half section + insulation, feet), `clearanceClass`, `clashClass` (from the P1 row), `Fitting.hostSegmentId/stationCu`.
- **Derived, not in estimate():** duct LF (lb target / representative lb per ft), fittings, hangers, seismic braces. Proposed drivers `DUCT_LF`, `FITTING_EA`, `HANGER_EA`, `SEISMIC_BRACE_EA` are listed in `qty-drivers.json`; any display must carry `derived-not-in-estimate`. Note A03 (hangers/bracing) is already priced on `DUCT_LBS` in the lab.
- **Standards:** every value in `spool/standards.json` states its source and confidence. Only the galvanized sheet weights are sourced (secondary). No SMACNA table giving a maximum spool length was found, so max lengths are representative/unverified; hanger and seismic spacings and pipe weights are unverified or secondary as labelled.
- **Pipe weight is model-derived only** (LF x representative lb/ft). It is never a pipeline quantity (`qtyFor()` has no weight driver) and must not be presented as takeoff.

## Phase 3 - clash detection capability (verified on SYNTHETIC fixtures only)
- **Scope (owner decision, Option B):** a verified collision-detection capability, not a verified building clash model. Lab routes stay `clashReady=false` (schematic layout); representative-model validation is a separate P3b gate. No rerouting, no code certification, no activation on lab routes.
- `clash/clash-engine.mjs` - `detectClashes(input, rules)`: pure, deterministic, order-independent, imports only `node:crypto`. Refuses input unless `readiness.clashReady === true`. Rejects invalid or incomplete geometry (never assumes dimensions, units, tolerances or exactness). `labRouteReadiness(model)` stays false for the lab.
- **Geometry resolution:** L0 AABB broad-phase. `EXACT_BOX` overlap = verified for the supplied box geometry; `CONSERVATIVE_AABB` (round, non-box, rotated off 90-degree multiples) overlap = `POTENTIAL_INTERSECTION`, never promoted. No narrow-phase.
- **Result classes:** clashes (`HARD_INTERSECTION`, `POTENTIAL_INTERSECTION`, `INSULATION_INTERFERENCE`, `CLEARANCE_VIOLATION`); observations (`TOUCHING`, `NEAR_MISS`, informational); `exempted` (explicit connections/penetrations with reason and allowance); `rejectedObjects`. Clash IDs are SHA-256 based (`CL-XXXXXXXXXX`), stable under any input ordering.
- `clash/rules.json` - typed rules in four separate categories (geometric, maintenance, fabrication, code) with provenance. Illustrative values are marked assumptions (R-MNT-001's 3 ft service zone). Code rules (R-CODE-001/002) are NOT-IMPLEMENTED stubs. Every result carries `complianceClaim: "NONE"`: no SMACNA/IMC/NFPA/NEC compliance is claimed anywhere.
- `clash/resolution.mjs` - revision mechanism, defined not executed: `planRevision()` (PLANNED_NOT_EXECUTED, cost delta null until regeneration through `generateRoutes -> buildSpools -> qtyFor -> estimate`) and `reconcileRevision()` (replacement, never addition; original vs revised kept by stable IDs).
- **Limitation:** hanger/brace/support envelopes are excluded from clash extents (`Segment.extents` = centerline + half section + insulation); a consumer must not assume supports are covered.
- **Invariant:** detection output contains no quantity, cost, BOM, EVM or claim fields and never mutates spools, estimates or routes.
- `clash/fixtures/matrix.json` - 14 cases with hand-derived expected results. `tools/check-clash.mjs` is the P3 gate. Run `check.mjs`, `check-spool.mjs`, then `check-clash.mjs`.
