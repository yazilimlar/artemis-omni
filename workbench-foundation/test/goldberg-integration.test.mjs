/**
 * Integration: canonical signature + planarity against REAL v3.6.1 geometry.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { panelSignature, polygon, planarity } from "../dist/foundation.esm.js";

const require = createRequire(import.meta.url);
const THREE = require("three");
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

function icosahedron() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const pts = [
    v3(-1,phi,0),v3(1,phi,0),v3(-1,-phi,0),v3(1,-phi,0),
    v3(0,-1,phi),v3(0,1,phi),v3(0,-1,-phi),v3(0,1,-phi),
    v3(phi,0,-1),v3(phi,0,1),v3(-phi,0,-1),v3(-phi,0,1),
  ].map((p)=>p.normalize());
  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  return {pts,faces};
}

function subdivide(freq) {
  const ico=icosahedron(), verts=[], map=new Map(), tris=[];
  const keyFor=(p)=>[p.x,p.y,p.z].map((n)=>n.toFixed(8)).join(",");
  function addPoint(p){const n=p.clone().normalize(),k=keyFor(n);if(map.has(k))return map.get(k);const idx=verts.length;verts.push(n);map.set(k,idx);return idx;}
  for(const f of ico.faces){
    const A=ico.pts[f[0]],B=ico.pts[f[1]],C=ico.pts[f[2]],grid=[];
    for(let i=0;i<=freq;i++){grid[i]=[];for(let j=0;j<=freq-i;j++){
      const a=(freq-i-j)/freq,b=i/freq,c=j/freq;
      grid[i][j]=addPoint(v3(0,0,0).addScaledVector(A,a).addScaledVector(B,b).addScaledVector(C,c));
    }}
    for(let i=0;i<freq;i++)for(let j=0;j<freq-i;j++){
      tris.push([grid[i][j],grid[i+1][j],grid[i][j+1]]);
      if(j<freq-i-1)tris.push([grid[i+1][j],grid[i+1][j+1],grid[i][j+1]]);
    }
  }
  return {verts,tris};
}

function goldbergOuterLoops(freq,radius){
  const mesh=subdivide(freq);
  const centers=mesh.tris.map((t)=>mesh.verts[t[0]].clone().add(mesh.verts[t[1]]).add(mesh.verts[t[2]]).normalize());
  const incident=Array.from({length:mesh.verts.length},()=>[]);
  mesh.tris.forEach((t,fi)=>t.forEach((vi)=>incident[vi].push(fi)));
  const cells=[];
  for(let vi=0;vi<mesh.verts.length;vi++){
    const centerDir=mesh.verts[vi].clone().normalize(),inc=incident[vi];
    if(inc.length<5)continue;
    let ref=v3(0,1,0);if(Math.abs(ref.dot(centerDir))>0.92)ref=v3(1,0,0);
    const t1=ref.clone().cross(centerDir).normalize(),t2=centerDir.clone().cross(t1).normalize();
    const ordered=inc.map((fi)=>{const q=centers[fi],rel=q.clone().sub(centerDir.clone().multiplyScalar(q.dot(centerDir)));return{fi,ang:Math.atan2(rel.dot(t2),rel.dot(t1))};})
      .sort((a,b)=>a.ang-b.ang).map((o)=>centers[o.fi]);
    const outer=[...ordered].reverse().map((q)=>[q.x*radius,q.y*radius,q.z*radius]);
    cells.push({type:ordered.length===5?"pentagon":"hexagon",outer,centerDir:[centerDir.x,centerDir.y,centerDir.z]});
  }
  return cells;
}

const TOL={lengthTol:0.1,angleTol:0.1};
const groupBy=(items,keyFn)=>{const m=new Map();for(const it of items){const k=keyFn(it);m.set(k,(m.get(k)??0)+1);}return m;};
function cellAttrs(cell){const loop=polygon.normalizeWinding(cell.outer,cell.centerDir);return{edgeLengths:polygon.edgeLengths(loop),interiorAnglesDeg:polygon.interiorAnglesDeg(loop)};}
const canonicalKey=(cell,mirrorPolicy="merge")=>panelSignature.canonicalPanelSignature(cellAttrs(cell),{mirrorPolicy,tolerances:TOL}).signature;
const legacyKey=(cell)=>{const a=cellAttrs(cell);return panelSignature.legacySortedMultisetKey(a.edgeLengths.length,a.edgeLengths,a.interiorAnglesDeg);};

for(const freq of [2,3]){
  test(`F${freq} full sphere grouping and counts`,()=>{
    const cells=goldbergOuterLoops(freq,150);
    assert.equal(cells.length,10*freq*freq+2);
    const legacy=groupBy(cells,legacyKey),canon=groupBy(cells,(c)=>canonicalKey(c,"merge")),canonSep=groupBy(cells,(c)=>canonicalKey(c,"separate"));
    assert.ok(canon.size>=legacy.size);
    assert.ok(canonSep.size>=canon.size);
    assert.equal([...canon.values()].reduce((a,b)=>a+b,0),cells.length);
    const pentFamilies=groupBy(cells.filter((c)=>c.type==="pentagon"),(c)=>canonicalKey(c,"merge"));
    assert.equal(pentFamilies.size,1);
    assert.equal(pentFamilies.values().next().value,12);
  });
}

test("mirror-merge on real geometry",()=>{
  const cells=goldbergOuterLoops(2,150),hex=cells.find((c)=>c.type==="hexagon");
  const mirrored={type:"hexagon",outer:polygon.reflectLoop(hex.outer,[0,0,0],[1,0,0]),centerDir:[-hex.centerDir[0],hex.centerDir[1],hex.centerDir[2]]};
  assert.equal(canonicalKey(hex,"merge"),canonicalKey(mirrored,"merge"));
});

test("F2 planarity reproduces baseline",()=>{
  const TH={exactEps:1e-9,tolerance:0.05,threeDLimit:1.0};
  const worst=goldbergOuterLoops(2,150).map((c)=>planarity.planarityMetric(c.outer,TH)).reduce((a,m)=>m.maxAbsoluteDeviation>a.maxAbsoluteDeviation?m:a);
  assert.ok(Math.abs(worst.newellPlaneMaxDeviation-0.49517)<5e-4);
  assert.ok(worst.maxAbsoluteDeviation<=worst.newellPlaneMaxDeviation+1e-12);
  assert.equal(worst.classification,"projected-outside-tolerance");
  for(const c of goldbergOuterLoops(1,150))assert.ok(planarity.planarityMetric(c.outer,TH).maxAbsoluteDeviation<1e-6);
});
