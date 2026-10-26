# M2.6 — Multi-AI Tax Review Packet R1

**Scope:** ARTEMIS Tax Intelligence only. **Review mode:** read-only. **Data:** synthetic only. **Owner approval required:** live-data import, external sharing of private evidence, production release, filing.

## Canonical references
- Branch: `feature/tax-intelligence-client-app-r1`
- Milestone: `docs/tax-intelligence/M26_AUTONOMOUS_TAX_ENGINEERING.md`
- Kernel: `lib/tax-intelligence/settlement-batches.ts`
- Tests: `lib/tax-intelligence/settlement-batches.test.ts`
- CI: `.github/workflows/tax-intelligence-m26.yml`
- Security: `docs/tax-intelligence/R4_AUTHORIZATION.sql`
- Data bridge: `docs/tax-intelligence/M25_DATA_SOURCE_BRIDGE.md`

## Findings already identified by integrator (not externally verified)
1. **P1 — Settlement model:** current `batchId` assumes a single batch can hold complete charges, fees, payouts and deposits. It does not allocate one charge across multiple payouts; it can misrepresent reserves, rolling settlements, and cross-batch adjustments. Require explicit allocation edges and settlement status.
2. **P1 — Adjustment semantics:** `processor_adjustment` only deducts. Signed corrections, credits, disputes and reversals require distinct types or explicit direction.
3. **P1 — Link validity:** current link check verifies existence and batch, but does not constrain allowed source-to-target relationships, cycles, or allocation amounts. Invalid evidence edges could look reconciled.
4. **P1 — Tax context:** collected sales tax is not automatically withheld by processor, and a payout is not taxable revenue by itself. Require separate sales tax collected/withheld/remitted/liability evidence, and tax rules per entity/year.
5. **P1 — Security gate:** actual two-user/two-tenant access and private-storage download isolation have not been demonstrated. No real imports until verified.
6. **P1 — CI:** screenshot showed failure; commit-scoped connector returned no run because that lookup only exposes PR-triggered runs. CI workflow now includes pull_request and verbose diagnostics, but root cause and passing status remain unverified.
7. **P2 — Integrity:** duplicate source IDs are rejected per source across batches, but the system needs immutable source versions and deterministic replay.
8. **P2 — Money bounds:** input cents are safe integers, but summed totals can exceed safe integer bounds; add overflow validation.

## Review assignments
**Grok — independent adversarial challenger:** find concrete accounting/authorization defects and minimal safe fixes. Do not write code. Prioritize incorrect matches, duplicate income, misleading tax outputs, CI log access and edge-case tests.

**Gemini — data semantics reviewer:** challenge Squarespace processor payout math, refunds, taxes, TD Bank deposit classification, ERP invoice ownership, and evidence provenance. Produce synthetic cases with expected outcomes. Do not claim a provider API exists without verification.

**Muse — integration reviewer:** consolidate disagreements and propose one accepted schema and a staged acceptance gate. Keep financial legal entities separate; ARTEMIS and AGOraXai are brands/platform relationships until documentary evidence proves legal treatment.

**Claude Code — scoped builder:** implement only accepted changes on isolated branch, execute test/typecheck/build, report exact commands, outputs and commit IDs. No merge/deploy.

**GPT-6 — architecture/integration:** reconcile review findings, preserve conText invariants, approve technical implementation scope within owner-authorized sandbox, surface material decisions to owner.

## Required review response schema
- Finding ID / severity P0-P2 / file and line or function / evidence / impact / recommended fix / synthetic reproduction / whether confirmed or hypothetical.
- CI: quote failing step and log evidence, or explicitly state inaccessible.
- Tax: distinguish legal classification from settlement arithmetic.
- Security: distinguish policy text from actual executed tests.
- Gate verdict: BLOCK / CONDITIONAL / READY FOR SYNTHETIC TESTING (never imply production readiness).

## Handoff
Return review findings in a versioned document or chat response for integration. No external model has been invoked by creating this packet. No sensitive financial records should be included.
