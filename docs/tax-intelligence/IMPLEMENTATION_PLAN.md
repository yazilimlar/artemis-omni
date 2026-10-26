# Claude implementation plan

## P0 repository audit
- Identify app router root, shared middleware, auth, database and Vercel deployment topology.
- Check whether any route or preview can bypass authorization.
- Assess data isolation implications of public monorepo and public deployments.

## P1 MVP (synthetic only)
- Client switcher, five workspace profiles, ownership relationships, formation task register.
- Evidence manifest with source IDs, classification state, document hashes (no raw sensitive documents).
- Scenario input and outputs clearly labeled non-filing estimates.
- Unit tests for client isolation and ownership graph.

## P2 hardened backend
- Tenant identity + RBAC, MFA, Postgres RLS, private encrypted document storage, append-only audit trail.
- Idempotent imports from Prime Industrial ERP, duplicate detection, reconciliation.
- Separate taxpayer / client / entity / return identifiers.

## P3 tax and workflow
- Federal and NY rule packs versioned by year; deterministic calculator; reviewed test vectors.
- Startup cost and Section 174A classification with evidence requirements.
- Draft correspondence and filings with owner review and approval gates.

## Required PR acceptance
- Typecheck, build, tests; zero real PII in repository or preview.
- Demonstrate unauthenticated and cross-client access denial.
- No automatic main merge, no production deploy, no external filing.
