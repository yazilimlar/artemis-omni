# ADR-019 - DayOS Compositional Architecture

- **Status:** Accepted
- **Date:** 2026-10-03
- **Extends:** ADR-006, ADR-011, ADR-017

## Context

DayOS is a temporal intelligence product. Its differentiator is the **Daily Ledger**:
correlating location, media, calendar, tasks, documents, and purchases into an
evidence-linked reconstruction of a day.

Every subsystem a day reconstruction needs (GPS ingestion, visit detection, map
rendering, photo storage, EXIF handling, face recognition) already has a mature
self-hosted open-source solution. Building those as a monolith would consume 12 or more
months before the differentiator ships.

State of the repository on `main`, 2026-10-03:

- DayOS is registered as `dayos` (`bucket: internal_product`, `lifecycle: active_lab`,
  `visibility: noindex_review`, division and family still UNREVIEWED).
- Three synthetic-fixture prototypes are merged: `/dayos-v098a`, `/dayos-v098b` and
  `/dayos-v098c` (PRs #54, #55, #56), with pure engines under `src/dayos/`. Static
  earlier versions sit under `public/dayos*`.
- ADR-006 requires one canonical implementation per product. That rule applies to the
  DayOS correlation layer, not to the subsystems it composes.
- ADR-011 governs internal routes (Supabase magic link and allowlist).

Facts about the external services below come from the owner's brief and have not been
verified in this repository. They are checked when each adapter is written (see the
build sequence).

## Decision

DayOS is built as a **compositional system**. DayOS owns the Daily Ledger and the
correlation layer; external services own the subsystems.

### a. External services, run unmodified

| Role | Service | Interface |
| --- | --- | --- |
| Location engine | Dawarich (self-hosted Rails/PostGIS, AGPL-3.0) | MCP endpoint `/api/v1/mcp` with read-only tools (`get_timeline`, `get_latest_location`, `search_visits`), plus REST |
| Media engine | Immich (self-hosted photo/video management, AGPL-3.0) | REST API; built-in integration with Dawarich |
| Calendar | Provider TBD (Google Calendar, iCloud, ...) | Provider API, read-only in v1 |

Each runs as a separate service. None is forked, vendored or copied into DayOS.

### b. DayOS owns

- the Daily Ledger data model;
- event correlation logic;
- the evidence graph and provenance;
- narrative synthesis;
- the user-facing "My Day" experience;
- the TypeScript interface definitions for each composed service.

### c. Interfaces and adapters

Interfaces live in `lib/dayos/interfaces/`:

```ts
interface LocationEngine {
  getTimeline(date): ...;
  getLatestLocation(): ...;
  searchVisits(query): ...;
}
interface MediaEngine {
  searchByTimeRange(from, to): ...;
  getPhoto(id): ...;
  getAlbum(id): ...;
}
interface CalendarProvider {
  listEvents(from, to): ...;
}
```

(Signatures are illustrative; the implementing PR fixes the types.) Each interface has at
least one concrete adapter (`DawarichAdapter`, `ImmichAdapter`, and a calendar adapter
once a provider is chosen). **Adapters are the only code that talks to an external
service.** Correlation, ledger and UI code depend on the interfaces only, so a service
can be swapped without touching them.

Adapter rules:

- Read-only in v1. No adapter writes to Dawarich, Immich or a calendar.
- Credentials and base URLs come from server-only environment variables (ADR-004), never
  from source. No `NEXT_PUBLIC_` prefix.
- Adapters are tested against recorded **synthetic** fixtures, never real data.

### d. Licensing

- Dawarich and Immich are AGPL-3.0. DayOS runs them **unmodified**, as separate network
  services, and queries them through their APIs. On the owner's reading, AGPL §13
  obligations attach to *modified* versions of the AGPL program offered to network users,
  so this arrangement does not place a source-sharing obligation on DayOS.
- If a future change requires modifying Dawarich or Immich, or distributing them, that
  needs a new ADR and legal review before work starts.
- The DayOS license is the owner's choice and is not forced by composition.
- This ADR records an engineering and governance decision. It is not legal advice; the
  AGPL reading above should get legal confirmation before DayOS is distributed to anyone
  else.

### e. Data ownership

- Location data lives in Dawarich's database.
- Media lives in Immich's storage.
- DayOS stores only: interface configuration, cached correlations, the evidence graph, and
  user-authored content (notes, tags).
- DayOS never duplicates a source of truth. Caches are derived, rebuildable and stored
  outside the repository.
- All services are self-hosted. No cloud dependency.
- **Personal data.** Location history and photos are highly sensitive. No real location,
  media, calendar or account data is ever committed to this repository, pasted into chat,
  or used in tests; repository code and fixtures are synthetic and labelled so (data mode
  `mixed_explicit` for DayOS, `synthetic` for anything committed). Real data is only
  ever present on the owner's machine.

### f. Deployment

- Each service has its own `docker-compose` in its own directory.
- DayOS is the orchestrator plus UI.
- v1 target: a single Mac (the owner's machine). Not public.
- No deployment to Vercel or Artemis infrastructure until a later ADR. The My Day UI is
  `internal_operations` and, when served from the Artemis app, must sit behind ADR-011
  auth and `noindex`.

### g. Build sequence (v1)

1. ADR-019 (this PR).
2. Deploy Dawarich and Immich locally with Docker.
3. Connect Dawarich to Immich (their built-in integration).
4. Write the adapter for Dawarich's MCP endpoint. Verify the endpoint and tool names
   against the running instance first.
5. Write the adapter for Immich's API.
6. Build the Daily Ledger proof of concept: correlate location and photos for one day and
   render a simple timeline.
7. Evaluate. Only then decide what to build next.

## Consequences

- DayOS scope is drastically reduced: a correlation layer, not a full stack.
- DayOS depends on two AGPL services running as separate processes, and on their API
  stability. Adapters absorb that risk.
- New code lives under `lib/dayos/` and `app/dayos/` (or a separate repository if the owner
  prefers). The path must be checked against the existing `public/dayos*` static assets
  and the `/dayos-v098a|b|c` prototype routes before it is chosen.
- The existing v0.9.8 prototypes stay as synthetic prototypes. Their runtime third-party
  fetches (unpkg Leaflet, Open-Meteo) remain accepted at `noindex_review` only and are
  unaffected by this ADR.
- No production exposure in v1.
- The `dayos` registry entry (division, family, maturity, data mode, distribution) is
  updated in a separate registry PR; this ADR changes no registry file.

## Non-goals

- Not rebuilding Dawarich or Immich.
- Not forking AGPL code.
- Not deploying to public infrastructure in v1.
- Not building mobile clients in v1.
- Not committing to a specific calendar provider in v1.

## References

ADR-006 (multi-division product architecture), ADR-011 (internal route auth), ADR-017
(contextual design language: the Daily Ledger's native visuals are timelines, maps and
evidence graphs), ADR-004 (secrets), PRs #54, #55, #56 (DayOS stack), the owner's
direction on 2026-10-03.
