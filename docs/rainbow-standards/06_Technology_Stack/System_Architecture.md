# System Architecture

## Recommended Stack

Use the existing Artemis stack unless a future ADR changes direction:

- Next.js App Router
- TypeScript
- Tailwind CSS
- GitHub
- Vercel
- MDX or typed content registry for editorial pages
- JSON schemas for generated specimen data
- Supabase or MongoDB Atlas only after a later approved data milestone
- Cloudinary, S3, or Vercel Blob only after media-storage architecture is approved

## Phase 1

Documentation and schemas only:

- `docs/rainbow-standards/`
- specimen schema,
- theme schema,
- reference implementation,
- production pipeline definition.

No public route changes in Phase 1.

## Phase 2

Data and theme implementation:

- TypeScript types generated or hand-mirrored from schema,
- sample JSON fixture for Hemerocallis,
- ABTE token generation utility,
- validation tests.

## Phase 3

Reference page:

- one Hemerocallis page,
- tabs and components,
- public-safe Atlas placeholder,
- downloads disabled until assets are approved.

## Phase 4

Generator:

- drag/drop manual upload,
- local draft generation,
- human review UI,
- no automatic public posting.

## Phase 5

Batch publishing:

- specimen queue,
- completeness score,
- preview publishing,
- social package export,
- longitudinal tracking.

## Architecture Constraints

- Keep Rainbow Botanics as an Artemis domain, not a disconnected app.
- Do not add auth, billing, database writes, or external media storage without an ADR.
- Keep private source media and public assets separated.
- Maintain preview-first deployment.
