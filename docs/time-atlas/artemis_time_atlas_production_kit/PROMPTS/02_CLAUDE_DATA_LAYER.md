# Prompt 02 — Claude Code Fable: Local Data Layer

Create the local data layer for Artemis Time Atlas V1.

## Required Files

```txt
data/troy/eras.ts
data/troy/pois.ts
data/troy/layers.ts
data/troy/kmlAnchors.ts
types/time-atlas/index.ts
```

## Data Requirements

- 4 eras:
  - 1200 BC ghost teaser
  - 600 BC active
  - 150 AD ghost teaser
  - 2026 AD ghost teaser

- 10 POIs:
  - Citadel
  - Temple of Athena
  - Lower Town
  - South Gate
  - Harbor Outpost
  - Scamander River
  - Farmland
  - Sacred Spring
  - Hellespont / Dardanelles
  - Mount Ida

- 5 layers:
  - Defense
  - Trade
  - Religion
  - Agriculture
  - Water

## Historical Credibility

Each POI must include:
- confidence level
- evidence snippet
- source note
- coordinates
- local scene position
- layer
- category

## Tone

Use cautious scholarly language.

Do not assert speculative details as facts.

## Validation

Create a utility or runtime check that ensures:
- every POI references a valid layer
- every POI references a valid era
- every POI has a confidence label
- every POI has an evidence snippet
