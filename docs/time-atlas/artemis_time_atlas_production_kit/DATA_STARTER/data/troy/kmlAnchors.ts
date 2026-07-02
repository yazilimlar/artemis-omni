/**
 * Provisional spatial anchors for the Troy V1 prototype.
 *
 * WARNING:
 * These anchors are a production scaffold, not a final scholarly GIS dataset.
 * Verify coordinates and claims before public/institutional release.
 */

export interface KmlAnchor {
  id: string;
  name: string;
  coordinates: [number, number, number];
  confidence: 'High' | 'Medium' | 'Speculative' | 'Uncertain';
  note: string;
}

export const kmlAnchors: KmlAnchor[] = [
  {
    id: 'hisarlik-citadel',
    name: 'Hisarlik / Troy Citadel Anchor',
    coordinates: [26.238889, 39.9575, 30],
    confidence: 'High',
    note: 'Core geographic anchor for ancient Troy/Ilion.',
  },
  {
    id: 'athena-temple-anchor',
    name: 'Temple of Athena Approximate Anchor',
    coordinates: [26.2386, 39.9578, 35],
    confidence: 'Medium',
    note: 'Use as an approximate visual anchor pending source verification.',
  },
  {
    id: 'sigeum-harbor-anchor',
    name: 'Sigeum / Harbor Outpost Approximate Anchor',
    coordinates: [26.1833, 39.95, 5],
    confidence: 'Speculative',
    note: 'Useful for visual trade layer; exact V1 representation is interpretive.',
  },
];
