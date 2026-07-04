import type { LayerId } from "./layers";

/**
 * Time Atlas — points of interest for Archaic Ilion (c. 600 BC).
 * Positions are scene-local coordinates (see data/troy/kmlAnchors.ts for the
 * real-world georeferencing scheme). Confidence + evidence text is deliberately
 * conservative: this is a communication product, not a citation database (V1).
 */

export type Confidence = "attested" | "probable" | "conjectural";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  attested: "Attested",
  probable: "Probable",
  conjectural: "Conjectural",
};

export interface Poi {
  id: string;
  name: string;
  /** [x, y, z] in scene units; y is an offset above sampled terrain height. */
  position: [number, number, number];
  layers: LayerId[];
  confidence: Confidence;
  summary: string;
  /** Short evidence snippet shown as a quote block on the card. */
  evidence: string;
  /** Source note — the kind of source, not a formal citation (V1). */
  source: string;
}

export const POIS: Poi[] = [
  {
    id: "citadel-gate",
    name: "South-East Gate",
    position: [3.9, 1.2, -0.9],
    layers: ["defense", "trade"],
    confidence: "attested",
    summary:
      "The main way up the mound, threading through gate works first raised in the Bronze Age and still standing in 600 BC.",
    evidence:
      "Troy VI gate structures (notably the south gate VIU) survived as visible, reused architecture into the first millennium BC.",
    source: "Excavation reports, Troy VI fortification system (Blegen; Korfmann).",
  },
  {
    id: "athena-sanctuary",
    name: "Sanctuary of Athena Ilias",
    position: [0.8, 1.4, -1.5],
    layers: ["religion"],
    confidence: "probable",
    summary:
      "An open-air sanctuary with an altar and early temple on the highest terrace — the cult that made Ilion famous long before the marble Hellenistic temple.",
    evidence:
      "Archaic votives and cult activity are documented on the mound; the monumental temple visible in ruins today is later (Hellenistic–Roman).",
    source: "Sanctuary finds & literary tradition (Herodotus 7.43 on Xerxes' sacrifice).",
  },
  {
    id: "bronze-walls",
    name: "Bronze Age Walls",
    position: [-1.6, 1.0, 3.8],
    layers: ["defense"],
    confidence: "attested",
    summary:
      "Sloping limestone walls of Troy VI, six centuries old by this date — the ruins that convinced visitors this really was Homer's city.",
    evidence:
      "The Troy VI circuit (with its characteristic batter and offsets) remained exposed and partially reused by later settlements.",
    source: "Standing remains, Hisarlık; excavation documentation since Schliemann.",
  },
  {
    id: "lower-town",
    name: "Lower Settlement",
    position: [6.0, 0.8, -0.5],
    layers: ["trade", "agriculture"],
    confidence: "probable",
    summary:
      "Houses, workshops and animal pens below the mound. Archaic Ilion was small — a village living inside a legend.",
    evidence:
      "Geophysical survey shows a large defended lower town in the Bronze Age; first-millennium occupation below the mound is thinner but present.",
    source: "Magnetometer surveys & trial trenches (Korfmann-era project).",
  },
  {
    id: "west-sanctuary",
    name: "West Sanctuary",
    position: [-5.0, 0.9, 2.0],
    layers: ["religion"],
    confidence: "attested",
    summary:
      "A cluster of small cult buildings and altars at the mound's south-west foot, in continuous use through the Archaic period.",
    evidence:
      "Excavated sanctuary complex with Archaic-period altars, cult buildings and votive deposits.",
    source: "West Sanctuary excavations (Troia Project publications).",
  },
  {
    id: "spring-cave",
    name: "Spring Cave",
    position: [-4.5, 0.7, -3.0],
    layers: ["water"],
    confidence: "attested",
    summary:
      "An artificial water cave cut deep into the rock west of the citadel — feeding the city since the Bronze Age.",
    evidence:
      "The rock-cut KASKAL.KUR spring cave is physically preserved and matches a water feature named in the Hittite Alaksandu treaty.",
    source: "Excavated feature; Hittite treaty text (CTH 76).",
  },
  {
    id: "scamander-farms",
    name: "Scamander Field Systems",
    position: [-4.5, 0.6, 9.5],
    layers: ["agriculture", "water"],
    confidence: "conjectural",
    summary:
      "Grain plots, olives and grazing along the river — the plain, not the walls, is what kept Ilion alive in 600 BC.",
    evidence:
      "No Archaic field boundaries survive; layout here follows the floodplain soils, the river course and later land-use patterns.",
    source: "Environmental & geomorphological studies of the Troad plain.",
  },
  {
    id: "harbor-cove",
    name: "Harbor Cove",
    position: [-11.5, 0.8, -3.4],
    layers: ["trade", "water"],
    confidence: "probable",
    summary:
      "A working beach-harbor: ships drawn up on the sand, a timber jetty, storerooms — the gateway for Aegean trade and Dardanelles traffic.",
    evidence:
      "Beşik Bay served as the region's anchorage; coring shows the ancient bay below the citadel silting through antiquity.",
    source: "Beşik Bay excavations; paleogeography of the Trojan plain (Kraft et al.).",
  },
  {
    id: "strait-anchorage",
    name: "Dardanelles Anchorage",
    position: [-12.0, 0.4, -18.0],
    layers: ["trade", "water"],
    confidence: "probable",
    summary:
      "Ships wait here for a fair wind against the strait's stiff current — a delay economy Ilion could feed and tax.",
    evidence:
      "Sailing against the Hellespont's wind and current forced waiting anchorages; the pattern is documented for antiquity broadly.",
    source: "Ancient sailing conditions of the Hellespont (historical geography).",
  },
  {
    id: "ridge-road",
    name: "Inland Ridge Road",
    position: [10.0, 0.8, 4.0],
    layers: ["trade"],
    confidence: "conjectural",
    summary:
      "The overland track south toward the Ida foothills and inland Troad — timber, flocks and travelers moving to and from the coast.",
    evidence:
      "No Archaic road surface is excavated; the line follows natural ridge movement corridors used in later periods.",
    source: "Topographic inference; later Roman road network of the Troad.",
  },
];

export const POI_BY_ID: Record<string, Poi> = Object.fromEntries(
  POIS.map((poi) => [poi.id, poi]),
);
