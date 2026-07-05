import sourceRegistry from "@/data/source_registry.json";
import type {
  CivicBidConnectorMethod,
  CivicBidConnectorStatus,
  CivicBidSource,
  CivicBidSourceCategory,
  CivicBidSourceConfidence,
} from "@/types/civicbid";

type RawCivicBidSource = {
  id: string;
  name: string;
  category: CivicBidSourceCategory;
  jurisdiction: string;
  source_of_truth_level: string;
  url: string;
  api_url: string | null;
  connector_method: CivicBidConnectorMethod;
  notes: string;
};

function connectorStatusFor(source: RawCivicBidSource): CivicBidConnectorStatus {
  if (source.connector_method === "socrata_json" || source.connector_method === "xml_post") {
    return "official_public_api";
  }

  if (
    source.category === "platform_portal" ||
    source.connector_method === "deep_link_login_manual"
  ) {
    return source.id === "bidexpress" ? "commercial_platform" : "official_login_portal";
  }

  if (
    source.connector_method === "deep_link_manual_review" ||
    source.connector_method === "official_link_manual" ||
    source.connector_method === "email_alerts_manual_deep_link" ||
    source.connector_method === "official_link_email_manual" ||
    source.connector_method === "official_link_bonfire_deep_link" ||
    source.connector_method === "official_link_bidexpress_manual" ||
    source.connector_method === "deep_link_manual_export"
  ) {
    return "manual_review";
  }

  return "manual_review";
}

function confidenceFor(source: RawCivicBidSource): CivicBidSourceConfidence {
  if (source.connector_method === "xml_post") return "official_api";
  if (source.connector_method === "socrata_json") return "official_public_dataset";
  if (source.category === "platform_portal") return "commercial_platform";
  if (source.connector_method === "deep_link_login_manual") return "official_login_portal";
  if (source.category === "official_portal" || source.category === "public_portal") {
    return "official_public_portal";
  }

  return "manual_entry";
}

function priorityFor(source: RawCivicBidSource): number {
  if (source.connector_method === "socrata_json") return 1;
  if (source.connector_method === "xml_post") return 2;
  if (source.id.startsWith("passport")) return 3;
  if (source.category === "official_portal") return 4;
  return 5;
}

export const civicBidSourceRegistry: CivicBidSource[] = (sourceRegistry as RawCivicBidSource[])
  .map((source) => ({
    ...source,
    connector_status: connectorStatusFor(source),
    source_confidence: confidenceFor(source),
    connector_priority: priorityFor(source),
    last_checked: "Not checked in public build",
  }))
  .sort((a, b) => a.connector_priority - b.connector_priority || a.name.localeCompare(b.name));

export const civicBidSourceRegistrySummary = {
  total: civicBidSourceRegistry.length,
  publicApi: civicBidSourceRegistry.filter((source) => source.connector_status === "official_public_api")
    .length,
  manualReview: civicBidSourceRegistry.filter((source) => source.connector_status === "manual_review")
    .length,
  loginOrCommercial: civicBidSourceRegistry.filter(
    (source) =>
      source.connector_status === "official_login_portal" ||
      source.connector_status === "commercial_platform",
  ).length,
} as const;

export function formatConnectorMethod(method: CivicBidConnectorMethod) {
  return method.replaceAll("_", " ");
}

export function formatConnectorStatus(status: CivicBidConnectorStatus) {
  return status.replaceAll("_", " ");
}

export function formatSourceConfidence(confidence: CivicBidSourceConfidence) {
  return confidence.replaceAll("_", " ");
}
