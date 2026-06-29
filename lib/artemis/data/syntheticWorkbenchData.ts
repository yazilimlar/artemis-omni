/**
 * Synthetic data for the public Construction Intelligence Workbench showcase
 * (/labs/construction-intelligence-workbench).
 *
 * Fully synthetic. No real project, owner, contractor, employer, or client data; no real
 * agency/program identifiers, stationing, quantities, dates, or financial values.
 * Zero lines copied from any private workbench source.
 * All names are generic placeholders (Project Alpha, Owner Agency, Cost Code C-1001…).
 */

export const syntheticProject = {
  name: "Project Alpha",
  program: "Infrastructure Program A",
  owner: "Owner Agency",
  primeContractor: "Prime Contractor",
  tradePartner: "Trade Partner",
  programManager: "Program Manager",
  packages: ["Package A", "Package B"],
  phase: "Construction",
  asOf: "Forecast Period 04",
  contractType: "ERP-style cost workflow (CMiC-style project-controls pattern)",
};

export type Kpi = {
  label: string;
  value: string;
  caption: string;
  tone: "neutral" | "good" | "watch";
};

export const kpis: Kpi[] = [
  { label: "CPI", value: "0.98", caption: "Cost performance index", tone: "watch" },
  { label: "SPI", value: "1.02", caption: "Schedule performance index", tone: "good" },
  { label: "EAC", value: "$26.4M", caption: "Estimate at completion (synthetic)", tone: "neutral" },
  { label: "Cash position", value: "+$1.2M", caption: "Forecast Period 04 (synthetic)", tone: "good" },
  { label: "Open changes", value: "7", caption: "Change / exposure register", tone: "watch" },
  { label: "Confidence", value: "Moderate", caption: "Stated per output", tone: "neutral" },
];

/** Cumulative cost ($M, synthetic) across four comparison views. */
export type ForecastPoint = {
  period: string;
  bid: number;
  actual: number | null;
  pmForecast: number | null;
  systemProjection: number | null;
};

export const forecastSeries: ForecastPoint[] = [
  { period: "FP 01", bid: 3.2, actual: 3.4, pmForecast: 3.4, systemProjection: 3.5 },
  { period: "FP 02", bid: 7.1, actual: 7.6, pmForecast: 7.7, systemProjection: 7.9 },
  { period: "FP 03", bid: 12.0, actual: 12.9, pmForecast: 13.1, systemProjection: 13.4 },
  { period: "FP 04", bid: 16.5, actual: 17.8, pmForecast: 18.0, systemProjection: 18.5 },
  { period: "FP 05", bid: 21.0, actual: null, pmForecast: 22.6, systemProjection: 23.2 },
  { period: "FP 06", bid: 25.0, actual: null, pmForecast: 26.2, systemProjection: 26.9 },
];

export const forecastLegend = [
  { key: "bid", label: "Bid Estimate", color: "hsl(210 18% 78%)" },
  { key: "actual", label: "Actuals", color: "hsl(42 38% 92%)" },
  { key: "pmForecast", label: "PM Forecast", color: "hsl(41 64% 56%)" },
  { key: "systemProjection", label: "System Projection", color: "hsl(195 70% 55%)" },
] as const;

export type RegisterEntry = {
  id: string;
  type: "Risk" | "Opportunity";
  title: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  response: string;
  owner: string;
};

export const riskOpportunities: RegisterEntry[] = [
  {
    id: "R-001",
    type: "Risk",
    title: "Package A productivity below plan",
    likelihood: "Medium",
    impact: "High",
    response: "Mitigate — resequence crews; weekly production review.",
    owner: "Program Manager",
  },
  {
    id: "R-002",
    type: "Risk",
    title: "Material escalation on Package B",
    likelihood: "Medium",
    impact: "Medium",
    response: "Transfer — index-based adjustment clause.",
    owner: "Prime Contractor",
  },
  {
    id: "O-001",
    type: "Opportunity",
    title: "Early access enables parallel work",
    likelihood: "Medium",
    impact: "Medium",
    response: "Exploit — pull-plan to bank float.",
    owner: "Program Manager",
  },
  {
    id: "O-002",
    type: "Opportunity",
    title: "Reuse of Package A submittals",
    likelihood: "High",
    impact: "Low",
    response: "Enhance — standardize submittal templates.",
    owner: "Trade Partner",
  },
];

export type ChangeEntry = {
  id: string;
  costCode: string;
  description: string;
  status: "Pending" | "Approved" | "In review";
  exposure: string;
};

export const changeRegister: ChangeEntry[] = [
  { id: "CO-01", costCode: "C-1001", description: "Scope adjustment — Package A", status: "Approved", exposure: "$0.4M" },
  { id: "CO-02", costCode: "C-2001", description: "Differing condition — Package A", status: "In review", exposure: "$0.6M" },
  { id: "CO-03", costCode: "C-2001", description: "Owner-directed addition — Package B", status: "Pending", exposure: "$0.3M" },
  { id: "CO-04", costCode: "C-3001", description: "Acceleration request — Package B", status: "Pending", exposure: "$0.5M" },
];

/** Field-to-finance audit chain: source → logic → human review → trusted output. */
export type AuditStep = {
  stage: string;
  source: string;
  logic: string;
  review: string;
};

export const auditPath: AuditStep[] = [
  { stage: "Quantities", source: "Model / takeoff (synthetic)", logic: "Geometry → quantities", review: "QA spot-check" },
  { stage: "Schedule", source: "Synthetic schedule", logic: "Sequencing & progress", review: "Weekly status" },
  { stage: "Actual cost", source: "ERP-style cost workflow", logic: "Cost code rollup", review: "Accounting sign-off" },
  { stage: "Forecast", source: "Bid + Actuals + production", logic: "Bid vs Actuals vs PM vs System", review: "Controls + PM" },
  { stage: "Executive action", source: "Forecast + risk register", logic: "Variance + exposure", review: "Executive decision" },
];

export type Assumption = {
  id: string;
  statement: string;
  source: string;
  confidence: "Low" | "Moderate" | "High";
};

export const assumptions: Assumption[] = [
  { id: "A-01", statement: "Production rates hold at Forecast Period 04 trend.", source: "Synthetic production log", confidence: "Moderate" },
  { id: "A-02", statement: "No additional owner-directed scope beyond logged changes.", source: "Change register", confidence: "Moderate" },
  { id: "A-03", statement: "Material indices follow the assumed escalation curve.", source: "Synthetic index", confidence: "Low" },
];

/** What-it-is / what-it-is-not framing for the showcase. */
export const framing = {
  isA: "A synthetic demonstration of Artemis construction-intelligence patterns — KPI tracking, a four-way forecast comparison, risk/opportunity, change exposure, and an audit-aware data path.",
  isNot: "Synthetic and illustrative only. It is not connected to any ERP, CMiC, or other live system, and the figures do not represent any actual project, owner, or contractor.",
  isList: [
    "A four-way forecast comparison (Bid vs Actuals vs PM Forecast vs System Projection)",
    "An audit-aware data path with source-labeled assumptions and confidence",
    "A reusable executive workbench pattern on synthetic Project Alpha data",
  ],
  isNotList: [
    "Real project, owner, contractor, employer, or client data",
    "Connected to any CMiC, ERP, or other live system",
    "A guarantee of accuracy — figures are illustrative",
  ],
};

/** Executive thesis + the decision the workbench improves. */
export const thesis = {
  statement:
    "A forecast is only useful if it is trustworthy. This workbench shows cost and cash exposure as four comparable views, each traceable to its source — so the number in the boardroom matches the number in the field.",
  decisionImproved:
    "Where is cost and cash exposure building, how confident are we, and what is the next action — contingency, resequencing, or escalation?",
};

/** Formula traceability — every computed value exposes its inputs and sources. */
export type FormulaRow = {
  output: string;
  formula: string;
  inputs: string;
  source: string;
};

export const formulaTrace: FormulaRow[] = [
  {
    output: "CPI (cost performance index)",
    formula: "earned value ÷ actual cost",
    inputs: "earned value, actual cost",
    source: "ERP-style cost workflow (synthetic)",
  },
  {
    output: "SPI (schedule performance index)",
    formula: "earned value ÷ planned value",
    inputs: "earned value, planned value",
    source: "synthetic schedule",
  },
  {
    output: "System Projection (cost at completion)",
    formula: "actuals + (remaining work ÷ CPI), trend-adjusted",
    inputs: "actuals, remaining work, CPI, production trend",
    source: "actuals + production trend (synthetic)",
  },
  {
    output: "Cash exposure",
    formula: "System Projection − Bid Estimate, net of retention/terms",
    inputs: "system projection, bid estimate, payment terms",
    source: "forecast + contract terms (synthetic)",
  },
];

/** Plain-language reading of the synthetic risk/opportunity picture. */
export const riskInterpretation =
  "At Forecast Period 04, actuals run modestly above bid (CPI ≈ 0.98) while schedule is slightly ahead (SPI ≈ 1.02). The system projection sits above the PM forecast, signaling cost/cash exposure concentrated in Package A productivity (R-001). The early-access opportunity (O-001) is the most credible offset. Recommended next action: hold contingency against R-001 and pull-plan O-001 before committing it to the forecast.";
