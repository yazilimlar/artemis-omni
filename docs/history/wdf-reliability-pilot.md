# WDF radar reliability pilot: specification and acceptance plan

## Scope and assignment
Approved executor: dot, one writer. Isolated worktree `/workspace/scratch/938e387ab508/artemis-omni`; branch `fix/wdf-reliability-pilot`; expected baseline `309ded2737c613a3cfa5c9e2cd7b1d6911e4b7d3`, clean main and remote default main. Allowed changes: WDF standalone model, interface and exports, focused WDF tests, this specification. No auth, registry, routing, other products, dependencies, confidential records or production release. Owner approved this scope after being asked explicitly. Nine open PR file lists checked: no overlap.

Owner: Infrastructure & Construction / CivicBid family, WDF prototype, public-safe noindex demonstration, mixed explicit data (official public notices and clearly identified user assumptions). Commercial maturity: demonstration, not operational bid authority. Route `/labs/bid-radar-wdf-01`; standalone registry entry unchanged. ADR-001/004/005/006/010/014 boundaries preserved; no cross-product effects or donor import.

## Review reconciliation
Inputs: parent-provided synthesis of Claude review (Library attachments supplied to parent) and Grok independent assessment at https://wdf-bid-radar-independent-assessment-and-otxs.pages.grok.bot/. This record distinguishes those recommendations from independently reproduced code behavior; it does not claim independent retrieval of either complete review.

Accepted common direction: evidence-first decision support, never automatic bid/no-bid. A 1/N bidder illustration is not a calibrated win probability. Large awards remain visible; no arbitrary outlier exclusion. Preserve notices, uncertain links and repeated PINs, rather than inventing deduplicated contracts. Unknown eligibility requires resolution, not automatic rejection. Public demonstrations must not collect confidential WDF bid information.

## Verified baseline findings
- Public model and main file have identical SHA-256 b37e5a29a760fd61dbb8b60c43230e36f4d9b9f20f3e63be2b7d31a78725cf41.
- Executed reproduction: a negative $100,000/month scenario returned priority -100,000 at 100% confidence, -10,000 at 10%, and zero with zero capacity. Descending ordering therefore rewarded uncertainty/unavailability for losses.
- Executed deadline reproduction: a 15:00Z timestamp was labeled 15:00 ET; invalid input threw RangeError. Offset-free times did not carry timezone evidence.
- Snapshot has 51 unique solicitation notice IDs and 2,663 unique award IDs. Largest award notice $3,984,820,000 is retained. Repeat agency/PIN groups are not merged.
- Independent review reproduced stale JSON brief export after editing without rerender (10→20 still exported 10). Corrected to copy current assumptions and recompute on click; behavioral regression added.
- CSV carried source URLs but omitted explicit notice IDs and retrieval provenance. Existing export dialog gives a copy fallback and never confirms file-save completion; retain that behavior.

## Stage 1: bounded public reliability patch
1. Remove subjective multiplier from financial ranking. Signed profit/month stays signed; retain `priority` only as a compatibility alias to velocity, versioned `velocity-v2`. Confidence and capacity stay explicit, separate review inputs. No composite ranking is asserted to be validated. Unknown/whitespace and overflow inputs do not become usable financial estimates.
2. Preserve raw deadline, calendar validity, precision and timezone evidence. Offset-bearing values retain their stated offset; offset-free values say timezone unverified. Date-only means time not published. Malformed and far-future placeholder dates must not crash views or masquerade as normal timeline dates. No unsupported conversion or deadline countdown.
3. Show notice ID and export notice ID, dataset, retrieved-at, raw dates and timezone evidence. PIN is explicitly not contract identity. JSON brief includes schema version, export timestamp, notice and deadline evidence. Published award amounts remain notice totals, not contract sums.
4. Keep sandbox, public datasets, human decisions and memory-only operation unchanged. No production merge in this stage.

## Stage 2: evidence model and private pilot design (not implemented)
Represent Project -> Package -> NoticeVersion, with many role-specific Pursuits per package (prime, subcontract, JV or other approved role). Preserve raw source records and material-field versions, including amendments, cancellations, reused PINs and uncertain relationships. Every candidate link carries evidence and review status; no inferred link silently merges money or deadlines.

Eligibility records: pass/fail/unknown/not applicable, requirement, applicable role, evidence URL/document reference, reviewer, assessed-at and validity window. Unknown creates a resolution task; a verified failure only becomes a human-reviewed decision, not automated rejection.

Append-only DecisionSnapshot: notice versions available at decision time, pursuit role, assumptions with origin/units/as-of, financial model version, eligibility state, selected scenario, accountable reviewer and rationale. Later changes create a new snapshot. Outcome records are separate from snapshots to prevent hindsight leakage. Public-source records and confidential estimates must be classified separately.

Before any confidential pilot: approved private deployment, authentication and least-privilege authorization, isolation tests, approved retention/deletion/export policy, audit trail, source licensing and WDF data authorization. No public preview intake of confidential bids. Architecture and security changes require their own governance review.

## Stage 3: controlled decision-support pilot (not implemented)
Use a limited, owner-approved set of public or authorized private pursuits with named estimators. Record decision quality, missing evidence, estimation effort and outcomes. Do not train or advertise win predictions until adequate outcomes, leakage checks, calibration and validation across relevant segments are independently reviewed. Do not automate bid/no-bid or submission.

## Acceptance tests and release gates
Stage 1 P0:
- Loss/zero/profit cases across 0/10/100% confidence and capacity: no multiplier-driven rank inversion; more risk or lower margin cannot improve signed financial ranking.
- Blank, whitespace, zero duration, out-of-range probability, infinity and numeric overflow: not modeled. Zero remains allowed when explicit and valid.
- Invalid date, impossible calendar day, date only, UTC, explicit offset and DST ambiguous/nonexistent local time: preserve evidence; no invented timezone or crash. Placeholder year 2099: verify, not a normal timeline bucket.
- Reused PIN across amendments/cancellations/packages: retain separate IDs. Largest shipped award retained. Notice totals clearly labeled; no false unique-contract total.
- Radar/award CSV and JSON: identifiers and source timestamps survive export; quoting/formula defenses remain; generated and downloaded files must be separately verified. A download request is never described as completed.
- Public route and sandbox unchanged; no confidential data or new external transmission. Typecheck, lint, tests, full build, exact-head CI and preview desktop/mobile review required. Report existing unrelated failures separately.

Stage 2/3 P0 before real pilot:
- Role-specific pursuits do not overwrite each other; package totals and alternatives cannot be double counted.
- Amendments/cancellations preserve earlier snapshots; unknown eligibility never becomes a silent fail/pass.
- Actor, time, model version and evidence can reconstruct each decision. Outcome edits cannot rewrite decision-time information.
- Unauthorized/anonymous users cannot access private records, exports, attachments or audit logs; cross-user isolation and retention deletion are tested.
- No automatic go/no-go, confidential public data, fabricated forecasts or 1/N presented as calibrated probability.

## Verification ledger
Focused WDF tests: 12 passed. Typecheck, lint and full build passed with non-secret Supabase placeholders (required by unrelated pre-existing auth prerender). Full suite: 276 passed / 3 failed before adding the export regression; the three are previously documented standalone-isolation failures (hardcoded iframe count, unrelated external importmap, unrelated missing SRI), not modified here. Final checks are rerun after the export correction. Independent source review found the stale export and verified deadline timeline safety, escaping and notice preservation. Local browser could not reach executor loopback; Vercel preview UI QA is pending. Actual downloaded-file completion remains unverified. No production merge or deployment authorized for this stage.
