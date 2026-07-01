# Artemis Atlas All Countries Milestone

Date: 2026-06-30

## Summary

Artemis Atlas All Countries was created as an isolated clone of the standalone Artemis Turkiye Atlas. The clone keeps the proven standalone HTML engine and publishes it through a clean Next.js Labs route:

`/labs/artemis-atlas-all-countries`

## Product Direction

The clone shifts the atlas from a country-specific cultural-route prototype toward a game-like, mobile-friendly world atlas product shell:

- 3D Mapbox terrain starts as the standard mode.
- Terrain exaggeration starts at 3.5x.
- The interface adds a persistent HUD hide/show toggle.
- Explore, Campaign, Plan, and Book workflows are unified into a Journey command layer.
- Campaign routes can be inserted into the current trip at the top, at the end, or as a replacement.
- Existing itinerary, directions, route flyover, undo, and partner/booking demo actions remain connected to the original engine.
- Existing board-character movement is preserved and a visible map guide overlay was added.

## Boundary

All Countries is currently a product shell seeded by the existing Türkiye, Greece, and Bulgaria atlas data. Additional country packs should be added as validated datasets rather than implied as complete global coverage.

The app can use the owner Mapbox public `pk.*` browser token at startup, but browser-side Mapbox tokens are not secret. The token must be URL-restricted in Mapbox before stronger public promotion. Secret `sk.*` tokens must never ship to client code.

## Files

- `public/standalone/artemis-atlas-all-countries.html`
- `app/labs/artemis-atlas-all-countries/page.tsx`
- `app/labs/page.tsx`
- `app/library/programs/page.tsx`
- `data/programCatalog.ts`
- `app/sitemap.ts`
