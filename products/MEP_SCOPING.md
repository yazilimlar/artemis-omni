# MEP scoping v2 (concern MEP-SCOPING) - PLAN ONLY, no build

Program: "Artemis HVAC→MEP". Current release scope: **HVAC + Plumbing + Fire Protection**, never advertised as complete MEP. All values are unverified representative placeholders.

## 1. Evidence contract v2
One envelope for clash, spool, commissioning test; quantities/costs linked by id only.
- **A. Identity.** `logicalId` (stable engineering object), `revisionId` (one immutable revision), `contentHash` (deterministic), `revision` (monotonic per logicalId), `supersedes` (previous revisionId). Clash policy: the clash `logicalId` derives from the logicalIds of the two engineering objects plus clash type, never from transient geometry. Geometry changes yield a new revisionId/contentHash under the same clash logicalId, so the ID survives edits.
- **B. Five dimensions, not one enum:** basis (observed | declared | inferred | unknown); verification (unverified | verified | failed), always scoped as *mathematical* or *building-condition*; validity (current | stale); workflow (draft | submitted | blocked | closed); approval (pending | accepted | rejected | withdrawn).
- **C. Reproducible verification:** `verificationMethod`, `verificationScope`, `verificationBasis`, `verifiedRevisionId`, artifact refs, timestamp. Approval pins to one revisionId; later revisions do not inherit it.
- **D.** `complianceClaim: NONE` is the lab default regardless of computational verification. A signed rule alone never certifies a project.

## 2. Code profiles
`NYC_2022_REFERENCE` (primary; 2022 NYC Plumbing, Building, Mechanical, Fuel Gas Codes), `IPC_2024_MODEL` (optional educational comparison), `UNSPECIFIED` (no code-derived assertions). Every rule binds profile + edition + jurisdiction + verification status. Editions are owner-supplied, unverified.

## 3. Activities (appended A16+, no renumbering; codes/drivers placeholders)
Plumbing uses 055x-059x and fire 065x-068x, clear of HVAC 04xx, 0510-0530 and 0610. Base codes carry no suffix: the lab's `costCode()` appends the category letter once (-L/-M/-C/-S/-E/-R).
| Id | Code | Driver | Crew | QTO level |
|---|---|---|---|---|
| A16 water | 0550-DWAT | `DWAT_LF` | Plumbers | L2 |
| A17 DWV | 0560-DWV | `DWV_LF` | Plumbers | L2 |
| A18 storm | 0570-STRM | `STRM_LF` | Plumbers | L1 |
| A19 fuel gas | 0580-GAS | `GAS_LF` | Gas fitters; separate fuel-gas code basis, not folded into plumbing | L1 |
| A20 fixtures | 0590-FIX | `FIX_EA` | Plumbers | L1 |
| A21 sprinkler pipe | 0650-SPK | `SPK_LF` | Sprinkler fitters | L2 |
| A22 heads | 0660-SPKH | `SPK_HEAD_EA` | Sprinkler fitters | L2 |
| A23 standpipe | 0670-STP | `STP_LF` | Sprinkler fitters | L1 |
| A24 fire pump | 0680-FPMP | `FPUMP_EA` | Millwright/Rigging | L1 |

**Quantity levels:** L1 budgetary proxy → L2 parametric estimate → L3 geometry-derived → L4 verified project quantity. Every QTO factor carries its level. Fixture units are sizing/load concepts, never pipe-length measurements. **Promotion of a quantity from level N to N+1 requires an explicit evidence record (method, scope, basis, verifiedRevisionId) and a labelled variance against the prior level; silent promotion is a gate failure.** New EQT types and System Lab stations follow each system (water heater, riser, pump).

**Deferred activities (not folded into A16-A24):** FP fittings, valves, backflow preventers, domestic water heaters, pumps other than fire, insulation, hangers, testing.

## 4. Electrical
Deferred as engineering. Reserve spatial interface objects only: equipment power connections, electrical-room boundaries, service/access zones, future cable-tray corridors, all marked *unvalidated spatial reservations*, not NEC geometry. Electrical reservation objects are permanently clashReady=false and emit at most observations; they never produce HARD/POTENTIAL clashes until an Electrical engineering phase defines verified geometry and a code profile.

## 5. Fire protection and standpipe
Standpipe is in, justified via NYC Building Code §905.3.1 (owner-cited; record assumed occupancy and story areas). Fire pump is conditional on a declared hydraulic design basis (water supply + demand scenario), not height alone.

## 6. Data model and clash
P1 covers the core shape. Add types for sprinkler heads, pipe schedules, fixtures, slope, hazard class. Distinct rule families, not all AABB: coverage, head obstruction, hydraulic performance, gravity slope, service access. L0 AABB yields only POTENTIAL for round or sloped pipe. Future: narrow-phase geometry (cylinders, sloped segments, coverage volumes) plus non-geometric evaluators (hydraulic, slope).

## 7. P3b design (design only)
Hand-authored synthetic structure; constrain layout to the footprint, report the length difference against `qtyFor()` as a labelled variance, never stretch calibrated lengths. Validate coordinates, units and elevation datum first. `clashReady` earned per model and revision.

## 8. Standards strategy
Rules store source, edition, section, applicability, verification status, licence restriction; no bulk copying of proprietary tables. Spool max length is a fabrication/logistics constraint owned by a fabricator profile.

## 9. Sequence
E0 (evidence contract v2 implementation; acceptance: schema + checker for the five status dimensions and the identity triple logicalId/revisionId/contentHash) → P2.1 (quantity-chain closure: the 4 proposed drivers) → P4a (commissioning vertical slice) → P3b → P4b → P5 → P6. **E0 and P2.1 ship as separate PRs; E0 is a HARD PREREQUISITE of P2.1: P2.1 may not mark any driver registered until E0's evidence fields are present on every quantity record.** Budgets qualitative; products, fixtures and productivity stay representative.

## Owner decisions (2026-10-12)
1. Code profile: NYC_2022_REFERENCE primary; Manhattan office stays the reference setting. IPC_2024_MODEL optional educational comparison; UNSPECIFIED = no compliance assertions.
2. Release: HVAC + Plumbing + Fire Protection, electrical deferred as a spatial-interface layer. Program stays "Artemis HVAC→MEP"; release labeled 3-trade, never complete MEP.
3. Standpipe in, via NYC Building Code §905.3.1 (record assumed occupancy and story areas). Fire pump conditional on a declared hydraulic design basis (supply + demand), not height alone.
4. Evidence contract v2 APPROVED as specified.
5. EoR: none engaged. All engineering values stay representative and labelled. EoR deferred to P5/P6 sizing validation; gates project verification only, not software development.
