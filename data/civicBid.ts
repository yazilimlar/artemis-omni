export type CivicBidModeId =
  | "market-terrain"
  | "solicitation-join"
  | "compliance-copilot"
  | "subcontractor-map"
  | "lifecycle-watch";

export type CivicBidMode = {
  id: CivicBidModeId;
  label: string;
  summary: string;
  decisionGate: string;
  operatingTruth: string;
  actionOwner: string;
  watchlist: string[];
  scores: {
    opportunity: number;
    timing: number;
    compliance: number;
    outreach: number;
    confidence: number;
  };
  kpis: {
    label: string;
    value: string;
    detail: string;
  }[];
};

export const civicBidMetricStrip = [
  {
    label: "Source posture",
    value: "Public award/status reference",
    detail: "Large PASSPort-style contract records inspected, then rebuilt as representative signals.",
  },
  {
    label: "Publication mode",
    value: "Sanitized native route",
    detail: "No raw record table, vendor list, contract IDs, exact dollar ledger, or embedded HTML.",
  },
  {
    label: "Best next join",
    value: "Solicitations + addenda",
    detail: "Bid due dates, plan/spec files, pre-bid notes, bonding, insurance, and agency rules.",
  },
  {
    label: "Audience",
    value: "Primes, subs, suppliers",
    detail: "Business development, estimating, compliance, executive review, and pursuit operations.",
  },
  {
    label: "Data mode",
    value: "Representative indices",
    detail: "Deterministic sample scoring only; not a live procurement feed or certified source.",
  },
] as const;

export const civicBidModes: CivicBidMode[] = [
  {
    id: "market-terrain",
    label: "Market Terrain",
    summary: "Read public award/status fragments as a market map before choosing a pursuit lane.",
    decisionGate: "Which agency, program, method, and incumbent cluster deserves focus this week?",
    operatingTruth:
      "Award/status data is useful for market intelligence, but it is not enough to run bid deadlines.",
    actionOwner: "Business development lead",
    watchlist: [
      "Agency concentration by work type",
      "Incumbent vendor patterns",
      "Procurement method mix",
      "Construction-heavy program clusters",
    ],
    scores: {
      opportunity: 82,
      timing: 56,
      compliance: 44,
      outreach: 71,
      confidence: 76,
    },
    kpis: [
      {
        label: "Market heat",
        value: "82",
        detail: "Strong concentration signal for contractor targeting.",
      },
      {
        label: "Bid readiness",
        value: "56",
        detail: "Needs solicitation deadlines before pursuit action.",
      },
      {
        label: "Incumbent map",
        value: "71",
        detail: "Enough pattern to shape partner and outreach hypotheses.",
      },
      {
        label: "Confidence",
        value: "76",
        detail: "Good directional read, still requires live source joins.",
      },
    ],
  },
  {
    id: "solicitation-join",
    label: "Solicitation Join",
    summary: "Turn market intelligence into a bid calendar by joining open opportunities.",
    decisionGate: "Which live solicitations, due dates, addenda, and plan files should enter the bid room?",
    operatingTruth:
      "The next product leap is joining awards/status records to live solicitations and document changes.",
    actionOwner: "Pursuit operations manager",
    watchlist: [
      "Bid due date and submission mode",
      "Pre-bid meeting and site visit",
      "Addenda and question deadlines",
      "Plan/spec document custody",
    ],
    scores: {
      opportunity: 88,
      timing: 91,
      compliance: 67,
      outreach: 62,
      confidence: 81,
    },
    kpis: [
      {
        label: "Opportunity heat",
        value: "88",
        detail: "Live solicitation join creates direct pursuit value.",
      },
      {
        label: "Action horizon",
        value: "91",
        detail: "Due dates and addenda make timing operational.",
      },
      {
        label: "Doc custody",
        value: "67",
        detail: "Plan/spec and addendum parsing still needs review gates.",
      },
      {
        label: "Confidence",
        value: "81",
        detail: "Strongest route from cockpit demo to usable product.",
      },
    ],
  },
  {
    id: "compliance-copilot",
    label: "Compliance Copilot",
    summary: "Extract pursuit requirements into a checklist the bid team can actually manage.",
    decisionGate: "Which bonding, insurance, prequalification, M/WBE, and submission rules can block a bid?",
    operatingTruth:
      "A bid can be attractive and still be a poor pursuit if requirements are discovered late.",
    actionOwner: "Compliance and estimating coordinator",
    watchlist: [
      "Insurance and bonding requirements",
      "Prequalification and license rules",
      "M/WBE participation signals",
      "Forms, affidavits, and submission packaging",
    ],
    scores: {
      opportunity: 73,
      timing: 69,
      compliance: 92,
      outreach: 55,
      confidence: 78,
    },
    kpis: [
      {
        label: "Compliance load",
        value: "92",
        detail: "Requirements extraction is the main control issue.",
      },
      {
        label: "Bid fit",
        value: "73",
        detail: "Good opportunity, but only after requirement triage.",
      },
      {
        label: "Time pressure",
        value: "69",
        detail: "Addendum and question deadlines govern action.",
      },
      {
        label: "Confidence",
        value: "78",
        detail: "Needs human review before anything becomes a bid instruction.",
      },
    ],
  },
  {
    id: "subcontractor-map",
    label: "Subcontractor Map",
    summary: "Translate agency/program patterns into prime, subcontractor, supplier, and trade targeting.",
    decisionGate: "Which primes, subs, suppliers, and trade packages should be contacted before the next bid?",
    operatingTruth:
      "Award history can guide outreach, but vendor names and aliases must be normalized privately.",
    actionOwner: "Partnership and supplier lead",
    watchlist: [
      "Prime and JV alias normalization",
      "Likely trade packages",
      "Supplier and subcontractor fit",
      "Outreach cadence and CRM notes",
    ],
    scores: {
      opportunity: 79,
      timing: 63,
      compliance: 58,
      outreach: 94,
      confidence: 72,
    },
    kpis: [
      {
        label: "Outreach value",
        value: "94",
        detail: "Best mode for partner discovery and supplier strategy.",
      },
      {
        label: "Opportunity heat",
        value: "79",
        detail: "Strong signal once trade tags are joined.",
      },
      {
        label: "Alias risk",
        value: "58",
        detail: "Vendor/JV normalization must stay reviewable.",
      },
      {
        label: "Confidence",
        value: "72",
        detail: "Useful directional map, not a certified vendor record.",
      },
    ],
  },
  {
    id: "lifecycle-watch",
    label: "Lifecycle Watch",
    summary: "Monitor ending, future-start, remaining, and change-order patterns for rebid timing.",
    decisionGate: "Which expiring, amended, or remaining-value contracts point to upcoming action?",
    operatingTruth:
      "End dates and remaining encumbrance can flag timing, but only live solicitations confirm bid action.",
    actionOwner: "Executive pursuit review",
    watchlist: [
      "Expiring contract horizon",
      "Remaining value and paid-status anomalies",
      "Future-start pipeline",
      "Change-order intensity and renewal signals",
    ],
    scores: {
      opportunity: 85,
      timing: 86,
      compliance: 61,
      outreach: 68,
      confidence: 74,
    },
    kpis: [
      {
        label: "Lifecycle signal",
        value: "85",
        detail: "Good for rebid, renewal, and staffing watchlists.",
      },
      {
        label: "Timing pressure",
        value: "86",
        detail: "End-date horizons make executive review practical.",
      },
      {
        label: "Reconciliation need",
        value: "61",
        detail: "Remaining/paid status needs source validation.",
      },
      {
        label: "Confidence",
        value: "74",
        detail: "Directional watch only until source links are current.",
      },
    ],
  },
];

export const civicBidPipeline = [
  {
    step: "01",
    label: "Award/status records",
    detail: "Public procurement fragments reveal agencies, programs, methods, dates, status, and economics.",
  },
  {
    step: "02",
    label: "Solicitation join",
    detail: "Open bids, due dates, addenda, pre-bid events, and plan/spec files turn terrain into action.",
  },
  {
    step: "03",
    label: "Requirement extraction",
    detail: "Insurance, bonding, M/WBE, prequalification, forms, and submission packaging become checklists.",
  },
  {
    step: "04",
    label: "Trade and vendor graph",
    detail: "Primes, subs, suppliers, aliases, likely scopes, and outreach notes become a pursuit map.",
  },
  {
    step: "05",
    label: "Executive bid room",
    detail: "Weekly briefing shows pursuit fit, action owner, confidence, limitation, and next move.",
  },
] as const;

export const civicBidProductPillars = [
  {
    title: "Contractor Opportunity Radar",
    description:
      "Fuse public award/status intelligence with live solicitations, due dates, addenda, trade tags, and agency rules.",
    signals: ["Daily bid calendar", "Agency alerts", "Rebid watch", "Pursuit fit score"],
  },
  {
    title: "Subcontractor Matchmaker",
    description:
      "Map prime patterns, likely trade packages, supplier fit, outreach timing, and partner hypotheses.",
    signals: ["Prime profile", "Trade tags", "Supplier targeting", "Outreach queue"],
  },
  {
    title: "Lifecycle Monitor",
    description:
      "Use end dates, future-start signals, remaining value, and change-order intensity to flag upcoming action.",
    signals: ["Expiry watchlist", "Renewal signal", "Remaining-value review", "Change-order heat"],
  },
  {
    title: "Bid Compliance Copilot",
    description:
      "Convert solicitation documents and addenda into human-reviewed requirements before the bid room commits.",
    signals: ["Bonding", "Insurance", "Prequalification", "Addendum tracker"],
  },
  {
    title: "Civic Procurement Data Lake",
    description:
      "Normalize agencies, solicitations, contracts, awards, payments, vendors, contacts, addenda, and requirements.",
    signals: ["Canonical graph", "Vendor aliases", "Document custody", "API-ready model"],
  },
  {
    title: "Executive Briefing Engine",
    description:
      "Create a weekly market and pursuit briefing by agency, trade, geography, timing, incumbent, and confidence.",
    signals: ["Monday digest", "Watchlist scoring", "Decision owner", "Review log"],
  },
] as const;

export const civicBidRoles = [
  {
    role: "Business development",
    dialect: "Agency patterns, likely rebids, incumbent maps, and relationship timing.",
    question: "Where should outreach start before a bid is formally on the table?",
  },
  {
    role: "Estimator",
    dialect: "Trade tags, plans/specs, addenda, unit scope, alternates, and bid package completeness.",
    question: "Is this bid worth estimating before requirements consume the team?",
  },
  {
    role: "Compliance",
    dialect: "Bonding, insurance, prequalification, affidavits, M/WBE rules, and submission packaging.",
    question: "Which requirement can disqualify the bid if it is found late?",
  },
  {
    role: "Executive",
    dialect: "Pursuit fit, timing, margin potential, teaming path, confidence, and next action owner.",
    question: "Which opportunities belong in this week's pursuit review?",
  },
] as const;

export const civicBidBoundaryChecks = [
  "Raw RC1 HTML and embedded record payload are not copied, iframe-wrapped, or shipped.",
  "Exact vendor names, contract IDs, EPINs, row-level amounts, and source record tables are excluded.",
  "Visible values are representative scores and ranges, not certified procurement advice.",
  "The route is not a live bid-deadline feed, award system, compliance decision, or legal recommendation.",
] as const;

export function getCivicBidMode(id: CivicBidModeId) {
  return civicBidModes.find((mode) => mode.id === id) ?? civicBidModes[0];
}
