# AI Capability Registry

Part of the Artemis AI Engineering Operating System (see `AI_AGENT_RULES.md`).
Defines complementary roles so multiple AI agents contribute without overlap or
architectural drift. This is guidance, not a hard gate — but PRs should stay inside the
role that owns the touched area.

## Model roles

| Model | Best use | Avoid |
|---|---|---|
| **ChatGPT** | Architecture, governance, planning, comparative analysis | Large mechanical refactors without verification |
| **Claude Code** | Large-scale implementation, repo navigation, multi-file features, verification | Being treated as the final architectural authority — defer to ADRs |
| **Codex** | Focused coding, debugging, implementation, deployment plumbing | Repo-wide redesigns without an ADR |
| **Gemini** | UX review, visual critique, comparative/second-opinion analysis | Sole source for implementation decisions |

## Ownership convention

Assign directory ownership declaratively so agents know their lane:

- Drop a `.ai-owner` file at the root of a major feature directory with a single line
  naming the responsible agent (e.g. `Claude Code`, `Codex`, or `Any (sandboxed)`).
- `experiments/*` is always `Any (sandboxed)` and ephemeral.
- A PR that changes a directory it does not own should say so and name the reason.

## Confidence signaling (mirrors AI_AGENT_RULES)

Every recommendation carries a confidence grade:

- **A** — verified by repository (read the file/test/build output)
- **B** — consistent with repository conventions
- **C** — inference from available context
- **D** — speculation

Grade A/B changes are safe to implement. Grade C/D should be proposed, not merged,
until verified.

## Handoffs between agents

When one agent picks up another's work, it reads `docs/HANDOVER.md` first, then the
feature passport for the touched domain, then the relevant ADRs. It does not infer the
prior agent's intent from chat — it derives it from the durable record.
