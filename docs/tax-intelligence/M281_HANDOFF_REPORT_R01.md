# M2.8.1 Handoff Report R01 — Return to GPT-6 (Architecture Adjudicator)

| Field | Value |
|---|---|
| Milestone | M2.8.1 Apolloa Formation Intelligence & Ecosystem Registry |
| Integrator | Muse (Lead Integrator) |
| Date | 2026-10-26 |
| Canonical base | `feature/tax-intelligence-m28-documentation-foundation-r1` @ `63864c8609f887b9fbb1fb6ece0533b38f1c72b9` (Verified via GitHub API; handoff minimum base `c8c83a37` satisfied — it is HEAD's parent) |
| Deliverable branch | `feature/tax-intelligence-m281-apolloa-formation-r1` (isolated; created from the canonical HEAD; no work on `main`; no history rewritten) |
| Deliverable commit | **`1b241309dc3ccc5a3e846500f634e255f0b954b5`** (parent `63864c86`; author yazilimlar). This report is committed on top of it; its own SHA is in the integrator's return message |
| Mode | SYNTHETIC ONLY. No merge, deployment, formation, registration, payment, filing, contract, signed-looking artifact, live financial data, or confidential intake occurred |

## 1. Changed files (all new; no existing file modified on any branch)

| Path | Contents |
|---|---|
| `docs/tax-intelligence/M281_APOLLOA_DECISION_MATRIX_R01.md` | Formation decision matrix: NY LLC / DE+NY / NJ LLC / Great Order DBA / wait, on primary-source-verified fees |
| `docs/tax-intelligence/M281_ECOSYSTEM_ROLE_MODEL_R01.md` | Independent-agora role model: 10 role record types, typed many-to-many edges, per-type activation, 3-view separation, 11 non-inference rules |
| `docs/tax-intelligence/M281_DECISION_AND_EVIDENCE_GATES_R01.md` | Minimum owner inputs (10), formation task, actual-operator hard gate, evidence-per-upgrade table, Great Order reliance gate |
| `docs/tax-intelligence/M281_TOPOLOGY_AUDIT_R01.md` | Read-only GitHub/Vercel audit (deliverable 5) |
| `docs/tax-intelligence/M281_GEMINI_REGULATORY_REVIEW_R01.md` | Gemini challenger annex (verbatim): 19-row verification table, 16 notes |
| `docs/tax-intelligence/M281_GROK_ADVERSARIAL_REVIEW_R01.md` | Grok adversarial annex (verbatim): findings G-01…G-17, activation table, tests N-01…N-28 / P-01…P-08, residual risks |
| `lib/tax-intelligence/ecosystem.ts` | Synthetic ecosystem validator (fail-closed, coded exceptions) |
| `lib/tax-intelligence/ecosystem.test.ts` | 36 tests: N-01…N-28 negative + P-01…P-08 positive controls |

Panel method: one identical evidence packet to all three lanes; Claude = scoped writer (matrix + role-model drafts), Gemini = accounting/regulatory challenger, Grok = adversarial security; integrator integrated, re-verified figures directly (NY DOS page; Delaware Code Online §18-1105/§18-1107), and re-ran all tests. Builder/reviewer separation held.

## 2. Tests executed (local runs — reported honestly)

- **vitest:** `ecosystem.test.ts` — **36 passed / 36** (28 negative + 8 positive), run by the integrator in an isolated staging copy against the repo's locked toolchain (vitest 4.1.10, node 24).
- **TypeScript:** `tsc --noEmit` (strict) — **exit 0**.
- **CI:** the M2.6 workflow triggers only on `feature/tax-intelligence-client-app-r1`; it does **not** run on this branch. **No CI-green claim is made.** Extending CI to this branch is a separate owner-approved change (audit recommendation 2).

## 3. Material corrections established by this package

1. **Delaware annual LLC tax is $400, not $300.** The preliminary brief's figure (via the Division FAQ) is stale. The statute — 6 Del. C. §18-1107(b) as amended by HB 400 (85 Del. Laws c. 273 §23) — and the Division's current tax instructions both state $400 (due June 1 for the prior year; $200 + 1.5%/mo late; no proration). Integrator read the statute text directly.
2. **NJ formation is $100, not $125** (current NJ Treasury fee schedule).
3. **NY publication is NOT COSTABLE** today: DOS publishes no newspaper price; it is county-determined. Every total containing it is published as verified fixed fees + named variables. Foreign LLCs do **not** escape it (LLC Law §802).
4. **DBA route corrected:** for an LLC operator, NY assumed name = DOS filing, $25, no county fee (GBL §130). County-clerk certificates are sole-proprietor/partnership only. The DBA option is **NOT COSTABLE** until Great Order's legal form is verified (U2).
5. **Delaware formation fee = UNKNOWN** (secondary sources conflict; no current official figure captured). Carried as UNKNOWN, not estimated.

## 4. Review findings — disposition

**Gemini (regulatory/accounting):** 3 P0s — all **closed in the matrix/gates**: DE $400 rebuild; publication false-precision struck (fixed-fee + variable presentation); DBA category error corrected + NOT COSTABLE. P1s closed: IT-204-LL $25–$4,500 band and biennial added; DE formation/agent shown UNKNOWN; two-state stacking shown structurally; "wait" costed as $0-fee but not $0-risk; actual-operator + collected-tax-separation hard gates added; CBP/FDA-facility/prior-notice/marketplace/employer gates added. Proposed Gemini acceptance posture (conditional) is adopted as the integrator's own (§6).

**Grok (adversarial):** 7 P0 / 7 P1 / 3 P2. All P0/P1 attack classes are implemented in the validator and covered by named tests (subsidiary derivation, clone/kind bypass, EXECUTED-only referential basis, per-type activation, allowlist serialization incl. low-entropy-hash and small-N leaks, free-text/AI approval rejection, unknown-string quarantine, tenant checks on endpoints+documents+decisions, scope, date range/overlap/backdating, self-loop/cycle/duplicate, shape/prototype attacks). P2s: error codes carry no attacker strings (by construction — codes + opaque IDs only); fixtures carry synthetic markers; exception output is sorted/deterministic.

## 5. Residual P0/P1 (open, not closed by this milestone)

- **P1 (process, Grok §5.1–5.3, 5.6):** real-world document authenticity, actor-identity strength, genuine-but-legally-wrong approvals, and trusted timestamps/audit trail are **not** closable in code. They sit behind the **D-01 gate**: private evidence intake, RLS/security signoff, and audited auth remain blocked. The validator checks record fields, not the world.
- **P1:** Vercel project↔repo↔branch mapping remains **UNKNOWN** (token scope-limited; projects list empty, teams 403, no `.vercel/project.json`). No preview can be proposed until a verifiable read path exists.
- **P1:** Schema v0.2 decision still needed for native platform/participant/capability/industry/operator/contract kinds and for `account`-kind placement (role model gaps G-1/G-3/G-7). The validator encodes roles over v0.1 kinds as an interim, stated explicitly.
- **No residual P0** is claimed open in the synthetic validator scope: all Grok P0 tests pass. If GPT-6 reads any P0 test as loosely asserted, Grok's posture applies — that is a BLOCK, and the integrator concurs.

## 6. Proposed acceptance decision (integrator → GPT-6)

**CONDITIONAL ACCEPTANCE — synthetic scope only**, on these terms:
- Accept: the decision matrix (as duties + verified fixed fees, totals NOT COSTABLE), the ecosystem role model, the gates document, and the synthetic validator with its 36 tests, as the M2.8.1 draft baseline.
- Explicitly **not** accepted or authorised: any formation route selection (D-02 legal form/jurisdiction/equity still pending), any merge, deployment/preview, live data, evidence intake, registration, or filing. U1–U4 remain UNKNOWN. M2.7.1 synthetic acceptance is unaffected.
- Conditions: (a) GPT-6 adjudicates the two annexes against the committed files; (b) any P0 test judged failing/skipped/loose converts this to BLOCK; (c) fee figures are a 2026-10-26 snapshot and must be re-verified before any owner filing decision.

## 7. Owner decisions requested (only these block next steps)

1. **Phase A inputs** (gates doc §2, items 1–7 first): NY office county; operating footprint by state; first activity + date + any past Apolloa-branded activity and by whom; product/SKU class; year-1 NY income band; ownership/manager/investor intent (private channel only); Great Order verified status.
2. **D-02 completion** (after Phase B counsel/CPA): entity, jurisdiction, equity, legal operator.
3. **Preview gate (proposed next gate, not requested now):** no preview is proposed in this package. The next gate, when reached, is: verifiable Vercel read path → mapping confirmed → owner authorises a preview of the documentation/validator surface only — never production, never with live data.

---
*DRAFT — for GPT-6 adjudication. This report asserts nothing about legal formation, ownership, tax classification, or readiness to trade.*
