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
