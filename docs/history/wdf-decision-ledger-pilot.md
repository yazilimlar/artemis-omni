# WDF public/test decision ledger pilot

## Assignment and ownership

One writer: dot, executor authorization carried forward by the owner. Assigned fresh worktree `/workspace/scratch/938e387ab508/artemis-wdf-ledger`, branch `labs/wdf-decision-ledger`, clean baseline `ce5d32a945300241d9a6f1b321e7cb0b52c76adc` (PR #344). Canonical repository and verified default branch: `yazilimlar/artemis-omni`, `main`. The previous dirty reliability worktree was neither edited nor switched.

Infrastructure & Construction / CivicBid family. WDF prototype, demonstration maturity, public-safe noindex review, mixed explicit public-source facts and non-confidential test assumptions. Product-specific, no cross-product effects or donor migration. The existing route `/labs/bid-radar-wdf-01` and standalone registry entry stay unchanged. Governing boundaries: ADR-001/004/005/006/010/014/017; the reliability specification at `docs/history/wdf-reliability-pilot.md` remains the private-pilot gate, not an assertion this public prototype meets it.

Allowed files changed: WDF runtime `app.mjs`, `index.html`, `intelligence.mjs`, `model.mjs`; new `ledger-model.mjs`, `ledger.mjs`, `deadline-status.mjs`, `ledger.css`; `tests/unit/wdf-ledger.test.ts`; this record. No other page, routing, auth, database, registry, deployment configuration, dependencies, confidential records or production merge.

## What this implements

- A usable Decision ledger view: choose a published notice, create named prime/subcontract/JV/other pursuits, enter separate assumptions, assess eligibility, record a human decision, inspect/export its snapshot, and append later outcomes.
- Each source notice starts in its own explicitly provisional local project/package container. Dataset plus notice ID defines source identity. PINs do not. Related notices are explicit, evidence-backed relationship reviews; even confirmed links never merge identity, deadlines or money. All observations and relationship review records are retained. No package or alternative-pursuit financial totals are calculated.
- On refresh, materially changed source fields create a version. No-op refreshes do not. Disappeared notices are retained and never inferred cancelled. Original live source records are included when available; the shipped snapshot contains normalized published fields and is labeled as such. This does not reconstruct amendments from before the session.
- Every role-specific pursuit owns its scenario and eligibility. Inputs record value, units, origin and UTC as-of time. The optional example-fill button explicitly labels all values synthetic and does not claim they estimate the selected project.
- Eligibility states: pass, fail, unknown, not applicable. Non-unknown assessments require a complete public HTTP(S) evidence URL or document reference. Reviewer, assessment time and optional validity dates are retained. Future assessments, expired validity and not-yet-valid evidence become effectively unknown without rewriting the recorded assessment. Unknown or absent eligibility creates a resolution task; failure never creates an automatic rejection.
- Explicit human snapshot capture requires reviewer, rationale and a public/test-data acknowledgment. Deep-cloned, deep-frozen snapshots preserve the pursuit, scenario, all then-observed versions for its package and reviewed related packages, candidate links, effective eligibility, resolution tasks, exact model inputs and signed velocity-v2 result. Later edits, refreshes and outcomes cannot change them through the model API.
- Outcomes are separate append-only user-reported records. Linking an outcome to another pursuit's decision is rejected. No predictive model training or calibrated probability claim is introduced.
- Session and individual-snapshot JSON exports use the existing explicit download/copy dialog. The dialog says a download was requested, never that it completed. There is no restore/import workflow.

## Contextual typography and deadlines

Reference lock: preserve the existing Workshop/Archivo, Swiss/Inter, Blueprint/IBM Plex and Editorial/Source Serif direction. Body, data and dates use the theme's business-friendly sans; only Editorial headings retain the existing serif. Numeric values have tabular figures. A restrained evidence register, numbered review steps and decision history provide the native grammar. This is a WDF-only styling layer, not a shared design-system change.

The Refero design skill and typography/color guidance were read. Three attempted style searches returned `NO_SUBSCRIPTION`; no retrieved external style reference is claimed. Choices are grounded in the existing four-theme product, the owner's request for contextual/rational/business-friendly fonts and dates, ADR-017 and accessibility guidance. No new fonts, assets or dependencies were added.

- Responsive type scale: 16px root; 13–16px working text, 11–12px supporting metadata, fluid headings, 44px primary input/button targets. Mobile stacks the ledger, wraps actions and preserves scrollable data rather than shrinking text.
- Status color has a defined meaning and is accompanied by words: amber needs verification/near deadline, red imminent verified deadline or a recorded failure, green assessed pass, slate elapsed/neutral. An elapsed deadline does not assert the procurement itself is closed. All four themes retain independent heading fonts.
- Date and countdown are separate lines. Only timestamps containing an explicit source offset may produce coarse hour/day remaining text. No seconds, blinking or false precision. Offsetless and date-only values always carry verification text and no countdown; source-date comparisons explicitly use America/New_York today, without claiming that is the issuer's timezone. Same-day, invalid, missing, elapsed and distant/placeholder cases have textual statuses.
- Visible deadline text refreshes once a minute without rerendering forms, moving focus or announcing a ticking timer. Invalid clocks fail closed to verification.
- Programmatic WCAG contrast checks for new status text/background pairs: 6.40–6.55:1; muted text on each theme canvas: 5.58–6.16:1. These checks do not replace full visual/accessibility review of every legacy chart and component.

## Verification

- Focused WDF tests: 30 passed, including 18 ledger/date/style tests and the existing 12 reliability/export/source tests.
- Full suite: 295 passed, 3 pre-existing failures in `standalone-isolation.test.ts` (hardcoded iframe count, unrelated Lego external import map, unrelated HVAC missing SRI). These files are unchanged.
- Typecheck passed after correcting test typings. Lint passed without warnings/errors. Module syntax and relative import checks passed; `git diff --check` passed.
- First fresh-worktree build failed in the unrelated root Next Google-font loader before typecheck (`Cannot read properties of null (reading '1')`). One ordinary retry uses the same non-secret Supabase placeholders as the prior successful reliability build. The retry passed the full production build and scene validators, with no source/configuration changes or font mocks. Preview evidence is recorded below when complete.
- Independent read-only model review caught future-dated assessment leakage and incomplete evidence URLs. Both were fixed and covered by regression tests before publication. A later integration review caught discarded unsaved assessment/decision drafts on source refresh; the interface now preserves all ledger form drafts and the assessment edit ID per pursuit, with an event-level regression.

## Limits and next gate

This is a memory-only, single-tab public/test-data demonstration. Reloading destroys the session. It has no authentication, private deployment, access control, confidential-document intake, persistence, cryptographic integrity, signed timestamps, secure audit trail, source licensing assurance or concurrent-user coordination. Exported JSON is editable and must be retained independently. Test aliases are self-reported, not accountable authenticated identities. Do not use for confidential WDF bids or as operational bid authority.

A real private pilot requires the separate authorization/security/retention/isolation/identity gates in the reliability specification. Before any merge: exact-head CI, preview desktop/mobile interaction and owner review. No production release is authorized here. Next recommended task after public workflow review: decide the private-pilot architecture and data authorization, not automatic bid/no-bid or probability calibration.
