# Deployment Ledger

## Current Live Production

- **Domain:** `https://artemis.agoraxai.com`
- **Source branch:** `test/civicbid-signal-forge`
- **Commit:** `b9a7263`
- **Status:** QUARANTINED CURRENT LIVE SOURCE

## Desired Production Source

- **Branch:** `main`
- **Vercel project:** `artemis-omni`

## Deployment Rules

1. Only deploy from `main` to production.
2. Never run `vercel --prod` without explicit written approval.
3. Never promote a preview deployment to production.
4. Document every production deployment in this ledger with commit hash, timestamp, and approver.
