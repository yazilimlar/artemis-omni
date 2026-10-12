/**
 * Evidence contract v2 types (E0). Types only. Spec: products/MEP_SCOPING.md section 1-2.
 * Runtime validator and identity helpers: products/evidence/evidence.mjs.
 * Not yet applied to P1-P3 outputs (P2.1 is the first consumer). Examples are SYNTHETIC.
 */
export type EvidenceKind = "clash" | "spool" | "commissioning-test";

/** Five independent status dimensions (never one mixed enum). */
export type Basis = "observed" | "declared" | "inferred" | "unknown";
export type Verification = "unverified" | "verified" | "failed";
export type VerificationScope = "mathematical" | "building-condition";
export type Validity = "current" | "stale";
export type Workflow = "draft" | "submitted" | "blocked" | "closed";
export type Approval = "pending" | "accepted" | "rejected" | "withdrawn";

export type CodeProfile = "NYC_2022_REFERENCE" | "IPC_2024_MODEL" | "UNSPECIFIED";

/** Every rule binds profile + edition + jurisdiction + verification status. */
export interface RuleBinding {
  ruleId: string;
  profile: CodeProfile;
  edition: string | null;
  jurisdiction: string | null;
  verification: Verification;
}

export interface EvidenceEnvelope<P = Record<string, unknown>> {
  kind: EvidenceKind;
  // identity: logical (stable object) vs revision (immutable) vs content (deterministic hash of payload only)
  logicalId: string;
  revisionId: string; // REV- + sha256(logicalId, revision, contentHash)
  contentHash: string; // sha256:<hex of canonical(payload)>; no timestamps inside
  revision: number; // monotonic per logicalId, starts at 1
  supersedes: string | null; // previous revisionId
  basis: Basis;
  verification: Verification;
  // reproducible verification: all null/empty while unverified; all required otherwise
  verificationScope: VerificationScope | null;
  verificationMethod: string | null;
  verificationBasis: string | null;
  verifiedRevisionId: string | null; // must equal this revisionId: later revisions do not inherit
  artifactRefs: string[];
  verificationTimestamp: string | null; // ISO-8601 UTC, kept outside the hash
  validity: Validity;
  workflow: Workflow;
  approval: Approval;
  approvedRevisionId: string | null; // pinned to this revisionId iff approval === "accepted"
  /** Lab default and only permitted value: verification or a signed rule never certifies a project. */
  complianceClaim: "NONE";
  ruleBindings: RuleBinding[];
  /** kind === "clash": logicalId = CLX- + sha256(sorted object logicalIds, clashType), never geometry. */
  clash: { objectLogicalIds: [string, string]; clashType: string } | null;
  payload: P;
}
