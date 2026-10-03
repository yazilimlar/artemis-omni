# Verification Record

Consolidated acceptance record for Artemis. It states what has been verified, by whom,
when, and with what evidence, and separates that from work that has shipped but is not
yet fully verified.

- Owning division: core-platform · Product: site-shell
- Visibility: internal_operations · Data mode: mixed_explicit · Change type: governance
- Related: `docs/HANDOVER.md` (session history), `decisions/ADR-INDEX.md` (decisions)

## Verified — owner-tested end-to-end

"Verified by" is `owner` when the owner exercised the capability in a real browser, and
`repo` when the evidence is merged code on `main`.

| Capability | Verified by | Date | Evidence |
| --- | --- | --- | --- |
| Magic-link auth (Supabase + Resend) | owner | 2026-10-02 | Signed in as gokmen1313@gmail.com; PR #97 opened from /control/propose |
| Proposal workflow (/control/propose -> GitHub PR) | owner | 2026-10-02 | PR #97 with single-line diff |
| Dashboard (/dashboard, role=owner) | owner | 2026-10-02 | 20 products rendered |
| Scenes /labs/scenes/hello-orb, /spatial-proof-surface, /botanical-garden | owner | 2026-10-02 | Render with 3D or fallback |
| Homepage video section | owner | 2026-10-02 | Plays muted, loops |
| /integrate pilot form | owner | 2026-10-02 | Renders, submits |
| Registry sync (PR #69), governance ADRs #72, #75, #79, #81, #84, #85 | repo | 2026-10-02 | Merged on main |
| Site audit + Batch 1 + Batch 2 + Batch 5 security | repo | 2026-10-01/02 | Merged on main |

## Partial — code shipped, verification incomplete

- Sandbox end-to-end with a real registered artifact (route tested, no live artifact yet)
- Standalone lab sandboxing (Chrome-verified; real-device QA pending on Vercel preview)
- CI env vars (build fails in CI without them; PR to fix pending)

## Known open items

- LCP on homepage measured 2.7s vs ADR-016 target 2.5s
- /login error and success messages render together
- /api/pilot-requests saves only name+email; workflow and role dropped
- Coordinate in git history (GitHub purge request pending)
- ADR-008 bucket naming: client_or_owner_related vs client_or_partner_work
- Standalone lab Three.js CDN pins (some labs still use CDN; SRI added where possible)
- Real-browser QA for scenes on Vercel preview

## How to update this file

Add a row when a capability is owner-verified. Update status when partial becomes
verified or a known item is closed. Never remove history.

Last full verification: 2026-10-02
