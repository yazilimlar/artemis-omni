# ARTEMIS Tax Intelligence — M2.7 Canonical Schema R1

**Status: PROPOSED — awaiting GPT-6 architecture acceptance. NOT production, NOT merged.**
**Integrator:** Muse (OctopusG) · **Base commit reviewed:** `e348e1f6b156b5f15924abd90b74154237b65a2b` on `feature/tax-intelligence-client-app-r1`
**Data:** synthetic only. **Mode:** schema arbitration; no replacement kernel is authorized by this document alone.
**Supersedes for design purposes:** the M2.7 draft contract (`M27_CANONICAL_ALLOCATION_TAX_CONTRACT_DRAFT.md`). M2.5 R1 (`reconciliation.ts`) and M2.6 (`settlement-batches.ts`) remain comparison baselines, **not oracles**.

Evidence states used here: **Verified** = I read the source / API result at the base commit myself. **Declared** = reported by another model, not recomputed. **Unknown** = no evidence in repo.

---

## 1. Arbitration of Grok's M2.6 BLOCK — confirmed vs design vs unverified

| # | Grok finding | State | Evidence at e348e1f |
|---|---|---|---|
| G1 | False matched charge/refund wash | **Verified defect** | Both engines decide match from *aggregate totals + link existence only*. `reconciliation.ts`: `expected = gross − fees − tax − refunds`, discrepancies are total comparisons; a refund with `linksTo: []` still subtracts. `settlement-batches.ts`: refund/fee nodes need no valid link to the charge they offset. Equal orphan amounts cancel silently. |
| G2 | R1 cash tax oracle is wrong (9000) | **Verified defect** | `reconciliation.test.ts` asserts `netExpectedPayoutCents = 9000` for merchandise 10000, tax 700, fee 300 (formula subtracts collected tax). Correct cash oracles are in §5: **10400** not withheld, **9700** withheld. R1's 9000 is rejected as a cash oracle. |
| G3 | No amount-bearing allocations | **Verified defect** | `linksTo: string[]` in both engines — no amount, no relation type, no per-edge conservation. A payout "linked" to *any* charge in the batch passes (`byId.get(id)?.kind === "charge"`). Wrong-charge links therefore pass. Cross-batch links are flagged, so a true 4000+6000 split of one charge is impossible in M2.6 (its "split" test duplicates a whole batch instead). |
| G4 | Authorization unverified | **Verified as gate, not as code absence** | `page.tsx` does enforce server-side: `requireAuth()`, RPC `tax_my_client_ids()`, fail-closed on RPC error (empty = no clients). R3/R4 SQL exists **only as docs files**, not as in-repo migrations; no executed two-role / two-tenant denial tests or storage download tests are in evidence. Live import stays **BLOCKED** (§8). |
| G5 | Personal identifiers / ownership claims in public documents | **Verified (partial)** | `app/apps/tax-intelligence/page.tsx` renders proposed ownership percentages for pre-formation entities as page copy. Per M2.6, legal entity/taxpayer status is **UNKNOWN** pending documents — the UI must not present proposed ownership as fact. Redaction/claim-correction is an owner-gated doc fix; **git history rewrite is NOT authorized**. I do not reproduce the identifiers in this document. |
| G6 | CI failed: Vitest collected only `tests/**`, tax tests skipped, TypeScript step skipped | **Verified for the cited run; superseded at HEAD** | Grok's run `40255931009` (head `a5a9e08`) failed — consistent with the pre-fix config. GPT-6's fixes are in the tree I read: `1a69a02` adds `lib/tax-intelligence/**/*.test.ts(x)` to `vitest.config.ts` include; `db62e24` adds `vitest.config.ts` to workflow path triggers. Actions API, read by me: run `40292390667` (db62e24) **success**, run `40292963302` (HEAD e348e1f) **success**, job `121472132362` steps "Tax intelligence unit tests" = success and "TypeScript validation" = success. **Caveat:** step success is Verified; the *nonzero executed test count inside the logs* is **not yet quoted** — Claude's handoff (§ / implementation handoff) must paste the Vitest summary line. Do not call CI "green by logs" until that line exists in evidence. |
| G7 | `processor_adjustment` only deducts | **Verified defect** | Code comment admits it: "Adjustments are deductions in R1; signed adjustments require a later schema." Resolved in §3 by distinct `seller_credit` / `seller_debit` kinds — no signed-amount ambiguity. |
| G8 | Unsafe sums / weak dates / no currency in M2.6 | **Verified defect** | Per-observation `Number.isSafeInteger` is checked, but `total()` sums are never re-validated. Dates use `Date.parse` (accepts `2026-02-31` by rollover). `settlement-batches.ts` has **no currency field at all**. R1 checks USD but has **no date validation**. All fixed in §2/§6. |
| G9 | ERP invoice can certify / double-count | **Verified defect (certification half)** | R1 correctly counts revenue from orders only, but an `erp_invoice` amount mismatch produces **no discrepancy** — ERP amount is never compared. §4 requires amount+identity tie; mismatch = exception. |
| G10 | Duplicate detection is per `source:sourceId` only | **Verified gap vs draft** | No immutable provider event key, revision, or payload digest. Same provider event under a different `sourceId` double-counts; same key with a conflicting payload is indistinguishable from a replay. §2 fixes this. |

**Design choices (not defects):** batch grouping as a *reporting* view; positive-magnitude amounts with direction carried by kind; synthetic-only scope; `matched` never certifying legal tax treatment. These are retained.

**Unverified claims (stay Declared):** any provider's actual withholding/remittance behaviour; Squarespace/TD/ERP semantics beyond the synthetic fixtures; legal classification of any payout. All **UNKNOWN** until documented (§7).

---

## 2. Canonical types (the one schema)

All money: `amountCents` is a **nonnegative safe integer** of USD cents. Direction lives in `kind`/`relation`, never in sign. Currency is the literal `"USD"`; anything else is rejected. Every arithmetic operation re-validates `Number.isSafeInteger` on its result.

```ts
type EvidenceNode = {
  id: string;                    // internal, unique
  tenantId: string;
  legalEntityId: string | null;  // null = UNKNOWN, never guessed
  source: string;                // provider/system identifier
  providerEventKey: string;      // immutable provider event identity
  revision: number;              // >= 1, integer; supersession per §6
  digestSha256: string;          // /^[0-9a-f]{64}$/ over canonical payload
  occurredOn: string;            // strict YYYY-MM-DD, §6
  currency: "USD";
  kind: NodeKind;
  amountCents: number;           // nonnegative safe integer
  metadataRef?: string;          // pointer only; no PII in repo/fixtures
};

type NodeKind =
  | "order" | "charge_merchandise" | "charge_tax_collected"
  | "refund_merchandise" | "refund_tax"
  | "fee" | "seller_credit" | "seller_debit"
  | "tax_withheld" | "tax_remitted"
  | "payout" | "bank_deposit" | "erp_invoice";
```

**Amendment A1 (vs draft and vs M2.6):** a processor charge is *never* a single lump node. Merchandise and collected tax are separate component nodes (`charge_merchandise`, `charge_tax_collected`). M2.6's lump `charge = 10700` is exactly what made the R1/R2 oracle dispute possible; the canonical schema removes the ambiguity at the type level. An `order` node carries the merchandise total for ERP tie-out and is not itself cash.

```ts
type AllocationEdge = {
  id: string;                    // unique
  tenantId: string;
  fromId: string; toId: string;  // node ids, direction = cash/evidence flow
  relation: Relation;
  amountCents: number;           // > 0, safe integer
  evidenceRef: string;           // why this allocation exists (doc/statement ref)
};

type Relation =
  | "order_to_charge"        // order        -> charge_merchandise (+ charge_tax_collected)
  | "charge_to_payout"       // charge_*     -> payout
  | "fee_to_payout"          // fee          -> payout (reduces it, via identity §5)
  | "refund_to_charge"       // refund_*     -> charge_* it reverses
  | "refund_to_payout"       // refund_*     -> payout (reduces it, via identity §5)
  | "credit_to_payout"       // seller_credit-> payout (increases it)
  | "debit_to_payout"        // seller_debit -> payout (reduces it)
  | "withheld_to_payout"     // tax_withheld -> payout (reduces it)
  | "withheld_to_remittance" // tax_withheld -> tax_remitted
  | "payout_to_bank"         // payout       -> bank_deposit
  | "erp_to_order";          // erp_invoice  -> order
```

The relation table is **closed**: any (from.kind, relation, to.kind) triple not listed above is an illegal edge → reject. Edges must satisfy: same `tenantId` on edge and both endpoints; same currency (always USD); endpoint kinds match the relation; no cycles in the allocation graph; `amountCents > 0`.

```ts
type SettlementResult = {
  tenantId: string;
  status: "matched" | "pending" | "exception";
  expectedPayoutCents: number;   // §5 identity, from allocated components
  observedPayoutCents: number;
  observedDepositCents: number;
  remainderByNodeId: Record<string, number>; // unallocated available amount per node
  taxArithmetic: { collectedCents: number; withheldCents: number; remittedCents: number; positionCents: number };
  exceptions: { code: string; nodeIds: string[]; edgeIds: string[] }[];
};
```

## 3. Conservation and status semantics

- For every node, `sum(allocations out) ≤ node.amountCents` and `sum(allocations in, where the relation consumes) ≤ node.amountCents`. Over-allocation → **exception** (`OVER_ALLOCATION`), never silent clamping.
- Unallocated available amount is the node's **pending remainder**. A remainder on a charge/payout is **pending**, not an error (rolling reserves, timing).
- `matched` requires ALL of: every payout fully explained by the §5 identity over *allocated* components; every bank deposit allocated from a payout with equal total; zero remainder on payout and bank nodes in scope; no exceptions; no unexplained node in scope (a node with amount > 0 and no edges must be explicitly remainder-reported, and if it is a refund/fee/credit/debit/withheld node with no payout edge, status cannot be `matched`). `matched` certifies **settlement arithmetic only** — never income-tax treatment, sales-tax liability, legal ownership, or production readiness.
- `pending`: no exceptions, but remainder > 0 or an expected payout/deposit not yet observed.
- `exception`: any illegal edge, over-allocation, identity variance with all evidence present, ERP mismatch, digest conflict, or unexplained offsetting node.
- **Zero-only rule:** a scope whose nodes are all zero, or whose only "match" is 0 = 0, can never be `matched` → `exception` (`ZERO_ONLY_MATCH`) if asserted, else `pending`.
- **Wash rule (kills G1):** a refund offsets a charge/payout *only* through its own typed edges (`refund_to_charge`, `refund_to_payout`). An unlinked refund is an unexplained node; it never enters the identity. Same for fees, credits, debits, withheld.

## 4. ERP tie-out

An `erp_invoice` is independent evidence. `erp_to_order` must tie by identity (edge exists) **and** amount (invoice amount equals the order's merchandise total). Amount mismatch → `exception` (`ERP_AMOUNT_MISMATCH`); invoice can never certify a match alone, and invoice + charge are never both counted as revenue (revenue events = orders only).

## 5. Cash identity and tax arithmetic (canonical oracles)

Over **allocated** components for a payout:

```
expectedPayout = merchandise + taxCollected
               − refundMerchandise − refundTax
               − fees − sellerDebits + sellerCredits
               − taxWithheld
```

**Worked oracles (acceptance, non-negotiable):**
- Merchandise 10000, tax collected 700, fee 300, not withheld → **expected payout 10400**.
- Same, with tax withheld 700 → **expected payout 9700**.
- **9000 is rejected** as a cash oracle in all cases (it double-subtracts collected tax).

A bank deposit is linked to a payout by `payout_to_bank` allocation with its own amount; deposit ≠ payout total → variance reported; deposits are never fabricated for pending payouts.

```
taxPosition = taxCollected − taxWithheld − taxRemitted   (refundTax corrects taxCollected via allocation, explicitly)
```

`taxPosition` is **arithmetic tracking only**. It is not legal tax liability, not deductible expense, not taxable income, not filing advice. **Neither payout figure (10400 / 9700) is taxable income.** Legal classification of every amount remains **UNKNOWN** (§7).

## 6. Validation order (fail-closed)

Structural violations **throw** (input is not a settleable set) — consistent with existing tests:
1. Empty tenant / empty node set.
2. Cross-tenant node or edge; tenant mismatch edge↔endpoint.
3. Non-USD currency; non-safe-integer or negative `amountCents`; unsafe result after **any** sum/subtraction during evaluation.
4. Strict date: `occurredOn` must match `^\d{4}-\d{2}-\d{2}$` **and** round-trip (`new Date(y, m-1, d)` components equal input) — `2026-02-31` throws.
5. Duplicate internal `id`; duplicate edge `id`.
6. Idempotency: key = `(source, providerEventKey, revision)`. Same key + same digest → replay is a **no-op dedupe** (counted once). Same key + **different digest** → throw (`DIGEST_CONFLICT`). A higher revision supersedes a lower one only with a distinct digest and an explicit supersession record; two different `providerEventKey`s are two events even if amounts coincide — and two nodes claiming the same provider event under different keys is the caller's data error, surfaced via digest/identity checks, not silently merged. (Kills G10's double-count-by-new-sourceId case when the provider key is stable, which is the contract providers must meet.)

Accounting mismatches (identity variance, ERP mismatch, illegal/over-allocating edges, unexplained nodes, zero-only) do **not** throw — they produce `status: "exception"` with coded exceptions naming node/edge IDs.

## 7. Unresolved decisions — explicit blockers, not defaults

| ID | Decision | State | Owner of decision |
|---|---|---|---|
| U1 | Does any specific processor withhold and remit sales tax? | **UNKNOWN** — no statements in evidence | Owner (documents) |
| U2 | Legal entity / taxpayer status of ARTEMIS, AGOraXai, Apolloa, Great Order | **UNKNOWN** — proposed ownership in UI copy is not evidence | Owner (documents) |
| U3 | Legal tax classification of payouts, fees, credits | **UNKNOWN** — schema tracks arithmetic only | Owner / CPA |
| U4 | Git-history rewrite for identifier redaction | **NOT authorized** | Owner only |
| U5 | CI log test-count evidence | Step success Verified; log line unquoted | Claude (in implementation handoff) |

No code may encode a guess for U1–U3. `legalEntityId: null` and `taxPosition` labelling exist precisely to hold these open.

## 8. Security / privacy gate (separate, still BLOCKED for live data)

No live import, no real documents, no production claim until ALL exist as **executed evidence**: in-repo migrations with RLS enabled (forced where appropriate); two-role + two-tenant denial tests (read/write/list/download); storage download denial test; verified client identity path; UI ownership claims reconciled to documents (U2). R3/R4 SQL in `docs/` is design text until it lands as migrations with tests.

## 9. What GPT-6 is asked to accept

1. §2 types + closed relation table, incl. Amendment A1 (split charge components).
2. §3 status semantics incl. wash rule and zero-only rule.
3. §5 identity and the 10400 / 9700 oracles; 9000 rejected.
4. §6 throw-vs-exception split and idempotency key.
5. §7 blockers stay open; nothing in code guesses them.

On acceptance, Claude implements per `M27_CLAUDE_IMPLEMENTATION_HANDOFF_R1.md`. No merge, deploy, live data, or filing is authorized by acceptance of this schema.
