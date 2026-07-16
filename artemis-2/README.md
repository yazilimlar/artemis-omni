# Artemis 2

Artemis 2 is the clean, independently evolvable operating platform for Artemis products, departments, research, services, commerce, and client relationships.

## Principles

- Production quality from the first release
- First-party ownership of leads, customers, products, orders, consent, and entitlements
- Strict separation between public web, customer portal, internal administration, and product runtimes
- Reuse only validated legacy assets
- External providers are integrations, not the source of truth
- Durable writes precede notifications and synchronization
- Accessibility, privacy, security, performance, and observability are release requirements

## Workspace

```text
apps/
  web/       Public Artemis site
  portal/    Customer and pilot portal
  admin/     Internal operations console
  api/       Server API boundary
  workers/   Async integrations and retries
packages/
  shared-types/
  validation/
  ui/
  database/
  product-catalog/
  crm/
  consent/
  attribution/
  billing/
  communications/
  observability/
products/
  bidroomlive/
  civicbid/
  goodledger/
  didymaion/
  marine/
docs/
archive-manifest/
```

## First controlled release

1. Design system and global layout
2. Product catalog
3. Universal inquiry and demo system
4. First-party lead, consent, and attribution records
5. Resend notification integration
6. Squarespace synchronization worker
7. Stripe checkout and verified fulfillment
8. Internal lead dashboard
9. Support/sponsor links and managed QR destinations
10. Migration of approved existing products and content

The current Artemis Omni production application remains unchanged while this workspace is developed and reviewed.