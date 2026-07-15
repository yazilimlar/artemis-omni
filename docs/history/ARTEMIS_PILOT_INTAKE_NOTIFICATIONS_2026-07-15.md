# Artemis Pilot Intake Notifications — 2026-07-15

## Ownership and scope

- Branch: `feature/pilot-intake-notifications`
- Base: `main` at `890e40f`
- Division: Artemis Core Platform
- Product family: shared public website capability
- Route: `/api/pilot-requests`
- Lifecycle: active public pilot intake
- Visibility: public form with server-only processing
- Data mode: private approved user-submitted data
- Change class: shared capability
- Governing decisions: ADR-001 and ADR-004

## What changed

- Preserved the existing Squarespace Contacts synchronization for submitter name and email.
- Added a complete email notification through Resend, including every intake field, a reply-to
  address, an opaque request ID, HTML escaping, and a 24-hour provider idempotency key.
- Added independent Twilio delivery paths for SMS, WhatsApp, and opt-in voice calls.
- Required successful email delivery and at least one successful phone channel before returning
  a public success response.
- Kept recipient addresses, phone numbers, provider credentials, and sender identities out of
  source control and documented all required server-only environment variables.
- Added unit coverage for parsing, honeypot handling, deterministic IDs, email completeness and
  escaping, channel configuration, multi-channel delivery, and partial phone failure behavior.

## Verification

- `npm test`: 51 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with no warnings or errors; Next.js printed its existing lint-command
  deprecation notice.
- `npm run build`: passed; `/api/pilot-requests` built as a dynamic server route.
- `git diff --check`: passed.
- Recipient-PII scan: no notification email address or phone number is hardcoded.

## Production activation gate

The production Vercel project currently has only `SQUARESPACE_API_KEY`. Do not merge or deploy
this change until the owner provisions and configures:

- Resend: `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_TO`.
- Twilio shared credentials: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and
  `CONTACT_PHONE_TO`.
- At least one Twilio phone sender: `TWILIO_SMS_FROM`, `TWILIO_WHATSAPP_FROM`, or an enabled
  `TWILIO_VOICE_FROM` with `CONTACT_VOICE_ENABLED=true`.
- For business-initiated WhatsApp alerts, an approved template in
  `TWILIO_WHATSAPP_CONTENT_SID` is recommended.

After the variables are installed, create a Vercel preview, submit one clearly labeled test
request, verify delivery in both email inboxes and every enabled phone channel, and only then
request explicit human authorization for production promotion.

## Known limits

- Squarespace Contacts stores only the submitter's supported contact fields; the complete intake
  is preserved in the two notification inboxes, not in a dedicated application database.
- Twilio trial accounts require verified recipient numbers, and WhatsApp business-initiated
  messages may require an approved content template.
- Voice alerts are disabled unless explicitly enabled to avoid unexpected calls and charges.
