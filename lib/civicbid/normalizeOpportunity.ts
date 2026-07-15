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

const easternOffsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  timeZoneName: "longOffset",
  hour: "2-digit",
});

function easternOffsetMilliseconds(instant: Date): number {
  const offset = easternOffsetFormatter
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = offset?.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Unable to determine America/New_York offset for ${instant.toISOString()}`);
  }
  const direction = match[1] === "+" ? 1 : -1;
  return direction * (Number(match[2]) * 60 + Number(match[3])) * 60_000;
}

/**
 * Socrata publishes NYC solicitation dates as floating timestamps: the clock
 * value is New York local time, with no offset. Convert those values to a real
 * UTC instant explicitly so behavior does not depend on the server's timezone.
 */
export function normalizeNycDate(value: string | null): string | null {
  if (!value) return null;

  const floating = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/,
  );
  if (floating) {
    const [, year, month, day, hour, minute, second = "0", milliseconds = "0"] = floating;
    const wallClockAsUtc = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(milliseconds.padEnd(3, "0")),
    );

    // Resolve the timezone offset iteratively because the applicable Eastern
    // offset is a property of the resulting instant, including DST.
    let instant = wallClockAsUtc;
    for (let iteration = 0; iteration < 3; iteration += 1) {
      instant = wallClockAsUtc - easternOffsetMilliseconds(new Date(instant));
    }
    return new Date(instant).toISOString();
  }

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
    /** Template for a per-record City Record Online page; `{requestId}` is replaced with request_id. */
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
    recordUrlProvenance: recordUrl ? "derived" : null,
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
    publishedDate: normalizeNycDate(
      pick(row, ["publication_date", "published_date", "start_date", "release_date", "record_date"]),
    ),
    dueDate: normalizeNycDate(
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
