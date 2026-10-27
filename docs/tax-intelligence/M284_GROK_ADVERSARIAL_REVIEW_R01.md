# M2.8.4 — Grok Adversarial Review (Security / Privacy Lane) R01

**Reviewer lane:** Grok (security/privacy adversarial) — review only, no code edited.
**Date:** 2026-10-27. **Packet:** `panel/EVIDENCE_PACKET.md` + `M284_CONTRACT.md` (issue #215, spec @ `c1cb2fdf`).
**Files reviewed** (repo root = `m284-build/app/`; task brief's abbreviated paths resolve to these):

- `lib/tax-intelligence/finance-console.ts` (90 lines, cited as `finance-console.ts:L<n>`)
- `lib/tax-intelligence/finance-console.test.ts` (11 lines, dense; cited as `finance-console.test.ts:L<n>`)
- `components/finance/FinanceConsole.tsx` (8 lines)
- `app/apps/finance-console/page.tsx` (7 lines)
- Pattern comparison: `lib/tax-intelligence/ecosystem-console-manifest.ts` (M282), `lib/tax-intelligence/access.ts`, `lib/auth/require-auth.ts`, `app/apps/ecosystem-console/page.tsx`

**Method:** line read of all files + executed negative tests against the real module
(Node 24 TS import of `finance-console.ts`, harness in `/tmp/grok-neg/repro.mjs`).
**22 / 22 adversarial probes reproduced** (marked `VULN-CONFIRMED` below with observed output).
Builder baseline re-run by this lane: `finance-console.test.ts` 18/18, `access.test.ts` 4/4,
`ecosystem-console.test.ts` 16/16 — **green**. Every finding below is therefore a *coverage gap*:
the builder's tests assert the security property in a narrow case and pass, while the
contract's acceptance test fails under the adversarial case in the same property class.

**Scope honesty:** all shipped fixtures are synthetic, no real identifiers were found
(grep for email / 9+ digit / SSN / EIN patterns over the finance files: none), the route is
auth-gated (see Credits). Nothing here is a live data breach today. The P0s are failures of
the contract's own acceptance tests in the derivation/projection layer — the layer that must
hold *before* any real tenant data is ever fed through these functions. Synthetic only;
no merge / production / filing implication is approved by this review.

**Verdict: BLOCK acceptance until P0-1 and P0-2 are fixed and re-tested. P1s must be fixed
or explicitly dispositioned by GPT-6 / owner before any non-synthetic input path is discussed.**

---

## P0 — Acceptance-test failures (fix before acceptance)

### P0-1. Rollup double counting is structurally undetectable — `managementRollup` sums blind
- `finance-console.ts:L17` — `PLResult` **does not retain `sourceIds`**. The only double-count
  guard, `derivePL` at `L22`, dedupes *inside one input object*; once derived, provenance of
  the numbers is discarded.
- `finance-console.ts:L31-35` — `managementRollup` sums any `PLResult[]` for a tenant with no
  overlap check, no duplicate `(subjectId, period)` check, and no period consistency check
  (`period: items[0]?.period` at `L35` — first item silently labels the whole rollup).
  `assertNoDoubleCount` (`L30`) is never called by `derivePL` or `managementRollup`.
- Contract violated: *"Same invoice/payment/source cannot be double counted in rollups;
  reconciliation exceptions surfaced"* and *"No double counting"* (hard gate).
- Reproduced:
  - N1: `managementRollup([derivePL(base), derivePL(base)], "t1")` → `grossSales=2000`
    (same `sourceIds:["src-1"]` counted twice, no throw). `VULN-CONFIRMED`
  - N2: rollup of `period:"2026"` + `period:"2025"` → `grossSales=2000, period="2026"`
    (cross-period mixing mislabelled as 2026). `VULN-CONFIRMED`
  - N13: `managementRollup([], "t-empty")` → plausible all-zero P&L with only `period:"UNKNOWN"`
    instead of an UNKNOWN / needs-review result. `VULN-CONFIRMED`
- Why the builder test misses it: `finance-console.test.ts:L4` tests double-count only as a
  duplicated entry in one `sourceIds` array; `L5` tests cross-*tenant* rollup rejection only.
- Required negative tests (add to `finance-console.test.ts`):
  ```ts
  expect(() => managementRollup([derivePL(base), derivePL(base)], "t1")).toThrowError(FinanceError); // same source
  expect(() => managementRollup([derivePL(base), derivePL({...base, period:"2025"})], "t1")).toThrowError(FinanceError); // period mix
  ```
  Fix direction: carry `sourceIds` (or a source-set digest) on `PLResult`, reject overlaps and
  mixed periods in `managementRollup`, return UNKNOWN semantics for empty input.

### P0-2. Approval spoofing: `filed` / `paid` / `overdue` need no approval and no evidence
- `finance-console.ts:L43-47` — `deriveObligation` guards **only** `status==="confirmed"`
  without `ownerApprovalRef` (`L46`). `filed`, `paid`, and `overdue` pass through unchanged
  (`displayStatus = o.status`, `L47`) with `ownerApprovalRef: null` **and** `evidenceRefs: []`.
- `components/finance/FinanceConsole.tsx:L5` — `ObligationRegistry` renders
  `o.displayStatus` and `o.dueDate` directly, so a poisoned record is presented to the user
  as **filed / paid** in the UI.
- `finance-console.ts:L85-86` — projection compounds it: `pubObl` emits the **raw**
  `status` alongside `displayStatus`. For a `confirmed`-without-approval record the view is
  `{status:"confirmed", displayStatus:"UNKNOWN — needs review"}` — any downstream consumer
  reading `.status` (the typed field, see P2-3) is spoofed even where the UI is not.
- Contract violated: obligation registry is *"per legal taxpayer/operator, jurisdiction,
  period, rule version, evidence and owner approval"*; Grok lane scope explicitly includes
  owner-approval spoofing.
- Reproduced (all with `evidenceRefs:[]`, `ownerApprovalRef:null`, `dueDate:"2027-01-15"`):
  - N5: `status:"filed"` → `displayStatus="filed"`, dueDate retained. `VULN-CONFIRMED`
  - N5: `status:"paid"` → `displayStatus="paid"`, dueDate retained. `VULN-CONFIRMED`
  - N5: `status:"overdue"` → `displayStatus="overdue"`, dueDate retained. `VULN-CONFIRMED`
  - N5b: `confirmed` w/o approval projects as raw `status:"confirmed"` + `displayStatus:"UNKNOWN…"`. `VULN-CONFIRMED`
- Why the builder test misses it: `finance-console.test.ts:L6` tests only the `confirmed`
  branch of the guard.
- Required negative tests:
  ```ts
  for (const st of ["filed","paid","overdue"] as const)
    expect(deriveObligation({...full, status:st, evidenceRefs:[], ownerApprovalRef:null}).displayStatus).toMatch(/UNKNOWN/);
  expect(projectFinanceView(poisoned).scenarios[0].obligations[0]).not.toHaveProperty("status", "confirmed"); // or raw status capped too
  ```
  Fix direction: any status beyond `candidate` requires non-empty `evidenceRefs` **and**
  `ownerApprovalRef`; cap the *projected raw status* as well as `displayStatus`.

---

## P1 — Must fix, or explicit GPT-6 / owner disposition

### P1-1. `legalEntity:false` forcing is a substring test — bypassed by case, id, and kind
- `finance-console.ts:L86` — projection forces `legalEntity:false` only when
  `x.id.includes("apolloa")` (case-sensitive substring). Compare the M282 pattern it claims
  to follow: `ecosystem-console-manifest.ts:L249` uses exact `p.id === "apolloa"` **plus**
  ownership-edge filtering at `L252-254` — the finance projection has no edge/kind equivalent.
- `finance-console.ts:L66` — the fixture-time guard `subj()` has the same flaw and is weaker:
  it fires only for `kind==="independent_agora"` or an id containing `apolloa`, so a `brand`
  (or any other kind) with `legalEntity:true` and **zero** formation evidence passes; and
  `subj` is private / fixture-only — any `Scenario` constructed outside `SCENARIOS` bypasses
  it entirely, and `projectFinanceView` never re-validates.
- Reproduced — N7: subjects `{id:"Apolloa-2", kind:"independent_agora", legalEntity:true}`,
  `{id:"agora-3", kind:"independent_agora", legalEntity:true}`, and
  `{id:"brand-9", kind:"brand", legalEntity:true, formationEvidenceRefs:[]}` all project
  with `legalEntity===true`. `VULN-CONFIRMED`
- Why the builder test misses it: `finance-console.test.ts:L9` poisons only `SCENARIOS[2]`,
  whose subject id is literally `apolloa-like` — the one spelling the substring catches.
- Required negative test: the N7 triple above must project `legalEntity:false` for every
  subject lacking formation evidence, regardless of id spelling/kind.
  Fix direction: force `legalEntity:false` in projection for **any** subject whose
  `formationEvidenceRefs` is empty (evidence-based, not name-based).

### P1-2. No per-tenant authorization on the route; tenancy is checked nowhere in projection
- `app/apps/finance-console/page.tsx:L7` — the page calls `requireAuth()`, checks only that
  `profile` is non-null, and renders the static `FINANCE_VIEW` containing **all three
  tenants** (`tenant-synthetic-a/b/c`). `userId` returned by `requireAuth` is discarded.
- `lib/tax-intelligence/access.ts:L29-37` — a fail-closed membership gate
  (`accessibleClients` / `clientsForUser`, env `ARTEMIS_TAX_CLIENT_MEMBERSHIPS`) already
  exists and is tested (`access.test.ts`), but **nothing in the finance route or projection
  calls it** (grep-verified: only `access.test.ts` references it). Any allowlisted user with
  a profile sees every tenant — acceptable for synthetic fixtures, a cross-tenant leak the
  moment real subjects are loaded through the same page.
- `finance-console.ts:L81-86` — `projectFinanceView` performs **no tenant consistency check
  at all**: N8 — a scenario whose `subjects[0].tenantId` and `obligations[0].tenantId` were
  rewritten to a different tenant projects without error; the mismatch is then *invisible*
  because the projection drops `tenantId` fields instead of rejecting the record.
  `VULN-CONFIRMED` (no-throw + mismatch unobservable in output)
- Contract violated: *"Cross-tenant/cross-subject data leakage rejected"* (acceptance test).
  The only tenancy rejection that exists is the rollup tenant check at `L32`.
- Required negative tests: subject/obligation/source `tenantId !== scenario.tenantId` must
  throw `FinanceError` (`CROSS_TENANT_LEAKAGE`) in `projectFinanceView`; route test that a
  user with no membership for a tenant receives no scenario for it (or, if the intended
  synthetic design is all-tenants-for-all-allowlisted, that decision must be recorded and
  the page must call `clientsForUser` before any real-data milestone).

### P1-3. `FINANCE_MANIFEST_JSON` re-publishes everything the projection strips
- `finance-console.ts:L90` —
  `FINANCE_MANIFEST_JSON = JSON.stringify({version, scenarios: SCENARIOS})` serializes the
  **raw** scenarios: `tenantId`s, `formationEvidenceRefs` (`"synthetic-formation-ref"`),
  source records with `permission`/`verification`, `taxClassification`, obligations with
  `ownerApprovalRef` fields.
- Reproduced — N10: the string contains `tenant-synthetic-a`, `formationEvidenceRefs`,
  `synthetic-formation-ref`, and `src-b1` (length 3276). `VULN-CONFIRMED`
- Today it is imported only by the test, so this is a latent leak surface, not a shipped
  payload — but it defeats the allowlist by construction: the first future caller that logs,
  returns, downloads, or client-bundles this "manifest" bypasses `projectFinanceView`
  entirely. `finance-console.test.ts:L8` enshrines the risk by asserting only
  `not.toContain("ownershipPercent")` on it — tenant internals in the manifest are blessed.
- Fix direction: build the manifest JSON **from `FINANCE_VIEW`** (projected), or delete the
  export; extend the L8 test to assert no `tenant-synthetic`, no `formationEvidenceRefs`,
  no `ownerApprovalRef` in the manifest string.

### P1-4. Obligation allowlist passes attacker-controlled refs verbatim (PII / forged approval / URI)
- `finance-console.ts:L85` — `pubObl` allowlists field *names* but copies values unchecked:
  `evidenceRefs[]`, `ownerApprovalRef`, `legalTaxpayerId`, `operatorId`, `ruleVersion`,
  `jurisdiction` all pass through by value (and `evidenceRefs` by reference — mutating the
  view mutates `SCENARIOS`).
- Reproduced — N9: `evidenceRefs:["https://evil.example/x?ssn=123-45-6789","javascript:alert(1)"]`,
  `ownerApprovalRef:"FORGED-APPROVAL-9999"`, `legalTaxpayerId:"123-45-6789"` all survive
  `JSON.stringify(projectFinanceView(...))`. `VULN-CONFIRMED`
- Note the approval model itself: `ownerApprovalRef` is an opaque caller-supplied string —
  presence is the only check (`L46`). There is no issuer, no binding to obligation id/period,
  no verification hook. Presence-of-string is not approval evidence; at minimum document it
  as a placeholder gate and never let it satisfy `filed`/`paid` (see P0-2).
- Fix direction: project obligations to a closed shape — drop or hash refs to an internal
  evidence register (as M282 does with structured `Provenance {sourcePath, commitSha,
  sourceStatus}`, `ecosystem-console-manifest.ts:L22-29`), validate ref format, copy arrays.

### P1-5. Due-date "grounding" is a non-null check; the validator is dead code in the data path
- `finance-console.ts:L49` — `validateObligation` rejects a `dueDate` only when
  `ruleVersion`/`jurisdiction`/`period` are *null*. Any non-null strings — including a
  fabricated rule version — ground an invented date.
- Worse, nothing calls it: `deriveObligation` (`L43-47`) and `projectFinanceView` (`L85`)
  never invoke `validateObligation`. The only caller is the test (`finance-console.test.ts:L6`).
- Reproduced — N6/N6b: `{jurisdiction:"XX", ruleVersion:"fabricated-v9",
  dueDate:"2027-01-15", evidenceRefs:[], ownerApprovalRef:null}` →
  `deriveObligation` returns the date with `displayStatus:"candidate"`, and
  `validateObligation` also passes. `VULN-CONFIRMED`
- Contract violated: *"Due dates UNKNOWN unless grounded in rules and facts"* /
  *"No invented tax rates, filing dates…"*.
- Fix direction: call validation inside `deriveObligation`/projection; treat a ruleVersion
  not present in a rule registry as UNKNOWN; null the dueDate whenever evidence is empty.

### P1-6. `derivePL` validation holes: NaN / Infinity / string / negative / sourceless P&Ls
- `finance-console.ts:L23` validates finiteness for only 6 of 10 numeric fields.
  `L28` passes `accruals/cash/receivables/payables` through with `?? 0` and no type check.
- Reproduced:
  - N3: `accruals:NaN, cash:Infinity, receivables:"x"` → returned verbatim in the result
    (and would poison `managementRollup` sums to `NaN`). `VULN-CONFIRMED`
  - N4: `salesTaxCollected:-500, cogs:-10000` → `salesTaxLiability:-500`,
    `grossProfit:10850` (negative COGS inflates profit; negative liability is nonsense that
    renders as a number in `FinanceConsole.tsx:L4`). `VULN-CONFIRMED`
  - N16: `period:"", sourceIds:[]` → full numeric P&L (`netSales=850`) from **no sources**,
    contradicting the UI's own "UNKNOWN — no P&L without sources"
    (`FinanceConsole.tsx:L4`) and the missing-source ⇒ UNKNOWN gate. `VULN-CONFIRMED`
  - N12 (related): `sourceIds` are unbound strings — `derivePL` never checks that a source
    exists, belongs to the same tenant/subject, or has `permission:"granted"`. A P&L can be
    built on another tenant's source id or a `not_granted` source with no error.
    `VULN-CONFIRMED`
- Fix direction: validate all 10 fields finite; reject negatives for
  `discounts/refunds/salesTaxCollected/cogs/expenses` (or explicitly model signed
  adjustments); require non-empty `period` and ≥1 source; bind sourceIds to
  `SourceCoverage` records of the same tenant/subject/permission before deriving.

---

## P2 — Harden before any real-data milestone

### P2-1. Provenance regression vs the M282 pattern (poisoning surface)
- `finance-console.ts:L72-76` — `FINANCE_TASKS[].provenance` is a flat free-form string
  (`"docs/… @ c1cb2fdf"`). M282 uses structured `Provenance {sourcePath, commitSha,
  sourceStatus}` (`ecosystem-console-manifest.ts:L22-29`) and *enforces* it — a timeline
  date without `commitSha` is stripped at `L268`. Finance has no equivalent enforcement for
  any field, and `projectFinanceView` takes no task input, so task provenance is unverifiable
  hardcode rather than derived evidence. `deriveTaskStatus` (`L77`) correctly caps
  `proposed+complete → in_review` (credit), but there is no `evidenceState` gate at all.
- `finance-console.ts:L84-86` — `pubPL`/`pubObl` return shared references (`evidenceRefs`
  array) and `tasks` are shallow spreads (`dependsOn` array shared with the module-global
  `FINANCE_TASKS`): a consumer mutating the view can poison the canonical fixtures in-process.

### P2-2. No live XSS in the current render — but projection is not a sanitizer (defense in depth)
- Verified clean: grep for `dangerouslySetInnerHTML` / `__html` / `innerHTML` over
  `components/finance/`, `components/ecosystem/`, the page, and `lib/tax-intelligence/`
  returns **nothing**; every interpolation in `FinanceConsole.tsx:L3-8` is a JSX text child,
  which React escapes. There is **no exploitable XSS in the shipped component today**.
- Latent: N11 — `label:'<img src=x onerror=alert(1)>'` and
  `title:'<script>alert(1)</script>'` survive `projectFinanceView` verbatim
  (`VULN-CONFIRMED` at projection layer). Safe only as long as every future consumer renders
  via React text and never as `href`/`src`/HTML — while P1-4 already lets a `javascript:` URI
  into the view via `evidenceRefs`. Strip/validate markup-bearing strings at projection so
  safety does not depend on each future consumer.

### P2-3. Dead redaction code and type/runtime mismatch in the projection
- `finance-console.ts:L82` — `stripPL` is defined and never used; had it been used it would
  *spread all fields* and overwrite only `tenantId` — the opposite of an allowlist. Dead
  code that documents a false sense of redaction. Delete it.
- `finance-console.ts:L80` vs `L84-85` — `FinanceView` declares `pl: PLResult | null`
  (which *requires* `tenantId`, `L17`) and `obligations: ReturnType<typeof deriveObligation>[]`
  (full `Obligation`, incl. `tenantId`), but the runtime builders return tenant-less shapes
  via `as any`. N15b reproduced: `FINANCE_VIEW.scenarios[0].pl` has no `tenantId` key while
  its type promises one. `VULN-CONFIRMED` — consumers trusting the types will read
  `undefined` tenant ids or, worse, a future "fix" that populates them re-opens the leak
  the test at `finance-console.test.ts:L9` asserts against. Define honest public types
  (`PublicPL`, `PublicObligation`) and drop the `as any` casts.

### P2-4. Source coverage never reaches the view — permission/reconciliation state is invisible
- `finance-console.ts:L80` — `FinanceView` has **no `sources` field** (N15 reproduced:
  `!("sources" in view.scenarios[0])`. `VULN-CONFIRMED`), and
  `components/finance/FinanceConsole.tsx:L3` — `SourceCoverage` renders only static prose
  listing source types. Consequences for this lane: a source with
  `permission:"not_granted"` or `reconciliationState:"exception"` cannot be surfaced, so
  the contract's "reconciliation exceptions surfaced" and the source-permission half of the
  coverage dashboard are unimplemented in the projection — and `derivePL`'s missing source
  binding (P1-6/N12) has nowhere to bind to. Project an allowlisted coverage shape
  (type/subject/period/permission/verification/completeness/reconciliation — no ids of
  external accounts) and render it.

### P2-5. Smaller derivation spoofs
- `finance-console.ts:L39` — `legalTaxConsolidation` returns `_items[0].tenantId` without
  checking the rest of the array is same-tenant (cross-tenant input is silently attributed
  to the first tenant). Status is correctly always `unknown` (credit), but validate tenancy
  like `managementRollup` does.
- `finance-console.ts:L53-61` — `assessFormApplicability` takes `hasSource`/`hasRule` as
  unverified caller booleans. N14 reproduced: `{hasSource:true, hasRule:true}` with no
  evidence object yields `candidate`. `VULN-CONFIRMED` — acceptable for synthetic scope
  (ceiling is `candidate`, never `applicable` — credit), but bind these to evidence refs
  before the workbench is used for real applicability decisions.
- `finance-console.ts:L86` — projection does not deduplicate or validate scenario ids /
  subject ids; duplicate-id scenarios render with duplicate React keys
  (`FinanceConsole.tsx:L4-5` keyed by `s.id`/`o.id`), a minor integrity/UX poisoning vector.

---

## Credits — what held under attack (keep)

1. **Auth fail-closed (route):** `app/apps/finance-console/page.tsx:L7` matches the M282
   pattern exactly — `requireAuth()` (`lib/auth/require-auth.ts:L25-31`) redirects when
   there is no user, a missing allowlist, or an unlisted email (with sign-out), and a null
   profile renders a shell with **no data**. `dynamic="force-dynamic"` + `noIndex:true`
   metadata are set. No unauthenticated path to `FINANCE_VIEW` was found.
2. **Sales tax treatment:** `derivePL` (`L24-28`) excludes `salesTaxCollected` from
   `netSales`/`grossProfit` and mirrors it as `salesTaxLiability`; the builder test's
   `netSales !== 918` assertion is the right tripwire and held in every probe.
3. **Apolloa in the shipped view:** the *shipped* `FINANCE_VIEW` correctly shows the agora
   subject `legalEntity:false` and its obligation operator `null` → `UNKNOWN`; no
   `ownershipPercent` or ownership inference anywhere in the finance files (legacy page's
   hard-coded percentages at `app/apps/tax-intelligence/page.tsx:L15-19` are **not**
   imported — quarantine holds).
4. **No leaked real identifiers** in any reviewed finance file (synthetic ids only).
5. **Task-status cap:** `proposed` can never project as `complete` (`L77`), mirroring M282.
6. Preview gate from the packet stands and is unchanged by this build: Vercel
   `ssoProtection`/`passwordProtection` are **DISABLED** — the app-level allowlist above is
   currently the *only* gate on any preview URL. Owner action, not a builder defect;
   recorded here so GPT-6 does not read "auth verified" as "preview protected".

## Reproduction

All N-probes were executed 2026-10-27 against the unmodified module
(`node /tmp/grok-neg/repro.mjs`, Node v24 TS import of
`lib/tax-intelligence/finance-console.ts`): 22/22 `VULN-CONFIRMED` with the observed values
quoted inline above. Each P0/P1 lists the vitest negative test that must be added to
`finance-console.test.ts` so the property is enforced in CI
(`.github/workflows/tax-intelligence-m284.yml`), not just in this review.

## Disposition requested

- **GPT-6:** adjudicate P0-1 / P0-2 as acceptance blockers; P1-2 needs an explicit recorded
  decision (per-tenant filtering now vs. synthetic-only waiver with a hard gate before real data).
- **Owner:** no action on production/Vercel config is requested by this lane; the disabled
  preview-protection gate (Credit 6) remains an owner decision.
- **Builder (Claude):** fixes only on the isolated M2.8.4 branch, synthetic fixtures only,
  with the negative tests above added *failing-first* against the current code.
