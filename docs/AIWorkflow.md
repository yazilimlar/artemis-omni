# Artemis Omni — AI Workflow

The operating model for building Artemis with multiple AI tools. **AI tools do not own
or control accounts.** They operate through local code edits, GitHub commits, and
human-approved deployment steps.

## Roles

| Tool | Role |
| --- | --- |
| **ChatGPT / GPT** | Product architecture, prompts, planning, synthesis |
| **Codex CLI** | Local code edits, patches, tests |
| **Claude Code / CLI** | Implementation, UI polish, refactoring |
| **Gemini** | Multimodal critique, Google ecosystem checks, design review |
| **DeepSeek** | Engineering / math / formula review |
| **NotebookLM** | Source-grounded research knowledge base |
| **Grok** | Alternative critique, trend / current-event perspective |

## Loop

1. **Plan** (GPT) → write/refresh a prompt in `prompts/`.
2. **Implement** (Claude Code / Codex) → local edits on a branch.
3. **Review** (Gemini design, DeepSeek engineering) → critique against the brief.
4. **Human approves** → commit to GitHub.
5. **Deploy** (Vercel) → preview first, then production, human-gated.

## Guardrails

- No AI tool holds account credentials, API keys, or DNS access.
- Secrets live only in `.env.local` (local) and Vercel env vars (deployed) — never in
  code, never pasted into chat. See `SecurityRules.md`.
- DNS / Squarespace changes are **owner-performed manually** from written instructions.
- Every change lands via GitHub with human review before deploy.

## Prompt files

See `prompts/`:

- `00-master-site-brief.md` — the canonical brief
- `01-codex-implementation.md` — implementation instructions for Codex
- `02-claude-code-implementation.md` — implementation instructions for Claude Code
- `03-gemini-review.md` — design/multimodal review checklist
- `04-deepseek-engineering-review.md` — engineering/formula review checklist
- `05-content-generation.md` — content package generation prompt
