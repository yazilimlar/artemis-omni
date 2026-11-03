/**
 * Synthetic pursuits for the ArtPlex command room. Letters only: no project names,
 * dates, amounts or results. Each one stands for a project running in its own ArtLoop.
 */
export type Pursuit = {
  name: string;
  /** Gates passed, 0–5. */
  gate: number;
  /** True when the pursuit is held at its current gate (a hard stop). */
  hardStop?: boolean;
  /** False when the due date is not set: the board shows NOT SET and no countdown. */
  dueSet: boolean;
  /** Countdown cycle length in seconds and starting phase (0–1). */
  cycle: number;
  phase: number;
};

export const PURSUITS: readonly Pursuit[] = [
  { name: "Pursuit A", gate: 3, dueSet: true, cycle: 26, phase: 0.55 },
  { name: "Pursuit B", gate: 2, dueSet: true, cycle: 34, phase: 0.2 },
  { name: "Pursuit C", gate: 5, dueSet: true, cycle: 18, phase: 0.85 },
  { name: "Pursuit D", gate: 1, dueSet: false, cycle: 0, phase: 0 },
  { name: "Pursuit E", gate: 3, hardStop: true, dueSet: true, cycle: 40, phase: 0.4 },
  { name: "Pursuit F", gate: 2, dueSet: true, cycle: 30, phase: 0.7 },
];

/** The five gates named on /labs/artplex, in order. */
export const GATES = ["Boundary", "Intake", "Capacity and fit", "Commercial", "Submission authorization"] as const;

/** Who can hold the ball, as named on /labs/artplex. */
export const COURT = ["Us", "GC/CM", "Owner", "Sub or vendor", "Model team", "Approver"] as const;

export const POD_RADIUS = 6.2;
export function podAngle(index: number): number {
  return -Math.PI / 2 + index * ((Math.PI * 2) / PURSUITS.length);
}

/** Camera views: the whole room, then the three ideas and the experience ledger. */
export type View = { title: string; caption: string; pod: number | null };
export const VIEWS: readonly View[] = [
  { title: "The command picture", caption: "Every pursuit on one board", pod: null },
  {
    title: "Countdown",
    caption: "Each pursuit shows its time to bid. With no due date, the board says NOT SET.",
    pod: 3,
  },
  { title: "Ball-in-court", caption: "Every open item names who owns the next move.", pod: 0 },
  { title: "Gates", caption: "A pursuit advances only through explicit gates, with hard stops.", pod: 4 },
  { title: "Experience ledger", caption: "Each bid close is captured. The next pursuit starts from it.", pod: -1 },
];

export const TOUR_SECONDS = 7;
