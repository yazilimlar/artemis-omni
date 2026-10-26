# R2 Client Authorization — Implementation and Acceptance

Implemented: server-side ARTEMIS authentication + existing allowlist + profile requirement + tax-specific client membership check. All five workspaces default to denied. Only assigned client cards are rendered.

## Required server-side configuration
Set `ARTEMIS_TAX_CLIENT_MEMBERSHIPS` to a JSON object mapping each canonical client ID to an array of verified Supabase auth user UUID strings. Example **synthetic identifiers only**:

```json
{"personal":["00000000-0000-4000-8000-000000000001"],"great-order":[],"artemis":[],"agoraxai":[],"apolloa":[]}
```

Do not set this variable with email addresses, passwords, taxpayer IDs, or other PII. Keep it server-only, in protected environment configuration. An absent, invalid, or empty membership list denies access.

## Security caveats
- This is an **interim authorization gate**, not an audited multi-tenant data system.
- There are no financial APIs or private client documents yet. Any future API, server action, download or database query MUST independently enforce tenant membership; hiding UI is not sufficient.
- A user with a valid profile is not necessarily entitled to any tax client.
- Client membership changes require secure environment update and redeploy; use a database-backed membership table with RLS in the next phase.
- Public GitHub source and protected client data must remain separate. Do not upload actual financial evidence to git or public assets.
- No Vercel preview or build validation is claimed in this phase.

## Acceptance checks before preview
1. Missing environment variable: no client cards.
2. Malformed JSON: no client cards.
3. Unauthenticated visitor: redirected to login.
4. Authenticated but unprovisioned profile: no client cards.
5. Authenticated, provisioned, unassigned user: no client cards.
6. One assigned client: only that client appears.
7. Access to another client's future API/data: forbidden at server and database layer.
8. Run `npm run typecheck`, `npm test`, and `npm run build` and report results.

## Next phase
R3: Supabase membership schema + RLS policies, audited role assignment, tests, protected preview, no real data until isolation tests pass.
