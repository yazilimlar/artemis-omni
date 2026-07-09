import type {
  CivicBidOpportunity,
  CivicBidSourceConfidence,
} from "./normalizeOpportunity";

export type SignalTier = "A" | "B" | "C";

export interface SignalForgeScore {
  opportunityId: string;
  title: string;
  agency: string;
  sourceName: string;
  dueDate: string | null;
  urgencyScore: number;
  readinessScore: number;
  confidenceScore: number;
  compositeScore: number;
  tier: SignalTier;
  rationale: string[];
}

const CONFIDENCE_WEIGHT: Record<CivicBidSourceConfidence, number> = {
  official_api: 95,
  official_public_dataset: 90,
  official_public_portal: 78,
  official_login_portal: 62,
  commercial_platform: 55,
  user_forwarded_email: 48,
  user_uploaded_document: 52,
  manual_entry: 42,
  sample_data: 35,
};

function daysUntil(dateInput: string | null | undefined, now: Date): number | null {
  if (!dateInput) return null;
  const due = new Date(dateInput);
  if (Number.isNaN(due.getTime())) return null;
  return Math.round((due.getTime() - now.getTime()) / 86_400_000);
}

function scoreUrgency(daysToDue: number | null): { score: number; note: string } {
  if (daysToDue === null) return { score: 40, note: "No due date published yet" };
  if (daysToDue < 0) return { score: 10, note: `Due date passed ${-daysToDue}d ago` };
  if (daysToDue <= 7) return { score: 95, note: `Closes in ${daysToDue}d — act now` };
  if (daysToDue <= 14) return { score: 85, note: `Closes in ${daysToDue}d` };
  if (daysToDue <= 30) return { score: 70, note: `Closes in ${daysToDue}d` };
  if (daysToDue <= 60) return { score: 55, note: `Closes in ${daysToDue}d — runway available` };
  return { score: 40, note: `Long runway (${daysToDue}d)` };
}

function scoreReadiness(opp: CivicBidOpportunity): { score: number; notes: string[] } {
  let score = 45;
  const notes: string[] = [];

  if (opp.dueDate) {
    score += 15;
    notes.push("Deadline known — schedule can be planned");
  }
  if (opp.description && opp.description.length > 40) {
    score += 10;
    notes.push("Scope description available");
  }
  if (opp.procurementMethod) {
    score += 10;
    notes.push(`Method: ${opp.procurementMethod}`);
  }
  if (opp.category && /construction|build|architect|engineer/i.test(opp.category)) {
    score += 15;
    notes.push("Construction-aligned category");
  }
  if (opp.sourceUrl || opp.apiUrl) {
    score += 5;
    notes.push("Direct link to official record");
  }

  return { score: Math.min(score, 100), notes };
}

export function scoreOpportunity(
  opp: CivicBidOpportunity,
  now: Date = new Date(),
): SignalForgeScore {
  const urgency = scoreUrgency(daysUntil(opp.dueDate, now));
  const readiness = scoreReadiness(opp);
  const confidenceScore = CONFIDENCE_WEIGHT[opp.sourceConfidence] ?? 40;

  const compositeScore = Math.round(
    urgency.score * 0.4 + readiness.score * 0.35 + confidenceScore * 0.25,
  );

  const tier: SignalTier = compositeScore >= 75 ? "A" : compositeScore >= 55 ? "B" : "C";

  return {
    opportunityId: opp.id,
    title: opp.title,
    agency: opp.agency,
    sourceName: opp.sourceName,
    dueDate: opp.dueDate ?? null,
    urgencyScore: urgency.score,
    readinessScore: readiness.score,
    confidenceScore,
    compositeScore,
    tier,
    rationale: [urgency.note, ...readiness.notes.slice(0, 2)],
  };
}

export function scoreQueue(
  opportunities: CivicBidOpportunity[],
  now: Date = new Date(),
): SignalForgeScore[] {
  return opportunities
    .map((opp) => scoreOpportunity(opp, now))
    .sort((a, b) => b.compositeScore - a.compositeScore);
}

export function getTierColor(tier: SignalTier): string {
  switch (tier) {
    case "A":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    case "B":
      return "bg-amber-500/10 text-amber-300 border-amber-500/30";
    case "C":
      return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  }
}

export function getUrgencyColor(score: number): string {
  if (score >= 80) return "text-rose-300";
  if (score >= 55) return "text-amber-300";
  return "text-slate-300";
}

export function getReadinessColor(score: number): string {
  if (score >= 75) return "text-emerald-300";
  if (score >= 55) return "text-cyan-300";
  return "text-slate-300";
}
