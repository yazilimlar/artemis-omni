// P4a: commissioning vertical slice for ONE system, the exhaust fan (P1 catalog HVAC-EXFAN-001).
// Pure and deterministic: imports only node:crypto and the E0 evidence module; no I/O, no wall clock, no RNG.
// Timestamps only ever arrive as fixture-supplied ISO strings. Does NOT consume P2.1 quantity records (no QTY-
// parsing) and does not change the E0 contract (envelope kind "commissioning-test" already exists there).
//
// MODEL
//   Definition (versioned, immutable per revision)  +  Instance (synthetic equipment)  ->  Execution (E0 envelope payload)
//   E0 hashes the payload only, so lifecycle state (verification/validity/workflow/approval) lives in an
//   append-only, hash-chained LEDGER of transition events; `materialize()` folds the ledger into an E0 envelope view.
//   PASS means "recorded values satisfy the selected criteria". It is never code compliance or EoR acceptance.
//   Outcome (PASS/FAIL/INCOMPLETE) is a separate dimension from verification (a FAIL may be verified).
// ANCHOR ASSUMPTION: Append-only integrity requires the caller to retain at least one previously observed eventId as an anchor (or the complete prior ledger). A fully rewritten but internally consistent ledger is accepted if no anchors are supplied; the ledger is not self-certifying.
// STALE DETECTION: Stale detection lives in validateLifecycle, not in the ledger fold. Callers that accept a ledger as authoritative must also run validateLifecycle against the current definition/instance set; the ledger alone does not auto-stale prior revisions.
import crypto from "node:crypto";
import { canonical, contentHashOf, revisionIdOf, validateEnvelope, validateChain } from "../evidence/evidence.mjs";

export const MODULE_VERSION = "p4a-1";
export const MEANING = "recorded values satisfy the selected criteria; not code compliance, not EoR acceptance";
export const OUTCOMES = Object.freeze(["PASS", "FAIL", "INCOMPLETE"]);
export const ROLES = Object.freeze(["executor", "reviewer", "approver", "system"]);
const sha = s => crypto.createHash("sha256").update(s).digest("hex");
const isStr = x => typeof x === "string" && x.length > 0;
const fin = x => typeof x === "number" && Number.isFinite(x);
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

// ---- legal transitions: dimension -> "from>to" -> allowed actor roles ---------------------------------------
export const TRANSITIONS = Object.freeze({
  workflow: { "draft>submitted": ["executor"], "submitted>blocked": ["reviewer"], "blocked>submitted": ["executor"], "submitted>closed": ["approver"] },
  verification: { "unverified>verified": ["reviewer"], "unverified>failed": ["reviewer"] },
  validity: { "current>stale": ["system", "reviewer"] },
  approval: { "pending>accepted": ["approver"], "pending>rejected": ["approver"], "pending>withdrawn": ["approver"], "accepted>withdrawn": ["approver"] },
});
export const INITIAL = Object.freeze({ verification: "unverified", validity: "current", workflow: "draft", approval: "pending" });

// ---- definition ---------------------------------------------------------------------------------------------
export function validateDefinition(d) {
  const e = [], bad = (m) => e.push({ code: "C_DEFINITION", msg: m });
  if (!d || typeof d !== "object") return [{ code: "C_DEFINITION", msg: "definition must be an object" }];
  if (!isStr(d.definitionId)) bad("definitionId required");
  if (!Number.isInteger(d.revision) || d.revision < 1) bad("revision must be an integer >= 1");
  if (!d.applicability || !isStr(d.applicability.productId) || !isStr(d.applicability.system)) bad("applicability needs productId and system");
  if (!isStr(d.procedure)) bad("procedure required");
  if (!Array.isArray(d.parameters) || !d.parameters.length) bad("at least one measurable parameter required");
  else for (const p of d.parameters) {
    if (!isStr(p.id) || !isStr(p.unit) || p.comparator !== "BETWEEN") bad(`parameter ${p.id}: needs id, unit and comparator BETWEEN`);
    const r = p.range;
    const okRange = r && ((r.mode === "pctOfInput" && isStr(r.input) && fin(r.lowPct) && fin(r.highPct) && r.lowPct <= r.highPct) || (r.mode === "inputBounds" && isStr(r.lowInput) && isStr(r.highInput)));
    if (!okRange) bad(`parameter ${p.id}: range must be pctOfInput{input,lowPct,highPct} or inputBounds{lowInput,highInput}`);
  }
  if (!Array.isArray(d.conditions)) bad("conditions must be an array (may be empty)");
  else for (const c of d.conditions) if (!isStr(c.id) || !(c.comparator === "GTE" && fin(c.value)) && !(c.comparator === "EQUALS" && isStr(c.value))) bad(`condition ${c.id}: needs id and GTE number or EQUALS string`);
  const pv = d.provenance;
  if (!pv || !("source" in pv) || !("edition" in pv) || !("section" in pv) || !isStr(pv.applicability) || !isStr(pv.verificationStatus)) bad("provenance needs source, edition, section, applicability, verificationStatus");
  else if (pv.source === null && pv.representative !== true) bad("an unsourced definition must be explicitly representative:true");
  else if (pv.source === null && pv.verificationStatus !== "unverified") bad("an unsourced definition must be unverified");
  return e;
}
export const definitionHash = d => contentHashOf(d);

// ---- instance (synthetic equipment) -------------------------------------------------------------------------
/** Deterministic instance identity: product + tag only, so it survives input changes; inputsHash tracks inputs. */
export const instanceIdOf = (productId, tag) => "EQI-" + sha(canonical({ productId, tag })).slice(0, 12);
export const inputsHashOf = inputs => contentHashOf(inputs);
export function makeInstance(productId, tag, inputs) {
  return { instanceId: instanceIdOf(productId, tag), productId, tag, inputs, inputsHash: inputsHashOf(inputs), dataMode: "synthetic" };
}

// ---- evaluator ----------------------------------------------------------------------------------------------
export function validateExecutionInput(def, conditions, observations) {
  const e = [], bad = m => e.push({ code: "C_MALFORMED", msg: m });
  if (!conditions || typeof conditions !== "object" || Array.isArray(conditions)) bad("conditions must be an object");
  else for (const [k, v] of Object.entries(conditions)) {
    const c = def.conditions.find(x => x.id === k);
    if (!c) bad(`unknown condition '${k}'`);
    else if (c.comparator === "GTE" ? !fin(v) || v < 0 : !isStr(v)) bad(`condition '${k}' has an invalid value`);
  }
  if (!observations || typeof observations !== "object" || Array.isArray(observations)) bad("observations must be an object");
  else for (const [k, o] of Object.entries(observations)) {
    const p = def.parameters.find(x => x.id === k);
    if (!p) bad(`unknown parameter '${k}'`);
    else if (!o || typeof o !== "object" || !fin(o.value) || o.value < 0) bad(`observation '${k}' must be {value: finite number >= 0, unit}`);
    else if (o.unit !== p.unit) bad(`observation '${k}' unit '${o.unit}' != '${p.unit}'`);
  }
  return e;
}
function bounds(p, instance) {
  const r = p.range;
  if (r.mode === "pctOfInput") { const x = instance.inputs[r.input]; return fin(x) ? { low: x * r.lowPct / 100, high: x * r.highPct / 100 } : null; }
  const lo = instance.inputs[r.lowInput], hi = instance.inputs[r.highInput];
  return fin(lo) && fin(hi) ? { low: lo, high: hi } : null;
}
/** Deterministic. INCOMPLETE (missing/unmet condition or missing observation) takes precedence over FAIL. Ranges are inclusive. */
export function evaluate(def, instance, conditions, observations) {
  const errors = [...validateDefinition(def), ...validateExecutionInput(def, conditions, observations)];
  if (errors.length) return { outcome: null, errors };
  const conditionResults = def.conditions.map(c => {
    const v = conditions[c.id];
    const met = v === undefined ? null : c.comparator === "GTE" ? v >= c.value : v === c.value;
    return { id: c.id, comparator: c.comparator, required: c.value, observed: v ?? null, result: met === null ? "MISSING" : met ? "MET" : "UNMET" };
  });
  const parameterResults = def.parameters.map(p => {
    const o = observations[p.id], b = bounds(p, instance);
    if (!b) return { id: p.id, unit: p.unit, observed: o?.value ?? null, low: null, high: null, result: "MISSING_INPUT" };
    if (o === undefined) return { id: p.id, unit: p.unit, observed: null, low: b.low, high: b.high, result: "MISSING" };
    return { id: p.id, unit: p.unit, observed: o.value, low: b.low, high: b.high, result: o.value >= b.low && o.value <= b.high ? "IN_RANGE" : "OUT_OF_RANGE" };
  });
  const incomplete = conditionResults.some(c => c.result !== "MET") || parameterResults.some(p => p.result === "MISSING" || p.result === "MISSING_INPUT");
  const outcome = incomplete ? "INCOMPLETE" : parameterResults.some(p => p.result === "OUT_OF_RANGE") ? "FAIL" : "PASS";
  return { outcome, conditionResults, parameterResults, errors: [] };
}

// ---- execution envelope (E0 kind "commissioning-test") ------------------------------------------------------
export const logicalIdOf = (instanceId, definitionId) => "CX-" + sha(canonical({ instanceId, definitionId })).slice(0, 12);
export function buildExecutionEnvelope({ def, instance, conditions, observations, revision = 1, supersedes = null, artifactRefs = [], note = "SYNTHETIC simulated observations" }) {
  const ev = evaluate(def, instance, conditions, observations);
  if (ev.errors.length) throw new Error("malformed execution input: " + ev.errors.map(x => x.msg).join("; "));
  const payload = {
    definitionId: def.definitionId, definitionRevision: def.revision, definitionHash: definitionHash(def),
    instanceId: instance.instanceId, instanceInputsHash: instance.inputsHash, instanceInputs: instance.inputs,
    conditions, observations, conditionResults: ev.conditionResults, parameterResults: ev.parameterResults,
    outcome: ev.outcome, outcomeMeaning: MEANING, artifactRefs, dataMode: "synthetic", note,
  };
  const logicalId = logicalIdOf(instance.instanceId, def.definitionId), contentHash = contentHashOf(payload);
  return {
    kind: "commissioning-test", logicalId, revisionId: revisionIdOf(logicalId, revision, contentHash), contentHash, revision, supersedes,
    basis: "declared", verification: "unverified", verificationScope: null, verificationMethod: null, verificationBasis: null,
    verifiedRevisionId: null, artifactRefs: [], verificationTimestamp: null,
    validity: "current", workflow: "draft", approval: "pending", approvedRevisionId: null,
    complianceClaim: "NONE", ruleBindings: [], clash: null, payload,
  };
}

// ---- append-only ledger -------------------------------------------------------------------------------------
const eventBody = ev => { const { eventId, ...rest } = ev; return rest; };
export const eventIdOf = ev => "EVT-" + sha(canonical(eventBody(ev))).slice(0, 12);
/** Build the next event of a ledger. `from` must be supplied by the caller (the fold checks it). */
export function makeEvent(ledger, spec) {
  const prev = ledger.length ? ledger[ledger.length - 1] : null;
  const ev = { seq: ledger.length + 1, logicalId: spec.logicalId, revisionId: spec.revisionId, dimension: spec.dimension, from: spec.from, to: spec.to, actorRole: spec.actorRole, timestamp: spec.timestamp, detail: spec.detail ?? {}, prevEventId: prev ? prev.eventId : null };
  return { ...ev, eventId: eventIdOf(ev) };
}

/**
 * Replay a ledger against a set of execution envelopes. Returns { errors:[{code,msg}], states: {revisionId: state} }.
 * states[rev] = { verification, validity, workflow, approval, verifiedRevisionId, approvedRevisionId, detail... }.
 */
export function foldLedger(envelopes, events, anchors = []) {
  const errors = [], err = (code, msg) => errors.push({ code, msg });
  const byRev = new Map(envelopes.map(e => [e.revisionId, e])), states = new Map();
  for (const e of envelopes) states.set(e.revisionId, { ...INITIAL, verifiedRevisionId: null, approvedRevisionId: null, verificationDetail: null });
  let prevTs = "";
  events.forEach((ev, i) => {
    const at = `event ${i + 1}`;
    if (ev.seq !== i + 1) err("C_LEDGER_CHAIN", `${at}: seq ${ev.seq} not consecutive`);
    if (ev.prevEventId !== (i ? events[i - 1].eventId : null)) err("C_LEDGER_CHAIN", `${at}: prevEventId breaks the chain (history altered or removed)`);
    if (ev.eventId !== eventIdOf(ev)) err("C_LEDGER_CHAIN", `${at}: eventId does not match event content (tampered)`);
    if (typeof ev.timestamp !== "string" || !ISO.test(ev.timestamp) || Number.isNaN(Date.parse(ev.timestamp))) err("C_LEDGER_CHAIN", `${at}: timestamp must be a fixture-supplied ISO-8601 UTC string`);
    else { if (ev.timestamp < prevTs) err("C_LEDGER_CHAIN", `${at}: timestamp goes backwards`); prevTs = ev.timestamp; }
    const env = byRev.get(ev.revisionId), st = states.get(ev.revisionId);
    if (!env) return err("C_LEDGER_CHAIN", `${at}: affected revisionId ${ev.revisionId} is not a known revision`);
    if (ev.logicalId !== env.logicalId) err("C_LEDGER_CHAIN", `${at}: logicalId does not match the affected revision`);
    const table = TRANSITIONS[ev.dimension];
    if (!table) return err("C_TRANSITION", `${at}: unknown dimension '${ev.dimension}'`);
    if (ev.from !== st[ev.dimension]) return err("C_TRANSITION", `${at}: ${ev.dimension} 'from' ${ev.from} != current ${st[ev.dimension]}`);
    const roles = table[`${ev.from}>${ev.to}`];
    if (!roles) return err("C_TRANSITION", `${at}: illegal ${ev.dimension} transition ${ev.from} -> ${ev.to}`);
    if (!roles.includes(ev.actorRole)) err("C_ROLE", `${at}: role '${ev.actorRole}' may not do ${ev.dimension} ${ev.from} -> ${ev.to} (allowed: ${roles.join("/")})`);
    const d = ev.detail ?? {};
    if (ev.dimension === "verification") {
      if (d.verificationScope !== "mathematical") err("C_SCOPE", `${at}: verificationScope must be 'mathematical' (got '${d.verificationScope}')`);
      if (![d.verificationMethod, d.verificationBasis].every(isStr) || !Array.isArray(d.artifactRefs) || !d.artifactRefs.length) err("C_VERIFY_FIELDS", `${at}: verification needs method, basis and artifactRefs`);
      if (d.verifiedRevisionId !== ev.revisionId) err("C_VERIFY_PIN", `${at}: verification must name this exact revisionId`);
      if (ev.to === "verified" && d.recomputedOutcome !== env.payload.outcome) err("C_OUTCOME_MISMATCH", `${at}: reviewer recomputed ${d.recomputedOutcome} but the record says ${env.payload.outcome}`);
      st.verifiedRevisionId = d.verifiedRevisionId ?? null; st.verificationDetail = d;
    }
    if (ev.dimension === "approval" && ev.to === "accepted") {
      if (env.payload.outcome !== "PASS") err("C_ACCEPT_GUARD", `${at}: only a PASS can be accepted (outcome ${env.payload.outcome})`);
      if (st.validity !== "current") err("C_ACCEPT_GUARD", `${at}: acceptance requires validity current`);
      if (st.verification !== "verified" || st.verifiedRevisionId !== ev.revisionId) err("C_ACCEPT_GUARD", `${at}: acceptance requires verification against this exact revisionId`);
      if (st.workflow !== "submitted") err("C_ACCEPT_GUARD", `${at}: acceptance requires workflow 'submitted' (no draft shortcut)`);
      if (d.approvedRevisionId !== ev.revisionId) err("C_APPROVAL_PIN", `${at}: approval must pin the executed revisionId, not the logicalId or another revision`);
      st.approvedRevisionId = d.approvedRevisionId ?? null;
    }
    st[ev.dimension] = ev.to;
  });
  for (const a of anchors) if (!events[a.seq - 1] || events[a.seq - 1].eventId !== a.eventId) err("C_LEDGER_CHAIN", `anchor seq ${a.seq} (${a.eventId}) missing: ledger history was overwritten`);
  return { errors, states };
}

/** E0 envelope view of one execution with ledger-folded state (for E0 validation / display). */
export function materialize(env, state) {
  const v = state.verification !== "unverified", d = state.verificationDetail ?? {};
  return {
    ...env, verification: state.verification, validity: state.validity, workflow: state.workflow, approval: state.approval,
    verificationScope: v ? d.verificationScope ?? null : null, verificationMethod: v ? d.verificationMethod ?? null : null, verificationBasis: v ? d.verificationBasis ?? null : null,
    verifiedRevisionId: v ? state.verifiedRevisionId : null, artifactRefs: v ? d.artifactRefs ?? [] : [], verificationTimestamp: v ? d.timestamp ?? null : null,
    approvedRevisionId: state.approval === "accepted" ? state.approvedRevisionId : null,
  };
}

/**
 * Whole-lifecycle validation. `current` = { definitions: {definitionId: latest definition}, instances: {instanceId: instance} }.
 * Returns [{code,msg}].
 */
export function validateLifecycle({ envelopes, events, anchors = [], current }) {
  const errs = [];
  for (const e of envelopes) {
    for (const x of validateEnvelope(e)) errs.push({ code: "C_E0", msg: `${e.revisionId}: ${x.code} ${x.path}` });
    if (e.kind !== "commissioning-test") errs.push({ code: "C_E0", msg: `${e.revisionId}: kind must be commissioning-test` });
  }
  const chain = validateChain(envelopes.map(e => ({ ...e })));
  chain.forEach(x => errs.push({ code: "C_RETEST", msg: x.msg }));
  const ids = new Set(envelopes.map(e => e.revisionId));
  for (const e of envelopes) if (e.supersedes !== null && !ids.has(e.supersedes)) errs.push({ code: "C_RETEST", msg: `${e.revisionId}: supersedes ${e.supersedes} which is not in history (original result lost)` });
  const { errors, states } = foldLedger(envelopes, events, anchors);
  errs.push(...errors);
  for (const e of envelopes) {
    const p = e.payload, def = current.definitions[p.definitionId], inst = current.instances[p.instanceId];
    const st = states.get(e.revisionId);
    if (!def || !inst) { errs.push({ code: "C_DEFINITION", msg: `${e.revisionId}: unknown definition or instance` }); continue; }
    const stale = p.definitionRevision !== def.revision || p.definitionHash !== definitionHash(def) || p.instanceInputsHash !== inst.inputsHash;
    if (stale && st.validity === "current" && (st.verification === "verified" || st.approval === "accepted")) errs.push({ code: "C_STALE", msg: `${e.revisionId}: definition or equipment inputs changed but verification/approval is still 'current'` });
    // recompute the outcome from the record, using the definition revision and equipment inputs it was executed against
    const used = (current.history?.[p.definitionId] ?? [def]).find(d => d.revision === p.definitionRevision);
    if (!used || definitionHash(used) !== p.definitionHash) errs.push({ code: "C_DEFINITION", msg: `${e.revisionId}: executed definition revision ${p.definitionRevision} is unknown or its hash differs` });
    else if (inputsHashOf(p.instanceInputs) !== p.instanceInputsHash) errs.push({ code: "C_OUTCOME_MISMATCH", msg: `${e.revisionId}: instanceInputs snapshot does not match instanceInputsHash` });
    else {
      const re = evaluate(used, { ...inst, inputs: p.instanceInputs }, p.conditions, p.observations);
      if (re.errors.length) errs.push({ code: "C_MALFORMED", msg: `${e.revisionId}: ${re.errors.map(x => x.msg).join("; ")}` });
      else if (re.outcome !== p.outcome) errs.push({ code: "C_OUTCOME_MISMATCH", msg: `${e.revisionId}: recorded ${p.outcome} but evaluator gives ${re.outcome}` });
    }
    if (!errors.length) for (const x of validateEnvelope(materialize(e, st))) errs.push({ code: "C_E0", msg: `${e.revisionId} (ledger view): ${x.code} ${x.path}` });
  }
  return errs;
}

// ---- read-only ACTS association -----------------------------------------------------------------------------
/** The lab has no per-system commissioning activity; A14 (Startup / Commissioning, span) is the lab-wide one. Display only. */
export const COMMISSIONING_ACTIVITY_ID = "A14";
export function resolveActsAssociation(acts, product) {
  const own = acts.find(a => a.id === product.activityId), cx = acts.find(a => a.id === COMMISSIONING_ACTIVITY_ID);
  if (!own || !cx) return null;
  return {
    readOnly: true, productId: product.id,
    productActivity: { id: own.id, code: own.code, name: own.name },
    commissioningActivity: { id: cx.id, code: cx.code, name: cx.name, driver: cx.driver, unit: cx.unit, crew: cx.crew, kind: cx.kind },
    costCodes: ["L", "M", "C", "S", "E"].map(c => `${cx.code}-${c}`),
    note: "reference only: no quantity, cost or estimate() change; A14 is driven by DAYS, not by this test",
  };
}
