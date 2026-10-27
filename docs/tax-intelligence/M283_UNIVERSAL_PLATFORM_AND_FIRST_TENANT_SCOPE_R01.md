# M2.8.3 — Universal Platform Scope and First-Tenant Implementation R01

**Owner clarification (2026-10-27).** ARTEMIS Tax & Financial Intelligence is a **general-purpose multi-tenant platform** for any individual, company, holding or organizational structure, across jurisdictions. It is NOT a bespoke application limited to the owner's businesses. The first real-world implementation, once data and security gates are cleared, covers (1) the owner as an individual taxpayer, (2) Great Order LLC, (3) ARTEMIS brand/services, (4) AgoraXAI / aGOraXai.com platform/domain, and (5) Apolloa independent agora, currently pre-registration. These are subjects/roles, NOT automatically five distinct legal taxpayers.

## Required separation
- Tenant, subject, legal entity, individual taxpayer, brand, platform, independent agora, account, asset, activity, legal operator, beneficial owner, and tax-filing unit are separate concepts with evidence-based dated relations.
- Separate legal tax returns from optional management consolidation. No ownership, liability, agency, or tax grouping inferred from platform participation or common branding.
- An Apolloa activity prior to registration must have an evidenced actual operator; no invented Apolloa EIN or tax return.
- Default deny and privacy isolation between tenants and between personal and business records; controlled aggregation requires explicit scope and access policy.
- Real taxpayer/account data may enter only after D-01 auth/RLS, private evidence intake, consent, source reconciliation and security approval. Synthetic-only code until then.

## Required application capabilities
1. Universal entity/role/relationship graph and tenant onboarding.
2. Evidence-backed financial sources: bank, processor, ERP, bookkeeping, payroll, W-2, 1099, prior returns, receipts, invoices, property taxes and other source documents.
3. Canonical ledger and reconciliation: gross sales, discounts/refunds, net sales, sales tax collected/payable, COGS, gross margin, operating expenses, accruals, net income, cash and liabilities; per entity/operator/channel/period.
4. Rules-based filing obligation registry: jurisdiction, tax year, tax classification, actual operator, filing frequency, candidate forms, confirmed obligations, deadlines, evidence and approvals. No blanket form assignment.
5. Tax scenarios with explicit assumptions, source/rule versions, unknowns and CPA/legal review gates.
6. Timeline, task board, outstanding evidence, filing status, owner/assignee, reminders, and auditable signoffs.
7. Explainable multi-entity rollups without false tax consolidation.

## Execution order
A. Preserve M2.8.2 console and verify protected preview.
B. Build synthetic Finance & Compliance UI and contract (first-tenant profiles as safe placeholders) within canonical app, not a new app.
C. Inventory available authorized sources and reconcile identities/legal operators without moving originals.
D. Security-gated, owner-authorized intake of actual data; calculate first-year/period analyses only when evidence sufficient.
E. Independent tax/accounting challenge; no filings, entity registrations, production merge or payments without explicit owner approval.

**Integrator:** Muse. **Builder:** Claude. **Architecture acceptance:** GPT-6. **Challenge:** Gemini (tax/accounting), Grok (security/privacy). No production or live-data authorization by this document.
