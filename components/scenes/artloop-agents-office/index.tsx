"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  CatmullRomCurve3,
  Curve,
  DoubleSide,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { DESK_RADIUS, STAGES, TOUR_SECONDS, deskAngle } from "./stages";

/**
 * ArtLoop agents office (ADR-015 scene). The five ArtLoop stages as five desks on
 * an office floor around a red infinity loop (the ArtLoop mark). Each desk has an
 * agent and a small stage-specific animation; courier agents walk the loop carrying
 * documents between desks. The camera tours the floor, and clicking a desk label
 * focuses it. Procedural only: no models, textures, fonts or loaders. Labels are
 * plain DOM buttons positioned each frame by projecting the desk positions (no drei
 * Html, which threw on unmount). Synthetic illustration: no project data, no figures.
 */

type Shared = { time: MutableRefObject<number>; focus: number };
type LabelRefs = MutableRefObject<(HTMLButtonElement | null)[]>;

/** Desk position in world space, at label height. */
function labelAnchor(index: number): Vector3 {
  const a = deskAngle(index);
  return new Vector3(Math.cos(a) * DESK_RADIUS, 2.6, Math.sin(a) * DESK_RADIUS);
}

/** Lemniscate of Bernoulli in the XZ plane. */
class Lemniscate extends Curve<Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, target = new Vector3()): Vector3 {
    const a = 2.2;
    const s = t * Math.PI * 2;
    const d = 1 + Math.sin(s) ** 2;
    return target.set((a * Math.cos(s)) / d, 0, (a * Math.sin(s) * Math.cos(s)) / d);
  }
}

/** The walking path: in front of each desk, pinched in between them. */
function loopPath(): CatmullRomCurve3 {
  const points: Vector3[] = [];
  STAGES.forEach((_, i) => {
    const a = deskAngle(i);
    points.push(new Vector3(Math.cos(a) * 4.3, 0.03, Math.sin(a) * 4.3));
    const b = a + Math.PI / STAGES.length;
    points.push(new Vector3(Math.cos(b) * 3.6, 0.03, Math.sin(b) * 3.6));
  });
  return new CatmullRomCurve3(points, true, "catmullrom", 0.5);
}

function screenTexture(index: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const g = canvas.getContext("2d");
  if (g) {
    const stage = STAGES[index];
    g.fillStyle = "#0b1315";
    g.fillRect(0, 0, 256, 160);
    g.fillStyle = stage.color;
    g.fillRect(0, 0, 256, 6);
    g.fillStyle = "#e6efed";
    g.font = "600 21px system-ui, sans-serif";
    g.fillText(stage.name, 14, 40);
    g.fillStyle = "#8fa6a3";
    g.font = "12px ui-monospace, monospace";
    g.fillText(`STAGE ${index + 1} / ${STAGES.length}`, 14, 60);
    for (let k = 0; k < 5; k++) {
      g.fillStyle = index === 2 && k === 2 ? "#d9a441" : "#24383d";
      g.fillRect(14, 78 + k * 15, 60 + ((index * 37 + k * 53) % 150), 7);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function Agent({ color, headRef }: { color: string; headRef?: MutableRefObject<Group | null> }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 0.75, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <group ref={headRef} position={[0, 0.98, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 20, 14]} />
          <meshStandardMaterial color="#e6efed" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0.2]}>
          <boxGeometry args={[0.3, 0.07, 0.05]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

/** One animated prop per stage. Props sit on the desk top (y ≈ 1.01, desk-local). */
function StageProp({ index, shared }: { index: number; shared: Shared }) {
  const a = useRef<Mesh>(null);
  const b = useRef<Group>(null);
  const bars = useRef<(Mesh | null)[]>([]);
  const pages = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const t = shared.time.current;
    if (index === 0 && a.current) a.current.position.y = 1.65 - ((t * 0.45) % 1) * 0.55;
    if (index === 1 && a.current) a.current.position.z = -0.15 + Math.sin(t * 2) * 0.28;
    if (index === 2)
      bars.current.forEach((bar, k) => {
        if (!bar) return;
        const h = k === 1 ? 0.25 + 0.05 * Math.sin(t * 6) : 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.3 + k));
        bar.scale.y = h / 0.4;
        bar.position.y = 1.01 + h / 2;
      });
    if (index === 3 && b.current) {
      b.current.rotation.x = t * 1.2;
      b.current.rotation.y = t * 0.7;
    }
    if (index === 4) {
      const shown = Math.floor((t * 1.2) % 7);
      pages.current.forEach((p, k) => p && (p.visible = k < shown));
    }
  });

  switch (index) {
    case 0: // inbox tray, sheets arriving
      return (
        <group position={[-0.85, 0, -0.1]}>
          <mesh position={[0, 1.05, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.45]} />
            <meshStandardMaterial color="#2b4a4f" />
          </mesh>
          <mesh ref={a} position={[0, 1.6, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.38]} />
            <meshStandardMaterial color="#e6efed" />
          </mesh>
        </group>
      );
    case 1: // plan sheet with a scan line
      return (
        <group position={[0.75, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.02, -0.15]}>
            <planeGeometry args={[0.9, 0.6]} />
            <meshStandardMaterial color="#2f6f86" emissive="#173a46" />
          </mesh>
          <mesh ref={a} position={[0, 1.04, -0.15]}>
            <boxGeometry args={[0.9, 0.01, 0.03]} />
            <meshBasicMaterial color="#9fe3f0" />
          </mesh>
        </group>
      );
    case 2: // rate bars; the amber one is held (no source yet)
      return (
        <group>
          {[0, 1, 2].map((k) => (
            <mesh key={k} ref={(m) => void (bars.current[k] = m)} position={[0.55 + k * 0.25, 1.2, -0.25]}>
              <boxGeometry args={[0.14, 0.4, 0.14]} />
              <meshStandardMaterial
                color={k === 1 ? "#d9a441" : "#4fa59c"}
                emissive={k === 1 ? "#5a3d0d" : "#10302c"}
              />
            </mesh>
          ))}
        </group>
      );
    case 3: // version vault with a turning lock ring
      return (
        <group position={[-0.85, 1.3, -0.2]}>
          <mesh>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color="#9fd3cc" transparent opacity={0.22} roughness={0.1} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial color="#d4191d" emissive="#7a1a14" />
          </mesh>
          <group ref={b}>
            <mesh>
              <torusGeometry args={[0.42, 0.025, 8, 40]} />
              <meshBasicMaterial color="#d4191d" />
            </mesh>
          </group>
        </group>
      );
    default: // proposal pages stacking up
      return (
        <group position={[0.85, 0, -0.2]}>
          {Array.from({ length: 6 }, (_, k) => (
            <mesh key={k} ref={(m) => void (pages.current[k] = m)} position={[0, 1.03 + k * 0.03, 0]}>
              <boxGeometry args={[0.5, 0.025, 0.36]} />
              <meshStandardMaterial color="#e6efed" />
            </mesh>
          ))}
        </group>
      );
  }
}

function Desk({ index, shared }: { index: number; shared: Shared }) {
  const stage = STAGES[index];
  const head = useRef<Group | null>(null);
  const glow = useRef<Mesh>(null);
  const texture = useMemo(() => screenTexture(index), [index]);
  useEffect(() => () => texture.dispose(), [texture]);

  const angle = deskAngle(index);
  const position: [number, number, number] = [Math.cos(angle) * DESK_RADIUS, 0, Math.sin(angle) * DESK_RADIUS];
  // Face the core: the desk's local −Z points outward, toward the agent's chair.
  const rotationY = Math.atan2(-position[0], -position[2]);
  const active = shared.focus === index;

  useFrame(() => {
    const t = shared.time.current;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8 + index) * 0.35;
    if (glow.current) {
      const m = glow.current.material as MeshBasicMaterial;
      m.opacity = active ? 0.55 + 0.15 * Math.sin(t * 3) : 0.14;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[2.6, 0.12, 1.3]} />
        <meshStandardMaterial color="#1d3034" />
      </mesh>
      {[
        [-1.2, -0.55],
        [1.2, -0.55],
        [-1.2, 0.55],
        [1.2, 0.55],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.47, z]}>
          <boxGeometry args={[0.08, 0.95, 0.08]} />
          <meshStandardMaterial color="#2b4a4f" />
        </mesh>
      ))}
      {/* Monitor faces the agent (outward). */}
      <group position={[0, 1.45, 0.25]}>
        <mesh>
          <boxGeometry args={[1.5, 0.95, 0.06]} />
          <meshStandardMaterial color="#0f1a1c" />
        </mesh>
        <mesh position={[0, 0, -0.035]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.4, 0.86]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
          <meshStandardMaterial color="#2b4a4f" />
        </mesh>
      </group>
      {/* Chair and agent on the outer side, facing the core. */}
      <mesh position={[0, 0.6, -1.1]}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color="#24383d" />
      </mesh>
      <mesh position={[0, 1, -1.45]}>
        <boxGeometry args={[0.7, 0.7, 0.08]} />
        <meshStandardMaterial color="#24383d" />
      </mesh>
      <group position={[0, 0.65, -1.05]}>
        <Agent color={stage.color} headRef={head} />
      </group>
      <StageProp index={index} shared={shared} />
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.75, 1.85, 48]} />
        <meshBasicMaterial color={stage.color} transparent opacity={0.14} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Core({ shared }: { shared: Shared }) {
  const loop = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const curve = useMemo(() => new Lemniscate(), []);
  useFrame(() => {
    const t = shared.time.current;
    if (loop.current) loop.current.rotation.y = t * 0.25;
    if (halo.current) (halo.current.material as MeshBasicMaterial).opacity = 0.35 + 0.2 * Math.sin(t * 2);
  });
  return (
    <group>
      <mesh ref={loop} position={[0, 1.6, 0]}>
        <tubeGeometry args={[curve, 160, 0.09, 8, true]} />
        <meshStandardMaterial color="#d4191d" emissive="#8a1d16" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.3, 40]} />
        <meshStandardMaterial color="#17262a" />
      </mesh>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.31, 0]}>
        <ringGeometry args={[1.7, 1.78, 64]} />
        <meshBasicMaterial color="#4fa59c" transparent opacity={0.5} side={DoubleSide} />
      </mesh>
    </group>
  );
}

const PACKETS = 14;
const RUNNERS = 3;

function Traffic({ shared }: { shared: Shared }) {
  const path = useMemo(loopPath, []);
  const packets = useRef<(Mesh | null)[]>([]);
  const runners = useRef<(Group | null)[]>([]);
  const legs = useRef<(Mesh | null)[]>([]);
  const tangent = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const t = shared.time.current;
    packets.current.forEach((p, k) => {
      if (!p) return;
      path.getPointAt((t * 0.035 + k / PACKETS) % 1, p.position);
      p.position.y = 0.12;
      p.rotation.y = t * 2 + k;
    });
    runners.current.forEach((r, k) => {
      if (!r) return;
      const u = (t * 0.022 + k / RUNNERS) % 1;
      path.getPointAt(u, r.position);
      path.getTangentAt(u, tangent);
      r.rotation.y = Math.atan2(tangent.x, tangent.z);
      r.position.y = Math.abs(Math.sin(t * 7 + k)) * 0.06;
      const swing = Math.sin(t * 7 + k) * 0.6;
      const [l, rr] = [legs.current[k * 2], legs.current[k * 2 + 1]];
      if (l) l.rotation.x = swing;
      if (rr) rr.rotation.x = -swing;
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[path, 240, 0.025, 6, true]} />
        <meshBasicMaterial color="#d4191d" transparent opacity={0.55} />
      </mesh>
      {Array.from({ length: PACKETS }, (_, k) => (
        <mesh key={k} ref={(m) => void (packets.current[k] = m)}>
          <boxGeometry args={[0.09, 0.09, 0.09]} />
          <meshBasicMaterial color="#ff8a7f" />
        </mesh>
      ))}
      {Array.from({ length: RUNNERS }, (_, k) => (
        <group key={k} ref={(g) => void (runners.current[k] = g)}>
          <group position={[0, 0.25, 0]} scale={0.85}>
            <Agent color="#8fa6a3" />
          </group>
          {[-0.09, 0.09].map((x, j) => (
            <mesh key={x} ref={(m) => void (legs.current[k * 2 + j] = m)} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.08, 0.32, 0.08]} />
              <meshStandardMaterial color="#24383d" />
            </mesh>
          ))}
          {/* The document being carried to the next desk. */}
          <mesh position={[0, 0.8, 0.28]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.32, 0.42, 0.03]} />
            <meshStandardMaterial color="#e6efed" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Eases the camera toward the overview (focus −1) or toward one desk. */
function CameraRig({ focus }: { focus: number }) {
  const { camera, size } = useThree();
  const look = useRef(new Vector3());
  const wantPos = useMemo(() => new Vector3(), []);
  const wantLook = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const compact = size.width < 520;
    if (focus < 0) {
      wantPos.set(0, compact ? 17 : 13, compact ? 17 : 15.5);
      wantLook.set(0, 0, 0);
    } else {
      const a = deskAngle(focus) + 0.38;
      const dist = compact ? 12.5 : 11;
      wantPos.set(Math.cos(a) * dist, compact ? 6.5 : 5.6, Math.sin(a) * dist);
      const d = deskAngle(focus);
      wantLook.set(Math.cos(d) * DESK_RADIUS * 0.82, 0.2, Math.sin(d) * DESK_RADIUS * 0.82);
    }
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 2.2);
    camera.position.lerp(wantPos, k);
    look.current.lerp(wantLook, k);
    camera.lookAt(look.current);
  });
  return null;
}

/** Moves the DOM desk labels to their projected screen positions every frame. */
function LabelProjector({ labels }: { labels: LabelRefs }) {
  const { camera, size } = useThree();
  const anchors = useMemo(() => STAGES.map((_, i) => labelAnchor(i)), []);
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    anchors.forEach((anchor, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.copy(anchor).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      el.style.visibility = visible ? "visible" : "hidden";
      if (visible) {
        el.style.left = `${((v.x + 1) / 2) * size.width}px`;
        el.style.top = `${((1 - v.y) / 2) * size.height}px`;
      }
    });
  });
  return null;
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color="#101b1e" roughness={0.95} />
      </mesh>
      <gridHelper args={[32, 32, "#2b4a4f", "#1a2c30"]} position={[0, 0.002, 0]} />
    </group>
  );
}

export default function ArtLoopAgentsOfficeScene({ paused = false }: { paused?: boolean }) {
  const time = useRef(0);
  const [focus, setFocus] = useState(-1);
  // A manual pick holds the tour for two cycles' worth of time.
  const holdUntil = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (time.current < holdUntil.current) return;
      setFocus((f) => (f + 2) % (STAGES.length + 1) - 1);
    }, TOUR_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  const pick = (i: number) => {
    holdUntil.current = time.current + TOUR_SECONDS * 2;
    setFocus(i);
  };
  const shared: Shared = { time, focus };
  const labels: LabelRefs = useRef([]);
  const stage = focus >= 0 ? STAGES[focus] : null;

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 13, 15.5], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={["#0b1315"]} />
        <fog attach="fog" args={["#0b1315", 22, 46]} />
        <hemisphereLight args={["#bfe6e0", "#0b1315", 0.7]} />
        <directionalLight position={[8, 16, 6]} intensity={1.1} />
        <Clock time={time} paused={paused} />
        <CameraRig focus={focus} />
        <LabelProjector labels={labels} />
        <Floor />
        <Core shared={shared} />
        <Traffic shared={shared} />
        {STAGES.map((_, i) => (
          <Desk key={i} index={i} shared={shared} />
        ))}
      </Canvas>
      {STAGES.map((s, i) => (
        <button
          key={s.name}
          ref={(el) => void (labels.current[i] = el)}
          type="button"
          onClick={() => pick(i)}
          style={{ left: 0, top: 0, visibility: "hidden" }}
          className={`absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border px-2 py-1 font-mono text-[11px] tracking-wide transition-colors ${
            focus === i ? "border-[#4fa59c] bg-[#0b1315]/90 text-white" : "border-white/15 bg-[#0b1315]/75 text-white/70"
          }`}
        >
          {i + 1} · {s.name}
        </button>
      ))}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap justify-between gap-2 font-mono text-[11px] text-white/70">
        <span className="rounded-full border border-white/15 bg-[#0b1315]/80 px-2.5 py-1">ArtLoop · agents office</span>
        <span className="rounded-full border border-white/15 bg-[#0b1315]/80 px-2.5 py-1">
          Synthetic illustration · no project data
        </span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
        <div className="pointer-events-none min-w-0 rounded-lg border border-white/15 bg-[#0b1315]/85 px-3 py-2 text-white">
          <p className="font-mono text-[11px] text-[#4fa59c]">
            {stage ? `Stage ${focus + 1} of ${STAGES.length}` : "The whole floor"}
          </p>
          <p className="text-sm">{stage ? `${stage.name}: ${stage.note.toLowerCase()}` : "Five agents, one governed loop"}</p>
        </div>
        <button
          type="button"
          onClick={() => pick(-1)}
          className="shrink-0 rounded-md border border-white/15 bg-[#0b1315]/85 px-2.5 py-1.5 font-mono text-[11px] text-white/80 hover:border-[#4fa59c]"
        >
          Whole floor
        </button>
      </div>
    </div>
  );
}

/** Advances the shared scene clock unless paused. */
function Clock({ time, paused }: { time: MutableRefObject<number>; paused: boolean }) {
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.1);
  });
  return null;
}
