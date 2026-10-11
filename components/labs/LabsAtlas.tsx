"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { labCategoryMeta, type LabCategory } from "@/data/labs-editorial";

export type AtlasNode = {
  id: string;
  title: string;
  description: string;
  category: LabCategory;
  flagship: boolean;
  href: string;
  status: string;
};

export type AtlasStyle =
  | "constellation"
  | "forum"
  | "archipelago"
  | "orbit"
  | "strata"
  | "radial"
  | "pantheon"
  | "colosseum"
  | "agora"
  | "geodesic"
  | "octagon"
  | "rotonda";

export const ATLAS_STYLES: AtlasStyle[] = [
  "constellation",
  "forum",
  "archipelago",
  "orbit",
  "strata",
  "radial",
  "pantheon",
  "colosseum",
  "agora",
  "geodesic",
  "octagon",
  "rotonda",
];

/** Canvas viewport sizes — the visitor controls how much screen the view takes. */
export type AtlasViewport = "compact" | "standard" | "cinematic";

export const ATLAS_VIEWPORTS: Record<AtlasViewport, { label: string; ratio: number; min: number; max: number }> = {
  compact: { label: "Compact", ratio: 0.42, min: 340, max: 460 },
  standard: { label: "Standard", ratio: 0.55, min: 420, max: 640 },
  cinematic: { label: "Cinematic", ratio: 0.72, min: 560, max: 880 },
};

const VIEWPORT_KEY = "labs-atlas-viewport";

/** Header copy per display style — the same map, six ways to read it. */
export const ATLAS_STYLE_META: Record<AtlasStyle, { title: string; blurb: string }> = {
  constellation: {
    title: "The labs as a constellation",
    blurb:
      "Every lab, one shared sky. Nodes cluster by category; gold nodes are the construction flagships. Drag to orbit, click a node to open its lab.",
  },
  forum: {
    title: "The labs as a forum",
    blurb:
      "Category rings gather the conversation; gold nodes carry the flagship arguments. Drag to orbit, click a node to open its lab.",
  },
  archipelago: {
    title: "The labs as an archipelago",
    blurb:
      "Five islands on a dark ocean — one per category. Flagships rise as the highest peaks. Drag to orbit, click a peak to open its lab.",
  },
  orbit: {
    title: "The labs in orbit",
    blurb:
      "Everything revolves around proof: the flagships circle closest to Artemis, every other lab on its category ring. Drag to orbit, click a node to open its lab.",
  },
  strata: {
    title: "The labs by readiness",
    blurb:
      "Concept → Build → Pilot → Live, left to right. One lane per category; a lab's position is its maturity. Drag to orbit, click a node to open its lab.",
  },
  radial: {
    title: "The labs as a tree",
    blurb:
      "Artemis at the root, five branches, every lab a leaf on its category's branch. Drag to orbit, click a leaf to open its lab.",
  },
  pantheon: {
    title: "The labs as a pantheon",
    blurb:
      "A domed hall where every lab holds a niche — five sectors, one per category — and the flagships stand in the light of the oculus. Drag to look around, click a node to open its lab.",
  },
  colosseum: {
    title: "The labs as a colosseum",
    blurb:
      "Five tiers rise around the sand, one per category; the three flagships perform in the arena. Drag to orbit, click a node to open its lab.",
  },
  agora: {
    title: "The labs as an agora",
    blurb:
      "The marketplace: every lab keeps a stall around the shared plaza, flagships nearest the bema. Drag to orbit, click a stall to open its lab.",
  },
  geodesic: {
    title: "The labs as a geodesic dome",
    blurb:
      "A lattice under tension — thirteen nodes in a triangulated shell, flagships nearest the crown. Drag to orbit, click a node to open its lab.",
  },
  octagon: {
    title: "The labs as an octagon",
    blurb:
      "A two-story octagonal hall — eight sides around an open court, flagships on the piano nobile. Drag to orbit, click a node to open its lab.",
  },
  rotonda: {
    title: "The labs as a sala rotonda",
    blurb:
      "A round mosaic hall — thirteen medallions inlaid in concentric rings beneath the oculus, flagships in the innermost ring. Drag to orbit, click a medallion to open its lab.",
  },
};

/**
 * Per-style environment. Every display style is its own universe — its own
 * sky, air, and ground — so no two views share the same black space.
 */
type AtlasEnv = {
  skyTop: string;
  skyBottom: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  starColor: string;
  starOpacity: number;
  starCount: number;
  ground?: { color: string; opacity: number; radius: number; y: number };
  /** Drafting-table grid under the scene (strata). */
  grid?: boolean;
};

const ATLAS_ENV: Record<AtlasStyle, AtlasEnv> = {
  constellation: {
    skyTop: "#04060f", skyBottom: "#0b1026", fog: "#04060f", fogNear: 40, fogFar: 120,
    starColor: "#aab4d4", starOpacity: 0.8, starCount: 700,
  },
  forum: {
    skyTop: "#0b0e1c", skyBottom: "#2b2133", fog: "#141021", fogNear: 35, fogFar: 110,
    starColor: "#c9b8d4", starOpacity: 0.5, starCount: 300,
    ground: { color: "#6b5f4c", opacity: 0.4, radius: 16, y: -0.1 },
  },
  archipelago: {
    skyTop: "#06202b", skyBottom: "#0d4253", fog: "#062a38", fogNear: 30, fogFar: 100,
    starColor: "#bfe3ea", starOpacity: 0.35, starCount: 200,
    ground: { color: "#0a3542", opacity: 0.92, radius: 42, y: -0.45 },
  },
  orbit: {
    skyTop: "#080514", skyBottom: "#1e1133", fog: "#0d0819", fogNear: 40, fogFar: 120,
    starColor: "#d4c9f0", starOpacity: 0.7, starCount: 600,
  },
  strata: {
    skyTop: "#081226", skyBottom: "#0e2140", fog: "#0a1830", fogNear: 35, fogFar: 110,
    starColor: "#7fa8d4", starOpacity: 0.3, starCount: 150, grid: true,
  },
  radial: {
    skyTop: "#04140f", skyBottom: "#0b2d1e", fog: "#06170f", fogNear: 30, fogFar: 100,
    starColor: "#b8d4a8", starOpacity: 0.4, starCount: 250,
    ground: { color: "#0a1f16", opacity: 0.6, radius: 30, y: -0.5 },
  },
  pantheon: {
    skyTop: "#171008", skyBottom: "#2e1f10", fog: "#1c130a", fogNear: 25, fogFar: 90,
    starColor: "#e8c87a", starOpacity: 0.5, starCount: 220,
    ground: { color: "#3a4152", opacity: 0.5, radius: 14.5, y: 0 },
  },
  colosseum: {
    skyTop: "#0d0a12", skyBottom: "#4d2f16", fog: "#241408", fogNear: 35, fogFar: 110,
    starColor: "#e8b878", starOpacity: 0.4, starCount: 200,
    ground: { color: "#8a7355", opacity: 0.35, radius: 34, y: -0.15 },
  },
  agora: {
    skyTop: "#0e2036", skyBottom: "#3d5c7d", fog: "#1a2c44", fogNear: 30, fogFar: 110,
    starColor: "#e8d9b0", starOpacity: 0.45, starCount: 250,
    ground: { color: "#5a6a85", opacity: 0.6, radius: 14, y: 0 },
  },
  geodesic: {
    skyTop: "#0a141f", skyBottom: "#1a2c3d", fog: "#0c1622", fogNear: 35, fogFar: 110,
    starColor: "#9fd4e8", starOpacity: 0.55, starCount: 400,
    ground: { color: "#101c28", opacity: 0.7, radius: 20, y: -0.1 },
  },
  octagon: {
    skyTop: "#141009", skyBottom: "#3a2a1a", fog: "#1d130c", fogNear: 30, fogFar: 100,
    starColor: "#e8c88a", starOpacity: 0.45, starCount: 250,
    ground: { color: "#4a3826", opacity: 0.6, radius: 16, y: -0.05 },
  },
  rotonda: {
    skyTop: "#0c1220", skyBottom: "#26314c", fog: "#101623", fogNear: 35, fogFar: 110,
    starColor: "#c8d4ea", starOpacity: 0.4, starCount: 250,
    ground: { color: "#6a7690", opacity: 0.5, radius: 16, y: -0.02 },
  },
};

const CATEGORY_COLORS: Record<LabCategory, string> = {
  construction: "#e0b65a",
  controls: "#6cb2f0",
  bid: "#4d9fe8",
  brand: "#d8c690",
  explorations: "#8a93a6",
};

const ORDER: LabCategory[] = ["construction", "controls", "bid", "brand", "explorations"];

/** Deterministic pseudo-random in [0,1) so layouts are stable across mounts. */
function rand(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

type SceneHandle = {
  setCategoryVisible: (cat: LabCategory, visible: boolean) => void;
  setFlagshipFocus: (on: boolean) => void;
  onSelect: (cb: (node: AtlasNode | null) => void) => void;
};

function useAtlasScene(
  mountRef: React.RefObject<HTMLDivElement | null>,
  nodes: AtlasNode[],
  style: AtlasStyle,
  viewport: AtlasViewport,
): SceneHandle | null {
  const [handle, setHandle] = useState<SceneHandle | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let selectCb: (node: AtlasNode | null) => void = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (cancelled || !mountRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const width = mount.clientWidth || 800;
      const vp = ATLAS_VIEWPORTS[viewport];
      const height = Math.max(vp.min, Math.min(vp.max, Math.floor(width * vp.ratio)));

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
      // Framing per style. Radial is a top-down canopy; pantheon sits the
      // visitor inside the dome; colosseum takes a three-quarter arena view.
      if (style === "archipelago") camera.position.set(0, 15, 17);
      else if (style === "strata") camera.position.set(0, 10, 22);
      else if (style === "radial") camera.position.set(0, 27, 13);
      else if (style === "pantheon") camera.position.set(0, 4, 11);
      else if (style === "colosseum") camera.position.set(0, 15, 27);
      else if (style === "agora") camera.position.set(0, 16, 21);
      else if (style === "geodesic") camera.position.set(0, 12, 27);
      else if (style === "octagon") camera.position.set(0, 13, 25);
      else if (style === "rotonda") camera.position.set(0, 20, 15);
      else camera.position.set(0, 7, 24);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 10;
      controls.maxDistance = 48;
      controls.autoRotate = !reduced;
      controls.autoRotateSpeed = 0.5;
      // Aim the orbit pivot per style: mid-dome for pantheon, mid-tiers for colosseum.
      if (style === "pantheon") controls.target.set(0, 6, 0);
      else if (style === "colosseum") controls.target.set(0, 4, 0);
      else if (style === "geodesic") controls.target.set(0, 4, 0);
      else if (style === "octagon") controls.target.set(0, 3, 0);

      const root = new THREE.Group();
      scene.add(root);

      // Environment: every style gets its own sky, air, and ground, so no
      // two universes share the same black space.
      const env = ATLAS_ENV[style];
      {
        // Gradient sky dome (BackSide, unfogged) enclosing the scene.
        const skyGeo = new THREE.SphereGeometry(95, 24, 16);
        const topC = new THREE.Color(env.skyTop);
        const botC = new THREE.Color(env.skyBottom);
        const sPos = skyGeo.attributes.position;
        const sCol = new Float32Array(sPos.count * 3);
        for (let i = 0; i < sPos.count; i++) {
          const t = THREE.MathUtils.clamp((sPos.getY(i) / 95 + 1) / 2, 0, 1);
          const c = botC.clone().lerp(topC, Math.pow(t, 1.25));
          sCol[i * 3] = c.r;
          sCol[i * 3 + 1] = c.g;
          sCol[i * 3 + 2] = c.b;
        }
        skyGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
        const sky = new THREE.Mesh(
          skyGeo,
          new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false }),
        );
        sky.renderOrder = -1;
        scene.add(sky);
      }
      scene.fog = new THREE.Fog(new THREE.Color(env.fog), env.fogNear, env.fogFar);

      // Starfield / dust, tinted per universe.
      const starGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(env.starCount * 3);
      for (let i = 0; i < env.starCount; i++) {
        const r = 45 + rand(i * 7 + 1) * 40;
        const th = rand(i * 13 + 2) * Math.PI * 2;
        const ph = Math.acos(2 * rand(i * 17 + 3) - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      root.add(
        new THREE.Points(
          starGeo,
          new THREE.PointsMaterial({ color: env.starColor, size: 0.14, transparent: true, opacity: env.starOpacity }),
        ),
      );

      // Ground plane per universe (static — it does not drift with root).
      if (env.ground) {
        const g = new THREE.Mesh(
          new THREE.CircleGeometry(env.ground.radius, 64),
          new THREE.MeshBasicMaterial({ color: env.ground.color, transparent: true, opacity: env.ground.opacity }),
        );
        g.rotation.x = -Math.PI / 2;
        g.position.y = env.ground.y;
        scene.add(g);
      }
      // Drafting-table grid for strata.
      if (env.grid) {
        const grid = new THREE.GridHelper(60, 30, 0x2a4a6a, 0x16283f);
        const gm = grid.material as THREE.Material;
        gm.transparent = true;
        gm.opacity = 0.45;
        grid.position.y = -2.6;
        scene.add(grid);
      }

      const labelScale = style === "forum" ? 1.25 : 1;
      const meshes: THREE.Mesh[] = [];
      const hitMeshes: THREE.Mesh[] = [];
      const byCategory = new Map<LabCategory, THREE.Object3D[]>();
      const hubPositions = new Map<LabCategory, THREE.Vector3>();

      function makeLabel(text: string, color: string, scale = 1) {
        const c = document.createElement("canvas");
        const font = `500 40px "Paper Mono", ui-monospace, monospace`;
        const meas = c.getContext("2d")!;
        meas.font = font;
        c.width = Math.ceil(meas.measureText(text).width) + 44;
        c.height = 84;
        const ctx = c.getContext("2d")!;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textBaseline = "middle";
        ctx.fillText(text, 22, 44);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        const sp = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }),
        );
        sp.scale.set(
          (c.width / 110) * labelScale * scale,
          (c.height / 110) * labelScale * scale,
          1,
        );
        return sp;
      }

      /** Strata style: map a lab's status label onto a 0–3 maturity stage. */
      function maturityOf(status: string): number {
        const s = status.toLowerCase();
        if (/live/.test(s)) return 3;
        if (/rc|beta|pilot/.test(s)) return 2;
        if (/v\d|alpha/.test(s)) return 1;
        return 0;
      }

      /**
       * Shared node builder used by every style: visible sphere, generous
       * invisible hit proxy (1.6u — nodes drift), and the title label.
       */
      function addNodeMesh(node: AtlasNode, p: THREE.Vector3, group: THREE.Object3D[], labelDy = 0) {
        const size = node.flagship ? 0.62 : 0.34;
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(size, 20, 20),
          new THREE.MeshBasicMaterial({
            color: node.flagship ? "#e0b65a" : CATEGORY_COLORS[node.category],
            transparent: true,
            opacity: 0.95,
          }),
        );
        mesh.position.copy(p);
        mesh.userData.node = node;
        mesh.userData.baseScale = 1;
        root.add(mesh);
        meshes.push(mesh);
        group.push(mesh);

        const hit = new THREE.Mesh(
          new THREE.SphereGeometry(1.6, 8, 8),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
        );
        hit.position.copy(p);
        hit.userData.node = node;
        hit.userData.visual = mesh;
        root.add(hit);
        hitMeshes.push(hit);
        group.push(hit);

        const label = makeLabel(node.title, node.flagship ? "#f0d49a" : "#c7cdd8");
        label.position.copy(p).add(new THREE.Vector3(0, size + 0.85 + labelDy, 0));
        root.add(label);
        group.push(label);
      }

      if (style === "constellation" || style === "forum") {
      ORDER.forEach((cat, ci) => {
        const catNodes = nodes.filter((n) => n.category === cat);
        if (catNodes.length === 0) return;
        const baseAngle = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
        const hub = new THREE.Vector3(Math.cos(baseAngle) * 10.5, 0, Math.sin(baseAngle) * 10.5);
        hubPositions.set(cat, hub);

        const hubMesh =
          style === "forum"
            ? new THREE.Mesh(
                new THREE.TorusGeometry(1.1, 0.05, 8, 48),
                new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.55 }),
              )
            : new THREE.Mesh(
                new THREE.OctahedronGeometry(0.7),
                new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], wireframe: true, transparent: true, opacity: 0.6 }),
              );
        hubMesh.position.copy(hub);
        hubMesh.rotation.x = Math.PI / 2.4;
        root.add(hubMesh);

        const group: THREE.Object3D[] = [hubMesh];
        const linePts: number[] = [];
        catNodes.forEach((node, ni) => {
          const a = baseAngle + (rand(ci * 131 + ni * 17 + 5) - 0.5) * 1.15;
          const r = 10.5 + (rand(ci * 57 + ni * 29 + 11) - 0.5) * 4.6;
          const p = new THREE.Vector3(
            Math.cos(a) * r,
            (rand(ci * 91 + ni * 37 + 23) - 0.5) * 5.4,
            Math.sin(a) * r,
          );
          const size = node.flagship ? 0.62 : 0.34;
          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 20, 20),
            new THREE.MeshBasicMaterial({
              color: node.flagship ? "#e0b65a" : CATEGORY_COLORS[cat],
              transparent: true,
              opacity: 0.95,
            }),
          );
          mesh.position.copy(p);
          mesh.userData.node = node;
          mesh.userData.baseScale = 1;
          root.add(mesh);
          meshes.push(mesh);
          group.push(mesh);

          // Invisible, generous hit target — raycast-tested, never rendered.
          // Sized larger than the visible node so clicks land while nodes drift.
          const hit = new THREE.Mesh(
            new THREE.SphereGeometry(1.6, 8, 8),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
          );
          hit.position.copy(p);
          hit.userData.node = node;
          hit.userData.visual = mesh;
          root.add(hit);
          hitMeshes.push(hit);
          group.push(hit);

          const label = makeLabel(node.title, node.flagship ? "#f0d49a" : "#c7cdd8");
          label.position.copy(p).add(new THREE.Vector3(0, size + 0.85, 0));
          root.add(label);
          group.push(label);

          linePts.push(hub.x, hub.y, hub.z, p.x, p.y, p.z);
        });
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
        const lines = new THREE.LineSegments(
          lineGeo,
          new THREE.LineBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: style === "forum" ? 0.28 : 0.16 }),
        );
        root.add(lines);
        group.push(lines);
        byCategory.set(cat, group);
      });
      } else if (style === "archipelago") {
        // Archipelago: each category is an island on a dark ocean. Flagships
        // rise as peaks. A 2.5D cartographic read — the atlas as a literal map.
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (catNodes.length === 0) return;
          const a = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const center = new THREE.Vector3(Math.cos(a) * 9.2, 0, Math.sin(a) * 9.2);
          const group: THREE.Object3D[] = [];
          const catColor = CATEGORY_COLORS[cat];
          const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(3.7, 4.1, 0.3, 48),
            new THREE.MeshBasicMaterial({ color: catColor, transparent: true, opacity: 0.1 }),
          );
          disc.position.copy(center);
          root.add(disc);
          group.push(disc);
          const contours: Array<[number, number]> = [
            [2.4, 0.38],
            [3.2, 0.2],
          ];
          for (const [rr, op] of contours) {
            const ring = new THREE.Mesh(
              new THREE.TorusGeometry(rr, 0.025, 8, 80),
              new THREE.MeshBasicMaterial({ color: catColor, transparent: true, opacity: op }),
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.set(center.x, 0.18, center.z);
            root.add(ring);
            group.push(ring);
          }
          const isl = makeLabel(labCategoryMeta[cat].label, catColor);
          isl.position.set(center.x, 3.2, center.z);
          root.add(isl);
          group.push(isl);
          catNodes.forEach((node, ni) => {
            const na = rand(ci * 131 + ni * 17 + 5) * Math.PI * 2;
            const nr = 0.7 + rand(ci * 57 + ni * 29 + 11) * 2.0;
            const p = new THREE.Vector3(
              center.x + Math.cos(na) * nr,
              0.75 + (node.flagship ? 1.0 : 0) + rand(ci * 91 + ni * 37 + 23) * 0.35,
              center.z + Math.sin(na) * nr,
            );
            addNodeMesh(node, p, group);
          });
          byCategory.set(cat, group);
        });
      } else if (style === "orbit") {
        // Orbit: flagships on the inner ring around the Artemis sun; every
        // other lab circles on its category ring. The executive read.
        const groups = new Map<LabCategory, THREE.Object3D[]>();
        ORDER.forEach((cat) => groups.set(cat, []));
        const sun = new THREE.Mesh(
          new THREE.SphereGeometry(1.25, 28, 28),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", transparent: true, opacity: 0.95 }),
        );
        root.add(sun);
        const sunShell = new THREE.Mesh(
          new THREE.WireframeGeometry(new THREE.SphereGeometry(1.7, 12, 12)),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", transparent: true, opacity: 0.28 }),
        );
        root.add(sunShell);
        const sunLabel = makeLabel("Artemis", "#f0d49a");
        sunLabel.position.set(0, 2.7, 0);
        root.add(sunLabel);
        const flagRingR = 5.4;
        const flagRing = new THREE.Mesh(
          new THREE.TorusGeometry(flagRingR, 0.03, 8, 96),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", transparent: true, opacity: 0.4 }),
        );
        flagRing.rotation.x = Math.PI / 2;
        root.add(flagRing);
        const flagships = nodes.filter((n) => n.flagship);
        flagships.forEach((node, i) => {
          const fa = (i / Math.max(flagships.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const p = new THREE.Vector3(
            Math.cos(fa) * flagRingR,
            (rand(i * 31 + 7) - 0.5) * 1.4,
            Math.sin(fa) * flagRingR,
          );
          addNodeMesh(node, p, groups.get(node.category)!);
        });
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat && !n.flagship);
          if (catNodes.length === 0) return;
          const R = 9.2 + ci * 1.7;
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(R, 0.02, 8, 128),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.3 }),
          );
          ring.rotation.x = Math.PI / 2;
          root.add(ring);
          const group = groups.get(cat)!;
          group.push(ring);
          const baseA = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          catNodes.forEach((node, ni) => {
            const oa = baseA + (ni - (catNodes.length - 1) / 2) * 0.38;
            const p = new THREE.Vector3(
              Math.cos(oa) * R,
              (rand(ci * 77 + ni * 13 + 3) - 0.5) * 1.8,
              Math.sin(oa) * R,
            );
            addNodeMesh(node, p, group);
          });
          byCategory.set(cat, group);
        });
        // Categories whose only nodes are flagships still need their group registered.
        ORDER.forEach((cat) => {
          if (!byCategory.has(cat)) byCategory.set(cat, groups.get(cat)!);
        });
      } else if (style === "strata") {
        // Strata: maturity along x (Concept → Build → Pilot → Live), one lane
        // per category. The finance read — readiness at a glance.
        const laneZ = (ci: number) => (ci - (ORDER.length - 1) / 2) * 3.6;
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (catNodes.length === 0) return;
          const group: THREE.Object3D[] = [];
          const z = laneZ(ci);
          const baseline = new THREE.Mesh(
            new THREE.BoxGeometry(21, 0.05, 0.05),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.22 }),
          );
          baseline.position.set(0, -1.7, z);
          root.add(baseline);
          group.push(baseline);
          const laneLabel = makeLabel(labCategoryMeta[cat].label, CATEGORY_COLORS[cat]);
          laneLabel.position.set(-12.4, 0, z);
          root.add(laneLabel);
          group.push(laneLabel);
          catNodes.forEach((node, ni) => {
            const m = maturityOf(node.status);
            const p = new THREE.Vector3(
              -9 + m * 6 + (rand(ci * 41 + ni * 23 + 9) - 0.5) * 1.6,
              (rand(ci * 67 + ni * 11 + 5) - 0.5) * 1.4,
              z + (rand(ci * 83 + ni * 19 + 13) - 0.5) * 1.2,
            );
            // Stagger labels so labs sharing a maturity stage stay readable.
            addNodeMesh(node, p, group, (ni % 3) * 0.65);
          });
          byCategory.set(cat, group);
        });
        const stages = ["Concept", "Build", "Pilot", "Live"];
        stages.forEach((s, si) => {
          const tick = makeLabel(s, "#c7cdd8", 1.2);
          tick.position.set(-9 + si * 6, -2.4, laneZ(ORDER.length - 1));
          root.add(tick);
        });
      } else if (style === "pantheon") {
        // Pantheon: a domed hall viewed from inside. Five sectors of niches —
        // one per category — rise across the dome; the flagships stand in the
        // shaft of light beneath the oculus.
        const DOME_R = 13;
        const stone = new THREE.MeshBasicMaterial({ color: "#9aa2b5", transparent: true, opacity: 0.5 });
        // Rotunda floor comes from the environment ground.
        // Colonnade ring.
        for (let k = 0; k < 16; k++) {
          const ca = (k / 16) * Math.PI * 2;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 8.5, 10), stone);
          col.position.set(Math.cos(ca) * 12.2, 4.25, Math.sin(ca) * 12.2);
          root.add(col);
        }
        const cornice = new THREE.Mesh(
          new THREE.TorusGeometry(12.2, 0.18, 8, 96),
          new THREE.MeshBasicMaterial({ color: "#9aa2b5", transparent: true, opacity: 0.55 }),
        );
        cornice.rotation.x = Math.PI / 2;
        cornice.position.y = 8.5;
        root.add(cornice);
        // Coffer bands across the dome.
        for (const [elDeg, op] of [
          [28, 0.3],
          [46, 0.25],
          [64, 0.2],
        ] as const) {
          const el = (elDeg * Math.PI) / 180;
          const band = new THREE.Mesh(
            new THREE.TorusGeometry(DOME_R * Math.cos(el), 0.05, 8, 96),
            new THREE.MeshBasicMaterial({ color: "#8a93a6", transparent: true, opacity: op }),
          );
          band.rotation.x = Math.PI / 2;
          band.position.y = DOME_R * Math.sin(el);
          root.add(band);
        }
        // Oculus ring + light shaft.
        const oculus = new THREE.Mesh(
          new THREE.TorusGeometry(1.6, 0.12, 8, 48),
          new THREE.MeshBasicMaterial({ color: "#f0d49a", transparent: true, opacity: 0.9 }),
        );
        oculus.rotation.x = Math.PI / 2;
        oculus.position.y = DOME_R;
        root.add(oculus);
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 3.4, DOME_R, 24, 1, true),
          new THREE.MeshBasicMaterial({
            color: "#f0d49a",
            transparent: true,
            opacity: 0.07,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        shaft.position.y = DOME_R / 2;
        root.add(shaft);
        // Enclosing inner dome: a warm marble shell so the hall feels
        // interior, not floating in void.
        const shell = new THREE.Mesh(
          new THREE.SphereGeometry(DOME_R + 0.9, 32, 24),
          new THREE.MeshBasicMaterial({
            color: "#2a1e12",
            transparent: true,
            opacity: 0.55,
            side: THREE.BackSide,
            fog: false,
          }),
        );
        root.add(shell);
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (catNodes.length === 0) return;
          const group: THREE.Object3D[] = [];
          const baseA = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const domePt = (az: number, elDeg: number) => {
            const el = (elDeg * Math.PI) / 180;
            return new THREE.Vector3(
              DOME_R * Math.cos(el) * Math.cos(az),
              DOME_R * Math.sin(el),
              DOME_R * Math.cos(el) * Math.sin(az),
            );
          };
          catNodes
            .filter((n) => !n.flagship)
            .forEach((node, ni, arr) => {
              const az = baseA + (ni - (arr.length - 1) / 2) * 0.26;
              const elDeg = 30 + (ni % 3) * 13 + rand(ci * 53 + ni * 29 + 7) * 6;
              addNodeMesh(node, domePt(az, elDeg), group, (ni % 2) * 0.6);
            });
          // Flagships ascend into the oculus light.
          catNodes
            .filter((n) => n.flagship)
            .forEach((node, fi) => {
              addNodeMesh(node, domePt(baseA + (fi - 0.5) * 0.5, 76), group);
            });
          const lab = makeLabel(labCategoryMeta[cat].label, CATEGORY_COLORS[cat]);
          lab.position.copy(domePt(baseA, 19));
          root.add(lab);
          group.push(lab);
          byCategory.set(cat, group);
        });
      } else if (style === "colosseum") {
        // Colosseum: a tiered elliptical arena. Five tiers — one per category —
        // rise around the sand; the flagships perform in the arena.
        const tierOf = (ci: number) => ({ y: 2.4 + ci * 2.0, rx: 9.0 + ci * 2.1, rz: 6.4 + ci * 1.5 });
        // Arena sand.
        const sand = new THREE.Mesh(
          new THREE.CircleGeometry(6.4, 48),
          new THREE.MeshBasicMaterial({ color: "#c8a86a", transparent: true, opacity: 0.22 }),
        );
        sand.rotation.x = -Math.PI / 2;
        sand.scale.set(1, 0.72, 1);
        root.add(sand);
        // Flagships perform in the arena; they stay in their category groups
        // so the category filters still catch them.
        const groups = new Map<LabCategory, THREE.Object3D[]>();
        ORDER.forEach((cat) => groups.set(cat, []));
        nodes
          .filter((n) => n.flagship)
          .forEach((node, i, arr) => {
            const fa = (i / Math.max(arr.length, 1)) * Math.PI * 2 - Math.PI / 2;
            addNodeMesh(node, new THREE.Vector3(Math.cos(fa) * 3.1, 0.9, Math.sin(fa) * 2.2), groups.get(node.category)!);
          });
        ORDER.forEach((cat, ci) => {
          const { y, rx, rz } = tierOf(ci);
          const group = groups.get(cat)!;
          // Seating step: a flat elliptical band in the category color.
          const step = new THREE.Mesh(
            new THREE.RingGeometry(0.84, 1.0, 96),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.1, side: THREE.DoubleSide }),
          );
          step.rotation.x = -Math.PI / 2;
          step.scale.set(rx, rz, 1);
          step.position.y = y - 0.05;
          root.add(step);
          group.push(step);
          // Tier edge ring.
          const edge = new THREE.Mesh(
            new THREE.TorusGeometry(1, 0.04, 8, 128),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.35 }),
          );
          edge.rotation.x = Math.PI / 2;
          edge.scale.set(rx, rz, 1);
          edge.position.y = y;
          root.add(edge);
          group.push(edge);
          const catNodes = nodes.filter((n) => n.category === cat && !n.flagship);
          const baseA = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          catNodes.forEach((node, ni) => {
            const a = baseA + (catNodes.length === 1 ? 0 : (ni / (catNodes.length - 1) - 0.5) * 1.8);
            addNodeMesh(node, new THREE.Vector3(Math.cos(a) * rx, y + 0.55, Math.sin(a) * rz), group, (ni % 2) * 0.6);
          });
          const lab = makeLabel(labCategoryMeta[cat].label, CATEGORY_COLORS[cat]);
          lab.position.set(Math.cos(baseA) * rx, y + 2.0, Math.sin(baseA) * rz);
          root.add(lab);
          group.push(lab);
          byCategory.set(cat, group);
        });
        // Ruined outer wall: a broken travertine arc around the tiers.
        const wall = new THREE.Mesh(
          new THREE.CylinderGeometry(19.5, 19.5, 10, 64, 1, true, Math.PI * 0.15, Math.PI * 1.1),
          new THREE.MeshBasicMaterial({ color: "#b8a888", transparent: true, opacity: 0.16, side: THREE.DoubleSide }),
        );
        wall.position.y = 5;
        wall.scale.set(1, 1, 0.72);
        root.add(wall);
      } else if (style === "agora") {
        // Agora: the marketplace. Every lab keeps a stall around the shared
        // plaza; flagships hold the stalls nearest the central bema.
        // (Plaza floor comes from the environment ground.)
        for (const [rr, op] of [
          [5, 0.3],
          [9.5, 0.2],
          [13, 0.28],
        ] as const) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(rr, 0.03, 8, 96),
            new THREE.MeshBasicMaterial({ color: "#8a93a6", transparent: true, opacity: op }),
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.y = 0.02;
          root.add(ring);
        }
        // Bema: the speaker's platform at the center.
        const bemaBase = new THREE.Mesh(
          new THREE.CylinderGeometry(2.2, 2.5, 0.5, 32),
          new THREE.MeshBasicMaterial({ color: "#9aa2b5", transparent: true, opacity: 0.6 }),
        );
        bemaBase.position.y = 0.25;
        root.add(bemaBase);
        const bemaTop = new THREE.Mesh(
          new THREE.CylinderGeometry(1.4, 1.6, 0.5, 32),
          new THREE.MeshBasicMaterial({ color: "#9aa2b5", transparent: true, opacity: 0.6 }),
        );
        bemaTop.position.y = 0.75;
        root.add(bemaTop);
        const bemaLabel = makeLabel("Artemis", "#f0d49a");
        bemaLabel.position.set(0, 2.7, 0);
        root.add(bemaLabel);
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (catNodes.length === 0) return;
          const group: THREE.Object3D[] = [];
          const a = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const cx = Math.cos(a) * 10.5;
          const cz = Math.sin(a) * 10.5;
          // Market rug under this category's stalls.
          const rug = new THREE.Mesh(
            new THREE.CircleGeometry(3.4, 40),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.08 }),
          );
          rug.rotation.x = -Math.PI / 2;
          rug.position.set(cx, 0.03, cz);
          root.add(rug);
          group.push(rug);
          const lab = makeLabel(labCategoryMeta[cat].label, CATEGORY_COLORS[cat]);
          lab.position.set(cx, 3.6, cz);
          root.add(lab);
          group.push(lab);
          catNodes.forEach((node, ni) => {
            const na = rand(ci * 131 + ni * 17 + 5) * Math.PI * 2;
            const nr = 0.6 + rand(ci * 57 + ni * 29 + 11) * 1.9;
            const px = cx + Math.cos(na) * nr;
            const pz = cz + Math.sin(na) * nr;
            const plinthH = node.flagship ? 1.5 : 0.9;
            // Stall table.
            const table = new THREE.Mesh(
              new THREE.CylinderGeometry(0.5, 0.62, plinthH, 12),
              new THREE.MeshBasicMaterial({ color: "#6b5b3e", transparent: true, opacity: 0.85 }),
            );
            table.position.set(px, plinthH / 2, pz);
            root.add(table);
            group.push(table);
            // Awning in the category color — gold for flagships.
            const awn = new THREE.Mesh(
              new THREE.PlaneGeometry(1.7, 1.7),
              new THREE.MeshBasicMaterial({
                color: node.flagship ? "#e0b65a" : CATEGORY_COLORS[cat],
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
              }),
            );
            awn.position.set(px, plinthH + 1.2, pz);
            awn.rotation.x = -Math.PI / 2 + 0.35;
            awn.rotation.z = rand(ci * 17 + ni * 41 + 3) * Math.PI;
            root.add(awn);
            group.push(awn);
            addNodeMesh(node, new THREE.Vector3(px, plinthH + 0.55, pz), group, (ni % 2) * 0.6);
          });
          byCategory.set(cat, group);
        });
      } else if (style === "geodesic") {
        // Geodesic: a triangulated lattice dome under tension. Labs ride the
        // shell; flagships sit nearest the crown.
        const DOME_R = 14;
        // Wireframe lattice — the lower hemisphere sinks beneath the ground
        // disc, leaving a clean dome.
        const lattice = new THREE.Mesh(
          new THREE.IcosahedronGeometry(DOME_R, 2),
          new THREE.MeshBasicMaterial({ color: "#9fd4e8", wireframe: true, transparent: true, opacity: 0.28 }),
        );
        lattice.position.y = 0.5;
        root.add(lattice);
        // Crown hub.
        const crown = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.9),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", wireframe: true, transparent: true, opacity: 0.7 }),
        );
        crown.position.y = DOME_R + 0.5;
        root.add(crown);
        const shellPt = (az: number, elDeg: number) => {
          const el = (elDeg * Math.PI) / 180;
          return new THREE.Vector3(
            Math.cos(az) * Math.cos(el) * DOME_R,
            Math.sin(el) * DOME_R + 0.5,
            Math.sin(az) * Math.cos(el) * DOME_R,
          );
        };
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (!catNodes.length) return;
          const group: THREE.Object3D[] = [];
          const baseA = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const regular = catNodes.filter((n) => !n.flagship);
          const flags = catNodes.filter((n) => n.flagship);
          const sectorW = (Math.PI * 2) / ORDER.length;
          regular.forEach((node, ni) => {
            const az = baseA + (regular.length > 1 ? (ni / (regular.length - 1) - 0.5) * sectorW * 0.8 : 0);
            const el = 16 + (ni % 3) * 14 + rand(ci * 31 + ni * 13) * 6;
            addNodeMesh(node, shellPt(az, el), group, (ni % 2) * 0.5);
          });
          flags.forEach((node, ni) => {
            const az = baseA + (flags.length > 1 ? (ni / (flags.length - 1) - 0.5) * 0.3 : 0);
            addNodeMesh(node, shellPt(az, 72), group, 0);
          });
          // Sector name rides the dome base.
          const bl = makeLabel(cat, "#9fd4e8", 1.5);
          const bp = shellPt(baseA, 6);
          bp.multiplyScalar(1.12);
          bp.y = 0.6;
          bl.position.copy(bp);
          root.add(bl);
          group.push(bl);
          byCategory.set(cat, group);
        });
      } else if (style === "octagon") {
        // Octagon: a two-story octagonal hall. Eight sides ring an open
        // court; flagships hold the piano nobile (upper level).
        const SIDES = 8;
        const R = 9;
        const LEVELS = [0, 5];
        const beamM = new THREE.LineBasicMaterial({ color: "#a08c68", transparent: true, opacity: 0.6 });
        const stoneM = new THREE.MeshBasicMaterial({ color: "#8f7d5e", transparent: true, opacity: 0.55 });
        // Upper floor slab + ring beams.
        const slab = new THREE.Mesh(
          new THREE.CylinderGeometry(R, R, 0.25, 8),
          new THREE.MeshBasicMaterial({ color: "#4a3826", transparent: true, opacity: 0.55 }),
        );
        slab.position.y = LEVELS[1] - 0.12;
        root.add(slab);
        for (const y of LEVELS) {
          const beam = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.CylinderGeometry(R, R, 0.18, 8)),
            beamM,
          );
          beam.position.y = y + 0.1;
          root.add(beam);
        }
        // Eight columns at the vertices, full height.
        for (let k = 0; k < SIDES; k++) {
          const a = (k / SIDES) * Math.PI * 2;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, LEVELS[1], 8), stoneM);
          col.position.set(Math.cos(a) * R, LEVELS[1] / 2, Math.sin(a) * R);
          root.add(col);
        }
        // Central court marker.
        const court = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.8),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", wireframe: true, transparent: true, opacity: 0.7 }),
        );
        court.position.y = 3.2;
        root.add(court);
        const courtLabel = makeLabel("Artemis", "#e8c88a", 1.6);
        courtLabel.position.y = 4.4;
        root.add(courtLabel);
        // Place labs: flagships on the upper level, the rest around the
        // ground level first, then the upper level.
        const init = new Map<LabCategory, THREE.Object3D[]>();
        for (const c of ORDER) init.set(c, []);
        const vertex = (k: number, lv: number) => {
          const a = (k / SIDES) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * (R - 1.7), lv + 0.9, Math.sin(a) * (R - 1.7));
        };
        const flags = nodes.filter((n) => n.flagship);
        const rest = nodes.filter((n) => !n.flagship);
        flags.forEach((node, fi) => {
          addNodeMesh(node, vertex(fi % SIDES, LEVELS[1]), init.get(node.category)!, 0);
        });
        rest.forEach((node, ri) => {
          const lv = ri < SIDES ? LEVELS[0] : LEVELS[1];
          addNodeMesh(node, vertex((ri + flags.length) % SIDES, lv), init.get(node.category)!, (ri % 2) * 0.5);
        });
        // Category names above the upper beam, near their first lab.
        for (const c of ORDER) {
          const objs = init.get(c)!;
          if (!objs.length) continue;
          const first = objs[0].position;
          const la = Math.atan2(first.z, first.x);
          const label = makeLabel(c, "#e8c88a", 1.5);
          label.position.set(Math.cos(la) * (R - 1.7), LEVELS[1] + 2.4, Math.sin(la) * (R - 1.7));
          root.add(label);
          objs.push(label);
        }
        for (const c of ORDER) byCategory.set(c, init.get(c)!);
      } else if (style === "rotonda") {
        // Sala Rotonda: the mosaic floor is the protagonist. Concentric
        // inlaid rings; the labs are medallions set into the floor;
        // flagships in the innermost ring around the central medallion.
        const mosaicCols = ["#c8a24a", "#8a2f2b", "#3f6b5a", "#b8b0a0", "#c8a24a"];
        const ringRadii = [3.2, 5.2, 7.4, 9.6, 11.8];
        ringRadii.forEach((rr, i) => {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(rr - 0.55, rr, 96),
            new THREE.MeshBasicMaterial({
              color: mosaicCols[i % mosaicCols.length],
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide,
            }),
          );
          ring.rotation.x = -Math.PI / 2;
          ring.position.y = 0.02 + i * 0.002;
          root.add(ring);
        });
        // Central medallion.
        const med = new THREE.Mesh(
          new THREE.CircleGeometry(1.6, 48),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
        );
        med.rotation.x = -Math.PI / 2;
        med.position.y = 0.03;
        root.add(med);
        const medLabel = makeLabel("Artemis", "#f0d49a", 1.8);
        medLabel.position.y = 2.2;
        root.add(medLabel);
        // Perimeter columns.
        const colM = new THREE.MeshBasicMaterial({ color: "#9aa2b5", transparent: true, opacity: 0.5 });
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 7, 10), colM);
          col.position.set(Math.cos(a) * 13.2, 3.5, Math.sin(a) * 13.2);
          root.add(col);
        }
        // Oculus hint above.
        const oculus = new THREE.Mesh(
          new THREE.RingGeometry(1.6, 2.4, 48),
          new THREE.MeshBasicMaterial({ color: "#f0d49a", transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
        );
        oculus.rotation.x = -Math.PI / 2;
        oculus.position.y = 12;
        root.add(oculus);
        // Medallion settings + nodes.
        const settingM = new THREE.MeshBasicMaterial({ color: "#141a28", transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const init = new Map<LabCategory, THREE.Object3D[]>();
        for (const c of ORDER) init.set(c, []);
        const flags = nodes.filter((n) => n.flagship);
        const rest = nodes.filter((n) => !n.flagship);
        const place = (node: AtlasNode, rr: number, az: number, stagger: number) => {
          const x = Math.cos(az) * rr;
          const z = Math.sin(az) * rr;
          const setting = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), settingM);
          setting.rotation.x = -Math.PI / 2;
          setting.position.set(x, 0.045, z);
          root.add(setting);
          const group = init.get(node.category)!;
          group.push(setting);
          addNodeMesh(node, new THREE.Vector3(x, 0.75, z), group, stagger);
        };
        flags.forEach((node, fi) => {
          place(node, ringRadii[0], (fi / Math.max(flags.length, 1)) * Math.PI * 2 + 0.5, 0);
        });
        rest.forEach((node, ri) => {
          const rr = ringRadii[1 + (ri % (ringRadii.length - 1))];
          const az = (ri / rest.length) * Math.PI * 2 + rand(ri * 29 + 7) * 0.6;
          place(node, rr, az, (ri % 2) * 0.7);
        });
        // Category names at the outer ring, near their first medallion.
        for (const c of ORDER) {
          const objs = init.get(c)!;
          const nodeObj = objs.find((o) => o.userData.baseY !== undefined);
          if (!nodeObj) continue;
          const la = Math.atan2(nodeObj.position.z, nodeObj.position.x);
          const label = makeLabel(c, "#c8d4ea", 1.5);
          label.position.set(Math.cos(la) * 13.0, 1.4, Math.sin(la) * 13.0);
          root.add(label);
          objs.push(label);
        }
        for (const c of ORDER) byCategory.set(c, init.get(c)!);
      } else {
        // Radial: Artemis at the root, one branch per category, every lab a
        // leaf along its branch. The hierarchy read.
        const hubCore = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.0),
          new THREE.MeshBasicMaterial({ color: "#e0b65a", wireframe: true, transparent: true, opacity: 0.7 }),
        );
        root.add(hubCore);
        const hubLabel = makeLabel("Artemis", "#f0d49a");
        hubLabel.position.set(0, 2.3, 0);
        root.add(hubLabel);
        ORDER.forEach((cat, ci) => {
          const catNodes = nodes.filter((n) => n.category === cat);
          if (catNodes.length === 0) return;
          const group: THREE.Object3D[] = [];
          const ra = (ci / ORDER.length) * Math.PI * 2 - Math.PI / 2;
          const dir = new THREE.Vector3(Math.cos(ra), 0, Math.sin(ra));
          const far = 9 + catNodes.length * 3.6;
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            dir.clone().multiplyScalar(far * 0.5).add(new THREE.Vector3(0, 1.4, 0)),
            dir.clone().multiplyScalar(far),
          );
          const branch = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 40, 0.035, 6),
            new THREE.MeshBasicMaterial({ color: CATEGORY_COLORS[cat], transparent: true, opacity: 0.35 }),
          );
          root.add(branch);
          group.push(branch);
          catNodes.forEach((node, ni) => {
            // Leaves start well clear of the hub so labels never pile at the root.
            const t = catNodes.length === 1 ? 0.7 : 0.45 + (ni / (catNodes.length - 1)) * 0.5;
            const p = curve.getPoint(t);
            p.y += (rand(ci * 101 + ni * 43 + 17) - 0.5) * 1.1;
            addNodeMesh(node, p, group, (ni % 2) * 0.7);
            // Push this node's label outward along the branch (away from the
            // hub) instead of straight up — labels radiate instead of stacking.
            const lbl = group[group.length - 1] as THREE.Sprite;
            lbl.position
              .copy(p)
              .addScaledVector(dir, 2.1)
              .add(new THREE.Vector3(0, 0.9 + (ni % 2) * 0.7, 0));
            lbl.scale.multiplyScalar(0.85);
          });
          byCategory.set(cat, group);
        });
      }

      // Interaction: hover highlight + click select.
      const ray = new THREE.Raycaster();
      const ptr = new THREE.Vector2();
      let hovered: THREE.Mesh | null = null;
      let selected: THREE.Mesh | null = null;

      function pick(ev: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        ptr.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        ptr.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        ray.setFromCamera(ptr, camera);
        const hits = ray.intersectObjects(hitMeshes.filter((m) => m.visible));
        const hit = (hits[0]?.object as THREE.Mesh | undefined) ?? null;
        return hit ? ((hit.userData.visual as THREE.Mesh) ?? null) : null;
      }

      function setHover(mesh: THREE.Mesh | null) {
        if (hovered && hovered !== selected) hovered.scale.setScalar(hovered.userData.baseScale);
        hovered = mesh;
        if (hovered) {
          hovered.scale.setScalar(hovered.userData.baseScale * 1.5);
          renderer.domElement.style.cursor = "pointer";
        } else {
          renderer.domElement.style.cursor = "";
        }
      }

      const onMove = (ev: PointerEvent) => setHover(pick(ev));
      // Drag guard: a click that moved more than a few pixels was an orbit drag,
      // not a node selection.
      let downX = 0;
      let downY = 0;
      let hovering = false;
      const onDown = (ev: PointerEvent) => {
        downX = ev.clientX;
        downY = ev.clientY;
      };
      const onEnter = () => {
        hovering = true;
      };
      const onLeave = () => {
        hovering = false;
        setHover(null);
      };
      const onClick = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) return;
        const mesh = pick(ev);
        if (selected && selected !== mesh) selected.scale.setScalar(selected.userData.baseScale);
        selected = mesh;
        if (selected) selected.scale.setScalar(selected.userData.baseScale * 1.7);
        selectCb(mesh ? (mesh.userData.node as AtlasNode) : null);
      };
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerenter", onEnter);
      renderer.domElement.addEventListener("pointerleave", onLeave);
      renderer.domElement.addEventListener("click", onClick);

      const clock = new THREE.Clock();
      let raf = 0;
      function tick() {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        // Pause the drift while the visitor's pointer is over the canvas —
        // moving targets are miserable to click.
        if (!reduced && !hovering) root.rotation.y += dt * 0.03;
        controls.autoRotate = !reduced && !hovering;
        // Flagship pulse.
        for (const m of meshes) {
          const node = m.userData.node as AtlasNode;
          if (node.flagship && m !== hovered && m !== selected && !reduced) {
            m.scale.setScalar(m.userData.baseScale * (1 + 0.12 * Math.sin(t * 2.2)));
          }
        }
        controls.update();
        renderer.render(scene, camera);
      }
      tick();

      function onResize() {
        const w = mount!.clientWidth || 800;
        const vpr = ATLAS_VIEWPORTS[viewport];
        const h = Math.max(vpr.min, Math.min(vpr.max, Math.floor(w * vpr.ratio)));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      setHandle({
        setCategoryVisible: (cat, visible) => {
          for (const o of byCategory.get(cat) ?? []) {
            o.visible = visible;
            o.traverse((c) => {
              if (c instanceof THREE.Mesh && c.userData.node) c.visible = visible;
            });
          }
          // Re-sync mesh visibility list (labels/lines handled by group).
          for (const m of meshes) {
            const n = m.userData.node as AtlasNode;
            if (n.category === cat) m.visible = visible;
          }
        },
        setFlagshipFocus: (on) => {
          for (const m of meshes) {
            const n = m.userData.node as AtlasNode;
            const mat = m.material as THREE.MeshBasicMaterial;
            mat.opacity = on ? (n.flagship ? 1 : 0.18) : 0.95;
          }
        },
        onSelect: (cb) => {
          selectCb = cb;
        },
      });

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerenter", onEnter);
        renderer.domElement.removeEventListener("pointerleave", onLeave);
        renderer.domElement.removeEventListener("click", onClick);
        controls.dispose();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.LineSegments) {
            o.geometry.dispose();
            const mat = o.material as THREE.Material | THREE.Material[];
            (Array.isArray(mat) ? mat : [mat]).forEach((mm) => {
              const withMap = mm as THREE.SpriteMaterial;
              if (withMap.map) withMap.map.dispose();
              mm.dispose();
            });
          }
        });
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [mountRef, style, viewport]); // eslint-disable-line react-hooks/exhaustive-deps

  return handle;
}

/**
 * LabsAtlas — the 3D constellation view for /labs.
 *
 * three.js loads only when this component mounts (i.e. only when the visitor
 * picks the Atlas view). One shared canvas, nodes clustered by category,
 * flagships in gold. Reduced-motion visitors get a static scene.
 */
export function LabsAtlas({
  nodes,
  style,
  onStyleChange,
}: {
  nodes: AtlasNode[];
  style: AtlasStyle;
  onStyleChange: (s: AtlasStyle) => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hiddenCats, setHiddenCats] = useState<Set<LabCategory>>(new Set());
  const [flagshipFocus, setFlagshipFocus] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [selected, setSelected] = useState<AtlasNode | null>(null);
  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState<AtlasViewport>("standard");

  // Remount the scene when the display style or viewport changes.
  const [sceneKey, setSceneKey] = useState(0);
  const handle = useAtlasScene(mountRef, nodes, style, viewport);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(VIEWPORT_KEY);
      if (v === "compact" || v === "standard" || v === "cinematic") setViewport(v);
    } catch {
      /* private mode — default stands */
    }
  }, []);

  useEffect(() => {
    setReady(!!handle);
    handle?.onSelect(setSelected);
  }, [handle]);

  useEffect(() => {
    if (!handle) return;
    for (const cat of ORDER) handle.setCategoryVisible(cat, !hiddenCats.has(cat));
  }, [handle, hiddenCats, sceneKey]);

  useEffect(() => {
    handle?.setFlagshipFocus(flagshipFocus);
  }, [handle, flagshipFocus, sceneKey]);

  const visibleNodes = useMemo(
    () => nodes.filter((n) => !hiddenCats.has(n.category)),
    [nodes, hiddenCats],
  );
  const flagships = useMemo(() => nodes.filter((n) => n.flagship), [nodes]);
  const counts = useMemo(() => {
    const m = new Map<LabCategory, number>();
    for (const n of nodes) m.set(n.category, (m.get(n.category) ?? 0) + 1);
    return m;
  }, [nodes]);

  function toggleCat(cat: LabCategory) {
    setHiddenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setSelected(null);
  }

  function switchStyle(s: AtlasStyle) {
    if (s === style) return;
    onStyleChange(s);
    setSelected(null);
    setSceneKey((k) => k + 1);
  }

  function switchViewport(v: AtlasViewport) {
    if (v === viewport) return;
    setViewport(v);
    try {
      window.localStorage.setItem(VIEWPORT_KEY, v);
    } catch {
      /* ignore */
    }
    setSelected(null);
    setSceneKey((k) => k + 1);
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {ORDER.map((cat) => {
            const active = !hiddenCats.has(cat);
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCat(cat)}
                className={`rounded-full border px-3 py-1.5 font-papermono text-xs transition-colors ${
                  active
                    ? "border-gold/50 bg-gold/10 text-gold-soft"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                  aria-hidden
                />
                {labCategoryMeta[cat].label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-pressed={flagshipFocus}
          onClick={() => setFlagshipFocus((v) => !v)}
          className={`rounded-full border px-3 py-1.5 font-papermono text-xs transition-colors ${
            flagshipFocus
              ? "border-gold/60 bg-gold/15 text-gold-soft"
              : "border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          ◈ Flagships
        </button>
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-border/60 p-1" role="group" aria-label="Display style">
          {ATLAS_STYLES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={style === s}
              onClick={() => switchStyle(s)}
              className={`rounded-full px-3 py-1 font-papermono text-xs capitalize transition-colors ${
                style === s ? "bg-gold/15 text-gold-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-border/60 p-1" role="group" aria-label="Canvas size">
          {(Object.keys(ATLAS_VIEWPORTS) as AtlasViewport[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={viewport === v}
              onClick={() => switchViewport(v)}
              className={`rounded-full px-3 py-1 font-papermono text-xs transition-colors ${
                viewport === v ? "bg-gold/15 text-gold-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {ATLAS_VIEWPORTS[v].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={consoleOpen}
          onClick={() => setConsoleOpen((v) => !v)}
          className={`rounded-full border px-3 py-1.5 font-papermono text-xs transition-colors ${
            consoleOpen
              ? "border-gold/60 bg-gold/15 text-gold-soft"
              : "border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          Master console
        </button>
      </div>

      {/* Canvas */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-lunar/60">
        <div key={sceneKey} ref={mountRef} className="w-full" role="img"
          aria-label="3D constellation of Artemis labs. Use the lab list below for keyboard navigation." />
        {!ready ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="font-papermono text-xs text-muted-foreground">charting the constellation…</p>
          </div>
        ) : null}
        {selected ? (
          <div className="absolute right-4 top-4 w-64 rounded-xl border border-gold/30 bg-navy-deep/90 p-5 shadow-panel backdrop-blur">
            <p className="font-papermono text-[0.62rem] uppercase tracking-wider text-signal-soft">
              {labCategoryMeta[selected.category].label}
              {selected.flagship ? " · ◈ flagship" : ""}
            </p>
            <p className="display-serif mt-2 text-xl text-parchment">{selected.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">{selected.description}</p>
            <p className="mt-1 font-papermono text-xs text-muted-foreground">{selected.status}</p>
            <div className="mt-4 flex gap-2">
              <Link
                href={selected.href}
                className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-lunar transition-colors hover:bg-gold-soft"
              >
                Open lab
              </Link>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md border border-border/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Master console */}
      {consoleOpen ? (
        <div className="mt-4 rounded-2xl border border-border/60 bg-navy-deep/50 p-5">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="font-papermono text-[0.62rem] uppercase tracking-wider text-signal-soft">
              Master console
            </p>
            {ORDER.map((cat) => (
              <p key={cat} className="font-papermono text-xs text-muted-foreground">
                <span style={{ color: CATEGORY_COLORS[cat] }} aria-hidden>● </span>
                {labCategoryMeta[cat].label}: {counts.get(cat) ?? 0}
              </p>
            ))}
            <p className="font-papermono text-xs text-gold-soft">◈ flagships: {flagships.length}</p>
          </div>
          <div className="mt-4" aria-hidden>
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="atlas-meter h-full w-1/3 rounded-full bg-gradient-to-r from-gold/70 to-gold-soft" />
            </div>
            <p className="mt-2 font-papermono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
              live meter · constellation activity
            </p>
          </div>
        </div>
      ) : null}

      {/* Keyboard/screen-reader complete lab list */}
      <div className="mt-6">
        <p className="font-papermono text-[0.62rem] uppercase tracking-wider text-signal-soft">
          All labs · {visibleNodes.length}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {visibleNodes.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-gold/45 hover:text-gold"
              >
                {n.flagship ? <span className="text-gold-soft" aria-hidden>◈</span> : null}
                {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
