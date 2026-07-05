# Artemis Atlas Handcrafted Guru Selection v00

## Milestone

- Branch: `feature/artemis-atlas-handcrafted-guru-selection-v00`
- Route: `/labs/artemis-atlas-handcrafted-guru-selection-v00`
- Standalone shell: `public/standalone/artemis-atlas-handcrafted-guru-selection-v00.html`
- Public asset directory: `public/standalone/assets/handcrafted-guru-selection-v00/`
- Source archive used for v00: `Archive 2.zip`

## What This Mutant Tests

`Artemis Atlas Handcrafted Guru Selection v00` is an isolated mutant of the Atlas direction. It uses curated handcrafted map plates as the primary environment, overlays real lon/lat route logic, and presents the experience as a game-like command deck.

The lab includes:

- 3D-default visual plate mode with flat-mode toggle.
- Transparent, hideable, mobile-friendly controls.
- Editable and reorderable destination list.
- Auto-sort by distance and by trip-time heuristic.
- Undo/recall stack for route changes.
- Add/remove location controls.
- Campaign pack insertion to the top or end of the trip.
- Guru guide switching for George, Piri Reis, Mercator, Eratosthenes, Ortelius, Magellan, and a modern systems lens.
- No Mapbox or other map-engine token exposure.

## Asset Pipeline

Rebuild the public image assets and manifest with:

```bash
node scripts/build-handcrafted-guru-assets.mjs "<archive.zip|source-directory>"
```

The script:

1. Extracts the supplied archive or reads a source directory.
2. Ignores `__MACOSX` metadata.
3. Normalizes file names.
4. Maps curated images to stable public asset IDs.
5. Converts plates to web-safe JPEGs with `sips`.
6. Writes `manifest.json` and `pipeline-record.json`.

The public manifest stores only the source archive basename, stable public paths, image dimensions, role, and focus tags. It does not store local machine paths.

## Public Boundary

This is a visual/game prototype. It uses approximate lon/lat projection over curated art plates. It is not survey-grade GIS, navigation software, a booking engine, or a claim that every illustrated historical reconstruction is archaeologically exact.

## Next Development Steps

- Split the route engine into reusable data and rendering modules after the second route pack.
- Add per-stop image alignment metadata for plate-specific annotation accuracy.
- Add a production booking handoff only after partner, disclosure, and data-source boundaries are approved.
- Add performance budgets and mobile screenshot tests before promoting beyond Labs.
