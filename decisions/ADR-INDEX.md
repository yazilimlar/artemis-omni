# ADR Index

This index is the first stop for AI and human contributors before architecture-relevant
work. Accepted ADRs are binding unless replaced by a later accepted ADR.

## Accepted Decisions

| ADR | Area | Summary |
| --- | --- | --- |
| ADR-001 | Domain and deployment | Artemis is a separate Next.js app deployed to Vercel; DNS is owner-managed. |
| ADR-002 | Cinematic/WebGL layer | **Superseded by ADR-015.** Phase 1 hero uses lightweight HTML/SVG/CSS with a stable lazy boundary for future 3D. |
| ADR-003 | Content system | MDX files plus typed frontmatter power Academy, Labs, and Case Study content. |
| ADR-004 | Security and secrets | No secrets in source or chat; AI tools do not own accounts or credentials. |
| ADR-005 | AI engineering OS | Repository truth, ADRs, feature passports, and validation govern multi-agent work. |
| ADR-006 | Multi-division product architecture | Artemis is an umbrella platform of divisions, products, shared capabilities, and Labs/testbeds; branch and product status are separate. |
| ADR-007 | Sala Rotonda | Accepted. Sala Rotonda stays a noindex public route until a hosting and content review; the owner then keeps, redirects, or removes it. |
| ADR-008 | Client work | Accepted. Adds the `client_or_partner_work` bucket; client work needs an explicit data boundary and a signed relationship record, and must respect ADR-006 import boundaries. |
| ADR-009 | Great Order | Accepted (operational; legal review deferred). Great Order is an operator organization, not a division; Prime Industrial ERP records `operator: great_order`. |
| ADR-010 | BidRoom registry | Accepted. BidRoom is one product family (`bidroom`) under infrastructure-construction, distinct from civicbid; lifecycle `rescue` until a deployed-route review. |
| ADR-011 | Internal route auth | Accepted. `/control` and `/system-map` become internal_operations behind Supabase Auth magic link and a server-side email allowlist; fail closed; no service-role key; amends ADR-004 for these routes only. |
| ADR-012 | User profiles and roles | Accepted. Adds `public.user_profiles` (owner/admin/client/viewer, default viewer) with RLS; users read their own row and may edit only `display_name`; roles are owner-assigned; roles are additive to the ADR-011 allowlist; amends ADR-011's no-tables non-goal. |
| ADR-013 | Registry proposals | Accepted. Owner-role users propose one-field registry changes from /control/propose; the app opens a GitHub PR via a server-only fine-grained token and never writes main; token identity must not bypass main protection; PR audit cites user id, not email. |
| ADR-014 | Sandboxed artifact execution | Accepted. Registered HTML/JS artifacts run in an opaque-origin sandbox (iframe `allow-scripts` without same-origin, plus CSP `sandbox` on the served response); sources live outside `public/`; no network by default; no bridge in v1; executions audited in `execution_logs` without the service-role key. |
| ADR-015 | Immersive 3D layer | Accepted; supersedes ADR-002. 3D is a progressive enhancement in registered scenes only (`data/scene-registry.json`, `/labs/scenes/[id]`): R3F + drei locked for v1, lazy client island, mandatory 2D fallback, code-enforced budgets, no third-party runtime fetches, no 3D on the homepage in v1. |
| ADR-016 | Homepage 3D hero | Accepted; amends ADR-015. One registered hero scene (`route: "/"`) may render below the homepage fold, loaded after idle, under 5,000 vertices and 100 KB gz incremental (validator-enforced); native Canvas 2D allowed for the hero only (R3F costs 240 KB gz); 2D fallback on reduced motion, slow network, low device. |
| ADR-017 | Contextual design language | Accepted; extends ADR-006 and ADR-015. Every page presents its subject in a visual grammar native to that subject; products and divisions declare an optional `native_visuals` field (proposed here, applied in a follow-up registry PR); 3D scenes must map to a native visual type; the site shell stays brand-consistent. |
| ADR-018 | Evolution Archive | Accepted; extends ADR-006, ADR-014, ADR-015, ADR-017. `/evolution` becomes a generated, inspectable record of project evolution (`data/evolution.json`, produced by `scripts/extract-evolution.mjs` after merges to main via an automated PR, never hand-edited); internal_operations and noindex; v1 visuals locked to GSAP, D3, Observable Plot, HTML tables and a MathBox scene; dependencies approved but not installed. |
| ADR-019 | DayOS compositional architecture | Accepted; extends ADR-006, ADR-011, ADR-017. DayOS owns the Daily Ledger, correlation, evidence graph and My Day UI; Dawarich (location) and Immich (media) run unmodified as separate AGPL services behind TypeScript interfaces in `lib/dayos/interfaces/` with adapters as the only integration code; read-only in v1, self-hosted, local-only, no real personal data in the repo; any modification of AGPL code needs a new ADR and legal review. |
| ADR-020 | Algorithm visualizations | Accepted; amends ADR-015, extends ADR-016/017/018. Three tiers: (1) 3D math surfaces with R3F + MathBox in the existing island; (2) 2D step-by-step algorithms with Manim-Web in a separate budgeted island; (3) pre-rendered ManimCE explainer videos (under 30 MB, lazy, visitor-started, rendered offline, never in CI). Libraries are chosen per tier but adopted only after license, size, compatibility, accessibility and fallback gates in the implementing PR; scene registry gains optional `type: "3d" | "manim"`. **Amended 2026-10-04:** MathBox failed Gate 3 (removed three symbols, unmaintained since 2023), so Tier 1 uses plain React Three Fiber with no new dependency. |

## Touchpoint Guide

- Domains, Vercel, DNS: read ADR-001 and ADR-004.
- WebGL, 3D, maps, standalone visual engines: read ADR-002 and ADR-005.
- Content, Labs notes, articles, program pages: read ADR-003.
- Secrets, tokens, auth, database, email, payments: read ADR-004.
- AI workflow, handoffs, governance, architecture drift: read ADR-005.
- Divisions, product ownership, product maturity, Labs/testbeds, ArtemisIX19 migration,
  branch-vs-product status, visibility, and data modes: read ADR-006.

## AI Rule

If a requested change touches an area above, cite the relevant ADR in the session
summary. If the change contradicts an accepted ADR, propose a new ADR before changing
implementation.
