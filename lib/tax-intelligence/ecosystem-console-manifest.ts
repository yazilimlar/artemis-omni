/**
 * M2.8.2 Ecosystem Console — versioned manifest + derivation + projection.
 *
 * The console renders ONLY what this manifest records. State is DERIVED from
 * origin + evidence (never hard-coded "approved" from a draft): a proposed
 * item can never project as complete. Dates exist only where a commit or a
 * dated source document backs them; otherwise the date is null and the UI
 * renders "date not set". Formation totals are null (NOT COSTABLE) by type.
 *
 * Synthetic data only. No real names of individuals, no private finance data,
 * no identifiers. Apolloa is an independent agora participant,
 * pre-registration, with NO legal-entity record and NO ownership edges.
 */

export const MANIFEST_VERSION = "M282-R01";
export const MANIFEST_GENERATED_FROM =
  "M2.8.1 committed package (branch feature/tax-intelligence-m281-apolloa-formation-r1)";

export type EvidenceState =
  | "observed" | "declared" | "inferred" | "verified" | "blocked" | "stale" | "unknown";

export interface Provenance {
  /** Repository path of the source document. */
  sourcePath: string;
  /** Commit that carries the source, or null when no commit backs it. */
  commitSha: string | null;
  /** Status of the source itself, e.g. "committed", "owner-relayed". */
  sourceStatus: string;
}

export type ItemStatus = "open" | "blocked" | "in_review" | "complete" | "unknown";
export type Origin = "recorded" | "proposed";

export interface BoardItem {
  id: string;
  title: string;
  kind: "task" | "decision" | "unknown" | "evidence_request" | "milestone";
  origin: Origin;
  /** Raw recorded status BEFORE derivation; derivation may only cap it. */
  recordedStatus: ItemStatus;
  evidenceState: EvidenceState;
  confidence: "low" | "medium" | "high" | "not-applicable";
  nextActor: "owner" | "gpt-6" | "integrator" | "counsel-cpa" | "unknown";
  dependsOn: string[];
  provenance: Provenance;
  note?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  role: string;
  legalEntity: boolean;
  statusLabel: string;
  evidenceState: EvidenceState;
}

export type ConsoleRelationType =
  | "participates_in_platform" | "provides_services_to"
  | "owns_equity_in" | "owns_ip" | "operates_activity_as" | "has_contract_with";

export interface NetworkEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConsoleRelationType;
  category: "participation" | "ownership" | "services" | "financial-contracts";
  evidenceState: EvidenceState;
  label: string;
}

export interface FormationOption {
  id: string;
  name: string;
  formation: string;
  foreignQualification: string;
  publication: string;
  annualState: string;
  formationEvidence: string;
  /** Always null in R01: no honest all-in total exists (NOT COSTABLE). */
  totalCost: number | null;
  totalState: "NOT_COSTABLE";
  openUnknowns: string;
  provenance: Provenance;
}

export interface TimelineEntry {
  id: string;
  title: string;
  /** ISO date, or null = not set. A non-null date REQUIRES commit provenance. */
  date: string | null;
  state: string;
  evidenceState: EvidenceState;
  provenance: Provenance;
}

export interface ConsoleManifest {
  version: string;
  generatedFrom: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  formationOptions: FormationOption[];
  timeline: TimelineEntry[];
  board: BoardItem[];
}

/* ---------------------------------- data ---------------------------------- */

const DOC = "docs/tax-intelligence";

export const CONSOLE_MANIFEST: ConsoleManifest = {
  version: MANIFEST_VERSION,
  generatedFrom: MANIFEST_GENERATED_FROM,
  nodes: [
    { id: "agoraxai", label: "AgoraXAI", role: "Platform / ecosystem anchor", legalEntity: false, statusLabel: "Ecosystem role recorded; legal form UNKNOWN (U-register)", evidenceState: "declared" },
    { id: "apolloa", label: "Apolloa", role: "Independent agora participant — pre-registration", legalEntity: false, statusLabel: "NOT a legal entity. No registration, no formation evidence on file", evidenceState: "declared" },
    { id: "artemis", label: "ARTEMIS", role: "Technology / support provider (declared)", legalEntity: false, statusLabel: "Role recorded in M2.8 foundation; contracts unverified", evidenceState: "declared" },
    { id: "great-order", label: "Great Order LLC", role: "Provisional legal / operating anchor", legalEntity: true, statusLabel: "Named LLC; ownership and legal/tax scope UNVERIFIED", evidenceState: "unknown" },
    { id: "apolloa-food", label: "Apolloa · Food & beverage import/export", role: "Intended activity (not yet operated)", legalEntity: false, statusLabel: "Intended sector — no activity recorded", evidenceState: "declared" },
    { id: "apolloa-consulting", label: "Apolloa · Consulting", role: "Intended activity (not yet operated)", legalEntity: false, statusLabel: "Intended sector — no activity recorded", evidenceState: "declared" },
    { id: "apolloa-apparel", label: "Apolloa · Apparel / product design", role: "Intended activity (not yet operated)", legalEntity: false, statusLabel: "Intended sector — no activity recorded", evidenceState: "declared" },
  ],
  edges: [
    { id: "e-apolloa-platform", sourceId: "apolloa", targetId: "agoraxai", type: "participates_in_platform", category: "participation", evidenceState: "declared", label: "participates in platform (independent agora)" },
    { id: "e-artemis-services", sourceId: "artemis", targetId: "agoraxai", type: "provides_services_to", category: "services", evidenceState: "declared", label: "provides services to (contracts unverified)" },
    // Deliberately NO owns_equity_in / owns_ip / operates_activity_as /
    // has_contract_with edges: none is evidenced. Absence is the honest state.
  ],
  formationOptions: [
    {
      id: "wait", name: "Wait — operate nothing yet", formation: "$0 state fee",
      foreignQualification: "n/a", publication: "Not triggered",
      annualState: "$0 recurring state charges",
      formationEvidence: "n/a — no entity created",
      totalCost: null, totalState: "NOT_COSTABLE",
      openUnknowns: "Opportunity cost and pre-formation activity risk are not state fees and are UNKNOWN",
      provenance: { sourcePath: `${DOC}/M281_APOLLOA_DECISION_MATRIX_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" },
    },
    {
      id: "ny-llc", name: "NY domestic LLC (new)", formation: "$200 Articles (DOS-verified)",
      foreignQualification: "n/a", publication: "REQUIRED — price UNKNOWN (county newspapers)",
      annualState: "IT-204-LL $25–$4,500 by NY income (band UNKNOWN) + $9 biennial",
      formationEvidence: "Filed Articles + DOS receipt establish the entity; operating agreement §417 within 90 days",
      totalCost: null, totalState: "NOT_COSTABLE",
      openUnknowns: "Publication price (county UNKNOWN); IT-204-LL band (income UNKNOWN); agent/organiser costs UNKNOWN",
      provenance: { sourcePath: `${DOC}/M281_APOLLOA_DECISION_MATRIX_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" },
    },
    {
      id: "de-ny", name: "DE LLC + NY foreign qualification", formation: "DE formation fee UNKNOWN",
      foreignQualification: "$250 NY Application for Authority",
      publication: "REQUIRED in NY (§802) — price UNKNOWN",
      annualState: "DE $400/yr (statute, HB 400) + NY IT-204-LL band UNKNOWN + $9 biennial + DE agent fee UNKNOWN",
      formationEvidence: "DE certificate + NY certificate of authority; duties stack, never substitute",
      totalCost: null, totalState: "NOT_COSTABLE",
      openUnknowns: "DE formation + agent fees UNKNOWN; publication price; IT-204-LL band",
      provenance: { sourcePath: `${DOC}/M281_APOLLOA_DECISION_MATRIX_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" },
    },
    {
      id: "nj-llc", name: "NJ LLC", formation: "$100 Certificate of Formation (NJ Treasury schedule)",
      foreignQualification: "NY qualification $250 if NY activity (footprint UNKNOWN)",
      publication: "NY publication if NY-qualified — price UNKNOWN",
      annualState: "NJ annual report $75 + any NY duties if qualified",
      formationEvidence: "Filed NJ certificate establishes the entity",
      totalCost: null, totalState: "NOT_COSTABLE",
      openUnknowns: "Whether NJ fits the operating footprint at all (UNKNOWN); NY stacking if qualified",
      provenance: { sourcePath: `${DOC}/M281_APOLLOA_DECISION_MATRIX_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" },
    },
    {
      id: "great-order-dba", name: "Great Order LLC d/b/a Apolloa", formation: "No new entity",
      foreignQualification: "n/a", publication: "n/a (no new NY LLC)",
      annualState: "No new state charges identified",
      formationEvidence: "DOS assumed-name certificate $25 IF Great Order is an LLC — its legal form is UNVERIFIED",
      totalCost: null, totalState: "NOT_COSTABLE",
      openUnknowns: "NOT COSTABLE until Great Order's legal form/status is verified (U2); DBA gives no shield or personhood",
      provenance: { sourcePath: `${DOC}/M281_DECISION_AND_EVIDENCE_GATES_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" },
    },
  ],
  timeline: [
    { id: "m271", title: "M2.7.1 synthetic kernel accepted (GPT-6)", date: "2026-10-26", state: "Accepted — synthetic scope", evidenceState: "verified", provenance: { sourcePath: `${DOC}/M271_HARDENING_ACCEPTANCE_R01.md`, commitSha: "e5d28550", sourceStatus: "committed" } },
    { id: "m28", title: "M2.8 Documentation Foundation v0.1", date: "2026-10-26", state: "Committed; D-01 architecture recorded (Supabase-first, synthetic-only)", evidenceState: "verified", provenance: { sourcePath: `${DOC}/00_INDEX.md`, commitSha: "5da71991", sourceStatus: "committed" } },
    { id: "m281", title: "M2.8.1 Apolloa formation package", date: "2026-10-26", state: "Committed; GPT-6 provisional acceptance for synthetic development (owner-relayed 2026-10-26)", evidenceState: "verified", provenance: { sourcePath: `${DOC}/M281_HANDOFF_REPORT_R01.md`, commitSha: "2f0fd30a5ac2ddaae0e7ff4e290b5029bf6c6731", sourceStatus: "committed" } },
    { id: "m282", title: "M2.8.2 Ecosystem Console (this preview build)", date: "2026-10-26", state: "Built on isolated branch; in review — NOT approved, NOT deployed to production", evidenceState: "observed", provenance: { sourcePath: `${DOC}/M282_ECOSYSTEM_CONSOLE_PREVIEW_HANDOFF_R01.md`, commitSha: "05aa3755001af92fd9bcef7ffb31a2ec198984b0", sourceStatus: "committed" } },
    { id: "m283", title: "M2.8.3 Protected preview gate", date: null, state: "Proposed — requires owner authorisation after build/security verification", evidenceState: "unknown", provenance: { sourcePath: `${DOC}/M282_ECOSYSTEM_CONSOLE_PREVIEW_HANDOFF_R01.md`, commitSha: "05aa3755001af92fd9bcef7ffb31a2ec198984b0", sourceStatus: "committed" } },
    { id: "m29", title: "M2.9 Private integrations (evidence intake, RLS, live data path)", date: null, state: "Proposed — blocked by D-01 intake/RLS gates", evidenceState: "blocked", provenance: { sourcePath: `${DOC}/M282_ECOSYSTEM_CONSOLE_PREVIEW_HANDOFF_R01.md`, commitSha: "05aa3755001af92fd9bcef7ffb31a2ec198984b0", sourceStatus: "committed" } },
  ],
  board: [
    { id: "D-01", title: "D-01 Evidence store decision — architecture recorded (Supabase-first, synthetic-only); private intake NOT authorised", kind: "decision", origin: "recorded", recordedStatus: "in_review", evidenceState: "verified", confidence: "high", nextActor: "owner", dependsOn: [], provenance: { sourcePath: `${DOC}/04_DECISION_REGISTER_R01.md`, commitSha: "e11a1d399d14", sourceStatus: "committed" }, note: "Decision of architecture recorded; RLS/security signoff and intake remain blocked gates." },
    { id: "D-02", title: "D-02 Apolloa status — pre-registration independent agora confirmed; legal form, jurisdiction, equity PENDING", kind: "decision", origin: "recorded", recordedStatus: "blocked", evidenceState: "declared", confidence: "medium", nextActor: "owner", dependsOn: ["OWNER-PHASE-A"], provenance: { sourcePath: `${DOC}/M281_DECISION_AND_EVIDENCE_GATES_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" } },
    { id: "U1", title: "U1 — Ultimate taxpayer / remitter for marketplace-collected tax", kind: "unknown", origin: "recorded", recordedStatus: "unknown", evidenceState: "unknown", confidence: "not-applicable", nextActor: "counsel-cpa", dependsOn: [], provenance: { sourcePath: `${DOC}/03_OPEN_DECISIONS_AND_UNKNOWNS.md`, commitSha: "5da71991", sourceStatus: "committed" } },
    { id: "U2", title: "U2 — Great Order legal form, ownership, tax classification", kind: "unknown", origin: "recorded", recordedStatus: "unknown", evidenceState: "unknown", confidence: "not-applicable", nextActor: "owner", dependsOn: [], provenance: { sourcePath: `${DOC}/03_OPEN_DECISIONS_AND_UNKNOWNS.md`, commitSha: "5da71991", sourceStatus: "committed" } },
    { id: "U3", title: "U3 — Marketplace facilitator status of the platform", kind: "unknown", origin: "recorded", recordedStatus: "unknown", evidenceState: "unknown", confidence: "not-applicable", nextActor: "counsel-cpa", dependsOn: [], provenance: { sourcePath: `${DOC}/03_OPEN_DECISIONS_AND_UNKNOWNS.md`, commitSha: "5da71991", sourceStatus: "committed" } },
    { id: "U4", title: "U4 — Which entity is employer / payer of record", kind: "unknown", origin: "recorded", recordedStatus: "unknown", evidenceState: "unknown", confidence: "not-applicable", nextActor: "counsel-cpa", dependsOn: [], provenance: { sourcePath: `${DOC}/03_OPEN_DECISIONS_AND_UNKNOWNS.md`, commitSha: "5da71991", sourceStatus: "committed" } },
    { id: "EV-REQ", title: "Evidence requests — 43 originals requested, none received", kind: "evidence_request", origin: "recorded", recordedStatus: "blocked", evidenceState: "blocked", confidence: "high", nextActor: "owner", dependsOn: ["D-01"], provenance: { sourcePath: `${DOC}/01_EVIDENCE_REGISTER_AND_INTAKE_PROTOCOL.md`, commitSha: "5da71991", sourceStatus: "committed" }, note: "Intake stays closed until the D-01 store + RLS gates clear. Do-not-collect until then." },
    { id: "OBL-APOLLOA-FORMATION", title: "Apolloa formation obligation — PLANNED, not started; deadline UNKNOWN", kind: "task", origin: "recorded", recordedStatus: "open", evidenceState: "declared", confidence: "medium", nextActor: "owner", dependsOn: ["D-02", "OWNER-PHASE-A"], provenance: { sourcePath: `${DOC}/M281_DECISION_AND_EVIDENCE_GATES_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" } },
    { id: "OWNER-PHASE-A", title: "Owner Phase A inputs (county, footprint, first activity, SKU class, income band, ownership intent, Great Order status)", kind: "task", origin: "recorded", recordedStatus: "open", evidenceState: "observed", confidence: "high", nextActor: "owner", dependsOn: [], provenance: { sourcePath: `${DOC}/M281_DECISION_AND_EVIDENCE_GATES_R01.md`, commitSha: "1b241309dc3ccc5a3e846500f634e255f0b954b5", sourceStatus: "committed" } },
    { id: "GPT6-M281", title: "GPT-6 adjudication of M2.8.1 — provisional acceptance for synthetic development (owner-relayed)", kind: "task", origin: "recorded", recordedStatus: "in_review", evidenceState: "declared", confidence: "medium", nextActor: "gpt-6", dependsOn: [], provenance: { sourcePath: "Owner relay of GPT-6 adjudication, 2026-10-26", commitSha: null, sourceStatus: "owner-relayed" } },
    { id: "M282-BUILD", title: "M2.8.2 console build + tests + CI on isolated branch", kind: "task", origin: "recorded", recordedStatus: "in_review", evidenceState: "observed", confidence: "high", nextActor: "gpt-6", dependsOn: [], provenance: { sourcePath: `${DOC}/M282_ECOSYSTEM_CONSOLE_PREVIEW_HANDOFF_R01.md`, commitSha: "05aa3755001af92fd9bcef7ffb31a2ec198984b0", sourceStatus: "committed" } },
    { id: "M283-PREVIEW", title: "M2.8.3 protected preview — PROPOSED action; requires explicit owner authorisation", kind: "task", origin: "proposed", recordedStatus: "open", evidenceState: "unknown", confidence: "not-applicable", nextActor: "owner", dependsOn: ["M282-BUILD"], provenance: { sourcePath: `${DOC}/M282_ECOSYSTEM_CONSOLE_PREVIEW_HANDOFF_R01.md`, commitSha: "05aa3755001af92fd9bcef7ffb31a2ec198984b0", sourceStatus: "committed" } },
  ],
};

/* ------------------------------- derivation ------------------------------- */

/**
 * Status is derived, never trusted raw:
 * - a PROPOSED item can never display as complete;
 * - an item whose evidence is unknown displays unknown unless it is a
 *   recorded decision/task with a concrete recorded status;
 * - blocked stays blocked (dependencies never auto-clear).
 */
export function deriveStatus(item: BoardItem): ItemStatus {
  if (item.origin === "proposed" && item.recordedStatus === "complete") return "in_review";
  return item.recordedStatus;
}

/* ------------------------------- projection ------------------------------- */

export interface ConsoleView {
  version: string;
  generatedFrom: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  formationOptions: FormationOption[];
  timeline: TimelineEntry[];
  board: (BoardItem & { status: ItemStatus })[];
}

const NODE_KEYS: (keyof NetworkNode)[] = ["id", "label", "role", "legalEntity", "statusLabel", "evidenceState"];
const EDGE_KEYS: (keyof NetworkEdge)[] = ["id", "sourceId", "targetId", "type", "category", "evidenceState", "label"];
const BOARD_KEYS: (keyof BoardItem)[] = ["id", "title", "kind", "origin", "evidenceState", "confidence", "nextActor", "dependsOn", "provenance", "note"];
const TIMELINE_KEYS: (keyof TimelineEntry)[] = ["id", "title", "date", "state", "evidenceState", "provenance"];
const OPTION_KEYS: (keyof FormationOption)[] = ["id", "name", "formation", "foreignQualification", "publication", "annualState", "formationEvidence", "totalCost", "totalState", "openUnknowns", "provenance"];

function pick<T extends object>(obj: T, keys: (keyof T)[]): Partial<T> {
  const out: Partial<T> = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

/**
 * Confidentiality projection: allowlist-only. Any field not on the allowlist
 * (names of individuals, finances, identifiers) is dropped, and Apolloa can
 * never project as a legal entity or as owned: ownership edges are removed
 * unless an executed-basis record exists in the manifest — R01 has none.
 */
export function projectConsoleView(raw: ConsoleManifest): ConsoleView {
  const nodes = raw.nodes.map(n => {
    const p = pick(n, NODE_KEYS) as NetworkNode;
    if (p.id === "apolloa") p.legalEntity = false; // pre-registration, by record
    return p;
  });
  const edges = raw.edges
    .filter(e => e.category !== "ownership") // no ownership edge is evidenced in R01
    .map(e => pick(e, EDGE_KEYS) as NetworkEdge);
  const board = raw.board.map(b => {
    const p = pick(b, BOARD_KEYS) as BoardItem;
    return { ...p, recordedStatus: b.recordedStatus, status: deriveStatus(b) };
  });
  return {
    version: raw.version,
    generatedFrom: raw.generatedFrom,
    nodes,
    edges,
    formationOptions: raw.formationOptions.map(o => ({ ...(pick(o, OPTION_KEYS) as FormationOption), totalCost: null, totalState: "NOT_COSTABLE" as const })),
    timeline: raw.timeline.map(t => {
      const p = pick(t, TIMELINE_KEYS) as TimelineEntry;
      // No invented dates: a date without commit provenance is stripped.
      if (p.date !== null && (!p.provenance || !p.provenance.commitSha)) p.date = null;
      return p;
    }),
    board,
  };
}

export const CONSOLE_VIEW: ConsoleView = projectConsoleView(CONSOLE_MANIFEST);
