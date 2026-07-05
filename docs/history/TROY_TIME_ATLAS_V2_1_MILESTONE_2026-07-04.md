# Troy Time Atlas v2.1 Milestone

Date: 2026-07-04

## Summary

Artemis Time Atlas: Troy was promoted from a development/test route into a public
Labs module and revised around the next-phase architecture direction: the KML file is
now the runtime source of truth, while the standalone HTML remains fast, static, and
iframe-friendly.

Public route:

`/labs/troy-time-atlas`

Compatibility route retained:

`/labs/developmentandtest/troy-time-atlas`

## What Changed

- Runtime KML parser loads `public/standalone/troy-time-atlas-600bc.kml` before scene
  construction.
- Embedded JavaScript POI/polygon/river constants remain only as fallback if KML loading
  fails.
- Story mode guides the user through the Hellespont, Sigeion, Scamander crossing,
  citadel, Athena sanctuary, and Rhoeteion.
- Scholar view exposes source status, POI count, true-scale radius, and vertical
  exaggeration.
- The scene now has lightweight motion: drifting ships, a caravan path, and smoke puffs.
- Optional browser-safe ambience can be started by the user from the Sound control.
- The public Labs index, sitemap, and program catalog now include the Time Atlas module.

## Product Direction

The immediate strategy is to keep the first Time Atlas engine static and public while
proving the repeatable pattern: KML-authored sites, evidence-graded POIs, guided story
beats, social-ready vertical framing, and downloadable Google Earth source data.

The next high-leverage content step is Roman Ilium or a second site such as Ephesus.
The engineering step after that is splitting the single standalone file into a small
Vite module set before adding multiple sites, richer GLB assets, automated tests, or
stateful user features.

## Boundary

This is an evidence-graded public prototype. It is a compressed interpretive diorama
using KML anchors, not a survey-grade GIS reconstruction, official archaeology
publication, navigation product, or final museum-grade 3D model.

## Files

- `public/standalone/troy-time-atlas-600bc.html`
- `public/standalone/troy-time-atlas-600bc.kml`
- `app/labs/troy-time-atlas/page.tsx`
- `app/labs/developmentandtest/troy-time-atlas/page.tsx`
- `app/labs/page.tsx`
- `data/programCatalog.ts`
- `app/sitemap.ts`
