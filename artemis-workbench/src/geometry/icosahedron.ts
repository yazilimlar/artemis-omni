import { faceId, freezeMesh, vertexId, type TriangleMesh } from "./primitives";
import { projectToSphere, vec3 } from "./vector3";

const PHI = (1 + Math.sqrt(5)) / 2;

const BASE_VERTICES = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
] as const;

const BASE_FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
] as const;

export function createIcosahedron(radius = 1): TriangleMesh {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError("Icosahedron radius must be a finite positive number");
  }

  const vertices = BASE_VERTICES.map(([x, y, z], index) =>
    Object.freeze({
      id: vertexId(index),
      position: projectToSphere(vec3(x, y, z), radius),
    }),
  );

  const faces = BASE_FACES.map(([a, b, c], index) =>
    Object.freeze({
      id: faceId(index),
      vertices: Object.freeze([vertexId(a), vertexId(b), vertexId(c)]) as readonly [
        ReturnType<typeof vertexId>,
        ReturnType<typeof vertexId>,
        ReturnType<typeof vertexId>,
      ],
    }),
  );

  return freezeMesh({ radius, vertices, faces });
}
