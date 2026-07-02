export interface KmlAnchor {
  id: string;
  label: string;
  status: "verified" | "provisional" | "placeholder";
  coordinates: [number, number];
  note: string;
}

export const kmlAnchors: KmlAnchor[] = [
  {
    id: "hisarlik",
    label: "Hisarlik mound",
    status: "provisional",
    coordinates: [26.238889, 39.9575],
    note: "Anchor for the fixed terrain thesis; requires final GIS verification before a research release.",
  },
  {
    id: "dardanelles",
    label: "Dardanelles reference",
    status: "provisional",
    coordinates: [26.195, 40.01],
    note: "Regional maritime orientation marker, not a surveyed ancient shoreline.",
  },
  {
    id: "scamander",
    label: "Scamander plain",
    status: "placeholder",
    coordinates: [26.2, 39.97],
    note: "Hydrology is simplified until historical channel research is complete.",
  },
];
