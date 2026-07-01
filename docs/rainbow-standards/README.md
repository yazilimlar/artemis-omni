# Rainbow Botanical Standards Manual v1.0

Status: M1 documentation baseline  
Applies to: Rainbow Botanics 2026, Artemis Atlas, AGOraXAI publishing workflows  
Canonical production system: Prismaflora Foundry Pipeline

## Purpose

The Rainbow Botanical Standards Manual is the repository-native source of truth for
Rainbow Botanics. It preserves the intellectual architecture behind the project before
public routes, generators, or automated publishing are built.

Rainbow Botanics is not a plant blog or a static gallery. It is a living botanical
observatory where each photographed specimen becomes a structured digital twin:
scientifically identified, visually rendered, geographically located, culturally
contextualized, engineered as a knowledge asset, and updated through future field
observations.

## Canonical Operating Model

The production pipeline is named **Prismaflora Foundry Pipeline**.

Prismaflora Foundry turns field photography into review-ready botanical assets:

```text
Field Capture
  -> Rainbow Botanical Intake
  -> AI vision and metadata extraction
  -> Rainbow Knowledge Engine
  -> Adaptive Botanical Theme Engine
  -> Visual Asset Foundry
  -> Multi-model review
  -> Human approval
  -> Preview publish
  -> Public publish and longitudinal monitoring
```

## Required Milestone Order

1. M1 - Standards Manual v1.0.
2. M2 - Data schema and adaptive theme engine implementation.
3. M3 - Hemerocallis fulva reference page.
4. M4 - Generator and intake workflow.
5. M5 - Batch publishing and longitudinal tracking.

M1 is documentation-only. It does not create public routes, production database tables,
auth flows, social posting automations, or direct Google Photos integration.

## Manual Structure

```text
docs/rainbow-standards/
  00_Governance/
  01_Knowledge_Architecture/
  02_Design_System/
  03_Visual_Asset_Specification/
  04_Data_Model/
  05_Production_System/
  06_Technology_Stack/
  07_AI_Systems/
  08_Library/
```

## Non-negotiable Rules

- Human review is required before anything is published.
- Public pages must not expose private home addresses, exact private GPS coordinates,
  raw EXIF data, private Google Photos links, or personal location trails.
- Medical, edible, cultural, historical, and mythological claims must carry confidence
  and source status.
- Undocumented myths or traditions must not be invented.
- AI-generated visuals must be labeled by mode and reviewed against the source photos.
- Exact specimen IDs persist across years. New observations extend the same record.
- The first complete benchmark specimen is *Hemerocallis fulva* / Tawny Daylily.

## Relationship to Artemis

Rainbow Botanics is an Artemis knowledge domain. It inherits the Artemis operating
rules: preview-first deployment, human-owned credentials, no committed secrets, and
AI agents working from repository truth instead of chat memory.

## Required Reading for Future Agents

Before implementing Rainbow Botanics code or content, read:

1. `docs/rainbow-standards/README.md`
2. `docs/rainbow-standards/01_Knowledge_Architecture/Rainbow_Botanical_Specification.md`
3. `docs/rainbow-standards/02_Design_System/Adaptive_Botanical_Theme_Engine.md`
4. `docs/rainbow-standards/04_Data_Model/Specimen_Schema.md`
5. `docs/rainbow-standards/05_Production_System/AI_Pipeline_Architecture.md`
6. `docs/rainbow-standards/08_Library/Reference_Implementation/Hemerocallis_fulva/Complete_Specimen.md`
