/**
 * Procedural terrain math for the Troy diorama.
 *
 * A single analytic height function is shared by the terrain mesh and by
 * every object that needs to sit on the ground (roads, trees, houses,
 * hotspots), so nothing floats or clips. Stylized, not survey-accurate —
 * see data/troy/kmlAnchors.ts for the real-world mapping.
 *
 * Scene axes: x = east-ish, z = south-ish, y = up. The camera looks down
 * the +x/+z diagonal, so "screen up" is roughly the -x/-z direction:
 * the Dardanelles band sits at x+z << 0 (top of frame), the lower town
 * and plain toward x+z > 0 (bottom of frame).
 */

export const TERRAIN_BOUNDS = {
  minX: -34,
  maxX: 26,
  minZ: -30,
  maxZ: 24,
} as const;

export const SEA_LEVEL = 0;

/** Deterministic PRNG so scatter layouts are stable across reloads. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function gauss2(x: number, z: number, cx: number, cz: number, radius: number): number {
  const dx = x - cx;
  const dz = z - cz;
  return Math.exp(-(dx * dx + dz * dz) / (radius * radius));
}

/** Scamander course, foreground plain → strait. Used for carving + placement. */
export const RIVER_POINTS: Array<[number, number]> = [
  [7, 18],
  [4, 14],
  [1, 11],
  [-3, 7.5],
  [-6.5, 4],
  [-8.5, 0],
  [-9.5, -4],
  [-10, -8],
  [-11, -13],
  [-12, -18],
];

export function distToRiver(x: number, z: number): number {
  let min = Infinity;
  for (let i = 0; i < RIVER_POINTS.length - 1; i++) {
    const [ax, az] = RIVER_POINTS[i];
    const [bx, bz] = RIVER_POINTS[i + 1];
    const abx = bx - ax;
    const abz = bz - az;
    const t = Math.min(
      1,
      Math.max(0, ((x - ax) * abx + (z - az) * abz) / (abx * abx + abz * abz)),
    );
    const dx = x - (ax + abx * t);
    const dz = z - (az + abz * t);
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < min) min = d;
  }
  return min;
}

/** Diagonal "depth" coordinate: negative = toward the strait (top of frame). */
export function depthCoord(x: number, z: number): number {
  return (x + z) * Math.SQRT1_2;
}

export function terrainHeight(x: number, z: number): number {
  const u = depthCoord(x, z);

  // Gentle rolling plain.
  let h =
    1.15 +
    0.45 * Math.sin(x * 0.21) * Math.cos(z * 0.17) +
    0.28 * Math.sin(x * 0.43 + 1.7) * Math.sin(z * 0.37 + 0.6);

  // Coastline: land falls to seabed across a diagonal band toward the strait.
  const land = smoothstep(-15, -9, u);
  h = h * land + -2.4 * (1 - land);

  // Harbor cove pocket on the shore.
  h -= 2.4 * gauss2(x, z, -14.5, -8.5, 3.4);

  // Hisarlık mound with a flattened citadel plateau.
  h += Math.min(gauss2(x, z, 0, 0, 5.2) * 6.6, 4.25);

  // Lower-town shelf south-east of the mound.
  h += 0.9 * gauss2(x, z, 6, -0.5, 4.6);

  // Ida foothills rising toward the right edge of frame.
  h += 4.6 * gauss2(x, z, 15, -4, 4.4);
  h += 7.5 * gauss2(x, z, 21, -10, 6.2);
  h += 3.2 * gauss2(x, z, 11, -10, 3.4);

  // Scamander channel, carved below sea level so the water plane fills it.
  const cut = 1 - smoothstep(1.0, 2.4, distToRiver(x, z));
  if (cut > 0 && h < 4) {
    h = h * (1 - cut) + -0.75 * cut;
  }

  return h;
}

/** Ground height clamped to the shoreline — for things that must stay dry. */
export function groundHeight(x: number, z: number): number {
  return Math.max(terrainHeight(x, z), SEA_LEVEL);
}
