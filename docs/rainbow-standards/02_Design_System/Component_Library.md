# Component Library

## Purpose

Rainbow Botanics should be built from reusable components rather than one-off pages.
Each species page is a composition of the same reliable components fed by the specimen
schema.

## Core Components

| Component | Purpose |
| --- | --- |
| Species Header | Scientific name, common names, spectrum designation, knowledge score. |
| Specimen Identity Panel | Specimen ID, observation status, confidence, public location. |
| Taxonomy Card | Kingdom to species plus synonyms and authority. |
| Photo Gallery | Ground truth capture set with EXIF privacy controls. |
| Morphology Table | measurements, structures, bloom duration, habit. |
| Color Profile | extracted palette, source regions, hex values. |
| Knowledge Tabs | Overview, Photos, Botany, Culture, History, Ecology, Engineering, Atlas, Downloads. |
| Family Tree | taxonomic lineage and related species. |
| Historical Timeline | dated and sourced events. |
| Cultural Notes | source-labeled cultural, linguistic, artistic, and literary entries. |
| Ecology Network | pollinators, companion species, habitat, soil. |
| Engineering Analysis | geometry, root behavior, hydrology, urban resilience. |
| Blueprint Viewer | elevations, sections, annotations, measurements. |
| Heritage Viewer | selected visual era with source and generation notes. |
| Atlas Map | privacy-safe location, terrain, soil, climate, bloom history. |
| Asset Downloads | poster, PDF, social pack, citation export. |
| QA Status Panel | draft status, source gaps, publication blockers. |

## Interaction Rules

- Tabs should not cause layout shifts.
- Asset views should show source status and generation mode.
- Downloads should be disabled until approved.
- Atlas location must default to privacy-safe mode.
- Source warnings must remain visible in public preview.

## Future Implementation Notes

The first implementation should use the existing Next.js App Router and TypeScript
patterns in Artemis. Avoid creating a new framework or separate app unless an ADR
approves it.
