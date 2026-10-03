import { createIcosahedron } from "./icosahedron";
import {
  faceId,
  freezeMesh,
  vertexId,
  type GeometryVertex,
  type TriangleFace,
  type TriangleMesh,
  type VertexId,
} from "./primitives";
import { add, projectToSphere, scale, type Vec3 } from "./vector3";

function pointKey(point: Vec3): string {
  return `${point.x.toFixed(12)}|${point.y.toFixed(12)}|${point.z.toFixed(12)}`;
}

function barycentricPoint(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  frequency: number,
  row: number,
  column: number,
): Vec3 {
  const wa = (frequency - row) / frequency;
  const wb = (row - column) / frequency;
  const wc = column / frequency;
  return add(add(scale(a, wa), scale(b, wb)), scale(c, wc));
}

export function createClassIGeodesic(frequency: number, radius = 1): TriangleMesh {
  if (!Number.isInteger(frequency) || frequency < 1 || frequency > 64) {
    throw new RangeError("Geodesic frequency must be an integer from 1 through 64");
  }
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError("Geodesic radius must be a finite positive number");
  }

  const base = createIcosahedron(radius);
  const baseById = new Map(base.vertices.map((vertex) => [vertex.id, vertex.position] as const));
  const vertices: GeometryVertex[] = [];
  const faces: TriangleFace[] = [];
  const byPoint = new Map<string, VertexId>();

  const intern = (position: Vec3): VertexId => {
    const projected = projectToSphere(position, radius);
    const key = pointKey(projected);
    const existing = byPoint.get(key);
    if (existing) return existing;

    const id = vertexId(vertices.length);
    vertices.push(Object.freeze({ id, position: projected }));
    byPoint.set(key, id);
    return id;
  };

  for (const baseFace of base.faces) {
    const a = baseById.get(baseFace.vertices[0]);
    const b = baseById.get(baseFace.vertices[1]);
    const c = baseById.get(baseFace.vertices[2]);
    if (!a || !b || !c) throw new Error(`Invalid base face ${baseFace.id}`);

    const rows: VertexId[][] = [];
    for (let row = 0; row <= frequency; row += 1) {
      const ids: VertexId[] = [];
      for (let column = 0; column <= row; column += 1) {
        ids.push(intern(barycentricPoint(a, b, c, frequency, row, column)));
      }
      rows.push(ids);
    }

    for (let row = 0; row < frequency; row += 1) {
      const current = rows[row];
      const next = rows[row + 1];
      if (!current || !next) throw new Error("Incomplete subdivision rows");

      for (let column = 0; column <= row; column += 1) {
        const top = current[column];
        const left = next[column];
        const right = next[column + 1];
        if (!top || !left || !right) throw new Error("Incomplete subdivision triangle");
        faces.push(Object.freeze({
          id: faceId(faces.length),
          vertices: Object.freeze([top, left, right]) as readonly [VertexId, VertexId, VertexId],
        }));

        if (column < row) {
          const upperRight = current[column + 1];
          if (!upperRight) throw new Error("Incomplete inverted subdivision triangle");
          faces.push(Object.freeze({
            id: faceId(faces.length),
            vertices: Object.freeze([top, right, upperRight]) as readonly [VertexId, VertexId, VertexId],
          }));
        }
      }
    }
  }

  return freezeMesh({ radius, vertices, faces });
}

export function countUniqueEdges(mesh: TriangleMesh): number {
  const edges = new Set<string>();
  for (const face of mesh.faces) {
    const [a, b, c] = face.vertices;
    const pairs = [[a, b], [b, c], [c, a]] as const;
    for (const [left, right] of pairs) {
      edges.add(left < right ? `${left}|${right}` : `${right}|${left}`);
    }
  }
  return edges.size;
}
