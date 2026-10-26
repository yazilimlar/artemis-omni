# GPT-6 M2.7 Architecture Decision — ADR R1

**Verdict: CONDITIONAL ARCHITECTURE ACCEPTANCE.** Reviewed Muse's `M27_CANONICAL_SCHEMA_R1.md` and `M27_CLAUDE_IMPLEMENTATION_HANDOFF_R1.md` on `feature/tax-intelligence-m27-schema-r1`. This accepts the synthetic design direction, **not** kernel implementation, live-data access, production release, or tax filing.

## Accepted
- A1: separate `charge_merchandise` and `charge_tax_collected`; never use a lump gross charge as the cash/tax oracle.
- Cash identity: 10000 merchandise + 700 collected tax − 300 fee = 10400 without withholding, or 9700 with 700 withheld. R1's 9000 cash oracle is rejected.
- Amount-bearing typed allocations; partial source remainder is pending; orphan wash cannot match; explicit seller credit/debit; ERP invoice is evidence, not a second revenue event.
- USD safe-integer amounts, strict calendar dates, source identity/revision/digest, tenant boundaries; matched means arithmetic/evidence settlement only.
- U1–U4 remain UNKNOWN/owner-controlled; security/live-import gate remains BLOCKED.

## Binding clarifications before Claude writes kernel
**C1 — Evidence links vs consumption.** `order_to_charge`, `erp_to_order`, and `refund_to_charge` are identity/economic-evidence relations, not payout cash consumption. Do not subtract these edges from a node's payout allocation capacity. Define conservation per relation and node role, not a single sum of all incoming/outgoing edges. `order_to_charge` targets merchandise component only; tax component requires its own provenance but must not consume merchandise order value. For ERP, validate identity and amount independent of payout allocations.

**C2 — Tax remittance vs withholding.** `withheld_to_payout` represents a deduction from seller payout. `withheld_to_remittance` is evidence of subsequent remittance of that withheld amount, **not a second deduction**. A single withheld event may have both edges without double consuming its amount. Tax arithmetic must avoid double subtraction: `collected - refundedTax - withheld - directlyRemitted`, where `directlyRemitted` excludes any remittance already represented by `withheld`. If provenance cannot distinguish remittance pathways, status must not certify a tax position; flag unknown/exception instead of guessing.

**C3 — Invalid input vs accounting exceptions.** Malformed edge amount (zero/negative/unsafe), malformed identity/date/currency, duplicate/conflicting IDs and cross-tenant boundaries **throw**. Structurally well-formed but illegal relation/kind pair, cycle, over-allocation, mismatched ERP and unexplained transactions return coded `exception` with node/edge IDs. Tests T10 must follow this exact split.

**C4 — Wrong-charge attribution.** Aggregate cash equality is insufficient. The source merchandise component, tax component and fees/refunds must be allocated to the correct payout through validated typed edges. Unlinked economically material components remain pending or exception, never matched. Add a test that preserves equal global totals while linking the payout to the wrong charge.

**C5 — Provider event identity.** Canonical payload digest must have an unambiguous canonicalization contract; digest alone is not proof two differently keyed events are duplicates. Same provider key/revision/digest is idempotent. Conflicting payload for same key/revision throws. Supersession must be explicit; no automatic replacement of revisions without evidence.

## Implementation authorization
Muse should incorporate C1–C5 into one updated schema and handoff, then Claude may implement **only** new synthetic `canonical.ts` and `canonical.test.ts` on isolated `feature/tax-intelligence-m27-kernel-r1`, tests-first. If any clarification cannot be expressed without a new schema decision, escalate to Muse/GPT before coding. Grok performs independent read-only review of diff and CI test-count evidence.

## Required gates
- Demonstrate red-to-green tests T01–T20 plus C1–C5 edge cases.
- Log nonzero executed tax test count, TypeScript exit 0, exact commit, and two-file diff.
- Never merge/deploy/import live data/file taxes on this decision.
- Keep authorization, RLS, storage, ownership copy, public PII redaction, and history rewrite as separate tracked security/owner gates.
