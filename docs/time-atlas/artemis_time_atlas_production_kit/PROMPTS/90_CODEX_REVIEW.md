# Prompt 90 — Codex: Independent Review and Hardening

You are the independent reviewer for Artemis Time Atlas V1.

Review the branch `feature/time-atlas-troy-v1`.

## Focus Areas

- route isolation
- TypeScript correctness
- lint/build issues
- React Three Fiber anti-patterns
- mobile performance risks
- unnecessary dependencies
- security/secrets
- accessibility
- historical claim labeling
- Vercel deployment risk

## Rules

- Do not rewrite the whole app.
- Make targeted fixes only.
- Do not add Supabase.
- Do not add a full globe.
- Do not add free camera navigation.

## Commands

Run:

```bash
npm run lint
npm run build
```

If available:

```bash
npm run type-check
```

## Deliverables

- concise PR review
- list of files changed
- issues fixed
- issues left for later
- merge readiness recommendation
