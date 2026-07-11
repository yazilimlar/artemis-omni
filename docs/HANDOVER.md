# Handover: Session 2026-07-11 — Public Evolution & Structure v1

Standardized, parse-friendly handover. Historical states remain available through Git and dated files under `docs/evolution/`.

## Current State

- Repo: `yazilimlar/artemis-omni`
- Canonical integration branch: `main`
- AIEOS v2 governance merge on `main`: `989d468f71385f39c97c40574ec934ed9a8edddc`
- Current work branch: `product/public-evolution-structure-v1`
- GitHub default branch still requires manual correction from `feature/artemisix19-autonomous-generator` to `main`
- Vercel Production Branch remains a separate setting and was not changed in this session
- Production deployment was not changed in this session

## Division and Product Ownership

- Division: Artemis Core Platform / Knowledge & Academy
- Product family: public institutional memory and company architecture
- Change class: public product surface plus documentation
- Visibility: public
- Data mode: curated repository evidence
- Governing ADRs: ADR-003, ADR-005, ADR-006

## Completed Before This Branch

PR #8 was validated and squash-merged into `main`.

The merge established:

- Artemis as a multi-division umbrella organization and product platform
- Division, Product, and Testbed Migration registries
- ArtemisIX19 as a testbed and cross-division capability donor
- separation of branch lifecycle from product lifecycle
- explicit maturity, visibility, and data-mode requirements
- selective rescue requirements for contaminated donor branches

## What This Branch Adds

### Public surfaces

- `/evolution` — human-readable Artemis Evolution & Structure page
- `/api/public/artemis-structure` — read-only machine-readable public structure record
- `data/artemisPublicStructure.ts` — shared typed source model for both public surfaces

### Public record content

- multi-division Artemis structure
- current, directional, and historical interpretation labels
- controlled change and approval loop
- revised public branch-lifecycle explanation
- internal-vs-public record layers
- dated evolution milestones
- publication and withholding boundary
- distinction between Artemis divisions and the client departments Artemis serves

### Public memorialization policy

- `docs/evolution/PUBLIC_EVOLUTION_POLICY.md`
- `docs/evolution/2026-07-11-multidivision-aieos-v2.md`

### Site-shell integration

- Adds `Evolution & Structure` under the footer Company navigation
- Adds `/evolution` to the sitemap
- Broadens global footer and site-description language so construction remains a flagship focus without defining all of Artemis

## Public Record Rules

1. Internal engineering truth remains authoritative over the public projection.
2. Public statements must be labeled current, directional, or historical.
3. Division labels are not automatic claims of separate legal entities or staffed business units.
4. Prototype, testbed, sample, synthetic, fallback, and live states remain explicit.
5. Earlier milestones are retained and may be marked superseded rather than silently erased.
6. Public transparency does not include credentials, private records, security-sensitive configuration, confidential strategy, or unnecessary emergency-operation detail.
7. Documentation must support revision and future growth rather than freeze temporary names or implementations.

## Verification Required

Run on the branch through CI or a clean worktree:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- inspect `/evolution` at desktop and mobile widths
- inspect `/api/public/artemis-structure` for valid, public-safe JSON
- verify footer navigation and sitemap
- confirm no private paths, credentials, client records, or security-sensitive values are exposed

## Known Review Points

- Division names remain architectural working categories and may be renamed through a later accepted decision.
- The public record intentionally summarizes branch classes without publishing private branch inventory or rollback coordinates.
- The public structure record must be reviewed whenever ADR-006 or the internal registries materially change.
- Product-by-product public maturity remains governed by the Product Registry and verified behavior.

## Next Recommended Tasks

1. Open a draft PR from `product/public-evolution-structure-v1` to `main`.
2. Allow GitHub Actions and Vercel preview checks to complete.
3. Review public language and disclosure boundaries in the deployed preview.
4. Merge only after human review.
5. Manually change the GitHub default branch to `main` in repository Settings.
6. Verify Vercel Production Branch separately.
7. Start the next product-specific branch from the updated `main`, likely CivicBid selective rescue or ArtemisIX19 capability inventory.
