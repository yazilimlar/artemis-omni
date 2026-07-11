import type { CivicBidOpportunity } from "@/types/civicbid";

function pick(row: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return null;
}

function normalizeDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export function normalizeOpenDataOpportunity(
  row: Record<string, unknown>,
  context: {
    sourceName: string;
    apiUrl: string;
    sourceUrl: string;
    jurisdiction?: string;
    retrievedAt: string;
  },
  index = 0,
): CivicBidOpportunity {
  const id =
    pick(row, ["id", "pin", "epin", "event_id", "solicitation_id", "procurement_id"]) ??
    `${context.sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`;

  return {
    id,
    title:
      pick(row, [
        "title",
        "short_title",
        "procurement_title",
        "notice_title",
        "event_title",
        "description",
      ]) ?? "Untitled public opportunity",
    agency: pick(row, ["agency", "agency_name", "dept_name", "department"]) ?? "Agency not published",
    sourceName: context.sourceName,
    sourceUrl: context.sourceUrl,
    apiUrl: context.apiUrl,
    jurisdiction: context.jurisdiction ?? "NYC",
    category: pick(row, ["category", "procurement_type", "notice_type", "type"]),
    publishedDate: normalizeDate(
      pick(row, ["publication_date", "published_date", "start_date", "release_date", "record_date"]),
    ),
    dueDate: normalizeDate(
      pick(row, [
        "due_date",
        "proposal_due_date",
        "bid_due_date",
        "end_date",
        "response_due_date",
        "close_date",
      ]),
    ),
    procurementMethod: pick(row, ["procurement_method", "method", "selection_method"]),
    description: pick(row, ["description", "summary", "body", "abstract"]),
    sourceConfidence: "official_api",
    recordMode: "live_official",
    retrievedAt: context.retrievedAt,
    raw: row,
  };
}
