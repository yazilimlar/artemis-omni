# Artemis Transition Method

> **Internal strategy document.** Defines how Artemis moves a company from its current state
> (Excel / email / manual workflows) to AI-enabled operations — without losing control,
> transparency, semantics, or accountability. This is the operational expression of the
> `ArtemisImplementationDoctrine.md` ("AI does not replace fundamentals; AI amplifies
> disciplined fundamentals"). It changes no public copy.

## Overview

Transformation is a **phased, auditable** progression, not a switch. Each phase has entry
criteria, owners, and exit criteria. The company keeps control at every step; automation is
earned only after the semantics and review points are defined.

```
Phase 0  Diagnostic        → understand the real current state
Phase 1  Semantic Modeling → define terms, sources, formulas, confidence
Phase 2  Prototype         → controlled demo on sanitized data
Phase 3  Staff Training    → train the process, not just the tool
Phase 4  Implementation    → connect, automate, govern
Phase 5  Optimization      → measure ROI, refine, scale
Phase 6  Operating System  → repeatable business/project operating layer
```

## Phase 0 — Diagnostic

Understand the real current state before proposing anything.

- Identify current systems (ERP/CMiC, P6, Excel, email, accounting, file shares).
- Map workflows end to end (who does what, when, with which data).
- Identify bottlenecks (where time, rework, and disputes accumulate).
- Identify manual / Excel / email breakpoints (where data is re-keyed or lost).
- Identify data owners (who is accountable for each field/system of record).
- Identify decision cycles (daily / weekly / monthly cadences and who decides).
- Identify staff readiness (skills, capacity, and appetite for change).

**Exit:** a documented current-state map with named bottlenecks and owners.

## Phase 1 — Semantic Modeling

Make meaning explicit before automating it. **The devil is in the details.**

- Define terms (shared glossary; no ambiguous words in the model).
- Define system-of-record boundaries (which system owns which truth).
- Define source fields (where each value originates).
- Define formulas (every computed value's math, traceable).
- Define confidence levels (how trusted each input/output is).
- Define **what is actual, forecast, assumption, and projection** — and label each.

**Exit:** a semantic model where every value has a source, a formula, a label, and a
confidence level.

## Phase 2 — Prototype

Prove the logic on safe data before touching production systems.

- Create a controlled demo.
- Use sample / sanitized data only.
- Validate the logic against known answers.
- Compare against the current workflow (side by side).
- Identify savings and risk reduction (quantified).

**Exit:** a validated prototype with a measured comparison to the status quo.

## Phase 3 — Staff Training

Adoption is accuracy. Train the **process**, then the tool.

- Train staff on the process, not just the tool.
- Define human review points (who checks what, when).
- Define exception handling (what happens when the data is wrong/missing).
- Define owner roles (accountable owner per workflow).
- Define daily / weekly / monthly operating cadence.

**Exit:** trained owners, defined review points, and a documented operating cadence.

## Phase 4 — Implementation

Connect and automate the repeatable — gate the consequential.

- Connect systems (read-level first; controlled writes later).
- Automate repetitive workflows.
- Create dashboards (decision-oriented, not vanity metrics).
- Create audit trails (every output reconstructable from inputs).
- Document assumptions (source-labeled, dated, owned).
- Establish governance (change control, access, review).

**Exit:** live, governed, audit-trailed workflows with human review at consequential points.

## Phase 5 — Optimization

Make it better and broader, with evidence.

- Measure ROI (against the Phase 2 baseline).
- Reduce friction (remove steps, not just automate them).
- Improve forecasting (tighten methods and inputs).
- Refine model accuracy (via verified inputs and review feedback).
- Scale to more departments / modules.

**Exit:** measured ROI and a scaling plan to the next department/module.

## Phase 6 — Operating System

Convert the system into a repeatable operating layer.

- Turn the implementation into a repeatable business / project operating layer.
- Connect finance, operations, documents, customer workflows, reporting, and executive
  decisions into one governed system.

**Exit:** Artemis operates as the company's project/business operating system — the
construction beachhead (Artemis Construct / 5D) extended toward the broader Business OS
roadmap (`docs/ProductRoadmap.md`), still introduced only as credibility compounds.

## Cross-references

- Philosophy: `docs/ArtemisImplementationDoctrine.md`
- Demo assets that support each phase: `docs/showcases/ExecutiveDemoLibrary.md`
- Visual language for the diagrams: `docs/showcases/SystemGraphicsStrategy.md`
- Roadmap/sequencing: `docs/ProductRoadmap.md`
