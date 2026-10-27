# M2.8.4 — Universal Finance & Tax Intelligence MVP | Multi-AI Execution Contract R01

**Status:** READY_FOR_SCOPED_BUILD (not a release approval). **Date:** 2026-10-27.
**Canonical repo:** yazilimlar/artemis-omni.
**Current integration base:** feature/tax-intelligence-m282-ecosystem-console-r1 at or after commit 82a4e4d0661bc8b1f23e528eed4613ece3afa715.
**New implementation branch (create only after verifying base HEAD):** feature/tax-intelligence-m284-universal-finance-mvp-r1.
**Prior evidence:** M282_HANDOFF_REPORT_R01.md, M283_UNIVERSAL_PLATFORM_AND_FIRST_TENANT_SCOPE_R01.md, M281_HANDOFF_REPORT_R01.md.
**Roles:** Muse integration; Claude implementation; Gemini accounting/tax review; Grok privacy/security adversarial review; GPT-6 architecture/acceptance adjudication; owner retains all production, legal, privacy, and financial decisions.

## First-class scope
Reusable multi-tenant, multi-jurisdiction engine for individuals, companies, holdings, brands, platforms, and independent agoras. First case: owner individual, Great Order LLC, ARTEMIS, AgoraXAI/aGOraXai.com, Apolloa (pre-registration). These are not presumed separate tax filers; entity/operator/brand/filing unit distinctions must be explicit.

## Implement in the canonical Next.js app
1. Finance & Compliance Console route, linked from the existing ecosystem console, mobile-first and accessible.
2. Synthetic-source coverage dashboard: source type, subject, period, permission, verification, completeness, reconciliation state. Include bank, card, ERP, processor, invoice, receipt, payroll, W-2, 1099, tax return, property/school tax.
3. Revenue and P&L model with typed measures: gross sales, discounts, refunds, net sales, sales tax collected (liability, not revenue), COGS, gross profit, expenses, operating profit, accruals, cash, receivables and payables. No synthetic number may be presented as real.
4. Tax and compliance obligation registry: candidate vs confirmed vs filed vs paid vs overdue; per legal taxpayer/operator, jurisdiction, period, rule version, evidence and owner approval. Due dates UNKNOWN unless grounded in rules and facts.
5. Forms workbench: applicability engine and draft form inventory, not fake completed tax forms. Separate federal, state, local, sales/use, payroll, information returns, import/food and business filings.
6. Timeline/task board with dependencies, evidence gaps, owners, status, provenance and links back to the ecosystem console.
7. Strict separation of management rollups from legal tax consolidation; no ownership percentages or subsidiaries inferred from platform relationships.

## Acceptance tests and negative fixtures
- Cross-tenant/cross-subject data leakage rejected; no live identifiers in UI or build artifacts.
- Missing legal operator, jurisdiction, tax classification, year, source or rule => UNKNOWN / needs review, not an invented amount or filing obligation.
- Sales tax collected excluded from gross/net revenue and presented as liability.
- Same invoice/payment/source cannot be double counted in rollups; reconciliation exceptions surfaced.
- No invented tax rates, filing dates, tax savings or personal/business allocations.
- Apolloa not activated as a legal entity without formation evidence.
- Legacy tax page's unsupported ownership percentages quarantined from the new console; propose separate correction without touching production.
- Accessibility, responsive layout, test/typecheck/build, protected-preview auth verified.

## Multi-AI sequence
**Muse:** verify repo, branch, current CI, route and Vercel preview mapping; create isolated child branch; issue single evidence packet; keep change log and reviewer matrix.
**Claude:** implement reusable types, synthetic fixtures, calculations, route/components and tests; commit scoped changes.
**Gemini:** review metric accounting, tax obligation decision tables, no false form applicability, and tax/jurisdiction UNKNOWN semantics. Return P0/P1/P2 findings with file+line and test.
**Grok:** adversarial review of tenancy, auth, data projection, XSS, provenance poisoning, double counting, owner approval spoofing, and leaked identifiers. Return reproducible negative tests.
**Muse:** reconcile findings, rerun tests, typecheck, full build and CI, report commit SHAs, open blockers, Vercel preview status.
**GPT-6:** accept/conditional/block based on committed evidence. Owner tests protected preview.

## Release and privacy gates
No merge to main, production deployment, new Vercel project, tax filing, registration, payment, real personal/company source ingestion, private document intake, RLS migration or cross-app data import without separate owner authorization. Git pushes can trigger existing branch previews; inspect their protection and avoid publishing sensitive data. Source inventory is read-only and may record availability metadata, never private contents in repository.

## Return format
1. Base HEAD and child branch; commit SHAs.
2. Files/routes/screens added.
3. 3 synthetic scenarios: individual taxpayer; single legal entity with multiple brands; independent unregistered agora with actual operator UNKNOWN.
4. Tests, CI, build, auth and visual evidence.
5. Gemini and Grok findings with dispositions.
6. Actual verified preview URL, protected-access state and precise owner actions.
7. Remaining blockers and proposed M2.8.5 scope.
