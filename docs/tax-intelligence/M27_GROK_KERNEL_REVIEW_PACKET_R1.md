# M2.7 — Grok Independent Kernel Review Packet R1

**Status:** REVIEW REQUESTED; synthetic acceptance NOT granted. Read-only review only; no edits, merge, deployment, live imports or filing.

## Source of truth
- Repository `yazilimlar/artemis-omni`
- Kernel branch `feature/tax-intelligence-m27-kernel-r1`
- Kernel commit `acaa54aee240` (Muse reported; verify full SHA and diff)
- Base schema branch `feature/tax-intelligence-m27-schema-r1`, schema commit `c6d95d6d08e5`
- Architecture decision `docs/tax-intelligence/M27_GPT6_ARCHITECTURE_DECISION_R1.md`
- Canonical schema and handoff: `docs/tax-intelligence/M27_CANONICAL_SCHEMA_R1.md` and `M27_CLAUDE_IMPLEMENTATION_HANDOFF_R1.md` (their headings now say R2)
- Review exactly `lib/tax-intelligence/canonical.ts` and `lib/tax-intelligence/canonical.test.ts` against schema and tests T01–T26.

## Reported validation (independently verify)
Muse reports a red run 26 failed/4 passed against stub (4 vacuous toThrow passes), then 30 canonical tests passing, `tsc --noEmit` exit 0. Actions run `40303262028`, job `121506047303`, head `acaa54ae`, reported success, with `Test Files 4 passed (4), Tests 47 passed (47)` and TypeScript success. Do not claim verification without inspecting actual run/log evidence.

## GPT-6 targeted challenges
**G1 — Digest verification.** `canonical.ts` checks `digestSha256` with a 64-char hex regex but does not recompute SHA-256 of the schema's canonical sorted-key payload. T26 calculates a digest but tests only acceptance of a syntactically valid digest; try tampering with an amount while retaining a valid old digest. Determine severity, exact fix and regression.

**G2 — Per-deposit attribution.** Code checks aggregate `observedDepositCents !== observedPayoutCents` and bank remainder, but confirm whether an individual deposit can be over- or mis-attributed while aggregate balances match. Challenge multiple payouts and deposits with crossed links, partial allocations, and unlinked bank nodes. Confirm whether matched status can be falsely certified, not merely whether variance text appears.

**G3 — Identity scope and legal entity.** Verify same provider event keys across tenants and source revisions cannot collide or silently dedupe; verify legalEntityId boundary is enforced when known, or documented UNKNOWN. Check the semantics of cross-entity allocations.

**G4 — Illegal edge contamination.** Verify invalid relation edges are excluded from every identity, conservation, remainder, and tax computation. Check that unknown relation strings cannot crash the engine unexpectedly.

**G5 — Remittance pathway.** Verify `metadataRef` is an adequate explicit direct-remittance discriminator, that remittance-of-withheld cannot be double counted, and that missing provenance fails closed.

**G6 — Status integrity.** Inspect pending vs exception with unlinked merchandise, missing bank deposit, orphan fee/refund, zero-only, wrong-charge attribution, and split payout. Determine if T24 tests wrong attribution or only detects an unrelated unallocated charge.

## Deliverable
Return `GROK_M27_KERNEL_REVIEW_R1` with P0/P1/P2 findings, code line references, minimal synthetic reproductions, test gaps, verified CI log references, and verdict **BLOCK / CONDITIONAL / SYNTHETIC ACCEPTANCE**. No source edits.

Security/live import remains blocked regardless of synthetic verdict. U1–U4 remain owner-controlled/UNKNOWN.
