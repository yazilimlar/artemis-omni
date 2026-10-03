import { describe, expect, it } from "vitest";
import {
  countUniqueEdges,
  createClassIGeodesic,
  createIcosahedron,
  distance,
  intersectRayPlane,
  magnitude,
  nearlyEqual,
  planeFromPoints,
  projectPointToPlane,
  projectToSphere,
  signedDistanceToPlane,
  vec3,
} from "../src";

const GOLDEN = [
  { frequency: 1, vertices: 12, edges: 30, faces: 20 },
  { frequency: 2, vertices: 42, edges: 120, faces: 80 },
  { frequency: 3, vertices: 92, edges: 270, faces: 180 },
] as const;

describe("geometry kernel", () => {
  it("normalizes vectors onto a requested sphere", () => {
    const projected = projectToSphere(vec3(3, 4, 0), 10);
    expect(magnitude(projected)).toBeCloseTo(10, 12);
    expect(projected.x).toBeCloseTo(6, 12);
    expect(projected.y).toBeCloseTo(8, 12);
  });

  it("applies a deterministic numeric tolerance policy", () => {
    expect(nearlyEqual(1, 1 + 1e-10)).toBe(true);
    expect(nearlyEqual(1, 1.001)).toBe(false);
    expect(nearlyEqual(Number.NaN, 0)).toBe(false);
  });

  it("constructs, measures, projects, and intersects planes", () => {
    const plane = planeFromPoints(vec3(0, 0, 5), vec3(1, 0, 5), vec3(0, 1, 5));
    expect(signedDistanceToPlane(plane, vec3(2, 3, 9))).toBeCloseTo(4, 12);
    expect(projectPointToPlane(plane, vec3(2, 3, 9))).toEqual(vec3(2, 3, 5));

    const hit = intersectRayPlane(
      { origin: vec3(2, 3, 10), direction: vec3(0, 0, -2) },
      plane,
    );
    expect(hit).toEqual(vec3(2, 3, 5));

    const parallel = intersectRayPlane(
      { origin: vec3(0, 0, 10), direction: vec3(1, 0, 0) },
      plane,
    );
    expect(parallel).toBeNull();
  });

  it("creates the canonical icosahedron with invariant counts", () => {
    const mesh = createIcosahedron(2500);
    expect(mesh.vertices).toHaveLength(12);
    expect(mesh.faces).toHaveLength(20);
    expect(countUniqueEdges(mesh)).toBe(30);
    for (const vertex of mesh.vertices) {
      expect(magnitude(vertex.position)).toBeCloseTo(2500, 9);
    }
  });

  for (const golden of GOLDEN) {
    it(`matches the ${golden.frequency}V class-I golden topology`, () => {
      const mesh = createClassIGeodesic(golden.frequency, 5000);
      const edges = countUniqueEdges(mesh);

      expect(mesh.vertices).toHaveLength(golden.vertices);
      expect(edges).toBe(golden.edges);
      expect(mesh.faces).toHaveLength(golden.faces);
      expect(mesh.vertices.length - edges + mesh.faces.length).toBe(2);

      const ids = new Set(mesh.vertices.map((vertex) => vertex.id));
      expect(ids.size).toBe(mesh.vertices.length);
      for (const face of mesh.faces) {
        expect(new Set(face.vertices).size).toBe(3);
        for (const id of face.vertices) expect(ids.has(id)).toBe(true);
      }
      for (const vertex of mesh.vertices) {
        expect(distance(vertex.position, vec3(0, 0, 0))).toBeCloseTo(5000, 8);
      }
    });
  }

  it("is deterministic for repeated generation", () => {
    const first = createClassIGeodesic(3, 3200);
    const second = createClassIGeodesic(3, 3200);
    expect(second).toEqual(first);
  });
});
