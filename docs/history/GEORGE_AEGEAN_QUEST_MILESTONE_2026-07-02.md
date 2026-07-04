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
- Stylized 3D route board with approximate lon/lat projection and a more realistic
  Aegean / Anatolia coastline layer instead of a full GIS map.
- The main board has a cartography-lineage visual pass: graticule, rhumb lines,
  compass rose, coastal shelf, city/port marks, and mapmaker labels referencing
  Eratosthenes, Waldseemuller, Ortelius, Piri Reis, Mercator, Magellan, and the
  modern orbital mapping era.
- Dynamic world-scene backdrop and scene chip now change by destination, using
  optimized local imagery for Troy, Ephesus, Halicarnassus / Bodrum, Marmaris,
  Gokova, Didyma, Pamphylia, and the broader Hellenic-Anatolian region.
- Default George route is active at startup.
- Route list is available as a drawer rather than a permanent blocking panel.
- User can add custom stops after the current checkpoint.
- User can remove route stops and reset the default route.
- User can move destinations up/down in the itinerary.
- User can auto-sort future destinations by shortest distance or fastest estimated
  trip time from the current stop.
- User can undo the last itinerary edit, including add, remove, reorder, sort, and
  reset actions.
- User can switch characters from a local roster. The newer roster adds sixteen
  individualized selectable characters: Helen of Troy, Aphrodite, Psyche,
  Cleopatra VII, Nefertiti, Nefertari, Sita, Draupadi, Ishtar, Hathor, Esther,
  Roxana, Zenobia, Xi Shi, Wang Zhaojun, and Calypso.
- Troy Time Atlas KML anchors are projected as a local c. 600 BC layer:
  citadel, wall circuit, gates, Temple and Altar of Athena, hero shrine, lower
  town, theatre, outer wall, bridge, Sigeum, Rhoeteum, Scamander river trace,
  Dardanelles / Hellespont, Plain of Troy, Hanay Tepe, and Kumtepe.
- Added local compressed image assets for the George variants, roster references,
  Troy/St. George reference, workshop council scene, destination world scenes,
  and individual character tiles.

## Boundary

This is a mobile game prototype and itinerary-storytelling shell. The Troy KML points
are preserved as data and projected onto the stylized game board; the result is not a
survey-grade GIS view, navigation app, travel agency, or booking engine. Future booking
or partner actions should be added as explicit handoff flows after route pacing and
character-led discovery are validated.

## Files

- `public/standalone/george-aegean-quest.html`
- `public/standalone/assets/george-aegean-quest/george.jpg`
- `public/standalone/assets/george-aegean-quest/george-strong.jpg`
- `public/standalone/assets/george-aegean-quest/george-purple.jpg`
- `public/standalone/assets/george-aegean-quest/troy-st-george.jpg`
- `public/standalone/assets/george-aegean-quest/professional-roster.jpg`
- `public/standalone/assets/george-aegean-quest/historical-roster.jpg`
- `public/standalone/assets/george-aegean-quest/workshop-council.jpg`
- `public/standalone/assets/george-aegean-quest/world/`
- `public/standalone/assets/george-aegean-quest/characters/`
- `app/labs/george-aegean-quest/page.tsx`
- `app/labs/page.tsx`
- `app/library/programs/page.tsx`
- `data/programCatalog.ts`
- `app/sitemap.ts`
