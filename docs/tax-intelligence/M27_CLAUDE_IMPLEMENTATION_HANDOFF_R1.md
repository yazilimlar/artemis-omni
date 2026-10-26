# ARTEMIS Tax Intelligence — M2.7 Claude Implementation Handoff R2

**For:** Claude Code (sole scoped implementation writer) · **From:** Muse, Lead Integrator
**Prerequisite: SATISFIED.** GPT-6 gave CONDITIONAL ACCEPTANCE (commit `4519bd6d05ab`, ADR R1) and the binding clarifications C1–C5 are incorporated into `M27_CANONICAL_SCHEMA_R1.md` **R2** and into the tests below (T10 split, T21–T26). Implement against schema R2, not R1.
**Base:** HEAD of `feature/tax-intelligence-m27-schema-r1` at dispatch (contains schema R2 + GPT-6 decision). Kernel branch forks from there so the accepted documents travel with the code.
**Boundaries (hard):** isolated branch only · synthetic fixtures only · **no merge, no deploy, no live data import, no tax filing, no production claim** · no simultaneous edits to these files by any other model · Grok reviews read-only afterwards.

## Branch and scope

- Branch: `feature/tax-intelligence-m27-kernel-r1`, created from the base commit above. Confirm `git worktree list` and the branch in each existing folder before switching anything; if the base branch is checked out in another worktree, create a new worktree folder from it instead of switching that folder.
- New files only (do not rewrite R1/M2.6 in place; they stay as baselines):
  - `lib/tax-intelligence/canonical.ts` — types + `settle(tenantId, nodes, edges): SettlementResult` implementing schema §§2–6.
  - `lib/tax-intelligence/canonical.test.ts` — the acceptance tests below, written **first**.
- Do not touch: `app/apps/tax-intelligence/page.tsx`, R3/R4 SQL, membership/auth code, CI workflow (already fixed at HEAD — see Evidence). UI ownership-claim correction is a separate owner-gated doc task, not this branch.

## Tests-first order

1. Write `canonical.test.ts` with every case in the Acceptance table. Run it against an empty/stub `canonical.ts` and record the failing run (red) in your report.
2. Implement the minimal kernel until green. No extra features: no persistence, no Supabase, no UI, no provider adapters.
3. Run the full evidence commands (§ below) and paste outputs verbatim in your report.

## Acceptance tests (all mandatory; IDs are stable — use them in test names)

| ID | Case | Expected |
|---|---|---|
| T01 | Orphan wash: charge_merchandise 10000 + charge_tax_collected 700, payout 10400 allocated correctly, **plus an unlinked refund_merchandise 10400** | NOT matched; status `exception` or the refund reported as unexplained node; refund does not enter the identity |
| T02 | Payout edge `charge_to_payout` points at a charge that did not fund it (amounts conserved only against the wrong charge) | `exception` (`OVER_ALLOCATION` or identity variance on the true charge) — never matched |
| T03 | One charge_merchandise 10000 allocated `charge_to_payout` 4000 to payout A and 6000 to payout B (edges may span settlement groups; there is no batchId in the canonical schema) | Conserved; both payouts explained; source remainder 0 |
| T04 | Charge 10000, only 4000 allocated to a payout, payout observed 4000, no bank deposit yet | Status `pending`; `remainderByNodeId[charge] = 6000` |
| T05 | Seller credit 500 with `credit_to_payout` vs same fixture with seller_debit 500 `debit_to_payout` | Expected payout differs by exactly 1000 between the two runs, in the correct directions (credit +, debit −) |
| T06 | Cash oracle A: merchandise 10000 + tax collected 700 − fee 300, not withheld | `expectedPayoutCents = 10400` |
| T07 | Cash oracle B: same + tax_withheld 700 (`withheld_to_payout`) | `expectedPayoutCents = 9700` |
| T08 | Oracle rejection: any fixture reproducing R1's formula (subtracting collected tax as if withheld, expecting 9000) | Kernel result ≠ 9000 for the T06 inputs; a test asserting 9000 must fail (document this as the R1-baseline divergence) |
| T09 | ERP: `erp_invoice` 9000 with `erp_to_order` to an order of 10000 | `exception` with code `ERP_AMOUNT_MISMATCH`; revenue event count semantics unchanged (invoice never counts as revenue) |
| T10 | Illegal edges, exact C3 split, one test each: (a) relation/kind mismatch (e.g. `payout_to_bank` from a fee), (b) cycle among cash-consumption edges | (a) and (b): **no throw** — `exception` with coded entries naming the edge IDs. (c) edge amount 0 (and separately negative/unsafe): **throws** — malformed input per C3. Test all three behaviours distinctly |
| T11 | Replay: same `(source, providerEventKey, revision, digest)` submitted twice | Deduped — totals identical to single submission |
| T12 | Same provider key + revision, different digest | Throws `DIGEST_CONFLICT` |
| T13 | Date `2026-02-31` on any node | Throws (strict round-trip) |
| T14 | Sum overflow: two nodes whose allocated sum exceeds `Number.MAX_SAFE_INTEGER` | Throws on the unsafe intermediate/final sum |
| T15 | Currency `"EUR"` on any node | Throws |
| T16 | Cross-tenant node; cross-tenant edge (endpoints in another tenant) | Throws both |
| T17 | Zero-only scope: all nodes 0, payout 0, deposit 0, edges present | Never `matched` (`ZERO_ONLY_MATCH` exception if asserted, else pending) |
| T18 | Pending, not fabricated: payout observed, no bank deposit node | Status `pending`; `observedDepositCents = 0`; no deposit invented |
| T19 | Refund correctness: refund_merchandise 1000 + refund_tax 70, both with `refund_to_payout` edges, against T06 fixture | Expected payout reduced by exactly 1070; `taxArithmetic` reflects refunded tax explicitly |
| T20 | Tax arithmetic: collected 700, withheld 700, remitted 0 → position 0; collected 700, withheld 0, remitted 0 → position 700; result object labels it arithmetic-only (field naming per schema §5) and no field anywhere names a payout as income | Assert values + assert no `taxableIncome`/`liability` field exists on the result |
| T21 | **C1:** full `order_to_charge` (10000) + `order_to_charge_tax` (700) evidence edges present, charge components then fully cash-allocated to a payout | Evidence edges consume nothing: payout identity still computes 10400-side amounts exactly as T06; order is tied. A variant where `order_to_charge_tax` is asserted against the merchandise value must not reduce merchandise capacity |
| T22 | **C2:** withheld 700 carries BOTH `withheld_to_payout` 700 and `withheld_to_remittance` 700 to a `tax_remitted` 700 node | Payout = **9700** (not 9000 — remittance edge is not a second deduction); no `OVER_ALLOCATION` on the withheld node; tax position = 700 − 0 − 700 − 0 = **0** |
| T23 | **C2 pathway:** `tax_remitted` 700 present with no `withheld_to_remittance` edge while `tax_withheld` 700 is also in scope, no direct-remittance provenance | `exception` containing `TAX_PATHWAY_UNKNOWN`; `taxArithmetic.pathwayUnknown = true`; `positionCents = null`. Contrast case: `tax_remitted` with NO withheld in scope and explicit evidenceRef counts as `directlyRemitted` and position computes |
| T24 | **C4:** two independent charge sets A and B (each merchandise 10000 + tax 700), one payout 10400 whose cash edges point only at B's components, plus a bank deposit 10400 correctly linked to the payout. Global totals still balance | NOT matched: A's components are unexplained (exception or pending per §3) — aggregate equality must not certify |
| T25 | **C5:** (a) same provider key, revision 1 and revision 2, rev 2 without `supersedesRevision` | (a) throws `CONFLICTING_REVISION`. (b) rev 2 with `supersedesRevision: 1`: only rev 2 settles; totals equal the rev-2-only run. (c) two events with different provider keys and identical amounts/digest fields are both counted — digest never merges distinct keys |
| T26 | **C5 digest contract:** construct a node whose `digestSha256` is the SHA-256 of the canonical JSON defined in schema §6 (sorted keys, exact field set) | Kernel accepts the fixture family consistently (digest format validated); a digest that is not 64-char lowercase hex throws. (Kernel does not recompute payload digests — no payload exists in the kernel — so this tests the format + key/revision/digest idempotency contract, T11/T12.) |

## Evidence commands (paste verbatim outputs in the report)

```bash
npx vitest run lib/tax-intelligence --reporter=verbose   # summary line MUST show nonzero test count incl. canonical.test.ts
npm run typecheck                                        # tsc --noEmit, exit 0
git diff --stat <base>..HEAD                             # scope proof: only the two new files (plus nothing else)
git log --oneline <base>..HEAD
```

CI: note the workflow's push trigger is scoped to `feature/tax-intelligence-client-app-r1` only — a push to the kernel branch will NOT trigger it. Trigger via opening a (draft, never-merged) PR against the base branch, or `workflow_dispatch`. Then quote the Actions run ID, job ID, and the **Vitest summary line from the log** (test files + test count). A green checkmark alone is not evidence — this closes open item U5 in the schema doc. (At base, run `40292963302` / job `121472132362` already shows both steps success via API; the log line is what is missing.)

## Authorization (recorded by integrator)

GPT-6's decision authorizes, and the integrator now issues, this authorization: implement **only** `lib/tax-intelligence/canonical.ts` and `lib/tax-intelligence/canonical.test.ts`, tests-first, synthetic fixtures only, on isolated `feature/tax-intelligence-m27-kernel-r1`. If any C1–C5 point cannot be expressed without a new schema decision, stop and escalate to Muse/GPT-6 before coding — do not invent a rule.

## Report back (to Muse integrator, for GPT-6)

- Red-run output (tests-first proof), then green-run outputs.
- Exact commit SHA(s) on `feature/tax-intelligence-m27-kernel-r1`; confirm no other files changed.
- Any schema ambiguity found while implementing — stop and escalate to the integrator; do not invent a rule. Especially: T10 zero-edge choice, and any case where §6 throw-vs-exception feels wrong.
- Verdict language: request Grok's independent read-only diff + CI review; final gate wording is **BLOCK / CONDITIONAL / SYNTHETIC ACCEPTANCE** only. Never "production ready."

## Explicitly not in scope

Replacement of R1/M2.6 engines, UI changes, RLS migrations, live imports, provider adapters, merge/deploy/filing. Those are later gates with their own approvals.
