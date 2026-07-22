import test from "node:test";
import assert from "node:assert/strict";
import { planarity } from "../dist/foundation.esm.js";

const TH = { exactEps: 1e-9, tolerance: 0.05, threeDLimit: 1.0 };

test("eigen solver: known symmetric matrix", () => {
  const { values } = planarity.symmetricEigen3([[2, 0, 0], [0, 3, 4], [0, 4, 9]]);
  const s = values.map((v) => Math.round(v * 1e9) / 1e9).sort((a, b) => a - b);
  assert.deepEqual(s, [1, 2, 11]);
});

test("planar square is exact-planar with zero deviation", () => {
  const m = planarity.planarityMetric([[0,0,0],[10,0,0],[10,10,0],[0,10,0]], TH);
  assert.ok(m.maxAbsoluteDeviation < 1e-12);
  assert.equal(m.classification, "exact-planar");
});

test("warped quad reports best-fit deviation and classification", () => {
  const h = 0.4;
  const m = planarity.planarityMetric([[0,0,h/2],[10,0,-h/2],[10,10,h/2],[0,10,-h/2]], TH);
  assert.ok(Math.abs(m.maxAbsoluteDeviation - h/2) < 1e-9);
  assert.ok(Math.abs(m.peakToPeakDeviation - h) < 1e-9);
  assert.equal(m.classification, "projected-outside-tolerance");
  assert.ok(m.maxAbsoluteDeviation <= m.newellPlaneMaxDeviation + 1e-12);
});

test("classification ladder respects thresholds", () => {
  assert.equal(planarity.classify(0, TH), "exact-planar");
  assert.equal(planarity.classify(0.04, TH), "projected-within-tolerance");
  assert.equal(planarity.classify(0.5, TH), "projected-outside-tolerance");
  assert.equal(planarity.classify(1.5, TH), "three-dimensional-fabrication-required");
});
