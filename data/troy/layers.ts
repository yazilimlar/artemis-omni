export type LayerId = "defense" | "trade" | "religion" | "agriculture" | "water";

export interface Layer {
  id: LayerId;
  label: string;
  icon: string;
  description: string;
  color: string;
  activeByDefault: boolean;
}

export const layers: Layer[] = [
  {
    id: "defense",
    label: "Defense",
    icon: "shield",
    description: "Walls, gates, towers, and defensible terrain.",
    color: "#c24a3a",
    activeByDefault: true,
  },
  {
    id: "trade",
    label: "Trade",
    icon: "ship",
    description: "Harbor routes, roads, ships, and exchange points.",
    color: "#d6a84f",
    activeByDefault: true,
  },
  {
    id: "religion",
    label: "Religion",
    icon: "temple",
    description: "Sanctuaries, cult spaces, altars, and ritual landmarks.",
    color: "#b895ff",
    activeByDefault: true,
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: "wheat",
    description: "Fields, orchards, vineyards, and productive plain areas.",
    color: "#8fae5a",
    activeByDefault: true,
  },
  {
    id: "water",
    label: "Water",
    icon: "water",
    description: "Rivers, springs, coastlines, and the Hellespont/Dardanelles.",
    color: "#4aa3c7",
    activeByDefault: true,
  },
];
