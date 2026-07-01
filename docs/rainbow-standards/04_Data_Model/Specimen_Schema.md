# Specimen Schema

## Purpose

`specimen.schema.json` defines the minimum durable record for a Rainbow Botanical
Digital Twin. It should be used for generated JSON, content review, database design,
and future TypeScript types.

## Design Goals

- Preserve specimen identity across years.
- Separate public-safe data from private source metadata.
- Support scientific, cultural, ecological, engineering, AI, and Atlas layers.
- Track claim confidence and source status.
- Support derived visual assets without losing source-photo provenance.

## Required Top-level Groups

- `schema_version`
- `specimen_id`
- `record_status`
- `identity`
- `taxonomy`
- `names`
- `observation`
- `location`
- `morphology`
- `phenology`
- `ecology`
- `engineering`
- `knowledge_layers`
- `assets`
- `ai_metadata`
- `references`
- `qa`
- `revision_history`

## Privacy Model

Location data is split into:

- private source metadata, stored only in protected systems;
- public-safe display fields, used for website and social assets.

The schema included here models public-safe values. Future implementation may define a
separate private ingestion schema.

## Implementation Guidance

Phase 1 can store records as versioned JSON files. Later phases may promote records to
Supabase or MongoDB Atlas after an approved architecture decision.
