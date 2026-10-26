# ARTEMIS Tax Intelligence — M2.7 Canonical Allocation & Tax Contract (DRAFT FOR MUSE/GPT ACCEPTANCE)

**Status: DESIGN DRAFT / BLOCKED.** Synthetic only; no import, merge, deployment, filing, or production claims. Grok's M2.6 findings are challenger evidence; implementation must follow an accepted single schema. M2.6 and R1 remain comparison baselines, **not accounting oracles**.

## Non-negotiable invariants
1. Evidence nodes have tenantId, legalEntityId (or UNKNOWN), source, immutable provider event key, source revision, SHA-256 payload digest, strict calendar date, currency=USD, and source provenance. Same event/revision replay is idempotent; conflicting digest is exception.
2. Every amount is a nonnegative safe integer of USD cents. Direction is represented by explicit kind, not an ambiguous sign. Safe-integer validation applies after every sum and subtraction.
3. Sale economics separate **merchandise**, **sales tax collected**, **refund merchandise**, **refund tax**, **fees**, **seller debits**, **seller credits**, **tax withheld**, **tax remitted**, **payout**, and **bank deposit**. An event's tax treatment is not inferred from its cash movement.
4. Evidence edges are typed, directional, amount-bearing allocations with unique IDs. Validate allowed edge types, tenant/entity/currency equality, endpoints, cycles, and conservation. No unsupported/unlinked charge/refund/fee may be silently absorbed by offsetting values.
5. Allow one source charge to fund multiple payouts and one payout to fund multiple deposits; require explicit allocations with sums bounded by available source amounts. Partial allocations produce **pending remainder**, not exception. Over-allocation or illegal edges are **exception/reject**.
6. Processor cash identity, subject to evidence and allocation: **payout = merchandise + tax collected - merchandise refunds - tax refunds - fees - seller debits + seller credits - tax withheld**. A bank deposit is linked to payout with its own allocation. Unresolved timing/rolling reserves remain pending; do not fabricate deposits.
7. Arithmetic tax position: **tax collected - tax withheld - tax remitted**, with refunded-tax corrections represented explicitly. Label as **arithmetic tracking only**, not legal tax liability, deductible expense, taxable income, or filing advice. Provider withholding/remittance is UNKNOWN until documented.
8. ERP invoices are independent source evidence and must tie by documented amount and identity to merchandise/order lines; unsupported invoices cannot certify a match. Do not count invoice and processor charge twice as revenue.
9. A status of **matched** requires conserved allocations, valid evidence links, no unexplained transactions, and consistent cash identities. It does **not** certify income-tax treatment, sales-tax remittance, legal entity ownership, or production readiness.
10. Reject impossible calendar dates (YYYY-MM-DD strict round-trip), mixed currencies, unsafe sums, zero-only false positives, unsupported duplicate events, cross-tenant edges, and missing source attribution.

## Suggested schema surface (review before coding)
- `EvidenceNode`: id, tenantId, legalEntityId|null, source, sourceEventId, revision, digestSha256, occurredOn, currency, kind, amountCents, metadataRef.
- `AllocationEdge`: id, tenantId, fromId, toId, relation, amountCents, evidenceRef; kinds include order-to-charge, charge-to-payout, fee-to-payout, refund-to-payout, payout-to-bank, erp-to-order, tax-withheld-to-payout.
- `SettlementResult`: matched/pending/exception, cash expected/observed, explicit remainder by node, tax arithmetic separately, exceptions with node/edge IDs.
- Separate economic classifications and cash allocations; an edge must not silently turn a tax event into a merchandise event.

## Mandatory red tests before implementation
1. Equal-value orphan charge/refund wash must not match.
2. Payout linked to wrong charge must not match.
3. 10000 charge allocated to 4000 + 6000 payouts across batches conserves source.
4. 4000 payout against 10000 eligible charge returns pending 6000.
5. Seller credit increases payout; seller debit reduces it.
6. Merchandise 10000, collected tax 700, fee 300 => non-withheld payout 10400; withheld 700 => payout 9700; R1's 9000 is rejected as cash oracle.
7. ERP amount mismatch cannot certify match.
8. Replay with different sourceId but same immutable provider key cannot double-count.
9. Reject 2026-02-31, overflow, unsupported currency, illegal links, cross-tenant edges, zero-only match.
10. CI must explicitly collect tax tests and report nonzero executed test count; TypeScript validation must execute.

## CI correction
`vitest.config.ts` currently includes only `tests/**/*.test.ts(x)`, while tax tests are in `lib/tax-intelligence/*.test.ts`. Update include to also cover tax tests, and add `vitest.config.ts` to CI path triggers. Require actual passing run logs; do not call green until observed.

## Security and privacy release gate (separate)
No live import until actual migrations with ENABLE/FORCE RLS as appropriate, two-role denial tests, storage download denial test, verified client identity, and UI legal-ownership claims reconciled against documents. Redact personal identifiers from public current files, separately assess git history and historical deployments; no history rewrite without owner consent.

## Open owner questions
- Does a particular processor withhold and remit tax? UNKNOWN pending statements.
- Are ARTEMIS/AGOraXai/Apolloa brands, operating units, or legal taxpayers? UNKNOWN pending documents.
- Is a git-history rewrite authorized? NO; requires explicit decision.

## Implementation sequence
Muse critiques and publishes a single accepted schema -> GPT reviews -> Claude adds failing tests in collected path -> Claude implements minimal synthetic kernel -> execute Vitest, typecheck, CI -> Grok reviews diff and logs. No production merge.
