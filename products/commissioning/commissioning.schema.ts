/**
 * P4a commissioning types (exhaust fan HVAC-EXFAN-001 vertical slice). Types only; SYNTHETIC fixtures.
 * Executions are E0 envelopes (kind "commissioning-test"); lifecycle state lives in an append-only ledger because
 * E0 hashes the payload only. PASS = recorded values satisfy the selected criteria; never compliance or EoR acceptance.
 */
import type { EvidenceEnvelope } from "../evidence/evidence.schema";

export type Outcome = "PASS" | "FAIL" | "INCOMPLETE";
export type Role = "executor" | "reviewer" | "approver" | "system";
export type LedgerDimension = "verification" | "validity" | "workflow" | "approval";

export type Range =
  | { mode: "pctOfInput"; input: string; lowPct: number; highPct: number }
  | { mode: "inputBounds"; lowInput: string; highInput: string };

export interface CommissioningTestDefinition {
  definitionId: string;
  revision: number;
  applicability: { productId: string; system: string };
  procedure: string;
  parameters: { id: string; unit: string; comparator: "BETWEEN"; range: Range }[];
  conditions: ({ id: string; comparator: "GTE"; value: number } | { id: string; comparator: "EQUALS"; value: string })[];
  provenance: {
    source: string | null; edition: string | null; section: string | null;
    applicability: string; verificationStatus: string;
    /** Required true when source is null. */
    representative?: boolean; note?: string;
  };
}

export interface EquipmentInstance {
  instanceId: string; // EQI- + sha256(productId, tag); survives input changes
  productId: string;
  tag: string;
  inputs: Record<string, number>;
  inputsHash: string;
  dataMode: "synthetic";
}

export interface ExecutionPayload {
  definitionId: string; definitionRevision: number; definitionHash: string;
  instanceId: string; instanceInputsHash: string; instanceInputs: Record<string, number>;
  conditions: Record<string, number | string>;
  observations: Record<string, { value: number; unit: string }>;
  conditionResults: unknown[]; parameterResults: unknown[];
  outcome: Outcome; outcomeMeaning: string; artifactRefs: string[]; dataMode: "synthetic"; note: string;
}
export type CommissioningExecution = EvidenceEnvelope<ExecutionPayload>;

export interface LedgerEvent {
  seq: number;
  logicalId: string;
  revisionId: string; // affected revision
  dimension: LedgerDimension;
  from: string; to: string;
  actorRole: Role;
  timestamp: string; // fixture-supplied ISO-8601 UTC, never a runtime clock
  detail: Record<string, unknown>;
  prevEventId: string | null;
  eventId: string; // EVT- + sha256(event content); content-derived
}
