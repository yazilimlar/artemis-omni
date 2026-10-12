// Evidence contract v2 (E0): envelope enums, deterministic identity helpers and a pure validator.
// Spec: products/MEP_SCOPING.md section 1-2. Self-contained: imports only node:crypto; no I/O, clock or RNG.
// contentHash covers `payload` ONLY (never timestamps or status), so it is reproducible.
// Nothing here is applied to P1-P3 outputs yet (P2.1 is the first consumer); no promotion-gate enforcement.
// HASH PREFIXES: CLX-/REV- use 12-hex (48-bit) prefixes of SHA-256; collision-safe for lab-scale sets; full hash remains available via contentHash.
// EXTENSION PATH: extension fields require a contract-version bump (CONTRACT_VERSION) and an explicit addition to REQUIRED_FIELDS / the TypeScript interface; unknown keys remain a hard fail.
import crypto from "node:crypto";

export const CONTRACT_VERSION = "evidence-v2-e0";
export const KINDS = Object.freeze(["clash", "spool", "commissioning-test"]);
export const ENUMS = Object.freeze({
  basis: ["observed", "declared", "inferred", "unknown"],
  verification: ["unverified", "verified", "failed"],
  verificationScope: ["mathematical", "building-condition"],
  validity: ["current", "stale"],
  workflow: ["draft", "submitted", "blocked", "closed"],
  approval: ["pending", "accepted", "rejected", "withdrawn"],
});
/** Owner-supplied profile table (MEP_SCOPING.md section 2). Editions are UNVERIFIED by the builder. */
export const PROFILES = Object.freeze({
  NYC_2022_REFERENCE: { edition: "2022", jurisdiction: "New York City", note: "primary; 2022 NYC Plumbing/Building/Mechanical/Fuel Gas Codes; owner-supplied, unverified" },
  IPC_2024_MODEL: { edition: "2024", jurisdiction: "MODEL (no adopting jurisdiction)", note: "optional educational comparison; owner-supplied, unverified" },
  UNSPECIFIED: { edition: null, jurisdiction: null, note: "no code-derived assertions" },
});
export const COMPLIANCE_DEFAULT = "NONE";
export const REQUIRED_FIELDS = Object.freeze([
  "kind", "logicalId", "revisionId", "contentHash", "revision", "supersedes",
  "basis", "verification", "verificationScope", "verificationMethod", "verificationBasis", "verifiedRevisionId", "artifactRefs", "verificationTimestamp",
  "validity", "workflow", "approval", "approvedRevisionId", "complianceClaim", "ruleBindings", "clash", "payload",
]);

/** Key-sorted JSON (stable across key order). */
export function canonical(x) {
  if (Array.isArray(x)) return "[" + x.map(canonical).join(",") + "]";
  if (x && typeof x === "object") return "{" + Object.keys(x).sort().map(k => JSON.stringify(k) + ":" + canonical(x[k])).join(",") + "}";
  return JSON.stringify(x);
}
const sha = s => crypto.createHash("sha256").update(s).digest("hex");

export const contentHashOf = payload => "sha256:" + sha(canonical(payload));
export const revisionIdOf = (logicalId, revision, contentHash) => "REV-" + sha(canonical({ logicalId, revision, contentHash })).slice(0, 12);
/** Clash logicalId: the two objects' logicalIds (order-independent) + clash type. Never geometry. */
export const clashLogicalId = (objectLogicalIds, clashType) => "CLX-" + sha(canonical({ objects: [...objectLogicalIds].sort(), clashType })).slice(0, 12);

const isStr = x => typeof x === "string" && x.length > 0;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** Validate one envelope. Returns [{code, path, msg}]; empty = valid. Pure: does not mutate input. */
export function validateEnvelope(e) {
  const errs = [];
  const err = (code, path, msg) => errs.push({ code, path, msg });
  if (!e || typeof e !== "object" || Array.isArray(e)) return [{ code: "E_REQUIRED", path: "", msg: "envelope must be an object" }];
  for (const f of REQUIRED_FIELDS) if (!(f in e)) err("E_REQUIRED", f, `missing required field '${f}'`);
  for (const f of Object.keys(e)) if (!REQUIRED_FIELDS.includes(f)) err("E_UNKNOWN_FIELD", f, `field '${f}' is not in the contract`);
  if (errs.length) return errs;

  const en = (path, v, allowed, nullable = false) => { if (!(nullable && v === null) && !allowed.includes(v)) err("E_ENUM", path, `'${v}' not in {${allowed.join("|")}}`); };
  en("kind", e.kind, KINDS);
  en("basis", e.basis, ENUMS.basis);
  en("verification", e.verification, ENUMS.verification);
  en("verificationScope", e.verificationScope, ENUMS.verificationScope, true);
  en("validity", e.validity, ENUMS.validity);
  en("workflow", e.workflow, ENUMS.workflow);
  en("approval", e.approval, ENUMS.approval);

  // identity triple + deterministic derivation
  if (!isStr(e.logicalId)) err("E_REQUIRED", "logicalId", "logicalId must be a non-empty string");
  if (!Number.isInteger(e.revision) || e.revision < 1) err("E_REVISION", "revision", "revision must be an integer >= 1");
  if (e.revision === 1 && e.supersedes !== null) err("E_SUPERSEDES", "supersedes", "revision 1 must have supersedes null");
  if (Number.isInteger(e.revision) && e.revision > 1 && !isStr(e.supersedes)) err("E_SUPERSEDES", "supersedes", "revision > 1 must name the previous revisionId");
  if (e.payload === null || typeof e.payload !== "object") err("E_REQUIRED", "payload", "payload must be an object");
  else {
    if (e.contentHash !== contentHashOf(e.payload)) err("E_HASH", "contentHash", "contentHash does not match canonical(payload)");
    if (isStr(e.logicalId) && Number.isInteger(e.revision) && e.revisionId !== revisionIdOf(e.logicalId, e.revision, e.contentHash)) err("E_REVISION_ID", "revisionId", "revisionId is not derived from (logicalId, revision, contentHash)");
  }

  // clash identity policy
  if (e.kind === "clash") {
    const c = e.clash;
    if (!c || !Array.isArray(c.objectLogicalIds) || c.objectLogicalIds.length !== 2 || !c.objectLogicalIds.every(isStr) || !isStr(c.clashType) || Object.keys(c).some(k => k !== "objectLogicalIds" && k !== "clashType")) err("E_CLASH", "clash", "clash envelope needs clash:{objectLogicalIds:[a,b], clashType}");
    else {
      if (c.objectLogicalIds[0] === c.objectLogicalIds[1]) err("E_CLASH", "clash.objectLogicalIds", "a clash needs two distinct objects");
      if (e.logicalId !== clashLogicalId(c.objectLogicalIds, c.clashType)) err("E_CLASH_ID", "logicalId", "clash logicalId must derive from the two objects' logicalIds + clashType, never from geometry");
    }
  } else if (e.clash !== null) err("E_CLASH", "clash", "clash block is only allowed on kind 'clash'");

  // reproducible verification
  const vf = { verificationScope: e.verificationScope, verificationMethod: e.verificationMethod, verificationBasis: e.verificationBasis, verifiedRevisionId: e.verifiedRevisionId, verificationTimestamp: e.verificationTimestamp };
  if (e.verification === "unverified") {
    if (Object.values(vf).some(v => v !== null) || !Array.isArray(e.artifactRefs) || e.artifactRefs.length) err("E_VERIFY_FIELDS", "verification", "unverified envelopes must carry null verification fields and no artifactRefs");
  } else if (ENUMS.verification.includes(e.verification)) {
    for (const [k, v] of Object.entries(vf)) if (!isStr(v)) err(k === "verifiedRevisionId" ? "E_VERIFIED_REV" : "E_VERIFY_FIELDS", k, `${e.verification} requires '${k}'`);
    if (!Array.isArray(e.artifactRefs) || !e.artifactRefs.length || !e.artifactRefs.every(isStr)) err("E_VERIFY_FIELDS", "artifactRefs", `${e.verification} requires >= 1 artifact ref`);
    if (isStr(e.verifiedRevisionId) && e.verifiedRevisionId !== e.revisionId) err("E_VERIFIED_REV", "verifiedRevisionId", "verification applies to exactly this revisionId; later revisions do not inherit it");
    if (isStr(e.verificationTimestamp) && (!ISO.test(e.verificationTimestamp) || Number.isNaN(Date.parse(e.verificationTimestamp)))) err("E_VERIFY_FIELDS", "verificationTimestamp", "timestamp must be ISO-8601 UTC");
  }

  // approval pins to one revision
  if (e.approval === "accepted") { if (e.approvedRevisionId !== e.revisionId) err("E_APPROVAL_PIN", "approvedRevisionId", "accepted approval must pin this exact revisionId; it is not inherited"); }
  else if (e.approvedRevisionId !== null) err("E_APPROVAL_PIN", "approvedRevisionId", "approvedRevisionId is only set when approval is 'accepted'");

  // compliance: lab default NONE regardless of verification or signed rules
  // E0 admits only NONE. Future non-NONE claims require an EoR-backed basis field and a contract revision; verification or a signed rule alone remains insufficient.
  if (e.complianceClaim !== COMPLIANCE_DEFAULT) err("E_COMPLIANCE", "complianceClaim", "complianceClaim must be NONE: neither verification nor a signed rule certifies a project in this lab");

  // code profile binding
  if (!Array.isArray(e.ruleBindings)) err("E_PROFILE_BINDING", "ruleBindings", "ruleBindings must be an array");
  else e.ruleBindings.forEach((b, i) => {
    const p = `ruleBindings[${i}]`, prof = b && PROFILES[b.profile];
    if (!b || !isStr(b.ruleId) || !prof || !("edition" in b) || !("jurisdiction" in b) || !ENUMS.verification.includes(b.verification) || Object.keys(b).length !== 5) return err("E_PROFILE_BINDING", p, "binding needs exactly {ruleId, profile in NYC_2022_REFERENCE|IPC_2024_MODEL|UNSPECIFIED, edition, jurisdiction, verification}");
    if (b.edition !== prof.edition || b.jurisdiction !== prof.jurisdiction) err("E_PROFILE_BINDING", p, `edition/jurisdiction must match profile ${b.profile}`);
    if (b.profile === "UNSPECIFIED" && b.verification !== "unverified") err("E_PROFILE_BINDING", p, "UNSPECIFIED makes no code-derived assertion, so it cannot be verified");
  });
  return errs;
}

/** Cross-envelope revision-chain rules for a set of envelopes. Returns [{code, path, msg}]. */
export function validateChain(envs) {
  const errs = [], by = new Map();
  for (const e of envs) { if (!by.has(e.logicalId)) by.set(e.logicalId, []); by.get(e.logicalId).push(e); }
  const ids = envs.map(e => e.revisionId);
  if (new Set(ids).size !== ids.length) errs.push({ code: "E_CHAIN", path: "revisionId", msg: "duplicate revisionId" });
  for (const [lid, list] of by) {
    list.sort((a, b) => a.revision - b.revision);
    list.forEach((e, i) => {
      if (e.revision !== i + 1) errs.push({ code: "E_CHAIN", path: lid, msg: `revisions must be 1..n without gaps (got ${e.revision} at position ${i + 1})` });
      else if (i > 0 && e.supersedes !== list[i - 1].revisionId) errs.push({ code: "E_CHAIN", path: lid, msg: `revision ${e.revision} must supersede revision ${list[i - 1].revision}'s revisionId` });
    });
  }
  return errs;
}
