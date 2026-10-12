// Usage: node products/tools/check-commissioning.mjs   (exit 1 on any failure)
// P4a gate: one commissioning lifecycle for ONE system (exhaust fan HVAC-EXFAN-001), SYNTHETIC fixtures.
// Proves: deterministic evaluator (PASS/FAIL/INCOMPLETE, inclusive boundaries, malformed rejection); E0 envelopes
// (kind "commissioning-test") wrapping executions; an append-only hash-chained transition ledger; and the workflow
// invariants (verification before acceptance, exact-revision pinning, re-test preserves the failure, stale
// invalidation, role separation, legal transitions only). Every negative fixture must produce exactly its expected
// violation codes. PASS here means "recorded values satisfy the selected criteria", never compliance.
import fs from "node:fs";
import { loadLab } from "./lab-bridge.mjs";
import { readJson } from "./util.mjs";
import * as cx from "../commissioning/commissioning.mjs";
import * as ev from "../evidence/evidence.mjs";

const fx = readJson("../commissioning/fixtures/matrix.json");
const products = readJson("../hvac/hvac-products.sample.json");
const LAB_SHA = "d3f0caaf5f71b8f61285a4def88f8870e7e11e40cb2d66137d9d9db0d2e54047";
let failures = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, okMsg, failMsg) => (c ? ok(okMsg) : fail(failMsg ?? okMsg));
const clone = o => JSON.parse(JSON.stringify(o));
const codes = errs => [...new Set(errs.map(e => e.code))].sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const deepFreeze = o => { Object.values(o).forEach(v => v && typeof v === "object" && deepFreeze(v)); return Object.freeze(o); };

const [def1, def2] = fx.definitions;
const instBase = fx.instances.base;
const currentFor = lc => {
  const n = lc.current.definitionRevision, defs = fx.definitions.filter(d => d.revision <= n);
  const inst = fx.instances[lc.current.instance];
  return { definitions: { [defs[0].definitionId]: defs[defs.length - 1] }, instances: { [inst.instanceId]: inst }, history: { [defs[0].definitionId]: defs } };
};
const run = lc => cx.validateLifecycle({ envelopes: clone(lc.envelopes), events: clone(lc.events), anchors: lc.anchors, current: currentFor(lc) });

console.log("== fixtures and boundaries");
check(/SYNTHETIC/.test(fx.label) && fx.instances.base.dataMode === "synthetic", "fixtures are labelled SYNTHETIC");
check(fx.definitions.every(d => cx.validateDefinition(d).length === 0), "definitions valid: versioned, separate from executions, with provenance");
check(def1.provenance.source === null && def1.provenance.representative === true && def1.provenance.verificationStatus === "unverified", "unsourced definition is explicitly representative and unverified (no AABC/NEBB/ASHRAE/AMCA procedure claimed)");
check(def1.applicability.productId === "HVAC-EXFAN-001" && products.some(p => p.id === "HVAC-EXFAN-001") && instBase.productId === "HVAC-EXFAN-001", "scope is exactly one product: P1 catalog HVAC-EXFAN-001");
check(cx.instanceIdOf("HVAC-EXFAN-001", "EF-1 (SYNTHETIC)") === instBase.instanceId && fx.instances.changed.instanceId === instBase.instanceId && fx.instances.changed.inputsHash !== instBase.inputsHash, "instance ID is deterministic and survives input changes; inputsHash tracks them");
check(!JSON.stringify(fx.definitions).includes("DAMPER") && !JSON.stringify(fx).includes("damper"), "no dampers or life-safety interlocks in scope");

console.log("== definitions");
for (const b of fx.badDefinitions) check(same(codes(cx.validateDefinition(b.definition)), b.expectCodes), `rejected: ${b.name}`);

console.log("== evaluator matrix");
for (const c of fx.evaluatorCases) {
  const r = cx.evaluate(def1, instBase, c.conditions, c.observations);
  if (c.expectError) check(r.outcome === null && r.errors.length > 0 && r.errors.every(e => e.code === "C_MALFORMED"), `malformed rejected: ${c.name}`, `'${c.name}' should be rejected, got ${r.outcome}`);
  else check(r.outcome === c.expectOutcome, `${c.expectOutcome}: ${c.name}`, `'${c.name}': expected ${c.expectOutcome} got ${r.outcome} ${JSON.stringify(r.errors)}`);
}
const a = cx.evaluate(def1, instBase, fx.evaluatorCases[0].conditions, fx.evaluatorCases[0].observations);
check(JSON.stringify(a) === JSON.stringify(cx.evaluate(clone(def1), clone(instBase), clone(fx.evaluatorCases[0].conditions), clone(fx.evaluatorCases[0].observations))), "evaluator is deterministic");
check(cx.MEANING.includes("not code compliance") && cx.OUTCOMES.join() === "PASS,FAIL,INCOMPLETE", "outcome is exactly PASS/FAIL/INCOMPLETE and PASS is defined as 'recorded values satisfy the selected criteria; not code compliance, not EoR acceptance'");
check(cx.evaluate(def2, instBase, fx.evaluatorCases[0].conditions, { airflow: { value: 2629.8, unit: "CFM" }, fanSpeed: { value: 800, unit: "RPM" } }).outcome === "FAIL", "definition revision 2 (95-105 %) rejects a value revision 1 accepted: definitions are versioned");

console.log("== valid lifecycles (E0 + ledger)");
const lifeStates = [];
for (const lc of fx.validLifecycles) {
  const errs = run(lc);
  check(!errs.length, `valid: ${lc.name}`, `valid lifecycle '${lc.name}' rejected: ${JSON.stringify(errs)}`);
  lifeStates.push(cx.foldLedger(clone(lc.envelopes), clone(lc.events)).states);
}
const byName = n => fx.validLifecycles.findIndex(l => l.name.startsWith(n));
const st = (n, i = 0) => { const k = byName(n); return lifeStates[k].get(fx.validLifecycles[k].envelopes[i].revisionId); };
const lcOf = n => fx.validLifecycles[byName(n)];
const pass = st("passing");
check(pass.verification === "verified" && pass.approval === "accepted" && pass.workflow === "closed" && pass.validity === "current" && pass.approvedRevisionId === lcOf("passing").envelopes[0].revisionId, "passing: verified against its own revisionId, accepted, approval pinned to that revisionId");
const f = st("failing");
check(lcOf("failing").envelopes[0].payload.outcome === "FAIL" && f.verification === "verified" && f.approval === "rejected", "failing: a FAIL is verified as evidence yet rejected (outcome is separate from verification)");
const rt = lcOf("successful re-test");
const [r1, r2] = rt.envelopes;
check(r1.payload.outcome === "FAIL" && r2.payload.outcome === "PASS" && r2.supersedes === r1.revisionId && r2.revision === 2 && r2.logicalId === r1.logicalId && r1.revisionId !== r2.revisionId, "re-test: revision 2 supersedes revision 1 under the same logicalId; the original FAIL remains");
const rs = lifeStates[byName("successful re-test")];
check(rs.get(r1.revisionId).approval === "rejected" && rs.get(r2.revisionId).approval === "accepted" && rs.get(r2.revisionId).approvedRevisionId === r2.revisionId, "re-test: history keeps the rejected failure; the pass is accepted and pinned to revision 2 only");
check(rt.events.filter(e => e.revisionId === r1.revisionId).length === 4 && rt.events.filter(e => e.revisionId === r2.revisionId).length === 4, "re-test: the ledger holds all events of both revisions (append-only)");
const inc = lcOf("INCOMPLETE");
check(inc.envelopes[0].payload.outcome === "INCOMPLETE" && st("INCOMPLETE").approval === "pending", "INCOMPLETE stays unaccepted");
check(lcOf("PASS may remain").envelopes[0].payload.outcome === "PASS" && st("PASS may remain").verification === "unverified", "a PASS can remain unverified");
check(st("definition revised").validity === "stale" && st("equipment inputs").validity === "stale", "definition or equipment-input changes invalidate dependent verification (validity stale via ledger)");
const roles = new Set(fx.validLifecycles.flatMap(l => l.events.map(e => e.actorRole)));
check(["executor", "reviewer", "approver"].every(r => roles.has(r)), `distinguishable roles in use: ${[...roles].sort().join(", ")}`);
const view = cx.materialize(lcOf("passing").envelopes[0], pass);
check(ev.validateEnvelope(view).length === 0 && view.kind === "commissioning-test" && view.complianceClaim === "NONE" && view.verificationScope === "mathematical", "ledger-folded view of a passing execution is a valid E0 'commissioning-test' envelope (scope mathematical, complianceClaim NONE)");
check(fx.validLifecycles.every(l => l.envelopes.every(e => e.kind === "commissioning-test" && e.complianceClaim === "NONE" && e.basis === "declared" && e.payload.dataMode === "synthetic")), "every execution envelope: kind commissioning-test, complianceClaim NONE, basis declared, synthetic");

console.log("== negative fixtures: each violation is caught with exactly its code");
for (const lc of fx.invalidLifecycles) {
  const got = codes(run(lc));
  check(same(got, [...lc.expectCodes].sort()), `caught: ${lc.name} -> ${got.join(",")}`, `'${lc.name}': expected ${lc.expectCodes.join(",")} got [${got.join(",")}]`);
}
const wanted = ["C_ACCEPT_GUARD", "C_APPROVAL_PIN", "C_VERIFY_PIN", "C_RETEST", "C_STALE", "C_ROLE", "C_TRANSITION", "C_LEDGER_CHAIN", "C_SCOPE", "C_OUTCOME_MISMATCH", "C_E0"];
const covered = new Set(fx.invalidLifecycles.flatMap(l => l.expectCodes));
check(wanted.every(c => covered.has(c)), "negative fixtures cover every invariant: acceptance guards, approval pin, verification pin, re-test history, stale invalidation, roles, transitions, ledger integrity, scope, outcome, E0");

console.log("== ledger design");
const sample = lcOf("passing").events;
check(sample.every((e, i) => e.eventId === cx.eventIdOf(e) && e.prevEventId === (i ? sample[i - 1].eventId : null) && e.seq === i + 1), "event IDs are content-derived and hash-chained (seq, prevEventId)");
check(sample.every(e => /^EVT-[0-9a-f]{12}$/.test(e.eventId) && /^\d{4}-\d{2}-\d{2}T/.test(e.timestamp) && cx.ROLES.includes(e.actorRole) && e.revisionId && e.from && e.to), "events carry role, fixture timestamp, previous/new state and affected revisionId");
check(fx.validLifecycles.every(l => l.events.every((e, i) => i === 0 || e.timestamp >= l.events[i - 1].timestamp)), "fixture timestamps are non-decreasing simulation data");
const again = cx.makeEvent([], { logicalId: "L", revisionId: "R", dimension: "workflow", from: "draft", to: "submitted", actorRole: "executor", timestamp: "2026-10-12T08:00:00Z", detail: {} });
check(again.eventId === cx.makeEvent([], { logicalId: "L", revisionId: "R", dimension: "workflow", from: "draft", to: "submitted", actorRole: "executor", timestamp: "2026-10-12T08:00:00Z", detail: {} }).eventId, "the same event content always yields the same event ID");
let threw = false; try { cx.validateLifecycle({ envelopes: deepFreeze(clone(rt.envelopes)), events: deepFreeze(clone(rt.events)), anchors: [], current: deepFreeze(currentFor(rt)) }); } catch { threw = true; }
check(!threw, "validation does not mutate its inputs (deep-frozen lifecycle accepted)");

console.log("== boundaries: no clock, no consumption of P2.1, E0 unchanged, lab untouched");
const src = fs.readFileSync(new URL("../commissioning/commissioning.mjs", import.meta.url), "utf8");
check(same([...src.matchAll(/^import .* from "([^"]+)"/gm)].map(m => m[1]), ["node:crypto", "../evidence/evidence.mjs"]), "module imports only node:crypto and the E0 evidence module");
check(!/Date\.now|new Date\(|Math\.random|performance\.now/.test(src), "no wall clock and no RNG (timestamps are fixture-supplied strings; Date.parse only validates them)");
const code = src.replace(/\/\/.*$/gm, "");
check(!/QTY-|quantities\//.test(code) && !/QTY-|quantities\//.test(JSON.stringify(fx)), "does not consume or parse P2.1 quantity records");
check(ev.CONTRACT_VERSION === "evidence-v2-e0" && ev.KINDS.join() === "clash,spool,commissioning-test", "E0 contract unchanged (version evidence-v2-e0; kinds clash, spool, commissioning-test)");
const lab = loadLab();
check(lab.sha256 === LAB_SHA, `lab file sha256 unchanged (${lab.sha256.slice(0, 16)}…)`, `lab sha256 changed: ${lab.sha256}`);
const fan = products.find(p => p.id === "HVAC-EXFAN-001");
const assoc = cx.resolveActsAssociation(deepFreeze(clone(lab.acts)), fan);
check(assoc && assoc.readOnly === true && assoc.productActivity.id === "A07" && assoc.commissioningActivity.id === "A14" && assoc.commissioningActivity.code === "0820-CX" && assoc.commissioningActivity.driver === "DAYS" && assoc.costCodes.join() === "0820-CX-L,0820-CX-M,0820-CX-C,0820-CX-S,0820-CX-E", "read-only ACTS association resolved: fan A07 -> commissioning A14 0820-CX (DAYS), cost codes 0820-CX-L/M/C/S/E");
console.log(`  association: ${assoc.productActivity.code} -> ${assoc.commissioningActivity.code} ${assoc.commissioningActivity.name} [${assoc.commissioningActivity.crew}]; ${assoc.note}`);

console.log(`\nfixtures: ${fx.evaluatorCases.length} evaluator cases, ${fx.badDefinitions.length} bad definitions, ${fx.validLifecycles.length} valid lifecycles, ${fx.invalidLifecycles.length} negative lifecycles`);
console.log(`${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), 0 warning(s)`);
process.exit(failures ? 1 : 0);
