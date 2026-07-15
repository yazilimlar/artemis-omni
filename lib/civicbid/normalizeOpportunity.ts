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

/** Source descriptions may embed HTML fragments; strip to plain text before scoring or display. */
function stripHtml(value: string | null): string | null {
  if (!value) return null;
  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return text === "" ? null : text;
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
    /** Template for a per-record official page; `{requestId}` is replaced with the row's request_id. */
    recordUrlTemplate?: string;
  },
  index = 0,
): CivicBidOpportunity {
  const publishedId = pick(row, ["id", "pin", "epin", "event_id", "solicitation_id", "procurement_id"]);
  const id =
    publishedId ?? `${context.sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`;

  const requestId = pick(row, ["request_id"]);
  const recordUrl =
    context.recordUrlTemplate && requestId
      ? context.recordUrlTemplate.replace("{requestId}", encodeURIComponent(requestId))
      : null;

  return {
    id,
    idProvenance: publishedId ? "published" : "generated",
    recordUrl,
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
    category: pick(row, ["category", "category_description", "procurement_type", "notice_type", "type"]),
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
    procurementMethod: pick(row, [
      "procurement_method",
      "selection_method_description",
      "method",
      "selection_method",
    ]),
    description: stripHtml(
      pick(row, [
        "description",
        "additional_description_1",
        "additional_description_2",
        "summary",
        "body",
        "abstract",
      ]),
    ),
    // Socrata open-data records are official public datasets, matching the source registry
    // classification — not a direct agency API.
    sourceConfidence: "official_public_dataset",
    recordMode: "live_official",
    retrievedAt: context.retrievedAt,
    raw: row,
  };
}
