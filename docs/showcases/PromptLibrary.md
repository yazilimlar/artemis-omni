# Prompt Library

> **Internal working document.** Reusable macro and micro prompts for future Artemis work
> (showcases, demos, graphics, migration). These are **planning prompts** — running them is a
> separate, approved task. Every prompt inherits the global guardrails below.

## Global guardrails (apply to every prompt)

- Lead with **5D Construction Intelligence / Project Intelligence Command Center**;
  Artemis / Artemis Omni is the umbrella; Artemis Flow is module-level only.
- Use the comparison framing: **Bid Estimate vs Actuals vs PM Forecast vs System-Generated
  Projections**; "Connect the field to the forecast to the cash."
- **Accuracy framing:** audit-grade logic, formula traceability, source-labeled assumptions,
  transparent confidence levels, what-it-is / what-it-is-not. **Never** promise "100% accuracy."
- **Banned language:** no "atelier", "AI Decision Mesh", "ancient intelligence, modern
  automation", mystical/robotics framing, or generic "AI platform" with no project-controls
  meaning.
- **Every system graphic** answers the six questions (decision improved / data connected /
  logic applied / human review / trusted output / remaining assumption — see
  `SystemGraphicsStrategy.md`).
- **Sanitize** any client/agency/project specifics before public use (see `ExecutiveDemoLibrary.md`).
- Do not deploy, push, wire backends, or create routes unless the task explicitly approves it.

---

## Macro prompts

### 1. Executive showcase page
> Build an executive-grade showcase page for **[asset]** that proves the 5D construction
> intelligence story. Lead with the decision it improves and the field-to-cash chain. Use
> SVG/CSS, accessible DOM text, the approved palette, and the six-question rule. Include a
> what-it-is / what-it-is-not panel and confidence levels. No banned language; no fabricated
> metrics.

### 2. Private demo script
> Write a 5–8 minute private demo script for **[asset]** aimed at [audience: e.g. infra
> owner / PMCM / estimator]. Structure: current-state pain → the connected Artemis view →
> Bid vs Actuals vs PM Forecast vs System Projection → risk/opportunity → executive action.
> Flag every spot where real client data must stay private.

### 3. Public-safe sanitized case study
> Convert **[asset]** into a public-safe case study. Strip client/agency/project identifiers
> and real figures; replace with representative, clearly-labeled illustrative data. Keep the
> logic and the outcome. Add a "representative/illustrative" callout and a what-it-is /
> what-it-is-not section.

### 4. System architecture graphic
> Produce an SVG system-architecture graphic for **[system]** satisfying the six-question
> rule. Show systems of record, data flow, the logic/formula layer, human-review marks, and
> a confidence/assumption legend. Approved palette only.

### 5. Market comparison matrix
> Build a market comparison matrix positioning Artemis (5D construction intelligence) vs
> [generic BI / point tools / manual Excel]. Columns = capabilities (field→finance link,
> Bid/Actual/Forecast/Projection, auditability, training/adoption, governance). Honest,
> defensible, no disparagement; cite what Artemis is and is not.

### 6. Staff training module
> Draft a staff training module for **[workflow]** that trains the *process, not just the
> tool* (per `ArtemisTransitionMethod.md` Phase 3). Include review points, exception
> handling, owner roles, and operating cadence.

### 7. AI implementation roadmap
> Produce an implementation roadmap graphic + narrative using the Phase 0–6 transition
> framework for **[company/department]**. Each phase: entry criteria, owners, exit criteria.

### 8. Demo migration plan
> Write a migration plan to bring **[HTML demo]** into the Next.js app: route, page type,
> data-sanitization steps, component reuse from the App Shell, accessibility, performance,
> and a public/private decision. No code in this step — plan only.

### 9. React component extraction plan
> Analyze **[App Shell Template / demo]** and propose a React component extraction into
> `components/` (shell, nav, KPI row, panels, charts) consistent with the existing system.
> List components, props, and shared tokens. No new routes.

### 10. Accuracy / assumption / confidence review
> Audit **[demo/output]** for accuracy framing: list every computed value with its formula
> and source, label actual/forecast/assumption/projection, assign confidence levels, and
> write the what-it-is / what-it-is-not statement. Flag anything implying guaranteed accuracy.

---

## Micro prompts (asset-specific)

> Each inherits the global guardrails. "Sanitize" = strip client/agency/project specifics.

- **Forecast Exposure Control Center** (from *ESCR Forecast Matrix & Exposure Range
  Dashboard*): design a public-safe exposure/range control center showing cost exposure with
  confidence bands and Bid/Actual/Forecast/Projection comparison. Sanitize "ESCR".
- **Model-to-Money Inspector** (from *Reach K 5D Master Model / Jet Grout Column Inspector*):
  spec a private inspector linking model geometry/quantities to cost and cashflow; label
  geotechnical QA confidence. Keep "Reach K" private.
- **Geometry QA + Plan Editing Sandbox** (from *Reach K Jet Grout QA Interactive Plan
  Editor*): spec an interactive geometry-QA/plan-edit sandbox; define human-review gates for
  edits; private-only until sanitized.
- **DEP Sewer 3D/4D/5D Workbench** (from *DEP Sewer Construction Intelligence Workbench*):
  private infrastructure-owner demo script + sanitization checklist (agency/program data).
- **Artemis Construction Intelligence Workbench — LinkedIn RC2**: prepare as the **first
  public Labs showcase**; verify no confidential data, optimize, plan React migration of layout.
- **Artemis App Shell Templates v0.1–v0.3**: component-extraction plan (macro #9) using v0.3
  as the base and v0.1/v0.2 as lineage references.
- **System Graphics Exemplary (ZIP)**: curate into a reusable, six-question-compliant figure
  set for Academy/Labs; flag any that are reference-only.
- **3D / render inspiration (ZIPs)**: treat as moodboard; extract palette/motif cues only —
  no direct shipping.
- **Market Options and Comparison Matrix**: run macro #5 to produce the first Artemis
  positioning matrix.
- **First Public Artemis Labs Index**: plan a Labs index that lists sanitized, public-safe
  demos (starting with the Construction Intelligence Workbench) — plan only, no route yet.

## Cross-references

- `docs/showcases/ExecutiveDemoLibrary.md` — asset inventory + classifications.
- `docs/showcases/SystemGraphicsStrategy.md` — the six-question rule + visual conventions.
- `docs/ArtemisImplementationDoctrine.md` / `docs/ArtemisTransitionMethod.md` — substance.
