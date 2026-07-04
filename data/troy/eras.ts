/**
 * Time Atlas — timeline eras for Troy / Ilion.
 * V1: 600 BC is the fully realized diorama; the other eras are ghost teasers
 * rendered as wireframe overlays plus a caption card.
 */

export type EraStatus = "active" | "ghost";

export interface Era {
  id: string;
  /** Position on the scroll timeline, 0..N-1 (top to bottom). */
  order: number;
  /** Short display year, e.g. "600 BC". */
  year: string;
  title: string;
  status: EraStatus;
  /** One-line framing shown above the title. */
  kicker: string;
  summary: string;
  /** Small print under the summary — scope honesty for ghosts. */
  note: string;
  /** Accent color for captions, rail dot and ghost wireframes. */
  accent: string;
  /** CSS color for the era mood overlay laid over the canvas (with alpha). */
  overlayTint: string;
}

export const ERAS: Era[] = [
  {
    id: "troy-1200bc",
    order: 0,
    year: "1200 BC",
    title: "City of the Late Bronze Age",
    status: "ghost",
    kicker: "Ghost era — teaser",
    summary:
      "Troy VI/VIIa: the great limestone walls, towers and terraced palaces of the city tied to the Trojan War tradition. Its footprint haunts every later Troy.",
    note: "Wireframe teaser only in V1 — full Bronze Age reconstruction arrives in a later release.",
    accent: "#d98e5f",
    overlayTint: "rgba(24, 12, 26, 0.55)",
  },
  {
    id: "troy-600bc",
    order: 1,
    year: "600 BC",
    title: "Archaic Ilion",
    status: "active",
    kicker: "Fully realized era",
    summary:
      "A modest Greek town on a famous ruin. Settlers live among the Bronze Age walls, a sanctuary to Athena Ilias crowns the mound, and the Scamander plain feeds farms, herds and the harbor trade.",
    note: "Explore the hotspots — every card states its evidence and confidence.",
    accent: "#e8b34b",
    overlayTint: "rgba(0, 0, 0, 0)",
  },
  {
    id: "troy-150ad",
    order: 2,
    year: "150 AD",
    title: "Roman Ilium",
    status: "ghost",
    kicker: "Ghost era — teaser",
    summary:
      "A marble city of memory tourism: a grand Temple of Athena, odeon, bouleuterion and gridded streets. Emperors visit the ancestral home of Rome.",
    note: "Wireframe teaser only in V1 — Roman Ilium is a planned future era.",
    accent: "#c8cfe0",
    overlayTint: "rgba(10, 16, 30, 0.5)",
  },
  {
    id: "troy-2026",
    order: 3,
    year: "2026 AD",
    title: "The Excavated Mound",
    status: "ghost",
    kicker: "Ghost era — teaser",
    summary:
      "Hisarlık today: excavation trenches through nine cities, a shelter roof, a visitor ramp — and a silted plain where the bay of Troy used to be.",
    note: "Wireframe teaser only in V1 — the modern site layer is planned next.",
    accent: "#7fd4b8",
    overlayTint: "rgba(6, 20, 22, 0.5)",
  },
];

export const ACTIVE_ERA = ERAS.find((era) => era.status === "active")!;

export const ERA_BY_ID: Record<string, Era> = Object.fromEntries(
  ERAS.map((era) => [era.id, era]),
);
