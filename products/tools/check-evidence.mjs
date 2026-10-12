// Usage: node products/tools/check-evidence.mjs   (exit 1 on any failure)
// E0 gate: validates evidence-contract-v2 envelopes (products/evidence/evidence.mjs) against the schema:
// required fields, enums, deterministic identity, clash logicalId derivation, verification reproducibility,
// approval pinning, profile binding, complianceClaim default. Fixtures are SYNTHETIC. The checker does not
// touch the lab, P1-P3 outputs or the clash/spool engines; run it alongside check.mjs, check-spool.mjs, check-clash.mjs.
import fs from "node:fs";
import { readJson } from "./util.mjs";
import * as ev from "../evidence/evidence.mjs";

const fx = readJson("../evidence/fixtures/envelopes.json");
let failures = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, okMsg, failMsg) => (c ? ok(okMsg) : fail(failMsg ?? okMsg));
const codes = errs => [...new Set(errs.map(e => e.code))].sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = o => JSON.parse(JSON.stringify(o));

console.log("== fixtures labelled synthetic");
check(/SYNTHETIC/.test(fx.label), "fixture file is labelled SYNTHETIC");

console.log("== valid envelopes pass");
for (const v of fx.valid) {
  const errs = ev.validateEnvelope(v.envelope);
  check(!errs.length, `valid: ${v.name}`, `valid fixture '${v.name}' rejected: ${JSON.stringify(errs)}`);
}
const chainErrs = ev.validateChain(clone(fx.valid.map(v => v.envelope)));
check(!chainErrs.length, "valid set: revision chains are consecutive and supersede the previous revisionId", `valid chain rejected: ${JSON.stringify(chainErrs)}`);

console.log("== invalid envelopes are caught with the expected violation");
for (const i of fx.invalid) {
  const got = codes(ev.validateEnvelope(i.envelope));
  check(same(got, [...i.expectCodes].sort()), `caught: ${i.name} -> ${got.join(",")}`, `'${i.name}': expected ${i.expectCodes.join(",")} but got [${got.join(",")}]`);
}
for (const c of fx.invalidChains) {
  const got = codes(ev.validateChain(clone(c.envelopes)));
  check(same(got, [...c.expectCodes].sort()), `caught chain: ${c.name} -> ${got.join(",")}`, `chain '${c.name}': expected ${c.expectCodes.join(",")} got [${got.join(",")}]`);
}
const required = new Set(["E_ENUM", "E_VERIFIED_REV", "E_CLASH_ID", "E_COMPLIANCE", "E_APPROVAL_PIN", "E_PROFILE_BINDING", "E_HASH", "E_UNKNOWN_FIELD", "E_REQUIRED"]);
const covered = new Set(fx.invalid.flatMap(i => i.expectCodes));
check([...required].every(c => covered.has(c)), "negative fixtures cover every violation class (enum, verifiedRevisionId, clash ID, compliance, approval pin, profile binding, hash, unknown field, required)");

console.log("== identity policy");
const [c1, c2] = [fx.valid[0].envelope, fx.valid[1].envelope];
check(c1.logicalId === c2.logicalId && c1.revisionId !== c2.revisionId && c1.contentHash !== c2.contentHash && c2.revision === 2 && c2.supersedes === c1.revisionId,
  "geometry change keeps the clash logicalId and yields a new revisionId/contentHash (revision 2 supersedes revision 1)");
check(ev.clashLogicalId(["A", "B"], "T") === ev.clashLogicalId(["B", "A"], "T") && ev.clashLogicalId(["A", "B"], "T") !== ev.clashLogicalId(["A", "B"], "U") && ev.clashLogicalId(["A", "B"], "T") !== ev.clashLogicalId(["A", "C"], "T"),
  "clash logicalId is object-order independent and depends on both objects and the clash type");
check(ev.contentHashOf({ a: 1, b: { c: 2, d: 3 } }) === ev.contentHashOf({ b: { d: 3, c: 2 }, a: 1 }), "contentHash is key-order independent (deterministic)");
check(ev.contentHashOf({ a: 1 }) !== ev.contentHashOf({ a: 2 }), "contentHash changes with payload");
check(c1.revisionId === ev.revisionIdOf(c1.logicalId, c1.revision, c1.contentHash) && c1.revisionId !== ev.revisionIdOf(c1.logicalId, 2, c1.contentHash), "revisionId is derived from (logicalId, revision, contentHash)");

console.log("== defaults and enums");
check(ev.COMPLIANCE_DEFAULT === "NONE" && fx.valid.every(v => v.envelope.complianceClaim === "NONE"), "complianceClaim default is NONE on every valid envelope");
check(same(Object.keys(ev.ENUMS).sort(), ["approval", "basis", "validity", "verification", "verificationScope", "workflow"]), "five status dimensions are distinct enums (+ verification scope)");
check(same(ev.ENUMS.basis, ["observed", "declared", "inferred", "unknown"]) && same(ev.ENUMS.verification, ["unverified", "verified", "failed"]) && same(ev.ENUMS.validity, ["current", "stale"]) && same(ev.ENUMS.workflow, ["draft", "submitted", "blocked", "closed"]) && same(ev.ENUMS.approval, ["pending", "accepted", "rejected", "withdrawn"]) && same(ev.ENUMS.verificationScope, ["mathematical", "building-condition"]), "enum values match MEP_SCOPING.md section 1.B");
check(same(Object.keys(ev.PROFILES).sort(), ["IPC_2024_MODEL", "NYC_2022_REFERENCE", "UNSPECIFIED"]) && ev.PROFILES.UNSPECIFIED.edition === null, "code profiles are exactly NYC_2022_REFERENCE, IPC_2024_MODEL, UNSPECIFIED (UNSPECIFIED carries no edition)");
check(ev.PROFILES.NYC_2022_REFERENCE.note.includes("unverified"), "profile editions are labelled owner-supplied, unverified");

console.log("== purity");
const frozen = clone(fx.valid[2].envelope);
const deepFreeze = o => { Object.values(o).forEach(v => v && typeof v === "object" && deepFreeze(v)); return Object.freeze(o); };
let threw = false; try { ev.validateEnvelope(deepFreeze(frozen)); } catch { threw = true; }
check(!threw, "validateEnvelope does not mutate its input (deep-frozen envelope accepted)");
const src = fs.readFileSync(new URL("../evidence/evidence.mjs", import.meta.url), "utf8");
const imports = [...src.matchAll(/^import .* from "([^"]+)"/gm)].map(m => m[1]);
check(same(imports, ["node:crypto"]), "evidence module imports only node:crypto (self-contained)", `evidence.mjs imports: ${imports.join(", ")}`);
check(!/Date\.now|new Date\(|Math\.random|performance\.now/.test(src), "evidence module reads no clock and no RNG (Date.parse on a supplied string only)");

console.log(`\nfixtures: ${fx.valid.length} valid, ${fx.invalid.length} invalid, ${fx.invalidChains.length} invalid chains`);
console.log(`${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), 0 warning(s)`);
process.exit(failures ? 1 : 0);
