import type { CivicBidOpportunity } from "@/types/civicbid";

function daysFromNow(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

/**
 * Synthetic fallback records for interface and scoring demonstrations.
 * These are not current solicitations and must always remain labeled as sample data.
 */
export function getSignalForgeSampleOpportunities(): CivicBidOpportunity[] {
  const retrievedAt = new Date().toISOString();

  return [
    {
      id: "CIVICBID-SAMPLE-001",
      title: "SAMPLE — Sewer and roadway reconstruction package",
      agency: "Synthetic NYC public works agency",
      sourceName: "CivicBid synthetic demonstration set",
      sourceUrl: null,
      apiUrl: null,
      jurisdiction: "NYC demonstration",
      category: "Construction / Public Works",
      publishedDate: daysFromNow(-8),
      dueDate: daysFromNow(6),
      procurementMethod: "Competitive sealed bid — sample",
      description:
        "Synthetic demonstration of sewer, water-main, utility coordination, roadway restoration, prevailing wage, bonding, and MWBE review signals.",
      sourceConfidence: "sample_data",
      recordMode: "sample",
      retrievedAt,
    },
    {
      id: "CIVICBID-SAMPLE-002",
      title: "SAMPLE — Transit station accessibility upgrades",
      agency: "Synthetic transit capital agency",
      sourceName: "CivicBid synthetic demonstration set",
      sourceUrl: null,
      apiUrl: null,
      jurisdiction: "NY metro demonstration",
      category: "Construction / Transit",
      publishedDate: daysFromNow(-12),
      dueDate: daysFromNow(14),
      procurementMethod: "Design-build — sample",
      description:
        "Synthetic accessibility package with elevators, platform work, electrical systems, insurance, bonding, and project-labor review signals.",
      sourceConfidence: "sample_data",
      recordMode: "sample",
      retrievedAt,
    },
    {
      id: "CIVICBID-SAMPLE-003",
      title: "SAMPLE — Water infrastructure rehabilitation",
      agency: "Synthetic environmental infrastructure agency",
      sourceName: "CivicBid synthetic demonstration set",
      sourceUrl: null,
      apiUrl: null,
      jurisdiction: "New York demonstration",
      category: "Construction / Water Infrastructure",
      publishedDate: daysFromNow(-4),
      dueDate: daysFromNow(31),
      procurementMethod: "Competitive sealed bid — sample",
      description:
        "Synthetic water-main rehabilitation scope with utility interference, maintenance of traffic, inspection, and prevailing-wage review signals.",
      sourceConfidence: "sample_data",
      recordMode: "sample",
      retrievedAt,
    },
  ];
}
