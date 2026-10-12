// Usage: node products/tools/check-clash.mjs   (exit 1 on any failure)
// P3 gate. Proves the clash CAPABILITY on controlled SYNTHETIC fixtures; it does not validate any
// building model. Run after check.mjs (P1) and check-spool.mjs (P2), both unmodified.
import fs from "node:fs";
import crypto from "node:crypto";
import { readJson } from "./util.mjs";
import { _runDetectionForValidation as core, detectClashes, labRouteReadiness, canonical, validateEnvelope } from "../clash/clash-engine.mjs";
import { planRevision, reconcileRevision } from "../clash/resolution.mjs";
import { loadLab } from "./lab-bridge.mjs";
import { generateRoutes } from "../routing/route-generator.mjs";
import { buildSpools } from "../spool/spool-engine.mjs";

const rules = readJson("../clash/rules.json");
const matrix = readJson("../clash/fixtures/matrix.json");
let failures = 0, warnings = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, m, f) => (c ? ok(m) : fail(f ?? m));
const eq = (a, b) => canonical(a) === canonical(b);
const clone = x => JSON.parse(JSON.stringify(x));

// ---------- rule registry provenance (AC-04) ----------
console.log("== rule registry");
const cats = new Set(["geometric", "maintenance", "fabrication", "code"]);
for (const [id, r] of Object.entries(rules.rules)) {
  const errs = [];
  if (!cats.has(r.category)) errs.push("category");
  if (!/^R-(GEO|MNT|INS|FAB|CODE)-\d{3}$/.test(id)) errs.push("id pattern");
  if (r.complianceClaim !== "NONE") errs.push("complianceClaim must be NONE");
  if (!r.source || typeof r.source.verified !== "boolean" || !("edition" in r.source) || !r.source.reference) errs.push("source{reference,edition,verified}");
  if (r.severity.type !== "none" && !r.severity.provenance) errs.push("severity provenance");
  for (const [pn, p] of Object.entries(r.parameters ?? {})) if (!p.provenance || (p.provenance === "assumption" && !/ILLUSTRATIVE|illustrative/.test(p.note ?? ""))) errs.push(`parameter ${pn} must carry provenance and an illustrative note`);
  if (r.category === "code") { if (r.status !== "not-implemented" || r.source.verified !== false || r.emits !== null) errs.push("code rules must be not-implemented stubs (verified:false, emits:null)"); }
  else if (r.status === "active" && r.source.kind === "assumption" && r.source.verified !== false) errs.push("assumption sources must be verified:false");
  check(!errs.length, `${id} [${r.category}] ${r.status}`, `${id}: ${errs.join("; ")}`);
}
check(["geometric", "maintenance", "fabrication", "code"].every(c => Object.values(rules.rules).some(r => r.category === c)), "all four rule categories present and separate");
const compliantText = JSON.stringify(rules).match(/complian(t|ce)[^"]*(SMACNA|IMC|NFPA)/i);
check(!compliantText, "no rule text claims SMACNA/IMC/NFPA compliance");

// ---------- helpers ----------
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function deepFreeze(o) { if (o && typeof o === "object" && !Object.isFrozen(o)) { Object.freeze(o); Object.values(o).forEach(deepFreeze); } return o; }
const pairKey = (a, b) => [a, b].sort().join("+");
const FORBIDDEN_KEYS = /qty|cost|price|weight|bom|evm|claim(?!s?$)|lengthCu|lengthFt|spoolCount|total/i;
function forbiddenKeys(x, path = "", out = []) {
  if (Array.isArray(x)) x.forEach((v, i) => forbiddenKeys(v, path, out));
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) { if (FORBIDDEN_KEYS.test(k) && k !== "complianceClaim") out.push(path + k); forbiddenKeys(v, path + k + ".", out); }
  return out;
}
const ID_RE = /^CL-[0-9A-F]{10}$/;

// ---------- fixture matrix (AC-03) ----------
const summary = [];
for (const c of matrix.cases) {
  console.log(`== ${c.id}: ${c.title}`);
  const fx = c.input, exp = c.expected, before = canonical(fx);
  let caseOk = true;
  const f = (m) => { caseOk = false; fail(m); };
  const t = (cond, m, fm) => (cond ? ok(m) : f(fm ?? m));

  const envErr = validateEnvelope(fx, rules);
  const R = core(fx, rules);
  t(R.status === exp.status, `status ${R.status}`, `status ${R.status} != expected ${exp.status}`);
  if (exp.status === "REJECTED_INPUT") {
    t(eq(R.envelopeErrors.map(e => e.code).sort(), [...exp.envelopeErrorCodes].sort()), `envelope errors ${R.envelopeErrors.map(e => e.code)}`, `envelope errors ${R.envelopeErrors.map(e => e.code)} != ${exp.envelopeErrorCodes}`);
    t(!R.clashes.length && !R.observations.length, "no results emitted for a rejected input");
  } else {
    t(envErr.length === 0, "envelope valid");
    // clashes: exact set equality + per-field
    const aKey = x => `${x.type}|${x.ruleId}|${x.objects.join("+")}`;
    const ak = R.clashes.map(aKey).sort(), ek = exp.clashes.map(aKey).sort();
    t(eq(ak, ek), `clash set = ${ek.length} expected [${ek.join("; ")}]`, `clash set mismatch\n         actual   ${JSON.stringify(ak)}\n         expected ${JSON.stringify(ek)}`);
    for (const e of exp.clashes) {
      const a = R.clashes.find(x => aKey(x) === aKey(e));
      if (!a) continue;
      const diffs = [];
      for (const k of ["severity", "verification"]) if (a[k] !== e[k]) diffs.push(`${k} ${a[k]} != ${e[k]}`);
      if (Math.abs(a.evidence.penetrationFt - e.penetrationFt) > 1e-9) diffs.push(`penetrationFt ${a.evidence.penetrationFt} != ${e.penetrationFt}`);
      if (!eq(a.floors, e.floors)) diffs.push(`floors ${a.floors} != ${e.floors}`);
      if (e.zones && !eq(a.zones, e.zones)) diffs.push(`zones ${a.zones} != ${e.zones}`);
      if (e.serviceFace && a.serviceFace !== e.serviceFace) diffs.push("serviceFace");
      if (e.encroachmentDepthFt !== undefined && Math.abs(a.evidence.encroachmentDepthFt - e.encroachmentDepthFt) > 1e-9) diffs.push("encroachmentDepthFt");
      if (e.exemptionExceeded && !a.evidence.exemptionExceeded) diffs.push("exemptionExceeded evidence missing");
      if (e.resolution) for (const [k, v] of Object.entries(e.resolution)) if (a.proposedResolution[k] !== v) diffs.push(`resolution.${k} ${a.proposedResolution[k]} != ${v}`);
      if (e.resolutionAction && a.proposedResolution.action !== e.resolutionAction) diffs.push("resolution action");
      t(!diffs.length, `${aKey(e)}: ${e.severity}, ${e.verification}, pen ${e.penetrationFt}`, `${aKey(e)}: ${diffs.join("; ")}`);
      // structural output contract
      const s = [];
      if (!ID_RE.test(a.id)) s.push("id format");
      if (!(a.ruleId in rules.rules) || a.ruleCategory !== rules.rules[a.ruleId].category) s.push("rule ref");
      if (a.complianceClaim !== "NONE") s.push("complianceClaim");
      if (!a.floors.length || !a.evidence.overlapBox || !a.evidence.objectResolution || !a.evidence.toleranceFt) s.push("floor/evidence");
      const pr = a.proposedResolution;
      if (pr.mutation !== "NONE" || pr.executes !== false || pr.requiresRegeneration !== true || !pr.affected.objectIds.length) s.push("resolution contract");
      if (!/SYNTHETIC/.test(a.findingStatus)) s.push("findingStatus");
      if (a.type === "HARD_INTERSECTION" && !Object.values(a.evidence.objectResolution).every(v => v === "EXACT_BOX")) s.push("HARD without both EXACT_BOX");
      if (!s.length) { /* quiet */ } else f(`${a.id} output contract: ${s.join(", ")}`);
    }
    // observations / exempted / rejected / warnings
    const sets = [
      ["observations", R.observations.map(x => `${x.type}|${x.objects.join("+")}|${x.gapFt}`), exp.observations.map(x => `${x.type}|${x.objects.slice().sort().join("+")}|${x.gapFt}`)],
      ["exempted", R.exempted.map(x => `${x.ruleId}|${x.objects.join("+")}|${x.penetrationFt}`), exp.exempted.map(x => `${x.ruleId}|${x.objects.slice().sort().join("+")}|${x.penetrationFt}`)],
      ["rejectedObjects", R.rejectedObjects.map(x => `${x.id}|${x.code}|${x.count}`), exp.rejectedObjects.map(x => `${x.id}|${x.code}|${x.count}`)],
      ["rejectedConnections", R.rejectedConnections.map(x => `${x.a}|${x.b}|${x.code}|${x.count}`), exp.rejectedConnections.map(x => `${x.a}|${x.b}|${x.code}|${x.count}`)],
      ["warnings", R.warnings.map(x => `${x.code}|${x.objects.join("+")}|${x.gapFt}`), exp.warnings.map(x => `${x.code}|${x.objects.slice().sort().join("+")}|${x.gapFt}`)]
    ];
    for (const [n, a, e] of sets) t(eq(a.slice().sort(), e.slice().sort()), `${n}: ${e.length}`, `${n} mismatch\n         actual   ${JSON.stringify(a.sort())}\n         expected ${JSON.stringify(e.sort())}`);
    // false-positive guards
    const clashPairs = new Set(R.clashes.map(x => pairKey(...x.objects)));
    for (const p of exp.absentPairs ?? []) t(!clashPairs.has(pairKey(p[0], p[1])), `no clash for ${p[0]} / ${p[1]}`, `false positive: clash for ${p[0]} / ${p[1]}`);
    for (const ty of exp.forbiddenTypes ?? []) t(!R.clashes.some(x => x.type === ty), `no ${ty} emitted`, `forbidden ${ty} emitted`);
    for (const fp of exp.forbiddenPairTypes ?? []) t(!R.clashes.some(x => x.type === fp.type && pairKey(...x.objects) === pairKey(...fp.objects)), `no ${fp.type} for ${fp.objects.join("/")}`, `forbidden ${fp.type} for ${fp.objects.join("/")}`);
    for (const p of exp.noObservationsForPairs ?? []) t(!R.observations.some(x => pairKey(...x.objects) === pairKey(...p)), `no observation duplicating clash ${p.join("/")}`, `observation duplicates clash ${p.join("/")}`);
    if (exp.expectNoClashes) t(R.clashes.length === 0, "no clashes");
    const fk = forbiddenKeys(R);
    t(fk.length === 0, "result carries no quantity/cost/BOM/EVM/claim fields", `forbidden keys in result: ${fk}`);
    t(R.clashes.every(x => x.findingStatus === "SYNTHETIC_ENGINEERING_VALIDATION") && R.complianceClaim === "NONE" && /SYNTHETIC/.test(R.label), "labelled synthetic engineering validation; complianceClaim NONE");
    t(new Set(R.clashes.map(x => x.id)).size === R.clashes.length, "clash IDs unique");
  }
  // determinism, order independence, immutability
  const R2 = core(clone(fx), rules);
  t(eq(R, R2), "deterministic: repeated run identical");
  let permOk = true;
  for (let seed = 1; seed <= 25 && permOk; seed++) {
    const rnd = mulberry32(seed * 7919);
    const p = clone(fx); p.objects = shuffle(p.objects, rnd); if (p.connections) p.connections = shuffle(p.connections, rnd);
    if (!eq(core(p, rules), R)) { permOk = false; f(`order-dependent result at shuffle seed ${seed}`); }
  }
  if (permOk) ok("order-independent: 25 shuffles of objects/connections give byte-identical output");
  try { core(deepFreeze(clone(fx)), rules); ok("accepts deep-frozen input (no mutation of inputs)"); } catch (e) { f("mutates its input: " + e.message); }
  t(canonical(fx) === before, "input unchanged after runs");

  // readiness is EARNED: computed from this fixture's own validation, then compared with the claim
  const computedReady = caseOk && exp.status === "OK" && envErr.length === 0;
  t(computedReady === c.claimsClashReady, `clashReady computed=${computedReady} matches fixture claim=${c.claimsClashReady}`, `clashReady computed=${computedReady} but fixture claims ${c.claimsClashReady}`);
  if (computedReady) {
    const gated = detectClashes({ ...clone(fx), readiness: { clashReady: true, reason: "fixture validation passed" } }, rules);
    t(eq(gated, core(clone(fx), rules)) || eq({ ...gated }, { ...R }), "public detectClashes() (readiness gate) returns the same result");
  } else if (exp.status !== "OK") {
    const gated = detectClashes({ ...clone(fx), readiness: { clashReady: true } }, rules);
    t(gated.status === "REJECTED_INPUT", "invalid envelope is rejected even when readiness is claimed");
  }
  summary.push({ id: c.id, clashReady: computedReady, clashes: R.clashes?.length ?? 0, observations: R.observations?.length ?? 0, exempted: R.exempted?.length ?? 0, rejected: R.rejectedObjects?.reduce((a, r) => a + r.count, 0) ?? 0 });
}

// ---------- readiness gate (AC-06) ----------
console.log("== readiness gate");
const notReady = detectClashes({ ...clone(matrix.cases[0].input) }, rules);
check(notReady.status === "REFUSED_NOT_CLASH_READY" && !notReady.clashes.length, "input without readiness is refused");
check(detectClashes({ ...clone(matrix.cases[0].input), readiness: { clashReady: false, reason: "x" } }, rules).status === "REFUSED_NOT_CLASH_READY", "readiness.clashReady=false is refused");

// ---------- AC-05: quantity invariants against the live lab ----------
console.log("== quantity invariants (live lab)");
const lab = loadLab();
const products = readJson("../hvac/hvac-products.sample.json");
const fixture = readJson("../hvac/fixtures/allocation.fixture.json");
const std = readJson("../spool/standards.json");
const model = generateRoutes({ g: lab.g, products, qtyFor: lab.qtyFor, allocations: fixture.allocations, std });
const spoolRes = buildSpools(model, std, products);
const E = lab.estimateFull();
console.log(`  lab sha256 ${lab.sha256.slice(0, 16)}…`);
const h = () => crypto.createHash("sha256").update(canonical({ model, spoolRes, E })).digest("hex");
const h0 = h();
const rr = labRouteReadiness(model);
check(rr.clashReady === false, `lab schematic routes remain clashReady=false (${rr.reason})`);
check(model.clashReady === undefined, "route model carries no clashReady flag (P2 gate assertion unchanged)");
check(detectClashes({ ...clone(matrix.cases[0].input), readiness: rr }, rules).status === "REFUSED_NOT_CLASH_READY", "engine refuses lab-route readiness");
const run0 = model.runs[0], tags = spoolRes.spools.filter(s => s.runId === run0.id).slice(0, 6).map(s => s.tag);
const linked = clone(matrix.cases[0].input);
linked.readiness = { clashReady: true, reason: "fixture validation passed" };
linked.objects.find(o => o.id === "D1").ref = { runId: run0.id, segmentId: run0.segments[0].id, spoolTags: tags.slice(0, 2) };
const LR = detectClashes(linked, rules);
check(LR.status === "OK" && eq(LR.clashes[0].proposedResolution.affected.spoolTags, tags.slice(0, 2)) && LR.clashes[0].proposedResolution.affected.runIds[0] === run0.id, "proposed resolution names the affected run and spool tags from P2");
check(h() === h0, "lab route model, spool result and estimate() rows unchanged after detection (BOM/spool/estimate untouched)");
check(forbiddenKeys(LR).length === 0, "detection output has no quantity, cost, BOM, EVM or claim fields");
// revision mechanism (defined, not executed)
const rev = planRevision({ clash: LR.clashes[0], baselineRef: `lab:${lab.sha256.slice(0, 12)}` });
check(rev.status === "PLANNED_NOT_EXECUTED" && rev.costDelta === null && rev.quantityDelta === null && rev.revised.spoolTags === null && /qtyFor/.test(rev.steps.join(" ")) && /estimate/.test(rev.steps.join(" ")), "planRevision(): PLANNED_NOT_EXECUTED, cost delta only after regeneration through qtyFor()->estimate()");
check(planRevision({ clash: LR.clashes[0] }).revisionId === rev.revisionId && /^REV-[0-9A-F]{10}$/.test(rev.revisionId), "revision ID is stable and traceable to the clash ID");
check(rev.fromClashId === LR.clashes[0].id && eq(rev.original.spoolTags, tags.slice(0, 2)), "revision keeps original spool tags and the source clash ID");
const orig = spoolRes.spools.filter(s => s.runId === run0.id).slice(0, 6).map(s => ({ tag: s.tag, runId: s.runId, lengthCu: s.lengthCu, weightLb: s.weightLb }));
const aff = tags.slice(0, 2), keep = orig.filter(s => !aff.includes(s.tag));
const repl = { tag: "D-SPOOL-REV-001", runId: run0.id, supersedes: aff, lengthCu: orig.filter(s => aff.includes(s.tag)).reduce((a, s) => a + s.lengthCu, 0), weightLb: orig.filter(s => aff.includes(s.tag)).reduce((a, s) => a + s.weightLb, 0) };
const good = reconcileRevision(orig, [...keep, repl], aff);
check(good.ok && good.delta.lengthCu === 0 && good.delta.weightLb === 0 && good.delta.spoolCount === -1 && good.costDelta === null, "reconcileRevision(): replacement conserves length/weight, no duplicate quantities, cost delta stays null");
const neg = [
  ["affected spools left in place alongside replacement (duplicate quantity)", reconcileRevision(orig, [...orig, repl], aff), "ORIGINAL_AFFECTED_STILL_PRESENT"],
  ["replacement missing for an affected spool", reconcileRevision(orig, keep, aff), "AFFECTED_NOT_REPLACED"],
  ["unaffected spool altered", reconcileRevision(orig, [...keep.map((s, i) => (i === 0 ? { ...s, weightLb: s.weightLb + 5 } : s)), repl], aff), "UNAFFECTED_SPOOLS_CHANGED"],
  ["duplicate tag in revised set", reconcileRevision(orig, [...keep, repl, { ...keep[0] }], aff), "DUPLICATE_TAG_IN_REVISED"]
];
for (const [name, r, code] of neg) check(!r.ok && r.errors.some(e => e.startsWith(code)), `reconcileRevision() rejects: ${name}`, `reconcileRevision() failed to reject: ${name} (${r.errors})`);

// ---------- independence (AC-01) ----------
console.log("== independence");
for (const file of ["clash-engine.mjs", "resolution.mjs"]) {
  const src = fs.readFileSync(new URL(`../clash/${file}`, import.meta.url), "utf8");
  const imports = [...src.matchAll(/^import .* from "([^"]+)"/gm)].map(m => m[1]);
  check(imports.every(i => i === "node:crypto" || i === "./clash-engine.mjs"), `${file} imports only ${[...new Set(imports)].join(", ")} (no lab, route, spool or estimate code)`);
  check(!/Math\.random|Date\.now|new Date|performance\.now/.test(src), `${file} has no clock or RNG`);
}

console.log("\n== summary (SYNTHETIC engineering validation; not project findings)");
for (const s of summary) console.log(`  ${s.id.padEnd(40)} clashReady=${String(s.clashReady).padEnd(5)} clashes=${s.clashes} observations=${s.observations} exempted=${s.exempted} rejected=${s.rejected}`);
console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
