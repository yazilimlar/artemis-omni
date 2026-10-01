# ADR-010 - BidRoom Product Family Registration

- **Status:** Accepted
- **Date:** 2026-10-01
- **Extends:** ADR-006

## Context

The Phase 1 inventory (PR #67, item C10 and Table B) identified the BidRoom suite as the
largest unregistered product surface: AtlasIQ, Verity, Live, Evidence Engine, Switchboard
and Contractor, built through PRs #24–#29. PR #69 added a `bidroom-suite` registry entry
with division, family, lifecycle, maturity, visibility, data mode and canonical route all
set to `UNREVIEWED`.

The Bid Room v2.1 review interface is a separate thing. It belongs to `civicbid`, per
`ENGINEERING/FEATURE_PASSPORTS/CIVICBID_BID_ROOM_V2_1_UI.md`.

Inventory item C8 found a shadow copy at `src/app/labs/bidroom-atlasiq`. Next.js ignores
`src/app` when a root `app/` exists. The shadow copy differs from
`app/labs/bidroom-atlasiq`: it has an extra component file and a different `page.tsx`.

## Decision

The BidRoom product suite is registered as a single product family under
Infrastructure and Construction.

- **Division:** `infrastructure-construction`
- **Product family:** `bidroom`
- **Boundary:** distinct from `civicbid`, which keeps ownership of The Bid Room v2.1 passport
- **Canonical route:** `/products/bidroom`, to be verified in a deployed-route review
- **Surfaces:** `/products/bidroom/*` and `/labs/bidroom-*`
- **Shadow copy (C8):** `src/app/labs/bidroom-atlasiq` gets the disposition
  `archive_after_evidence`. It is archived only after its differences from
  `app/labs/bidroom-atlasiq` are reviewed and anything unique is either migrated or
  rejected.
- **Lifecycle:** `rescue`, until a deployed-route review is recorded

## Consequences

- The registry refinement PR applies these values to `bidroom-suite`. The registry
  currently records lifecycle `UNREVIEWED`, so `rescue` is a new value, not a carried-over
  one.
- BidRoom must not import CivicBid's private data or implementation, or the reverse, except
  through approved shared interfaces (ADR-006).
- Visibility across the BidRoom surfaces is mixed: `/labs/bidroom-verity` is noindex and
  the other surfaces are indexable. Setting it is part of the deployed-route review.
- `bidroom-exemplary-contractor` keeps its own registry entry: an `internal_asset`
  placeholder persona under ADR-008. Its route falls under the `/labs/bidroom-*` pattern,
  but whether it joins the `bidroom` family is left to the registry refinement PR.

## Non-goals

This ADR does not:

- modify any registry YAML;
- move, rename, redirect or delete any route or the shadow copy;
- promote BidRoom beyond `rescue`;
- change The Bid Room v2.1 interface or the `civicbid` registry entry.
