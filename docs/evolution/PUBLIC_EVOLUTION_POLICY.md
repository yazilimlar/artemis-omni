# Artemis Public Evolution and Structure Policy

## Purpose

Artemis maintains two connected but distinct records:

1. **Internal engineering truth** — running code, tests, accepted ADRs, engineering registries, feature passports, pull requests, validation output, and handovers.
2. **Public institutional memory** — a curated, versioned explanation of Artemis structure, operating principles, public product maturity, and verified milestones.

The public record exists to make Artemis understandable and traceable without exposing information that would create security, privacy, commercial, or operational risk.

## Canonical Public Surfaces

- Human-readable page: `/evolution`
- Machine-readable record: `/api/public/artemis-structure`
- Source model: `data/artemisPublicStructure.ts`

The website page and JSON endpoint must derive from the same source model so the public narrative and machine-readable record do not drift.

## Authority

The public record is not the highest engineering authority. When public language conflicts with repository truth, resolve the conflict in this order:

1. Running source code, tests, and verified build output
2. Accepted ADRs
3. `ENGINEERING/ARCHITECTURE.md`
4. Engineering standards, security rules, and deployment rules
5. Division, product, and testbed registries
6. Feature passports and handovers
7. Public evolution record
8. Conversation notes

A public statement must be corrected when a higher-authority source proves it inaccurate or obsolete.

## Required Public Labels

Every material public structural statement must be classifiable as:

- **Current** — verified present structure, accepted principle, or public capability.
- **Directional** — intended future direction; not a claim of an existing legal entity, staffed division, or production product.
- **Historical** — dated milestone retained to explain evolution.

Prototype, sample, synthetic, fallback, pilot, and live-data states must remain explicit. Presence on `main` or on a public route does not by itself prove production maturity.

## What Should Be Published

Publish when useful and verified:

- Accepted organizational and product architecture
- Public division and product-family descriptions
- Public maturity, visibility, and data-mode labels
- Review principles and lifecycle summaries
- Verified milestones and supersession reasons
- Public-safe explanations of how changes are controlled
- Public record version and review date

## What Must Remain Private or Restricted

Do not publish:

- Credentials, tokens, environment contents, or secret values
- Private client, employee, financial, legal, or operational records
- Security-sensitive configuration and internal emergency rollback coordinates
- Unreleased donor-branch details that provide no public value
- Confidential commercial strategy
- Unverified capabilities or speculative promises presented as current fact
- Weaknesses whose publication would create avoidable security exposure

## Memorialization Rule

A major architecture or organizational change should produce all of the following:

1. Accepted or superseding ADR
2. Updated internal registries
3. Scoped implementation branch and pull request
4. Automated validation and preview review
5. Updated dated evolution note
6. Updated public structure record when the change is appropriate for publication

Earlier decisions are not silently erased. Mark them superseded, retired, or historical and retain the reason.

## Revision Rule

The public record may be revised whenever evidence changes. Revision is not failure; undocumented drift is failure.

Each revision should:

- change the record version or review date,
- identify the controlling decision or evidence,
- preserve relevant historical milestones,
- avoid turning a provisional experiment into a public commitment,
- pass normal pull-request and preview review.

## Anti-Roadblock Principle

Documentation must support work rather than freeze it. Public and internal records should describe current truth, decision boundaries, and explicit uncertainty. They should not prescribe unnecessary implementation detail, lock Artemis into temporary names, or prevent future divisions and products from being reorganized through a documented decision.
