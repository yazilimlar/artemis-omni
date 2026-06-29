# Artemis — Brand Asset Notes (Intake v1)

> **Internal working document.** Analysis of the AI-generated reference assets stored in
> `/docs/brand/reference/` (kept **out** of `/public` so they are never web-served). These
> are **moodboard / reference** material, **not** final production brand standards. Nothing
> here changes the public site, which continues to lead with **5D Construction
> Intelligence** (see `docs/BrandSystem.md`, `docs/BrandArchitecture.md`).

## 1. Purpose

Capture the usable signal from a batch of AI-generated Artemis visuals — color direction,
motifs, and cinematic tone — while explicitly separating what is **approved direction**
from what is **risky, off-strategy, or inaccurate**. This lets future design/media work
move fast without accidentally adopting AI artifacts (gibberish labels, off-brand acronyms,
nudity, inconsistent hex) as if they were standards.

## 2. Asset inventory

Raw files in `/docs/brand/reference/` (private to the repo, **not** under `/public`):

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

- **Acronym must stay an origin, not a category (reconciled policy).** The approved formal
  expansion is **ARTEMIS = "Autonomous Robotics Technology for Engineering, Modeling &
  Intelligent Systems"** (note: *Modeling*, not the image's "Mechanics"). It is retained in
  the data model and may appear publicly as the **formal brand expansion / long-term
  ambition** — but public copy must **never imply Artemis is primarily a robotics company**
  unless/until robotics products exist. Lead with AI implementation + the Construction
  Intelligence beachhead; frame the acronym with care (e.g. "the formal ARTEMIS expansion
  is…", "the name reflects the long-term ambition…").
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
- **`ARTEMIS` acronym = formal expansion only (may appear publicly, carefully framed).**
  Use it as brand origin / long-term ambition, not as the current product category. Never
  let "robotics" read as what Artemis sells today. (Stylized dotted `A.R.T.E.M.I.S.` and the
  image's "Mechanics" wording remain off; the approved expansion uses "Modeling".)
- **Logo mark:** the **crescent + upward Δ/A peak** is the strongest, most scalable idea —
  develop it as a proper vector mark (the current in-app `ArtemisMark` SVG is a compatible
  placeholder). Ensure it works at favicon scale and in monochrome.
- **Variants needed (production):** full-color, monochrome (solid), reversed (on dark
  navy), and icon-only.

## 7. Website usage recommendations

- **Public Labs usage is now approved for optimized concept derivatives.** The text-and-SVG
  implementation homepage stays focused on Artemis as an execution bridge; the heavier
  Diana/archer material belongs in Labs brand-experience contexts.
- The **archer motif** may later appear as a **restrained, cinematic accent** (e.g. a
  faint background relief on About or a Labs cover) — **not** dominating every page, and
  not on the homepage hero.
- **Dashboard / cost-curve / schedule / cashflow / project-controls overlays remain the
  central product imagery** — the archer dresses the brand; the artifacts tell the story.
- The **mechanical bow** is acceptable as an occasional engineering/autonomy accent.
- Any reference image used on the site must first be **optimized + cropped + approved**
  (see checklist). Never ship a 7 MB PNG as a hero.

### 7.1 Public optimized derivatives

The following optimized concept derivatives are approved for the public Labs brand library
and live under `/public/brand/`:

| Public asset | Source reference | Public use |
| --- | --- | --- |
| `artemis-diana-blue-white-poster.jpg` | Blue/white Diana systems poster | Labs brand-experience feature visual |
| `artemis-diana-blue-white-logo-study.jpg` | 2026-06-07 logo/poster study | Logo-library reference |
| `artemis-conceptual-architecture-plaque.jpg` | Minimal graphite plaque | Secondary industrial brand reference |
| `artemis-gold-platinum-brand-wall.jpg` | Gold/platinum wall concept | Wide material-palette and environment reference |

These files remain **concept assets**, not final logo standards, not homepage hero assets,
and not robotics-product claims.

## 8. Social / media usage recommendations

- `artemis-linkedin-cover-reference.png` is a usable **starting point** for a LinkedIn/social
  banner, but: crop/adjust the figure for a professional B2B audience, fix sizing to platform
  specs, and remove AI-gibberish text before publishing.
- Keep social tone consistent with the construction-intelligence message (cashflow,
  forecasting, executive action) — the mythological art is a **hook**, not the substance.
- Maintain a single, legible `ARTEMIS` wordmark across channels.

## 9. What not to use yet

- ❌ "Robotics" as the *current* primary product category (the acronym is allowed only as
  the formal brand expansion / long-term ambition — see §4).
- ❌ The stylized dotted `A.R.T.E.M.I.S.` treatment and the "Mechanics" wording (use the
  approved "Modeling" expansion).
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

## 12. Repository & maintenance notes

- **Location policy:** raw references live in `/docs/brand/reference/` (private, not
  web-served). `/public/brand/` is reserved for approved, optimized public assets only.
- **Current size:** the raw reference set is ~17 MB total. This is **acceptable for the
  private repo at this stage.**
- **Git LFS:** **do not set up Git LFS yet.** If the brand/media library grows
  significantly, evaluate **Git LFS, Google Drive, Figma, or another dedicated asset
  repository** before adding large media files to Git history.
- **Format flag:** `artemis-gold-platinum-reference.jpg` appears to contain **TIFF data**
  despite the `.jpg` extension — flag for **re-encoding to true JPEG/WebP** during
  production optimization (also listed in §10).
