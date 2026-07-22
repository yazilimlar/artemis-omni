import test from "node:test";
import assert from "node:assert/strict";
import { panelSignature, polygon } from "../dist/foundation.esm.js";

const { canonicalPanelSignature, legacySortedMultisetKey, reflectAttributeCycles } = panelSignature;
const TOL = { lengthTol: 0.1, angleTol: 0.1 };
const opts = (mirrorPolicy = "merge", extra = {}) => ({ mirrorPolicy, tolerances: TOL, ...extra });
const rot = (arr, k) => arr.map((_, i) => arr[(i + k) % arr.length]);

test("rotation invariance", () => {
  const L = [100,120,100,120,100,120];
  const A = [110,130,110,130,110,130];
  const reference = canonicalPanelSignature({ edgeLengths: L, interiorAnglesDeg: A }, opts()).signature;
  for (let k = 1; k < L.length; k++) {
    assert.equal(canonicalPanelSignature({ edgeLengths: rot(L,k), interiorAnglesDeg: rot(A,k) }, opts()).signature, reference);
  }
});

test("multiset collision: legacy merges and canonical separates", () => {
  const A6 = new Array(6).fill(120);
  const pA = { edgeLengths: [100,120,100,120,100,120], interiorAnglesDeg: A6 };
  const pB = { edgeLengths: [100,100,120,120,100,120], interiorAnglesDeg: A6 };
  assert.equal(legacySortedMultisetKey(6,pA.edgeLengths,A6), legacySortedMultisetKey(6,pB.edgeLengths,A6));
  assert.notEqual(canonicalPanelSignature(pA,opts()).signature, canonicalPanelSignature(pB,opts()).signature);
});

test("different interior-angle cycles create different families", () => {
  const L = new Array(6).fill(100);
  const a = canonicalPanelSignature({ edgeLengths:L, interiorAnglesDeg:[110,130,110,130,110,130] }, opts());
  const b = canonicalPanelSignature({ edgeLengths:L, interiorAnglesDeg:[110,110,130,130,110,130] }, opts());
  assert.notEqual(a.signature,b.signature);
});

test("mirror merge unifies and separate preserves chirality", () => {
  const loop = [[0,0,0],[8,0,0],[11,5,0],[5,9,0],[-2,4,0]];
  const mirrored = polygon.reflectLoop(loop,[0,0,0],[0,1,0]);
  const wA = polygon.normalizeWinding(loop,[0,0,1]);
  const wB = polygon.normalizeWinding(mirrored,[0,0,1]);
  const attrs = (w) => ({ edgeLengths: polygon.edgeLengths(w), interiorAnglesDeg: polygon.interiorAnglesDeg(w) });
  assert.equal(canonicalPanelSignature(attrs(wA),opts("merge")).signature, canonicalPanelSignature(attrs(wB),opts("merge")).signature);
  assert.notEqual(canonicalPanelSignature(attrs(wA),opts("separate")).signature, canonicalPanelSignature(attrs(wB),opts("separate")).signature);
});

test("reflection indexing handles unequal adjacent angles", () => {
  const loop = [[0,0,0],[10,0,0],[14,6,0],[7,11,0],[-3,6,0],[-4,1,0]];
  const wF = polygon.normalizeWinding(loop,[0,0,1]);
  const wM = polygon.normalizeWinding(polygon.reflectLoop(loop,[0,0,0],[1,0,0]),[0,0,1]);
  const attrs = (w) => ({ edgeLengths: polygon.edgeLengths(w), interiorAnglesDeg: polygon.interiorAnglesDeg(w) });
  assert.equal(canonicalPanelSignature(attrs(wF),opts("merge")).signature, canonicalPanelSignature(attrs(wM),opts("merge")).signature);
});

test("connector and global fabrication codes participate in identity", () => {
  const base = { edgeLengths:[100,120,100,120,100,120], interiorAnglesDeg:new Array(6).fill(120) };
  const a = canonicalPanelSignature({ ...base, connectorCodes:new Array(6).fill("D12x2") }, opts("merge",{globalCodes:["plan:within","t:10"]}));
  const b = canonicalPanelSignature({ ...base, connectorCodes:["D12x2","D12x2","D12x2","D12x2","D12x2","NONE"] }, opts("merge",{globalCodes:["plan:within","t:10"]}));
  assert.notEqual(a.signature,b.signature);
  const c = canonicalPanelSignature({ ...base, connectorCodes:new Array(6).fill("D12x2") }, opts("merge",{globalCodes:["t:10","plan:within"]}));
  assert.equal(a.signature,c.signature);
});

test("tolerance changes identity", () => {
  const p = { edgeLengths:[100.04,120,100,120,100,120], interiorAnglesDeg:new Array(6).fill(120) };
  const a = canonicalPanelSignature(p,{mirrorPolicy:"merge",tolerances:{lengthTol:0.1,angleTol:0.1}});
  const b = canonicalPanelSignature(p,{mirrorPolicy:"merge",tolerances:{lengthTol:0.2,angleTol:0.1}});
  assert.notEqual(a.signature,b.signature);
});

test("reflection transform is an involution", () => {
  const L=[1,2,3,4,5], A=[10,20,30,40,50], B=[0,0,1,1,2], C=["a","b","c","d","e"];
  const r1=reflectAttributeCycles(L,A,B,C), r2=reflectAttributeCycles(r1.L,r1.A,r1.B,r1.C);
  assert.deepEqual([r2.L,r2.A,r2.B,r2.C],[L,A,B,C]);
});
