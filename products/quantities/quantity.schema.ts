/**
 * P2.1 model-derived quantity records. Types only. Each record IS an E0 EvidenceEnvelope (kind "spool");
 * no parallel shape. A dedicated "quantity" kind would need an E0 contract-version bump (not done here).
 * Values derive from the P2 spool engine's perRun output; they are NOT in qtyFor()/estimate().
 */
import type { EvidenceEnvelope } from "../evidence/evidence.schema";

export type ModelDriver = "DUCT_LF" | "FITTING_EA" | "HANGER_EA" | "SEISMIC_BRACE_EA";

export interface QuantityPayload {
  driver: ModelDriver;
  unit: "LF" | "EA";
  value: number;
  /** Exact integer total (0.01 ft units for LF, counts for EA). */
  valueUnits: number;
  unitsPerValue: number;
  scenario: string;
  /** L2 parametric; never promoted without an evidence record (promotion gate not enforced here). */
  qtoLevel: "L1" | "L2" | "L3" | "L4";
  qtoLevelBasis: string;
  activityId: string;
  derivedFrom: string;
  breakdown: { runId: string; productId: string; activityId: string; valueUnits: number }[];
  inQtyFor: false;
  inEstimate: false;
  status: "derived-not-in-estimate";
  label: string;
  dataMode: "synthetic";
  [k: string]: unknown;
}

export type QuantityRecord = EvidenceEnvelope<QuantityPayload>;
