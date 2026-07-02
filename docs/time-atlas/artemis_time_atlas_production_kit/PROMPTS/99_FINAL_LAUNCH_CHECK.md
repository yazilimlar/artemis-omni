# Prompt 99 — Final Launch Check

Perform final launch readiness review for Artemis Time Atlas V1.

## Must Pass

- `/time-atlas/troy` loads
- mobile layout works at 375x667 and 390x844
- no secrets exposed
- no unrelated routes modified
- no broken build
- POI cards show confidence/evidence/source note
- ghost eras are clearly marked
- 600 BC is the active model
- historical disclaimer visible
- Vercel deployment is ready

## Commands

```bash
npm run lint
npm run build
git status
```

## Output Format

- PASS/FAIL
- critical issues
- non-critical issues
- deployment recommendation
- exact next command
