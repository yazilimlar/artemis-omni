# ArtLoop logo — v2 (canonical)

**Owner decision, George, 2026-11-03:** the ArtLoop logo in use until now is retired permanently. Every ArtLoop mark on every surface moves to the v2 logo below. Do not reintroduce the v1 mark, its traced path data, or anything derived from it.

## Canonical files

| File | Use |
| --- | --- |
| `public/brand/artloop/artloop-lockup-full.svg` | Full lockup: mark, ARTEMIS, ArtLoop, "Construction Intelligence Estimation Pipeline". Hero and formal placements. |
| `public/brand/artloop/artloop-lockup.svg` | Compact lockup: mark over "ArtLoop". Family strips, cards, plates. |
| `public/brand/artloop/artloop-mark.svg` | Mark only (A with infinity), square viewBox. Mini marks, favicons, app icons. Flat red, readable down to 32 px. At 16 px the infinity is very small. |

Sources, kept out of `public/` so they are never served: `docs/brand/reference/artloop-logo-v2-lockup-full-source.jpg` and `docs/brand/reference/artloop-logo-v2-lockup-source.jpg` (the owner's attached images, 2026-11-03).

How the SVGs were made: the source images were split by colour (red shapes; dark grey text), upscaled 3×, and traced with potrace (`potracer` 0.0.4). The text is traced outlines, not live type, so no font is needed. Colours: red gradient `#E4232B` → `#C8161D` (flat `#D4191D` on the mark-only file), text `#33363B`.

## v1 mark: where it still appears (to be replaced)

As of `main` @ `6c95776` and the open PRs on 2026-11-03. The v1 path data is identifiable by `translate(435,16)`.

| Surface | Where |
| --- | --- |
| ArtLoop page hero lockup and family strip | `public/standalone/artloop.html` (main: 2 copies) |
| ArtPlex page family strip | `public/standalone/artplex.html` (main: 1) |
| AttemptBook page lockup | `public/standalone/ai-operations-intelligence.html` (main: 1) |
| Animated hero (A resolves, infinity draws) | PR #290 `labs/artloop-tier1`, built on v1 geometry |
| Favicon, 180 px icon, OG card | PR #290: `public/standalone/artloop-favicon.svg`, `artloop-icon-180.png`, `og-artloop.png` |
| Family-bar mini mark (about 10 KB inline, per page) | PR #294 `labs/r2-s1-family-nav`, all three pages |

## Swap plan

1. This PR adds the v2 files and this note only. No page changes, so it does not conflict with the open PRs.
2. After #290, #291 and #294 merge, one follow-up PR replaces every row in the table above with the v2 files. The animated hero is rebuilt on the v2 mark's shapes, and the favicon, icon and OG card are regenerated from `artloop-mark.svg` and the lockups.
3. That PR's check: `git grep 'translate(435,16)'` returns nothing.

**Swap status (2026-11-03): COMPLETED** in the follow-up page-alignment PR — every row above replaced with the v2 files (animated hero rebuilt on the v2 mark's shapes; favicon, 180 px icon and OG card regenerated). Acceptance check: `git grep 'translate(435,16)'` over the shipped pages returns nothing.
