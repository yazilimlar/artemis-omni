// P2.1: model-derived quantity records for DUCT_LF, FITTING_EA, HANGER_EA, SEISMIC_BRACE_EA.
// SINGLE SOURCE: every value is a sum over buildSpools().perRun (the P2 spool engine output). Nothing is
// recomputed from geometry, spacing tables or lab fields here. Records sit BESIDE qtyFor()/estimate(): the
// lab's qtyFor() has no key for these drivers and no ACTS row uses them, so none of them reaches estimate()
// (status derived-not-in-estimate). Each record is an E0 evidence envelope (products/evidence/), kind "spool".
// QTO level L2 (parametric): the layout is schematic (calibrated to qtyFor() targets), spool max length,
// hanger and brace spacings are representative/unverified, so no value is promoted to L3 (geometry-derived).
// L2 is used because the values are parametric sums over a calibrated model; they remain ineligible for promotion to L3 until P3b constrains the layout and the footprint overrun is zero.
import { contentHashOf, revisionIdOf } from "../evidence/evidence.mjs";

export const LABEL = "representative — verify against submittals, not sealed design";
export const QTO_LEVEL = "L2";

/** driver -> how it is read from one perRun summary. `scope` filters runs; `of` returns an integer. */
export const DRIVERS = Object.freeze({
  DUCT_LF: { unit: "LF", activityId: "A04", scale: 100, scope: p => p.driver === "DUCT_LBS", of: p => p.lengthCu, from: "perRun[driver=DUCT_LBS].lengthCu / 100" },
  FITTING_EA: { unit: "EA", activityId: "A04+A05", scale: 1, scope: () => true, of: p => Object.values(p.fittings).reduce((a, n) => a + n, 0), from: "perRun[*].fittings (sum of type counts)" },
  HANGER_EA: { unit: "EA", activityId: "A03", scale: 1, scope: () => true, of: p => p.hangers, from: "perRun[*].hangers" },
  SEISMIC_BRACE_EA: { unit: "EA", activityId: "A03", scale: 1, scope: () => true, of: p => p.braces.transverse + p.braces.longitudinal, from: "perRun[*].braces.transverse + longitudinal" },
});

/** Returns four E0 envelopes (one per driver) for one scenario. Pure and deterministic; does not mutate inputs. */
export function deriveQuantityRecords(spoolResult, scenario) {
  return Object.entries(DRIVERS).map(([driver, d]) => {
    const runs = spoolResult.perRun.filter(d.scope);
    const breakdown = runs.map(p => ({ runId: p.runId, productId: p.productId, activityId: p.activityId, valueUnits: d.of(p) }));
    const total = breakdown.reduce((a, b) => a + b.valueUnits, 0);
    const payload = {
      driver, unit: d.unit, value: total / d.scale, valueUnits: total, unitsPerValue: d.scale, scenario, qtoLevel: QTO_LEVEL,
      qtoLevelBasis: "parametric: schematic layout calibrated to qtyFor() targets; spacings and max spool lengths representative/unverified",
      activityId: d.activityId, derivedFrom: d.from, breakdown,
      inQtyFor: false, inEstimate: false, status: "derived-not-in-estimate", label: LABEL, dataMode: "synthetic",
    };
    const logicalId = `QTY-${driver}@${scenario}`, contentHash = contentHashOf(payload);
    return {
      kind: "spool", logicalId, revisionId: revisionIdOf(logicalId, 1, contentHash), contentHash, revision: 1, supersedes: null,
      basis: "inferred", verification: "unverified", verificationScope: null, verificationMethod: null, verificationBasis: null,
      verifiedRevisionId: null, artifactRefs: [], verificationTimestamp: null,
      validity: "current", workflow: "draft", approval: "pending", approvedRevisionId: null,
      complianceClaim: "NONE", ruleBindings: [], clash: null, payload,
    };
  });
}
