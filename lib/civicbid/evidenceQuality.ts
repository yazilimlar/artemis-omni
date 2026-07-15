import type { CivicBidOpportunity } from "@/types/civicbid";

/**
 * Evidence Quality Score — a materiality-weighted measure of how much of each
 * opportunity record is actually backed by published source data.
 *
 * This is deliberately NOT called "confidence": the weights and caps below are
 * human-authored heuristics that have not been calibrated against labeled
 * outcomes. Every consumer must present the result as provisional and show
 * coverage (fields present vs. material fields) alongside the score.
 *
 * Non-compensating safety gates (a strength in one field can never hide a
 * critical weakness in another):
 *  - synthetic/sample records receive no score at all (null, shown as N/A)
 *  - dataset-level-only evidence linkage caps the score at 65
 *  - no evidence linkage caps the score at 40
 *  - a missing or unparseable deadline caps the score at 49 and raises a
 *    critical warning
 */

export type EvidenceFieldState = "published" | "normalized" | "generated" | "missing";

export interface EvidenceField {
  key: string;
  label: string;
  /** Materiality weight; all weights sum to 100. */
  weight: number;
  state: EvidenceFieldState;
  /** Displayable value after normalization, if any. */
  value: string | null;
  note: string;
}

export type EvidenceLinkage = "record" | "dataset" | "none";

export interface EvidenceQuality {
  /** 0–100, or null when the record is synthetic (never score sample data). */
  score: number | null;
  status: "provisional" | "synthetic";
  /** Count of material fields in a published or normalized state. */
  fieldsPresent: number;
  fieldsTotal: number;
  linkage: EvidenceLinkage;
  criticalWarnings: string[];
  gatesApplied: string[];
  fields: EvidenceField[];
}

const STATE_CREDIT: Record<EvidenceFieldState, number> = {
  published: 1,
  // Value exists but was transformed with an assumption (e.g. a date without an
  // explicit timezone converted to ISO assuming source-local time).
  normalized: 0.85,
  // Value was synthesized by the pipeline (e.g. an order-dependent fallback id).
  generated: 0.3,
  missing: 0,
};

const LINKAGE_CAP: Record<EvidenceLinkage, number> = {
  record: 100,
  // The NYC dataset publishes one dataset-level URL, not per-record pages; a
  // human can still locate the record inside the dataset, so this is capped
  // rather than zeroed. Cap values are review-required heuristics.
  dataset: 65,
  none: 40,
};

const MISSING_DEADLINE_CAP = 49;

function isSynthetic(opportunity: CivicBidOpportunity): boolean {
  return opportunity.recordMode === "sample" || opportunity.sourceConfidence === "sample_data";
}

function parseableDate(value: string | null | undefined): boolean {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function field(
  key: string,
  label: string,
  weight: number,
  state: EvidenceFieldState,
  value: string | null,
  note: string,
): EvidenceField {
  return { key, label, weight, state, value, note };
}

export function assessEvidenceQuality(opportunity: CivicBidOpportunity): EvidenceQuality {
  const fields: EvidenceField[] = [];

  const idState: EvidenceFieldState =
    opportunity.idProvenance === "generated" ? "generated" : "published";
  fields.push(
    field(
      "identity",
      "Record identity",
      10,
      idState,
      opportunity.id,
      idState === "published"
        ? "Identifier came from a published source field."
        : "No published identifier; an order-dependent id was generated and may not be stable across retrievals.",
    ),
  );

  const untitled = opportunity.title === "Untitled public opportunity";
  fields.push(
    field(
      "title",
      "Title",
      10,
      untitled ? "missing" : "published",
      untitled ? null : opportunity.title,
      untitled ? "The source published no usable title." : "Published by the source.",
    ),
  );

  const agencyMissing = !opportunity.agency || opportunity.agency === "Agency not published";
  fields.push(
    field(
      "agency",
      "Agency",
      10,
      agencyMissing ? "missing" : "published",
      agencyMissing ? null : opportunity.agency,
      agencyMissing ? "The source published no agency." : "Published by the source.",
    ),
  );

  const dueOk = parseableDate(opportunity.dueDate);
  fields.push(
    field(
      "dueDate",
      "Due date",
      20,
      dueOk ? "normalized" : "missing",
      dueOk ? opportunity.dueDate ?? null : null,
      dueOk
        ? "Published, then converted to ISO. The source omits an explicit timezone; source-local time is assumed."
        : "No parseable due date is published — verify at the official source before any bid decision.",
    ),
  );

  const publishedOk = parseableDate(opportunity.publishedDate);
  fields.push(
    field(
      "publishedDate",
      "Published date",
      5,
      publishedOk ? "normalized" : "missing",
      publishedOk ? opportunity.publishedDate ?? null : null,
      publishedOk
        ? "Published, then converted to ISO with an assumed source-local timezone."
        : "Not published by the source.",
    ),
  );

  fields.push(
    field(
      "procurementMethod",
      "Procurement method",
      10,
      opportunity.procurementMethod ? "published" : "missing",
      opportunity.procurementMethod ?? null,
      opportunity.procurementMethod ? "Published by the source." : "Not published by the source.",
    ),
  );

  const hasScope = Boolean(opportunity.description && opportunity.description.trim().length >= 20);
  fields.push(
    field(
      "scope",
      "Scope narrative",
      15,
      hasScope ? "normalized" : "missing",
      hasScope ? opportunity.description ?? null : null,
      hasScope
        ? "Published description; HTML markup was stripped to plain text."
        : "No substantive scope text is published — the controlling bid documents must be read.",
    ),
  );

  fields.push(
    field(
      "category",
      "Category",
      5,
      opportunity.category ? "published" : "missing",
      opportunity.category ?? null,
      opportunity.category ? "Published by the source." : "Not published by the source.",
    ),
  );

  const recordLink = opportunity.recordUrl ?? null;
  const datasetLink = opportunity.sourceUrl ?? opportunity.apiUrl ?? null;
  const link = recordLink ?? datasetLink;
  fields.push(
    field(
      "sourceLink",
      "Evidence link",
      10,
      recordLink ? "published" : datasetLink ? "normalized" : "missing",
      link,
      recordLink
        ? "Record-level official notice page (City Record Online). Controlling bid documents remain in the agency's procurement system."
        : datasetLink
          ? "Dataset-level link only; the dataset is a discovery source, and the controlling record remains the official agency notice."
          : "No verification destination is available for this record.",
    ),
  );

  fields.push(
    field(
      "jurisdiction",
      "Jurisdiction",
      5,
      opportunity.jurisdiction ? "published" : "missing",
      opportunity.jurisdiction ?? null,
      opportunity.jurisdiction ? "Carried from the source registry." : "Unknown.",
    ),
  );

  const fieldsTotal = fields.length;
  const fieldsPresent = fields.filter(
    (entry) => entry.state === "published" || entry.state === "normalized",
  ).length;

  const criticalWarnings: string[] = [];
  const gatesApplied: string[] = [];

  if (isSynthetic(opportunity)) {
    criticalWarnings.push("Synthetic sample record — never treated as a live solicitation.");
    gatesApplied.push("Synthetic record gate: no evidence score is issued for sample data.");
    return {
      score: null,
      status: "synthetic",
      fieldsPresent,
      fieldsTotal,
      linkage: "none",
      criticalWarnings,
      gatesApplied,
      fields,
    };
  }

  const totalWeight = fields.reduce((sum, entry) => sum + entry.weight, 0);
  const weighted = fields.reduce(
    (sum, entry) => sum + entry.weight * STATE_CREDIT[entry.state],
    0,
  );
  let score = Math.round((100 * weighted) / totalWeight);

  const linkage: EvidenceLinkage = recordLink ? "record" : datasetLink ? "dataset" : "none";
  if (score > LINKAGE_CAP[linkage]) {
    score = LINKAGE_CAP[linkage];
    gatesApplied.push(
      linkage === "dataset"
        ? `Evidence-linkage gate: dataset-level link only, score capped at ${LINKAGE_CAP.dataset}.`
        : `Evidence-linkage gate: no evidence link, score capped at ${LINKAGE_CAP.none}.`,
    );
  }

  if (!dueOk) {
    criticalWarnings.push("Deadline is missing or unparseable — a bid/no-bid decision cannot be made from this record.");
    if (score > MISSING_DEADLINE_CAP) {
      score = MISSING_DEADLINE_CAP;
      gatesApplied.push(`Deadline gate: missing deadline caps the score at ${MISSING_DEADLINE_CAP}.`);
    }
  } else if (opportunity.dueDate && new Date(opportunity.dueDate).getTime() < Date.now()) {
    criticalWarnings.push("Published due date has passed — confirm status and addenda at the official source.");
  }

  return {
    score,
    status: "provisional",
    fieldsPresent,
    fieldsTotal,
    linkage,
    criticalWarnings,
    gatesApplied,
    fields,
  };
}
