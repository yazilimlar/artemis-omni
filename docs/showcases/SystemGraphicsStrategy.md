# System Graphics Strategy

> **Internal strategy document.** Defines a repeatable Artemis visual language for system,
> implementation, and decision graphics. This governs how diagrams are made; it does not add
> any to public pages in this pass. Brand/visual constraints live in `docs/BrandSystem.md`.

## Purpose

Artemis graphics are not decoration — they are **arguments**. Every diagram should make a
case an executive can trust: which decision improves, what connects, what logic applies,
where a human checks it, what is trusted, and what remains uncertain.

## The six-question rule (mandatory)

**Every Artemis system graphic must explain:**

1. **What decision is improved** — the executive question it answers.
2. **What data is connected** — the sources/systems of record involved.
3. **What logic is applied** — the formula/method/transformation.
4. **What human review exists** — the review/approval/exception point.
5. **What output is trusted** — the result and its confidence level.
6. **What assumption or limitation remains** — what it is *not*.

A graphic that cannot answer all six is a moodboard, not a system graphic.

## Graphic types (the repeatable set)

| Type | Answers primarily | Typical use |
| --- | --- | --- |
| **Solution architecture** | what connects, what logic | Solutions, Academy |
| **Implementation roadmap** | what decision, what review | Sales, About, Academy |
| **Project-controls diagram** | what data, what logic, what trusted | Solutions, Labs |
| **2D → 3D → 4D → 5D logic** | what logic, what output | Academy (anchor) |
| **Field-to-finance value chain** | what data, what decision | Home (existing), Solutions |
| **Model-to-money diagram** | what logic, what trusted | Labs, Case Studies |
| **AI implementation diagram** | what review, what limitation | Doctrine, Academy |
| **Staff training diagram** | what review, what decision | Transition Method |
| **System-of-record diagram** | what data, what trusted | Solutions, Implementation |
| **Risk / opportunity map** | what decision, what limitation | Executive reporting |
| **Executive decision loop** | what decision, what review | About, Solutions |
| **Market comparison matrix** | what decision, what limitation | Strategy, sales |

## Visual conventions

- **Palette:** use the approved tokens (Artemis Navy, Deep Space Navy, Signal Blue,
  Crescent Blue, Blueprint Cyan, Delta Gold, Platinum Silver, Parchment White, Graphite
  Black — see `docs/brand/BrandAssetNotes.md` §5). Gold = the trusted/primary path; cyan =
  data/technical; silver = structure; navy/graphite = ground.
- **Motifs:** subtle meander/blueprint framing is allowed; never let it crowd the argument.
- **Source labels:** every data node shows its system of record.
- **Confidence cues:** trusted outputs are visually distinct from assumptions/projections
  (e.g. solid vs dashed, full vs muted).
- **Human-review marks:** a consistent glyph marks every human review/approval point.
- **Legends:** every graphic carries a short legend covering actual / forecast / assumption
  / projection and confidence.

## Authoring rules

- Prefer **SVG/CSS** (lightweight, accessible, on-brand) over heavy raster or WebGL.
- Keep text **SEO/a11y accessible** when a graphic appears on a page (real DOM or alt text).
- No mythology/robotics framing; no "atelier"/"AI Decision Mesh"/"ancient intelligence"
  language in labels (see `docs/BrandSystem.md`).
- Reuse the same iconography across graphics so the language compounds.

## Cross-references

- `docs/showcases/ExecutiveDemoLibrary.md` — assets these graphics can illustrate.
- `docs/ArtemisImplementationDoctrine.md` — the argument the graphics must carry.
- `docs/ArtemisTransitionMethod.md` — the phases many roadmaps will depict.
