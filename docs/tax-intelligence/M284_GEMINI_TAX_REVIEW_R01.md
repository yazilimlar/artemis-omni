# M2.8.4 — Gemini Tax / Accounting Review R01

**Lane:** Gemini — tax/accounting challenger (metric accounting, obligation decision tables, form applicability, UNKNOWN semantics, invented rates/dates)
**Date:** 2026-10-27
**Scope reviewed (read-only, no code edited):**
- `panel/EVIDENCE_PACKET.md`, `M284_CONTRACT.md` (M284 R01, spec @ `c1cb2fdf`)
- `app/lib/tax-intelligence/finance-console.ts` (cited as `finance-console.ts:Lnn`)
- `app/lib/tax-intelligence/finance-console.test.ts` (cited as `finance-console.test.ts:Lnn`)
- `app/components/finance/FinanceConsole.tsx` (cited as `FinanceConsole.tsx:Lnn`)
- `app/app/apps/finance-console/page.tsx` (cited as `page.tsx:Lnn`)
**Basis:** Synthetic only. No live data, rates, or filings were consulted or introduced by this review.

## Verdict: CONDITIONAL BLOCK — do not accept as-is

The narrow core is sound and several hard gates genuinely hold (see §1). Acceptance under M284_CONTRACT.md nevertheless fails on two of its own stated acceptance tests — “same source cannot be double counted in rollups” and the obligation evidence/approval model — plus the UNKNOWN gate for source-less P&L. Those are P0 below. None of the P0s creates a real-world filing/payment (the console files nothing and `legalTaxConsolidation` hard-refuses), so this is a contract-acceptance block, not a live-tax-risk emergency. Fix the P0s, disposition the P1s or explicitly defer them as M2.8.5 debt with the UI labelled accordingly, and this becomes a defensible synthetic MVP.

---

## 1. What holds — verified, not assumed

1. **Sales-tax exclusion in the narrow model is correct.** `finance-console.ts:24-27`: `netSales = grossSales − discounts − refunds`; `grossProfit = netSales − cogs`; `operatingProfit = grossProfit − expenses`. `salesTaxCollected` enters none of the three. Test `finance-console.test.ts:4` pins it: 1000 − 100 − 50 = 850, 850 − 300 = 550, 550 − 200 = 350, `salesTaxLiability = 68`, and explicitly `netSales ≠ 918` (the tax-inclusive error). Correct — subject to the tax-inclusive-gross caveat in P1-2.
2. **No invented rates, dates, savings, or allocations found.** No rate constant, percentage, due-date literal, or tax computation exists in `finance-console.ts`. Fixture due dates are all `null` (`finance-console.ts:68-70`). Fixture `salesTaxCollected: 68` (L69) is an *input*, not a rate derivation — but see P1-7 on its provenance/confidence.
3. **Management rollup ≠ tax consolidation is structurally honoured.** `finance-console.ts:37-39`: `legalTaxConsolidation()` ignores its input amounts, returns `filingUnitId: null, status: "unknown"` with a correct reason string. Test `finance-console.test.ts:5` pins it. This is the right refusal pattern.
4. **Base UNKNOWN gate for obligations works.** `finance-console.ts:44-45`: missing taxpayer / operator / jurisdiction / period / classification / rule ⇒ `displayStatus: "UNKNOWN — needs review"` *and* `dueDate` forced to `null`. All three fixture obligations correctly degrade to UNKNOWN. Test `finance-console.test.ts:6` covers this path.
5. **Form engine never claims “applicable”.** `finance-console.ts:60-61`: any missing input ⇒ `unknown`; complete inputs ⇒ only `candidate` with “draft inventory, not a completed form”. Conservative and contract-compliant in direction (incompleteness in P1-5).
6. **No ownership inference in the new code.** No `ownershipPercent` in model, projection, or manifest; test `finance-console.test.ts:8` asserts its absence from `FINANCE_MANIFEST_JSON` and `FINANCE_VIEW`. Legacy-page quarantine is respected in this surface.
7. **Route is fail-closed.** `page.tsx:7`: `requireAuth()`; no profile ⇒ no data rendered. Synthetic banner and “liability, never revenue” copy present in `FinanceConsole.tsx:8` and asserted in `finance-console.test.ts:11`.

---

## 2. P0 — blocks acceptance

### P0-1. Double counting is only prevented *inside* one P&L; the rollup — the place the contract names — double-counts freely
- **Where:** `finance-console.ts:21-22` (duplicate check is per-`PLInput.sourceIds` only), `finance-console.ts:17` (`PLResult` drops `sourceIds` entirely), `finance-console.ts:31-35` (`managementRollup` sums with no source check), `finance-console.ts:30` (`assertNoDoubleCount` is never called by `derivePL` consumers or by `managementRollup`).
- **Why it is an accounting failure, not a style issue:** Once `derivePL` returns, provenance of the amounts is gone. Two `PLResult`s built from the same underlying invoice/processor batch — the classic ERP + processor duplicate the contract calls out (“Same invoice/payment/source cannot be double counted in rollups”) — sum cleanly to 2× revenue, 2× profit, 2× liability. The tenancy check at L32 is the *only* rollup guard. Nothing checks shared `sourceId`, overlapping subject, or overlapping period.
- **Evidence in tests:** `finance-console.test.ts:4-5` tests duplicate IDs *within* one input and `assertNoDoubleCount` in isolation. No test builds two P&Ls sharing a source and rolls them up. The passing suite therefore proves the easy half and leaves the contracted half untested and unimplemented.
- **Required fix (builder lane):** Retain `sourceIds` (or a source fingerprint set) on `PLResult`; make `managementRollup` reject any intersection across items with `FinanceError(DOUBLE_COUNT)`; surface a reconciliation exception rather than a summed total when intersection/overlap is suspected.
- **Required test:** `managementRollup([derivePL({...base, sourceIds:["x1"]}), derivePL({...base, sourceIds:["x1"]})], "t1")` must throw `FinanceError` with `code === "DOUBLE_COUNT"`. Add the near-duplicate variant: same source under two subjects in one tenant.

### P0-2. Obligation decision table: `filed` / `paid` / `overdue` pass through with no evidence and no owner approval
- **Where:** `finance-console.ts:43-47`. Only `status === "confirmed"` is gated on `ownerApprovalRef` (L46). `evidenceRefs` is never inspected for any status. `finance-console.ts:49` (`validateObligation`) is never called from `deriveObligation` or from the projection at `finance-console.ts:85`.
- **Why:** The contract registry states are “candidate vs confirmed vs filed vs paid vs overdue; per legal taxpayer/operator, jurisdiction, period, rule version, **evidence and owner approval**”. As coded, an obligation with all six identity fields filled, `status: "paid", evidenceRefs: [], ownerApprovalRef: null` returns `displayStatus: "paid"` verbatim — a false compliance assertion manufactured from nothing. `overdue` is worse: it is a time-derived state, yet no due-date comparison exists anywhere; any caller-supplied `"overdue"` (or `"filed"` with a future/invented `dueDate`) is echoed as fact.
- **Compounding detail:** `validateObligation` (L49) even when called only proves *presence* of three strings — `ruleVersion: "r1"` plus any jurisdiction/period string “grounds” any date. There is no check that the rule version actually yields that date, that `taxClassification`/`legalTaxpayerId` are present, or that evidence exists. Presence ≠ grounding.
- **Also:** when the UNKNOWN branch fires (L45), the returned object keeps the original `status` alongside `displayStatus: "UNKNOWN…"`. The UI happens to render only `displayStatus` (`FinanceConsole.tsx:5`), but any other consumer of `FinanceView`/the projected object (`finance-console.ts:85` exports both `status` and `displayStatus`) can read the ungated `status` and act on it. One canonical derived status, not two divergent fields.
- **Required fix:** Gate by state transition: `confirmed`, `filed`, `paid` each require non-empty `evidenceRefs` *and* `ownerApprovalRef` (with `filed`/`paid` requiring their specific evidence types when the model grows them); derive `overdue` only from a grounded `dueDate` + as-of date, never accept it as an asserted input without that derivation; call the validator inside `deriveObligation`/projection so there is no unvalidated path; collapse `status`/`displayStatus` divergence in the projection.
- **Required tests:** (a) fully-identified `paid` with `evidenceRefs: []` ⇒ UNKNOWN/needs review; (b) `filed` with `ownerApprovalRef: null` ⇒ UNKNOWN; (c) `overdue` with a future grounded `dueDate` ⇒ not `overdue`; (d) invented `dueDate` with a placeholder `ruleVersion` string ⇒ rejected, not echoed.

### P0-3. A precise P&L can be derived with no source, no period, and no reconciliation — UNKNOWN gate does not apply to the P&L at all
- **Where:** `finance-console.ts:18-28`. `derivePL` validates only `tenantId`/`subjectId` presence (L20) and finiteness of six numbers (L23). It does **not** require `period`, does not require `sourceIds.length > 0`, does not look at any `SourceCoverage` record, its `permission`/`verification`/`completeness`/`reconciliationState` (`finance-console.ts:15`), or whether the subject exists.
- **Why:** The contract rule is symmetric: “Missing … source or rule ⇒ UNKNOWN / needs review, not an invented amount.” The obligation and form engines honour it; the P&L engine — the surface most likely to be quoted as “the number” — does not. `derivePL({…, period: undefined, sourceIds: [], grossSales: 999999, …})` returns an authoritative-looking `operatingProfit`. In accounting terms the model has no completeness or evidence assertion at all: amounts are typed `number`, never `number | UNKNOWN`, and carry no coverage qualifier into `PLResult` (L17) or the UI.
- **Live instance in the fixtures:** scenario-entity-brands (`finance-console.ts:69`) derives exact 850 / 550 / 350-style figures from `src-b1`, whose own coverage record is `completeness: "partial", reconciliationState: "unreconciled", verification: "declared"`. Nothing in the result or in `FinanceConsole.tsx:4` carries that qualifier (see P1-7). Exact output from a partial, unreconciled, merely-declared source is the precise failure the UNKNOWN semantics exist to prevent.
- **Required fix:** `derivePL` (or a wrapper used by fixtures/projection) must require a non-empty grounded `period` and ≥1 source, and must propagate a coverage/confidence qualifier (at minimum the worst of the contributing sources’ completeness/reconciliation states) onto `PLResult`; source-less or period-less input ⇒ coded `FinanceError` or an explicit UNKNOWN result — never bare numbers.
- **Required test:** `derivePL` with `sourceIds: []` and with `period: ""`/missing must not return finite profit figures; a P&L built on a `partial`/`unreconciled` source must surface that state in its result.

---

## 3. P1 — must fix or explicitly defer with UI labelling

### P1-1. `salesTaxLiability = salesTaxCollected` is an identity, not a liability measurement
- **Where:** `finance-console.ts:28` (`salesTaxLiability: input.salesTaxCollected`), type at L16-17 (no other tax field exists).
- **Accounting substance:** A sales-tax liability at period end is *collected (and accrued-on-taxable-sales) − remitted − adjustments − tax refunded on returned goods*, by jurisdiction. The model has no `salesTaxRemitted`, no adjustment, no jurisdiction split, and no treatment of tax on the L69 fixture’s `refunds: 50` (if any of the 68 was collected on later-refunded sales, the liability is overstated by construction). For a zero-activity synthetic this is harmless; as the “typed measure” the contract asks for, it teaches the wrong equation and will silently overstate the liability the first time a remittance is modelled. Rename/document it as `salesTaxCollectedUnremitted (before remittances/adjustments — UNKNOWN if any occurred)` or add the remittance/adjustment terms (defaulting to UNKNOWN, not 0, when not sourced).
- **Required test:** a fixture with collections 68 and remittances 68 must yield liability 0, not 68; a refund carrying tax must reduce it.

### P1-2. `grossSales` basis is undefined: tax-inclusive vs tax-exclusive is assumed, never asserted
- **Where:** `finance-console.ts:16,24`. The derivation is correct *iff* `grossSales` is already exclusive of sales tax. Processor/bank gross receipts — the most likely real sources, and the fixture source type at L69 is `"processor"` — are routinely tax-inclusive (customer paid goods + tax in one charge).
- **Failure mode:** feed tax-inclusive gross 918 (= 850 net goods + 68 tax) with `salesTaxCollected: 68` and the engine returns `netSales: 918 − discounts − refunds`, i.e. sales tax *is* in revenue — exactly what L25’s comment claims is impossible — with no error. The comment asserts an invariant the code does not enforce.
- **Required fix:** Make the basis explicit in the type (`grossSalesExTax` or a `grossSalesBasis: "ex_tax" | "incl_tax" | "unknown"` field); `incl_tax` subtracts collected tax before net sales; `unknown` ⇒ UNKNOWN, not a number.
- **Required test:** incl-tax input 918 / tax 68 / discounts 100 / refunds 50 ⇒ `netSales: 750` derivation path, and basis-unknown input ⇒ no finite `netSales`.

### P1-3. `managementRollup` mixes periods and sums balance-sheet snapshots without eliminations
- **Where:** `finance-console.ts:31-35`.
  - **Period mixing:** no check that all items share a period; the result silently labels the sum with `items[0].period` (L35). Q1 + Q2 summed and labelled “Q1” is a mis-dated statement.
  - **Stock vs flow:** `cash`, `receivables`, `payables`, `accruals` (point-in-time balances) are summed with the same `sum()` as flow measures. Summing end-of-period cash across *periods* is meaningless; summing receivables/payables across *subjects* without intercompany elimination inflates both sides when brand A’s receivable is entity B’s payable. Tenant equality (L32) is the only guard — period, subject set, and elimination are all unchecked.
  - **Empty set:** `managementRollup([], tenantId)` returns all-zero measures with `period: "UNKNOWN"` — a fabricated zero-profit statement instead of UNKNOWN/no-data.
- **Required fix:** Require a single common period (else `FinanceError` or segmented result); document/enforce that balance items are same-date snapshots within one filing-relevant grouping, with an eliminations term or an explicit “uneliminated management view” label carried into the UI; empty input ⇒ UNKNOWN result, not zeros.
- **Required tests:** mixed-period rollup rejected/labelled; empty rollup is UNKNOWN; two-subject rollup with a mirrored intercompany receivable/payable does not present the grossed-up totals as consolidated fact.

### P1-4. Zero is presented as a measurement: the individual scenario’s all-zero business P&L
- **Where:** `finance-console.ts:68` (individual scenario), rendered by `FinanceConsole.tsx:4`.
- **Substance:** The individual’s only source is a `w2` (L68). A W-2 employee has wage income, not `grossSales`/`cogs`/`grossProfit`. Running `derivePL` with every input 0 produces a rendered table of zeros that a reader will parse as “this taxpayer had no income/activity” — the opposite of UNKNOWN. Zero, null/UNKNOWN, and not-applicable are three different accounting states; the model collapses them. The agora scenario gets this right (`pl: null` ⇒ “UNKNOWN — no P&L without sources”, L70 + `FinanceConsole.tsx:4`); the individual scenario should be `pl: null` (or a distinct individual-income model), not a zeroed business P&L.
- **Required test:** assert the individual scenario exposes no finite business profit measures (or an explicit `not_applicable` marker), while the agora null-P&L rendering test continues to pass.

### P1-5. Form applicability decision table is incomplete in both directions
- **Where:** `finance-console.ts:52-61`, test `finance-console.test.ts:7`.
  - **`subjectId` is never checked.** A candidate can be returned with `subjectId: null` — a form applicable to nobody. The “complete inputs” test itself only passes because it supplies `"s"`; the code would return `candidate` without it.
  - **`hasSource` / `hasRule` are unscoped booleans.** Any source and any rule — wrong subject, wrong period/year, wrong jurisdiction, wrong category — satisfy the gate. A payroll form for a subject with no payroll source, a `sales_use` form for a non-seller classification, or an `import_food` form with no import activity all return `candidate` whenever the two booleans are true. Category (`FormCategory`, L51) and classification are carried as data and never used in the decision.
  - **Dead outcomes:** the return type advertises `"applicable"` and `"not_applicable"` (L53); neither is reachable. Never returning `applicable` is safely conservative. Never returning `not_applicable` means known-negative cases (e.g. classification/jurisdiction affirmatively excludes the form) pollute the workbench as perpetual `candidate`/`unknown`, which trains users to ignore the signal.
- **Required fix:** Require `subjectId`; scope `hasSource`/`hasRule` to matched subject + period/year + jurisdiction + category records (pass the records or matched-flags per dimension, not two global booleans); add at least the negative rules the fixtures imply before any `not_applicable` is enabled — otherwise narrow the return type to `"candidate" | "unknown"` so the type stops promising a decision table that does not exist.
- **Required tests:** complete-but-subjectless ⇒ `unknown`; source for a different period ⇒ `unknown` with a period reason; category/classification mismatch case ⇒ the narrowed-or-negative outcome, asserted explicitly.

### P1-6. Validation is partial: half the P&L inputs are unvalidated and sign-free
- **Where:** `finance-console.ts:23` validates only `grossSales, discounts, refunds, salesTaxCollected, cogs, expenses`. `accruals, cash, receivables, payables` are coerced with `?? 0` at L28 — `NaN`, a string, or `Infinity` in those fields flows into `PLResult` and into rollup sums. No field is sign-checked: negative `discounts` (which *increases* net sales), negative `refunds`, or negative `salesTaxCollected` are accepted silently. `period` is not validated at all (see P0-3).
- **Accounting note:** legitimate negative balances exist (e.g. a credit receivable), so the fix is not a blanket `≥ 0` ban — it is per-measure sign expectations with an explicit override/flag for the legitimate exceptions, and finiteness validation for *every* numeric field. Separately, `accruals` (L16) is undefined as a measure: is it an expense accrual already inside `expenses`, a balance, or a P&L adjustment? As coded it affects no derivation (L24-27) — if a future caller puts accrued expenses only in `accruals`, `operatingProfit` is overstated with no warning. Define it or remove it from the P&L type.
- **Required tests:** `NaN`/non-finite in each of `accruals/cash/receivables/payables` ⇒ `FinanceError(INVALID_RECORD)`; negative `discounts` without an explicit flag ⇒ rejected or flagged, never silently netted.

### P1-7. Source-coverage and confidence never reach the user; the “dashboard” is static text
- **Where:** `FinanceConsole.tsx:3` (`SourceCoverage` renders a hard-coded sentence listing source types and ignores its `view` prop), `finance-console.ts:80` (`FinanceView` drops `sources` from the projection entirely), `FinanceConsole.tsx:6` (`FormsWorkbench` takes no props and renders static text; `assessFormApplicability` is never called in the UI path).
- **Contract gap:** Deliverable 2 requires a dashboard of source type, subject, period, permission, verification, completeness, and reconciliation state per source. None of those fields is renderable from `FinanceView` as projected, let alone rendered. The practical accounting consequence is P0-3’s: the entity scenario’s `partial / unreconciled / declared` source (`finance-console.ts:69`) is invisible next to its exact profit figures, and obligation rows (`FinanceConsole.tsx:5`) show only scenario / displayStatus / due date — hiding taxpayer, operator, jurisdiction, period, classification, rule version, evidence, and *which* field is missing, so the user cannot act on “needs review”.
- **Required fix (accounting minimum, full UI is builder scope):** Project sources into the view (allowlisted) and render the coverage table; render a per-obligation missing-field reason (the `deriveObligation` equivalent of the form engine’s `reasons[]` at L54-59 — obligations currently return a bare string with no reasons, an asymmetry worth fixing in the model); badge any P&L whose sources are not `complete + reconciled` as provisional.
- **Required test:** rendered HTML contains the entity source’s `partial` and `unreconciled` states adjacent to its P&L, and an obligation row names its missing fields (extends `finance-console.test.ts:11`).

### P1-8. Formation-evidence guard protects only the agora; a `legal_entity` needs no evidence
- **Where:** `finance-console.ts:66` (`subj()` fails only when `kind === "independent_agora"` or the id contains `"apolloa"`), `finance-console.ts:86` (projection forces `legalEntity: false` only on the same id-substring test).
- **Substance:** The contract gate is general — no subject is a legal entity / activated filer without formation evidence. As coded, `subj({kind: "legal_entity", legalEntity: true, formationEvidenceRefs: []})` passes, and the projection preserves `legalEntity: true` for any id not containing “apolloa”. The fixture entity (L69) does carry a synthetic ref, so the fixtures are clean; the *guard* is what is under-scoped, and it is keyed on a display id substring rather than on `kind`/`legalEntity` semantics, so a renamed agora id defeats both the constructor guard and the projection guard simultaneously.
- **Required fix:** Apply the evidence check to any subject asserting `legalEntity: true` regardless of kind/id; in the projection, force `legalEntity: false` whenever `formationEvidenceRefs` is empty in the (allowlisted) source record, keyed on evidence, not on the substring `"apolloa"`.
- **Required tests:** legal-entity-without-evidence throws `LEGAL_ENTITY_WITHOUT_FORMATION_EVIDENCE`; a poisoned agora under a non-“apolloa” id still projects `legalEntity: false` (the existing poison test at `finance-console.test.ts:9` only covers the literal id path).

---

## 4. P2 — correctness polish, clarity, and test debt

- **P2-1. Rollup comment contradicts the code.** `finance-console.ts:34` claims “Recompute derived measures from components”, but L35 *sums* the derived measures (`netSales`, `grossProfit`, `operatingProfit`). Summing is arithmetically equivalent here because the derivations are linear — so this is not a numbers bug — but the comment invites a future maintainer to “fix” a non-bug or to trust a recomputation that does not happen. Either recompute (`netSales` from summed components, then profit from that) or correct the comment. Recomputing is preferable: it self-checks consistency if a hand-built `PLResult` with inconsistent derived fields is ever passed in — currently such an inconsistent object rolls up without complaint, which is also worth a consistency assertion in `managementRollup`.
- **P2-2. “LLC” conflates legal form with tax classification.** `finance-console.ts:69`: label “Synthetic Entity LLC” with `taxClassification: null`. The `null` is honest (an LLC may be taxed as disregarded / partnership / S-corp / C-corp — UNKNOWN is correct), but the console never explains that distinction, and a reader will naturally read “LLC” as the classification. Add copy distinguishing legal form from tax classification wherever a subject is shown, and keep classification UNKNOWN until evidenced — do not let a future fixture “helpfully” fill it from the label.
- **P2-3. Dead / misleading code in the projection.** `finance-console.ts:82` (`stripPL`) is defined and never used, and `pubPL`/`pubObl` at L84-85 are typed `any`, defeating the allowlist’s type safety at exactly the trust boundary. Type the public shapes explicitly (a `PublicPL` / `PublicObligation` interface) and delete `stripPL`. (Projection *content* — identifier leakage — is Grok’s lane; this note is only about the accounting fields’ typing.)
- **P2-4. “NOT COSTABLE” is imported jargon in the wrong register.** `FinanceConsole.tsx:5`: “Totals: NOT COSTABLE where not grounded.” No totals are shown, and “not costable” is formation-cost language from M2.8.1, not an obligation-registry concept. Replace with the obligation-native statement: totals are not presented because no obligation in this synthetic set is grounded (taxpayer/operator/jurisdiction/rule incomplete ⇒ UNKNOWN).
- **P2-5. P&L table omits the derivation chain it asks the user to trust.** `FinanceConsole.tsx:4` shows gross, net, liability, gross profit, operating profit — but not `discounts`, `refunds`, `cogs`, or `expenses`, nor `salesTaxCollected` as distinct from the liability, nor any balance measures, period, or currency. The user cannot re-perform a single derivation from the screen. Show the full chain (gross → discounts/refunds → net → COGS → gross profit → expenses → operating profit), label the period per table (currently only the scenario title in the caption), and mark all figures synthetic/in the fixture’s (unstated) currency unit.
- **P2-6. Task board provenance is uniform and dependency-blind at render.** `finance-console.ts:72-75` + `FinanceConsole.tsx:7`: every task cites the same spec commit (acceptable for a synthetic seed), but `FIN-03`’s dependency on `FIN-01` is rendered as raw status with no blocked/derived indication beyond `deriveTaskStatus` (L77), which only guards `proposed + complete`. If `FIN-01` is `unknown`, `FIN-03: open` reads as actionable. Minor for accounting, but the board is part of the compliance timeline deliverable — render dependency state explicitly.
- **P2-7. Test-suite shape hides coverage gaps.** `finance-console.test.ts:4-11` compresses each `describe` onto single lines, which is why the missing cases went unnoticed: no negative-sign tests, no tax-inclusive-gross test, no remittance test, no cross-P&L double-count test (P0-1), no filed/paid-evidence tests (P0-2), no source-less P&L test (P0-3), no mixed-period rollup test (P1-3), no subjectless-form test (P1-5), no non-agora formation test (P1-8). Recommend one `it` per acceptance-test sentence in M284_CONTRACT.md, named after the contract clause, so GPT-6 can map suite → contract mechanically. Existing tests that do exist are well-aimed (coded `FinanceError` not `TypeError`, poisoned projection, proposed-never-complete) and should be kept.

---

## 5. Decision tables — summary for GPT-6 adjudication

**Obligation derivation as coded (`finance-console.ts:43-49`):**

| Inputs | Coded result | Correct? |
|---|---|---|
| Any of taxpayer/operator/jurisdiction/period/classification/rule missing | UNKNOWN, dueDate nulled | ✅ |
| All present, `candidate` | `candidate`, dueDate echoed unvalidated | ⚠️ dueDate needs grounding check (P0-2) |
| All present, `confirmed`, no approval ref | UNKNOWN | ✅ |
| All present, `confirmed`, approval ref present, no evidence | `confirmed` | ❌ evidence never required |
| All present, `filed` / `paid`, no evidence, no approval | `filed` / `paid` verbatim | ❌ P0-2 |
| Any, `overdue` asserted | `overdue` verbatim, no date logic | ❌ P0-2 |

**Form applicability as coded (`finance-console.ts:53-61`):** missing jurisdiction/classification/year/source/rule ⇒ `unknown` ✅; all present (incl. even subjectless / mismatched-category) ⇒ `candidate` ⚠️ P1-5; `applicable` / `not_applicable` unreachable ⚠️.

**P&L derivation as coded (`finance-console.ts:18-28`):** arithmetic ✅ on an ex-tax basis; basis unasserted ⚠️ P1-2; liability = collections ⚠️ P1-1; no source/period/coverage gate ❌ P0-3; intra-input double-count ✅, cross-P&L double-count ❌ P0-1.

## 6. Disposition requested

- **Builder (Claude lane):** fix P0-1, P0-2, P0-3 with the named tests; fix or formally defer each P1 with a UI label where the deferral is user-visible (notably P1-1/P1-2 basis-and-liability wording and P1-7 provisional badging).
- **Integrator (Muse):** re-run the full `lib/tax-intelligence` suite + typecheck + build after fixes and confirm the new negative tests fail on the pre-fix code (mutation check), so the P0 tests are proven to bite.
- **GPT-6:** acceptance should require the §5 tables to show no ❌ row; P2s may carry to M2.8.5.
- **No owner action** is requested by this review. No merge, production, filing, registration, payment, real-data ingestion, or Vercel/security change is implied or authorised by anything above. Synthetic only.

*— Gemini reviewer lane, M2.8.4. Read-only review; no builder code was edited in producing this file.*
