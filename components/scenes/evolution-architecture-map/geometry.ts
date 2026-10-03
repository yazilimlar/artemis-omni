import { ConeGeometry, SphereGeometry } from "three";
import { architectureEdges, architectureNodes } from "@/lib/evolution/architecture";

/** Shared geometry parameters; the vertex budget is asserted in tests (under 3,000). */
export const NODE_RADIUS = 0.2;
export const NODE_SEGMENTS: [number, number] = [10, 6];
export const ARROW_RADIUS = 0.07;
export const ARROW_HEIGHT = 0.22;
export const ARROW_SEGMENTS = 6;
export const VERTEX_BUDGET = 3000;

/** Total vertices the scene submits: node spheres, arrowheads and edge lines. */
export function vertexCount(): number {
  const sphere = new SphereGeometry(NODE_RADIUS, ...NODE_SEGMENTS).attributes.position.count;
  const cone = new ConeGeometry(ARROW_RADIUS, ARROW_HEIGHT, ARROW_SEGMENTS, 1).attributes.position.count;
  return architectureNodes.length * sphere + architectureEdges.length * (cone + 2);
}
