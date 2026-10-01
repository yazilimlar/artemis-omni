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
