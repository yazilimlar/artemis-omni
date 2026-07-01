# Intake Workflow

## Purpose

Intake transforms a folder of user-captured photos into a draft Botanical Digital Twin.
Phase 1 starts with manual upload. Google Photos or Apple Photos automation comes later.

## Standard Capture Set

Capture as many of these as practical:

- habitat view,
- entire plant,
- front flower,
- side flower,
- rear flower,
- leaves,
- stem,
- bud,
- seed pod when present,
- bark or trunk when applicable,
- roots only if naturally exposed and appropriate,
- pollinator interaction when observed.

## Intake Stages

1. Create specimen ID.
2. Import source photos.
3. Strip or protect private EXIF for public workflows.
4. Extract public-safe metadata.
5. Run AI identification with confidence and alternate candidates.
6. Detect bloom stage and capture completeness.
7. Extract preliminary color palette.
8. Classify habitat.
9. Create draft specimen JSON.
10. Create source gaps list.
11. Route to Prismaflora Foundry for knowledge and asset generation.

## Privacy Controls

- Raw EXIF stays private.
- Public location defaults to rounded, regional, or withheld.
- Private property references must not be published.
- Social assets inherit the public-safe location only.

## Intake Output

```text
RB-2026-00071/
  source/
  draft/specimen.json
  draft/theme.json
  qa/intake-report.md
```

The `source/` folder is conceptual for protected storage. Public repository commits
should not include private raw photos unless the owner explicitly approves them.
