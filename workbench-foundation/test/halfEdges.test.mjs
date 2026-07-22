import test from "node:test";
import assert from "node:assert/strict";
import { halfEdges } from "../dist/foundation.esm.js";

test("two adjacent CCW panels create one internal edge and six boundary edges", () => {
  const topology = halfEdges.buildHalfEdgeTopology([
    { id: "A", vertexIds: ["v0", "v1", "v2", "v3"] },
    { id: "B", vertexIds: ["v1", "v0", "v4", "v5"] },
  ]);
  const audit = halfEdges.auditHalfEdgeTopology(topology);
  assert.equal(audit.valid, true);
  assert.equal(audit.panelCount, 2);
  assert.equal(audit.halfEdgeCount, 8);
  assert.equal(audit.physicalEdgeCount, 7);
  assert.equal(audit.internalEdgeCount, 1);
  assert.equal(audit.boundaryEdgeCount, 6);
  const internal = topology.physicalEdges.find((edge) => !edge.boundary);
  assert.ok(internal);
  const [aId, bId] = internal.halfEdgeIds;
  assert.ok(aId && bId);
  const a = topology.halfEdges.find((edge) => edge.id === aId);
  const b = topology.halfEdges.find((edge) => edge.id === bId);
  assert.equal(a.twinId, b.id);
  assert.equal(b.twinId, a.id);
  assert.equal(a.originVertexId, b.destinationVertexId);
  assert.equal(a.destinationVertexId, b.originVertexId);
});

test("same-direction shared edge is rejected as a winding error", () => {
  assert.throws(() => halfEdges.buildHalfEdgeTopology([
    { id: "A", vertexIds: ["v0", "v1", "v2"] },
    { id: "B", vertexIds: ["v0", "v1", "v3"] },
  ]), /duplicate directed edge|normalize winding/);
});

test("three panels incident on one edge are rejected as nonmanifold", () => {
  assert.throws(() => halfEdges.buildHalfEdgeTopology([
    { id: "A", vertexIds: ["v0", "v1", "v2"] },
    { id: "B", vertexIds: ["v1", "v0", "v3"] },
    { id: "C", vertexIds: ["v0", "v1", "v4"] },
  ]), /duplicate directed edge|nonmanifold/);
});

test("topology output is JSON serializable and deterministic", () => {
  const panels = [
    { id: "A", vertexIds: ["v0", "v1", "v2"] },
    { id: "B", vertexIds: ["v1", "v0", "v3"] },
  ];
  const first = JSON.stringify(halfEdges.buildHalfEdgeTopology(panels));
  const second = JSON.stringify(halfEdges.buildHalfEdgeTopology(panels));
  assert.equal(first, second);
  assert.doesNotThrow(() => JSON.parse(first));
});
