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

export interface CivicBidSource {
  id: string;
  name: string;
  category: CivicBidSourceCategory;
  jurisdiction: string;
  source_of_truth_level: string;
  url: string;
  api_url?: string | null;
  connector_method: CivicBidConnectorMethod;
  notes: string;
}

export const civicBidSources: CivicBidSource[] = [
  {
    id: "nyc-open-data-city-record",
    name: "NYC Open Data — City Record Online",
    category: "public_api",
    jurisdiction: "NYC",
    source_of_truth_level: "official_notice_dataset",
    url: "https://data.cityofnewyork.us/City-Government/City-Record-Online/dg92-zbpx",
    api_url: "https://data.cityofnewyork.us/resource/dg92-zbpx.json",
    connector_method: "socrata_json",
    notes:
      "Official City Record notices dataset. Use for notice discovery, awards, public hearings, solicitations, and official notice history.",
  },
  {
    id: "nyc-open-data-current-solicitations",
    name: "NYC Open Data — Current Solicitations",
    category: "public_api",
    jurisdiction: "NYC",
    source_of_truth_level: "official_view_dataset",
    url: "https://data.cityofnewyork.us/City-Government/Current-Solicitations/3khw-qi8f",
    api_url: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
    connector_method: "socrata_json",
    notes: "Open Data view based on City Record Online for current OCP solicitations.",
  },
  {
    id: "passport-public",
    name: "PASSPort Public",
    category: "public_portal",
    jurisdiction: "NYC",
    source_of_truth_level: "official_transparency_portal",
    url: "https://a0333-passportpublic.nyc.gov/",
    api_url: null,
    connector_method: "deep_link_manual_review",
    notes:
      "Public transparency portal for PASSPort contract, vendor, and solicitation data. Use deep links and official data descriptions; avoid brittle scraping unless approved.",
  },
  {
    id: "passport-procurement-navigator",
    name: "NYC Procurement Navigator",
    category: "public_portal",
    jurisdiction: "NYC",
    source_of_truth_level: "official_opportunity_search",
    url: "https://passport.cityofnewyork.us/page.aspx/en/rfp/request_browse_public",
    api_url: null,
    connector_method: "deep_link_manual_review",
    notes:
      "Public search page for NYC RFx opportunities. Users must log into PASSPort to download/respond where required.",
  },
  {
    id: "checkbook-nyc-contracts",
    name: "Checkbook NYC — Contracts API",
    category: "public_api",
    jurisdiction: "NYC",
    source_of_truth_level: "official_financial_transparency_api",
    url: "https://www.checkbooknyc.com/contract-api",
    api_url: "https://www.checkbooknyc.com/api",
    connector_method: "xml_post",
    notes: "Useful for contracts/awards/vendor intelligence, not live bid submission.",
  },
  {
    id: "nyscr",
    name: "NYS Contract Reporter",
    category: "official_portal",
    jurisdiction: "NY State",
    source_of_truth_level: "official_bid_portal",
    url: "https://www.nyscr.ny.gov/Home/Contracts",
    api_url: null,
    connector_method: "email_alerts_manual_deep_link",
    notes:
      "Official NYS procurement activity portal. Registration is required for resources and e-alerts. Treat as email/manual connector first.",
  },
  {
    id: "mta-current-opportunities",
    name: "MTA Current Procurement Solicitations",
    category: "official_portal",
    jurisdiction: "NY Metro",
    source_of_truth_level: "official_opportunity_page",
    url: "https://www.mta.info/doing-business-with-us/procurement/current-opportunities",
    api_url: null,
    connector_method: "official_link_email_manual",
    notes:
      "MTA states posted solicitations are not substitutes for official MTA bid documents.",
  },
  {
    id: "mta-cd-current-opportunities",
    name: "MTA C&D Contracting — Current Opportunities",
    category: "official_portal",
    jurisdiction: "NY Metro",
    source_of_truth_level: "official_opportunity_page",
    url: "https://www.mta.info/agency/construction-and-development/contracting/current-opportunities",
    api_url: null,
    connector_method: "official_link_email_manual",
    notes:
      "Use for C&D construction opportunities and NYSDOL certificate compliance messaging.",
  },
  {
    id: "panynj-construction",
    name: "PANYNJ Construction Opportunities",
    category: "official_portal",
    jurisdiction: "NY/NJ",
    source_of_truth_level: "official_opportunity_page",
    url: "https://www.panynj.gov/port-authority/en/business-opportunities/solicitations-advertisements/Construction.html",
    api_url: null,
    connector_method: "official_link_bonfire_deep_link",
    notes: "Bid submissions are generally through PANYNJ Bonfire unless otherwise indicated.",
  },
  {
    id: "panynj-bonfire-open",
    name: "PANYNJ Bonfire Open Opportunities",
    category: "platform_portal",
    jurisdiction: "NY/NJ",
    source_of_truth_level: "submission_platform",
    url: "https://panynj.bonfirehub.com/portal/?tab=openOpportunities",
    api_url: null,
    connector_method: "deep_link_login_manual",
    notes: "Use as official platform deep link. Do not automate login/scrape.",
  },
  {
    id: "ddc-construction-contracts",
    name: "NYC DDC Construction Contracts",
    category: "official_portal",
    jurisdiction: "NYC",
    source_of_truth_level: "official_agency_page",
    url: "https://www.nyc.gov/site/ddc/contracts/construction-contracts.page",
    api_url: null,
    connector_method: "official_link_manual",
    notes:
      "DDC construction solicitations are released through PASSPort; use DDC for bid results, awards, and future opportunity context.",
  },
  {
    id: "dasny-rfps-bids",
    name: "DASNY RFPs, RFIs & Bids",
    category: "official_portal",
    jurisdiction: "NY State",
    source_of_truth_level: "official_opportunity_page",
    url: "https://www.dasny.org/opportunities/rfps-bids",
    api_url: null,
    connector_method: "official_link_bidexpress_manual",
    notes:
      "DASNY identifies opportunities using Bid Express in the Notice to Bidders when applicable.",
  },
  {
    id: "bidexpress",
    name: "Bid Express / BidX",
    category: "platform_portal",
    jurisdiction: "multi_state",
    source_of_truth_level: "submission_platform",
    url: "https://www.bidexpress.com/",
    api_url: null,
    connector_method: "deep_link_manual_export",
    notes: "Fee-based bidding platform. Use deep links and user exports, not unauthorized scraping.",
  },
];

export const signalForgeRegistry = civicBidSources;

export function getSourceById(id: string): CivicBidSource | undefined {
  return civicBidSources.find((source) => source.id === id);
}

/** Access friction implied by how a source can be consumed. */
export type FrictionSeverity = "low" | "medium" | "high";

export function sourceFriction(source: CivicBidSource): FrictionSeverity {
  if (source.category === "public_api") return "low";
  if (
    source.connector_method === "deep_link_login_manual" ||
    source.connector_method === "deep_link_manual_export" ||
    source.category === "platform_portal"
  ) {
    return "high";
  }
  return "medium";
}
