import type { CivicBidOpportunity } from "./normalizeOpportunity";
import { civicBidSources, sourceFriction, type FrictionSeverity } from "./sourceRegistry";

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Sample opportunities used when live public feeds are unreachable.
 * Synthetic records modeled on real NYC-area agencies and procurement shapes —
 * not real solicitations.
 */
export function getSampleOpportunities(): CivicBidOpportunity[] {
  const retrievedAt = new Date().toISOString();
  return [
    {
      id: "SF-SAMPLE-001",
      title: "Reconstruction of Sanitary and Storm Sewers — Bronx CB 9",
      agency: "NYC Dept. of Design & Construction",
      sourceName: "Sample Data (modeled on City Record)",
      sourceUrl: "https://a856-cityrecord.nyc.gov/",
      jurisdiction: "NYC",
      category: "Construction / Public Works",
      publishedDate: daysFromNow(-9),
      dueDate: daysFromNow(6),
      procurementMethod: "Competitive Sealed Bid",
      description:
        "Reconstruction of combined sewers, water mains, and full-width roadway restoration across a Bronx capital corridor.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-002",
      title: "Station Accessibility Upgrades — Package 4 (Elevators, 3 Stations)",
      agency: "MTA Construction & Development",
      sourceName: "Sample Data (modeled on MTA C&D)",
      sourceUrl: "https://www.mta.info/agency/construction-and-development",
      jurisdiction: "NY Metro",
      category: "Construction / Transit",
      publishedDate: daysFromNow(-14),
      dueDate: daysFromNow(12),
      procurementMethod: "Design-Build",
      description:
        "ADA accessibility package covering three stations: new elevators, platform edge remediation, and communications upgrades.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-003",
      title: "Rehabilitation of Runway 4L-22R Taxiway Connectors",
      agency: "Port Authority of NY & NJ",
      sourceName: "Sample Data (modeled on PANYNJ Bonfire)",
      sourceUrl: "https://panynj.bonfirehub.com/",
      jurisdiction: "NY/NJ",
      category: "Construction / Aviation",
      publishedDate: daysFromNow(-6),
      dueDate: daysFromNow(21),
      procurementMethod: "Competitive Sealed Bid",
      description:
        "Pavement rehabilitation, lighting, and drainage improvements for taxiway connectors; phased night work.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-004",
      title: "SUNY Campus Science Building — Mechanical Upgrade Phase II",
      agency: "DASNY",
      sourceName: "Sample Data (modeled on DASNY)",
      sourceUrl: "https://www.dasny.org/opportunities/rfps-bids",
      jurisdiction: "NY State",
      category: "Construction / Higher Education",
      publishedDate: daysFromNow(-20),
      dueDate: daysFromNow(34),
      procurementMethod: "Competitive Sealed Bid",
      description:
        "HVAC replacement, controls modernization, and lab exhaust rebalancing in an occupied science facility.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-005",
      title: "Citywide Requirements Contract — Emergency Roof Repairs",
      agency: "NYC Housing Authority",
      sourceName: "Sample Data (modeled on PASSPort)",
      sourceUrl: "https://passport.cityofnewyork.us/",
      jurisdiction: "NYC",
      category: "Construction / Housing",
      publishedDate: daysFromNow(-4),
      dueDate: daysFromNow(9),
      procurementMethod: "Requirements Contract",
      description:
        "On-call emergency roofing repairs across multiple developments; prevailing wage and Section 3 requirements apply.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-006",
      title: "Water Main Replacement — Queens Trunk Segment 7",
      agency: "NYC Dept. of Environmental Protection",
      sourceName: "Sample Data (modeled on City Record)",
      sourceUrl: "https://a856-cityrecord.nyc.gov/",
      jurisdiction: "NYC",
      category: "Construction / Water Infrastructure",
      publishedDate: daysFromNow(-30),
      dueDate: daysFromNow(48),
      procurementMethod: "Competitive Sealed Bid",
      description:
        "Trunk water main replacement with extensive maintenance-of-traffic and utility interference coordination.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-007",
      title: "School Addition & Retrofit — District 27 (PS/IS Campus)",
      agency: "NYC School Construction Authority",
      sourceName: "Sample Data (modeled on SCA solicitations)",
      sourceUrl: "https://www.nycsca.org/",
      jurisdiction: "NYC",
      category: "Construction / Education",
      publishedDate: daysFromNow(-11),
      dueDate: null,
      procurementMethod: null,
      description:
        "Pre-solicitation notice for a classroom addition and code retrofit; RFP anticipated next quarter.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
    {
      id: "SF-SAMPLE-008",
      title: "Professional Services — Resident Engineering Inspection, Borough-Wide",
      agency: "NYS Contract Reporter (multi-agency)",
      sourceName: "Sample Data (modeled on NYSCR)",
      sourceUrl: "https://www.nyscr.ny.gov/",
      jurisdiction: "NY State",
      category: "Professional Services / Engineering",
      publishedDate: daysFromNow(-2),
      dueDate: daysFromNow(27),
      procurementMethod: "RFP — Best Value",
      description:
        "Resident engineering inspection services supporting capital construction; MWBE participation goals apply.",
      sourceConfidence: "sample_data",
      retrievedAt,
    },
  ];
}

export type SourceHealthStatus = "live" | "reachable" | "manual";

export interface SourceHealth {
  sourceId: string;
  status: SourceHealthStatus;
  detail: string;
}

/** Static health snapshot: which sources the Forge can poll vs. deep-link. */
export const sourceHealthSnapshot: SourceHealth[] = [
  {
    sourceId: "nyc-open-data-current-solicitations",
    status: "live",
    detail: "Socrata JSON endpoint polled by this page",
  },
  {
    sourceId: "nyc-open-data-city-record",
    status: "live",
    detail: "Socrata JSON endpoint available for notice history",
  },
  {
    sourceId: "checkbook-nyc-contracts",
    status: "reachable",
    detail: "XML POST API — awards/vendor intelligence (not wired in this variant)",
  },
];

export interface FrictionFlag {
  sourceId: string;
  severity: FrictionSeverity;
  label: string;
  description: string;
}

const FRICTION_LABELS: Record<FrictionSeverity, string> = {
  low: "Public API — automatable",
  medium: "Official page — deep link + manual review",
  high: "Login / commercial platform — human-in-the-loop only",
};

const FRICTION_DESCRIPTIONS: Record<FrictionSeverity, string> = {
  low: "Open dataset with a documented endpoint. Safe to poll on a schedule with caching.",
  medium:
    "Authoritative page without a public API. Use official deep links and human review; no brittle scraping.",
  high:
    "Requires an account or paid platform. Users act directly on the platform; the Forge only tracks status.",
};

export const frictionFlags: FrictionFlag[] = civicBidSources.map((source) => {
  const severity = sourceFriction(source);
  return {
    sourceId: source.id,
    severity,
    label: FRICTION_LABELS[severity],
    description: FRICTION_DESCRIPTIONS[severity],
  };
});
