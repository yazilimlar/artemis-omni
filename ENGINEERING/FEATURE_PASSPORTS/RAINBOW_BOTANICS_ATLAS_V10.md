# Rainbow Botanics Atlas v10 — Feature Passport

- **Division:** natural-systems
- **Product:** rainbow-botanics
- **Product family:** rainbow-botanics
- **Lifecycle:** noindex_draft
- **Maturity:** internal_experiment
- **Visibility:** noindex_review
- **Data mode:** mixed_explicit — original Rainbow House photographs plus explicitly provisional visual identifications
- **Canonical route:** `/rainbowbotanics`
- **Reference review route:** `/rainbowbotanics/hemerocallis-fulva`
- **Integration branch:** `product/rainbow-botanics-atlas-v10`

## Purpose

Provide an evidence-led collection home for the Rainbow House botanical archive while preserving the existing canonical specimen renderer and Hemerocallis reference plate.

## Donor provenance

- `rainbow_house_botanical_intelligence_atlas_v8_grok_gemini_synthesis(2).html`
- ChatGPT/Codex v9 reference-specimen integration
- ChatGPT/Codex v10 six-species evidence migration
- 20 user-supplied original field photographs from the 2026-09-12 intake

The donor is selectively integrated as an isolated standalone HTML engine behind an iframe, consistent with `ENGINEERING/ARCHITECTURE.md`. No unrelated donor code is imported.

## Public-safety boundaries

- Exact residence coordinates and image EXIF location are not exposed in the UI.
- Public locality is generalized to Hudson Valley / Marlboro, New York.
- Photo-based identifications use visible I0–I4 confidence states.
- Provenance uses separate P0–P4 confidence states.
- Orange Cosmos images remain taxonomically separated from *Cosmos bipinnatus*.
- The route remains `noindex` until publication blockers and taxonomic review are resolved.

## Validation gates

- TypeScript typecheck
- ESLint
- Next.js production build
- Vercel preview READY
- Desktop and mobile visual review
- Existing `/rainbowbotanics/hemerocallis-fulva` route remains available
- No unrelated product paths changed

## Governing decisions

- ADR-001 — domain and Vercel deployment
- ADR-002 — isolated standalone visual engine
- ADR-004 — security and private location protection
- ADR-005 — AI engineering operating system
- ADR-006 — Natural Systems ownership and visibility/data-mode boundaries

## Next gate

Human review of the deployed preview, correction of provisional species assertions, and explicit approval before merge to production/indexability review.
