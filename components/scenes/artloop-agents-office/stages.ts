/**
 * The five ArtLoop stages, as published on /labs/artloop. Copy only: no project
 * data, no figures. Shared by the scene and its static fallback.
 */
export type Stage = { name: string; note: string; color: string };

export const STAGES: readonly Stage[] = [
  { name: "Intake", note: "The invitation, registered", color: "#4fa59c" },
  { name: "Takeoff", note: "Quantities from the documents", color: "#6fb7c9" },
  { name: "Priced basis", note: "Rates with a source", color: "#d9a441" },
  { name: "Figure governance", note: "Totals under version control", color: "#d4191d" },
  { name: "Proposal", note: "A controlled document", color: "#e6efed" },
];

/** Desks sit on a pentagon, stage 1 at the back (−Z), clockwise seen from above. */
export const DESK_RADIUS = 6.6;
export function deskAngle(index: number): number {
  return -Math.PI / 2 + index * ((Math.PI * 2) / STAGES.length);
}

/** Seconds each view holds during the automatic tour (overview, then stages 1–5). */
export const TOUR_SECONDS = 7;
