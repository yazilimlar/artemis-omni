# Hemerocallis fulva Production Log

Specimen ID: RB-2026-00071  
Pipeline: Prismaflora Foundry Pipeline  
Status: draft reference implementation

## M1 - Standards Manual

Date: 2026-07-01
Branch: governance/aieos-foundation

Completed:

- Created reference specimen structure.
- Defined required knowledge layers.
- Defined visual asset protocol.
- Marked source gaps and publication blockers.
- Kept exact location private.
- Reviewed local source-photo and generated-poster context without committing the
  images into the repository.
- Registered dark archive, dark technical Atlas, vertical engineering, and light
  parchment visual variants as design references.
- Validated JSON schema syntax.
- Ran repository typecheck, lint, and production build.

Not completed:

- Source photo ingestion.
- AI identification run.
- Citation gathering.
- Final poster generation.
- Final blueprint generation.
- Public page implementation.
- Social package export.

Validation:

- `node -e` JSON parse for `specimen.schema.json` and `theme.schema.json` passed.
- `npm run typecheck` passed.
- `npm run lint` passed with the existing Next.js lint deprecation notice.
- `npm run build` passed and generated 60 static pages.

## Next Production Step

Run manual intake with an approved source photo set:

1. Create protected source folder outside public assets.
2. Extract public-safe metadata.
3. Run species identification and alternate-candidate check.
4. Generate draft specimen JSON.
5. Generate draft ABTE theme JSON.
6. Reconcile existing generated-poster claims against sourced data.
7. Redact or replace exact-looking coordinate and locality overlays.
8. Fill source references.
9. Generate the first approved visual asset set.
10. Review with multi-model QA.
11. Approve preview before any public route is created.

## M2 - Schema-backed Fixture

Date: 2026-07-01
Branch: feature/rainbow-botanics-prismaflora-m2

Completed:

- Added repository-safe specimen fixture at `data/rainbow/specimens/hemerocallis-fulva.json`.
- Added engineering-mode ABTE fixture at `data/rainbow/themes/hemerocallis-fulva-summer-engineering.json`.
- Added typed exports and helpers in `data/rainbow/index.ts`.
- Kept exact GPS, raw EXIF, source photos, generated posters, public routes, and
  publishing automation out of the repo.
- Validated JSON syntax, TypeScript, lint, and production build after clearing stale
  `.next` route types from the previous branch state.

Validation:

- JSON parse passed for standards schemas and M2 data fixtures.
- `npm run typecheck` passed.
- `npm run lint` passed with the existing Next.js lint deprecation notice.
- `npm run build` passed and generated 58 static pages.

Remaining gates:

- Add formal schema validation after selecting a runtime validator or build step.
- Replace draft botanical facts with cited references.
- Run rendered contrast checks when a UI consumes the theme fixture.
- Build public pages only after the M2 data contract is accepted.

## M3 - Source-safe Draft Preview Route

Date: 2026-07-01
Branch: feature/rainbow-botanics-prismaflora-m2

Completed:

- Added direct review route at `/rainbowbotanics-2026/hemerocallis-fulva`.
- Marked the route as a draft preview and `noindex`.
- Kept the route out of `sitemap.xml`.
- Added a cropped, source-safe derivative image at
  `public/rainbow-botanics/hemerocallis-fulva/bloom-reference.jpg`.
- Verified the derivative image has no Spotlight latitude or longitude metadata.
- Rendered the page from repository data instead of generated-poster text.
- Displayed publication blockers directly on the page.

Validation:

- `npm run typecheck` passed.
- `npm run lint` passed with the existing Next.js lint deprecation notice.
- `npm run build` passed and generated 59 static pages, including the Rainbow route.
- Local production server returned `200` for the route and image asset.
- Local sitemap check returned no `rainbowbotanics` entries.

Remaining gates:

- Push branch and create a Vercel preview URL.
- Add external citations before lifting `noindex`.
- Replace draft/generated concept claims with sourced data.
- Decide whether the launch path remains `/rainbowbotanics-2026/...` or moves under a
  Labs/Library review surface.
