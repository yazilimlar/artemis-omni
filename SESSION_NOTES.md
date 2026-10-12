# SESSION_NOTES - HVAC-P1-PRODUCTS

**Branch** labs/hvac-bom-phase1. **Division** infrastructure-construction. **Product** hvac-mechanical-intelligence-bridge (active_lab, public, sample data). Builder: Claude. P1 was committed by the owner as bed8924; this fix pass is uncommitted. Nothing staged or pushed by me.

## P1 summary
`products/` module: cross-discipline schema (HVAC full; PLUMBING / FIRE_SUPPRESSION stubs), driver registry, 10 rows over 8 categories, synthetic fixture, `node products/tools/check.mjs` (runs the lab's real `qtyFor()`/`estimate()` in a vm). Rows carry no qty/price. Reconciliation is conservation-by-construction plus live drift detection; it cannot catch a wrong weight. RTU numerics unverified; fan is manufacturer-sourced.

## Fix pass (2026-10-12)
**Step 0, checker against the tree with the 2-line qtyFor edit (:2113-2114), before any change:** lab sha256 d3f0caaf5f71b8f6, 10 rows, 8 categories, both scenarios exact (e.g. DUCT_LBS 71442 = 71442 = 71442; A07 = 11 x 62000 = 682000; scaledUp A07 = 16 x 62000 = 992000), final line `PASSED: 0 failure(s), 2 warning(s)`. This replaces the earlier "not completed" note.
1. DAMPER_FSD_EA / EXH_FAN_EA now `registered` in qty-drivers.json and both rows; notes say quantities are 0 until geometry() supplies damperFsdEA/exhFanEA. check.mjs verifies the key in qtyFor() source (flag `qtyForOnly`), tolerates 0 only with `awaitingGeometry`, WARNs. After: PASSED, 0 failures, 2 warnings.
2. ADR-INDEX.md: ADR-021 line added under owner-authorized governance-file exception.
3. product_family note removed; deferral comment in mep-product.ts.
4. DIFF_EA illustrative-only note on HVAC-DIFF-001 and the fixture.
5. ADR-021 Status: Accepted.

Remaining: no `npm run typecheck/lint/build` (no node_modules); standalone tsc clean.

# Phase 2 - HVAC-P2-ROUTING-SPOOL
Branch labs/hvac-routing-spool-phase2 @ e5c777f (base: merged P1). Scope: `products/` only; `index.html` untouched. Nothing staged, committed or pushed.

## Step zero - checkers on the FINAL tree (run after the last code edit; only this file changed after)
Lab sha256 `d3f0caaf5f71b8f61285a4def88f8870e7e11e40cb2d66137d9d9db0d2e54047`.
- `check.mjs` (P1, unchanged): `PASSED: 0 failure(s), 2 warning(s)`. Totals: labDefaults A07 11 x 62000 = 682000; scaledUp 16 x 62000 = 992000.
- `check-spool.mjs` (new): `PASSED: 0 failure(s), 6 warning(s)`.
  - labDefaults: 2568 spools, 17418.24 ft, 91643 lb, 1884 hangers, 282 fittings (DUCT_LBS 71442, PIPE_LF 4200).
  - scaledUp: 4280 spools, 29030.4 ft, 152737 lb, 3140 hangers, 466 fittings (DUCT_LBS 119070, PIPE_LF 7000).
- Standalone `tsc --strict` over the four TS files: clean.

## Built (anchors)
- `routing/route-generator.mjs:51` generateRoutes; calibration search :69. Pipe LF exact; duct lb within declared rounding.
- `spool/spool-engine.mjs:27` buildSpools; :107 `attachSpoolsToEstimate` (display-only, proven non-mutating).
- `spool/standards.json`, `routing/route.schema.ts`, `spool/spool.schema.ts`, `tools/check-spool.mjs`.
- Tooling change: `lab-bridge.mjs:50` adds `estimateFull()` so the attach test sees the real estimate rows. `check.mjs` untouched; second checker added to keep the P1 gate stable.

## Decisions / flags
1. **Spool max lengths cite NO SMACNA table.** None found giving one; 5/10/20 ft are representative, unverified. SMACNA hanger, seismic spacing and ASME pipe weights were not retrievable: marked unverified; sheet weights are secondary; pipe hanger spacing is a Winnipeg spec, not MSS SP-69. Owner/Grok to supply tables.
2. Duct has no LF driver: LF is derived from DUCT_LBS. Proposed (not edited in): DUCT_LF, FITTING_EA, HANGER_EA, SEISMIC_BRACE_EA. Fittings/hangers/braces are display-only, labelled `derived-not-in-estimate`. Owner decision needed.
3. Conservation limits: spool weights equal the apportioned target by construction; the live proof is the qtyFor/estimate tie-out and non-mutation. Pipe weight is LF x lb/ft (no weight driver).
4. Layout is schematic: calibrated lengths overrun the generated footprint up to ~35 ft (6 WARNs). Not usable for P3 clash until layout is constrained.
5. Fixture shares remain SYNTHETIC; fittings exclude weight.

## Next
Owner: decide proposed drivers and supply standards tables. Then P3 (not started).

## P2 micro-fix (2026-10-12)
1. `check-spool.mjs`: clashReady guard added; fails if `model.clashReady` is set while any footprint overrun > 0. The flag does not exist yet, so behavior is unchanged.
2. `SCHEMA.md`: note that pipe weight is model-derived (LF x representative lb/ft), never takeoff.
Rerun after both edits: `PASSED: 0 failure(s), 6 warning(s)` (same 6 layout warnings).

# Phase 3 - HVAC-P3-CLASH (Option B: capability on synthetic fixtures)
Branch labs/hvac-clash-phase3 @ 0425600 (base: merged P1+P2). `products/` only; `index.html` and all P1/P2 files untouched except an appended `SCHEMA.md` section. Nothing staged, committed or pushed.

## Step zero - ALL checkers on the FINAL tree (only this notes file edited afterward)
Lab sha256 `d3f0caaf5f71b8f61285a4def88f8870e7e11e40cb2d66137d9d9db0d2e54047`.
- `check.mjs`: `PASSED: 0 failure(s), 2 warning(s)` (A07 682000 / 992000).
- `check-spool.mjs`: `PASSED: 0 failure(s), 6 warning(s)`.
- `check-clash.mjs`: `PASSED: 0 failure(s), 0 warning(s)`; 14 fixture cases.
- Standalone `tsc --strict` over five TS files: clean. No validation tooling modified; `lab-bridge.mjs` unchanged.

## Built (anchors)
- `clash/clash-engine.mjs`: validateEnvelope :34, normalizeObject :64, core :110, service zones :224, `detectClashes` :276 (readiness gate), `labRouteReadiness` :283.
- `clash/resolution.mjs`: `planRevision` :18, `reconcileRevision` :34. `clash/rules.json`, `clash/clash.schema.ts`, `clash/fixtures/matrix.json`, `tools/check-clash.mjs`.

## Decisions
- **Geometry resolution: L0 AABB.** EXACT_BOX overlap is verified for the supplied box geometry only; any conservative overlap is POTENTIAL, never promoted. No narrow-phase.
- **Rule provenance:** geometric rules are engine definitions; R-MNT-001's 3 ft is an illustrative assumption; code rules are not-implemented stubs. `complianceClaim: NONE` everywhere.
- Readiness is earned: each fixture's claim must equal its computed validation. Lab routes stay false.
- Boundary and contract tests in `check-clash.mjs` cover the listed failure modes (determinism, ordering, exemptions, F9 inches boundary pairs). No mutation suite was built.

## Blockers / limits
Fixture expectations are hand-derived but authored by the same builder: Grok should re-derive. Revision mechanism is defined, never run end to end. Hanger/clearance envelopes excluded from extents. P3b (representative model) not started.

## Next
P3b: constrained layout and representative model validation, then adapter from route model to clash input.

## P3 micro-fix (2026-10-12)
1. Mutation-testing claim softened above to "boundary and contract tests cover the listed failure modes"; no mutation suite built.
2. Hanger/brace envelope exclusion from clash extents now stated in the `clash-engine.mjs` header and the `SCHEMA.md` Phase-3 section. Doc/comment only; engine anchors shifted +2 lines (updated).
Rerun: `check-clash.mjs` `PASSED: 0 failure(s), 0 warning(s)` (unchanged); lab sha256 d3f0caaf5f71b8f6 unchanged.

# MEP-SCOPING (Prompt C) - plan only
Branch labs/mep-scoping-prompt-c. Wrote `products/MEP_SCOPING.md` (under 800 words) and this note; no code, schema, checker or lab change. Nothing staged, committed or pushed. Checkers not rerun (nothing executable changed).

Covers: shared evidence envelope (observed/declared/inferred/verified/blocked/stale/unknown, approval separate from state); plumbing and fire activities A16-A24 appended without renumbering; electrical recommended as deferred interface layer; schema extensions; new clash pairs under L0 limits; P3b design (constrain layout first, report variance vs qtyFor, per-model clashReady); standards record fields; phase order.

Flags: activity codes, drivers and factors are unverified placeholders. No standard editions are asserted; the owner/EoR must pin them. Phase budgets are qualitative, not measured. Five owner decisions are listed at the end of the scoping file.

## MEP-SCOPING revision (GPT review corrections)
`products/MEP_SCOPING.md` revised, plan only; no code touched, nothing staged or committed.
- Evidence contract v2: logical/revision/content identity, five status dimensions, reproducible verification, `complianceClaim: NONE` default.
- Code profiles NYC_2022_REFERENCE / IPC_2024_MODEL / UNSPECIFIED; four-level quantity proxies; A16-A24 completed (separate fuel-gas basis).
- Electrical: spatial reservations only. Fire rule families separated from AABB.
- Sequence E0 → P2.1 → P4a → P3b → P4b → P5 → P6; E0 and P2.1 separate PRs.
Flags: NYC code names and §905.3.1 are owner-supplied, not verified by me. Cost codes and drivers remain placeholders.

## MEP-SCOPING owner decisions (2026-10-12)
Appended "Owner decisions" to `products/MEP_SCOPING.md` (five items: NYC_2022_REFERENCE primary, 3-trade release, standpipe in / pump conditional, contract v2 approved, no EoR yet). Docs only; nothing staged or committed. Next: E0, a separate PR.

## MEP-SCOPING Grok clarifications
Six edits to `products/MEP_SCOPING.md`: clash logicalId from object logicalIds + type; quantity promotion gate; plumbing/fire codes moved to 055x-059x/065x-068x with the suffix rule (lab `costCode()` appends the letter) and a deferred-activities list; E0 renamed with acceptance criterion; E0 hard prerequisite of P2.1; electrical reservations permanently clashReady=false. Removed the answered "Decisions needed" list. Docs only; nothing staged.

# E0 - evidence contract v2 (labs/e0-evidence-contract)
Layout: `products/evidence/{evidence.mjs, evidence.schema.ts, fixtures/envelopes.json}`, `products/tools/check-evidence.mjs`. Lab sha256 `d3f0caaf5f71b8f6` (unchanged).
- `check-evidence.mjs`: `PASSED: 0 failure(s), 0 warning(s)`; 5 valid, 13 invalid, 2 invalid chains. P1-P3 checkers PASS; `tsc --strict` clean.
- My choices: `CLX-` prefix, `REV-` derivation, unknown fields rejected, any non-NONE complianceClaim rejected.
Nothing staged or committed.
