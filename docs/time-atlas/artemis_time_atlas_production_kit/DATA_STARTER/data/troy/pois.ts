import type { LayerId } from './layers';

export type ConfidenceLevel = 'High' | 'Medium' | 'Speculative' | 'Uncertain';

export type PoiCategory =
  | 'citadel'
  | 'religious'
  | 'gate'
  | 'harbor'
  | 'river'
  | 'natural'
  | 'agricultural'
  | 'settlement'
  | 'road';

export interface Poi {
  id: string;
  name: string;
  era: string;
  description: string;
  confidence: ConfidenceLevel;
  evidenceSnippet: string;
  sourceNote: string;
  coordinates: [number, number, number]; // longitude, latitude, approximate height
  scenePosition?: [number, number, number]; // local R3F coordinates, calculated or manually tuned
  layer: LayerId;
  category: PoiCategory;
}

export const pois: Poi[] = [
  {
    id: 'citadel',
    name: 'Citadel of Troy',
    era: 'archaic_600_bc',
    description: 'The fortified acropolis on the hill of Hisarlik, presented as the visual anchor of the reconstruction.',
    confidence: 'High',
    evidenceSnippet: 'Hisarlik is the archaeological mound associated with ancient Troy/Ilion and contains multiple settlement phases.',
    sourceNote: 'Use scholarly verification before public release. Baseline references: Blegen; Korfmann; Rose.',
    coordinates: [26.238889, 39.9575, 30],
    scenePosition: [0, 8, 0],
    layer: 'defense',
    category: 'citadel',
  },
  {
    id: 'athena-temple',
    name: 'Temple of Athena',
    era: 'archaic_600_bc',
    description: 'A sacred precinct on the acropolis, shown as the main religious marker of Archaic Ilion.',
    confidence: 'Medium',
    evidenceSnippet: 'The cult of Athena Ilias is historically important, but exact early architectural form and visual reconstruction require careful source review.',
    sourceNote: 'Flag as interpretive pending detailed source validation.',
    coordinates: [26.2386, 39.9578, 35],
    scenePosition: [-4, 12, -3],
    layer: 'religion',
    category: 'religious',
  },
  {
    id: 'lower-town',
    name: 'Lower Town',
    era: 'archaic_600_bc',
    description: 'Residential and working areas extending around the citadel, represented as clustered scale-model buildings.',
    confidence: 'Medium',
    evidenceSnippet: 'Lower settlement activity is archaeologically plausible, but exact density and layout are reconstruction choices.',
    sourceNote: 'Keep geometry stylized and label exact layout as interpretive.',
    coordinates: [26.2395, 39.9565, 20],
    scenePosition: [14, 1, 12],
    layer: 'trade',
    category: 'settlement',
  },
  {
    id: 'south-gate',
    name: 'South Gate',
    era: 'archaic_600_bc',
    description: 'A major access point into the fortified city, used for the defense overlay and route animation.',
    confidence: 'Medium',
    evidenceSnippet: 'Gate positions should be treated as approximate until checked against archaeological plans.',
    sourceNote: 'Use as a visual and navigational marker, not a surveyed final point.',
    coordinates: [26.2388, 39.9567, 25],
    scenePosition: [2, 6, 8],
    layer: 'defense',
    category: 'gate',
  },
  {
    id: 'harbor-outpost',
    name: 'Harbor Outpost',
    era: 'archaic_600_bc',
    description: 'A coastal trade node connecting Ilion to the Hellespont maritime corridor.',
    confidence: 'Speculative',
    evidenceSnippet: 'The broader region had strategic maritime importance, but the exact V1 harbor geometry is an artistic reconstruction.',
    sourceNote: 'Clearly label as an interpretive visual anchor for trade routes.',
    coordinates: [26.1833, 39.9500, 5],
    scenePosition: [-38, -2, 22],
    layer: 'trade',
    category: 'harbor',
  },
  {
    id: 'scamander-river',
    name: 'Scamander River',
    era: 'archaic_600_bc',
    description: 'The river system structuring the plain of Troy, agriculture, movement, and mythology.',
    confidence: 'Medium',
    evidenceSnippet: 'The modern Karamenderes/Scamander system is geographically real, but ancient channel courses shifted over time.',
    sourceNote: 'Use a simplified course and mark it as approximate.',
    coordinates: [26.2000, 39.9700, 5],
    scenePosition: [-24, -2, -10],
    layer: 'water',
    category: 'river',
  },
  {
    id: 'farmland',
    name: 'Scamander Plain Farmland',
    era: 'archaic_600_bc',
    description: 'Productive fields and orchards visualizing the agricultural base of the settlement.',
    confidence: 'Medium',
    evidenceSnippet: 'The alluvial plain is suitable for agriculture; exact field boundaries are visual reconstruction.',
    sourceNote: 'Use as a thematic layer, not a surveyed agricultural map.',
    coordinates: [26.2200, 39.9500, 5],
    scenePosition: [18, -2, 26],
    layer: 'agriculture',
    category: 'agricultural',
  },
  {
    id: 'sacred-spring',
    name: 'Sacred Spring',
    era: 'archaic_600_bc',
    description: 'A water and ritual POI used to connect landscape, survival, and sacred geography.',
    confidence: 'Speculative',
    evidenceSnippet: 'The V1 spring is an interpretive feature to explain water access and ritual geography.',
    sourceNote: 'Do not present as a confirmed excavated feature without later verification.',
    coordinates: [26.2372, 39.9572, 20],
    scenePosition: [-8, 0, 9],
    layer: 'water',
    category: 'religious',
  },
  {
    id: 'dardanelles',
    name: 'Hellespont / Dardanelles',
    era: 'archaic_600_bc',
    description: 'The maritime chokepoint that made the Troad strategically significant.',
    confidence: 'High',
    evidenceSnippet: 'The strait is the stable regional geographic feature anchoring trade, conflict, and movement.',
    sourceNote: 'Modern geographic reference; ancient shoreline details still require geomorphological review.',
    coordinates: [26.1950, 40.0100, 0],
    scenePosition: [-42, -3, -22],
    layer: 'water',
    category: 'natural',
  },
  {
    id: 'mount-ida',
    name: 'Mount Ida Backdrop',
    era: 'archaic_600_bc',
    description: 'A distant mountainous backdrop giving the scene mythic scale and geographic orientation.',
    confidence: 'High',
    evidenceSnippet: 'Mount Ida is a major regional geographic landmark in the Troad landscape and ancient literary imagination.',
    sourceNote: 'Backdrop is stylized for composition.',
    coordinates: [26.8370, 39.7200, 1774],
    scenePosition: [52, 18, -42],
    layer: 'water',
    category: 'natural',
  },
];
