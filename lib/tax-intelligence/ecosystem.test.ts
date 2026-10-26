import { describe, expect, it } from "vitest";
import {
  toPublicEdge, toPublicEntity, validateEcosystem,
  type DecisionRecord, type EcosystemInput, type EntityRecord,
  type RegistryDocument, type RelationshipRecord,
} from "./ecosystem";

// Synthetic fixtures only — every party, document and decision below is
// invented for validation testing. Names resembling real initiatives are
// labels; no fixture asserts a real formation, ownership, or legal fact.
// Implements the Grok adversarial test list for M2.8.1 (N-01..N-28 negative,
// P-01..P-08 positive controls). Assertions are on stable exception CODES
// and exact public shapes — never on message text.

const T = "tenant-a";
const OPTS = { authorizedApprovers: ["owner-1"] };

const ent = (id: string, p: Partial<EntityRecord> & { kind: EntityRecord["kind"] }): EntityRecord => ({
  id, tenantId: T, displayName: id, legalStatus: null,
  verificationStatus: "UNKNOWN", ...p,
});
const doc = (id: string, p: Partial<RegistryDocument> & { docClass: RegistryDocument["docClass"] }): RegistryDocument => ({
  id, tenantId: T, type: "SYNTHETIC_RECORD", status: "EVIDENCE_RECEIVED",
  signatureStatus: "UNSIGNED", executedOn: null, ...p,
});
const dec = (id: string, p: Partial<DecisionRecord> = {}): DecisionRecord => ({
  id, tenantId: T, status: "APPROVED", decidedBy: "owner-1",
  decidedAt: "2026-01-15T00:00:00Z", ...p,
});
const edge = (id: string, fromId: string, toId: string, relationType: string,
  p: Partial<RelationshipRecord> = {}): RelationshipRecord => ({
  id, tenantId: T, fromId, toId, relationType, confidence: "supported",
  lifecycle: "active", effectiveFrom: "2026-02-01", effectiveTo: null,
  evidenceRefs: [], legalBasisDocumentIds: [], legalEntityScope: null,
  ownerApprovalRef: "dec-ok", revision: 1, ...p,
});

const formationDoc = doc("doc-formation", { docClass: "formation", status: "EVIDENCE_RECEIVED" });
const servicesDoc = doc("doc-services", {
  docClass: "services_agreement", status: "EXECUTED",
  signatureStatus: "SIGNED_VERIFIED", executedOn: "2026-01-10",
});
const equityDoc = doc("doc-equity", {
  docClass: "equity", status: "EXECUTED",
  signatureStatus: "SIGNED_VERIFIED", executedOn: "2026-01-10",
});
const ipDoc = doc("doc-ip", {
  docClass: "ip_assignment", status: "EXECUTED",
  signatureStatus: "SIGNED_VERIFIED", executedOn: "2026-01-10",
});
const operatingDoc = doc("doc-operating", {
  docClass: "operating", status: "EXECUTED",
  signatureStatus: "SIGNED_VERIFIED", executedOn: "2026-01-10",
});
const termsDoc = doc("doc-terms", { docClass: "participation_terms", status: "EVIDENCE_RECEIVED" });
const templateDoc = doc("doc-template", {
  docClass: "formation", type: "FORMATION_PACKET_TEMPLATE",
  status: "DRAFT_ASSUMPTION", signatureStatus: "UNSIGNED_TEMPLATE",
});
const receivedDoc = doc("doc-received", {
  docClass: "ip_assignment", status: "EVIDENCE_RECEIVED", signatureStatus: "SIGNED_UNVERIFIED",
});

const apolloa = ent("apolloa", { kind: "brand", legalStatus: "pre-registration" });
const agora = ent("agora-platform", { kind: "system" });
const artemisLE = ent("artemis-le", {
  kind: "legal_entity", legalStatus: "formed",
  verificationStatus: "EXTERNALLY_VERIFIED", formationEvidenceRefs: ["doc-formation"],
});
const synthA = ent("synth-a", {
  kind: "legal_entity", legalStatus: "formed",
  verificationStatus: "EXTERNALLY_VERIFIED", formationEvidenceRefs: ["doc-formation"],
});
const synthB = ent("synth-b", {
  kind: "legal_entity", legalStatus: "formed",
  verificationStatus: "EXTERNALLY_VERIFIED", formationEvidenceRefs: ["doc-formation"],
});
const ipAsset = ent("ip-asset", { kind: "asset" });
const activity = ent("activity-x", { kind: "project" });

const base = (p: Partial<EcosystemInput>): EcosystemInput => ({
  entities: [apolloa, agora, artemisLE, synthA, synthB, ipAsset, activity],
  documents: [formationDoc, servicesDoc, equityDoc, ipDoc, operatingDoc, termsDoc],
  decisions: [dec("dec-ok")],
  edges: [], ...p,
});
const codes = (r: ReturnType<typeof validateEcosystem>) => r.exceptions.map((x) => x.code);

const participationEdge = () => edge("e-part", "apolloa", "agora-platform", "participates_in_platform", {
  evidenceRefs: ["doc-terms"],
});
const servicesEdge = () => edge("e-svc", "artemis-le", "agora-platform", "provides_services_to", {
  legalBasisDocumentIds: ["doc-services"], feeBearing: true, legalEntityScope: "artemis-le",
});
const equityEdge = (p: Partial<RelationshipRecord> = {}) => edge("e-eq", "synth-a", "synth-b", "owns_equity_in", {
  confidence: "verified", legalBasisDocumentIds: ["doc-equity"], legalEntityScope: "synth-b", ...p,
});
const operatorEdge = (p: Partial<RelationshipRecord> = {}) => edge("e-op", "synth-a", "activity-x", "operates_activity_as", {
  confidence: "verified", legalBasisDocumentIds: ["doc-operating"], legalEntityScope: "synth-a", ...p,
});

describe("M2.8.1 ecosystem validator — negative tests (Grok N-01..N-28)", () => {
  it("N-01 rejects subsidiary derivation from participates_in_platform", () => {
    const r = validateEcosystem(base({
      edges: [participationEdge()],
      derivedClaims: [{ fromId: "agora-platform", toId: "apolloa", claim: "subsidiary" }],
    }), OPTS);
    expect(codes(r)).toContain("SUBSIDIARY_INFERENCE_FORBIDDEN");
    expect(r.activeEdgeIds).toContain("e-part"); // the participation itself is valid
  });

  it("N-02 rejects equity inferred from combined services + operation edges", () => {
    const r = validateEcosystem(base({
      edges: [servicesEdge(), operatorEdge()],
      derivedClaims: [{ fromId: "synth-a", toId: "apolloa", claim: "control" }],
    }), OPTS);
    expect(codes(r)).toContain("SUBSIDIARY_INFERENCE_FORBIDDEN");
  });

  it("N-03 rejects direct subsidiary relation strings as unknown types", () => {
    for (const rt of ["subsidiary_of", "controls"]) {
      const r = validateEcosystem(base({ edges: [edge("e-x", "synth-a", "synth-b", rt)] }), OPTS);
      expect(codes(r)).toContain("ILLEGAL_EDGE");
      expect(r.activeEdgeIds).not.toContain("e-x");
    }
  });

  it("N-04 rejects legal_entity activation for pre-registration Apolloa without formation evidence", () => {
    const fake = ent("apolloa-le", {
      kind: "legal_entity", legalStatus: "formed", verificationStatus: "ASSERTED",
      formationEvidenceRefs: [],
    });
    const r = validateEcosystem(base({ entities: [...base({}).entities, fake] }), OPTS);
    expect(codes(r)).toContain("FORMATION_EVIDENCE_MISSING");
  });

  it("N-05 rejects formation activation citing only a template or unsigned document", () => {
    const fake = ent("apolloa-le", {
      kind: "legal_entity", legalStatus: "formed", formationEvidenceRefs: ["doc-template"],
    });
    const r = validateEcosystem(base({
      entities: [...base({}).entities, fake], documents: [...base({}).documents, templateDoc],
    }), OPTS);
    expect(codes(r)).toContain("LEGAL_BASIS_NOT_EXECUTED");
  });

  it("N-06 rejects clone-entity bypass of pre-registration status", () => {
    const clone = ent("apolloa-clone", {
      kind: "legal_entity", legalStatus: "formed", verificationStatus: "ASSERTED",
      formationEvidenceRefs: [],
    });
    const r = validateEcosystem(base({
      entities: [...base({}).entities, clone],
      edges: [equityEdge({ toId: "apolloa-clone", legalEntityScope: "apolloa-clone" })],
    }), OPTS);
    expect(codes(r)).toContain("FORMATION_EVIDENCE_MISSING");
    expect(r.activeEdgeIds).not.toContain("e-eq");
  });

  it("N-07 rejects operates_activity_as when operator is not a verified legal entity", () => {
    const brandOp = validateEcosystem(base({
      edges: [edge("e-op-bad", "apolloa", "activity-x", "operates_activity_as", {
        confidence: "verified", legalBasisDocumentIds: ["doc-operating"], legalEntityScope: "apolloa",
      })],
    }), OPTS);
    expect(codes(brandOp)).toContain("ENDPOINT_KIND_MISMATCH");
    const preReg = ent("pre-reg-le", { kind: "legal_entity", legalStatus: "pre-registration" });
    const r2 = validateEcosystem(base({
      entities: [...base({}).entities, preReg],
      edges: [edge("e-op-bad2", "pre-reg-le", "activity-x", "operates_activity_as", {
        confidence: "verified", legalBasisDocumentIds: ["doc-operating"], legalEntityScope: "pre-reg-le",
      })],
    }), OPTS);
    expect(codes(r2)).toContain("FORMATION_EVIDENCE_MISSING");
    expect(r2.activeEdgeIds).not.toContain("e-op-bad2");
  });

  it("N-08 rejects owns_equity_in activated on supported confidence", () => {
    for (const c of ["supported", "asserted", "unknown", "disputed"] as const) {
      const r = validateEcosystem(base({ edges: [equityEdge({ confidence: c })] }), OPTS);
      expect(codes(r)).toContain("CONFIDENCE_TOO_LOW_FOR_ACTIVATION");
      expect(r.activeEdgeIds).not.toContain("e-eq");
    }
  });

  it("N-09 rejects owns_equity_in citing an executed services agreement", () => {
    const r = validateEcosystem(base({
      edges: [equityEdge({ legalBasisDocumentIds: ["doc-services"] })],
    }), OPTS);
    expect(codes(r)).toContain("WRONG_EVIDENCE_CLASS");
    expect(r.activeEdgeIds).not.toContain("e-eq");
  });

  it("N-10 rejects provides_services_to from a brand endpoint", () => {
    const r = validateEcosystem(base({
      edges: [edge("e-svc-bad", "apolloa", "agora-platform", "provides_services_to", {
        legalBasisDocumentIds: ["doc-services"],
      })],
    }), OPTS);
    expect(codes(r)).toContain("ENDPOINT_KIND_MISMATCH");
  });

  it("N-11 rejects activation citing a dangling or cross-tenant legal basis document", () => {
    const dangling = validateEcosystem(base({
      edges: [equityEdge({ legalBasisDocumentIds: ["doc-does-not-exist"] })],
    }), OPTS);
    expect(codes(dangling)).toContain("UNRESOLVED_EVIDENCE_REF");
    const foreign = doc("doc-foreign", {
      docClass: "equity", tenantId: "tenant-b", status: "EXECUTED", signatureStatus: "SIGNED_VERIFIED",
    });
    const cross = validateEcosystem(base({
      documents: [...base({}).documents, foreign],
      edges: [equityEdge({ legalBasisDocumentIds: ["doc-foreign"] })],
    }), OPTS);
    expect(codes(cross)).toContain("CROSS_TENANT_REFERENCE");
    expect(cross.activeEdgeIds).not.toContain("e-eq");
  });

  it("N-12 rejects legal basis promoted from evidenceRefs", () => {
    const r = validateEcosystem(base({
      documents: [...base({}).documents, receivedDoc],
      edges: [edge("e-ip", "synth-a", "ip-asset", "owns_ip", {
        confidence: "verified", evidenceRefs: ["doc-received"],
        legalBasisDocumentIds: ["doc-received"], legalEntityScope: "synth-a", feeBearing: true,
      })],
    }), OPTS);
    expect(codes(r)).toContain("LEGAL_BASIS_NOT_EXECUTED");
    expect(r.activeEdgeIds).not.toContain("e-ip");
  });

  it("N-13 public projection excludes private fields at any depth", () => {
    const dirty = {
      ...synthA, identifiersRef: "PRIVATE-REF-1", contentHash: "a".repeat(64),
      ownershipPercent: 85, metadata: { identifiersRef: "NESTED-LEAK" },
      IdentifiersRef: "CASE-VARIANT",
    } as unknown as EntityRecord;
    expect(toPublicEntity(dirty)).toEqual({ id: "synth-a", displayName: "synth-a", kind: "legal_entity" });
    const dirtyEdge = {
      ...equityEdge(), legalEntityScope: "synth-b", evidenceRefs: ["doc-equity"],
      internalNote: "do not publish",
    } as RelationshipRecord;
    expect(toPublicEdge(dirtyEdge)).toEqual({
      id: "e-eq", fromId: "synth-a", toId: "synth-b",
      relationType: "owns_equity_in", lifecycle: "active",
    });
  });

  it("N-14 public projection never emits a low-entropy content hash or ownership percentage", () => {
    const withHash = { ...ipAsset, contentHash: "c".repeat(64), ownershipPercent: 100 } as unknown as EntityRecord;
    const pub = JSON.stringify(toPublicEntity(withHash));
    expect(pub).not.toContain("c".repeat(64));
    expect(pub).not.toContain("ownershipPercent");
    expect(Object.keys(toPublicEntity(withHash)).sort()).toEqual(["displayName", "id", "kind"]);
  });

  it("N-15 rejects edge whose endpoint entity belongs to another tenant", () => {
    const foreignEnt = ent("foreign-ent", { kind: "brand", tenantId: "tenant-b" });
    const r = validateEcosystem(base({
      entities: [...base({}).entities, foreignEnt],
      edges: [edge("e-x", "apolloa", "foreign-ent", "participates_in_platform", { evidenceRefs: ["doc-terms"] })],
    }), OPTS);
    expect(codes(r)).toContain("CROSS_TENANT_REFERENCE");
    expect(r.activeEdgeIds).not.toContain("e-x");
  });

  it("N-16 rejects financial relation without legalEntityScope", () => {
    const missing = validateEcosystem(base({ edges: [equityEdge({ legalEntityScope: null })] }), OPTS);
    expect(codes(missing)).toContain("MISSING_LEGAL_ENTITY_SCOPE");
    const unknown = validateEcosystem(base({ edges: [equityEdge({ legalEntityScope: "UNKNOWN" })] }), OPTS);
    expect(codes(unknown)).toContain("MISSING_LEGAL_ENTITY_SCOPE");
    const wrong = validateEcosystem(base({ edges: [equityEdge({ legalEntityScope: "synth-a" })] }), OPTS);
    expect(codes(wrong)).toContain("LEGAL_ENTITY_SCOPE_MISMATCH");
  });

  it("N-17 codes cross-entity consolidation claim instead of merging entities", () => {
    const r = validateEcosystem(base({
      edges: [equityEdge()],
      derivedClaims: [{ fromId: "synth-a", toId: "synth-b", claim: "tax_consolidation" }],
    }), OPTS);
    expect(codes(r)).toContain("CROSS_ENTITY_ALLOCATION");
  });

  it("N-18 codes unknown, legacy, and malformed relation strings as ILLEGAL_EDGE without throwing", () => {
    const bad: unknown[] = [
      "may_own_brand", "may_provide_software_support", "holds_bank_account",
      "Participates_In_Platform", " participates_in_platform", "participates-in-platform",
      "", null, 42, {}, ["participates_in_platform"],
    ];
    for (const rt of bad) {
      const e = edge("e-bad", "apolloa", "agora-platform", "participates_in_platform", {
        evidenceRefs: ["doc-terms"],
      });
      (e as { relationType: unknown }).relationType = rt;
      const r = validateEcosystem(base({ edges: [e, participationEdge()] }), OPTS);
      expect(codes(r)).toContain("ILLEGAL_EDGE");
      expect(r.activeEdgeIds).toContain("e-part"); // valid edges still validate (P-08 property)
    }
  });

  it("N-19 rejects free-string owner approval", () => {
    const free = validateEcosystem(base({
      edges: [participationEdge2({ ownerApprovalRef: "owner said ok" })],
    }), OPTS);
    expect(codes(free)).toContain("FREE_TEXT_APPROVAL_REJECTED");
    const dangling = validateEcosystem(base({
      edges: [participationEdge2({ ownerApprovalRef: "approved-on-whatsapp" })],
    }), OPTS);
    expect(codes(dangling)).toContain("UNRESOLVED_DECISION_REF");
  });

  it("N-20 rejects decisionRef that does not resolve to an APPROVED decision", () => {
    for (const st of ["PROVISIONAL", "UNKNOWN", "REJECTED", "SUPERSEDED"] as const) {
      const r = validateEcosystem(base({
        decisions: [dec("dec-x", { status: st })],
        edges: [participationEdge2({ ownerApprovalRef: "dec-x" })],
      }), OPTS);
      expect(codes(r)).toContain("DECISION_NOT_APPROVED");
    }
    const crossDec = dec("dec-foreign", { tenantId: "tenant-b" });
    const cross = validateEcosystem(base({
      decisions: [crossDec],
      edges: [participationEdge2({ ownerApprovalRef: "dec-foreign" })],
    }), OPTS);
    expect(codes(cross)).toContain("CROSS_TENANT_REFERENCE");
  });

  it("N-21 rejects AI or read-only actor as approver", () => {
    for (const actor of ["claude", "gpt-6", "grok", "gemini", "ai", "system", "member-readonly"]) {
      const r = validateEcosystem(base({
        decisions: [dec("dec-ai", { decidedBy: actor })],
        edges: [participationEdge2({ ownerApprovalRef: "dec-ai" })],
      }), OPTS);
      expect(codes(r)).toContain("UNAUTHORIZED_ACTOR");
      expect(r.activeEdgeIds).not.toContain("e-part");
    }
  });

  it("N-22 rejects confidence upgrade asserted by narrative text", () => {
    const aiDoc = doc("doc-ai-review", {
      docClass: "services_agreement", type: "AI_VERIFICATION_MEMO",
      status: "DRAFT_REVIEWED", signatureStatus: "UNSIGNED",
    });
    const r = validateEcosystem(base({
      documents: [...base({}).documents, aiDoc],
      edges: [edge("e-svc-narr", "artemis-le", "agora-platform", "provides_services_to", {
        confidence: "verified", legalBasisDocumentIds: ["doc-ai-review"],
        notes: "verified by external counsel",
      } as Partial<RelationshipRecord>)],
    }), OPTS);
    expect(codes(r)).toContain("LEGAL_BASIS_NOT_EXECUTED");
    expect(r.activeEdgeIds).not.toContain("e-svc-narr");
  });

  it("N-23 rejects effectiveTo before effectiveFrom and invalid calendar dates", () => {
    for (const p of [
      { effectiveFrom: "2026-06-01", effectiveTo: "2026-05-01" },
      { effectiveFrom: "2026-02-30" },
      { effectiveFrom: "06/01/2026" },
    ]) {
      const r = validateEcosystem(base({ edges: [participationEdge2(p)] }), OPTS);
      expect(codes(r)).toContain("INVALID_EFFECTIVE_RANGE");
      expect(r.activeEdgeIds).not.toContain("e-part");
    }
  });

  it("N-24 rejects overlapping active revisions of the same edge", () => {
    const rev2 = participationEdge2({ id: "e-part-2", revision: 2, effectiveFrom: "2026-06-01" });
    const r = validateEcosystem(base({ edges: [participationEdge(), rev2] }), OPTS);
    expect(codes(r)).toContain("OVERLAPPING_ACTIVE_REVISION");
    expect(r.activeEdgeIds).toContain("e-part");
    expect(r.activeEdgeIds).not.toContain("e-part-2");
  });

  it("N-25 rejects activation backdated before its evidence and decision", () => {
    const lateDoc = doc("doc-late", {
      docClass: "services_agreement", status: "EXECUTED",
      signatureStatus: "SIGNED_VERIFIED", executedOn: "2026-09-01",
    });
    const lateDec = dec("dec-late", { decidedAt: "2026-09-15T00:00:00Z" });
    const r = validateEcosystem(base({
      documents: [...base({}).documents, lateDoc], decisions: [lateDec],
      edges: [edge("e-back", "artemis-le", "agora-platform", "provides_services_to", {
        legalBasisDocumentIds: ["doc-late"], ownerApprovalRef: "dec-late",
        effectiveFrom: "2026-01-01", feeBearing: true, legalEntityScope: "artemis-le",
      })],
    }), OPTS);
    expect(codes(r)).toContain("BACKDATED_ACTIVATION");
    expect(r.activeEdgeIds).not.toContain("e-back");
  });

  it("N-26 rejects self-loop and equity cycle without subsidiary language", () => {
    const loop = validateEcosystem(base({ edges: [equityEdge({ fromId: "synth-a", toId: "synth-a", legalEntityScope: "synth-a" })] }), OPTS);
    expect(codes(loop)).toContain("ILLEGAL_EDGE");
    const fwd = equityEdge();
    const rev = equityEdge({ id: "e-eq-rev", fromId: "synth-b", toId: "synth-a", legalEntityScope: "synth-a" });
    const cyc = validateEcosystem(base({ edges: [fwd, rev] }), OPTS);
    expect(codes(cyc)).toContain("EQUITY_CYCLE");
    expect(cyc.activeEdgeIds.length).toBe(1);
  });

  it("N-27 rejects duplicate active edge submitted under a new id", () => {
    const dup = participationEdge2({ id: "e-part-dup" });
    const r = validateEcosystem(base({ edges: [participationEdge(), dup] }), OPTS);
    expect(codes(r)).toContain("OVERLAPPING_ACTIVE_REVISION");
    expect(r.activeEdgeIds.length).toBe(1);
  });

  it("N-28 fails closed on shape attacks without prototype pollution", () => {
    const revBad = validateEcosystem(base({ edges: [participationEdge2({ revision: 0 })] }), OPTS);
    expect(codes(revBad)).toContain("INVALID_REVISION");
    const revFrac = validateEcosystem(base({ edges: [participationEdge2({ revision: 1.5 })] }), OPTS);
    expect(codes(revFrac)).toContain("INVALID_REVISION");
    const dupEnt = validateEcosystem(base({
      entities: [...base({}).entities, ent("synth-a", { kind: "brand" })],
    }), OPTS);
    expect(codes(dupEnt)).toContain("DUPLICATE_ENTITY_ID");
    const parsed = JSON.parse('{"id":"proto-ent","tenantId":"tenant-a","kind":"brand","displayName":"x","legalStatus":null,"verificationStatus":"UNKNOWN","__proto__":{"polluted":true}}') as EntityRecord;
    const r = validateEcosystem(base({ entities: [...base({}).entities, parsed] }), OPTS);
    expect(r).toBeDefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    const circular: Record<string, unknown> = { note: "x" };
    circular.self = circular;
    const circEnt = { ...ipAsset, metadata: circular } as unknown as EntityRecord;
    expect(toPublicEntity(circEnt)).toEqual({ id: "ip-asset", displayName: "ip-asset", kind: "asset" });
  });
});

// Helper defined after use in N-19..N-28 blocks (hoisted function declaration).
function participationEdge2(p: Partial<RelationshipRecord>): RelationshipRecord {
  return { ...participationEdge(), ...p };
}

describe("M2.8.1 ecosystem validator — positive controls (Grok P-01..P-08)", () => {
  it("P-01 valid participation activates as participation only, no equity", () => {
    const r = validateEcosystem(base({ edges: [participationEdge()] }), OPTS);
    expect(r.exceptions).toEqual([]);
    expect(r.activeEdgeIds).toEqual(["e-part"]);
    expect(apolloa.kind).toBe("brand");
    expect(apolloa.legalStatus).toBe("pre-registration");
  });

  it("P-02 valid services edge activates", () => {
    const r = validateEcosystem(base({ edges: [servicesEdge()] }), OPTS);
    expect(r.exceptions).toEqual([]);
    expect(r.activeEdgeIds).toEqual(["e-svc"]);
  });

  it("P-03 valid equity edge on synthetic entities activates; percentage stays private", () => {
    const e = equityEdge({ ownershipPercent: 60 } as Partial<RelationshipRecord>);
    const r = validateEcosystem(base({ edges: [e] }), OPTS);
    expect(r.exceptions).toEqual([]);
    expect(r.activeEdgeIds).toEqual(["e-eq"]);
    expect(JSON.stringify(toPublicEdge(e))).not.toContain("60");
    expect(JSON.stringify(toPublicEdge(e))).not.toContain("legalEntityScope");
  });

  it("P-04 valid operator edge activates", () => {
    const r = validateEcosystem(base({ edges: [operatorEdge()] }), OPTS);
    expect(r.exceptions).toEqual([]);
    expect(r.activeEdgeIds).toEqual(["e-op"]);
  });

  it("P-05 clean sequential revisions both stand without overlap", () => {
    const rev1 = participationEdge2({ effectiveFrom: "2026-02-01", effectiveTo: "2026-06-01" });
    const rev2 = participationEdge2({ id: "e-part-2", revision: 2, effectiveFrom: "2026-06-01", effectiveTo: null });
    const r = validateEcosystem(base({ edges: [rev1, rev2] }), OPTS);
    expect(codes(r)).not.toContain("OVERLAPPING_ACTIVE_REVISION");
    expect(r.activeEdgeIds.sort()).toEqual(["e-part", "e-part-2"]);
  });

  it("P-06 public projection of a mixed registry is exactly the allowlisted shape", () => {
    const input = base({ edges: [participationEdge(), servicesEdge(), equityEdge(), operatorEdge()] });
    for (const e of input.entities) {
      expect(Object.keys(toPublicEntity(e)).sort()).toEqual(["displayName", "id", "kind"]);
    }
    for (const e of input.edges) {
      expect(Object.keys(toPublicEdge(e)).sort()).toEqual(
        ["fromId", "id", "lifecycle", "relationType", "toId"]);
    }
  });

  it("P-07 suspended and terminated edges are not active", () => {
    const susp = participationEdge2({ id: "e-susp", lifecycle: "suspended" });
    const term = participationEdge2({ id: "e-term", lifecycle: "terminated", effectiveTo: "2026-03-01" });
    const r = validateEcosystem(base({ edges: [susp, term] }), OPTS);
    expect(r.activeEdgeIds).toEqual([]);
    expect(r.proposedEdgeIds.sort()).toEqual(["e-susp", "e-term"]);
  });

  it("P-08 unknown relation quarantined, valid set still validates", () => {
    const badEdge = edge("e-bad", "apolloa", "agora-platform", "may_own_brand", { evidenceRefs: ["doc-terms"] });
    const r = validateEcosystem(base({ edges: [badEdge, participationEdge(), servicesEdge()] }), OPTS);
    expect(codes(r)).toContain("ILLEGAL_EDGE");
    expect(r.activeEdgeIds.sort()).toEqual(["e-part", "e-svc"]);
  });
});
