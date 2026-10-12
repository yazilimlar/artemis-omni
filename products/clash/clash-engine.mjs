// Clash detection engine (P3). PURE and DETERMINISTIC: no I/O, no lab imports, no clock, no RNG.
// Same input (in any object/connection order) => byte-identical output.
//
// GEOMETRY RESOLUTION: level L0 = axis-aligned bounding box (AABB) broad-phase only.
//   EXACT_BOX         object really is an axis-aligned box in world space (rect duct, beam, column,
//                     equipment box; rotations only by multiples of 90 degrees). Overlap of two
//                     EXACT_BOX objects is a verified intersection OF THE SUPPLIED BOX GEOMETRY.
//   CONSERVATIVE_AABB round / non-box / off-axis-rotated objects: the AABB over-covers the solid,
//                     so any overlap involving one is only a POTENTIAL intersection. It is never
//                     promoted to a verified solid intersection. Narrow-phase is NOT implemented.
// Invalid or incomplete geometry is rejected and reported; no dimension is ever assumed.
import crypto from "node:crypto";

export const ENGINE_VERSION = "p3-l0-1";
export const LABEL = "SYNTHETIC engineering validation - not a validated project finding";
const UNIT_TO_FT = { ft: 1, in: 1 / 12, m: 3.280839895013123, mm: 0.003280839895013123 };
const FACES = { "+x": [0, 1], "-x": [0, -1], "+y": [1, 1], "-y": [1, -1], "+z": [2, 1], "-z": [2, -1] };
const R6 = x => (Math.round(x * 1e6) / 1e6) + 0;
const R6v = v => v.map(R6);
const fin = x => typeof x === "number" && Number.isFinite(x);
const vec3 = v => Array.isArray(v) && v.length === 3 && v.every(fin);

/** Key-sorted JSON: the canonical form used for determinism / order-independence comparison. */
export function canonical(x) {
  if (Array.isArray(x)) return "[" + x.map(canonical).join(",") + "]";
  if (x && typeof x === "object") return "{" + Object.keys(x).sort().map(k => JSON.stringify(k) + ":" + canonical(x[k])).join(",") + "}";
  return JSON.stringify(x);
}
const stableId = s => "CL-" + crypto.createHash("sha256").update(s).digest("hex").slice(0, 10).toUpperCase();

// ---------- validation ----------
export function validateEnvelope(input, rules) {
  const e = [];
  const bad = (code, message) => e.push({ code, message });
  if (!input || typeof input !== "object") return [{ code: "NO_INPUT", message: "input must be an object" }];
  if (typeof input.dataMode !== "string" || !input.dataMode) bad("MISSING_DATA_MODE", "dataMode is required (e.g. 'synthetic-fixture')");
  if (!(input.units in UNIT_TO_FT)) bad("UNKNOWN_UNITS", `units must be one of ${Object.keys(UNIT_TO_FT).join(", ")}`);
  const cs = input.coordinateSystem;
  if (!cs || cs.handedness !== "right" || !cs.axes || cs.axes.x !== "east" || cs.axes.y !== "north" || cs.axes.z !== "up" || typeof cs.datum !== "string" || !cs.datum)
    bad("BAD_COORDINATE_SYSTEM", "require right-handed, x=east, y=north, z=up, and a named datum");
  const fl = input.floors;
  if (!fl || typeof fl !== "object" || !Object.keys(fl).length) bad("MISSING_FLOORS", "floors with zMin/zMax elevation bands are required");
  else for (const [k, b] of Object.entries(fl)) if (!b || !fin(b.zMin) || !fin(b.zMax) || !(b.zMin < b.zMax)) bad("BAD_FLOOR_BAND", `floor ${k} needs finite zMin < zMax`);
  const t = input.tolerance;
  if (!t || !["overlapFt", "touchFt", "nearMissFt", "minExtentFt"].every(k => fin(t[k]) && t[k] > 0)) bad("BAD_TOLERANCE", "tolerance.{overlapFt,touchFt,nearMissFt,minExtentFt} must be explicit positive numbers");
  else if (!(t.touchFt <= t.overlapFt && t.overlapFt < t.nearMissFt)) bad("TOLERANCE_ORDER", "require touchFt <= overlapFt < nearMissFt");
  if (!Array.isArray(input.objects)) bad("MISSING_OBJECTS", "objects must be an array");
  if (input.connections !== undefined && !Array.isArray(input.connections)) bad("BAD_CONNECTIONS", "connections must be an array when present");
  void rules;
  return e.sort((a, b) => a.code.localeCompare(b.code));
}

function rotXY(p, deg) { // exact for multiples of 90
  const d = ((deg % 360) + 360) % 360;
  if (d === 0) return [p[0], p[1]];
  if (d === 90) return [-p[1], p[0]];
  if (d === 180) return [-p[0], -p[1]];
  if (d === 270) return [p[1], -p[0]];
  const r = d * Math.PI / 180; return [p[0] * Math.cos(r) - p[1] * Math.sin(r), p[0] * Math.sin(r) + p[1] * Math.cos(r)];
}

function normalizeObject(o, ctx) {
  const rej = (code, message) => ({ reject: { id: typeof o?.id === "string" ? o.id : null, code, message } });
  if (!o || typeof o !== "object") return rej("NOT_AN_OBJECT", "object entry is not an object");
  if (typeof o.id !== "string" || !o.id) return rej("MISSING_ID", "id is required");
  if (!(o.kind in ctx.rules.kinds)) return rej("UNKNOWN_KIND", `kind '${o.kind}' not in registry`);
  if (!o.bbox || !vec3(o.bbox.min) || !vec3(o.bbox.max)) return rej("INCOMPLETE_OR_NON_FINITE_BBOX", "bbox.min/max must be finite [x,y,z]");
  if (typeof o.exactBox !== "boolean") return rej("MISSING_EXACTNESS_FLAG", "exactBox must be declared true/false; not assumed");
  if (o.floor === undefined || !(String(o.floor) in ctx.floors)) return rej("UNKNOWN_FLOOR", `floor '${o.floor}' is not declared`);
  const k = ctx.k;
  let mn = o.bbox.min.map(v => v * k), mx = o.bbox.max.map(v => v * k);
  if ([0, 1, 2].some(i => !(mn[i] < mx[i]))) return rej("INVERTED_OR_DEGENERATE_BBOX", "bbox.min must be < bbox.max on every axis");
  let rot = 0;
  if (o.transform !== undefined) {
    const tr = o.transform;
    if (!tr || !vec3(tr.translate) || !fin(tr.rotateZDeg ?? 0)) return rej("BAD_TRANSFORM", "transform needs finite translate[3] and rotateZDeg");
    rot = tr.rotateZDeg ?? 0;
    const cs = [[mn[0], mn[1]], [mx[0], mn[1]], [mx[0], mx[1]], [mn[0], mx[1]]].map(p => rotXY(p, rot));
    const tz = tr.translate.map(v => v * k);
    mn = [Math.min(...cs.map(c => c[0])) + tz[0], Math.min(...cs.map(c => c[1])) + tz[1], mn[2] + tz[2]];
    mx = [Math.max(...cs.map(c => c[0])) + tz[0], Math.max(...cs.map(c => c[1])) + tz[1], mx[2] + tz[2]];
  }
  if ([0, 1, 2].some(i => mx[i] - mn[i] < ctx.T.minExtent)) return rej("EXTENT_BELOW_MINIMUM", `an extent is below tolerance.minExtentFt`);
  const ins = o.insulationIn === undefined ? 0 : o.insulationIn;
  if (!fin(ins) || ins < 0) return rej("BAD_INSULATION", "insulationIn must be a finite number >= 0");
  const faces = o.serviceFaces === undefined ? [] : o.serviceFaces;
  if (!Array.isArray(faces) || faces.some(f => !(f in FACES))) return rej("BAD_SERVICE_FACES", "serviceFaces must be a subset of +x,-x,+y,-y,+z,-z");
  const band = ctx.floors[String(o.floor)], zlo = band.zMin - ctx.T.overlap, zhi = band.zMax + ctx.T.overlap;
  if (o.spansFloors === true) { if (mn[2] < ctx.zAll[0] - ctx.T.overlap || mx[2] > ctx.zAll[1] + ctx.T.overlap) return rej("ELEVATION_REF_MISMATCH", "spansFloors object lies outside all floor bands"); }
  else if (mn[2] < zlo || mx[2] > zhi) return rej("ELEVATION_REF_MISMATCH", `z-range is outside the declared floor ${o.floor} band`);
  const exact = o.exactBox === true && Math.abs(((rot % 90) + 90) % 90) < 1e-9;
  return { obj: { id: o.id, kind: o.kind, system: o.system ?? null, floor: String(o.floor), zone: o.zone ?? null, min: mn.map(R6), max: mx.map(R6), res: exact ? "EXACT_BOX" : "CONSERVATIVE_AABB", ins: ins / 12, insulationIn: ins, faces: [...faces].sort(), ref: o.ref ?? null } };
}

// ---------- geometry helpers ----------
const overlaps = (a, b) => [0, 1, 2].map(i => Math.min(a.max[i], b.max[i]) - Math.max(a.min[i], b.min[i]));
const gapOf = ov => Math.hypot(...ov.map(v => Math.max(0, -v)));
const allPos = ov => ov.every(v => v > 0);
const grow = (o, d) => ({ min: o.min.map(v => v - d), max: o.max.map(v => v + d) });
const overlapBox = (a, b) => ({ min: R6v([0, 1, 2].map(i => Math.max(a.min[i], b.min[i]))), max: R6v([0, 1, 2].map(i => Math.min(a.max[i], b.max[i]))) });

function sevOf(rule, pen) {
  const s = rule.severity;
  if (s.type === "flat") return s.severity;
  return s.bands.find(b => pen >= b.minPenetrationFt).severity;
}

function runDetectionCore(input, rules) {
  const base = { label: LABEL, engineVersion: ENGINE_VERSION, complianceClaim: "NONE", units: "ft", findingStatus: input && input.dataMode === "synthetic-fixture" ? "SYNTHETIC_ENGINEERING_VALIDATION" : "UNVALIDATED_NOT_A_PROJECT_FINDING",
    geometryResolution: { level: "L0-AABB-broadphase", narrowPhase: "not implemented", exactBoxOverlap: "verified for the supplied box geometry only", conservativeOverlap: "potential only; never verified solid" } };
  const envErr = validateEnvelope(input, rules);
  if (envErr.length) return { ...base, status: "REJECTED_INPUT", envelopeErrors: envErr, clashes: [], observations: [], exempted: [], rejectedObjects: [], rejectedConnections: [], warnings: [] };

  const k = UNIT_TO_FT[input.units];
  // tolerance.*Ft are ALWAYS feet; coordinates/floors are converted from input.units to feet.
  const T = { overlap: input.tolerance.overlapFt, touch: input.tolerance.touchFt, nearMiss: input.tolerance.nearMissFt, minExtent: input.tolerance.minExtentFt };
  const floors = Object.fromEntries(Object.entries(input.floors).map(([f, b]) => [f, { zMin: b.zMin * k, zMax: b.zMax * k }]));
  const zAll = [Math.min(...Object.values(floors).map(b => b.zMin)), Math.max(...Object.values(floors).map(b => b.zMax))];
  const ctx = { k, T, floors, zAll, rules };

  // duplicate ids reject every copy (order-independent)
  const idCount = {};
  for (const o of input.objects) if (o && typeof o.id === "string") idCount[o.id] = (idCount[o.id] || 0) + 1;
  const rejAgg = {}, objs = [];
  const addRej = r => { const key = `${r.id}|${r.code}`; (rejAgg[key] ||= { id: r.id, code: r.code, message: r.message, count: 0 }).count++; };
  for (const o of input.objects) {
    if (o && typeof o.id === "string" && idCount[o.id] > 1) { addRej({ id: o.id, code: "DUPLICATE_ID", message: "id used by more than one object; all copies rejected" }); continue; }
    const r = normalizeObject(o, ctx); r.reject ? addRej(r.reject) : objs.push(r.obj);
  }
  objs.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const byId = Object.fromEntries(objs.map(o => [o.id, o]));

  // connections
  const conns = {}, rejC = {}, warnings = [];
  const connCount = {};
  const pk = (a, b) => (a < b ? `${a}~${b}` : `${b}~${a}`);
  for (const c of input.connections || []) if (c && typeof c.a === "string" && typeof c.b === "string") connCount[pk(c.a, c.b)] = (connCount[pk(c.a, c.b)] || 0) + 1;
  const addRejC = (c, code, message) => { const key = `${c?.a}|${c?.b}|${code}`; (rejC[key] ||= { a: c?.a ?? null, b: c?.b ?? null, code, message, count: 0 }).count++; };
  for (const c of input.connections || []) {
    if (!c || !(c.a in byId) || !(c.b in byId) || c.a === c.b) { addRejC(c, "UNKNOWN_OR_SELF_OBJECT", "connection must reference two distinct accepted objects"); continue; }
    if (connCount[pk(c.a, c.b)] > 1) { addRejC(c, "DUPLICATE_CONNECTION", "more than one connection for the pair; all copies rejected"); continue; }
    if (!["joint", "penetration"].includes(c.type)) { addRejC(c, "BAD_CONNECTION_TYPE", "type must be joint|penetration"); continue; }
    if (!Array.isArray(c.exemptRules) || !c.exemptRules.length || c.exemptRules.some(r => !(r in rules.rules) || rules.rules[r].status !== "active")) { addRejC(c, "BAD_EXEMPT_RULES", "exemptRules must be a non-empty list of active rule ids"); continue; }
    if (!fin(c.allowedOverlapFt) || c.allowedOverlapFt < 0 || typeof c.reason !== "string" || !c.reason) { addRejC(c, "MISSING_ALLOWANCE_OR_REASON", "allowedOverlapFt >= 0 and a reason are required"); continue; }
    conns[pk(c.a, c.b)] = { ...c, allowed: c.allowedOverlapFt };
  }

  const clashes = [], observations = [], exempted = [];
  const objRes = (...os) => Object.fromEntries(os.sort((x, y) => (x.id < y.id ? -1 : 1)).map(o => [o.id, o.res]));
  const floorsHit = box => {
    const f = Object.entries(floors).filter(([, b]) => box.max[2] > b.zMin + 1e-9 && box.min[2] < b.zMax - 1e-9).map(([n]) => n).sort();
    return f;
  };
  const tolEv = { overlapFt: R6(T.overlap), touchFt: R6(T.touch), nearMissFt: R6(T.nearMiss) };
  const refs = os => {
    const rs = os.map(o => o.ref).filter(Boolean);
    const u = key => [...new Set(rs.flatMap(r => (Array.isArray(r[key]) ? r[key] : r[key] ? [r[key]] : [])))].sort();
    return { objectIds: os.map(o => o.id).sort(), runIds: u("runId"), segmentIds: u("segmentId"), spoolTags: u("spoolTags") };
  };
  const mtv = (a, b, ov, dist) => { // move the non-fixed object (later id if both movable) along the least-overlap axis
    const fixedA = rules.kinds[a.kind].fixed, fixedB = rules.kinds[b.kind].fixed;
    if (fixedA && fixedB) return { action: "ESCALATE_FIXED_ELEMENT_REVIEW", moveObjectId: null, axis: null, direction: null, distanceFt: null };
    const mover = fixedA ? b : fixedB ? a : (a.id > b.id ? a : b), other = mover === a ? b : a;
    const ax = ov.indexOf(Math.min(...ov));
    const c = o => (o.min[ax] + o.max[ax]) / 2;
    return { action: "ADJUST_ROUTE_OFFSET", moveObjectId: mover.id, axis: "xyz"[ax], direction: c(mover) >= c(other) ? 1 : -1, distanceFt: R6(dist) };
  };
  const resolution = (kind, a, b, ov, dist, aff) => ({
    ...(kind === "POTENTIAL" ? { action: "NARROW_PHASE_REVIEW", moveObjectId: null, axis: null, direction: null, distanceFt: null, indicative: mtv(a, b, ov, dist) } : mtv(a, b, ov, dist)),
    basis: "least-overlap-axis translation; geometric suggestion only, not a design", affected: aff,
    mutation: "NONE", executes: false, requiresRegeneration: true, regenerationPath: ["edit route parameters", "generateRoutes", "buildSpools", "qtyFor", "estimate", "diff against original by stable IDs"]
  });
  const emit = (rule, ruleId, type, objsIn, verified, extra, pen, ov, a, b, dist) => {
    const ids = objsIn.map(o => o.id).sort();
    const id = stableId(`${ruleId}|${type}|${extra.idKey ?? ids.join(",")}`);
    const { idKey, evidence, ...rest } = extra; void idKey;
    const floorsList = floorsHit(evidence.overlapBox);
    const zones = [...new Set(objsIn.map(o => o.zone).filter(z => z !== null))].sort();
    clashes.push({
      id, type, ruleId, ruleCategory: rule.category, severity: sevOf(rule, pen), verification: verified ? "VERIFIED_BOX_GEOMETRY" : "UNVERIFIED_BROAD_PHASE",
      objects: ids, floors: floorsList.length ? floorsList : [...new Set(objsIn.map(o => o.floor))].sort(), zones, ...rest,
      evidence: { ...evidence, penetrationFt: R6(pen), objectResolution: objRes(...objsIn), toleranceFt: tolEv, geometryResolutionLevel: "L0-AABB-broadphase" },
      proposedResolution: resolution(type === "POTENTIAL_INTERSECTION" ? "POTENTIAL" : "X", a, b, ov, dist, refs(objsIn)),
      findingStatus: base.findingStatus, complianceClaim: "NONE"
    });
  };

  for (let i = 0; i < objs.length; i++) for (let j = i + 1; j < objs.length; j++) {
    const a = objs[i], b = objs[j], conn = conns[pk(a.id, b.id)];
    const ov = overlaps(a, b), gap = gapOf(ov), pen = allPos(ov) ? Math.min(...ov) : 0;
    const bothExact = a.res === "EXACT_BOX" && b.res === "EXACT_BOX";
    let handled = false;
    if (allPos(ov) && pen > T.overlap) {
      handled = true;
      const ruleId = bothExact ? "R-GEO-001" : "R-GEO-002", rule = rules.rules[ruleId];
      const type = rule.emits, ob = overlapBox(a, b);
      if (conn && conn.exemptRules.includes(ruleId) && pen <= conn.allowed + 1e-12) {
        exempted.push({ objects: [a.id, b.id], ruleId, connectionType: conn.type, penetrationFt: R6(pen), allowedOverlapFt: R6(conn.allowed), reason: conn.reason, basis: conn.basis ?? null });
      } else {
        const ev = { overlapBox: ob, overlapPerAxisFt: R6v(ov), ...(conn && conn.exemptRules.includes(ruleId) ? { exemptionExceeded: { allowedOverlapFt: R6(conn.allowed), connectionType: conn.type } } : {}) };
        emit(rule, ruleId, type, [a, b], bothExact, { evidence: ev }, pen, ov, a, b, pen + T.touch);
      }
    } else if (a.ins > 0 || b.ins > 0) {
      const ea = grow(a, a.ins), eb = grow(b, b.ins), oe = overlaps(ea, eb), pe = allPos(oe) ? Math.min(...oe) : 0;
      if (allPos(oe) && pe > T.overlap) {
        handled = true;
        const rule = rules.rules["R-INS-001"], ob = overlapBox(ea, eb);
        if (conn && conn.exemptRules.includes("R-INS-001") && pe <= conn.allowed + 1e-12) exempted.push({ objects: [a.id, b.id], ruleId: "R-INS-001", connectionType: conn.type, penetrationFt: R6(pe), allowedOverlapFt: R6(conn.allowed), reason: conn.reason, basis: conn.basis ?? null });
        else emit(rule, "R-INS-001", rule.emits, [a, b], bothExact, { evidence: { overlapBox: ob, overlapPerAxisFt: R6v(oe), coreGapFt: R6(gap), insulationInByObject: { [a.id]: a.insulationIn, [b.id]: b.insulationIn } } }, pe, oe, a, b, pe + T.touch);
      }
    }
    if (!handled) {
      const ruleId = gap <= T.touch ? "R-GEO-004" : gap <= T.nearMiss ? "R-GEO-003" : null;
      if (ruleId) {
        const rule = rules.rules[ruleId];
        observations.push({ type: rule.emits, ruleId, severity: sevOf(rule, 0), objects: [a.id, b.id], gapFt: R6(gap), floors: [...new Set([a.floor, b.floor])].sort(), zones: [...new Set([a.zone, b.zone].filter(z => z !== null))].sort(), findingStatus: base.findingStatus });
      }
      if (conn && gap > T.touch) warnings.push({ code: "CONNECTION_NOT_CONTACTING", objects: [a.id, b.id], gapFt: R6(gap) });
    }
  }

  // service-clearance zones
  const mnt = rules.rules["R-MNT-001"], clr = mnt.parameters.serviceClearanceFt.value;
  for (const o of objs) for (const face of o.faces) {
    const [ax, sg] = FACES[face];
    const zone = { min: [...o.min], max: [...o.max] };
    if (sg > 0) { zone.min[ax] = o.max[ax]; zone.max[ax] = o.max[ax] + clr; } else { zone.max[ax] = o.min[ax]; zone.min[ax] = o.min[ax] - clr; }
    for (const x of objs) {
      if (x.id === o.id) continue;
      const ov = overlaps(x, zone);
      if (!(allPos(ov) && Math.min(...ov) > T.overlap)) continue;
      const conn = conns[pk(o.id, x.id)], pen = Math.min(...ov);
      const depth = sg > 0 ? zone.max[ax] - x.min[ax] : x.max[ax] - zone.min[ax];
      if (conn && conn.exemptRules.includes("R-MNT-001")) { exempted.push({ objects: [o.id, x.id].sort(), ruleId: "R-MNT-001", connectionType: conn.type, penetrationFt: R6(pen), allowedOverlapFt: R6(conn.allowed), reason: conn.reason, basis: conn.basis ?? null, face }); continue; }
      const ob = overlapBox(x, zone), verified = o.res === "EXACT_BOX" && x.res === "EXACT_BOX";
      const ids = [o.id, x.id].sort();
      const id = stableId(`R-MNT-001|CLEARANCE_VIOLATION|${o.id}>${x.id}|${face}`);
      const dist = depth;
      clashes.push({
        id, type: "CLEARANCE_VIOLATION", ruleId: "R-MNT-001", ruleCategory: mnt.category, severity: sevOf(mnt, pen), verification: verified ? "VERIFIED_BOX_GEOMETRY" : "UNVERIFIED_BROAD_PHASE",
        objects: ids, floors: floorsHit(ob).length ? floorsHit(ob) : [...new Set([o.floor, x.floor])].sort(), zones: [...new Set([o.zone, x.zone].filter(z => z !== null))].sort(),
        serviceObjectId: o.id, obstructionObjectId: x.id, serviceFace: face,
        evidence: { serviceZone: { min: R6v(zone.min), max: R6v(zone.max) }, serviceClearanceFt: clr, clearanceProvenance: "assumption (illustrative)", overlapBox: ob, overlapPerAxisFt: R6v(ov), penetrationFt: R6(pen), encroachmentDepthFt: R6(depth), objectResolution: objRes(o, x), toleranceFt: tolEv, geometryResolutionLevel: "L0-AABB-broadphase" },
        proposedResolution: {
          action: "ADJUST_ROUTE_OFFSET", moveObjectId: rules.kinds[x.kind].fixed ? null : x.id, axis: "xyz"[ax], direction: sg, distanceFt: R6(dist),
          basis: "move the obstruction out of the service zone along the face normal; geometric suggestion only, not a design", affected: refs([o, x]),
          mutation: "NONE", executes: false, requiresRegeneration: true, regenerationPath: ["edit route parameters", "generateRoutes", "buildSpools", "qtyFor", "estimate", "diff against original by stable IDs"]
        },
        findingStatus: base.findingStatus, complianceClaim: "NONE"
      });
    }
  }

  const byKey = (x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0);
  clashes.sort(byKey);
  const cmpObs = (x, y) => canonical(x) < canonical(y) ? -1 : 1;
  observations.sort(cmpObs); exempted.sort(cmpObs); warnings.sort(cmpObs);
  const ids = clashes.map(c => c.id);
  if (new Set(ids).size !== ids.length) throw new Error("clash id collision");
  return {
    ...base, status: "OK", envelopeErrors: [], clashes, observations, exempted,
    rejectedObjects: Object.values(rejAgg).sort(cmpObs), rejectedConnections: Object.values(rejC).sort(cmpObs), warnings,
    counts: { objectsAccepted: objs.length, objectsRejected: Object.values(rejAgg).reduce((a, r) => a + r.count, 0), clashes: clashes.length, observations: observations.length, exempted: exempted.length }
  };
}

/** Validation-harness entry (no readiness gate). Used to assess a fixture's own validity. */
export const _runDetectionForValidation = runDetectionCore;

/**
 * Public entry. Refuses to run unless the input declares readiness.clashReady === true.
 * Lab schematic routes are clashReady=false, so they are refused here.
 */
export function detectClashes(input, rules) {
  if (!input || !input.readiness || input.readiness.clashReady !== true)
    return { label: LABEL, engineVersion: ENGINE_VERSION, status: "REFUSED_NOT_CLASH_READY", complianceClaim: "NONE", reason: input?.readiness?.reason ?? "readiness.clashReady is not true", clashes: [], observations: [], exempted: [], rejectedObjects: [], rejectedConnections: [], warnings: [], envelopeErrors: [] };
  return runDetectionCore(input, rules);
}

/** Lab route models stay not-ready until a representative-model gate (P3b) says otherwise. */
export function labRouteReadiness(model) {
  const over = Math.max(0, ...(model?.runs ?? []).map(r => r.calibration?.maxFootprintOverrunFt ?? Infinity));
  if (model?.clashReady === true && over === 0) return { clashReady: true, reason: "model declares clashReady and layout is within footprint" };
  return { clashReady: false, reason: `schematic layout (footprint overrun up to ${over} ft; clashReady flag ${model?.clashReady ?? "absent"}); representative-model validation (P3b) not done` };
}
