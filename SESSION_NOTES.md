# SESSION_NOTES - HVAC-P1-PRODUCTS

**Branch** labs/hvac-bom-phase1 @ 4cc287d. **Division** infrastructure-construction. **Product** hvac-mechanical-intelligence-bridge (active_lab, public, sample data). Builder: Claude. Nothing staged, committed or pushed.

## Done
New `products/` module: cross-discipline schema (HVAC full, PLUMBING / FIRE_SUPPRESSION stubs), driver registry, 10 sample rows over 8 categories, synthetic fixture, and `node products/tools/check.mjs`, which runs the lab's real `qtyFor()`/`estimate()` in a vm (lab file untouched). Result: PASSED, 0 failures, 2 warnings, both scenarios exact. Standalone `tsc --strict` on the TS files is clean.

## Anchors (index.html)
- 2012 ACTS; 2094-2095 equipEA / equipUnitCost; 2111 qtyFor; 2119 estimate; 2137 A07 material.
- 6061, 7089, 8175: estimate() wrappers (qty untouched; checker covers base pipeline).
- 3009 EQT proxy boxes; 3008 6:2:1:2 mix comment.

## Decisions
- Rows carry no qty/price; fixture holds only weights, apportioned (largest remainder) from qtyFor().
- Reconciliation is conservation-by-construction plus live drift detection (registry vs ACTS, units, cost codes, A07 cost attachment). Honest limit: it cannot catch a wrong weight.
- Specs web-checked where possible; RTU numerics (EER, MCA, weight, curb) were NOT retrievable and are unverified. Exhaust fan (Greenheck CUBE-180-3130GQD-DR2) is manufacturer-sourced; confirm vs cut sheet.

## Blockers / flags
1. **New driver registration blocked:** index.html is excluded, so DAMPER_FSD_EA and EXH_FAN_EA are `proposed`, unreconciled.
2. New top-level `products/` is "folder structure" under AI_AGENT_RULES (ADR class). Proceeded on explicit assignment; Muse/owner to confirm whether an ADR is wanted.
3. Registry `product_family` is UNREVIEWED.
4. Close-session rule asks for docs/HANDOVER.md; out of allowed paths, so this file stands in.
5. Not covered: flexible duct, VCD, AHU, sensors/actuators (only 10 rows). Diffuser TDC is louvered, unlike the lab's lay-in classes. No `npm run typecheck/lint/build` (no node_modules in worktree).

## Next (Phase 2, not started)
Owner decision on adding the proposed drivers; fill remaining catalog categories; submittal verification of unverified fields.

## Addendum - owner-authorized additions (2026-10-11 22:55 EDT)
- **index.html edit (2 lines, :2113-2114):** added `DAMPER_FSD_EA:g.damperFsdEA` and `EXH_FAN_EA:g.exhFanEA` to qtyFor(). `git diff` confirms only those two lines changed. Both return 0 until geometry() supplies `damperFsdEA`/`exhFanEA` (not touched).
- **Checker re-run: NOT COMPLETED.** The permission classifier denied `node products/tools/check.mjs` after the edit. Edit left in place, unverified; owner to run it, revert if it fails. The registry/rows still list both drivers as `proposed`.
- **ADR:** `decisions/ADR-021-hvac-product-catalog-location.md` (Proposed). ADR-INDEX.md not updated (outside scope).
