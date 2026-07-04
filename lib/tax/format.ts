import type { EvidenceStatus } from "@/types/tax-architecture";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(value: number): string {
  return usd.format(value);
}

export type ConfidenceBand = { label: string; tone: "high" | "medium" | "low" };

export function confidenceBand(percent: number): ConfidenceBand {
  if (percent >= 70) return { label: "High confidence", tone: "high" };
  if (percent >= 50) return { label: "Moderate confidence", tone: "medium" };
  return { label: "Low confidence", tone: "low" };
}

export const EVIDENCE_LABEL: Record<EvidenceStatus, string> = {
  actual: "Actual",
  estimated: "Estimated",
  assumption: "Assumption",
  missing_backup: "Missing Backup",
};

// Tailwind classes per evidence status. Colour is paired with text so meaning
// is never conveyed by colour alone (accessibility).
export const EVIDENCE_BADGE: Record<EvidenceStatus, string> = {
  actual: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  estimated: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  assumption: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  missing_backup: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};
