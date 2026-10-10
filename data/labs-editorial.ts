import {
  Calculator,
  Crown,
  Gamepad2,
  Globe2,
  Landmark,
  Map as MapIcon,
  Sparkles,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { StatusTone } from "@/data/proofLibrary";

/**
 * Editorial overlay for /labs. Registry facts (lifecycle, visibility, routes)
 * live in ENGINEERING/PRODUCT_REGISTRY.yaml; this file holds the reviewed
 * narrative for each lab. `registryId: null` marks editorial-only content that
 * has no registry entry yet.
 *
 * `category` is the visitor-facing taxonomy for the labs index. It is optional
 * so older branches that add entries without it still typecheck; uncategorized
 * entries fall back to "explorations" (see labCategory()).
 */
export type LabCategory = "construction" | "controls" | "bid" | "brand" | "explorations";

export const labCategoryMeta: Record<LabCategory, { label: string; blurb: string }> = {
  construction: {
    label: "Construction Intelligence",
    blurb: "Flagship proofs: utility, mechanical, and sewer bridges plus the simulators that argue Artemis is an implementation system.",
  },
  controls: {
    label: "Project Controls & Finance",
    blurb: "Estimating tools, finance architecture, and decision-system prototypes.",
  },
  bid: {
    label: "Bid & Procurement",
    blurb: "Bidroom and procurement intelligence surfaces.",
  },
  brand: {
    label: "Brand & Experience",
    blurb: "The executive-grade visual language: Diana, the emblem system, and experience direction.",
  },
  explorations: {
    label: "Explorations",
    blurb: "Playgrounds, atlases, and art demos. Lighter fare, honestly labeled.",
  },
};

export const labCategoryOrder: LabCategory[] = [
  "construction",
  "controls",
  "bid",
  "brand",
  "explorations",
];

export type LabEditorial = {
  registryId: string | null;
  title: string;
  eyebrow: string;
  href: string;
  statusLabel: string;
  statusTone: StatusTone;
  Icon: LucideIcon;
  accentIcon: LucideIcon;
  description: string;
  signals: string[];
  commercialPath: string;
  boundary: string;
  category?: LabCategory;
  /** Pinned to the flagship strip at the top of the labs index. */
  flagship?: boolean;
  /** Collapsed variant links (e.g. LEGO editions) rendered inside one card. */
  editions?: { label: string; href: string }[];
};

export function labCategory(entry: LabEditorial): LabCategory {
  return entry.category ?? "explorations";
}

export const labsEditorial: LabEditorial[] = [
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "Utility Intelligence Bridge",
    eyebrow: "Construction Intelligence",
    href: "/labs/utility-intelligence-bridge",
    statusLabel: "RC8.2",
    statusTone: "test",
    Icon: Zap,
    accentIcon: Landmark,
    description:
      "The public utility construction-intelligence bridge: a 3D model view with an Actuals & Claims demo studio — deterministic datasets, reconciliation checks, and source-labeled imports.",
    signals: ["3D model view", "Actuals & Claims studio", "Source-labeled data", "CSV/JSON import-export"],
    commercialPath:
      "Best pilot path: utility project-controls reviews, actuals-vs-forecast reconciliation workshops, and executive program briefings.",
    boundary:
      "Demonstration build with synthetic and illustrative data. It is not a system of record, a bid, or engineering advice.",
    category: "construction",
    flagship: true,
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "HVAC Mechanical Intelligence Bridge",
    eyebrow: "Construction Intelligence",
    href: "/labs/hvac-mechanical-intelligence-bridge",
    statusLabel: "RC8.11",
    statusTone: "test",
    Icon: Wind,
    accentIcon: Landmark,
    description:
      "A full-screen 3D exploded rooftop-unit System Lab for mechanical construction intelligence: equipment anatomy, system relationships, and reviewable engineering views.",
    signals: ["Exploded 3D rooftop unit", "System Lab views", "Reviewable diagrams"],
    commercialPath:
      "Best pilot path: mechanical precon reviews, equipment submittal walkthroughs, and field-lead training.",
    boundary:
      "Demonstration build with illustrative data. It is not a submittal, a bid, or engineering advice.",
    category: "construction",
    flagship: true,
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "Sewer Utility Intelligence Bridge",
    eyebrow: "Construction Intelligence",
    href: "/labs/sewer-utility-intelligence-bridge",
    statusLabel: "v1",
    statusTone: "test",
    Icon: Waves,
    accentIcon: Landmark,
    description:
      "The sewer utility intelligence lab: an exploded 3D segment view with hydraulics and HGL analysis, pump-station electrical checks, compatibility checks, and a 24-hour flow duty view.",
    signals: ["Exploded 3D segment", "Hydraulics + HGL", "Compatibility checks", "24-h flow duty"],
    commercialPath:
      "Best pilot path: utility program reviews, hydraulics workshops, and operator training briefings.",
    boundary:
      "Demonstration build with illustrative data. It is not a design, a bid, or engineering advice.",
    category: "construction",
    flagship: true,
  },
  {
    registryId: "diana-moonshot",
    title: "Diana Moonshot",
    eyebrow: "Brand Experience",
    href: "/labs/diana-moonshot",
    statusLabel: "Interactive 3D",
    statusTone: "test",
    Icon: Sparkles,
    accentIcon: Crown,
    description:
      "The Artemis brand-experience lab, now with the interactive Diana 3D demonstrator: orbit the archer mark, switch camera angles, and feel the executive-grade visual language.",
    signals: ["Interactive 3D demonstrator", "Camera presets", "Brand system"],
    commercialPath:
      "Best pilot path: executive brand reviews, keynote visuals, and experience-direction sign-off.",
    boundary:
      "A brand-experience proof. It is not a product line or current product-capability evidence.",
    category: "brand",
  },
  {
    registryId: "geometric-workbench",
    title: "ARTEMIS Geometric Workbench",
    eyebrow: "Geometry / Fabrication Intelligence",
    href: "/labs/geometric-workbench/v5-8",
    statusLabel: "v6 Alpha",
    statusTone: "test",
    Icon: Globe2,
    accentIcon: Landmark,
    description:
      "An interactive geometric-design environment for topology validation, constructor configuration, configuration fingerprints, and preliminary fabrication and BOM intelligence.",
    signals: ["Three.js", "Topology validation", "Configuration fingerprints", "Preliminary BOM"],
    commercialPath:
      "Best pilot path: geometric design studies, geometry education, fabrication-feasibility exploration, and qualified professional project review.",
    boundary:
      "All fabrication, quantity, connection, material, and BOM outputs are preliminary and require qualified engineering and fabrication review before construction or manufacturing.",
    category: "construction",
  },
  {
    registryId: "tax-architecture-2026",
    title: "1040 Finance Architecture",
    eyebrow: "Finance Architecture",
    href: "/labs/tax-architecture-2026",
    statusLabel: "Standalone prototype",
    statusTone: "test",
    Icon: Calculator,
    accentIcon: Landmark,
    description:
      "A WebGL 3D model for teaching the 2026 individual tax structure as a finance architecture: income foundation, deductions, taxable core, credits, payments, scenarios, export, and print review.",
    signals: ["Three.js", "Scenario controls", "CSV export", "Print review"],
    commercialPath:
      "Best pilot path: executive education, scenario workshops, creator-led finance storytelling, and advisory intake.",
    boundary:
      "Educational prototype only. It is not tax advice, filing software, or a replacement for professional review.",
    category: "controls",
  },
  {
    registryId: "turkiye-atlas",
    title: "ARTEMIS Turkiye Atlas",
    eyebrow: "Atlas / Cultural Routes",
    href: "/labs/turkiye-atlas",
    statusLabel: "Standalone prototype",
    statusTone: "test",
    Icon: MapIcon,
    accentIcon: Globe2,
    description:
      "An interactive atlas for regional storytelling, route planning, cultural discovery, commercial layers, partner CRM concepts, dataset diagnostics, and map-engine fallback testing.",
    signals: ["Mapbox", "MapLibre", "Leaflet fallback", "Growth studio"],
    commercialPath:
      "Best pilot path: tourism campaigns, local partner discovery, itinerary products, sponsorship packages, and destination intelligence.",
    boundary:
      "Contains a public Mapbox pk token that must remain URL-restricted before stronger public promotion.",
    category: "explorations",
  },
  {
    registryId: "time-atlas-troy",
    title: "Artemis Time Atlas: Troy",
    eyebrow: "KML / Archaeology Engine",
    href: "/labs/troy-time-atlas",
    statusLabel: "Public lab",
    statusTone: "test",
    Icon: Landmark,
    accentIcon: MapIcon,
    description:
      "A KML-driven 3D Time Atlas diorama of Archaic Ilion, with evidence-graded POIs, downloadable Google Earth source data, story mode, scholar controls, animated ships, caravan life, and scroll-driven ghost eras.",
    signals: ["Runtime KML parser", "Story mode", "Scholar view", "Scene life"],
    commercialPath:
      "Best pilot path: history education embeds, archaeology-tech social clips, museum/tour-guide storytelling, classroom modules, and future paid site/era packs.",
    boundary:
      "Evidence-graded public prototype only. Coordinates are research anchors in a compressed diorama, not a survey-grade GIS reconstruction or official archaeological map.",
    category: "explorations",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "George Aegean Quest",
    eyebrow: "iPhone Atlas Game",
    href: "/labs/george-aegean-quest",
    statusLabel: "iPhone game",
    statusTone: "test",
    Icon: Gamepad2,
    accentIcon: Crown,
    description:
      "A super-simplified iPhone-first Atlas game starring George, with dynamic destination world scenes, a cartography-lineage Aegean projection board, an expanded character roster, route sorting, undo, and a richer Troy Time Atlas KML layer.",
    signals: ["George guide", "Cartography board", "Expanded roster", "Richer Troy KML"],
    commercialPath:
      "Best pilot path: character-led destination quests, sponsored route packs, mobile itinerary funnels, and premium cultural game tours.",
    boundary:
      "This is a lightweight standalone iPhone game prototype with approximate lon/lat projection. It is not a full GIS dataset, navigation product, or production booking engine.",
    category: "explorations",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "NYC Sewer Construction Simulator",
    eyebrow: "Construction Simulation",
    href: "/labs/nyc-sewer-simulator",
    statusLabel: "v0.19",
    statusTone: "test",
    Icon: Calculator,
    accentIcon: Landmark,
    description:
      "A 3D construction intelligence simulator for NYC sewer work: what-if controls, schedule and cost views, day/night themes, and a printable report mode.",
    signals: ["Three.js 3D viewer", "What-if controls", "Printable report", "Day/night themes"],
    commercialPath:
      "Best pilot path: precon scenario workshops, bid strategy reviews, and executive briefing demos.",
    boundary:
      "Demonstration model with illustrative data. It is not a bid, a schedule of record, or engineering advice.",
    category: "construction",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "DEP Sewer Bridge \u2014 QA Capture Studio",
    eyebrow: "Utility Intelligence",
    href: "/labs/utility-intelligence-bridge/qa-capture-studio",
    statusLabel: "RC7",
    statusTone: "test",
    Icon: MapIcon,
    accentIcon: Globe2,
    description:
      "The RC7 publication QA and capture studio for the DEP Sewer Utility Intelligence Bridge: a three-preset cockpit with Leaflet GIS and a printable screenshot deck for publication review.",
    signals: ["Leaflet GIS", "Printable screenshot deck", "Visual presets", "QA review"],
    commercialPath:
      "Best pilot path: publication QA reviews, stakeholder screenshot decks, and utility program briefings.",
    boundary:
      "QA and capture tooling with illustrative data. Visual presets change presentation only; quantity, schedule, and cost logic are untouched.",
    category: "construction",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    // The five LEGO editions are collapsed into one card; variants link out from inside.
    registryId: null,
    title: "LEGO Build Studio",
    eyebrow: "Art / Demo",
    href: "/labs/lego-build-studio",
    statusLabel: "5 editions",
    statusTone: "test",
    Icon: Gamepad2,
    accentIcon: Landmark,
    description:
      "An animated brick-by-brick construction studio: world monuments rebuilt in Three.js across 10 color palettes, with timeline scrubbing, a live BOM view, generative music modes, and a Fourier-epicycles ARTEMIS inscription.",
    signals: ["Three.js animation", "10 monuments", "10 palettes", "Live BOM"],
    commercialPath:
      "Best pilot path: public engagement demos, education and outreach, and visual storytelling showcases.",
    boundary:
      "Artistic demonstration with illustrative geometry and generative audio. It is not a LEGO product, a construction model, or engineering advice.",
    category: "explorations",
    editions: [
      { label: "v1", href: "/labs/lego-build-studio" },
      { label: "Music v5.0", href: "/labs/lego-build-studio-music" },
      { label: "Artemis v5.0", href: "/labs/lego-build-studio-artemis" },
      { label: "Ultimate v5.0", href: "/labs/lego-build-studio-ultimate" },
      { label: "Artemis Music", href: "/labs/lego-build-studio-artemis-music" },
    ],
  },
];
