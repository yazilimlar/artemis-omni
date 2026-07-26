# ARTEMIS Geometric Workbench

Clean-room foundation for the next-generation ARTEMIS Geometric Workbench.

## Architectural contract

This directory is isolated from the legacy Workbench runtime. Legacy code is reference material only and must not be copied in without an explicit migration decision and regression test.

Permanent rules:

1. UI components never calculate engineering geometry.
2. All configuration mutations enter through one typed gateway.
3. Geometry/model revisions are immutable after completion.
4. Derived computations are dependency-driven and revision-aware.
5. A stale build may never become current.
6. BOM, drawings, exports, and renderers consume the same canonical engineering model.
7. Exports are permitted only from a completed, clean revision with matching fingerprints.
8. Version numbers belong in release metadata and Git tags, not directory names or product routes.

## Foundation scope

This first phase establishes:

- typed configuration contracts;
- the single configuration mutation gateway;
- immutable revision snapshots;
- dependency invalidation plumbing;
- stale-build rejection semantics;
- deterministic configuration fingerprints;
- a regression-testable package boundary.

Geometry, topology, fabrication, rendering, drawings, and BOM migration are intentionally subsequent gates.

## Directory map

```text
artemis-workbench/
  src/
    configuration/
    dependency-graph/
    revisions/
    shared/
  tests/
  docs/
```

## Migration policy

The existing Workbench remains frozen as a comparison/reference implementation while this application is built. New engineering features should target this clean-room application rather than extending legacy versioned runtime paths.
