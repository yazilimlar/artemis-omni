import type { Vec3 } from "./vector3";

export type VertexId = `V${number}`;
export type FaceId = `F${number}`;

export interface GeometryVertex {
  readonly id: VertexId;
  readonly position: Vec3;
}

export interface TriangleFace {
  readonly id: FaceId;
  readonly vertices: readonly [VertexId, VertexId, VertexId];
}

export interface TriangleMesh {
  readonly radius: number;
  readonly vertices: readonly GeometryVertex[];
  readonly faces: readonly TriangleFace[];
}

export function vertexId(index: number): VertexId {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError("Vertex index must be a non-negative integer");
  }
  return `V${index}`;
}

export function faceId(index: number): FaceId {
  if (!Number.isInteger(index) || index < 0) {
    throw new RangeError("Face index must be a non-negative integer");
  }
  return `F${index}`;
}

export function freezeMesh(mesh: TriangleMesh): TriangleMesh {
  const vertices = Object.freeze(mesh.vertices.map((vertex) => Object.freeze(vertex)));
  const faces = Object.freeze(
    mesh.faces.map((face) =>
      Object.freeze({
        ...face,
        vertices: Object.freeze([...face.vertices]) as readonly [VertexId, VertexId, VertexId],
      }),
    ),
  );
  return Object.freeze({ radius: mesh.radius, vertices, faces });
}
