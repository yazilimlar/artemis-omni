# M2.8 — Decision Register v0.1

**Status: DRAFT_ASSUMPTION. Approvals: NONE.** Every decision below is `UNKNOWN` or `PROVISIONAL` unless the owner records otherwise. A decision changes only by an explicit owner entry here (decidedBy + decidedAt + evidenceRefs) — never by implication from a received document, a filled template, or an AI draft (adversarial P0-1/P1-6 guards).

## Carried decisions (from M2.6/M2.7 — unchanged)

| ID | Question | Status | Evidence required | Downstream dependencies |
|---|---|---|---|---|
| U1 | Does any specific processor withhold and remit sales tax, and by which pathway? | UNKNOWN | Processor settlement + tax reports (04 §4 items); pathway must be distinguishable or the workpaper records UNKNOWN (M2.7.1 C2 rule) | 06 sales-tax workpaper; kernel tax position certification |
| U2 | What are the legal entities / taxpayers among Great Order LLC, ARTEMIS, AgoraXAI, Apolloa — formation, ownership, classification? | UNKNOWN | Formation documents, EIN confirmations, operating agreements, amendments (04 §1); IP/domain records (04 §2) | 01 register verification; 02 edges; INT-04 usability; page-copy ownership claims correction |
| U3 | Legal tax treatment of payouts, fees, credits, collected tax per entity/year? | UNKNOWN | U1 + U2 evidence, actual transactions, CPA review (D-05) | 06 tax-treatment fields (locked UNKNOWN until then); any filing |
| U4 | Git-history / public-exposure remediation for previously published identifiers and ownership claims? | NOT AUTHORIZED | Exposure inventory + sensitivity assessment (04 §8); explicit owner decision (D-06) | Public repo hygiene; no rewrite without owner approval |

## M2.8 decisions

| ID | Question | Status | Recommendation (integrator) | Blocks |
|---|---|---|---|---|
| D-01 | Which private, access-controlled store is the designated evidence store of record? | UNKNOWN — **owner decision requested** | Designate before collecting any originals; until designated, the operative rule is *do not collect* (07 §5). Repo holds only IDs/types/status/hashes. | All 04 receipts |
| D-02 | Is the provisional entity list in register 01 complete and correctly named (incl. whether Apolloa and AgoraXAI are brands, projects, or entities)? | UNKNOWN — **owner confirmation requested** | Owner confirms/corrects names and kinds; register stays provisional until U2 documents arrive. | 01/02 finalisation (not drafting) |
| D-03 | Adopt the status-transition guard (no status upgrade without a Decision-ref + evidence) as a standing rule for all registers? | PROVISIONAL | Adopt — it is already the operating assumption of docs 01–07 and the JSON schema invariants. | Nothing (drafts proceed) |
| D-04 | Engage counsel to review the 05 template catalog before any template is used with a counterparty? | UNKNOWN | Required before use per template headers; drafting/review of templates themselves needs no engagement. | Any real use of INT/EXT templates |
| D-05 | Engage CPA review for U3 (entity classification + tax treatment)? | UNKNOWN | Queue after U1/U2 evidence exists; CPA time before evidence is wasted. | U3 |
| D-06 | U4 remediation stance: accept public-history exposure, redact going forward only, or authorize a scoped history rewrite? | UNKNOWN | Decide only with the 04 §8 exposure inventory in hand; default until then: redact going forward, no rewrite. | U4 closure |
| D-07 | Retention periods in policy 07 §6 (currently all TBD)? | UNKNOWN | Set per document class with counsel/CPA input; no deletion occurs under TBD periods. | Evidence lifecycle automation |
| D-08 | Does the M2.8 foundation proceed to v0.2 (filled registers from received evidence) or pause after v0.1? | PROVISIONAL | Proceed to v0.2 only as 04 receipts land; drafting more templates ahead of evidence has low value. | v0.2 planning |

## Decision hygiene rules

1. `PROVISIONAL` decisions may guide drafting; downstream consumers must treat them as non-authoritative (adversarial P2-4).
2. Options and recommendations are recorded even when the decision is UNKNOWN, so the owner's one decision closes the question.
3. A superseded decision keeps its history: status → SUPERSEDED with a pointer to the replacing entry.
