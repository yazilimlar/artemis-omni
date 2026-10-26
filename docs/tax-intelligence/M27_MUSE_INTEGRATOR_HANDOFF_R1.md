# M2.7 — Muse Integrator Handoff R1

**Status:** M2.6 BLOCKED; M2.7 schema arbitration required. **Mode:** Read-only review and coordination first. **Data:** synthetic only.

## Start here
- Repository: `yazilimlar/artemis-omni`
- Branch: `feature/tax-intelligence-client-app-r1` (confirm current HEAD)
- Proposed contract: [M27_CANONICAL_ALLOCATION_TAX_CONTRACT_DRAFT.md](./M27_CANONICAL_ALLOCATION_TAX_CONTRACT_DRAFT.md)
- Review packet: [M26_MULTI_AI_REVIEW_PACKET_R1.md](./M26_MULTI_AI_REVIEW_PACKET_R1.md)
- M2.6 milestone: [M26_AUTONOMOUS_TAX_ENGINEERING.md](./M26_AUTONOMOUS_TAX_ENGINEERING.md)
- Source: `lib/tax-intelligence/reconciliation.ts`, `reconciliation.test.ts`, `settlement-batches.ts`, `settlement-batches.test.ts`
- CI: `vitest.config.ts`, `.github/workflows/tax-intelligence-m26.yml`
- UI/security: `app/apps/tax-intelligence/page.tsx`, R3/R4 authorization docs, data-source bridge docs

## Evidence and checkpoint
Grok reported M2.6 BLOCK, including false matched charge/refund wash, incorrect R1 cash tax oracle, absent amount-bearing allocations, unverified authorization, and personal identifiers in public documents. Grok reported Actions run `40255931009`, job `121357640695`, failed because Vitest only included `tests/**` and did not collect `lib/tax-intelligence/**`; TypeScript step was skipped. This report is user-provided challenger evidence, not independently verified CI execution.

GPT-6 verified `vitest.config.ts` mismatch by reading repository and committed:
- `1a69a02e90b9880a7b4b958891ea2f983b6a89a0`: include tax tests in Vitest collection.
- `db62e244579efbcc18b2fd084eb7259aa862bafd`: trigger workflow when Vitest config changes.
No successful CI run has been verified. Do not claim green or production readiness.

## Mission — Muse owns coordination, not production authority
1. Review the proposed M2.7 draft against Grok's findings and source code. Identify confirmed defects vs design choices vs unverified claims.
2. Resolve one **canonical amount-bearing allocation and tax-arithmetic schema**: merchandise, collected tax, refunds, fees, seller credits/debits, withholding, remittance, payout, bank deposit, ERP evidence, pending remainder, idempotent immutable provenance, tenant/entity boundary, USD, safe integer and strict date validation.
3. Validate cash examples: merchandise 10000 cents + collected tax 700 - fee 300 = payout 10400 cents when not withheld; with 700 cents withheld = payout 9700 cents. Neither payout is taxable income; legal tax classification remains UNKNOWN. R1's 9000 cents is not a cash oracle.
4. Publish one reviewed `docs/tax-intelligence/M27_CANONICAL_SCHEMA_R1.md`, identifying unresolved decisions explicitly. Coordinate GPT-6 architecture acceptance before any replacement engine code.
5. Produce `docs/tax-intelligence/M27_CLAUDE_IMPLEMENTATION_HANDOFF_R1.md` specifying tests-first minimal implementation, exact acceptance cases, commands, and evidence.
6. After Claude implements on isolated branch, request Grok's independent read-only diff and CI review; report BLOCK / CONDITIONAL / SYNTHETIC ACCEPTANCE only.

## Required acceptance tests
- Reject false match from unlinked equal charge/refund wash and wrong-charge links.
- Correctly conserve 4000+6000 split across batches and pending 6000 remainder for partial payout.
- Distinguish seller credit from debit; validate ERP mismatch and invalid edges.
- Cash examples 10400/9700 and reject R1's 9000 oracle.
- Deduplicate immutable provider event replay; reject invalid date (2026-02-31), unsafe sum, non-USD, cross-tenant, zero-only match.
- CI logs prove nonzero tax test execution plus TypeScript validation; do not infer from status alone.

## Responsibility and change control
- **Muse:** integrator, schema arbitration, coordination and handoff.
- **GPT-6:** conText architecture acceptance and integration.
- **Claude Code:** sole scoped implementation writer after schema acceptance.
- **Grok:** independent adversarial reviewer; read-only.
- **Gemini:** optional accounting/provider-semantics challenger.
- **Owner:** legal entity/tax characterization, private-data access, external disclosure, production merge/deploy/filing, irreversible git history changes.
- No simultaneous edits to implementation files by multiple models. Document commits on isolated feature branch are permissible only with access and clear scope.

## Security and privacy blockers (separate gate)
No live imports until in-repo migrations, enforced RLS, two-role denial tests, storage download tests, and UI claims supported by evidence. Redact unnecessary personal identifiers in public branch documents; history rewrite requires owner approval. Do not copy personal identifiers into review outputs.

## Muse first response
Provide: schema assessment and amendments; one proposed authoritative schema or explicit blockers; Claude-ready implementation handoff; CI/security gates; any commits and test evidence; next owner checkpoint. Avoid routine owner questions; escalate only consequential decisions.

**Do not implement the replacement reconciliation kernel, merge, deploy, import live data, or file taxes during this handoff.**
