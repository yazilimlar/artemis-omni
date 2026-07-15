export type CivicBidSourceConfidence =
  | "official_api"
  | "official_public_dataset"
  | "official_public_portal"
  | "official_login_portal"
  | "commercial_platform"
  | "user_forwarded_email"
  | "user_uploaded_document"
  | "manual_entry"
  | "sample_data";

export type CivicBidRecordMode = "live_official" | "sample";

export type CivicBidConnectorStatus =
  | "official_public_api"
  | "official_public_portal"
  | "official_login_portal"
  | "commercial_platform"
  | "manual_review"
  | "sample_data";

export type CivicBidConnectorMethod =
  | "socrata_json"
  | "xml_post"
  | "deep_link_manual_review"
  | "email_alerts_manual_deep_link"
  | "official_link_email_manual"
  | "official_link_bonfire_deep_link"
  | "deep_link_login_manual"
  | "official_link_manual"
  | "official_link_bidexpress_manual"
  | "deep_link_manual_export";

export type CivicBidSourceCategory =
  | "public_api"
  | "public_portal"
  | "official_portal"
  | "platform_portal";

export type CivicBidSource = {
  id: string;
  name: string;
  category: CivicBidSourceCategory;
  jurisdiction: string;
  source_of_truth_level: string;
  url: string;
  api_url: string | null;
  connector_method: CivicBidConnectorMethod;
  connector_status: CivicBidConnectorStatus;
  source_confidence: CivicBidSourceConfidence;
  connector_priority: number;
  last_checked: string;
  notes: string;
};

export type CivicBidRequirement = {
  id: string;
  label: string;
  sourceId: string;
  sourceUrl?: string | null;
  status: "required" | "watch" | "manual_review" | "not_applicable";
  confidence: CivicBidSourceConfidence;
  humanReviewRequired: boolean;
};

export type CivicBidOpportunity = {
  id: string;
  /** Whether the id came from a published source field or was generated order-dependently. */
  idProvenance?: "published" | "generated";
  title: string;
  agency: string;
  sourceName: string;
  sourceUrl?: string | null;
  apiUrl?: string | null;
  /** Per-record source destination (e.g. a City Record Online notice page), when available. */
  recordUrl?: string | null;
  /** Whether the URL was source-published or deterministically derived from a source identifier. */
  recordUrlProvenance?: "published" | "derived" | null;
  jurisdiction: string;
  category?: string | null;
  publishedDate?: string | null;
  dueDate?: string | null;
  procurementMethod?: string | null;
  description?: string | null;
  requirements?: CivicBidRequirement[];
  sourceConfidence: CivicBidSourceConfidence;
  /** Explicit at the record level for rescued live/sample cockpit data. */
  recordMode?: CivicBidRecordMode;
  retrievedAt: string;
  /** Internal connector evidence; public API routes should omit this field. */
  raw?: unknown;
};
