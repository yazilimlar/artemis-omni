"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { labCategoryMeta, type LabCategory } from "@/data/labs-editorial";

export type AtlasNode = {
  id: string;
  title: string;
  category: LabCategory;
  flagship: boolean;
  href: string;
  status: string;
};

export type AtlasStyle = "constellation" | "forum";

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
  report?: (msg: string) => void,
): SceneHandle | null {
  const [handle, setHandle] = useState<SceneHandle | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let selectCb: (node: AtlasNode | null) => void = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed || !mountRef.current) return;
      report?.("debug: three.js loaded, building scene");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const width = mount.clientWidth || 800;
      const height = Math.max(420, Math.min(640, Math.floor(width * 0.55)));

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
      camera.position.set(0, 7, 24);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 10;
      controls.maxDistance = 48;
      controls.autoRotate = !reduced;
      controls.autoRotateSpeed = 0.5;

      const root = new THREE.Group();
      scene.add(root);

      // Starfield backdrop.
      const starGeo = new THREE.BufferGeometry();
      const starCount = style === "constellation" ? 700 : 350;
      const pos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
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
          new THREE.PointsMaterial({ color: 0x8a93a6, size: 0.14, transparent: true, opacity: 0.7 }),
        ),
      );

      const labelScale = style === "forum" ? 1.25 : 1;
      const meshes: THREE.Mesh[] = [];
      const hitMeshes: THREE.Mesh[] = [];
      const byCategory = new Map<LabCategory, THREE.Object3D[]>();
      const hubPositions = new Map<LabCategory, THREE.Vector3>();

      function makeLabel(text: string, color: string) {
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
        sp.scale.set((c.width / 110) * labelScale, (c.height / 110) * labelScale, 1);
        return sp;
      }

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
          const hit = new THREE.Mesh(
            new THREE.SphereGeometry(1.05, 8, 8),
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
      const onDown = (ev: PointerEvent) => {
        downX = ev.clientX;
        downY = ev.clientY;
        report?.(`debug: pointerdown @${Math.round(ev.clientX)},${Math.round(ev.clientY)}`);
      };
      const onClick = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 6) {
          report?.("debug: click ignored (drag)");
          return;
        }
        const mesh = pick(ev);
        report?.(
          mesh
            ? `debug: HIT ${(mesh.userData.node as AtlasNode).title}`
            : "debug: click miss (no node hit)",
        );
        if (selected && selected !== mesh) selected.scale.setScalar(selected.userData.baseScale);
        selected = mesh;
        if (selected) selected.scale.setScalar(selected.userData.baseScale * 1.7);
        selectCb(mesh ? (mesh.userData.node as AtlasNode) : null);
      };
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("click", onClick);

      const clock = new THREE.Clock();
      let raf = 0;
      function tick() {
        raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        if (!reduced) root.rotation.y = t * 0.03;
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
        const h = Math.max(420, Math.min(640, Math.floor(w * 0.55)));
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

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerdown", onDown);
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
        mount.removeChild(renderer.domElement);
      };
    })();
  }, [mountRef, style]); // eslint-disable-line react-hooks/exhaustive-deps

  return handle;
}

/**
 * LabsAtlas — the 3D constellation view for /labs.
 *
 * three.js loads only when this component mounts (i.e. only when the visitor
 * picks the Atlas view). One shared canvas, nodes clustered by category,
 * flagships in gold. Reduced-motion visitors get a static scene.
 */
export function LabsAtlas({ nodes }: { nodes: AtlasNode[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<AtlasStyle>("constellation");
  const [hiddenCats, setHiddenCats] = useState<Set<LabCategory>>(new Set());
  const [flagshipFocus, setFlagshipFocus] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [selected, setSelected] = useState<AtlasNode | null>(null);
  const [ready, setReady] = useState(false);
  // TEMPORARY click-diagnosis readout — remove before production.
  const [debugMsg, setDebugMsg] = useState("debug: waiting for scene");

  // Remount the scene when the display style changes.
  const [sceneKey, setSceneKey] = useState(0);
  const handle = useAtlasScene(mountRef, nodes, style, setDebugMsg);

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
    setStyle(s);
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
        <div className="flex items-center gap-1 rounded-full border border-border/60 p-1" role="group" aria-label="Display style">
          {(["constellation", "forum"] as AtlasStyle[]).map((s) => (
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
        {/* TEMPORARY diagnosis readout — remove before production. */}
        <p className="pointer-events-none absolute bottom-3 left-4 font-papermono text-[0.65rem] text-gold-soft/80">
          {debugMsg}
        </p>
        {selected ? (
          <div className="absolute right-4 top-4 w-64 rounded-xl border border-gold/30 bg-navy-deep/90 p-5 shadow-panel backdrop-blur">
            <p className="font-papermono text-[0.62rem] uppercase tracking-wider text-signal-soft">
              {labCategoryMeta[selected.category].label}
              {selected.flagship ? " · ◈ flagship" : ""}
            </p>
            <p className="display-serif mt-2 text-xl text-parchment">{selected.title}</p>
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
