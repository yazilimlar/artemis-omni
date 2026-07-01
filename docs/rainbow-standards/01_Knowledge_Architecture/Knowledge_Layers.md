# Knowledge Layers

Rainbow Botanics presents each specimen through switchable knowledge layers. The same
source record feeds every layer, which prevents one-off content drift.

## Layer Index

| Layer | Purpose | Required Before Public? |
| --- | --- | --- |
| Overview | Concise specimen story and key facts. | Yes |
| Scientific Herbarium | Taxonomy, morphology, diagnostics, scale, collection metadata. | Yes |
| Blueprint Engineering | Geometry, root architecture, sections, measurements, structural interpretation. | Draft acceptable |
| Heritage Illustration | Historical or museum-style visual renderings. | Draft acceptable |
| Photographic Plate | Source photo set arranged as ground truth documentation. | Yes |
| Seasonal Timeline | Emergence, budding, bloom, seed, dormancy, annual repeat observations. | Partial acceptable |
| Age Progression | Long-term plant or colony development. | Optional |
| Geographic Origin | Native range, naturalized range, introduction routes, climate. | Yes |
| Historical Migration | Timeline of movement through cultivation, trade, settlement, or naturalization. | Draft acceptable |
| Habitat Relationships | Nearby plants, habitat type, soil, hydrology, slope, sun exposure. | Yes for local specimens |
| Family Tree | Taxonomy plus sibling species, hybrids, ancestors, and related taxa. | Draft acceptable |
| Anatomical Exploded View | Flower, tepals, stamens, pistil, leaves, stem, roots. | Optional for M1 |
| Ecology Network | Pollinators, soil organisms, companion species, food-web relationships. | Draft acceptable |
| Cultural Atlas | Names, folklore, symbolism, art, literature, festivals, documented traditions. | Draft acceptable |
| Digital Twin | GIS, climate, bloom history, photogrammetry, LiDAR, WebGL, change detection. | Private draft acceptable |

## Tab Structure for Species Pages

The planned public route should use:

```text
Overview
Photos
Botany
Culture
History
Ecology
Engineering
Atlas
Downloads
```

Tabs may be hidden until they satisfy publication thresholds.

## Evidence Rules

- Scientific claims require botanical or institutional sources.
- Historical claims require dated references where possible.
- Cultural and Indigenous claims require careful sourcing and respectful attribution.
- Mythology must not be invented to fill a layer.
- Engineering interpretations can be original, but they must be labeled
  `interpretive`.

## Relationship Graph

Each specimen should be linkable to:

- taxonomic relatives,
- visually similar species,
- companion species,
- pollinators,
- herbivores,
- soil and fungi relationships,
- native ecosystems,
- landscape applications,
- human uses,
- historical introduction routes.

The relationship graph should eventually power search, discovery, and recommendations.
