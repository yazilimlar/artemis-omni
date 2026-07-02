# George Aegean Quest Milestone

Date: 2026-07-02

## Summary

George Aegean Quest was created as a separate, iPhone-first Artemis Atlas lab. It is
not a fork of the heavy map-engine Atlas. It is a lightweight standalone game surface
optimized for one-thumb mobile play, smooth transitions, and a default character-led
route.

Public route:

`/labs/george-aegean-quest`

## Default Route

The route loads by default at startup:

1. Istanbul
2. Asos
3. Ephesus
4. Virgin Mary
5. Priene
6. Miletus
7. Bodrum
8. Rhodes
9. Marmaris
10. Gokova
11. Gocek
12. Aphrodisias
13. Didyma
14. Perge
15. Aspendos
16. Tarsus
17. Adana

## Character

The special character is George, using the provided image as a compressed local static
asset for fast iPhone load:

`public/standalone/assets/george-aegean-quest/george.jpg`

## Product Direction

- iPhone-first layout with a centered phone shell on desktop.
- Simplified one-thumb controls: Route, Next Stop, Auto.
- No Mapbox, MapLibre, Leaflet, or external map token dependency.
- Stylized 3D route board instead of a full GIS map.
- Default George route is active at startup.
- Route list is available as a drawer rather than a permanent blocking panel.

## Boundary

This is a mobile game prototype and itinerary-storytelling shell. It is not a complete
GIS dataset, navigation app, travel agency, or booking engine. Future booking or partner
actions should be added as explicit handoff flows after route pacing and character-led
discovery are validated.

## Files

- `public/standalone/george-aegean-quest.html`
- `public/standalone/assets/george-aegean-quest/george.jpg`
- `app/labs/george-aegean-quest/page.tsx`
- `app/labs/page.tsx`
- `app/library/programs/page.tsx`
- `data/programCatalog.ts`
- `app/sitemap.ts`
