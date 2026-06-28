/**
 * Departments Artemis serves — used by /departments to show where AI
 * implementation maps onto real org functions. Plain data; no claims of full
 * autonomy, all outputs human-reviewed and audit-aware.
 */
export type Department = {
  slug: string;
  name: string;
  summary: string;
  painPoints: string[];
  artemisRole: string;
};

export const departments: Department[] = [
  {
    slug: "estimating",
    name: "Estimating",
    summary: "Keep the winning bid alive against actuals and forecasts.",
    painPoints: ["Bids drift from reality", "Manual takeoff re-keying", "No bid-to-actual loop"],
    artemisRole: "Document intelligence + 5D linkage of bid → quantities → actuals.",
  },
  {
    slug: "project-controls",
    name: "Project Controls",
    summary: "Integrate cost and schedule into a defensible forecast.",
    painPoints: ["Cost/schedule live in separate tools", "Late EAC visibility", "Disputes over numbers"],
    artemisRole: "5D forecasting: Bid vs Actuals vs PM Forecast vs system projections.",
  },
  {
    slug: "finance",
    name: "Finance & Accounting",
    summary: "Turn ledger and billing data into live cashflow intelligence.",
    painPoints: ["Cashflow computed too late", "Manual reconciliation", "Limited runway visibility"],
    artemisRole: "Cashflow forecasting and variance analytics (Artemis Flow, module-level).",
  },
  {
    slug: "operations",
    name: "Operations",
    summary: "Connect field production to the office without re-keying.",
    painPoints: ["Field data trapped in email/Excel", "Slow status rollups", "Unclear ownership"],
    artemisRole: "Controlled integrations + operating dashboards with audit trails.",
  },
  {
    slug: "engineering",
    name: "Engineering & Design",
    summary: "Ground decisions in the model of record.",
    painPoints: ["Quantities disconnected from cost", "Constructability found late", "Model not trusted"],
    artemisRole: "2D→3D→4D→5D visualization and model-to-money linkage.",
  },
  {
    slug: "executive",
    name: "Executive",
    summary: "Decide with confidence levels and audit-ready controls.",
    painPoints: ["Reports arrive after the decision", "Numbers not traceable", "Risk surfaced too late"],
    artemisRole: "Executive decision loops, risk/opportunity maps, source-labeled assumptions.",
  },
];
