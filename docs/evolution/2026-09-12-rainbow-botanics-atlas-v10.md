# Rainbow Botanics Atlas v10 Integration — 2026-09-12

- Branch: `product/rainbow-botanics-atlas-v10`
- Division: Artemis Natural Systems
- Product: Rainbow Botanics
- Change class: product-specific standalone prototype integration
- Canonical route proposed: `/rainbowbotanics`
- Existing reference route preserved: `/rainbowbotanics/hemerocallis-fulva`

## Files changed

- `app/rainbowbotanics/page.tsx`
- `public/rainbow-botanics/atlas-v10/index.html`
- `public/rainbow-botanics/atlas-v10/collection.v2.json`
- `public/rainbow-botanics/atlas-v10/assets/IMG_*.jpeg`
- `ENGINEERING/FEATURE_PASSPORTS/RAINBOW_BOTANICS_ATLAS_V10.md`
- `ENGINEERING/PRODUCT_REGISTRY.yaml`
- this evolution note

## Donor provenance

Selective extraction from the user-supplied Rainbow House Atlas v8 HTML plus Codex v9/v10 reference and evidence-migration work. No branch-wide or cross-product donor merge.

## Verification required

Typecheck, lint, build, Vercel preview status, permanent-route navigation, image loading, responsive layout, noindex metadata, and unchanged Hemerocallis rendering.

## Known risks

Four collection identities remain provisional visual assertions and require human/botanical review. The Atlas remains a review surface and must not be described as a confirmed scientific catalog.

## Next recommended task

Complete preview QA, collect multi-model and human feedback, correct evidence assertions, then approve or reject production merge.
