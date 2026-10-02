export const utilityDualStoryPaths = [
  {
    label: "Story 1 · Operational proof",
    title: "Field completion -> actual cost -> claim/payment lag -> executive action",
    summary:
      "The contractor operating story: model geometry becomes field reports, actual cost records, earned value, claims, approvals, retainage, payment lag, and action gates.",
    href: "#field-claims-story",
    action: "Open Field Claims Story",
    tone: "gold",
  },
  {
    label: "Story 2 · Cockpit classic",
    title: "One parametric model. Six disciplines. One source of truth.",
    summary:
      "The restored Cockpit Classic story: Section & Spine visual identity, discipline dialects, live engine preview, synthesis pipeline, and launch bay language.",
    href: "#cockpit-classic-story",
    action: "Open Cockpit Story",
    tone: "signal",
  },
] as const;

export const utilityDualStoryProgression = [
  {
    version: "RC8.3",
    label: "Field Claims Hardened",
    description:
      "Made the field-to-cash loop explicit: actuals, cost records, claims, approvals, retainage, payment lag, cash exposure, and executive action.",
  },
  {
    version: "RC8.4",
    label: "Dual Story Cockpit",
    description:
      "Adds a startup selector so the audience can choose between operational proof and the polished Cockpit Classic narrative.",
  },
  {
    version: "Public route",
    label: "Sanitized website layer",
    description:
      "Publishes the narrative structure and synthetic workbench behavior without raw HTML, exact coordinates, private formulas, or source records.",
  },
] as const;

export const utilityClassicTiles = [
  {
    label: "01 · The Spine",
    title: "Visual identity from the trench",
    description:
      "Sub-grade section, datum, station chainage, gravity profile, bedding, pipe, backfill, and brass survey accents create a subject-specific story instead of a generic dashboard.",
  },
  {
    label: "02 · Live Engine",
    title: "Numbers are not decorative",
    description:
      "The cockpit reads the active estimate logic: cost basis, revenue/SOV, duration, labor hours, L/M/C/S/E split, top cost codes, and risk envelope.",
  },
  {
    label: "03 · Six Dialects",
    title: "One truth, six professional readings",
    description:
      "BIM, QTO, project controls, field, commercial/claims, standards/QA, and executives receive the same source model in their working language.",
  },
  {
    label: "04 · Launch Bay",
    title: "Story becomes operation",
    description:
      "Narrative buttons launch model, schedule/cashflow, actuals/claims, standards lens, control room, and capture-ready executive views.",
  },
] as const;

export const utilitySynthesisPipeline = [
  {
    step: "01",
    label: "Source model",
    description: "A generic utility corridor object anchors geometry, quantities, activities, and record custody.",
  },
  {
    step: "02",
    label: "Edge cases",
    description: "Stress-test quantities, cost codes, scenarios, payment timing, and public-safe boundaries.",
  },
  {
    step: "03",
    label: "Spatial design",
    description: "Refine 3D/4D/GIS language without publishing raw coordinates, map dependencies, or private source context.",
  },
  {
    step: "04",
    label: "Field realism",
    description: "Pressure-check productivity, crew logic, actuals, claims, approval status, and payment lag.",
  },
  {
    step: "05",
    label: "QA hardening",
    description: "Verify route hooks, scenario buttons, sample exports, disclaimers, and no-regression checks.",
  },
] as const;

export const utilityDualStoryLaunch = [
  {
    title: "Synthetic cockpit",
    href: "#live-cockpit",
    description: "Run scenario, ground, and water-table choices against synthetic cost and schedule signals.",
  },
  {
    title: "Actuals & Claims",
    href: "#live-cockpit",
    description: "Load the payment-lag posture and trace field completion through claims, approval, and cash receipt.",
  },
  {
    title: "Control room",
    href: "#executive-control-room",
    description: "Read current condition, consequence, action owner, and forecast confidence from one source chain.",
  },
  {
    title: "Program catalog",
    href: "/library/programs#utility-bridge-dual-story-cockpit",
    description: "Review the source-to-public migration rule and the no-raw-HTML publication boundary.",
  },
] as const;

export const utilityDualStoryBoundaryChecks = [
  "Raw RC8.4 HTML is not embedded, iframe-wrapped, copied, or shipped.",
  "Exact source coordinates, agency/project identifiers, and private GIS context are excluded.",
  "All visible metrics are deterministic representative indices, not payment certification.",
  "No live ERP, schedule, BIM, GIS, accounting, or document-control write-back is claimed.",
] as const;
