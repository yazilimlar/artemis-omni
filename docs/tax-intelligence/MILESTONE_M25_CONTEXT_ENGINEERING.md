# Milestone M2.5 — conText Engineering Financial Integration Bridge

**Decision:** APPROVED AS A DESIGN MILESTONE (2026-10-25). **Delivery status:** SPECIFIED / NOT IMPLEMENTED. No production merge, live import, credential sharing, or filing authorized.

## Why this is conText Engineering
ARTEMIS does not merely connect APIs or add totals. It reconstructs the *context* in which each financial event occurred: who owns the money, who legally earned it, which source observed it, when it occurred, whether it settled, which documents support it, how it is classified for bookkeeping versus tax, and which version of the interpretation is defensible. Context is an explicit, versioned engineering object—not an AI guess or a free-text note.

**Reality → Evidence → conText Kernel → Linked Models → Reconciliation / Scenarios → Reviewed Decisions → Controlled Actions.**

A Squarespace order, a processor payout, a TD Bank deposit, a Prime Industrial ERP invoice, and a tax-return line are *different observations*, not five independent revenue events. Their relationships must be proven, not assumed.

## System architecture
1. **Reality sources:** GPT Finance/Plaid-linked accounts (through authorized access, not reusable ChatGPT credentials), Squarespace APIs/exports, Prime Industrial ERP verified schema/API, W-2/1099, TurboTax-supported exports, filed federal/NY returns, receipts and statements.
2. **Evidence adapters:** least-privilege read-only; provider identity; immutable original/hash; effective timestamp; sync coverage; idempotency; corrections/version history; quarantine invalid records.
3. **conText Kernel:** tenant; taxpayer; legal entity; beneficial owner; source account; counterparty; transaction; event; evidence; classification; obligation; tax jurisdiction/year; provenance; certainty; relationship edges; permission scope.
4. **Linked models:** cash, accrual, sales-tax, settlement, intercompany, payroll, personal, property/school tax, and federal/NY income tax. Each model declares assumptions and applicability; no automatic double-counting.
5. **Simulation:** alternative entity assignments, gross-vs-net sales, fees, tax liability, cash timing, deductible-vs-nondeductible expense, missing-document scenarios; preserve baseline and variance.
6. **Decision cockpit:** exception queue, evidence graph, reconciliation waterfall, what-if engine, review status, CPA handoff, owner-controlled approval.

## Priority vertical slice: Great Order / Prime Industrial
Squarespace order -> charge/payment -> processor fee and tax -> payout -> TD Business Checking **9102** deposit -> ERP receivable/settlement -> supplier payment. Record many-to-many partial settlements, refunds, chargebacks, timing differences, and transfers. Never use account ending alone as tenant authorization. Confirm the ERP authoritative code/data source before implementing its adapter.

## Context graph invariants
- Every record belongs to exactly one authorized tenant scope, while legal-entity attribution may be unknown pending review.
- Source observations are not journal entries by default. A reconciled economic event may link to multiple observations.
- Every calculated number is reproducible from source references, transformation version, effective rules and assumptions.
- Never merge personal and business finances solely because the same individual controls both accounts.
- Open-source code and public demos contain synthetic data only; real documents remain private.
- AI suggestions carry model identity, timestamp, confidence, supporting evidence, and reviewer disposition; no silent ledger mutations.
- Cross-tenant RLS and private document download tests must pass before real ingestion.

## Milestone acceptance criteria
- [x] Source architecture and evidence contract documented.
- [x] Historical Drive evidence metadata inventoried (2024, 2018, other candidates; content unverified).
- [x] Finance connector discovery confirms TD Business Checking 9102 is linked; account freshness and separate TD connection error require follow-up.
- [ ] Prime ERP repository/schema/API located and read-only mapping approved.
- [ ] Squarespace API scope/export capability verified; credential strategy approved.
- [ ] Two-tenant, two-user authorization and document access isolation tested.
- [ ] Synthetic reconciliation fixture: order-to-bank-to-ERP, refunds, partial payouts, tax, fees, transfers and duplicate imports.
- [ ] Deterministic reconciliation engine and evidence graph implemented with tests.
- [ ] Security/CPA review; explicit owner approval before live import, merge or release.

## Multi-AI collaboration
GPT-6: integrator and context-schema architect. Claude Code: scoped implementation and independent code/security review. Muse: cross-domain systems synthesis and integration challenge. Gemini: adversarial data mapping, tax classification and reconciliation test design. Grok: optional independent challenge. Reviewers receive versioned repo documents and synthetic fixtures; real private financial data only via explicitly approved, authorized channels. Owner approves scope and releases.

## Milestone interfaces
- Source specification: `M25_DATA_SOURCE_BRIDGE.md`.
- Historical source metadata: `HISTORICAL_EVIDENCE_INVENTORY_R1.md`.
- Security gate: R4 authorization policies and actual two-identity test evidence.
- Deliverable after gate: synthetic **Great Order / Prime Industrial conText Reconciliation Cockpit R1**.

## Explicit non-goals
No claim of a direct TurboTax or Squarespace connector without verification; no export of ChatGPT Finance/Plaid credentials to ARTEMIS; no automated tax filing; no assumption that AG United, ARTEMIS, AGOraXai, Apolloa and Great Order are the same legal taxpayer.
