# Request for Pilot — Artemis 2 Contract

## Objective

Every valid pilot request must be durably recorded, assigned an opaque reference ID, routed to the correct Artemis vertical, and reported to the approved Artemis recipients.

Notifications are downstream delivery channels. A temporary email, SMS, WhatsApp, Squarespace, or CRM failure must not erase the request or falsely tell the visitor that a persisted request was lost.

## Public route

```text
/construction/request-pilot
/api/pilot-requests
```

The API is shared infrastructure, but every request carries `vertical`, `productSlug`, `sourcePage`, and attribution metadata.

## Required construction fields

- name
- workEmail
- company
- role
- companyType
- geography
- marketType
- primaryChallenge
- productInterest
- currentSystems
- implementationHorizon
- preferredContactChannel
- message
- consentVersion
- sourcePage

Optional fields:

- telephone
- WhatsApp number
- annual revenue or project-size band
- attachment reference
- UTM attribution

## Acceptance transaction

A visitor-facing success response requires:

1. Server-side validation passes.
2. The lead is written to the Artemis source-of-truth database.
3. Consent and attribution records are committed.
4. An outbox event is committed in the same transaction.
5. An opaque request ID is returned.

The public response must not depend on Twilio, Resend, Squarespace, Gmail, or another external provider being available at that instant.

## Notification and reporting pipeline

After acceptance, workers process independently:

1. Artemis-branded confirmation email to the requester.
2. Complete internal email report to configured recipients.
3. Internal SMS for high-priority or configured requests.
4. Optional WhatsApp notification after explicit configuration and template approval.
5. Squarespace contact upsert.
6. CRM activity creation.
7. Daily pilot-request digest.

Each channel records `pending`, `sent`, `failed`, `retrying`, or `dead-lettered` status.

## Owner report contents

The internal report includes:

- request ID and received timestamp;
- vertical and product;
- full submitted request;
- company and role classification;
- source URL and campaign attribution;
- consented contact methods;
- lead priority indicators;
- delivery status by channel;
- direct link to the admin record when available.

## Security and privacy

- No destination email, phone number, provider credential, or sender credential is committed.
- Provider secrets remain server-only environment variables.
- Logs use the request ID and redact unnecessary PII.
- HTML/XML output is escaped.
- Request size and field lengths are bounded.
- Honeypot and rate-limit controls are required.
- Provider webhooks and retries are idempotent.

## Environment contract

Initial delivery may use:

```text
CONTACT_EMAIL_TO
CONTACT_EMAIL_FROM
RESEND_API_KEY
CONTACT_PHONE_TO
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_SMS_FROM
SQUARESPACE_API_KEY
```

WhatsApp and voice remain optional and disabled until separately approved.

## Migration note

PR #30 contains tested notification, escaping, deterministic request-ID, Squarespace synchronization, and Twilio/Resend work that can be selectively migrated. Its current requirement that public success depend on email plus a phone channel must be rewritten to follow this durable-acceptance contract before Artemis 2 production use.
