// Usage: node products/tools/check.mjs   (exit 1 on any failure)
// 1. validates every product row against the schema + the LIVE lab ACTS table
// 2. reconciles fixture product sums = qtyFor() = estimate() rows[].qty, per scenario
import fs from "node:fs";
import { loadLab } from "./lab-bridge.mjs";

const J = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
const rows = J("../hvac/hvac-products.sample.json");
const drivers = J("../schema/qty-drivers.json");
const fx = J("../hvac/fixtures/allocation.fixture.json");

const LABEL = "representative — verify against submittals, not sealed design";
const CAT = ["duct","fitting_damper","terminal_unit","air_distribution","equipment","exhaust_fan","piping","controls"];
const DUCT = ["rectangular_galvanized","spiral_round","flexible"], PIPE = ["hydronic","refrigerant"];
const CLASH = ["DUCT_RIGID","DUCT_FLEX","PIPE_PRESSURE","PIPE_GRAVITY","EQUIPMENT_MAJOR","TERMINAL_DEVICE","RATED_PENETRATION","CONTROL_DEVICE","SPRINKLER_HEAD"];
const CONF = ["manufacturer","secondary","unverified"];
const PRICE_KEYS = /^(price|cost|unitCost|unitPrice|listPrice)$/i;

let failures = 0, warnings = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const warn = m => { warnings++; console.log("  WARN  " + m); };
const ok = m => console.log("  ok    " + m);

// ---- 1. schema validation against the live lab
console.log("== schema / row validation");
const lab0 = loadLab();
console.log(`  lab sha256 ${lab0.sha256.slice(0, 16)}…`);
const acts = Object.fromEntries(lab0.acts.map(a => [a.id, a]));
for (const [d, e] of Object.entries(drivers.HVAC.registered)) {
  const a = acts[e.activityId];
  if (!a || a.driver !== d || a.unit !== e.unit) fail(`driver registry drift: ${d} -> ${e.activityId} ${a ? `(lab: ${a.driver}/${a.unit})` : "(missing)"}`);
  else if (!Number.isFinite(lab0.qtyFor(d)) || lab0.qtyFor(d) <= 0) fail(`registered driver ${d} gives no quantity in qtyFor()`);
}
const ids = new Set();
for (const r of rows) {
  const t = r.id || "<no id>";
  const bad = m => fail(`${t}: ${m}`);
  if (ids.has(r.id)) bad("duplicate id"); ids.add(r.id);
  if (r.discipline !== "HVAC") bad("discipline must be HVAC for this file");
  if (!CAT.includes(r.category)) bad(`category ${r.category}`);
  if (!r.manufacturer || !r.model) bad("manufacturer/model required");
  if (r.label !== LABEL) bad("missing/incorrect representative label");
  if (r.ductType && r.pipeType) bad("ductType and pipeType are exclusive");
  if (r.ductType && !DUCT.includes(r.ductType)) bad(`ductType ${r.ductType}`);
  if (r.pipeType && !PIPE.includes(r.pipeType)) bad(`pipeType ${r.pipeType}`);
  if (r.category === "duct" && !r.ductType) bad("duct rows need ductType");
  if (r.category === "piping" && !r.pipeType) bad("piping rows need pipeType");
  if (!CLASH.includes(r.clashClass)) bad(`clashClass ${r.clashClass}`);
  if (typeof r.spoolable !== "boolean") bad("spoolable must be boolean");
  for (const k of Object.keys(r)) if (PRICE_KEYS.test(k)) bad(`price field '${k}' not allowed: cost attaches in estimate()`);
  const s = r.spec || {};
  if (!CONF.includes(s.confidence)) bad("spec.confidence");
  if (!s.fieldConfidence || !Array.isArray(s.sources)) bad("spec.fieldConfidence/sources required");
  const fcs = Object.values(s.fieldConfidence || {});
  if (fcs.some(c => !CONF.includes(c))) bad("bad fieldConfidence value");
  if (fcs.includes("unverified") && s.confidence !== "unverified") bad("row confidence must be 'unverified' when any field is");
  for (const k of Object.keys(s.fieldConfidence || {})) if (!(k in s)) { if (s.fieldConfidence[k] !== "unverified") bad(`fieldConfidence key '${k}' has no spec value`); }
  const a = acts[r.activityId];
  if (!a) { bad(`unknown activityId ${r.activityId}`); continue; }
  if (r.costCode !== `${a.code}-M`) bad(`costCode ${r.costCode} != ${a.code}-M`);
  if (r.spoolable && a.kind !== "linear") bad(`spoolable only valid on linear (chain) activities; ${a.id} is ${a.kind}`);
  const reg = drivers.HVAC.registered[r.qtyDriver], prop = drivers.HVAC.proposed[r.qtyDriver];
  if (r.driverStatus === "registered") {
    if (!reg) bad(`driver ${r.qtyDriver} not in registered registry`);
    else if (reg.activityId !== r.activityId) { 
      bad(`driver ${r.qtyDriver} belongs to ${reg.activityId}, row says ${r.activityId}`);
    } else if (r.unit !== reg.unit) bad(`unit ${r.unit} != driver unit ${reg.unit}`);
  } else if (r.driverStatus === "proposed") {
    if (!prop) bad(`driver ${r.qtyDriver} not in proposed registry`);
    if (reg) bad("proposed status but driver already registered");
  } else bad("driverStatus");
}
const cats = new Set(rows.map(r => r.category));
(rows.length === 10 ? ok : fail)(`${rows.length} rows (want 10)`);
(cats.size >= 5 ? ok : fail)(`${cats.size} categories (want >= 5): ${[...cats].join(", ")}`);
if (fx._label?.startsWith("SYNTHETIC")) ok("fixture labelled synthetic"); else fail("fixture must be labelled synthetic");

// ---- 2. reconciliation
function apportion(total, weights) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const raw = Object.entries(weights).map(([k, w]) => [k, total * w / sum]);
  const out = Object.fromEntries(raw.map(([k, v]) => [k, Math.floor(v)]));
  let left = total - Object.values(out).reduce((a, b) => a + b, 0);
  raw.map(([k, v]) => [k, v - Math.floor(v)]).sort((a, b) => b[1] - a[1]).forEach(([k]) => { if (left-- > 0) out[k]++; });
  return out;
}
for (const [name, sc] of Object.entries(fx.scenarios)) {
  console.log(`== reconcile: scenario '${name}'`);
  const lab = loadLab(sc.overrides);
  const est = lab.estimate();
  console.log(`  geometry: condSF=${lab.g.condSF} tonnage=${lab.g.tonnage} equipEA=${lab.g.equipEA} costF=${est.costF}`);
  for (const [driver, weights] of Object.entries(fx.allocations)) {
    const unit = drivers.HVAC.registered[driver].unit, tol = fx.rounding.toleranceByUnit[unit];
    const q = lab.qtyFor(driver);
    const alloc = apportion(q, weights);
    const sum = Object.values(alloc).reduce((a, b) => a + b, 0);
    const prodSum = Object.entries(alloc).filter(([k]) => k !== "OTHER").reduce((a, [, v]) => a + v, 0);
    const row = est.rows.find(r => r.driver === driver && r.id === drivers.HVAC.registered[driver].activityId);
    const line = `${driver.padEnd(10)} qtyFor=${q} fixtureSum=${sum} estimate[${row?.id}].qty=${row?.qty} catalogCoverage=${(100 * prodSum / q).toFixed(1)}%`;
    if (!row || Math.abs(row.qty - q) > fx.rounding.estimateQtyTolerance) fail(line + " (estimate != qtyFor)");
    else if (Math.abs(sum - q) > tol) fail(line + ` (exceeds tolerance ${tol} ${unit})`);
    else ok(line);
    for (const k of Object.keys(weights)) if (k !== "OTHER" && !ids.has(k)) fail(`fixture references unknown product ${k}`);
  }
  // correction (1): equipment cost attaches at equipEA x equipUnitCost on A07
  const a07 = est.rows.find(r => r.id === "A07");
  const expect = lab.g.equipEA * lab.g.equipUnitCost * est.costF;
  (Math.abs(a07.M - expect) < 1e-6 ? ok : fail)(`A07 material = equipEA(${lab.g.equipEA}) x equipUnitCost(${lab.g.equipUnitCost}) x costF = ${expect}`);
}
console.log("== unreconciled (proposed drivers, no pipeline quantity)");
for (const r of rows.filter(r => r.driverStatus === "proposed")) warn(`${r.id} -> ${r.qtyDriver} (${drivers.HVAC.proposed[r.qtyDriver]?.needs})`);
console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
