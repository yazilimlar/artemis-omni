# M2.6 — Tax Intelligence Autonomous Engineering Factory

Status: **SCOPED AND AUTHORIZED FOR ISOLATED FEATURE-BRANCH DEVELOPMENT ONLY**. No live financial ingestion, production merge, deployment, filing, or new provider credentials.

## Mission
Advance only the ARTEMIS Tax Intelligence application. Implement an evidence-driven, multi-tenant tax and accounting context kernel with minimal owner intervention. Every proposed classification and amount must be traceable, reproducible, reversible and reviewable.

## Operating contract
- **Autonomous:** read-only repository/provider discovery; synthetic fixtures; scoped branch code; test plans; deterministic accounting logic; code/security reviews; documentation; exception summaries.
- **Owner approval:** new OAuth/financial permissions, real tax-document ingestion, sending private records to other models, changing production infrastructure, financial postings, tax filing, merges or deployments.
- **Escalate by exception:** only missing legal-entity ownership, ambiguous economic classifications, material variance, failing authorization gate, unsupported tax rules or consequential actions.
- **Never assert** that an unexecuted test passed, that connected ChatGPT Finance/Plaid credentials can be reused in ARTEMIS, or that an API integration exists before verification.

## conText Kernel contract
Each economic event has a stable ID, tenant, possible legal entity, event type, effective/settlement/recorded timestamps, source observations, evidence links, amount/currency, certainty, bookkeeping classification, tax treatment (separate), rule version, reviewer disposition, and audit trail. Preserve unresolved entity ownership as UNKNOWN. A sale, payout, bank deposit and ERP invoice can reference the same event; do not count them as independent revenue.

## Execution work packages
### WP-01 Reconciliation hardening
- Replace simplistic global payout formula with settlement-batch-aware accounting.
- Separate sales tax collected, merchant remittance, processor withholding and tax liability.
- Support refunds, partial payouts, payout delays, chargebacks, multiple orders and currency rejection.
- Deterministic cent-based tests, duplicate/cross-tenant rejection, missing-link and ambiguous-match quarantine.

### WP-02 Security gate
- Verify two actual auth identities, two synthetic tenants, read/write/list/download isolation and membership revocation.
- No real source documents until all required isolation tests pass.

### WP-03 Source contracts
- Finance/Plaid: inspect coverage and account ownership; use only permitted ChatGPT access, no credential export.
- Squarespace: verify supported API/export and payout semantics before adapter.
- Prime Industrial: locate authoritative source and map schema read-only.
- Historical tax records: classify filing status and tax year from private evidence; no PII in repo.

### WP-04 Tax-specific models
- Personal vs Great Order legal-entity boundary; separate AG United pending verification.
- Federal/NY tax-year rule packs and documented uncertainty.
- W-2/1099/returns are evidence, not automatically new ledger income.
- Accruals, tax payments, property/school taxes, sales tax, intercompany elimination and cash forecast remain separate models.

### WP-05 Tax cockpit
- Source health/coverage, evidence graph, reconciliation waterfall, unresolved exceptions, tax scenarios, audit timeline, CPA-ready export and explicit approval queue.

## Quality gates
- Typecheck, tests, build and security checks must be **executed** with recorded results.
- No cross-tenant exposure or sensitive financial data in public repo, CI logs, screenshots or synthetic fixtures.
- Show evidence for every amount and accounting decision.
- Independent Muse/Gemini/Claude review uses synthetic data unless owner authorizes redacted real evidence.
- No automatic main merge, production deploy, financial posting or tax filing.

## Owner-facing reporting
One compact milestone report: completed changes and commits; tests executed and results; known accounting limitations; data/source blockers; approval requests only if genuinely necessary. Next step should be independently executable on the feature branch.

## Immediate next step
Implement a settlement-batch-aware reconciliation engine with synthetic fixtures; retain existing R1 for backwards compatibility until test/build evidence supports replacement. Inspect existing project test scripts before asserting CI status.
