# ArtPlex logo — v2 (draft 3, in review)

**Owner direction, George, 2026-11-03:** ArtPlex moves to the compass logo from the owner's concept sheet. The design is being finalized with the owner. Until this note says *final*, these files are drafts.

## Decisions so far (owner, 2026-11-03)

| Topic | Decision |
| --- | --- |
| Claim symbol | **None.** No ® (ArtPlex is not a registered mark) and no ™ in the logo. |
| Tagline | **ESTIMATION PLATFORM** (not the sheet's "Engineering Intelligence Platform"). |
| Credit line | "by ARTEMIS Construction", with the **existing official Artemis mark** beside it. The owner will supply that mark; until then the line is text only. |
| Ruler | **13 units**, numbered 0–13, drawn in front of the legs so every number reads (draft 3). |
| Semicircle | **Removed** from the mark (draft 3). |
| Page hero | **New vector hero, logo only**: no temple or city (draft 3). It is built from the clean logo. The sheet's photographic poster is not used: it repeats "An ARTEMIS Construction Solution", the archer covers "ENGINEERING" and part of the A, and its ruler numbers are out of order. |

## Files (`public/brand/artplex/`)

| File | Use |
| --- | --- |
| `artplex-lockup-light.svg` | Navy line mark and wordmark on cream. Light pages, print. |
| `artplex-lockup-dark.svg` | Gold mark, cream wordmark on navy. Dark pages. |
| `artplex-mark.svg` | Detailed line mark, square. |
| `artplex-app-icon.svg` | Gold simplified mark on a navy rounded square. App icon and favicon source; reads down to 32 px. |
| `artplex-mark-navy.svg`, `-white.svg`, `-gold.svg` | One-colour simplified marks. |
| `artplex-hero.svg` | 1600×900 hero: the gold mark on navy with a faint blueprint grid and soft glow, then wordmark, tagline and credit. |

Palette, from the sheet: Aegean Navy `#0B1F3B`, Artemis Gold `#D4A017`, Engineering Silver `#B0B7C3`, Pergamon Cream `#F5F1E6`, Digital Blue `#3B82F6`.

How the files were made: the compass is redrawn geometrically, not traced. The sheet's panels disagree with each other (an "A" on the hinge in the icons but not in the primary logo; the ruler reads "0 1 2 3 5"), so tracing would copy those flaws. The mark keeps the sheet's parts: knurled handle, ring, hinge disc with A, legs, gear on a crossbar, ruler, foot knobs and needle points. The gold arc was removed at the owner's request. The wordmark is Cormorant Garamond Bold and the small text is Montserrat (both OFL), converted to outlines. Generator: `scripts/brand/build_artplex_logo.py`. Sources: `docs/brand/reference/artplex-logo-v2-concept-sheet-source.png` and `artplex-logo-v2-poster-source.jpg`.

## Where the old ArtPlex logo still appears (to swap once final)

- `public/standalone/artplex.html`: hero lockup and family strip.
- `public/standalone/artloop.html` and `ai-operations-intelligence.html`: family strips.
- PR #291: favicons (`artplex-favicon-32.png`, `-180.png`) and the OG card (`og-artplex.jpg`, built from the old poster).
- PR #294: family-bar mini mark.

Swap together with the ArtLoop v2 swap (see `ArtLoopLogo.md`), after #290, #291 and #294 merge.
