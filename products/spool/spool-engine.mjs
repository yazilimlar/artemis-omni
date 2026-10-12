// Spool engine: breaks route runs into fabrication spools and schedules fittings, weight,
// hangers and seismic braces per spool. Inputs are P1 spoolable rows (via the route model);
// non-spoolable rows come back in `exclusions` with a reason. Pure functions, no I/O.
import { apportion } from "../tools/util.mjs";

export const LABEL = "representative — verify against submittals, not sealed design";
const M_TO_FT = 3.28084;
const typeKey = run => run.ductType ?? run.pipeType;           // rectangular_galvanized | spiral_round | hydronic
const prefixOf = run => (run.ductType ? "D" : "H");             // D-SPOOL-042 pattern; H = hydronic

/** Quantities this module derives that are NOT in qtyFor()/estimate() yet (proposed drivers). */
export const DERIVED_QUANTITIES = {
  lf_duct: { driver: "DUCT_LF", status: "derived-not-in-estimate" },
  fittings: { driver: "FITTING_EA", status: "derived-not-in-estimate" },
  hangers: { driver: "HANGER_EA", status: "derived-not-in-estimate" },
  braces: { driver: "SEISMIC_BRACE_EA", status: "derived-not-in-estimate" }
};

function hangerSpacingFt(run, seg, std) {
  if (seg.kind === "riser") return null; // one riser clamp per floor segment
  if (run.ductType) return std.hanger.ductHorizontalMaxSpacingFt.value;
  const m = std.hanger.pipeHorizontalMaxSpacingM.values[String(seg.section.nps)];
  if (m == null) throw new Error(`no hanger spacing for NPS ${seg.section.nps}`);
  return m * M_TO_FT;
}

export function buildSpools(model, std, products) {
  const spools = [], byRun = {}, counters = { D: 0, H: 0 };
  const exclusions = [...model.exclusions];
  const routed = new Set(model.runs.map(r => r.productId));
  for (const p of products) if (!routed.has(p.id) && !exclusions.some(e => e.productId === p.id)) exclusions.push({ productId: p.id, reason: "not routed" });

  for (const run of model.runs) {
    const maxCu = std.maxSpoolLenFt.values[typeKey(run)] * 100;
    const seismic = run.ductType ? std.seismic.ductSpacingFt : std.seismic.pipeSpacingFt;
    const runSpools = [];
    let runOffset = 0;
    const segSpools = new Map();
    for (const seg of run.segments) {
      const n = Math.ceil(seg.lengthCu / maxCu);
      const lens = apportion(seg.lengthCu, Array(n).fill(1));
      let off = 0;
      const list = lens.map((cu, i) => {
        const sp = {
          tag: `${prefixOf(run)}-SPOOL-${String(++counters[prefixOf(run)]).padStart(3, "0")}`,
          runId: run.id, productId: run.productId, ductType: run.ductType, pipeType: run.pipeType,
          segmentId: seg.id, segmentKind: seg.kind, floor: seg.floor, zone: seg.zone,
          indexInSegment: i + 1, ofSegment: n, lengthCu: cu, lengthFt: cu / 100,
          segStartCu: off, segEndCu: off + cu, runStartCu: runOffset + off, runEndCu: runOffset + off + cu,
          rateLbPerFt: seg.weightRateLbPerFt, fittings: [], hangers: 0, braces: { transverse: 0, longitudinal: 0 },
          clearanceClass: seg.clearanceClass, clashClass: seg.clashClass
        };
        off += cu; return sp;
      });
      segSpools.set(seg.id, list);
      runSpools.push(...list);
      runOffset += seg.lengthCu;
    }
    const pick = (list, stationCu, last) => list.find(s => stationCu >= s.segStartCu && (stationCu < s.segEndCu || (last && stationCu <= s.segEndCu))) ?? list[list.length - 1];
    // fittings -> spool holding the station on the host segment
    for (const f of run.fittings) {
      const list = segSpools.get(f.hostSegmentId);
      pick(list, f.stationCu, true).fittings.push({ id: f.id, type: f.type });
    }
    // hangers: per segment
    for (const seg of run.segments) {
      const list = segSpools.get(seg.id), sp = hangerSpacingFt(run, seg, std);
      if (sp == null) { pick(list, Math.floor(seg.lengthCu / 2)).hangers += 1; continue; }
      const n = Math.max(1, Math.ceil(seg.lengthFt / sp));
      for (let i = 0; i < n; i++) pick(list, Math.floor((i + 0.5) * seg.lengthCu / n)).hangers += 1;
    }
    // seismic braces: continuous run stationing
    const runCu = runOffset;
    const pickRun = st => runSpools.find(s => st >= s.runStartCu && st < s.runEndCu);
    for (const [key, ft] of [["transverse", seismic.transverse], ["longitudinal", seismic.longitudinal]])
      for (let st = ft * 100; st < runCu; st += ft * 100) pickRun(st).braces[key] += 1;
    // weights: apportion the run's expected weight across spools by length x rate
    const w = apportion(run.expectedWeightLb, runSpools.map(s => s.lengthCu * s.rateLbPerFt));
    runSpools.forEach((s, i) => { s.weightLb = w[i]; });
    spools.push(...runSpools);
    byRun[run.id] = runSpools;
  }

  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const perRun = model.runs.map(run => {
    const sp = byRun[run.id];
    return {
      runId: run.id, productId: run.productId, activityId: run.activityId, driver: run.driver,
      spoolCount: sp.length, lengthCu: sum(sp, s => s.lengthCu), lengthFt: sum(sp, s => s.lengthCu) / 100,
      weightLb: sum(sp, s => s.weightLb), hangers: sum(sp, s => s.hangers),
      braces: { transverse: sum(sp, s => s.braces.transverse), longitudinal: sum(sp, s => s.braces.longitudinal) },
      fittings: sp.flatMap(s => s.fittings).reduce((m, f) => (m[f.type] = (m[f.type] || 0) + 1, m), {})
    };
  });
  return {
    label: LABEL, dataMode: model.dataMode, derivedQuantities: DERIVED_QUANTITIES,
    standards: { maxSpoolLenFt: std.maxSpoolLenFt, hanger: std.hanger, seismic: std.seismic, citations: std.citations },
    spools, perRun, exclusions
  };
}

/**
 * Attach spool summaries to an estimate() result. DISPLAY-ONLY: adds `spool` to the matching
 * activity rows and `spoolTable` to the estimate; never changes qty, cost or any other field.
 * Per-row summary carries the pipeline quantity it reconciles to and flags derived fields.
 */
export function attachSpoolsToEstimate(E, result) {
  for (const r of E.rows) {
    const runs = result.perRun.filter(p => p.activityId === r.id);
    if (!runs.length) continue;
    r.spool = {
      label: LABEL,
      spoolCount: runs.reduce((a, p) => a + p.spoolCount, 0),
      lengthFt: runs.reduce((a, p) => a + p.lengthFt, 0),
      weightLb: runs.reduce((a, p) => a + p.weightLb, 0),
      hangers: runs.reduce((a, p) => a + p.hangers, 0),
      pipelineQty: { driver: r.driver, qty: r.qty, unit: r.unit },
      status: { lengthFt: r.driver === "DUCT_LBS" ? "derived-not-in-estimate" : "from qtyFor() share", hangers: "derived-not-in-estimate", fittings: "derived-not-in-estimate", braces: "derived-not-in-estimate" }
    };
  }
  E.spoolTable = { label: LABEL, count: result.spools.length, perRun: result.perRun };
  return E;
}
