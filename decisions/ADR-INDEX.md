# ADR Index

This index is the first stop for AI and human contributors before architecture-relevant
work. Accepted ADRs are binding unless replaced by a later accepted ADR.

## Accepted Decisions

| ADR | Area | Summary |
| --- | --- | --- |
| ADR-001 | Domain and deployment | Artemis is a separate Next.js app deployed to Vercel; DNS is owner-managed. |
| ADR-002 | Cinematic/WebGL layer | Phase 1 hero uses lightweight HTML/SVG/CSS with a stable lazy boundary for future 3D. |
| ADR-003 | Content system | MDX files plus typed frontmatter power Academy, Labs, and Case Study content. |
| ADR-004 | Security and secrets | No secrets in source or chat; AI tools do not own accounts or credentials. |
| ADR-005 | AI engineering OS | Repository truth, ADRs, feature passports, and validation govern multi-agent work. |
| ADR-006 | Multi-division product architecture | Artemis is an umbrella platform of divisions, products, shared capabilities, and Labs/testbeds; branch and product status are separate. |

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
