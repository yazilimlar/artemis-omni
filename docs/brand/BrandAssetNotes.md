# Artemis — Brand Asset Notes (Intake v1)

> **Internal working document.** Analysis of the AI-generated reference assets stored in
> `/public/brand/reference/`. These are **moodboard / reference** material, **not** final
> production brand standards. Nothing here changes the public site, which continues to
> lead with **5D Construction Intelligence** (see `docs/BrandSystem.md`,
> `docs/BrandArchitecture.md`).

## 1. Purpose

Capture the usable signal from a batch of AI-generated Artemis visuals — color direction,
motifs, and cinematic tone — while explicitly separating what is **approved direction**
from what is **risky, off-strategy, or inaccurate**. This lets future design/media work
move fast without accidentally adopting AI artifacts (gibberish labels, off-brand acronyms,
nudity, inconsistent hex) as if they were standards.

## 2. Asset inventory

Raw files in `/public/brand/reference/`:

| Reference file | Source (Desktop) | Depicts |
| --- | --- | --- |
| `artemis-logo-commercial-standard.png` | `Artemis Logo Commercial Standard.png` | "Brand & System Blueprint v1.0" sheet: logo specs, `AR+EMIS` wordmark, monochrome/reversed variants, a system-architecture diagram, and an executive dashboard mockup |
| `artemis-blue-white-hero-reference.png` | `Artemis - 3d - Gemini - Blue White copy.png` | Blue wireframe Artemis-archer figure in a Greek-pediment + meander + constellation frame ("ARTEMIS / INTELLIGENT SYSTEMS") |
| `artemis-linkedin-cover-reference.png` | `Artemis Linked in cover page.png` | Wide cover composition: wireframe vs. gold/platinum archer, mechanical compound bow, office backdrop |
| `artemis-gold-platinum-reference.jpg` | `Artemis - Gold and Platinum.jpg` | Gold + platinum archer relief, two "phases" (conceptual / autonomous). **File is TIFF data with a `.jpg` extension.** |
| `artemis-min-logo-reference.png` | `Artemis - 3d - min - logo.png` | Single bronze wireframe archer ("A.R.T.E.M.I.S. — Phase I: Conceptual Architecture") |

> Filename note: the originals on disk did **not** carry the `(1)/(2)/(5)` suffixes from
> the request list; they were matched by content and renamed to the kebab-case targets
> above. Checksums of copies match the Desktop originals.

## 3. Visual strengths

- **Cohesive palette instinct:** deep navy + gold + platinum/silver + a bright blue/cyan
  reads premium and "executive engineering." It rhymes with the current gold-on-navy site.
- **Strong motifs:** Greek **meander borders**, pediment framing, constellation/blueprint
  grids, and the **Artemis archer** give a distinctive, ownable cinematic language.
- **Engineering/autonomy cue:** the **mechanical compound bow** (gears, cams, cabling) is a
  tasteful way to signal precision/automation without generic "AI robot" clichés.
- **Delta-A mark:** the upward "Δ/A" peak inside a crescent is a clean, scalable logo idea.
- **Dashboard tone:** the executive-dashboard mockup's layout instinct (KPI row, cost
  curve, data streams) matches the product story (cashflow, schedule, project controls).

## 4. Risks and cautions

- **Off-strategy acronym.** `A.R.T.E.M.I.S. = "Autonomous Robotics Technology, Engineering,
  Mechanics & Intelligent Systems"` reframes the company as **robotics**. That contradicts
  the approved positioning (5D Construction Intelligence / project controls). **Do not** put
  this acronym or "robotics" framing into product copy.
- **Figure nudity / tone.** The archer figures are largely nude classical statues. Striking
  as art, but **not appropriate as-is** for a B2B heavy-civil/infrastructure audience or
  social profiles. Any production use needs draped/abstracted or tightly cropped treatments.
- **`AR+EMIS` wordmark legibility.** Replacing the "T" with a golden "+" makes the wordmark
  read ambiguously as "AR + EMIS" / "ARPLUSEMIS." Clever, but a **readability and
  trademark/search risk.** Keep as experimental only.
- **Inconsistent / typo'd specs.** The blueprint sheet contains conflicting and misspelled
  values: emblem blue given as both `#00BFFF` and `#0078D4`; "Crescent (**Blux**…)",
  "Delta-A (Gold)"; gibberish dashboard nav ("Deespuam", "Recoticions", "Galseents",
  "Fkstiss", "Cuastica"). These are **AI artifacts — never copy into production docs.**
- **Blue-forward vs. current palette.** The references push a brighter **Signal Blue**
  identity; the live site is restrained **gold-on-navy**. Adopting blue as primary would be
  a **rebrand decision**, not a tweak. Treat blue as a secondary/accent direction until
  explicitly approved.
- **Format/weight.** Files are large (≈0.5–7.7 MB) and one is mislabeled TIFF-as-JPG. Not
  web-ready; must be optimized before any production use.

## 5. Approved palette direction

Directional only — these are **proposed tokens**, not yet wired into `app/globals.css`
(the live site keeps its current gold-on-navy tokens). Hex values are approximate targets
drawn from the references + existing brand tokens, to be finalized in a future color pass.

| Token | Direction | Approx hex (provisional) |
| --- | --- | --- |
| **Artemis Navy** | Core brand navy (panels, primary surfaces) | `#13203B` |
| **Deep Space Navy** | Deepest background / reversed-logo field | `#0A1326` |
| **Signal Blue** | Bright accent / interactive (secondary unless rebrand approved) | `#0078D4` |
| **Crescent Blue** | Cyan emblem highlight / data accent | `#00BFFF` |
| **Blueprint Cyan** | Grid lines, technical annotations | `#3FA9C9` |
| **Delta Gold** | Primary warm accent / the "Δ-A" mark & CTAs | `#DDB04E` |
| **Platinum Silver** | Secondary metal / hairlines, chrome | `#C9D2DE` |
| **Parchment White** | High-contrast headings / light text | `#F0E9DA` |
| **Graphite Black** | Lunar/graphite base, deep contrast | `#0B0E14` |

Notes: "lunar" remains acceptable as a **visual/palette** descriptor only. Keep gold as the
primary accent unless a deliberate blue-forward rebrand is approved.

## 6. Logo and wordmark recommendations

- **Primary public wordmark stays readable as `ARTEMIS` / `Artemis Omni`.** Clean sans, no
  gimmick substitutions in primary use.
- **`AR+EMIS` (golden-plus) treatment = experimental only.** Do not promote to primary
  wordmark without separate approval; if used at all, reserve for stylized/decorative
  contexts where legibility is not critical.
- **`A.R.T.E.M.I.S.` acronym = internal/optional only.** Do not surface publicly, and never
  with the "robotics" expansion (off-strategy).
- **Logo mark:** the **crescent + upward Δ/A peak** is the strongest, most scalable idea —
  develop it as a proper vector mark (the current in-app `ArtemisMark` SVG is a compatible
  placeholder). Ensure it works at favicon scale and in monochrome.
- **Variants needed (production):** full-color, monochrome (solid), reversed (on dark
  navy), and icon-only.

## 7. Website usage recommendations

- **No change to the public homepage in this pass.** The text-and-SVG **5D Construction
  Intelligence** hero stays; references are not wired into any page.
- The **archer motif** may later appear as a **restrained, cinematic accent** (e.g. a
  faint background relief on About or a Labs cover) — **not** dominating every page, and
  not on the homepage hero.
- **Dashboard / cost-curve / schedule / cashflow / project-controls overlays remain the
  central product imagery** — the archer dresses the brand; the artifacts tell the story.
- The **mechanical bow** is acceptable as an occasional engineering/autonomy accent.
- Any reference image used on the site must first be **optimized + cropped + approved**
  (see checklist). Never ship a 7 MB PNG as a hero.

## 8. Social / media usage recommendations

- `artemis-linkedin-cover-reference.png` is a usable **starting point** for a LinkedIn/social
  banner, but: crop/adjust the figure for a professional B2B audience, fix sizing to platform
  specs, and remove AI-gibberish text before publishing.
- Keep social tone consistent with the construction-intelligence message (cashflow,
  forecasting, executive action) — the mythological art is a **hook**, not the substance.
- Maintain a single, legible `ARTEMIS` wordmark across channels.

## 9. What not to use yet

- ❌ The `A.R.T.E.M.I.S.` "Autonomous Robotics…" acronym / robotics framing.
- ❌ `AR+EMIS` as a primary wordmark.
- ❌ Any nude-figure crop in customer-facing or social contexts.
- ❌ Any hex value, label, or nav text copied verbatim from the AI sheets.
- ❌ Reference PNG/JPG/TIFF files as production hero/OG assets (unoptimized).
- ❌ A blue-forward primary palette (pending explicit rebrand approval).

## 10. Production asset checklist

When production design begins (separate, approved task):

- [ ] Vector **SVG wordmark** (`ARTEMIS` / `Artemis Omni`) — primary, legible.
- [ ] Vector **logo mark** (crescent + Δ/A), incl. **favicon / app-icon set**.
- [ ] **Monochrome** and **reversed (on dark navy)** logo variants.
- [ ] **Transparent** PNG/SVG logo mark.
- [ ] Optimized **`.webp`** hero/section imagery (cropped, < ~250 KB each).
- [ ] **Open Graph image** (1200×630) consistent with the construction positioning.
- [ ] **Social banner(s)** at correct platform dimensions.
- [ ] Re-encode `artemis-gold-platinum-reference.jpg` (currently TIFF) to true JPEG/WebP.
- [ ] Finalize palette tokens and reconcile with `app/globals.css`.
- [ ] Optional: brand-system PDF.

## 11. Future work

- Decide the **blue-forward vs. gold-on-navy** question explicitly (rebrand or accent?).
- Commission/optimize the production assets in §10 (no WebGL required).
- Once a real logo mark exists, replace the placeholder `components/layout/ArtemisMark.tsx`.
- Add an approved, optimized OG image to replace `public/og/artemis-default.svg`.
- Cross-link finalized standards back into `docs/BrandSystem.md`.
- Keep this file as the audit trail of what was reference vs. what became standard.
