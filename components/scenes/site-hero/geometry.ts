/**
 * Geometry for the site-hero scene (ADR-016): a once-subdivided icosahedron
 * (42 vertices, 120 edges) on the unit sphere. Pure and dependency-free.
 */
export type Vec3 = [number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;

function normalize([x, y, z]: Vec3): Vec3 {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

const BASE_VERTICES: Vec3[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map((v) => normalize(v as Vec3));

const BASE_FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

/** Subdivide each face once: midpoints projected back onto the sphere. */
export function subdividedIcosahedron(): { vertices: Vec3[]; edges: [number, number][] } {
  const vertices = [...BASE_VERTICES];
  const midpointCache = new Map<string, number>();
  const midpoint = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    const cached = midpointCache.get(key);
    if (cached !== undefined) return cached;
    const [ax, ay, az] = vertices[a];
    const [bx, by, bz] = vertices[b];
    vertices.push(normalize([(ax + bx) / 2, (ay + by) / 2, (az + bz) / 2]));
    midpointCache.set(key, vertices.length - 1);
    return vertices.length - 1;
  };
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push([a, b]);
    }
  };
  for (const [a, b, c] of BASE_FACES) {
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    for (const [x, y, z] of [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]] as const) {
      addEdge(x, y);
      addEdge(y, z);
      addEdge(z, x);
    }
  }
  return { vertices, edges };
}
