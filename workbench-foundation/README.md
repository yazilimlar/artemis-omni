# ARTEMIS Workbench v6 — Foundation Package (6.1.0-foundation.1)

Covers approved-plan priorities 2, 5, 6, 7: the modular esbuild pipeline proven
end-to-end, the canonical cyclic panel signature (replacing the defective
sorted-multiset key), correct reflection indexing with its regression fixtures,
and best-fit-plane planarity.

## Layout
- `src/core/quantize.ts` — tolerance-aware integer quantization (signature + fingerprint inputs)
- `src/geometry/polygon.ts` — Vec3 tuple math, Newell normal, winding normalization, loop attributes
- `src/geometry/panelSignature.ts` — canonical cyclic signature; mirror policies; legacy key retained for parity harnesses only
- `src/geometry/planarity.ts` — Jacobi 3×3 eigensolver, best-fit plane, 4-class planarity classification
- `build.mjs` — TS → ESM (tests) + IIFE (`window.ARTEMIS_V6.foundation`) → HTML shell injection → `dist/index.html` + SHA-256 manifest
- `test/` — 17 tests via `node:test` against the *built* bundle (pipeline-authentic)

## Run
    npm install
    npm test        # builds, then runs all suites
    npm run build   # dist/index.html + dist/manifest.json

## Normative conventions encoded here
- CCW winding vs outward reference before any attribute extraction.
- Vertex angle α_i belongs to the START vertex of directed edge e_i.
- Reflection transforms: L'/B'/C'_i = X_{n-1-i}; A'_i = A_{(n-i) mod n}.
  (Naive zipped-tuple reversal is demonstrated to FAIL in the test suite.)
- Signatures serialize integer quanta only; tolerance change ⇒ signature change.

## Empirical findings from the integration suite (real v3.6.1 geometry)
1. F2/F3 full spheres: legacy and canonical partitions coincide (2 and 3
   families) — the sorted-multiset defect is LATENT on high-symmetry full
   spheres and is triggered by lower-symmetry inputs (proven by the synthetic
   multiset-collision fixture, which the legacy key merges and the canonical
   signature separates). The fix is prophylactic for cut domes, clipped
   panels, and future non-Goldberg families.
2. mirror(separate) = mirror(merge) family counts at F2/F3: class-I GP(f,0)
   duals are achiral at these frequencies; no chiral pairs exist to split.
3. Best-fit-plane deviation on the F2 worst hexagon equals the Newell-plane
   baseline to 5 decimal places (0.49517 cm): for near-symmetric warp the
   Newell plane already is the least-squares plane. The fixture baseline
   therefore remains valid as-is; best-fit is kept as the canonical metric
   for the general case with the invariant bestFit ≤ Newell tested.
