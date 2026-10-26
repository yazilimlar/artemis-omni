# M2.7.1 — Grok Independent Hardening Review Packet R1

**Gate:** CONDITIONAL; synthetic acceptance not yet granted. Review is READ-ONLY. No edits, merge, deployment, live financial data, filing, security approval, or history rewrite.

## Sources
- Repo `yazilimlar/artemis-omni`, branch `feature/tax-intelligence-m271-hardening-r1`
- Hardened kernel commit `16245238a782` (verify full SHA), amendment commit `26b0753ba652`, baseline `d9a040c0206ab386e770e5049df39995a3c74019`
- `docs/tax-intelligence/M271_SCHEMA_AMENDMENT_R1.md`
- `docs/tax-intelligence/M271_GPT6_HARDENING_HANDOFF_R1.md`
- `lib/tax-intelligence/canonical.ts` and `canonical.test.ts`
- Prior Grok M2.7 review, schema R2, architecture decision.

## Verification claims to independently corroborate
Muse reports red: 8 failed/30 passed; green: 38/38 canonical, TypeScript exit 0. Actions run `40305009626`, job `121511856769`, head `16245238`: reported success, 4 test files / 55 tests passed (38 canonical + 17 legacy), TypeScript step success. Inspect actual CI log and head SHA.

## Adversarial tasks
1. **H1 integrity:** confirm exact eight-field canonical sorted-key SHA-256, recomputed before dedupe for every node. Reproduce retained-digest tampering (amount/date/key/kind/tenant), replay, conflict, supersession. Explicitly report that `supersedesRevision` is outside the digest and remains unprotected provenance. Check `metadataRef`, `legalEntityId` and `id` are likewise not authenticated by this digest.
2. **H2 attribution:** test correct and incorrect `bank-match:<payout key>:<deposit key>` references; duplicate reference, crossed equal payouts/deposits, partial allocation preserving aggregate totals. A self-generated reference is *internally consistent* but **not externally verified bank evidence**; never overclaim.
3. **H3 entities:** verify known-vs-known different entity IDs generate `CROSS_ENTITY_ALLOCATION` and exclude edge from arithmetic; UNKNOWN results `CONTAINS_UNKNOWN`. Check if `VERIFIED_SINGLE_ENTITY` could be misleading when multiple known entities are present but no edge crosses entities, or when no legal entity was actually externally verified. Consider safer `KNOWN_ENTITY_IDS_NO_CROSS_EDGE` wording if needed.
4. **H4 runtime:** unknown relation must yield coded `ILLEGAL_EDGE`, no TypeError. Check relation guard in every code path including cycle detection and attribution.
5. **Additional:** check digest helper in tests is independent enough to catch field/order mistakes; check cash identity, remainder, status and tax pathways remain sound; review legal entity boundary on evidence-class edges too; check duplicate provider event identity and cross-tenant behavior.
6. **Change control:** confirm diff scope, no weakened assertions, no live data or persistence.

## Deliverable
`GROK_M271_HARDENING_REVIEW_R1` with verified evidence, P0/P1/P2 findings, minimal synthetic reproductions, remaining limitations, and gate verdict **BLOCK / CONDITIONAL / SYNTHETIC ACCEPTANCE**. No source edits.

U1–U4 remain UNKNOWN. Production/live import/security/RLS/storage/PII/legal classifications remain BLOCKED regardless of synthetic verdict.
