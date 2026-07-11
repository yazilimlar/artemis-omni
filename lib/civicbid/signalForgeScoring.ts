import type {
  CivicBidOpportunity,
  CivicBidSourceConfidence,
} from "@/types/civicbid";

export type SignalTier = "A" | "B" | "C";
export type SignalScoreComponentKey =
  | "urgency"
  | "documentation"
  | "sourceConfidence"
  | "constructionFit"
  | "complianceClarity";

export const SIGNAL_FORGE_SCORING_MODEL = [
  {
    key: "urgency",
    label: "Due-date urgency",
    weight: 30,
    description: "How soon the opportunity closes.",
  },
  {
    key: "documentation",
    label: "Document availability",
    weight: 25,
    description: "Scope, method, deadline, and official-link clarity.",
  },
  {
    key: "sourceConfidence",
    label: "Source confidence",
    weight: 20,
    description: "Trust level of the originating source.",
  },
  {
    key: "constructionFit",
    label: "Construction fit",
    weight: 15,
    description: "Alignment with construction, engineering, utility, and infrastructure work.",
  },
  {
    key: "complianceClarity",
    label: "Compliance clarity",
    weight: 10,
    description: "Visibility of participation, wage, bonding, insurance, and related requirements.",
  },
] as const satisfies ReadonlyArray<{
  key: SignalScoreComponentKey;
  label: string;
  weight: number;
  description: string;
}>;

const TOTAL_WEIGHT = SIGNAL_FORGE_SCORING_MODEL.reduce((sum, component) => sum + component.weight, 0);
if (TOTAL_WEIGHT !== 100) {
  throw new Error(`CivicBid scoring weights must total 100; received ${TOTAL_WEIGHT}`);
}

const CONFIDENCE_SCORE: Record<CivicBidSourceConfidence, number> = {
  official_api: 100,
  official_public_dataset: 92,
  official_public_portal: 80,
  official_login_portal: 65,
  commercial_platform: 58,
  user_forwarded_email: 50,
  user_uploaded_document: 54,
  manual_entry: 42,
  sample_data: 35,
};

export interface SignalScoreComponent {
  key: SignalScoreComponentKey;
  label: string;
  weight: number;
  score: number;
  weightedScore: number;
  note: string;
}

export interface SignalForgeScore {
  opportunityId: string;
  title: string;
  agency: string;
  sourceName: string;
  dueDate: string | null;
  compositeScore: number;
  tier: SignalTier;
  components: SignalScoreComponent[];
  rationale: string[];
}

function daysUntil(dateInput: string | null | undefined, now: Date): number | null {
  if (!dateInput) return null;
  const due = new Date(dateInput);
  if (Number.isNaN(due.getTime())) return null;
  return Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
}

function urgencyScore(opportunity: CivicBidOpportunity, now: Date): { score: number; note: string } {
  const daysToDue = daysUntil(opportunity.dueDate, now);
  if (daysToDue === null) return { score: 35, note: "No parseable due date is published." };
  if (daysToDue < 0) return { score: 5, note: `Published due date passed ${Math.abs(daysToDue)} day(s) ago.` };
  if (daysToDue <= 3) return { score: 100, note: `Closes in ${daysToDue} day(s); immediate decision required.` };
  if (daysToDue <= 7) return { score: 92, note: `Closes in ${daysToDue} day(s).` };
  if (daysToDue <= 14) return { score: 82, note: `Closes in ${daysToDue} day(s).` };
  if (daysToDue <= 30) return { score: 68, note: `Closes in ${daysToDue} day(s).` };
  if (daysToDue <= 60) return { score: 52, note: `Closes in ${daysToDue} day(s); planning runway remains.` };
  return { score: 38, note: `Long runway: ${daysToDue} day(s) to the published due date.` };
}

function documentationScore(opportunity: CivicBidOpportunity): { score: number; note: string } {
  let score = 10;
  const available: string[] = [];
  if (opportunity.dueDate) {
    score += 25;
    available.push("deadline");
  }
  if (opportunity.description && opportunity.description.trim().length >= 40) {
    score += 25;
    available.push("scope narrative");
  }
  if (opportunity.procurementMethod) {
    score += 20;
    available.push("procurement method");
  }
  if (opportunity.sourceUrl || opportunity.apiUrl) {
    score += 20;
    available.push("official source link");
  }
  return {
    score: Math.min(score, 100),
    note: available.length > 0 ? `Published fields: ${available.join(", ")}.` : "Core bid fields are not yet published.",
  };
}

function sourceConfidenceScore(opportunity: CivicBidOpportunity): { score: number; note: string } {
  const score = CONFIDENCE_SCORE[opportunity.sourceConfidence] ?? 40;
  const note =
    opportunity.recordMode === "sample" || opportunity.sourceConfidence === "sample_data"
      ? "Synthetic sample record; never treat as a live solicitation."
      : `Source confidence classification: ${opportunity.sourceConfidence.replaceAll("_", " ")}.`;
  return { score, note };
}

function constructionFitScore(opportunity: CivicBidOpportunity): { score: number; note: string } {
  const text = [opportunity.title, opportunity.category, opportunity.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const strongTerms = [
    "construction",
    "reconstruction",
    "infrastructure",
    "utility",
    "sewer",
    "water main",
    "roadway",
    "bridge",
    "transit",
    "station",
    "engineering",
    "rehabilitation",
    "capital",
  ];
  const mediumTerms = ["repair", "installation", "inspection", "design-build", "mechanical", "electrical"];
  const strongMatches = strongTerms.filter((term) => text.includes(term));
  const mediumMatches = mediumTerms.filter((term) => text.includes(term));
  const score = Math.min(100, 25 + strongMatches.length * 18 + mediumMatches.length * 10);

  return {
    score,
    note:
      strongMatches.length + mediumMatches.length > 0
        ? `Construction-fit signals: ${[...strongMatches, ...mediumMatches].slice(0, 4).join(", ")}.`
        : "No strong construction or infrastructure terms detected in the published text.",
  };
}

function complianceClarityScore(opportunity: CivicBidOpportunity): { score: number; note: string } {
  const requirements = opportunity.requirements ?? [];
  const text = [opportunity.title, opportunity.description, ...requirements.map((requirement) => requirement.label)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const signals = [
    ["mwbe", "MWBE"],
    ["minority", "minority participation"],
    ["women-owned", "women-owned participation"],
    ["prevailing wage", "prevailing wage"],
    ["section 3", "Section 3"],
    ["bond", "bonding"],
    ["insurance", "insurance"],
    ["project labor", "project labor agreement"],
  ] as const;
  const matches = signals.filter(([needle]) => text.includes(needle)).map(([, label]) => label);
  const score = matches.length === 0 ? 30 : Math.min(100, 45 + matches.length * 14);

  return {
    score,
    note:
      matches.length > 0
        ? `Published compliance signals: ${matches.slice(0, 4).join(", ")}.`
        : "No material compliance terms detected; manual bid-document review remains required.",
  };
}

const COMPONENT_SCORERS: Record<
  SignalScoreComponentKey,
  (opportunity: CivicBidOpportunity, now: Date) => { score: number; note: string }
> = {
  urgency: urgencyScore,
  documentation: (opportunity) => documentationScore(opportunity),
  sourceConfidence: (opportunity) => sourceConfidenceScore(opportunity),
  constructionFit: (opportunity) => constructionFitScore(opportunity),
  complianceClarity: (opportunity) => complianceClarityScore(opportunity),
};

export function scoreOpportunity(
  opportunity: CivicBidOpportunity,
  now: Date = new Date(),
): SignalForgeScore {
  const components = SIGNAL_FORGE_SCORING_MODEL.map((definition) => {
    const result = COMPONENT_SCORERS[definition.key](opportunity, now);
    return {
      ...definition,
      score: result.score,
      weightedScore: Number(((result.score * definition.weight) / 100).toFixed(2)),
      note: result.note,
    };
  });

  const compositeScore = Math.round(
    components.reduce((sum, component) => sum + component.weightedScore, 0),
  );
  const tier: SignalTier = compositeScore >= 75 ? "A" : compositeScore >= 55 ? "B" : "C";

  return {
    opportunityId: opportunity.id,
    title: opportunity.title,
    agency: opportunity.agency,
    sourceName: opportunity.sourceName,
    dueDate: opportunity.dueDate ?? null,
    compositeScore,
    tier,
    components,
    rationale: components.map((component) => component.note),
  };
}

export function scoreQueue(
  opportunities: CivicBidOpportunity[],
  now: Date = new Date(),
): SignalForgeScore[] {
  return opportunities
    .map((opportunity) => scoreOpportunity(opportunity, now))
    .sort((left, right) => right.compositeScore - left.compositeScore);
}
