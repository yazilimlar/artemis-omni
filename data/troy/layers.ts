/**
 * Time Atlas — thematic overlay layers for the Troy diorama.
 * V1: local, hardcoded. Layer ids are referenced by POIs (data/troy/pois.ts)
 * and by scene groups that highlight when a layer is active.
 */

export type LayerId = "defense" | "trade" | "religion" | "agriculture" | "water";

export interface OverlayLayer {
  id: LayerId;
  name: string;
  /** Hex color used for markers, chips and scene highlights. */
  color: string;
  description: string;
}

export const LAYERS: OverlayLayer[] = [
  {
    id: "defense",
    name: "Defense",
    color: "#e2694a",
    description: "Walls, gates and towers — the fortification system of the citadel.",
  },
  {
    id: "trade",
    name: "Trade",
    color: "#e8b34b",
    description: "Harbor, anchorage, roads and the exchange economy of the Troad.",
  },
  {
    id: "religion",
    name: "Religion",
    color: "#a887e0",
    description: "Sanctuaries and cult places — Athena Ilias and the West Sanctuary.",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    color: "#8fbf58",
    description: "Field systems, groves and pasture on the Scamander plain.",
  },
  {
    id: "water",
    name: "Water",
    color: "#5ab6d8",
    description: "Springs, the Scamander river and the strait — water as infrastructure.",
  },
];

export const LAYER_BY_ID: Record<LayerId, OverlayLayer> = Object.fromEntries(
  LAYERS.map((layer) => [layer.id, layer]),
) as Record<LayerId, OverlayLayer>;
