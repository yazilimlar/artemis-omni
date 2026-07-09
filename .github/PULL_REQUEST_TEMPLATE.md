<!-- Artemis AI Engineering Operating System — PR template. Governed by ENGINEERING/AI_AGENT_RULES.md -->
<!-- Release status dashboard: /ops/deck -->

## Summary

<!-- What changed and why. One concern per PR (see ENGINEERING/BRANCH_LIFECYCLE.md). -->

## Scope

- Domain / area:
- Branch type: `feature` | `labs` | `docs` | `governance` | `experiment`
- Authoring agent / owner:
- Confidence grade of the change: **A** verified · **B** consistent · **C** inference · **D** speculation

## ADRs

<!-- Architecture-relevant changes MUST cite the ADR(s) they touch, or add a new ADR. -->
- Touches ADR(s):
- New ADR added:  yes / no

## AI Safety Checklist

- [ ] Read `ENGINEERING/AI_AGENT_RULES.md`, `ARCHITECTURE.md`, and relevant ADRs before changing code
- [ ] Change stays inside accepted architecture (or a new/updated ADR is included)
- [ ] One concern only — no unrelated files mixed in
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No secrets, keys, private paths, or private coordinates added (`docs/SecurityRules.md`)
- [ ] Public-safe: no protected source HTML or unverified fabrication values published
- [ ] Preview verified (URL below); production deploy only with explicit human approval
- [ ] `docs/HANDOVER.md` updated if this was a substantial session

## Verification

- Preview URL:
- Manual checks performed:

## Known Issues / Follow-ups
