# ARTEMIS Tax Intelligence — Client Applications MVP

Status: isolated development proposal. Not production-ready. No real taxpayer data in repository.

## Client workspaces
- Personal taxpayer: Gokmen Oktem
- Great Order LLC: existing business, proposed 10% AGOraXai interest
- ARTEMIS: proposed independent entity, 100% personally owned, 40% AGOraXai interest
- AGOraXai: proposed 50% personal / 40% ARTEMIS / 10% Great Order interests
- Apolloa: proposed 50% personal / 50% Anastasia interests

Ownership is user-provided and unverified; no legal formation or tax classification is implied.

## Security gate before release
1. Server-enforced authentication, MFA, session management, authorization on every read/write.
2. Tenant-scoped database queries and row-level security with automated cross-tenant denial tests.
3. Encrypted document storage, private buckets, signed short-lived download links, audit events.
4. No personal financial data, tax documents, credentials, or secrets in public git, fixtures, client bundles, build logs or previews.
5. Protect preview and production access; Vercel project-wide password protection currently disabled at inspection.
6. No tax filing or correspondence dispatch without explicit approval.

## Architecture
Next.js 15 App Router in existing artemis-omni. Suggested route: /apps/tax-intelligence. Separate server-side client registry, ownership graph, evidence vault, expense classification, audit log, formation tasks, scenario engine, filing review. Use synthetic sample data only until security gates pass. Tax calculations require deterministic, year-versioned rules and test vectors.

## Claude handoff
Inspect repository routes, auth and existing client apps read-only. Implement in this feature branch; avoid modifying shared middleware and production settings without explicit review. Create a pull request, verify build/typecheck/tests, provide protected preview URL and security checklist. Do not merge/deploy to production without owner approval.
