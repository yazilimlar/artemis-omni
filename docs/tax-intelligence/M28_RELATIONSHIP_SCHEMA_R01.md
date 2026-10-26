# Dynamic Relationship and Document Registry — Concept v0.1
All examples are synthetic and non-authoritative.
## Records
Entity {id, kind: legal_entity|individual|brand|project|system|account|asset, displayName, jurisdiction?, identifiersRef?, status, validFrom?, validTo?, provenanceRefs[], verificationStatus}
Document {id, type, version, status, confidentiality, jurisdiction?, effectiveFrom?, effectiveTo?, sourceRef?, contentHash?, signatureStatus, approvals[], supersedesId?}
Relationship {id, fromId, toId, relationType, legalBasisDocumentIds[], evidenceRefs[], confidence: asserted|supported|verified|disputed|unknown, lifecycle: proposed|active|suspended|terminated, effectiveFrom?, effectiveTo?, tenantId, legalEntityScope?, ownerApprovalRef?, revision}
Obligation {id, partyIds[], category, amountOrFormula?, currency?, dueDate?, status, supportingDocumentIds[], approvalRef?}
Decision {id, question, options[], recommendation?, status: UNKNOWN|PROVISIONAL|APPROVED|REJECTED, decidedBy?, decidedAt?, evidenceRefs[], downstreamDependencies[]}
## Invariants
- Brand/project != legal entity; relationships do not imply identity or common ownership.
- Store source evidence separately from generated drafts; use immutable source hashes and access-controlled references.
- Effective-date queries must reproduce prior snapshots and amendments; supersession is explicit.
- Multiple possible ownership/contract/tax scenarios may coexist; only one owner-approved operative scenario where required.
- A claimed relation is not verified by matching string keys, internal references, or an AI-generated document.
- Legal entity, bank account, tax classification and signature verification are distinct gates.
- Access is tenant-scoped and least-privilege; no cross-tenant or cross-legal-entity inference.
- Public repo contains only schema and synthetic examples; private source files stay in an approved secure store, not Git.
## Example provisional edges (NOT verified)
Great Order LLC --[may own brand]--> ARTEMIS
Great Order LLC --[may own domain]--> agoraxai.com
ARTEMIS --[may provide software support]--> AgoraXAI
These are candidate relations to confirm from owner statements, domain/registration records, invoices and contracts. No legal identity or nonprofit status assumed.
## Integration strategy
Adapters expose typed entities, documents, relationships and obligations. Tax kernel consumes only approved, evidence-linked financial events; it must not infer legal ownership from brand labels. Unknown values fail closed where required. Version the schema, migration plan, and compatibility contract before code.
