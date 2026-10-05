import {
  Calculator,
  Crown,
  Gamepad2,
  Globe2,
  Landmark,
  Map as MapIcon,
  type LucideIcon,
} from "lucide-react";
import type { StatusTone } from "@/data/proofLibrary";

/**
 * Editorial overlay for /labs. Registry facts (lifecycle, visibility, routes)
 * live in ENGINEERING/PRODUCT_REGISTRY.yaml; this file holds the reviewed
 * narrative for each lab. `registryId: null` marks editorial-only content that
 * has no registry entry yet.
 */
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
};

export const labsEditorial: LabEditorial[] = [
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
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "LEGO Build Studio",
    eyebrow: "Art / Demo",
    href: "/labs/lego-build-studio",
    statusLabel: "v1",
    statusTone: "test",
    Icon: Gamepad2,
    accentIcon: Landmark,
    description:
      "An animated brick-by-brick construction studio: 9 world monuments rebuilt in Three.js across 10 color palettes, with timeline scrubbing, a live BOM view, and day/night orbit presentation.",
    signals: ["Three.js animation", "9 monuments", "10 palettes", "Live BOM"],
    commercialPath:
      "Best pilot path: public engagement demos, education and outreach, and visual storytelling showcases.",
    boundary:
      "Artistic demonstration with illustrative geometry. It is not a LEGO product, a construction model, or engineering advice.",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "LEGO Build Studio \u00b7 Music Edition",
    eyebrow: "Art / Demo",
    href: "/labs/lego-build-studio-music",
    statusLabel: "v5.0",
    statusTone: "test",
    Icon: Gamepad2,
    accentIcon: Landmark,
    description:
      "The music edition of the animated LEGO construction studio: 9 world monuments rebuilt brick-by-brick in Three.js across 10 color palettes, driven by a generative Web Audio music engine, with timeline scrubbing and a live BOM view.",
    signals: ["Generative Web Audio music", "Three.js animation", "9 monuments", "Live BOM"],
    commercialPath:
      "Best pilot path: public engagement demos, education and outreach, and visual storytelling showcases.",
    boundary:
      "Artistic demonstration with illustrative geometry and generative audio. It is not a LEGO product, a construction model, or engineering advice.",
  },
  {
    // Not in PRODUCT_REGISTRY.yaml yet; editorial-only until a registry entry exists.
    registryId: null,
    title: "LEGO Build Studio \u00b7 Artemis Edition",
    eyebrow: "Art / Demo",
    href: "/labs/lego-build-studio-artemis",
    statusLabel: "v5.0 Artemis",
    statusTone: "test",
    Icon: Gamepad2,
    accentIcon: Landmark,
    description:
      "The Artemis edition of the animated LEGO construction studio: 9 world monuments rebuilt brick-by-brick in Three.js with a generative Web Audio music engine, a Fourier-epicycles ARTEMIS inscription linking to artemis.agoraxai.com, a clean-view presentation mode, and a translucent studio UI.",
    signals: ["Fourier ARTEMIS inscription", "Generative Web Audio music", "Clean-view mode", "9 monuments"],
    commercialPath:
      "Best pilot path: public engagement demos, education and outreach, and visual storytelling showcases.",
    boundary:
      "Artistic demonstration with illustrative geometry and generative audio. It is not a LEGO product, a construction model, or engineering advice.",
  },
];
