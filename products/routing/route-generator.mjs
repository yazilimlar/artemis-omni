// Parametric route model. NOT parsed from the 3D scene: geometry is generated from the lab's
// pipeline outputs (geometry() fields + qtyFor() driver totals) and a layout rule.
//   skeleton per run:  risers (one segment per floor, vertical)  ->  per floor/zone trunk (along X)
//                      -> branches (along +/-Y) off the trunk.
// Horizontal lengths are CALIBRATED so the run hits its qtyFor() target exactly:
//   LF drivers (PIPE_LF)   : sum of run LF == product share of qtyFor(driver) (integer feet, exact)
//   LB drivers (DUCT_LBS)  : sum of run (LF x lb/ft) ~= product share of qtyFor(DUCT_LBS) (declared tol)
// Units: coordinates in feet (2 dp), lengths in centi-feet (integer "cu") so sums are exact.
import { apportion, r2 } from "../tools/util.mjs";

export const LABEL = "representative — verify against submittals, not sealed design";
const ROUTABLE_DRIVERS = { DUCT_LBS: "LB", PIPE_LF: "LF" };
const GAUGE_LB_SF = std => std.sheetWeightLbPerSf.values;

/** lb per linear foot for one product / segment kind (rate used for weight). */
export function sectionOf(productId, kind, std) {
  const sec = std.sections[productId];
  if (!sec) throw new Error(`no section data for ${productId}`);
  const s = sec.byKind[kind];
  if (productId.startsWith("HVAC-DUCT-RECT")) {
    const per = 2 * (s.wIn + s.hIn) / 12;
    return { ...s, widthIn: s.wIn, heightIn: s.hIn, lbPerFt: per * GAUGE_LB_SF(std)[sec.gauge], gauge: sec.gauge };
  }
  if (productId.startsWith("HVAC-DUCT-SPIRAL")) {
    const per = Math.PI * s.dIn / 12;
    return { ...s, widthIn: s.dIn, heightIn: s.dIn, lbPerFt: per * GAUGE_LB_SF(std)[sec.gauge], gauge: sec.gauge };
  }
  return { ...s, widthIn: s.odIn, heightIn: s.odIn, lbPerFt: s.lbPerFt };
}

function extentsOf(a, b, sec, insulIn) {
  const hw = (sec.widthIn / 2 + insulIn) / 12, hh = (sec.heightIn / 2 + insulIn) / 12;
  const ax = [Math.abs(b.x - a.x), Math.abs(b.y - a.y), Math.abs(b.z - a.z)];
  const dir = ax.indexOf(Math.max(...ax)); // 0 X, 1 Y, 2 Z
  const d = dir === 0 ? [0, hw, hh] : dir === 1 ? [hw, 0, hh] : [Math.max(hw, hh), Math.max(hw, hh), 0];
  return {
    min: { x: r2(Math.min(a.x, b.x) - d[0]), y: r2(Math.min(a.y, b.y) - d[1]), z: r2(Math.min(a.z, b.z) - d[2]) },
    max: { x: r2(Math.max(a.x, b.x) + d[0]), y: r2(Math.max(a.y, b.y) + d[1]), z: r2(Math.max(a.z, b.z) + d[2]) },
    includesInsulationIn: insulIn
  };
}

/**
 * @param {object} o
 * @param {object} o.g           lab geometry() result
 * @param {Array}  o.products    P1 rows
 * @param {object} o.qtyFor      (driver)=>number, the lab's real qtyFor bound to g
 * @param {object} o.allocations fixture allocations {driver:{productId:weight|OTHER}}  (SYNTHETIC)
 * @param {object} o.std         products/spool/standards.json
 */
export function generateRoutes({ g, products, qtyFor, allocations, std }) {
  const H = std.layout.floorToFloorFt.value, aspect = std.layout.planAspectXtoY.value;
  const floors = g.floors, zones = g.zones, risers = Math.max(1, g.risers), plenum = g.plenumFt, insulIn = g.insulThk;
  const A = g.condSF / floors, X = Math.sqrt(A * aspect), Y = A / X, zoneLen = X / zones;
  const exclusions = [], runs = [];

  for (const p of products) {
    const unit = ROUTABLE_DRIVERS[p.qtyDriver];
    if (!p.spoolable) { exclusions.push({ productId: p.id, reason: `spoolable:false in P1 catalog (${p.category}${p.pipeType ? "/" + p.pipeType : ""})` }); continue; }
    if (p.driverStatus !== "registered" || !unit) { exclusions.push({ productId: p.id, reason: `driver ${p.qtyDriver} is not a routable run driver (DUCT_LBS, PIPE_LF)` }); continue; }
    const alloc = allocations[p.qtyDriver];
    if (!alloc || !(p.id in alloc)) { exclusions.push({ productId: p.id, reason: `no fixture allocation for ${p.qtyDriver}` }); continue; }
    const driverTotal = qtyFor(p.qtyDriver);
    const target = apportion(driverTotal, alloc)[p.id];
    const rate = k => (unit === "LB" ? sectionOf(p.id, k, std).lbPerFt : 1);
    const riserQ = risers * floors * H * rate("riser");

    // pick branches-per-zone so the calibration factor is closest to 1
    let best = null;
    const [bLo, bHi] = std.layout.branchesPerZoneSearch;
    for (let b = bLo; b <= bHi; b++) {
      const Qh = floors * zones * (zoneLen * rate("trunk") + 2 * b * (Y / 2) * rate("branch"));
      const s = (target - riserQ) / Qh;
      if (s > 0 && (!best || Math.abs(Math.log(s)) < Math.abs(Math.log(best.s)))) best = { b, s };
    }
    if (!best) { exclusions.push({ productId: p.id, reason: "target quantity smaller than riser quantity; cannot calibrate" }); continue; }
    const { b, s } = best;

    // integer horizontal lengths (cu = 0.01 ft)
    const horiz = []; // nominal lengths in route order, per floor/zone: trunk then 2b branches
    for (let f = 1; f <= floors; f++) for (let z = 1; z <= zones; z++) {
      horiz.push({ kind: "trunk", f, z, nominal: zoneLen });
      for (let k = 0; k < 2 * b; k++) horiz.push({ kind: "branch", f, z, k, nominal: Y / 2 });
    }
    let cu;
    if (unit === "LF") cu = apportion(Math.round((target - risers * floors * H) * 100), horiz.map(h => h.nominal));
    else cu = horiz.map(h => Math.round(h.nominal * s * 100));
    horiz.forEach((h, i) => { h.cu = cu[i]; });

    const runId = `RUN-${p.id}`, segs = [], fittings = [];
    const mk = (id, kind, f, z, a, bpt, lenCu, extra = {}) => {
      const sec = sectionOf(p.id, kind, std);
      segs.push({
        id, runId, productId: p.id, kind, floor: f, zone: z, a, b: bpt, lengthCu: lenCu, lengthFt: lenCu / 100,
        section: { widthIn: sec.widthIn, heightIn: sec.heightIn, ...(sec.nps ? { nps: sec.nps } : {}), ...(sec.gauge ? { gauge: sec.gauge } : {}) },
        weightRateLbPerFt: sec.lbPerFt, extents: extentsOf(a, bpt, sec, insulIn),
        clearanceClass: kind === "riser" ? "SHAFT" : "PLENUM_STANDARD", clashClass: p.clashClass, ...extra
      });
    };
    const trunkStart = {}; // `${f}:${z}` -> {x,len}
    const hs = [];
    let hi = 0;
    // horizontal first (to know trunk start x), then risers; final order = risers, then horizontal
    for (let f = 1; f <= floors; f++) {
      const zEl = f * H - plenum / 2;
      let x = 0;
      for (let z = 1; z <= zones; z++) {
        const t = horiz[hi++];
        const tid = `${p.id}:T:f${f}z${z}`;
        trunkStart[`${f}:${z}`] = x;
        hs.push({ id: tid, kind: "trunk", f, z, a: { x: r2(x), y: r2(Y / 2), z: r2(zEl) }, b: { x: r2(x + t.cu / 100), y: r2(Y / 2), z: r2(zEl) }, cu: t.cu });
        for (let k = 0; k < 2 * b; k++) {
          const br = horiz[hi++];
          const kk = Math.floor(k / 2), north = k % 2 === 0;
          const stationCu = Math.round((kk + 0.5) / b * t.cu);
          const bx = x + stationCu / 100;
          hs.push({ id: `${p.id}:B:f${f}z${z}k${k}`, kind: "branch", f, z, a: { x: r2(bx), y: r2(Y / 2), z: r2(zEl) }, b: { x: r2(bx), y: r2(north ? Y / 2 + br.cu / 100 : Y / 2 - br.cu / 100), z: r2(zEl) }, cu: br.cu });
          fittings.push({ id: `${p.id}:F:tee-f${f}z${z}k${k}`, type: "tee_reducing", hostSegmentId: tid, stationCu, joins: `${p.id}:B:f${f}z${z}k${k}` });
        }
        x += t.cu / 100;
      }
    }
    for (let r = 0; r < risers; r++) {
      const zk = Math.floor(r * zones / risers) + 1;
      for (let f = 1; f <= floors; f++) {
        const rid = `${p.id}:R:r${r + 1}f${f}`;
        mk(rid, "riser", f, zk, { x: r2(trunkStart[`${f}:${zk}`]), y: r2(Y / 2), z: r2((f - 1) * H) }, { x: r2(trunkStart[`${f}:${zk}`]), y: r2(Y / 2), z: r2(f * H) }, Math.round(H * 100), { riserIndex: r + 1 });
        fittings.push({ id: `${p.id}:F:tee-r${r + 1}f${f}`, type: "tee", hostSegmentId: rid, stationCu: Math.round((H - plenum / 2) * 100), joins: `${p.id}:T:f${f}z${zk}` });
        if (f === floors) fittings.push({ id: `${p.id}:F:elb-r${r + 1}`, type: "elbow_90", hostSegmentId: rid, stationCu: Math.round(H * 100), joins: null });
      }
    }
    hs.forEach(h => mk(h.id, h.kind, h.f, h.z, h.a, h.b, h.cu));
    // route order: risers first (already pushed), then horizontals in generation order (mk pushed in that order)

    const totalCu = segs.reduce((a, x) => a + x.lengthCu, 0);
    const weightExact = segs.reduce((a, x) => a + x.lengthCu / 100 * x.weightRateLbPerFt, 0);
    const maxXY = Math.max(...segs.map(x => Math.max(x.extents.max.x - X, x.extents.max.y - Y, -x.extents.min.y, 0)));
    runs.push({
      id: runId, productId: p.id, ductType: p.ductType ?? null, pipeType: p.pipeType ?? null,
      activityId: p.activityId, driver: p.qtyDriver, driverUnit: unit,
      target: { unit, value: target, driverTotal, source: `qtyFor('${p.qtyDriver}') x fixture allocation share (SYNTHETIC)` },
      derivedLf: unit === "LB" ? { value: totalCu / 100, status: "derived-not-in-estimate", proposedDriver: "DUCT_LF" } : null,
      expectedWeightLb: unit === "LB" ? target : Math.round(weightExact),
      weightBasis: unit === "LB" ? "DUCT_LBS apportioned (pipeline quantity)" : "derived: LF x representative lb/ft (no weight driver in qtyFor)",
      calibration: { branchesPerZone: b, horizontalScale: Number(s.toFixed(4)), nominalZoneLenFt: r2(zoneLen), footprintFt: { x: r2(X), y: r2(Y) }, maxFootprintOverrunFt: r2(maxXY) },
      segments: segs, fittings
    });
  }
  return {
    label: LABEL,
    dataMode: "sample/synthetic - run targets come from qtyFor() x SYNTHETIC fixture shares; layout is a parametric rule",
    layout: { floors, zones, risers, floorToFloorFt: H, plenumFt: plenum, insulationIn: insulIn, footprintFt: { x: r2(X), y: r2(Y) } },
    runs, exclusions
  };
}
