export type UtilityScenarioModeId =
  | "plan-only"
  | "good-performance"
  | "cost-overrun"
  | "schedule-delay"
  | "payment-lag"
  | "recovery";

export type UtilityGroundId = "soil" | "rock";
export type UtilityWaterId = "dry" | "wet";

export type UtilityScenarioMode = {
  id: UtilityScenarioModeId;
  label: string;
  shortLabel: string;
  summary: string;
  operatingTruth: string;
  executiveAction: string;
};

type ScenarioFactors = {
  costIndex: number;
  revenueIndex: number;
  durationDays: number;
  laborHours: number;
  cpi: number | null;
  spi: number | null;
  completedQuantityPct: number;
  claimedQuantityPct: number;
  approvedQuantityPct: number;
  cashReceivedPct: number;
  paymentLagDays: number;
  retainagePct: number;
  p50Exposure: number;
  p80Exposure: number;
};

export type UtilityScenarioSnapshot = ScenarioFactors & {
  mode: UtilityScenarioMode;
  ground: UtilityGroundMode;
  water: UtilityWaterMode;
  bottleneck: string;
  confidence: string;
  actionOwner: string;
  forecastNote: string;
  composition: { label: string; value: number }[];
  topCostCodes: { code: string; label: string; value: number }[];
  reconciliationChecks: { label: string; status: "pass" | "watch" | "hold"; detail: string }[];
};

export type UtilityGroundMode = {
  id: UtilityGroundId;
  label: string;
  summary: string;
  costDelta: number;
  durationDelta: number;
  laborDelta: number;
};

export type UtilityWaterMode = {
  id: UtilityWaterId;
  label: string;
  summary: string;
  costDelta: number;
  durationDelta: number;
  laborDelta: number;
};

export const utilityBridgeMetricStrip = [
  {
    label: "Model corridor",
    value: "Synthetic utility corridor",
    detail: "Stationed pipe, trench, structures, restoration, and access zones.",
  },
  {
    label: "Bid / SOV basis",
    value: "Index 100",
    detail: "Representative value index only; not payment certification.",
  },
  {
    label: "Construction duration",
    value: "410-day baseline",
    detail: "Demo sequence for work-package review and executive action.",
  },
  {
    label: "Control data mode",
    value: "Browser-local",
    detail: "Deterministic sample records, no external systems or API keys.",
  },
  {
    label: "Public/private gate",
    value: "Sanitized rebuild",
    detail: "No raw HTML, GIS coordinates, agency labels, or private records.",
  },
] as const;

export const utilitySourceDisciplines = [
  {
    label: "BIM / 3D",
    detail: "Geometry, stationing, trench, pipe, structures, and selectable work objects.",
  },
  {
    label: "QTO",
    detail: "LF, CY, SY, tons, structures, restoration, bedding, concrete, and support.",
  },
  {
    label: "Cost codes",
    detail: "Labor, material, equipment, subcontract, indirect, and review-coded budgets.",
  },
  {
    label: "EVM / forecast",
    detail: "PV, EV, AC, CPI, SPI, EAC, variance, and forecast-method confidence.",
  },
  {
    label: "Field actuals",
    detail: "Daily quantities, crew hours, equipment, weather, inspections, and notes.",
  },
  {
    label: "Executive / standards",
    detail: "Assumption basis, reconciliation, cashflow signal, risk, and action register.",
  },
] as const;

export const utilityLifecycle = [
  "Model",
  "Quantity",
  "Cost code",
  "Schedule",
  "Actuals",
  "Earned value",
  "Claim",
  "Payment",
  "Cash",
  "Action",
] as const;

export const utilityVersionProgression = [
  {
    version: "App shell v0.1",
    label: "Foundation",
    capability: "Reusable Artemis navigation, proof cards, and executive page language.",
    extension: "Established public-safe presentation discipline before deeper workbench exposure.",
  },
  {
    version: "Construction workbench",
    label: "Synthetic live pattern",
    capability: "KPI panels, forecast comparison, risk register, controls matrix, and audit notes.",
    extension: "Proved the public route could show project controls without raw private records.",
  },
  {
    version: "Utility bridge narrative",
    label: "Model-to-money story",
    capability: "Utility work-package chain from geometry and quantities to commercial exposure.",
    extension: "Separated public narrative from private GIS, HTML, and agency-specific logic.",
  },
  {
    version: "RC8.3 field claims hardening",
    label: "Extended contractor demo",
    capability: "Actuals, claims, retainage, payment lag, cash timing, and executive action.",
    extension: "Turns the utility demo into a field-to-cash command workbench for contractors.",
  },
] as const;

export const utilityCapabilityMatrix = [
  {
    discipline: "Estimating",
    question: "Did the quantity or production basis move?",
    output: "Cost-code concentration, unit-rate pressure, and bid-to-forecast movement.",
  },
  {
    discipline: "Field operations",
    question: "What is the governing constraint?",
    output: "Access, crew, equipment, inspection, weather, rework, or sequence owner.",
  },
  {
    discipline: "Project controls",
    question: "Is the schedule and earned-value story current?",
    output: "PV / EV / AC relationship, CPI/SPI signal, EAC trend, and freshness warning.",
  },
  {
    discipline: "Contract administration",
    question: "Does claimed work reconcile to accepted field quantity?",
    output: "Claim quantity, approved quantity, retainage, payment status, and support gap.",
  },
  {
    discipline: "Finance",
    question: "Is the project earning value but waiting on cash?",
    output: "Approval lag, payment lag, net-due signal, retainage exposure, and cash action.",
  },
  {
    discipline: "Executive leadership",
    question: "What changed and who owns the next move?",
    output: "Operating condition, consequence, confidence, owner, deadline, and action register.",
  },
] as const;

export const utilityRoleTranslations = [
  {
    role: "Superintendent",
    dialect: "Production, blockers, crews, weather, access, and inspections.",
    translation: "What field condition is driving the forecast and claim posture?",
  },
  {
    role: "Estimator",
    dialect: "LF, CY, structures, unit rates, labor hours, and productivity factors.",
    translation: "Which quantity or production assumption changed the cost basis?",
  },
  {
    role: "Project manager",
    dialect: "Schedule movement, change exposure, owner decisions, and action owners.",
    translation: "Which issue needs intervention before it becomes a permanent variance?",
  },
  {
    role: "Contract administrator",
    dialect: "Pay items, claimed quantity, approved quantity, retainage, and backup.",
    translation: "Which claim line lacks the field support or approval state needed for cash?",
  },
  {
    role: "CFO / executive",
    dialect: "Earned value, approved work, payment lag, net due, and cash timing.",
    translation: "Is the project operationally healthy but commercially starved for cash?",
  },
] as const;

export const utilityLaunchActions = [
  {
    href: "#source-feed",
    label: "Explore the model feed",
    detail: "See one source object translated into operating disciplines.",
  },
  {
    href: "#cockpit",
    label: "Run sample actuals",
    detail: "Switch field performance, cost, schedule, and payment modes.",
  },
  {
    href: "#actuals-claims",
    label: "Run claim/payment lag",
    detail: "Trace field quantity through claim approval and cash receipt.",
  },
  {
    href: "#executive-control-room",
    label: "Open control room",
    detail: "Review current condition, consequence, owner, and next action.",
  },
] as const;

export const utilitySourceSchemas = [
  {
    title: "Field completion reports",
    fields: [
      "report id",
      "report date",
      "work day / shift",
      "weather",
      "crew / foreman",
      "activity code",
      "segment / station range",
      "completed quantity / unit",
      "rework percent",
      "inspection status",
      "inspector note",
      "source",
    ],
  },
  {
    title: "Actual cost records",
    fields: [
      "cost record id",
      "cost date",
      "activity code",
      "segment",
      "cost category",
      "quantity / unit",
      "hours / rate",
      "amount index",
      "vendor or crew",
      "source document",
      "source",
    ],
  },
  {
    title: "Claim / payment records",
    fields: [
      "claim id",
      "period start / end",
      "claim date",
      "pay item",
      "activity code",
      "claimed quantity",
      "approved quantity",
      "billing unit rate index",
      "retainage",
      "net-due signal",
      "payment status / date",
      "owner note",
      "source",
    ],
  },
] as const;

export const utilityQaChecks = [
  {
    label: "Raw-source boundary",
    status: "Pass",
    detail: "The public route is rebuilt from sanitized narrative and TypeScript data only.",
  },
  {
    label: "Sample-data posture",
    status: "Pass",
    detail: "All records are deterministic, representative, source-tagged samples.",
  },
  {
    label: "System-of-record gate",
    status: "Pass",
    detail: "The page describes approved interfaces and review gates, not silent write-back.",
  },
  {
    label: "Contract limitation",
    status: "Pass",
    detail: "Visible copy says this is not payment certification, agency approval, or legal advice.",
  },
] as const;

export const utilityScenarioModes: UtilityScenarioMode[] = [
  {
    id: "plan-only",
    label: "Plan Only",
    shortLabel: "Plan",
    summary: "Baseline model, schedule, and SOV view before any actuals are asserted.",
    operatingTruth: "No actual field or payment condition has been loaded.",
    executiveAction: "Confirm baseline scope, coding, and review gates before importing records.",
  },
  {
    id: "good-performance",
    label: "Good Field Performance",
    shortLabel: "Good",
    summary: "Installed quantity and labor consumption are tracking better than the plan basis.",
    operatingTruth: "Production is healthy and cash timing is not the governing issue.",
    executiveAction: "Capture production basis and check whether recovery can be repeated.",
  },
  {
    id: "cost-overrun",
    label: "Cost Overrun",
    shortLabel: "Overrun",
    summary: "Schedule is broadly stable, but labor and equipment consumption are moving.",
    operatingTruth: "The governing issue is cost efficiency, not necessarily field completion.",
    executiveAction: "Review labor mix, equipment standby, material handling, and rework support.",
  },
  {
    id: "schedule-delay",
    label: "Schedule Delay",
    shortLabel: "Delay",
    summary: "Actual progress is behind the earned-value plan even before billing is considered.",
    operatingTruth: "The governing issue is sequence, access, inspection, or crew availability.",
    executiveAction: "Assign the constraint owner and update the lookahead before the next claim.",
  },
  {
    id: "payment-lag",
    label: "Payment Lag / Claim Risk",
    shortLabel: "Claims",
    summary: "Earned and claimed work is not converting to approved cash quickly enough.",
    operatingTruth: "The project may be producing value while approval and payment timing starve cash.",
    executiveAction: "Separate entitlement, approval, retainage, and payment timing this period.",
  },
  {
    id: "recovery",
    label: "Recovery",
    shortLabel: "Recovery",
    summary: "Action owners are reducing schedule and cash exposure after a controlled review.",
    operatingTruth: "The bridge is narrowing the issue instead of hiding it in a blended dashboard.",
    executiveAction: "Keep the action register active until field, claim, and payment signals align.",
  },
];

export const utilityGroundModes: UtilityGroundMode[] = [
  {
    id: "soil",
    label: "Soil",
    summary: "Baseline trench productivity and support assumptions.",
    costDelta: 0,
    durationDelta: 0,
    laborDelta: 0,
  },
  {
    id: "rock",
    label: "Rock",
    summary: "Adds excavation, support, productivity, and equipment pressure.",
    costDelta: 12,
    durationDelta: 24,
    laborDelta: 3100,
  },
];

export const utilityWaterModes: UtilityWaterMode[] = [
  {
    id: "dry",
    label: "Dry",
    summary: "No added dewatering or wet-condition delay pressure.",
    costDelta: 0,
    durationDelta: 0,
    laborDelta: 0,
  },
  {
    id: "wet",
    label: "Wet",
    summary: "Adds dewatering, inspection, and restoration pressure.",
    costDelta: 7,
    durationDelta: 18,
    laborDelta: 1700,
  },
];

const scenarioFactors: Record<UtilityScenarioModeId, ScenarioFactors> = {
  "plan-only": {
    costIndex: 100,
    revenueIndex: 112,
    durationDays: 410,
    laborHours: 28400,
    cpi: null,
    spi: null,
    completedQuantityPct: 0,
    claimedQuantityPct: 0,
    approvedQuantityPct: 0,
    cashReceivedPct: 0,
    paymentLagDays: 0,
    retainagePct: 0,
    p50Exposure: 0,
    p80Exposure: 0,
  },
  "good-performance": {
    costIndex: 96,
    revenueIndex: 113,
    durationDays: 396,
    laborHours: 26900,
    cpi: 1.04,
    spi: 1.03,
    completedQuantityPct: 68,
    claimedQuantityPct: 64,
    approvedQuantityPct: 62,
    cashReceivedPct: 58,
    paymentLagDays: 11,
    retainagePct: 5,
    p50Exposure: -3,
    p80Exposure: 2,
  },
  "cost-overrun": {
    costIndex: 116,
    revenueIndex: 112,
    durationDays: 414,
    laborHours: 31900,
    cpi: 0.86,
    spi: 0.99,
    completedQuantityPct: 67,
    claimedQuantityPct: 64,
    approvedQuantityPct: 61,
    cashReceivedPct: 55,
    paymentLagDays: 16,
    retainagePct: 7,
    p50Exposure: 12,
    p80Exposure: 21,
  },
  "schedule-delay": {
    costIndex: 105,
    revenueIndex: 111,
    durationDays: 452,
    laborHours: 30600,
    cpi: 0.95,
    spi: 0.88,
    completedQuantityPct: 52,
    claimedQuantityPct: 49,
    approvedQuantityPct: 47,
    cashReceivedPct: 43,
    paymentLagDays: 18,
    retainagePct: 7,
    p50Exposure: 9,
    p80Exposure: 18,
  },
  "payment-lag": {
    costIndex: 101,
    revenueIndex: 113,
    durationDays: 411,
    laborHours: 28650,
    cpi: 1.01,
    spi: 1.0,
    completedQuantityPct: 81,
    claimedQuantityPct: 79,
    approvedQuantityPct: 66,
    cashReceivedPct: 44,
    paymentLagDays: 38,
    retainagePct: 10,
    p50Exposure: 8,
    p80Exposure: 20,
  },
  recovery: {
    costIndex: 103,
    revenueIndex: 113,
    durationDays: 421,
    laborHours: 29200,
    cpi: 0.98,
    spi: 0.97,
    completedQuantityPct: 84,
    claimedQuantityPct: 80,
    approvedQuantityPct: 73,
    cashReceivedPct: 61,
    paymentLagDays: 24,
    retainagePct: 8,
    p50Exposure: 4,
    p80Exposure: 11,
  },
};

const bottlenecks: Record<UtilityScenarioModeId, string> = {
  "plan-only": "Baseline gate: coding, quantities, and review ownership must be confirmed first.",
  "good-performance": "No major constraint. Preserve the production basis and watch claim timing.",
  "cost-overrun": "Labor efficiency, equipment standby, material handling, or rework is the likely issue.",
  "schedule-delay": "Sequence, access, inspection, and crew availability are governing the delay.",
  "payment-lag": "Approved work and cash are not moving at the same speed as earned field value.",
  recovery: "The action register is reducing exposure, but field, claim, and payment records still need cadence.",
};

const actionOwners: Record<UtilityScenarioModeId, string> = {
  "plan-only": "Project controls",
  "good-performance": "Operations lead",
  "cost-overrun": "Field + procurement",
  "schedule-delay": "Superintendent + scheduler",
  "payment-lag": "Contract admin + finance",
  recovery: "PM + executive sponsor",
};

export function getUtilityScenarioSnapshot({
  modeId,
  groundId,
  waterId,
}: {
  modeId: UtilityScenarioModeId;
  groundId: UtilityGroundId;
  waterId: UtilityWaterId;
}): UtilityScenarioSnapshot {
  const mode = utilityScenarioModes.find((item) => item.id === modeId) ?? utilityScenarioModes[0];
  const ground = utilityGroundModes.find((item) => item.id === groundId) ?? utilityGroundModes[0];
  const water = utilityWaterModes.find((item) => item.id === waterId) ?? utilityWaterModes[0];
  const factors = scenarioFactors[mode.id];
  const costIndex = factors.costIndex + ground.costDelta + water.costDelta;
  const durationDays = factors.durationDays + ground.durationDelta + water.durationDelta;
  const laborHours = factors.laborHours + ground.laborDelta + water.laborDelta;
  const p50Exposure = factors.p50Exposure + Math.round((ground.costDelta + water.costDelta) * 0.35);
  const p80Exposure = factors.p80Exposure + Math.round((ground.costDelta + water.costDelta) * 0.7);

  const composition = [
    { label: "Labor", value: clamp(34 + (mode.id === "cost-overrun" ? 5 : 0) + (ground.id === "rock" ? 2 : 0)) },
    { label: "Material", value: clamp(28 + (mode.id === "good-performance" ? 1 : 0)) },
    { label: "Equipment", value: clamp(15 + (ground.id === "rock" ? 4 : 0) + (water.id === "wet" ? 2 : 0)) },
    { label: "Subcontract", value: clamp(12 + (water.id === "wet" ? 2 : 0)) },
    { label: "Indirect", value: clamp(11 + (mode.id === "schedule-delay" ? 3 : 0)) },
  ];

  const topCostCodes = [
    { code: "U-310", label: "Pipe installation", value: clamp(32 + (mode.id === "good-performance" ? -2 : 0)) },
    { code: "U-220", label: "Trench support", value: clamp(19 + (ground.id === "rock" ? 6 : 0)) },
    { code: "U-255", label: water.id === "wet" ? "Dewatering" : "Utility bedding", value: clamp(14 + (water.id === "wet" ? 6 : 0)) },
    { code: "U-610", label: "Surface restoration", value: clamp(12 + (mode.id === "schedule-delay" ? 2 : 0)) },
  ];

  const reconciliationChecks: UtilityScenarioSnapshot["reconciliationChecks"] = [
    {
      label: "Field quantity vs claim quantity",
      status:
        mode.id === "payment-lag" || mode.id === "recovery"
          ? "watch"
          : factors.claimedQuantityPct > factors.completedQuantityPct
            ? "hold"
            : "pass",
      detail:
        mode.id === "plan-only"
          ? "No claim loaded in Plan Only mode."
          : "Claimed quantity stays tied to accepted field quantity before approval review.",
    },
    {
      label: "Approved quantity vs cash received",
      status: factors.approvedQuantityPct - factors.cashReceivedPct > 18 ? "hold" : "pass",
      detail:
        factors.approvedQuantityPct - factors.cashReceivedPct > 18
          ? "Approval is ahead of payment; cash timing needs executive action."
          : "Cash receipt is broadly aligned with approved work in this sample mode.",
    },
    {
      label: "Actuals freshness",
      status: mode.id === "plan-only" ? "watch" : "pass",
      detail:
        mode.id === "plan-only"
          ? "Forecast remains plan-based until field and cost records are loaded."
          : "Sample actuals are current for the representative review period.",
    },
  ];

  return {
    ...factors,
    costIndex,
    durationDays,
    laborHours,
    p50Exposure,
    p80Exposure,
    mode,
    ground,
    water,
    bottleneck: bottlenecks[mode.id],
    confidence: mode.id === "plan-only" ? "Baseline only" : mode.id === "payment-lag" ? "Cash timing watch" : "Representative",
    actionOwner: actionOwners[mode.id],
    forecastNote:
      mode.id === "plan-only"
        ? "Plan-only mode keeps actuals, claims, and payment assertions off."
        : "Scenario recomputes from representative source-tagged sample records.",
    composition,
    topCostCodes,
    reconciliationChecks,
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
