/**
 * ArtemisIX — module taxonomy.
 *
 * Defines the dimensional ladder and departments, plus the override map that
 * classifies each bundled demonstrator app. The registry (server) uses
 * `classify()` to assign a dimension + department + module code to every file
 * it discovers in public/artemisix/apps — known files use the override map,
 * unknown files are auto-classified by keyword inference so the catalogue
 * maintains itself as new apps are dropped in.
 *
 * Client-safe: no server or runtime imports.
 */

export interface Dimension {
  code: string; // e.g. "D3"
  name: string;
  blurb: string;
}

export interface Department {
  code: string; // e.g. "CON"
  name: string;
  blurb: string;
  accent: string; // tailwind text color class
}

export const dimensions: Dimension[] = [
  { code: "D2", name: "Documentation", blurb: "Drawings, dimensioned shop cards, print-safe output." },
  { code: "D3", name: "Geometry", blurb: "Parametric 3D models and fabrication geometry." },
  { code: "D4", name: "Assembly", blurb: "Connectors, joinery, and sequence of erection." },
  { code: "D5", name: "Commercial", blurb: "BOM, takeoff, mass, and cost/forecast telemetry." },
  { code: "D6", name: "Geospatial", blurb: "Mapbox/satellite command atlases and GIS." },
  { code: "D7", name: "Identity", blurb: "Brand marks and cinematic identity systems." },
];

export const departments: Department[] = [
  { code: "CON", name: "Construct", blurb: "Fabrication & structural workbenches.", accent: "text-gold" },
  { code: "TWN", name: "Twin", blurb: "Geometry & digital-twin shells and domes.", accent: "text-blueprint" },
  { code: "ATL", name: "Atlas", blurb: "Geospatial command atlases.", accent: "text-emerald-400" },
  { code: "STU", name: "Studio", blurb: "Brand, identity & generative.", accent: "text-gold-soft" },
  { code: "CNX", name: "Connect", blurb: "Connectors & integration systems.", accent: "text-sky-400" },
];

export interface Classification {
  dimension: string; // dimension code
  department: string; // department code
  moduleName: string;
  moduleCode: string; // e.g. "CON-TB-69"
  summary: string;
}

/** Curated classification for the known bundled apps, keyed by file slug. */
export const overrides: Record<string, Classification> = {
  "table-workbench-v6-9": {
    dimension: "D3", department: "CON", moduleName: "Table Base Workbench — Node Topology",
    moduleCode: "CON-TB-69",
    summary: "Verified node-driven two-leg table base: rail pairs, double spine, constraint validation, BOM.",
  },
  "table-workbench-v6-11-gemini": {
    dimension: "D3", department: "CON", moduleName: "Table Base Workbench — Gemini Augmented",
    moduleCode: "CON-TB-611",
    summary: "Miter-augmented table base with multi-AI palette profiles and P_placement/skew/base/top parameters.",
  },
  "dowel-socket-connectors-v3-4": {
    dimension: "D4", department: "CNX", moduleName: "Dowel / Socket Connector System",
    moduleCode: "CNX-DS-34",
    summary: "Neo-classical dowel/socket joinery system with branded print-safe shop cards.",
  },
  "assembly-shop-cards-v3-6": {
    dimension: "D2", department: "CON", moduleName: "Assembly Labels & Dimensioned Shop Cards",
    moduleCode: "CON-SC-36",
    summary: "Dimensioned, labelled assembly shop cards for fabrication hand-off.",
  },
  "goldberg-geodesic-dome": {
    dimension: "D3", department: "TWN", moduleName: "Goldberg Geodesic Hex/Pent Dome",
    moduleCode: "TWN-GD-32",
    summary: "Goldberg geodesic hex/pent dome generator with branded print-safe shop cards.",
  },
  "solid-shell-dome-workbench-v1-6": {
    dimension: "D3", department: "TWN", moduleName: "Solid-Shell Dome Workbench",
    moduleCode: "TWN-SD-16",
    summary: "Fabrication solid-shell dome workbench with visual shop card output.",
  },
  "concrete-table-viewer": {
    dimension: "D3", department: "CON", moduleName: "Concrete Table — Design & Animation",
    moduleCode: "CON-CT-06",
    summary: "Advanced 3D concrete table design and animation viewer.",
  },
  "turkiye-atlas-v0-14-satellite": {
    dimension: "D6", department: "ATL", moduleName: "Türkiye Atlas — Clinical Satellite",
    moduleCode: "ATL-TR-14",
    summary: "Clinical Mapbox 3D satellite command atlas of Türkiye.",
  },
  "turkiye-atlas-v0-26-mapbox": {
    dimension: "D6", department: "ATL", moduleName: "Türkiye Atlas — Mapbox 3D",
    moduleCode: "ATL-TR-26M",
    summary: "Mapbox 3D-enabled interactive command atlas.",
  },
  "turkiye-atlas-v0-26-polished": {
    dimension: "D6", department: "ATL", moduleName: "Türkiye Atlas — Polished Interactive",
    moduleCode: "ATL-TR-26P",
    summary: "Polished interactive geospatial atlas with terrain and overlays.",
  },
  "brand-mark-3d": {
    dimension: "D7", department: "STU", moduleName: "ARTEMIS 3D Brand Mark",
    moduleCode: "STU-ID-01",
    summary: "Cinematic 3D brand mark — the Artemis archer, columns, and intelligence seal.",
  },
};

const DEPT_BY_KEYWORD: [RegExp, string][] = [
  [/atlas|mapbox|satellite|turkiye|gis|geo/i, "ATL"],
  [/dome|geodesic|goldberg|shell|twin/i, "TWN"],
  [/connector|dowel|socket|joint|connect/i, "CNX"],
  [/brand|identity|mark|logo|cinematic/i, "STU"],
  [/table|concrete|fabrication|workbench|beam|rail|truss/i, "CON"],
];

const DIM_BY_KEYWORD: [RegExp, string][] = [
  [/atlas|mapbox|satellite|geo/i, "D6"],
  [/brand|identity|mark|cinematic/i, "D7"],
  [/connector|dowel|socket|assembly-sequence/i, "D4"],
  [/shop-card|shop_card|label|drawing|dimensioned|blueprint/i, "D2"],
  [/bom|cost|takeoff|forecast|commercial/i, "D5"],
];

function titleCase(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Classify a discovered app slug — override first, else infer from keywords. */
export function classify(slug: string, title?: string): Classification {
  if (overrides[slug]) return overrides[slug];

  const hay = `${slug} ${title ?? ""}`;
  const department = DEPT_BY_KEYWORD.find(([re]) => re.test(hay))?.[1] ?? "CON";
  const dimension = DIM_BY_KEYWORD.find(([re]) => re.test(hay))?.[1] ?? "D3";
  const deptCode = department.slice(0, 3);
  const num = slug.replace(/\D/g, "").slice(-2) || "00";

  return {
    dimension,
    department,
    moduleName: title?.replace(/^ARTEMIS\s*[·—-]*\s*/i, "").slice(0, 60) || titleCase(slug),
    moduleCode: `${deptCode}-AUTO-${num}`,
    summary: title || titleCase(slug),
  };
}

export function getDimension(code: string): Dimension | undefined {
  return dimensions.find((d) => d.code === code);
}
export function getDepartment(code: string): Department | undefined {
  return departments.find((d) => d.code === code);
}
