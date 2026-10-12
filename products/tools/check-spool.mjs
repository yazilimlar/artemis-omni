// Usage: node products/tools/check-spool.mjs   (exit 1 on any failure)
// P2 gate, live against the lab via the vm bridge (lab file never modified). Run it AFTER
// products/tools/check.mjs (the P1 gate, unchanged). Proves, per fixture scenario:
//   run targets == qtyFor() share; sum(segment LF) and sum(spool LF) == run LF; sum(spool weight)
//   == apportioned product weight; spool length <= max; tags unique; every segment is clash-ready;
//   exclusions have reasons; attachSpoolsToEstimate() leaves qty/cost untouched.
import assert from "node:assert/strict";
import { loadLab } from "./lab-bridge.mjs";
import { readJson, apportion } from "./util.mjs";
import { generateRoutes } from "../routing/route-generator.mjs";
import { buildSpools, attachSpoolsToEstimate, DERIVED_QUANTITIES } from "../spool/spool-engine.mjs";

const products = readJson("../hvac/hvac-products.sample.json");
const fx = readJson("../hvac/fixtures/allocation.fixture.json");
const drivers = readJson("../schema/qty-drivers.json");
const std = readJson("../spool/standards.json");

let failures = 0, warnings = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const warn = m => { warnings++; console.log("  WARN  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (cond, okMsg, failMsg) => (cond ? ok(okMsg) : fail(failMsg ?? okMsg));
const sum = (a, f) => a.reduce((x, y) => x + f(y), 0);

console.log("== standards labelling");
for (const [k, v] of Object.entries({ maxSpoolLenFt: std.maxSpoolLenFt, sheetWeight: std.sheetWeightLbPerSf })) check(["unverified", "secondary", "manufacturer"].includes(v.confidence), `${k} confidence '${v.confidence}'`);
check(std.maxSpoolLenFt.confidence === "unverified" && !/SMACNA table/i.test(std.maxSpoolLenFt.source.replace(/NO SMACNA TABLE CITED/, "")), "max spool length is declared unverified and cites no SMACNA table");
for (const q of Object.values(DERIVED_QUANTITIES)) check(q.driver in drivers.HVAC.proposed, `derived quantity driver ${q.driver} is registered as proposed`);

const totals = {};
for (const [name, sc] of Object.entries(fx.scenarios)) {
  console.log(`== scenario '${name}'`);
  const lab = loadLab(sc.overrides);
  const model = generateRoutes({ g: lab.g, products, qtyFor: lab.qtyFor, allocations: fx.allocations, std });
  const result = buildSpools(model, std, products);
  const E = lab.estimateFull();
  const byProd = Object.fromEntries(products.map(p => [p.id, p]));
  console.log(`  geometry: condSF=${lab.g.condSF} floors=${lab.g.floors} zones=${lab.g.zones} risers=${lab.g.risers} plenumFt=${lab.g.plenumFt} insulThk=${lab.g.insulThk}`);

  // 1. routed set = spoolable registered rows with routable drivers; everything else excluded with reason
  const routedIds = model.runs.map(r => r.productId).sort();
  const expectRouted = products.filter(p => p.spoolable).map(p => p.id).sort();
  check(JSON.stringify(routedIds) === JSON.stringify(expectRouted), `routed rows = spoolable rows: ${routedIds.join(", ")}`);
  const exIds = result.exclusions.map(e => e.productId);
  check(products.every(p => routedIds.includes(p.id) || exIds.includes(p.id)), `every non-routed row has an exclusion (${exIds.length})`);
  check(result.exclusions.every(e => e.reason && e.reason.length > 10), "every exclusion states a reason");

  for (const run of model.runs) {
    const p = byProd[run.productId];
    const tag = `${run.productId} [${run.driver}]`;
    // 2. run references P1 row + qtyFor driver
    check(p && p.spoolable && p.driverStatus === "registered" && run.driver === p.qtyDriver && (run.ductType ?? run.pipeType) === (p.ductType ?? p.pipeType), `${tag} references its P1 row (type, driver)`);
    const share = apportion(lab.qtyFor(run.driver), fx.allocations[run.driver])[run.productId];
    check(run.target.value === share, `${tag} target ${run.target.unit} ${run.target.value} == qtyFor('${run.driver}')=${lab.qtyFor(run.driver)} x fixture share`);
    const erow = E.rows.find(r => r.id === p.activityId);
    check(erow.driver === run.driver && erow.qty === lab.qtyFor(run.driver), `${tag} estimate()[${erow.id}].qty ${erow.qty} == qtyFor`);
    const sp = result.spools.filter(s => s.runId === run.id);
    const segLfCu = sum(run.segments, s => s.lengthCu), spLfCu = sum(sp, s => s.lengthCu);
    check(segLfCu === spLfCu, `${tag} sum(spool LF) ${spLfCu / 100} == sum(segment LF) ${segLfCu / 100} (exact, 0.01 ft units)`);
    const spW = sum(sp, s => s.weightLb);
    if (run.driverUnit === "LF") {
      check(segLfCu === run.target.value * 100, `${tag} spool LF ${spLfCu / 100} == qtyFor run LF ${run.target.value} (tolerance 0)`);
      check(spW === run.expectedWeightLb, `${tag} spool weight ${spW} lb == apportioned derived weight ${run.expectedWeightLb} lb (tolerance 0; weight is LF x representative lb/ft)`);
    } else {
      const routeW = sum(run.segments, s => s.lengthFt * s.weightRateLbPerFt);
      const tol = 0.005 * sum(run.segments, s => s.weightRateLbPerFt);
      check(Math.abs(routeW - run.target.value) <= tol, `${tag} route weight ${routeW.toFixed(1)} lb within declared rounding +/-${tol.toFixed(1)} lb of qtyFor share ${run.target.value} lb`);
      check(spW === run.target.value, `${tag} spool weight ${spW} lb == apportioned DUCT_LBS ${run.target.value} lb (tolerance 0)`);
      check(run.derivedLf && run.derivedLf.status === "derived-not-in-estimate" && Math.abs(run.derivedLf.value - spLfCu / 100) < 1e-9, `${tag} derived LF ${run.derivedLf?.value} carries status derived-not-in-estimate`);
    }
    // 3. spool rules
    const maxCu = std.maxSpoolLenFt.values[run.ductType ?? run.pipeType] * 100;
    check(sp.every(s => s.lengthCu > 0 && s.lengthCu <= maxCu), `${tag} ${sp.length} spools all <= ${maxCu / 100} ft`);
    check(sp.every(s => s.weightLb >= 0 && Number.isInteger(s.weightLb)), `${tag} spool weights are non-negative integers`);
    // 4. fittings: all scheduled exactly once
    check(sum(sp, s => s.fittings.length) === run.fittings.length && new Set(sp.flatMap(s => s.fittings.map(f => f.id))).size === run.fittings.length, `${tag} ${run.fittings.length} fittings each scheduled on exactly one spool`);
    // 5. clash-ready geometry
    const readyOk = run.segments.every(s => s.extents?.min && s.extents?.max && s.clearanceClass && s.clashClass && s.extents.min.x <= Math.min(s.a.x, s.b.x) && s.extents.max.x >= Math.max(s.a.x, s.b.x) && s.extents.min.y <= Math.min(s.a.y, s.b.y) && s.extents.max.y >= Math.max(s.a.y, s.b.y) && s.extents.min.z <= Math.min(s.a.z, s.b.z) && s.extents.max.z >= Math.max(s.a.z, s.b.z));
    check(readyOk, `${tag} ${run.segments.length} segments carry extents, clearanceClass, clashClass; extents enclose centerline`);
    const lenOk = run.segments.every(s => Math.abs(Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y, s.b.z - s.a.z) - s.lengthFt) <= 0.02);
    check(lenOk, `${tag} coordinates agree with segment length (+/-0.02 ft)`);
    const c = run.calibration;
    console.log(`        calibration: branches/zone=${c.branchesPerZone} horizontalScale=${c.horizontalScale} footprint=${c.footprintFt.x}x${c.footprintFt.y} ft`);
    if (c.horizontalScale < 0.5 || c.horizontalScale > 2) warn(`${tag} calibration ${c.horizontalScale} outside [0.5, 2]: layout rule does not fit this quantity`);
    // clashReady gate (P3 guard): a model may only claim `clashReady` once its layout is constrained
    // to the footprint. The flag does not exist yet (always undefined), so this cannot fire today.
    if (model.clashReady && c.maxFootprintOverrunFt > 0) fail(`${tag} clashReady is set but segments overrun the footprint by up to ${c.maxFootprintOverrunFt} ft`);
    if (c.maxFootprintOverrunFt > 0) warn(`${tag} segments overrun the generated footprint by up to ${c.maxFootprintOverrunFt} ft (parametric layout is schematic)`);
  }
  const tags = result.spools.map(s => s.tag);
  check(new Set(tags).size === tags.length && tags.every(t => /^[DH]-SPOOL-\d{3,}$/.test(t)), `${tags.length} spool tags unique and match [DH]-SPOOL-NNN`);

  // 6. attach is display-only
  const before = JSON.stringify(E);
  const E2 = attachSpoolsToEstimate(JSON.parse(before), result);
  const stripped = JSON.parse(JSON.stringify(E2)); delete stripped.spoolTable; stripped.rows.forEach(r => delete r.spool);
  check(JSON.stringify(stripped) === before, "attachSpoolsToEstimate() changes only .spool/.spoolTable (qty, cost, all other fields identical)");
  const a04 = E2.rows.find(r => r.id === "A04"), a05 = E2.rows.find(r => r.id === "A05");
  check(a04.spool && a05.spool && a04.spool.pipelineQty.qty === lab.qtyFor("DUCT_LBS") && a05.spool.pipelineQty.qty === lab.qtyFor("PIPE_LF"), "A04/A05 .spool carry the pipeline qty they reconcile to");
  check(a04.spool.status.hangers === "derived-not-in-estimate" && a04.spool.status.lengthFt === "derived-not-in-estimate", "derived fields are labelled derived-not-in-estimate");

  const t = { spools: result.spools.length, lfFt: sum(result.perRun, r => r.lengthFt), weightLb: sum(result.perRun, r => r.weightLb), hangers: sum(result.perRun, r => r.hangers), fittings: sum(model.runs, r => r.fittings.length), qtyForDuctLbs: lab.qtyFor("DUCT_LBS"), qtyForPipeLf: lab.qtyFor("PIPE_LF") };
  totals[name] = t;
  console.log(`  totals: ${JSON.stringify(t)}`);
  for (const e of result.exclusions) console.log(`        excluded ${e.productId}: ${e.reason}`);
}
console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
