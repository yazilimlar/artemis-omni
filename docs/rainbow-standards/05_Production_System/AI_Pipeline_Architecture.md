# AI Pipeline Architecture

## Canonical Name

The Rainbow Botanics production pipeline is the **Prismaflora Foundry Pipeline**.

It is a multi-model, human-approved pipeline for turning field observations into
structured botanical assets.

## Pipeline Stages

```text
1. Field Capture
2. Rainbow Botanical Intake
3. Vision and Metadata Analysis
4. Rainbow Knowledge Engine
5. Adaptive Botanical Theme Engine
6. Visual Asset Foundry
7. Multi-model Review
8. Human Approval Gate
9. Preview Publish
10. Public Publish
11. Longitudinal Monitoring
```

## Model Roles

| System | Role |
| --- | --- |
| ChatGPT / GPT | Product architecture, standards synthesis, prompt design, knowledge organization. |
| Codex | Repository edits, schemas, validation, build checks, implementation discipline. |
| Claude Code | UI implementation, content polish, refactoring, page assembly. |
| Gemini | Multimodal critique, image review, Google ecosystem and future Photos workflow checks. |
| DeepSeek | Engineering math, morphometrics, measurements, logic review. |
| NotebookLM | Source-grounded research packets and citation review. |
| Grok or alternate critic | External critique and trend/context review when useful. |
| Human owner | Final approval, account access, credentials, publication, and irreversible changes. |

## Stage Contracts

### 1. Vision and Metadata Analysis

Inputs:

- source photos,
- EXIF where permitted,
- user notes,
- known location context.

Outputs:

- species candidates,
- AI confidence,
- bloom stage,
- color palette,
- habitat estimate,
- capture completeness report.

### 2. Rainbow Knowledge Engine

Outputs:

- scientific profile,
- linguistic and folk names,
- geographic range,
- historical timeline,
- cultural and art layers,
- ecology layer,
- engineering layer,
- source status per claim.

### 3. Adaptive Botanical Theme Engine

Outputs:

- extracted palette,
- habitat theme,
- seasonal variant,
- knowledge-mode variants,
- accessibility notes.

### 4. Visual Asset Foundry

Outputs:

- hero poster,
- blueprint,
- heritage illustration,
- photographic plate,
- Atlas page,
- social package,
- downloadable PDF,
- future WebGL or photogrammetry assets.

### 5. Multi-model Review

Each reviewer has a limited job:

- factual review,
- visual review,
- engineering review,
- accessibility review,
- privacy review,
- source review.

No model can approve its own output for publication.

## Gates

| Gate | Required Result |
| --- | --- |
| Identity Gate | species candidates and confidence visible |
| Privacy Gate | no private raw GPS or EXIF in public output |
| Source Gate | claims labeled and citations queued |
| Visual Gate | assets trace back to source photos |
| Accessibility Gate | theme and layouts legible |
| Human Gate | owner approves preview and publication |

## Phase Guidance

Phase 1 should use manual upload and local JSON drafts. Do not build automated Google
Photos ingestion, social posting, production auth, or database writes until a later
approved milestone.
