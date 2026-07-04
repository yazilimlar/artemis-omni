/**
 * Time Atlas — georeferencing anchors for the Troy diorama.
 *
 * The V1 scene is a stylized, compressed diorama — NOT a survey-accurate
 * terrain. These anchors record the real-world coordinates each scene
 * feature stands for, so a later version can bind the diorama to KML/GeoJSON
 * ground truth (and so exported overlays can be draped on real terrain).
 *
 * Scene convention: x = east-ish, z = south-ish, y = up. One scene unit
 * is *roughly* SCENE_METERS_PER_UNIT meters at the citadel, but distances
 * are intentionally compressed toward the edges for composition.
 */

export interface KmlAnchor {
  id: string;
  name: string;
  /** WGS84 decimal degrees. */
  lat: number;
  lon: number;
  /** Where this feature sits in the stylized scene ([x, z]); null = off-frame. */
  scene: [number, number] | null;
  note: string;
}

/** Nominal scale at the citadel (heavily compressed away from it). */
export const SCENE_METERS_PER_UNIT = 55;

/** Scene origin = summit of Hisarlık mound. */
export const SCENE_ORIGIN = { lat: 39.9575, lon: 26.2389 };

export const KML_ANCHORS: KmlAnchor[] = [
  {
    id: "hisarlik",
    name: "Hisarlık mound (Troy citadel)",
    lat: 39.9575,
    lon: 26.2389,
    scene: [0, 0],
    note: "Scene origin. Citadel plateau and Athena sanctuary.",
  },
  {
    id: "lower-town",
    name: "Lower town plateau",
    lat: 39.9557,
    lon: 26.2401,
    scene: [6, -0.5],
    note: "South of the mound; Bronze Age lower city footprint.",
  },
  {
    id: "spring-cave",
    name: "KASKAL.KUR spring cave",
    lat: 39.9566,
    lon: 26.2363,
    scene: [-4.5, -3],
    note: "Rock-cut water cave at the western foot of the mound.",
  },
  {
    id: "scamander",
    name: "Scamander / Karamenderes river",
    lat: 39.955,
    lon: 26.21,
    scene: [-3, 7],
    note: "Stylized: the river is pulled close to the mound for composition.",
  },
  {
    id: "besik-bay",
    name: "Beşik Bay (harbor)",
    lat: 39.9245,
    lon: 26.1697,
    scene: [-14, -7],
    note: "Aegean-coast anchorage; stylized onto the NW shore of the diorama.",
  },
  {
    id: "dardanelles",
    name: "Dardanelles strait",
    lat: 40.012,
    lon: 26.2,
    scene: [-12, -18],
    note: "The strait band across the top of the frame.",
  },
  {
    id: "kumkale-plain",
    name: "Trojan plain (silted ancient bay)",
    lat: 39.985,
    lon: 26.2,
    scene: [-8, -10],
    note: "In 600 BC partially open water/marsh; fully silted by 2026.",
  },
  {
    id: "mount-ida",
    name: "Mount Ida (Kaz Dağı) summit",
    lat: 39.7,
    lon: 26.85,
    scene: [24, -14],
    note: "~60 km SE in reality; rendered as the hazy backdrop ridge.",
  },
  {
    id: "imbros",
    name: "Imbros (Gökçeada)",
    lat: 40.16,
    lon: 25.85,
    scene: [-24, -16],
    note: "Island silhouette across the strait, upper-left.",
  },
  {
    id: "samothrace",
    name: "Samothrace peak",
    lat: 40.45,
    lon: 25.6,
    scene: [-26, -30],
    note: "Iliad 13.12 — Poseidon watches the battle from here. Far haze peak.",
  },
];

/**
 * Approximate equirectangular projection around SCENE_ORIGIN → meters.
 * Useful for future KML binding; NOT used to place V1 scene objects.
 */
export function latLonToMeters(lat: number, lon: number): { east: number; north: number } {
  const R = 6371000;
  const dLat = ((lat - SCENE_ORIGIN.lat) * Math.PI) / 180;
  const dLon = ((lon - SCENE_ORIGIN.lon) * Math.PI) / 180;
  const cosLat = Math.cos((SCENE_ORIGIN.lat * Math.PI) / 180);
  return { east: R * dLon * cosLat, north: R * dLat };
}
