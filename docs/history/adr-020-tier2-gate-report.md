# ADR-020 Tier 2 Gate Report: Manim-Web

- Date: 2026-10-04 (`main` @ `ebe79fc`)
- Branch: `governance/adr-020-tier2-gate-eval`
- Division: core-platform · Product: site-shell · Lifecycle: governance · Visibility: internal_operations · Data mode: synthetic · Change type: governance
- Scope: evaluation only. Nothing was installed in the repository; all installs were throwaway installs in a scratch directory. No code was written.

## Verdict

**No package passes all seven gates.** Recommendation: use the ADR-020 fallback, a hand-written 2D canvas, for the bubble-sort proof, and install nothing. Details and a conditional path for `manim-web` are in "Recommendation".

| Candidate | G1 License | G2 Size | G3 Compat | G4 Maintenance | G5 No 3rd-party fetch | G6 Accessibility | G7 Fallback | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `manim-web` 0.3.24 | PASS | **FAIL** | **FAIL** (as installed) | PASS (young) | **FAIL** (as published) | PASS via our fallback | PASS | **Fails** |
| `@agarwal29796/manim-js` 0.3.1 | PASS | PASS | PASS | **FAIL** | PASS | PASS via our fallback | PASS | **Fails** |

## Step 1: Which package is the "Manim-Web"?

`npm view` and `npm search manim` on 2026-10-04:

| Package | Version | License | Last publish | Notes |
| --- | --- | --- | --- | --- |
| **`manim-web`** | 0.3.24 | MIT | 2026-07-13 | "Manim-like mathematical animation library for the web", TypeScript, repo `maloyan/manim-js`, 486 stars, 8 contributors. **The package that matches the ADR's intent.** |
| `manim-web-alpha` | 0.3.29 | MIT | 2026-07-07 | A second publisher republishing the same repo; 2 versions. Not considered. |
| `@agarwal29796/manim-js` | 0.3.1 | Apache-2.0 | 2026-09-17 | "Manim-inspired" Canvas2D engine, not a port. Evaluated as the second candidate. |
| `ecmanim` | 0.11.1 | MIT | 2026-07-11 | A JavaScript port aimed at Node (MP4 via ffmpeg) and browser canvas/WebM. Not evaluated further (video-first). |
| `realtime-manim` | 0.6.0 | | 2026-08-12 | Rust/WebGPU runtime. Out of scope. |
| `manim-js`, `@manim/web`, `@manim-web/core` | | | | Do not exist (404). `manimjs` was unpublished 2026-09-24. |
| `manim` (0.0.1, 2022), `manim-ts` (placeholder, "name reserved") | | | | Abandoned or placeholders. |

## Method

For each candidate: registry metadata (`npm view`), GitHub repository metadata (`gh api`), a throwaway `npm install` next to `three@0.186.1` in a scratch directory, a rolldown build (already in the repo's toolchain) with minification, gzip of the output, and text searches of the shipped `dist/` for URLs, `fetch(`, and `prefers-reduced-motion`. No library code was run in a browser (no headless WebGL here), so runtime behavior is not verified.

## Candidate A: `manim-web` 0.3.24

**Gate 1, license: PASS.** MIT (package and LICENSE). Dependencies: `@mathjax/src` Apache-2.0, `katex`, `opentype.js`, `gif.js`, `typia`, `polygon-clipping` MIT, `earcut` ISC. All compatible with site use.

**Gate 2, size: FAIL** against the ADR-020 starting budget of 150 KB gzipped for the Manim island. Minified, gzipped:

| Case | Core | Plus lazy MathJax chunk |
| --- | --- | --- |
| Seven named imports, `three` external (best case, if deduped to the repo's three) | 215 KB | +475 KB (loaded only for LaTeX) |
| Same, as installed (nested `three` 0.184 bundled) | 350 KB | +475 KB |
| Whole package (`import *`), three external / as installed | 350 KB / 530 KB | +475 KB |

Tree-shaking barely helps (the package registers its classes as side effects). Even the best case is 43% over the budget; the installed case is 2.3 times over. Passing would need the owner to amend the budget to roughly 350 KB.

**Gate 3, compatibility: FAIL as installed.**
- `three` is a hard dependency (`^0.184.0`), not a peer. Installing next to the repo's `three@0.186.1` puts a second copy in `node_modules/manim-web/node_modules/three` (`npm ls three` shows both). The page would run two Three.js instances (Three warns about this) and carry both in the bundle.
- A static check of every `three` import in the package against r186 found no removed symbols (the four names that did not match are error-message strings from Three's own internals). So forcing the repo's `three` through an npm `overrides` entry is plausible, but it is **untested at runtime**.
- React 19 and Next 15: `react` and `vue` are optional peers (`>=18`, `>=3`); the package imports cleanly in Node (588 exports), so a server-side import will not crash. Fine.

**Gate 4, maintenance: PASS, with risk.** Repo created 2026-01-29, last push 2026-09-04, 26 releases, 8 contributors, 486 stars, 38 open issues, one npm maintainer. Active, but only eight months old. The repo is ahead of npm: the 2026-09-04 commit "make runtime asset fallbacks configurable (#542)" is not in the latest release (2026-07-13).

**Gate 5, no third-party runtime fetch: FAIL as published.** `manim-web@0.3.24` contains runtime loads from `cdn.jsdelivr.net`: MathJax (`mathjax@3/es5/tex-svg-full.js`, used as a fallback when the npm path fails), KaTeX CSS (`katex@0.16.0/dist/katex.min.css`), and the GIF worker (`gif.js@0.2.0/dist/gif.worker.js`). It also fetches font URLs. These sit on the LaTeX, GIF-export and custom-font paths, so a figure that avoids them (rectangles and canvas text) would not trigger them, but ADR-015's "no third-party runtime fetches" cannot be enforced inside the library until #542 ships. Whether default text rendering is fetch-free was not verified.

**Gate 6, accessibility: PASS through our own fallback.** The library has no `prefers-reduced-motion` handling and no ARIA (zero matches). The ADR-015 island supplies the reduced-motion and error fallbacks (a static step table), so the gate's "or has a fallback path" is met by what Artemis would build, not by the library.

**Gate 7, fallback: PASS.** The ADR-020 fallback (a hand-written 2D canvas) exists and is small for a 20-item bubble sort.

## Candidate B: `@agarwal29796/manim-js` 0.3.1

**Gate 1: PASS.** Apache-2.0.

**Gate 2: PASS.** About 9 KB gzipped for the whole package, 4.8 KB for the Canvas2D renderer plus `Scene`; `sideEffects: false`. `mathjax-full` and `mp4-muxer` are optional peers, not installed or bundled unless used.

**Gate 3: PASS.** No `three` dependency (Canvas2D), so no duplicate. ESM and CJS builds, imports cleanly in Node. Animations are a pure function of time (scrub and seek), which fits pause and step controls.

**Gate 4: FAIL.**
- Created 2026-06-21; 0 stars, one maintainer, four releases.
- The latest npm release (0.3.1, 2026-09-17) **has no matching source in the public repository**: the repo's `package.json` is 0.3.0, the last commit is 2026-07-09 ("Release 0.3.0"), and there is no 0.3.1 tag. The published artifact cannot be reviewed against source, and the package has no npm provenance attestation (signatures only). That is a supply-chain concern on top of the low adoption.

**Gate 5: PASS.** No CDN URLs in the shipped code.

**Gate 6: PASS through our own fallback** (no reduced-motion handling in the library; the pure-function design makes a static step view easy).

**Gate 7: PASS.**

## Recommendation

1. **Use the ADR-020 fallback for the bubble-sort proof:** a hand-written 2D canvas component, no new dependency. For 20 items it is on the order of 100 lines, can honor reduced motion and step controls directly, and has none of the CDN, duplicate-`three` or provenance problems.
2. **If the owner still wants `manim-web`,** the minimum conditions are: (a) wait for a release containing #542 (configurable asset fallbacks) and confirm the CDN paths can be disabled; (b) force one `three` with an `overrides` entry and prove it in a browser; (c) amend the Manim island budget to about 350 KB gzipped; (d) avoid MathTex, GIF export and custom fonts. Then rerun Gates 2, 3 and 5 on the actual release.
3. **Do not adopt `@agarwal29796/manim-js`** unless its maintainer publishes source for the released version (with a tag or provenance) and it gains some independent use. Its size and design are attractive, so it is worth re-checking later.
4. **ADR-020 needs an amendment** (like the Tier 1 one) recording the Tier 2 outcome. That is a separate PR; this one changes only this report.

## Limits of this evaluation

- No browser run: bundle sizes are from a minified rolldown build, not from Next's output; the real island cost should be re-measured if a library is ever adopted.
- Gate 5 was assessed by reading the shipped code for URLs and `fetch` calls, not by observing network traffic.
- GitHub statistics are from 2026-10-04 and change.
