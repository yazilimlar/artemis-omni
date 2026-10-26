# ARTEMIS Tax Intelligence — M2.7 Canonical Schema R2

**Status: CONDITIONALLY ACCEPTED by GPT-6 (ADR `M27_GPT6_ARCHITECTURE_DECISION_R1.md`, commit `4519bd6d05ab`) with binding clarifications C1–C5 incorporated in this R2. Synthetic kernel implementation authorized under that decision. NOT production, NOT merged.**
**Integrator:** Muse (OctopusG) · **Base commit reviewed:** `e348e1f6b156b5f15924abd90b74154237b65a2b` on `feature/tax-intelligence-client-app-r1`
**Data:** synthetic only. **Mode:** schema arbitration; the kernel is authorized only as specified in the implementation handoff R2.
**R2 changes (GPT-6 C1–C5):** §2 relation classes split evidence vs cash-consumption (C1); §5 tax arithmetic corrected to exclude remittance-of-withheld from direct remittance, with pathway-unknown rule (C2); §6 throw-vs-exception split made exact (C3); §3 wrong-charge attribution strengthened (C4); §2/§6 digest canonicalization contract + explicit supersession (C5).
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
  revision: number;              // >= 1, integer; supersession per §6/C5
  supersedesRevision?: number;   // C5: explicit supersession only; absence = no supersession
  digestSha256: string;          // /^[0-9a-f]{64}$/ over the canonical payload, §6/C5
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
  // — Evidence class (C1): identity/provenance assertions. They NEVER consume
  //   payout allocation capacity and never enter the cash identity directly.
  | "order_to_charge"        // order        -> charge_merchandise (merchandise only)
  | "order_to_charge_tax"    // order        -> charge_tax_collected (tax provenance; does not consume order merchandise value)
  | "erp_to_order"           // erp_invoice  -> order (identity + amount tie, §4)
  | "refund_to_charge"       // refund_*     -> charge_* it reverses (identity)
  | "withheld_to_remittance" // tax_withheld -> tax_remitted (C2: evidence of remittance OF the withheld amount)
  // — Cash-consumption class: these consume the source node's amount capacity
  //   and are the only edges that enter the §5 identity.
  | "charge_to_payout"       // charge_merchandise | charge_tax_collected -> payout
  | "fee_to_payout"          // fee          -> payout (reduces it)
  | "refund_to_payout"       // refund_*     -> payout (reduces it)
  | "credit_to_payout"       // seller_credit-> payout (increases it)
  | "debit_to_payout"        // seller_debit -> payout (reduces it)
  | "withheld_to_payout"     // tax_withheld -> payout (reduces it)
  | "payout_to_bank";        // payout       -> bank_deposit
```

The relation table is **closed**: any (from.kind, relation, to.kind) triple not listed above is an illegal edge → coded exception (C3). Edges must satisfy: same `tenantId` on edge and both endpoints; same currency (always USD); endpoint kinds match the relation; no cycles among cash-consumption edges; `amountCents > 0` (a zero/negative/unsafe edge amount is malformed input → throw, C3).

**Conservation is per class and per role (C1), never one global sum:** only cash-consumption edges draw on a node's capacity (§3). Evidence edges carry their own checks instead: `order_to_charge` amounts into a `charge_merchandise` node must total ≤ the order's merchandise amount and, for the order to be considered tied, exactly the charge's merchandise amount; `order_to_charge_tax` must equal the `charge_tax_collected` amount it supports and draws nothing from the order's merchandise value; `erp_to_order` is validated by identity + amount equality independent of payout allocations (§4); `refund_to_charge` asserts which charge a refund reverses and consumes nothing; `withheld_to_remittance` may coexist with `withheld_to_payout` at the **full** withheld amount — the two edges together do not over-consume the withheld node (C2).

```ts
type SettlementResult = {
  tenantId: string;
  status: "matched" | "pending" | "exception";
  expectedPayoutCents: number;   // §5 identity, from allocated components
  observedPayoutCents: number;
  observedDepositCents: number;
  remainderByNodeId: Record<string, number>; // unallocated available amount per node
  taxArithmetic: { collectedCents: number; refundedTaxCents: number; withheldCents: number; directlyRemittedCents: number; positionCents: number | null; pathwayUnknown: boolean };
  exceptions: { code: string; nodeIds: string[]; edgeIds: string[] }[];
};
```

## 3. Conservation and status semantics

- For every node, the sum of its **cash-consumption** edges out ≤ `node.amountCents`, and cash-consumption edges into a payout/bank node are bounded by that node's amount. Evidence-class edges do not count toward these sums (C1). Sole exception: `withheld_to_remittance` + `withheld_to_payout` on the same withheld node may each reach the full amount (C2). Over-allocation → **exception** (`OVER_ALLOCATION`), never silent clamping.
- **Attribution (C4):** aggregate cash equality is never sufficient. Merchandise, tax, fee, refund, credit/debit and withheld components must each be allocated to the *correct* payout through their typed cash edges. A payout whose edges point at the wrong charge leaves the true source components unexplained → not matched (exception, or pending if the correct payout is simply not yet observed — never matched).
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
taxPosition = taxCollected − refundedTax − taxWithheld − directlyRemitted        (C2)
```

where `directlyRemitted` counts only `tax_remitted` amounts that are **not** the remittance of an already-counted `tax_withheld` amount: a remittance evidenced by a `withheld_to_remittance` edge is the same money leaving through the withholding pathway and is **never subtracted twice**. The withheld amount itself enters the identity once, at `withheld_to_payout` (cash) / as `taxWithheld` here. **Pathway rule:** if a `tax_remitted` node's pathway cannot be distinguished (e.g. it has no `withheld_to_remittance` evidence while a withheld amount it could represent is in scope, and no explicit direct-remittance provenance), the kernel must not guess: status gets exception `TAX_PATHWAY_UNKNOWN`, `taxArithmetic.pathwayUnknown = true`, and `positionCents = null` — no tax position is certified.

`taxPosition` is **arithmetic tracking only**. It is not legal tax liability, not deductible expense, not taxable income, not filing advice. **Neither payout figure (10400 / 9700) is taxable income.** Legal classification of every amount remains **UNKNOWN** (§7).

## 6. Validation order (fail-closed)

**Throw vs exception — exact split (C3).** Malformed input **throws** (it is not a settleable set):
1. Empty tenant / empty node set.
2. Cross-tenant node or edge; tenant mismatch edge↔endpoint.
3. Non-USD currency; non-safe-integer or negative node `amountCents`; **edge `amountCents` zero, negative, or unsafe**; unsafe result after **any** sum/subtraction during evaluation.
4. Strict date: `occurredOn` must match `^\d{4}-\d{2}-\d{2}$` **and** round-trip (`new Date(y, m-1, d)` components equal input) — `2026-02-31` throws.
5. Duplicate or conflicting internal `id`; duplicate edge `id`; digest conflict (item 6); undeclared conflicting revisions (item 6).

Structurally well-formed but accounting-invalid input does **not** throw — it produces `status: "exception"` with coded exceptions naming node/edge IDs: illegal relation/kind pair, cycle among cash-consumption edges, over-allocation, ERP amount mismatch, identity variance, unexplained nodes, zero-only match, tax pathway unknown (C2).

6. Idempotency and provider identity (C5): key = `(source, providerEventKey, revision)`. Same key + same digest → replay is a **no-op dedupe** (counted once). Same key + **different digest** → throw (`DIGEST_CONFLICT`). **Digest canonicalization contract:** `digestSha256` is SHA-256 (hex, lowercase) of the UTF-8 canonical JSON of exactly the fields `[tenantId, source, providerEventKey, revision, kind, amountCents, currency, occurredOn]`, keys sorted lexicographically, no whitespace, numbers as plain integers. A digest proves payload identity **only under the same key** — it never proves two differently-keyed events are duplicates, and differently-keyed events are never merged. **Supersession is explicit (C5):** two revisions of one key may coexist in an input only if the higher carries `supersedesRevision` equal to the lower; then only the higher settles. Without that marker → throw (`CONFLICTING_REVISION`). No automatic replacement of revisions, ever.

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

## 9. Acceptance record

GPT-6 decision (commit `4519bd6d05ab`): **CONDITIONAL ACCEPTANCE** — §2 types + closed relation table incl. Amendment A1, §3 status semantics incl. wash and zero-only rules, §5 identity and the 10400 / 9700 oracles (9000 rejected), §6 idempotency — all accepted; C1–C5 binding and incorporated in this R2 (§2, §3, §5, §6). §7 blockers stay open; nothing in code guesses them.

On this acceptance, Claude implements per `M27_CLAUDE_IMPLEMENTATION_HANDOFF_R1.md` (R2). No merge, deploy, live data, or filing is authorized by acceptance of this schema.
