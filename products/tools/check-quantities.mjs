// Usage: node products/tools/check-quantities.mjs   (exit 1 on any failure)
// P2.1 gate. For the lab model (both fixture scenarios) proves that DUCT_LF / FITTING_EA / HANGER_EA /
// SEISMIC_BRACE_EA each appear EXACTLY ONCE: as one E0 quantity record whose value equals an independent
// aggregation of the routing/spool model, and in NO estimate()/qtyFor() path. Then injects each kind of
// second path into the audit and requires it to be flagged (the audit must fail loudly, not pass by default).
// Run after check.mjs, check-spool.mjs, check-clash.mjs, check-evidence.mjs.
// SURFACE INVENTORY: the exactly-once claim covers exactly five surfaces: (1) quantity records, (2) qtyFor source,
// (3) estimate rows, (4) attachSpoolsToEstimate output string, (5) spoolTable numeric totals. Any new display or
// aggregation path MUST be added to both the audit surface list and the fault-injection set, or the claim no longer holds.
import { loadLab } from "./lab-bridge.mjs";
import { readJson } from "./util.mjs";
import { generateRoutes } from "../routing/route-generator.mjs";
import { buildSpools, attachSpoolsToEstimate, DERIVED_QUANTITIES } from "../spool/spool-engine.mjs";
import { deriveQuantityRecords, DRIVERS, QTO_LEVEL } from "../quantities/model-quantities.mjs";
import { validateEnvelope, validateChain, canonical } from "../evidence/evidence.mjs";

const products = readJson("../hvac/hvac-products.sample.json");
const fx = readJson("../hvac/fixtures/allocation.fixture.json");
const drivers = readJson("../schema/qty-drivers.json");
const std = readJson("../spool/standards.json");

let failures = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, okMsg, failMsg) => (c ? ok(okMsg) : fail(failMsg ?? okMsg));
const sum = (a, f) => a.reduce((x, y) => x + f(y), 0);
const NAMES = Object.keys(DRIVERS);
const clone = o => JSON.parse(JSON.stringify(o));
const deepFreeze = o => { Object.values(o).forEach(v => v && typeof v === "object" && deepFreeze(v)); return Object.freeze(o); };

/** Single-path audit. Returns violation strings; [] = each driver is reachable by exactly one path. */
function auditSinglePath({ qtyForSource, estimateRows, records }) {
  const v = [];
  for (const n of NAMES) {
    if (new RegExp(`\\b${n}\\b`).test(qtyForSource)) v.push(`${n} is a key in lab qtyFor() (second path)`);
    if (estimateRows.some(r => r.driver === n)) v.push(`${n} drives an estimate() row (second path)`);
    const recs = records.filter(r => r.payload.driver === n);
    if (recs.length !== 1) v.push(`${n} has ${recs.length} quantity records (expected exactly 1)`);
  }
  for (const r of records) {
    const p = r.payload;
    if (p.inQtyFor !== false || p.inEstimate !== false) v.push(`${p.driver} record claims to be in qtyFor()/estimate()`);
    const ids = p.breakdown.map(b => b.runId);
    if (new Set(ids).size !== ids.length) v.push(`${p.driver} breakdown counts a run twice`);
    if (sum(p.breakdown, b => b.valueUnits) !== p.valueUnits) v.push(`${p.driver} breakdown does not sum to the record value`);
  }
  return v;
}

console.log("== registry");
check(same(NAMES.sort(), ["DUCT_LF", "FITTING_EA", "HANGER_EA", "SEISMIC_BRACE_EA"]), "module defines the four P2.1 drivers");
check(NAMES.every(n => drivers.HVAC.registered[n]?.modelDerived === true && drivers.HVAC.registered[n].source === "model-derived (spool/routing)" && !drivers.HVAC.proposed[n]), "all four are under registered with modelDerived: true and source 'model-derived (spool/routing)' (not proposed)");
check(NAMES.every(n => drivers.HVAC.registered[n].unit === DRIVERS[n].unit && drivers.HVAC.registered[n].inQtyFor === false && drivers.HVAC.registered[n].inEstimate === false && drivers.HVAC.registered[n].qtoLevel === QTO_LEVEL), "registry units, flags and qtoLevel agree with the module");
check(same(Object.values(DERIVED_QUANTITIES).map(q => q.driver).sort(), NAMES.sort()), "spool engine DERIVED_QUANTITIES names the same four drivers");
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

for (const [name, sc] of Object.entries(fx.scenarios)) {
  console.log(`== scenario '${name}'`);
  const lab = loadLab(sc.overrides);
  const model = generateRoutes({ g: lab.g, products, qtyFor: lab.qtyFor, allocations: fx.allocations, std });
  const result = buildSpools(model, std, products);
  const E = lab.estimateFull();
  const records = deriveQuantityRecords(clone(result), name);
  const byDriver = Object.fromEntries(records.map(r => [r.payload.driver, r.payload]));

  // independent aggregation from the RAW model (spools[] and routes), not from perRun
  const ductSpools = result.spools.filter(s => s.ductType);
  const ductSegCu = sum(model.runs.filter(r => r.ductType), r => sum(r.segments, s => s.lengthCu));
  const raw = {
    DUCT_LF: sum(ductSpools, s => s.lengthCu),
    FITTING_EA: sum(result.spools, s => s.fittings.length),
    HANGER_EA: sum(result.spools, s => s.hangers),
    SEISMIC_BRACE_EA: sum(result.spools, s => s.braces.transverse + s.braces.longitudinal),
  };
  for (const n of NAMES) check(byDriver[n].valueUnits === raw[n], `${n} = ${byDriver[n].value} ${byDriver[n].unit} equals the independent spool-level aggregation (${raw[n]} units)`);
  check(byDriver.DUCT_LF.valueUnits === ductSegCu, `DUCT_LF equals the routing model's duct segment length (${ductSegCu / 100} ft): spool LF = segment LF`);
  check(byDriver.FITTING_EA.valueUnits === sum(model.runs, r => r.fittings.length), `FITTING_EA equals the routing model fitting count (${byDriver.FITTING_EA.valueUnits})`);
  check(byDriver.DUCT_LF.value === sum(result.perRun.filter(p => p.driver === "DUCT_LBS"), p => p.lengthFt), "DUCT_LF is a pure sum of perRun duct LF (single source)");

  // exactly once
  const viol = auditSinglePath({ qtyForSource: lab.qtyForSource, estimateRows: E.rows, records });
  check(viol.length === 0, "single-path audit: each driver reaches exactly one place (its quantity record); none in qtyFor() or estimate()", `second path found: ${viol.join("; ")}`);
  check(NAMES.every(n => !JSON.stringify(E).includes(`"${n}"`)), "estimate() output contains none of the four driver names");
  const a03 = E.rows.find(r => r.id === "A03"), a04 = E.rows.find(r => r.id === "A04");
  check(a03.driver === "DUCT_LBS" && a04.driver === "DUCT_LBS" && a03.qty === lab.qtyFor("DUCT_LBS") && a04.qty === lab.qtyFor("DUCT_LBS"), "A03 (hangers/bracing) and A04 stay priced on DUCT_LBS: HANGER_EA / SEISMIC_BRACE_EA / FITTING_EA add no cost line");

  // remaining surfaces: attachSpoolsToEstimate output and spoolTable agree with the records and add no second path
  const att = attachSpoolsToEstimate(clone(E), clone(result));
  const stripped = clone(att); delete stripped.spoolTable; stripped.rows.forEach(r => delete r.spool);
  check(canonical(stripped) === canonical(E), "attachSpoolsToEstimate() changes no estimate row quantity or cost (only .spool/.spoolTable added)");
  check(NAMES.every(n => !JSON.stringify(att).includes(`"${n}"`)), "attachSpoolsToEstimate output names none of the four drivers (no re-added driver line)");
  const T = att.spoolTable.perRun, rowSpool = att.rows.filter(r => r.spool);
  check(sum(T, p => p.hangers) === byDriver.HANGER_EA.valueUnits && sum(rowSpool, r => r.spool.hangers) === byDriver.HANGER_EA.valueUnits, "spoolTable and per-row .spool hangers each total HANGER_EA once");
  check(sum(T, p => Object.values(p.fittings).reduce((a, n) => a + n, 0)) === byDriver.FITTING_EA.valueUnits, "spoolTable fittings total FITTING_EA once");
  check(sum(T, p => p.braces.transverse + p.braces.longitudinal) === byDriver.SEISMIC_BRACE_EA.valueUnits, "spoolTable braces total SEISMIC_BRACE_EA once");
  check(Math.round(sum(T.filter(p => p.driver === "DUCT_LBS"), p => p.lengthCu)) === byDriver.DUCT_LF.valueUnits, "spoolTable duct length totals DUCT_LF once");

  // fault injection: the audit must flag every kind of second path
  const inject = (label, mut, expect) => {
    const ctx = { qtyForSource: lab.qtyForSource, estimateRows: clone(E.rows), records: clone(records) };
    mut(ctx);
    const got = auditSinglePath(ctx);
    check(got.some(g => g.includes(expect)), `injected fault caught: ${label}`, `audit MISSED injected fault: ${label}`);
  };
  inject("DUCT_LF added to qtyFor()", c => { c.qtyForSource += " DUCT_LF:g.ductLf"; }, "key in lab qtyFor()");
  inject("HANGER_EA drives an estimate row", c => { c.estimateRows.push({ id: "A03", driver: "HANGER_EA", qty: 1 }); }, "drives an estimate() row");
  inject("duplicate FITTING_EA record", c => { c.records.push(clone(c.records.find(r => r.payload.driver === "FITTING_EA"))); }, "2 quantity records");
  inject("SEISMIC_BRACE_EA record missing", c => { c.records = c.records.filter(r => r.payload.driver !== "SEISMIC_BRACE_EA"); }, "0 quantity records");
  inject("record claims to be in estimate()", c => { c.records[0].payload.inEstimate = true; }, "claims to be in qtyFor()/estimate()");
  inject("run counted twice in a breakdown", c => { const p = c.records.find(r => r.payload.driver === "HANGER_EA").payload; p.breakdown.push(clone(p.breakdown[0])); }, "counts a run twice");
  inject("breakdown re-added on top of the total", c => { const p = c.records.find(r => r.payload.driver === "DUCT_LF").payload; p.valueUnits += 100; }, "does not sum");

  // E0 evidence coverage
  const errs = records.flatMap(r => validateEnvelope(r).map(e => `${r.logicalId}: ${e.code} ${e.path}`));
  check(errs.length === 0, `${records.length} quantity records pass the E0 envelope validator (identity, five status dimensions, complianceClaim NONE)`, `evidence errors: ${errs.join("; ")}`);
  check(validateChain(clone(records)).length === 0, "record revision chains valid (revision 1, supersedes null)");
  check(records.every(r => r.complianceClaim === "NONE" && r.payload.qtoLevel === "L2" && /representative/.test(r.payload.label) && r.payload.dataMode === "synthetic"), "every record: complianceClaim NONE, QTO level L2, representative label, synthetic data mode");
  check(new Set(records.map(r => r.logicalId)).size === records.length && records.every(r => r.logicalId.endsWith("@" + name)), "logicalIds unique and scenario-scoped");

  // determinism / purity
  const again = deriveQuantityRecords(clone(result), name);
  check(canonical(again) === canonical(records), "records are byte-identical across runs (no clock, no RNG)");
  let threw = false; try { deriveQuantityRecords(deepFreeze(clone(result)), name); } catch { threw = true; }
  check(!threw, "derivation does not mutate the spool result (deep-frozen input accepted)");
  console.log(`  totals: ${NAMES.map(n => `${n}=${byDriver[n].value}${byDriver[n].unit}`).join(" ")}`);
}

console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), 0 warning(s)`);
process.exit(failures ? 1 : 0);
