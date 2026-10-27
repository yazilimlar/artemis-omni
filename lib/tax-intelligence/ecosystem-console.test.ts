/**
 * M2.8.2 console tests (handoff §C): no subsidiary inference, no invented
 * dates, UNKNOWN preserved, confidentiality projection, task provenance,
 * recorded-vs-proposed separation. All fixtures synthetic.
 */
import { describe, expect, it } from "vitest";
import {
  CONSOLE_MANIFEST,
  CONSOLE_VIEW,
  projectConsoleView,
  deriveStatus,
  type BoardItem,
  type ConsoleManifest,
} from "./ecosystem-console-manifest";
import {
  validateEcosystem,
  type EcosystemInput,
  type EntityRecord,
  type RelationshipRecord,
} from "./ecosystem";

const apolloa = CONSOLE_VIEW.nodes.find(n => n.id === "apolloa")!;

describe("no subsidiary inference", () => {
  it("projects zero ownership-category edges and zero owns_equity_in edges", () => {
    expect(CONSOLE_VIEW.edges.filter(e => e.category === "ownership")).toHaveLength(0);
    expect(CONSOLE_VIEW.edges.filter(e => e.type === "owns_equity_in")).toHaveLength(0);
  });

  it("Apolloa never projects as a legal entity and carries no owner/parent field", () => {
    expect(apolloa.legalEntity).toBe(false);
    expect(Object.keys(apolloa)).not.toContain("ownerId");
    expect(Object.keys(apolloa)).not.toContain("parentId");
    expect(apolloa.statusLabel).toMatch(/NOT a legal entity/);
  });

  it("even if a raw manifest claims Apolloa is a legal entity with an ownership edge, projection strips both", () => {
    const poisoned: ConsoleManifest = structuredClone(CONSOLE_MANIFEST);
    const node = poisoned.nodes.find(n => n.id === "apolloa")!;
    (node as { legalEntity: boolean }).legalEntity = true;
    poisoned.edges.push({
      id: "evil", sourceId: "agoraxai", targetId: "apolloa", type: "owns_equity_in",
      category: "ownership", evidenceState: "verified", label: "owns",
    });
    const view = projectConsoleView(poisoned);
    expect(view.nodes.find(n => n.id === "apolloa")!.legalEntity).toBe(false);
    expect(view.edges.some(e => e.type === "owns_equity_in")).toBe(false);
  });

  it("projected edges pass the M2.8.1 validator; a subsidiary claim on console data is rejected", () => {
    const entities: EntityRecord[] = CONSOLE_VIEW.nodes.map(n => ({
      id: n.id, tenantId: "synthetic", kind: n.legalEntity ? "legal_entity" : "brand",
      displayName: n.label, legalStatus: n.legalEntity ? null : "pre-registration",
      verificationStatus: "ASSERTED",
    }));
    const edges: RelationshipRecord[] = CONSOLE_VIEW.edges.map(e => ({
      id: e.id, tenantId: "synthetic", fromId: e.sourceId, toId: e.targetId,
      relationType: e.type, confidence: "asserted", lifecycle: "proposed",
      effectiveFrom: null, effectiveTo: null, evidenceRefs: [],
      legalBasisDocumentIds: [], legalEntityScope: null, ownerApprovalRef: null, revision: 1,
    }));
    const input: EcosystemInput = { entities, documents: [], decisions: [], edges };
    const clean = validateEcosystem(input, { authorizedApprovers: [] });
    expect(clean.exceptions.map(x => x.code)).not.toContain("SUBSIDIARY_INFERENCE_FORBIDDEN");
    const claimed = validateEcosystem(
      { ...input, derivedClaims: [{ fromId: "agoraxai", toId: "apolloa", claim: "subsidiary" }] },
      { authorizedApprovers: [] },
    );
    expect(claimed.exceptions.map(x => x.code)).toContain("SUBSIDIARY_INFERENCE_FORBIDDEN");
  });
});

describe("no invented dates", () => {
  it("every dated timeline entry carries commit provenance", () => {
    for (const t of CONSOLE_VIEW.timeline) {
      if (t.date !== null) expect(t.provenance.commitSha, t.id).toBeTruthy();
    }
  });

  it("projection strips a date that has no commit behind it", () => {
    const m: ConsoleManifest = structuredClone(CONSOLE_MANIFEST);
    const entry = m.timeline.find(t => t.id === "m283")!;
    entry.date = "2027-01-01";
    entry.provenance.commitSha = null;
    expect(projectConsoleView(m).timeline.find(t => t.id === "m283")!.date).toBeNull();
  });

  it("proposed future milestones have no date", () => {
    expect(CONSOLE_VIEW.timeline.find(t => t.id === "m283")!.date).toBeNull();
    expect(CONSOLE_VIEW.timeline.find(t => t.id === "m29")!.date).toBeNull();
  });
});

describe("UNKNOWN preserved", () => {
  it("U1-U4 project with status unknown and evidence unknown", () => {
    for (const id of ["U1", "U2", "U3", "U4"]) {
      const item = CONSOLE_VIEW.board.find(b => b.id === id)!;
      expect(item.status, id).toBe("unknown");
      expect(item.evidenceState, id).toBe("unknown");
    }
  });

  it("every formation option is NOT COSTABLE with a null total", () => {
    for (const o of CONSOLE_VIEW.formationOptions) {
      expect(o.totalCost, o.id).toBeNull();
      expect(o.totalState, o.id).toBe("NOT_COSTABLE");
    }
  });

  it("projection forces totals to null even if a raw manifest invents one", () => {
    const m: ConsoleManifest = structuredClone(CONSOLE_MANIFEST);
    (m.formationOptions[1] as { totalCost: number | null }).totalCost = 12345;
    expect(projectConsoleView(m).formationOptions[1].totalCost).toBeNull();
  });
});

describe("confidentiality projection", () => {
  it("drops non-allowlisted fields injected into raw records", () => {
    const m = structuredClone(CONSOLE_MANIFEST) as unknown as Record<string, unknown>;
    (m.nodes as Record<string, unknown>[])[0] = {
      ...(m.nodes as Record<string, unknown>[])[0],
      ownerPersonName: "SYNTHETIC-PERSON", bankAccount: "SYNTHETIC-ACCT", ssn: "000-00-0000",
    };
    const view = projectConsoleView(m as unknown as ConsoleManifest);
    const json = JSON.stringify(view);
    expect(json).not.toContain("SYNTHETIC-PERSON");
    expect(json).not.toContain("SYNTHETIC-ACCT");
    expect(json).not.toContain("000-00-0000");
    expect(json).not.toContain("ownerPersonName");
  });

  it("projected view contains no email-shaped or long-digit identifier strings", () => {
    const json = JSON.stringify(CONSOLE_VIEW);
    expect(json).not.toMatch(/[\w.]+@[\w.]+\.\w+/);
    expect(json).not.toMatch(/\b\d{9,}\b(?!-)/); // commit SHAs are hex, allowed; bare long digit runs are not
  });
});

describe("rendered console output (screen evidence invariants)", () => {
  it("renders NOT COSTABLE totals, unset dates, non-entity Apolloa, filters and provenance", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { createElement } = await import("react");
    const { EcosystemConsole } = await import("@/components/ecosystem/EcosystemConsole");
    const html = renderToStaticMarkup(createElement(EcosystemConsole, { view: CONSOLE_VIEW }));
    // 5 Total cells render NOT COSTABLE; the phrase also appears in the
    // section note and the DBA option's unknowns text — all are refusals to
    // state a total, never a number presented as one.
    expect(html.match(/NOT COSTABLE/g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).not.toMatch(/Total[^<]*\$[\d,]+/);
    expect(html).toContain("date not set");
    expect(html).toContain("NOT a legal entity");
    expect(html).toContain("participates in platform");
    expect(html).not.toContain("Apolloa LLC");
    expect(html).not.toMatch(/owns_equity_in[\s\S]{0,80}Apolloa/);
    for (const label of ["All", "Open", "Blocked", "In review", "Complete", "Unknown"]) {
      expect(html, label).toContain(label);
    }
    expect(html).toContain("M281_APOLLOA_DECISION_MATRIX_R01.md");
    expect(html).toContain("Proposed — not recorded");
    expect(html).toContain("U1");
    expect(html).toContain("OBL-APOLLOA-FORMATION");
  });
});

describe("provenance + derivation", () => {
  it("every board item, timeline entry and formation option carries source path and next actor where applicable", () => {
    for (const b of CONSOLE_VIEW.board) {
      expect(b.provenance.sourcePath.length, b.id).toBeGreaterThan(0);
      expect(b.nextActor, b.id).toBeTruthy();
    }
    for (const t of CONSOLE_VIEW.timeline) expect(t.provenance.sourcePath.length, t.id).toBeGreaterThan(0);
    for (const o of CONSOLE_VIEW.formationOptions) expect(o.provenance.commitSha, o.id).toBeTruthy();
  });

  it("a proposed item can never derive to complete", () => {
    const proposed: BoardItem = {
      id: "X", title: "x", kind: "task", origin: "proposed", recordedStatus: "complete",
      evidenceState: "unknown", confidence: "not-applicable", nextActor: "owner",
      dependsOn: [], provenance: { sourcePath: "p", commitSha: null, sourceStatus: "draft" },
    };
    expect(deriveStatus(proposed)).not.toBe("complete");
    expect(CONSOLE_VIEW.board.filter(b => b.origin === "proposed").every(b => b.status !== "complete")).toBe(true);
  });

  it("recorded vs proposed is explicit on every board item", () => {
    for (const b of CONSOLE_VIEW.board) expect(["recorded", "proposed"]).toContain(b.origin);
    expect(CONSOLE_VIEW.board.find(b => b.id === "M283-PREVIEW")!.origin).toBe("proposed");
  });
});
