# Governance Backlog

Items that surfaced during sessions but are not blocking milestones.

## From PR #74 (2026-10-01, route alignment)
- **BidRoom canonical URL.** `/products/bidroom/contractor` and
  `/labs/bidroom-exemplary-contractor` render the same component.
  `/products` is now noindex, `/labs` is indexable. Decide which URL owns
  the content, then set a canonical link.
- **src/app is live code, not dead.** `app/labs/bidroom-atlasiq/page.tsx`
  imports `src/app/labs/bidroom-atlasiq/BidRoomAtlasIQ`. `/products/bidroom/atlasiq`
  and `/products/bidroom/evidence-engine` also render that page. ADR-010's
  archive disposition requires moving the component first, not deleting it.
- **Clear great_order blocker on prime-industrial-erp.** ADR-009 says the
  relationship is documented. The registry still lists the blocker.
- **HANDOVER sync covering PRs #70–#74.** Not yet written.

## From PR #72 (2026-10-01, ADR batch)
- ADR-008 bucket name: `client_or_owner_related` (PR #67) vs
  `client_or_partner_work` (ADR-008). Pick one, update the other.

## From M3 (2026-10-01, continued)
- Supabase free-tier email rate limit blocks rapid testing. Resolution: custom
  SMTP via Resend (free tier, 3,000 emails/month). Configured in Supabase
  Authentication → Emails → SMTP Settings.
- /login shows both error and success messages simultaneously. Split into
  mutually exclusive states.

## M3 deferred item (2026-10-01)
- Magic-link email delivery not yet verified end-to-end. Auth code is merged,
  deployed, and smoke-tested (redirect from /control to /login works). The
  remaining gap is Supabase auth email delivery, likely one of:
    * <owner-email> not yet a User in Supabase (shouldCreateUser: false)
    * Resend onboarding@resend.dev only delivers to the Resend signup email
    * Resend API key missing Sending access permission
- Debug steps documented in Supabase → Authentication → Logs and Resend → Emails.
- TRIGGER to fix: first time the owner or a teammate needs to open /control or
  /system-map. Fix time estimate: ~10 minutes.
- Until then: /control and /system-map are effectively private (redirect to
  /login, and no one can complete sign-in). Fail-closed by design.
