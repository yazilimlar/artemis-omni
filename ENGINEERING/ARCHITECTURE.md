# Artemis Architecture Authority

Artemis is a Next.js, TypeScript, Vercel-deployed product system built with an
AI-native engineering process. The codebase must remain coherent across multiple AI
agents, standalone prototypes, and future product domains.

## Canonical Knowledge Pyramid

When sources disagree, resolve conflicts in this order:

1. Running source code, tests, and verified build output
2. Accepted ADRs in `decisions/`
3. This architecture file
4. Engineering standards, security rules, and deployment rules
5. Feature passports and component specifications
6. Prompt templates and handover files
7. AI session logs and conversation notes

## Current System Shape

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS plus isolated standalone HTML labs where approved
- Deployment: Vercel
- Domain strategy: accepted in ADR-001
- Content model: MDX and typed content registry, accepted in ADR-003
- Secrets model: no secrets in source; accepted in ADR-004
- Standalone labs: isolated iframe wrappers when conversion risk is higher than value

## Protected Areas

Changes to these areas require extra care and usually an ADR:

- `decisions/`
- `ENGINEERING/`
- `docs/SecurityRules.md`
- `docs/DeploymentPlan.md`
- routing under `app/`
- shared UI primitives under `components/ui/`
- map/rendering engine strategy
- environment variables, auth, data storage, and deployment configuration

## Product Domains

Current or emerging Artemis domains:

- Artemis Labs
- Artemis Atlas
- Artemis Tax / Finance Architecture
- Construction Intelligence
- Utility Intelligence
- Brand and visual system
- Future Knowledge OS, GIS, CAD/BIM, ERP, analytics, and automation domains

Each domain should eventually have a feature passport that names purpose, owner,
dependencies, ADRs, risks, tests, and roadmap.

## AI Operating Principle

Treat every AI as a capable junior engineer with amnesia. The repository must carry
enough indexed, versioned knowledge that a new AI session can become useful without
guessing prior decisions.
