# Artemis AI Engineering Operating System

This document turns the attached governance guidance into a durable Artemis operating
model. The goal is not only to prevent mistakes. The goal is to make architectural
consistency the default outcome across human, Codex, Claude Code, GPT, Gemini, and other
AI-assisted sessions.

## Phase Model

1. **AI-Assisted Development**
   Git, GitHub, Vercel previews, branches, commits, and ADRs prevent obvious breakage.

2. **AI Engineering Operating System**
   Engineering standards, AI agent rules, ADRs, prompt libraries, handovers, session
   logs, and repository indexes make every AI session start from the same truth.

3. **Autonomous Engineering**
   Specialized agents improve Atlas, Tax, documentation, tests, security, performance,
   and UX while staying synchronized through repository authority.

4. **Artemis Knowledge Operating System**
   Software, documentation, specs, CAD, GIS, shop drawings, RFIs, submittals, cost data,
   schedules, parametric models, prompts, workflows, research, and calculations become
   linked, versioned, searchable engineering assets.

## Operating Layers

### Layer 0 - Canonical Knowledge Pyramid

Every contributor resolves conflicts using the highest available authority:

1. Source code and tests
2. Accepted ADRs
3. Engineering architecture
4. Standards and security rules
5. Feature passports and component specifications
6. Prompt templates and handovers
7. AI session logs
8. Conversations

### Layer 1 - Immutable Core

The following areas define the system and should not be changed casually:

- `ENGINEERING/`
- `decisions/`
- `docs/SecurityRules.md`
- `docs/DeploymentPlan.md`
- shared UI, routing, deployment, security, and map-engine boundaries

### Layer 2 - Living Knowledge Graph

Major features should connect:

`ADR -> feature passport -> implementation -> tests -> release/milestone notes`

### Layer 3 - Repository Digital Twin

Future generated indexes should include:

- `SYSTEM_INDEX.md`
- `COMPONENT_INDEX.md`
- `API_INDEX.md`
- `DEPENDENCY_GRAPH.md`
- `AI_AGENT_INDEX.md`
- `PROMPT_INDEX.md`
- `TEST_INDEX.md`

### Layer 4 - AI Memory Layers

Permanent:

- architecture
- standards
- ADRs
- specifications

Medium-lived:

- roadmaps
- feature plans
- TODOs
- sprint notes

Temporary:

- handovers
- scratch notes
- experiment results

Temporary knowledge should expire or be promoted intentionally.

### Layer 5 - Health Dashboard

Future repository health metrics:

- ADR coverage
- component documentation coverage
- TypeScript coverage
- test coverage
- dead code
- duplicate components
- dependency age
- prompt freshness
- architecture violations
- technical debt score

### Layer 6 - AI Confidence Levels

Recommendations should be labeled:

- A: verified by repository
- B: consistent with repository
- C: inference
- D: speculation

### Layer 7 - Drift Detection

Future checks should inspect:

- folder conventions
- component boundaries
- dependency direction
- naming conventions
- design token usage
- duplicate utilities
- circular imports

### Layer 8 - Design System As Code

UI should increasingly derive from tokens:

- color
- typography
- spacing
- motion
- component variants

### Layer 9 - AI Capability Registry

Use AI tools in complementary roles:

| Tool | Best use | Avoid |
| --- | --- | --- |
| GPT / ChatGPT | architecture, governance, planning, synthesis | final unverified repo claims |
| Codex | coding, debugging, verification, local implementation | repo-wide redesign without ADR guidance |
| Claude Code | broad implementation, refactors, UI polish | sole architectural authority |
| Gemini | visual critique and multimodal review | final implementation decisions |

### Layer 10 - Autonomous Validation Pipeline

Future quality gates:

`implementation -> static analysis -> unit tests -> architecture validation -> security validation -> performance validation -> accessibility validation -> documentation validation -> preview deploy -> human approval -> production`

### Layer 11 - Project Genome

Machine-readable context lives in `ENGINEERING/PROJECT_GENOME.yaml`.

### Layer 12 - Engineering Time Machine

Every major milestone should preserve:

- repository snapshot or commit
- architecture snapshot
- dependency graph
- prompt versions
- AI session logs
- screenshots
- preview/deployment URL
- release notes
- ADR index

## Next Implementation Steps

- Add feature passports for Artemis Atlas, Finance Architecture, and ArtemisIX19.
- Add PR template with ADR citation and AI safety checklist.
- Add session log format in `docs/evolution/`.
- Add generated repository indexes after the next stable release.
