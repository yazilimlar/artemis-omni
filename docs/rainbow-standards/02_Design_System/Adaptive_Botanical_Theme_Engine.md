# Adaptive Botanical Theme Engine

## Definition

The Adaptive Botanical Theme Engine (ABTE) is the design system that lets each organism
project its own visual atmosphere while preserving a coherent Rainbow Botanics product
language.

ABTE replaces static light/dark theming with a Living Botanical Palette computed from
species, habitat, season, geography, knowledge layer, and visual mode.

## Engine Inputs

```text
Plant species
  -> dominant flower colors
  -> leaf pigmentation
  -> habitat
  -> season
  -> time of day
  -> weather context
  -> historical or knowledge mode
  -> accessibility constraints
  -> interface palette
```

## Module Set

1. Habitat Engine
2. Seasonal Engine
3. Species Color Extraction
4. Blueprint Engine
5. Heritage Engine
6. Atlas Engine
7. Knowledge Mode Engine
8. Living Color Engine
9. Botanical Prism

## Habitat Themes

| Habitat | Background | Panels | Highlights | Texture |
| --- | --- | --- | --- | --- |
| Temperate forest | Deep moss green | Fern green | Lichen gold | Botanical paper with leaf venation |
| Desert flora | Warm sandstone | Clay | Copper | Fine sandstone grain |
| Wetlands | Blue-green slate | Riverstone | Water iris blue | Slow water reflection |
| Tropical rainforest | Canopy emerald | Jade | Orchid magenta | Canopy shadow |
| Prairie or meadow | Warm grassland | Seedhead tan | Goldenrod | Wind-line texture |

## Seasonal Engine

For *Hemerocallis fulva*:

| Season | Palette Direction | UI Mood |
| --- | --- | --- |
| Spring | fresh greens, morning mist, new growth | light and airy |
| Summer | amber, copper, golden sunlight | high saturation |
| Autumn | oxidized copper, burnt sienna, ochre | warm and rich |
| Winter | frost gray, silver, blue spruce | crisp and restrained |

## Species Color Extraction

The first implementation can use manual color samples. Later implementations should
extract palettes from user photos with AI or image-processing tools.

For *Hemerocallis fulva*:

| Role | Color | Hex | Source |
| --- | --- | --- | --- |
| Primary | Solar yellow | `#FFD700` | flower center |
| Secondary | Golden orange | `#FF8C00` | petal field |
| Accent | Copper orange | `#D2691E` | petal edge |
| Structural | Oxidized burgundy | `#8B1A1A` | throat and veins |
| Leaf | Forest green | `#228B22` | foliage |
| Shadow | Deep olive | `#556B2F` | shaded foliage |

## Knowledge Modes

| Mode | Visual Language |
| --- | --- |
| Scientific | white or near-white, quiet grid, citation-forward layout |
| Engineering | blueprint ground, dimension lines, sections, annotations |
| Historical | archival paper, serif typography, source notes |
| Ecological | organic gradients, network overlays, habitat cues |
| Art | gallery gray, large imagery, restrained labels |
| Atlas | map-first, terrain-aware colors, GIS controls |

## Reference Visual Variants

The first Hemerocallis concept set establishes four useful ABTE variants:

| Variant | Use | Notes |
| --- | --- | --- |
| Dark Botanical Archive | museum poster, high-contrast specimen card | deep green-black ground, gold rules, source photo as hero |
| Dark Technical Atlas | dense engineering and Atlas dashboard | blueprint panels, maps, root system, phenology, visual protocol strips |
| Dark Vertical Engineering Plate | mobile or poster-friendly technical summary | geometry overlay, metadata ribbon, Atlas preview, performance panels |
| Light Parchment Atlas | printable educational plate and classroom version | cream ground, botanical paper texture, softer map and heritage panels |

The variants are visual directions, not verified content. Any text embedded in generated
concept art must pass the source and privacy gates before reuse.

## Accessibility Requirements

- Color is never the only state indicator.
- Text contrast must meet WCAG AA for public pages.
- Motion must respect reduced-motion preferences.
- AI-selected palettes must be checked for readability before publication.
- Blueprint and heritage modes may be expressive, but body text must remain legible.
