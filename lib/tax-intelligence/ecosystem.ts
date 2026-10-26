// ARTEMIS Tax Intelligence — M2.8.1 ecosystem relationship validator (synthetic only).
// Implements the M2.8.1 handoff (M281_APOLLOA_FORMATION_AND_ECOSYSTEM_HANDOFF_R01)
// and the GPT-6 foundation-review corrections (M28_GPT6_FOUNDATION_REVIEW_R01):
//  - Closed relation table; unknown/legacy/malformed relation strings at
//    runtime -> coded ILLEGAL_EDGE, edge excluded, never a TypeError (Grok G-07).
//  - No subsidiary/equity/control/agency/tax-consolidation claim may be
//    derived from non-equity edges, alone or in combination (G-01/G-02).
//  - Activation is relation-type-specific (GPT-6 P1): per-type endpoint
//    kinds, minimum confidence, legal-basis document class, evidence class,
//    owner approval by an authorised actor via a resolvable APPROVED
//    Decision record. Free text and AI actors confer zero authority (G-06).
//  - legalBasisDocumentIds are referentially checked: the cited document
//    must exist in the same tenant, be status EXECUTED and signatureStatus
//    SIGNED_VERIFIED, and be of the document class the relation requires
//    (GPT-6 P0-2). Evidence is never a legal basis.
//  - A pre-registration participant can never be activated as a legal
//    entity, equity target, or legal operator without formation evidence
//    (D-02; Grok G-02). Kind is never inferred from an edge or a name.
//  - Public projection is an allowlist serializer constructing new objects
//    from scalar fields only (GPT-6 P0-3); private refs, hashes,
//    percentages, tenant ids and dates never cross it.
// No persistence, no providers, no legal/tax determination: an activation
// here means only "the synthetic registry's own gates were satisfied".

export type EntityKind =
  | "legal_entity" | "individual" | "brand" | "project"
  | "system" | "account" | "asset";

export type VerificationStatus =
  | "UNKNOWN" | "ASSERTED" | "SUPPORTED" | "EXTERNALLY_VERIFIED" | "DISPUTED";

export type EntityRecord = {
  id: string;
  tenantId: string;
  kind: EntityKind;
  displayName: string;
  // "pre-registration" = owner-confirmed initiative, NOT a legal person.
  // "formed" may be claimed only with formationEvidenceRefs (checked below).
  legalStatus: "pre-registration" | "formed" | null;
  verificationStatus: VerificationStatus;
  formationEvidenceRefs?: string[];
  identifiersRef?: string | null; // private; never serialized publicly
  [extra: string]: unknown; // tolerated on input; never copied to output
};

export type DocumentClass =
  | "formation" | "equity" | "services_agreement" | "ip_assignment"
  | "operating" | "participation_terms" | "other";

export type RegistryDocument = {
  id: string;
  tenantId: string;
  type: string; // e.g. "OPERATING_AGREEMENT" or "*_TEMPLATE" variants
  docClass: DocumentClass;
  status:
    | "DRAFT_ASSUMPTION" | "DRAFT_REVIEWED" | "APPROVED_INTERNAL"
    | "EXECUTED" | "EVIDENCE_RECEIVED" | "EXTERNALLY_VERIFIED"
    | "REJECTED" | "SUPERSEDED" | "UNKNOWN";
  signatureStatus:
    | "UNSIGNED_TEMPLATE" | "UNSIGNED" | "SIGNED_UNVERIFIED" | "SIGNED_VERIFIED";
  executedOn?: string | null; // strict YYYY-MM-DD when present
};

export type DecisionRecord = {
  id: string;
  tenantId: string;
  status: "UNKNOWN" | "PROVISIONAL" | "APPROVED" | "REJECTED" | "SUPERSEDED";
  decidedBy: string | null;
  decidedAt: string | null; // ISO datetime; date part used for backdating
};

export type RelationType =
  | "participates_in_platform" | "provides_services_to" | "owns_equity_in"
  | "owns_ip" | "operates_activity_as" | "has_contract_with";

export type Confidence = "asserted" | "supported" | "verified" | "disputed" | "unknown";
export type Lifecycle = "proposed" | "active" | "suspended" | "terminated";

export type RelationshipRecord = {
  id: string;
  tenantId: string;
  fromId: string;
  toId: string;
  relationType: string; // string at runtime on purpose: untyped input is the threat model
  confidence: Confidence;
  lifecycle: Lifecycle;
  effectiveFrom: string | null; // strict YYYY-MM-DD
  effectiveTo: string | null; // null = open-ended (+infinity)
  evidenceRefs: string[];
  legalBasisDocumentIds: string[];
  legalEntityScope: string | null;
  ownerApprovalRef: string | null; // must resolve to a DecisionRecord id
  revision: number; // safe integer >= 1
  feeBearing?: boolean;
  [extra: string]: unknown;
};

export type DerivedClaim = { fromId: string; toId: string; claim: string };

export type EcosystemInput = {
  entities: EntityRecord[];
  documents: RegistryDocument[];
  decisions: DecisionRecord[];
  edges: RelationshipRecord[];
  derivedClaims?: DerivedClaim[];
};

export type EcosystemException = {
  code: string;
  edgeIds: string[];
  entityIds: string[];
};

export type EcosystemResult = {
  exceptions: EcosystemException[];
  activeEdgeIds: string[]; // edges whose activation claim survived every gate
  proposedEdgeIds: string[]; // structurally valid, not claimed active
};

const RELATION_TYPES: ReadonlySet<string> = new Set([
  "participates_in_platform", "provides_services_to", "owns_equity_in",
  "owns_ip", "operates_activity_as", "has_contract_with",
]);

const EQUITY_VOCABULARY: ReadonlySet<string> = new Set([
  "subsidiary", "control", "owns_equity_in", "agency", "tax_consolidation",
  "consolidation", "parent_of", "owns",
]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
function isRealDate(s: unknown): s is string {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Endpoint-kind rules and per-type activation requirements (Grok §2 table,
// reconciled with the v0.1 registry kinds by the integrator).
type TypeRule = {
  fromKinds: EntityKind[];
  toKinds: EntityKind[];
  minConfidence: Confidence;
  basisClass: DocumentClass | null; // null = no legal basis required (participation)
  scopeRule: "none" | "if_fee_bearing" | "target" | "operator";
};
const RULES: Record<RelationType, TypeRule> = {
  participates_in_platform: {
    fromKinds: ["brand", "project", "legal_entity"], toKinds: ["system", "project"],
    minConfidence: "supported", basisClass: null, scopeRule: "none",
  },
  provides_services_to: {
    fromKinds: ["legal_entity", "individual"],
    toKinds: ["legal_entity", "brand", "project", "system"],
    minConfidence: "supported", basisClass: "services_agreement", scopeRule: "if_fee_bearing",
  },
  owns_equity_in: {
    fromKinds: ["legal_entity", "individual"], toKinds: ["legal_entity"],
    minConfidence: "verified", basisClass: "equity", scopeRule: "target",
  },
  owns_ip: {
    fromKinds: ["legal_entity", "individual"], toKinds: ["asset", "brand"],
    minConfidence: "verified", basisClass: "ip_assignment", scopeRule: "if_fee_bearing",
  },
  operates_activity_as: {
    fromKinds: ["legal_entity"], toKinds: ["brand", "project"],
    minConfidence: "verified", basisClass: "operating", scopeRule: "operator",
  },
  has_contract_with: {
    fromKinds: ["legal_entity", "individual"], toKinds: ["legal_entity", "individual"],
    minConfidence: "supported", basisClass: "services_agreement", scopeRule: "if_fee_bearing",
  },
};
const CONF_RANK: Record<Confidence, number> = {
  unknown: 0, asserted: 1, disputed: 1, supported: 2, verified: 3,
};
const EVIDENCE_OK: ReadonlySet<string> = new Set([
  "EVIDENCE_RECEIVED", "EXTERNALLY_VERIFIED", "EXECUTED",
]);

export function validateEcosystem(
  input: EcosystemInput,
  opts: { authorizedApprovers: string[] },
): EcosystemResult {
  const exceptions: EcosystemException[] = [];
  const push = (code: string, edgeIds: string[] = [], entityIds: string[] = []) =>
    exceptions.push({ code, edgeIds: [...edgeIds].sort(), entityIds: [...entityIds].sort() });

  const approvers = new Set(opts?.authorizedApprovers ?? []);
  const entities = Array.isArray(input?.entities) ? input.entities : [];
  const documents = Array.isArray(input?.documents) ? input.documents : [];
  const decisions = Array.isArray(input?.decisions) ? input.decisions : [];
  const edges = Array.isArray(input?.edges) ? input.edges : [];

  const entityById = new Map<string, EntityRecord>();
  for (const e of entities) {
    if (!e || typeof e.id !== "string") continue;
    const prior = entityById.get(e.id);
    if (prior && prior.kind !== e.kind) push("DUPLICATE_ENTITY_ID", [], [e.id]);
    if (!prior) entityById.set(e.id, e);
  }
  const docById = new Map(documents.filter((d) => d && typeof d.id === "string").map((d) => [d.id, d]));
  const decisionById = new Map(decisions.filter((d) => d && typeof d.id === "string").map((d) => [d.id, d]));

  // ---- Entity gate: a "formed" legal entity claim needs formation evidence.
  const formationFailed = new Set<string>();
  for (const e of entities) {
    if (!e || e.kind !== "legal_entity" || e.legalStatus !== "formed") continue;
    const refs = Array.isArray(e.formationEvidenceRefs) ? e.formationEvidenceRefs : [];
    if (refs.length === 0) { push("FORMATION_EVIDENCE_MISSING", [], [e.id]); formationFailed.add(e.id); continue; }
    let qualified = false; let sawTemplate = false; let resolvedAny = false;
    for (const ref of refs) {
      const doc = docById.get(ref);
      if (!doc) continue;
      if (doc.tenantId !== e.tenantId) { push("CROSS_TENANT_REFERENCE", [], [e.id]); continue; }
      resolvedAny = true;
      if (doc.type.endsWith("_TEMPLATE") || doc.signatureStatus === "UNSIGNED_TEMPLATE") sawTemplate = true;
      if (doc.docClass === "formation" && EVIDENCE_OK.has(doc.status)) qualified = true;
    }
    if (!qualified) {
      formationFailed.add(e.id);
      if (sawTemplate) push("LEGAL_BASIS_NOT_EXECUTED", [], [e.id]);
      else if (resolvedAny) push("WRONG_EVIDENCE_CLASS", [], [e.id]);
      else push("FORMATION_EVIDENCE_MISSING", [], [e.id]);
    }
  }

  const activeCandidates: RelationshipRecord[] = [];
  const proposedEdgeIds: string[] = [];

  for (const edge of edges) {
    if (!edge || typeof edge.id !== "string") continue;
    const fail = (code: string) => push(code, [edge.id]);
    // Structural gates apply to every edge, whatever its lifecycle.
    if (typeof edge.relationType !== "string" || !RELATION_TYPES.has(edge.relationType)) {
      fail("ILLEGAL_EDGE"); continue;
    }
    if (edge.fromId === edge.toId) { fail("ILLEGAL_EDGE"); continue; }
    if (!Number.isSafeInteger(edge.revision) || edge.revision < 1) { fail("INVALID_REVISION"); continue; }
    if (edge.effectiveFrom !== null && !isRealDate(edge.effectiveFrom)) { fail("INVALID_EFFECTIVE_RANGE"); continue; }
    if (edge.effectiveTo !== null && !isRealDate(edge.effectiveTo)) { fail("INVALID_EFFECTIVE_RANGE"); continue; }
    if (edge.effectiveFrom && edge.effectiveTo && edge.effectiveTo < edge.effectiveFrom) {
      fail("INVALID_EFFECTIVE_RANGE"); continue;
    }
    const from = entityById.get(edge.fromId);
    const to = entityById.get(edge.toId);
    if (!from || !to) { fail("UNRESOLVED_EVIDENCE_REF"); continue; }
    if (from.tenantId !== edge.tenantId || to.tenantId !== edge.tenantId) {
      fail("CROSS_TENANT_REFERENCE"); continue;
    }
    if (edge.lifecycle !== "active") { proposedEdgeIds.push(edge.id); continue; }

    // ---- Activation gates (edge claims lifecycle: active).
    const rule = RULES[edge.relationType as RelationType];
    if (!rule.fromKinds.includes(from.kind) || !rule.toKinds.includes(to.kind)) {
      fail("ENDPOINT_KIND_MISMATCH"); continue;
    }
    if (edge.relationType === "owns_equity_in" &&
        (to.legalStatus !== "formed" || formationFailed.has(to.id))) {
      fail("FORMATION_EVIDENCE_MISSING"); continue;
    }
    if (edge.relationType === "operates_activity_as" &&
        (from.legalStatus !== "formed" || formationFailed.has(from.id) ||
         from.verificationStatus !== "EXTERNALLY_VERIFIED")) {
      fail("FORMATION_EVIDENCE_MISSING"); continue;
    }
    if (CONF_RANK[edge.confidence] < CONF_RANK[rule.minConfidence] ||
        edge.confidence === "asserted" || edge.confidence === "unknown" || edge.confidence === "disputed") {
      fail("CONFIDENCE_TOO_LOW_FOR_ACTIVATION"); continue;
    }
    // Owner approval: resolvable APPROVED Decision by an authorised actor.
    const ref = edge.ownerApprovalRef;
    if (typeof ref !== "string" || ref.length === 0) { fail("FREE_TEXT_APPROVAL_REJECTED"); continue; }
    if (/\s/.test(ref)) { fail("FREE_TEXT_APPROVAL_REJECTED"); continue; }
    const decision = decisionById.get(ref);
    if (!decision) {
      const elsewhere = decisions.find((d) => d && d.id === ref);
      fail(elsewhere ? "CROSS_TENANT_REFERENCE" : "UNRESOLVED_DECISION_REF"); continue;
    }
    if (decision.tenantId !== edge.tenantId) { fail("CROSS_TENANT_REFERENCE"); continue; }
    if (decision.status !== "APPROVED") { fail("DECISION_NOT_APPROVED"); continue; }
    if (!decision.decidedBy || !approvers.has(decision.decidedBy)) { fail("UNAUTHORIZED_ACTOR"); continue; }
    if (!decision.decidedAt || !isRealDate(decision.decidedAt.slice(0, 10))) {
      fail("DECISION_NOT_APPROVED"); continue;
    }
    // Legal basis: referential, EXECUTED + SIGNED_VERIFIED, right class.
    const basisIds = Array.isArray(edge.legalBasisDocumentIds) ? edge.legalBasisDocumentIds : [];
    let basisDocs: RegistryDocument[] = [];
    let basisFailed = false;
    for (const bid of basisIds) {
      const doc = docById.get(bid);
      if (!doc) { fail("UNRESOLVED_EVIDENCE_REF"); basisFailed = true; break; }
      if (doc.tenantId !== edge.tenantId) { fail("CROSS_TENANT_REFERENCE"); basisFailed = true; break; }
      basisDocs.push(doc);
    }
    if (basisFailed) continue;
    if (rule.basisClass !== null) {
      if (basisDocs.length === 0) { fail("LEGAL_BASIS_NOT_EXECUTED"); continue; }
      const bad = basisDocs.find((d) => d.status !== "EXECUTED" || d.signatureStatus !== "SIGNED_VERIFIED");
      if (bad) { fail("LEGAL_BASIS_NOT_EXECUTED"); continue; }
      const right = basisDocs.find((d) => d.docClass === rule.basisClass);
      if (!right) { fail("WRONG_EVIDENCE_CLASS"); continue; }
      basisDocs = [right];
    } else {
      const bad = basisDocs.find((d) => d.status !== "EXECUTED" || d.signatureStatus !== "SIGNED_VERIFIED");
      if (bad) { fail("LEGAL_BASIS_NOT_EXECUTED"); continue; }
    }
    // Evidence: participation needs received evidence; other types may cite
    // evidence freely, but a cited ref must resolve in-tenant.
    const evidenceRefs = Array.isArray(edge.evidenceRefs) ? edge.evidenceRefs : [];
    let evidenceFailed = false;
    for (const refId of evidenceRefs) {
      const doc = docById.get(refId);
      if (!doc) { fail("UNRESOLVED_EVIDENCE_REF"); evidenceFailed = true; break; }
      if (doc.tenantId !== edge.tenantId) { fail("CROSS_TENANT_REFERENCE"); evidenceFailed = true; break; }
    }
    if (evidenceFailed) continue;
    if (edge.relationType === "participates_in_platform") {
      const ok = evidenceRefs.some((refId) => {
        const d = docById.get(refId);
        return d && EVIDENCE_OK.has(d.status);
      });
      if (!ok) { fail("EVIDENCE_MISSING"); continue; }
    }
    // Legal-entity scope for financial relations.
    const scope = edge.legalEntityScope;
    const scopeMissing = scope === null || scope === undefined || scope === "" || scope === "UNKNOWN";
    if (rule.scopeRule === "target") {
      if (scopeMissing) { fail("MISSING_LEGAL_ENTITY_SCOPE"); continue; }
      if (scope !== edge.toId) { fail("LEGAL_ENTITY_SCOPE_MISMATCH"); continue; }
    } else if (rule.scopeRule === "operator") {
      if (scopeMissing) { fail("MISSING_LEGAL_ENTITY_SCOPE"); continue; }
      if (scope !== edge.fromId) { fail("LEGAL_ENTITY_SCOPE_MISMATCH"); continue; }
    } else if (rule.scopeRule === "if_fee_bearing" && edge.feeBearing) {
      if (scopeMissing) { fail("MISSING_LEGAL_ENTITY_SCOPE"); continue; }
      if (scope !== edge.fromId && scope !== edge.toId) { fail("LEGAL_ENTITY_SCOPE_MISMATCH"); continue; }
    }
    // Backdating: activation may not predate its basis execution or decision.
    if (edge.effectiveFrom) {
      const decidedDate = decision.decidedAt.slice(0, 10);
      if (edge.effectiveFrom < decidedDate) { fail("BACKDATED_ACTIVATION"); continue; }
      const basis = basisDocs[0];
      if (basis?.executedOn && edge.effectiveFrom < basis.executedOn) {
        fail("BACKDATED_ACTIVATION"); continue;
      }
    }
    activeCandidates.push(edge);
  }

  // ---- Cross-edge gates among surviving active candidates.
  const key = (e: RelationshipRecord) => `${e.fromId}→${e.toId}:${e.relationType}`;
  const byKey = new Map<string, RelationshipRecord[]>();
  for (const e of activeCandidates) {
    const k = key(e);
    byKey.set(k, [...(byKey.get(k) ?? []), e]);
  }
  const excluded = new Set<string>();
  const overlaps = (a: RelationshipRecord, b: RelationshipRecord) => {
    const aFrom = a.effectiveFrom ?? "0000-01-01"; const aTo = a.effectiveTo ?? "9999-12-31";
    const bFrom = b.effectiveFrom ?? "0000-01-01"; const bTo = b.effectiveTo ?? "9999-12-31";
    return aFrom < bTo && bFrom < aTo;
  };
  for (const group of byKey.values()) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((x, y) => x.revision - y.revision || (x.id < y.id ? -1 : 1));
    for (let i = 1; i < sorted.length; i++) {
      for (let j = 0; j < i; j++) {
        if (!excluded.has(sorted[j].id) && overlaps(sorted[i], sorted[j])) {
          push("OVERLAPPING_ACTIVE_REVISION", [sorted[i].id]);
          excluded.add(sorted[i].id);
          break;
        }
      }
    }
  }
  // Equity cycles: A owns B and B owns A can never both stand.
  const equityActive = activeCandidates.filter(
    (e) => e.relationType === "owns_equity_in" && !excluded.has(e.id),
  );
  for (const e of equityActive) {
    const reverse = equityActive.find((r) => r.fromId === e.toId && r.toId === e.fromId && r.id > e.id);
    if (reverse) { push("EQUITY_CYCLE", [reverse.id]); excluded.add(reverse.id); }
  }

  // ---- Derived claims: equity vocabulary may never be derived.
  for (const claim of Array.isArray(input?.derivedClaims) ? input.derivedClaims : []) {
    if (!claim || typeof claim.claim !== "string") continue;
    if (!EQUITY_VOCABULARY.has(claim.claim)) continue;
    const direct = activeCandidates.some(
      (e) => e.relationType === "owns_equity_in" && e.fromId === claim.fromId &&
             e.toId === claim.toId && !excluded.has(e.id),
    );
    if (claim.claim === "tax_consolidation" || claim.claim === "consolidation") {
      push("CROSS_ENTITY_ALLOCATION", [], [claim.fromId, claim.toId]);
    } else if (!direct) {
      push("SUBSIDIARY_INFERENCE_FORBIDDEN", [], [claim.fromId, claim.toId]);
    }
  }

  const activeEdgeIds = activeCandidates.filter((e) => !excluded.has(e.id)).map((e) => e.id).sort();
  exceptions.sort((a, b) =>
    a.code < b.code ? -1 : a.code > b.code ? 1
    : (a.edgeIds[0] ?? "") < (b.edgeIds[0] ?? "") ? -1 : 1);
  return { exceptions, activeEdgeIds, proposedEdgeIds: proposedEdgeIds.sort() };
}

// ---- Public projection: allowlist only, constructed fresh from scalars.
export type PublicEntity = { id: string; displayName: string; kind: EntityKind };
export type PublicEdge = {
  id: string; fromId: string; toId: string; relationType: string; lifecycle: Lifecycle;
};
export function toPublicEntity(e: EntityRecord): PublicEntity {
  return { id: String(e.id), displayName: String(e.displayName), kind: e.kind };
}
export function toPublicEdge(e: RelationshipRecord): PublicEdge {
  return {
    id: String(e.id), fromId: String(e.fromId), toId: String(e.toId),
    relationType: String(e.relationType), lifecycle: e.lifecycle,
  };
}
