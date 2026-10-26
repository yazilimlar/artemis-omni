# ARTEMIS Tax Intelligence — GPT-6 M2.7.1 Synthetic Acceptance Decision R1

**Decision:** SYNTHETIC ACCEPTANCE of M2.7.1 canonical settlement kernel ONLY. **Not production authorization.**
**Review target:** `feature/tax-intelligence-m271-hardening-r1`, kernel commit `16245238a782bef112930ff65e86bc2dad7dc920`.
**Basis:** Muse implementation and independent Grok `GROK_M271_HARDENING_REVIEW_R1` (user-relayed). Grok reports independently verified Actions run `40305009626`, job `121511856769`, exact head SHA, `Test Files 4 passed (4)`, `Tests 55 passed (55)`, TypeScript step success. GPT-6 previously inspected actual hardened kernel, tests, and amendment from GitHub.

## Accepted synthetic scope
- H1: canonical eight-field sorted-key JSON SHA-256 recomputed before deduplication; digest mismatch fails closed.
- H2: deterministic `bank-match:<payout key>:<deposit key>` reference binding; unsupported/duplicated references block `matched`. Crossed allocations may match if supported by references.
- H3: known cross-legal-entity edges are excluded and coded `CROSS_ENTITY_ALLOCATION`; unknown entity scope disclosed.
- H4: unknown runtime relations yield coded `ILLEGAL_EDGE` rather than a crash.
- Existing T01–T26 accounting identities, cash conservation, remainders, tax pathways, ERP evidence tie-out, and status semantics retained. Synthetic tests: 38 canonical + 17 legacy = 55 per Grok CI review.

## Mandatory residual qualifications
1. The digest covers only `tenantId, source, providerEventKey, revision, kind, amountCents, currency, occurredOn` (sorted in canonical JSON). `supersedesRevision`, `metadataRef`, `legalEntityId`, and internal `id` are NOT digest-protected. Do not claim provenance authentication from the hash alone.
2. `bank-match` is **internally consistent evidence referencing**, not independent provider/bank verification. The graph may calculate arithmetic on ungrounded edges, but must not certify those edges as verified.
3. `VERIFIED_SINGLE_ENTITY` means internally consistent non-null entity IDs within the contract, NOT external verification of legal identity. Do not represent as legal identity certification.
4. Tax position is arithmetic tracking, not a legal/tax classification or filing determination.
5. Owner decisions U1–U4 remain UNKNOWN; no default or inferred answer.

## Gates not authorized
No merge into main, production deployment, live account/ERP/processor import, real personal/financial data, RLS/storage/security signoff, PII remediation/history rewrite, or tax filing. Those require separate evidence, review, and explicit owner approval at the relevant irreversible boundary.

## Next phase
Muse may prepare a read-only M2.8 integration/security plan and evidence inventory, including bank/provider provenance contract, authenticated legal-entity registry, RLS two-tenant denial tests, storage isolation, privacy and public-repository identifier audit, and U1–U4 owner decision matrix. Keep changes isolated and synthetic. Do not modify production or integrate live data. Invite Grok to review the next implementation only after a scoped build is committed.

**Gate language:** M2.7.1 SYNTHETIC ACCEPTANCE; production/live/security/legal gates BLOCKED.
