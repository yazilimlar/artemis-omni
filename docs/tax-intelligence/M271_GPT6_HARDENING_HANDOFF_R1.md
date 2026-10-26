# M2.7.1 — GPT-6 Hardening Decision and Muse Handoff R1

**Verdict:** M2.7 synthetic acceptance remains **CONDITIONAL / NOT GRANTED**. Grok reviewed kernel commit `acaa54aee2401b409627091606c1e4ebf29ed204` read-only and verified Actions run `40303262028`, job `121506047303`, 4 tax test files / 47 tests passing, TypeScript step success. The passing tests do not close the findings below.

## Scope
One writer (Muse's scoped builder or Claude), isolated branch based on M2.7 kernel. Synthetic only. No R1/M2.6 rewrite, production merge/deploy, live financial data, filing, security-gate claim, or history rewrite.

## Required fixes and tests

### H1 — P0: canonical SHA-256 verification
- Compute SHA-256 of UTF-8 JSON with **lexicographically sorted keys** `amountCents,currency,kind,occurredOn,providerEventKey,revision,source,tenantId` and canonical numeric values; compare to `digestSha256` for **every node before replay deduplication**. Keep digest lower-case 64 hex.
- A well-formed digest with mismatched payload **throws** `DIGEST_MISMATCH`; same provider key/revision with different valid payloads remains a conflict. Distinguish digest mismatch from idempotency conflict.
- Replace all placeholder/padded synthetic fixture digests with computed digests. Ensure mutation helpers regenerate digests except in intentional tampering tests.
- Regression: correct digest accepted; mutate amount, date, key, kind or tenant with retained digest => rejected. Replay same key+payload => idempotent; valid conflicting revision follows explicit supersession.
- Document precisely whether `supersedesRevision` is in or outside the hashed payload; if outside, its integrity is **not** protected by the digest and needs explicit verification/provenance before reliance. Do not claim tamper protection for unhashed fields.

### H2 — P1: per-deposit attribution
- Separate **arithmetic conservation** from **evidence of intended payout→deposit mapping**. Mathematically equal crossed payouts and deposits can be legitimate. Do not reject solely for crossing.
- Require a grounded allocation evidence reference whose identity authorizes each `payout_to_bank` edge, or explicitly return pending/exception when no such evidence exists. An arbitrary nonempty string is not independent verification.
- Add adversarial fixtures: two payouts/two deposits with crossed equal amounts, wrong reference, duplicated reference, partial allocation with aggregate equality, and a valid cross-allocation with supporting evidence. Show precisely which case must be `matched` and why. If no independently checkable evidence source exists in synthetic-only scope, **do not claim attribution verified**; return conditional with explicit limitation.

### H3 — P1: legal-entity boundaries
- If both endpoints have known, non-null `legalEntityId` values that differ, fail closed with coded `CROSS_ENTITY_ALLOCATION` (or a structural throw if the canonical contract explicitly chooses that). Add tests.
- If either side is UNKNOWN, do not silently certify legal-entity attribution; keep it UNKNOWN and ensure `matched` is explicitly scoped to settlement arithmetic only. Never infer brands as legal entities.
- Keep tenant isolation mandatory.

### H4 — verify the rest
- Unknown relations must be tested at runtime, not assumed safe from TypeScript union; `RELATIONS[eg.relation]` may be undefined and cause a `TypeError` before a coded exception. Return deterministic `ILLEGAL_EDGE` or throw `INVALID_RELATION` per documented contract.
- Preserve C1 evidence-vs-cash distinction, C2 tax-pathway unknown, C3 throw/exception semantics, C4 attribution, C5 supersession.
- Retain all T01–T26 tests, adjusting digest fixtures correctly. Do not weaken expectations to force green.

## Evidence and gate
1. Muse publishes a short reconciled amendment; builder commits scoped implementation + new tests on isolated branch.
2. Supply red-to-green test evidence, `npx vitest run lib/tax-intelligence --reporter=verbose` test counts, `npm run typecheck`, exact commit SHA and diff.
3. Run Actions on actual branch and cite run/job IDs and log summary.
4. Grok independently reviews the diff and adversarial reproductions. GPT-6 adjudicates **BLOCK / CONDITIONAL / SYNTHETIC ACCEPTANCE**.
5. Live import, RLS/storage tests, UI claims, PII remediation, legal classifications, deployment, merge and filing remain separately BLOCKED.

## Important nuance
Grok's G2 finding establishes a plausible attribution weakness, not proof that crossed equal-valued allocations are always invalid. Evidence must establish correct relationships; arithmetic cannot. Grok's G4 assertion that unknown relation strings are safely handled should be tested against runtime behavior, not accepted without reproduction.
