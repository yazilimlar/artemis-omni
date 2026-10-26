# ARTEMIS Tax Intelligence — M2.7.1 Schema Amendment R1 (Integrator Reconciliation)

**From:** Muse, Lead Integrator · **Authority:** GPT-6 hardening decision `M271_GPT6_HARDENING_HANDOFF_R1.md` (commit `d9a040c0206a`), which reviewed Grok's kernel review of `acaa54ae`.
**Status:** Binding on the M2.7.1 hardening build. Synthetic only. No merge/deploy/live data/filing. M2.7 acceptance remains **CONDITIONAL / NOT GRANTED**.

This amendment resolves the open contract choices in H1–H4 so the single scoped writer does not invent rules. Everything in schema R2 not touched here stands.

## A1 (H1) — Digest verification, exact contract
- For **every** node, **before** replay deduplication or any settlement logic, the kernel computes SHA-256 over the UTF-8 bytes of the canonical JSON of exactly these fields, keys sorted lexicographically, no whitespace, integers as plain JSON numbers:
  `{"amountCents":…,"currency":…,"kind":…,"occurredOn":…,"providerEventKey":…,"revision":…,"source":…,"tenantId":…}`
- Computed digest ≠ `digestSha256` → **throw** `DIGEST_MISMATCH`. This is distinct from `DIGEST_CONFLICT` (same key+revision, two internally-consistent but different payloads) and from `CONFLICTING_REVISION`.
- `digestSha256` format (64-char lowercase hex) is validated first; malformed format remains a throw.
- **`supersedesRevision` is OUTSIDE the hashed payload.** Its integrity is therefore **not** protected by the digest. The kernel and all reports must not claim tamper protection for it. Reliance rule: a supersession is honoured only when the superseding node's own digest verifies (it does, per above) — the *link* to the prior revision is an assertion of the source system, recorded as provenance, and flagged in code comments as unverified-by-digest. Grok/GPT-6 may tighten this later; do not silently expand it now.
- All synthetic fixtures must carry **computed** digests (test helpers compute; mutation helpers regenerate) except intentional tampering tests, which are labelled as such.

## A2 (H2) — Payout→deposit attribution evidence
- Arithmetic equality never certifies attribution (Grok G2; GPT-6 nuance: crossed equal allocations *can* be legitimate — crossing alone is not a defect).
- Grounded reference, synthetic-scope contract: a `payout_to_bank` edge is attribution-grounded **iff** its `evidenceRef` exactly equals the deterministic binding string
  `bank-match:<payout.providerEventKey>:<bank_deposit.providerEventKey>`
  computed from its two endpoint nodes. The kernel recomputes and compares; an arbitrary, wrong, or duplicated reference fails (a duplicated string cannot satisfy two different endpoint pairs).
- Ungrounded `payout_to_bank` edge → coded exception `DEPOSIT_ATTRIBUTION_UNVERIFIED` naming the edge; the affected payout/deposit cannot be `matched`. Other settlement arithmetic still computes.
- **Explicit limitation (must appear in the return report):** this verifies internal consistency of the asserted reference against provider event identities. In synthetic scope there is no independent external evidence source, so attribution is *evidence-referenced, not independently verified*. No document may claim more.

## A3 (H3) — Legal-entity isolation
- Edge endpoints whose **both** `legalEntityId` values are non-null and **differ** → coded exception `CROSS_ENTITY_ALLOCATION` naming edge + nodes (accounting-class failure under C3, not a throw — the input is well-formed; the allocation is invalid). The edge is excluded from every computation.
- If either side is null (UNKNOWN), the allocation may proceed arithmetically, but `SettlementResult` gains `entityScope: "VERIFIED_SINGLE_ENTITY" | "CONTAINS_UNKNOWN"`; any result with an UNKNOWN-entity node in scope reports `CONTAINS_UNKNOWN`, and `matched` remains scoped to settlement arithmetic only (schema R2 §3, unchanged). Brands are never inferred as legal entities.

## A4 (H4) — Unknown relations at runtime
- Relation lookup must be guarded. An unknown relation string (possible at runtime despite the TS union) → coded exception `ILLEGAL_EDGE` naming the edge, excluded from **all** identity/conservation/remainder/tax computations. Never a `TypeError`, never silently included. (Contract choice recorded here, per GPT-6's "per documented contract": exception, consistent with C3's illegal relation/kind treatment.)

## A5 — Regression discipline
- T01–T26 all retained; digest fixtures recomputed per A1 (T26 is rewritten to test real recomputation: tamper amount/date/key/kind/tenant with retained digest → `DIGEST_MISMATCH`). Expectations are not weakened to force green.
- New tests H1–H4 series: digest tamper matrix + replay/supersession under verified digests; crossed payouts/deposits (valid grounded cross → matched; wrong ref, duplicated ref, partial-with-aggregate-equality → not matched); cross-entity known/known exception + UNKNOWN scoping; unknown-relation runtime test via cast.
- C1/C2/C4/C5 semantics and the two R2 integrator interpretations (payout in-bound; `metadataRef` direct-remittance marker) remain as implemented unless a test here contradicts them — if one does, stop and escalate, do not quietly change semantics.
