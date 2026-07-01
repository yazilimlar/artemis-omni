# Prompt Library

## Master Instruction

```text
Read docs/rainbow-standards/ as the source of truth.

Implement only the requested Rainbow Botanics milestone.
Do not deviate from the Rainbow Botanical Specification, Adaptive Botanical Theme
Engine, Visual Asset Specification, Production System, or public-safe publishing rules.

If chat context conflicts with repository documentation, stop and identify the conflict.
```

## Specimen Draft Prompt

```text
Given a folder of approved source photos and user notes, create a draft Rainbow
Botanical specimen JSON following docs/rainbow-standards/04_Data_Model/specimen.schema.json.

Separate verified, historical, traditional, interpretive, and needs_source claims.
Do not publish exact private GPS or raw EXIF. Include source gaps and QA blockers.
```

## ABTE Prompt

```text
Create a Rainbow adaptive theme JSON following theme.schema.json.

Extract or propose a species palette from source photos, then combine it with habitat,
season, and knowledge mode. Check readability and include accessibility notes.
```

## Asset Package Prompt

```text
Using an approved specimen record, draft the hero poster, blueprint mode, heritage
mode, photo plate, Atlas placeholder, social package, and PDF outline.

Every asset must identify source photos, specimen ID, generation mode, version, and
publication status.
```

## Review Prompt

```text
Review this Rainbow Botanics package against the standards manual.

Report issues in this order: privacy blockers, factual/source blockers,
visual/accessibility blockers, schema problems, publication readiness, and suggested
next actions.
```
