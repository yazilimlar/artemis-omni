# BidRoom AtlasIQ Evidence Engine V1

## Objective
Convert a public bid package into a versioned, evidence-linked digital record that supports estimator review without replacing controlling procurement documents.

## Processing stages
1. Capture source URLs, timestamps, files and SHA-256 hashes.
2. Classify notices, addenda, drawings, specifications, bid forms, reports and schedules.
3. Extract clause-level and sheet-level facts with page or region evidence.
4. Cross-link specifications, drawings, bid items, addenda, permits and qualifications.
5. Run independent specialist reviews and an adversarial verification pass.
6. Require human approval before a field becomes Confirmed.

## Field statuses
- Confirmed: explicit in a controlling document and verified.
- Derived: calculated from confirmed inputs.
- Inferred: likely but not stated explicitly.
- Conflicted: two or more sources disagree.
- Superseded: replaced by an addendum or later document.
- Missing: not located.
- Human review required: model output cannot be safely promoted.

## First pilot deliverables
- Document register
- Addendum register and delta log
- Drawing register
- Specification matrix
- Bid item and quantity table
- Permit matrix
- Qualification matrix
- Commercial terms matrix
- Scope and responsibility matrix
- Risk and clarification log
- Model disagreement report
- Evidence-linked executive summary

## Multi-model review roles
- Software architecture
- Procurement compliance
- Estimating and operations
- Drawings and specifications
- Adversarial verification
- Accessibility and interface

Each review must reference an immutable commit or document hash and return structured findings. Model agreement alone is not proof; evidence authority and traceability control acceptance.
