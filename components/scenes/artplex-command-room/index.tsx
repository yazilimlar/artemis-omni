"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Curve,
  DoubleSide,
  RingGeometry,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
} from "three";
import { COURT, GATES, POD_RADIUS, PURSUITS, TOUR_SECONDS, VIEWS, podAngle, type Pursuit } from "./pursuits";

/**
 * ArtPlex command room (ADR-015 scene). The command layer above every ArtLoop:
 * six synthetic pursuits stand around a central experience ledger, each showing the
 * three ideas from /labs/artplex.
 *  - Countdown: a gold arc that shrinks to bid time. Pursuit D has no due date, so
 *    it shows a dashed NOT SET ring and no arc.
 *  - Ball-in-court: a token hops between six owner seats (us, GC/CM, owner, sub or
 *    vendor, model team, approver).
 *  - Gates: five pillars light as gates pass; Pursuit E is held at a red hard stop.
 * At each bid close a packet flies to the central column and adds a disc: the
 * experience the next pursuit starts from. Procedural only; no models, textures,
 * fonts or loaders. Labels are DOM buttons positioned by projection each frame.
 * Synthetic illustration: no pursuit data, no dates, no figures.
 */

const NAVY = "#0b1f3b";
const GOLD = "#d4a017";
const CREAM = "#f5f1e6";
const RED = "#d4191d";
const MUTED = "#5a6675";

const ARC_STEPS = 48;
const LEDGER_DISCS = 18;

type Clock = MutableRefObject<number>;
type LabelRefs = MutableRefObject<(HTMLButtonElement | null)[]>;

class Lemniscate extends Curve<Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number, target = new Vector3()): Vector3 {
    const s = t * Math.PI * 2;
    const d = 1 + Math.sin(s) ** 2;
    return target.set(Math.cos(s) / d, 0, (Math.sin(s) * Math.cos(s)) / d);
  }
}

function podPosition(index: number, y = 0): Vector3 {
  const a = podAngle(index);
  return new Vector3(Math.cos(a) * POD_RADIUS, y, Math.sin(a) * POD_RADIUS);
}

/** 0 at the start of a bid cycle, 1 at bid time. */
function cycleProgress(p: Pursuit, t: number): number {
  return p.cycle > 0 ? (t / p.cycle + p.phase) % 1 : 0;
}

function Agent({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.75, 14]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <sphereGeometry args={[0.2, 18, 12]} />
        <meshStandardMaterial color={CREAM} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1, 0.18]}>
        <boxGeometry args={[0.28, 0.06, 0.05]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
    </group>
  );
}

function Pod({
  index,
  clock,
  arcs,
  infinity,
  active,
  onBidClose,
}: {
  index: number;
  clock: Clock;
  arcs: RingGeometry[];
  infinity: Curve<Vector3>;
  active: boolean;
  onBidClose: (index: number) => void;
}) {
  const p = PURSUITS[index];
  const pos = podPosition(index);
  // Local +Z faces the core.
  const rotationY = Math.atan2(-pos.x, -pos.z);
  const arc = useRef<Mesh>(null);
  const loop = useRef<Mesh>(null);
  const token = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const gates = useRef<(Mesh | null)[]>([]);
  const lastProgress = useRef(cycleProgress(p, 0));

  const seats = useMemo(
    () =>
      COURT.map((_, k) => {
        const a = Math.PI + (k - (COURT.length - 1) / 2) * 0.42;
        return new Vector3(Math.sin(a) * 0.82, 0.86, Math.cos(a) * 0.82);
      }),
    [],
  );

  useFrame(() => {
    const t = clock.current;
    if (loop.current) loop.current.rotation.y = t * 0.6 + index;

    // Countdown arc, quantized to shared geometries (no per-frame allocation).
    if (p.dueSet && arc.current) {
      const progress = cycleProgress(p, t);
      const remaining = 1 - progress;
      arc.current.geometry = arcs[Math.max(0, Math.round(remaining * ARC_STEPS))];
      const late = remaining < 0.15;
      (arc.current.material as MeshBasicMaterial).color.set(late ? RED : GOLD);
      if (progress < lastProgress.current) onBidClose(index);
      lastProgress.current = progress;
    }

    // Ball-in-court: hop to a new owner seat every few seconds.
    if (token.current) {
      const hop = 3.6 + index * 0.37;
      const step = Math.floor(t / hop + index);
      const f = (t / hop + index) % 1;
      const from = seats[(step * 5 + index) % seats.length];
      const to = seats[((step + 1) * 5 + index) % seats.length];
      const move = Math.min(1, Math.max(0, (f - 0.8) / 0.2));
      token.current.position.lerpVectors(from, to, move);
      token.current.position.y = 1.02 + Math.sin(move * Math.PI) * 0.35;
    }

    gates.current.forEach((g, k) => {
      if (!g) return;
      const m = g.material as MeshStandardMaterial;
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      if (k < p.gate) m.emissiveIntensity = 0.9;
      else if (k === p.gate) m.emissiveIntensity = 0.3 + 0.7 * pulse;
      else m.emissiveIntensity = 0.05;
    });

    if (halo.current) {
      (halo.current.material as MeshBasicMaterial).opacity = active ? 0.5 + 0.2 * Math.sin(t * 3) : 0.12;
    }
  });

  return (
    <group position={pos} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1, 1.1, 0.8, 36]} />
        <meshStandardMaterial color="#13294a" roughness={0.7} />
      </mesh>
      <mesh ref={loop} position={[0, 1.3, 0]} scale={0.42}>
        <tubeGeometry args={[infinity, 96, 0.13, 8, true]} />
        <meshStandardMaterial color={p.dueSet ? GOLD : MUTED} emissive={p.dueSet ? "#5a4100" : "#1b2533"} />
      </mesh>

      {/* Countdown track + arc, or the NOT SET dashes. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.5, 1.62, 64]} />
        <meshBasicMaterial color="#1d3557" side={DoubleSide} />
      </mesh>
      {p.dueSet ? (
        <mesh ref={arc} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} geometry={arcs[ARC_STEPS]}>
          <meshBasicMaterial color={GOLD} side={DoubleSide} />
        </mesh>
      ) : (
        Array.from({ length: 20 }, (_, k) => {
          const a = (k / 20) * Math.PI * 2;
          return (
            <mesh key={k} position={[Math.cos(a) * 1.56, 0.04, Math.sin(a) * 1.56]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.06, 0.02, 0.24]} />
              <meshBasicMaterial color={MUTED} />
            </mesh>
          );
        })
      )}

      {/* Gates, in front of the pod, facing the core. */}
      {GATES.map((_, k) => {
        const passed = k < p.gate;
        const stop = p.hardStop && k === p.gate;
        const color = stop ? RED : passed ? GOLD : k === p.gate ? CREAM : "#2b3f5c";
        return (
          <mesh key={k} ref={(m) => void (gates.current[k] = m)} position={[(k - 2) * 0.34, 0.2 + k * 0.05, 1.95]}>
            <boxGeometry args={[0.18, 0.4 + k * 0.1, 0.18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* Ball-in-court seats and token. */}
      {seats.map((s, k) => (
        <mesh key={k} position={[s.x, 0.84, s.z]}>
          <boxGeometry args={[0.16, 0.06, 0.16]} />
          <meshStandardMaterial color="#2b3f5c" />
        </mesh>
      ))}
      <mesh ref={token}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
      </mesh>

      <group position={[0, 0, -1.75]}>
        <Agent color={p.hardStop ? RED : "#2f5d8a"} />
      </group>
      <mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.25, 2.35, 48]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.12} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/** Experience ledger column, packets from bid closes, and walking analysts. */
function Core({ clock, closes }: { clock: Clock; closes: MutableRefObject<{ pod: number; at: number }[]> }) {
  const discs = useRef<(Mesh | null)[]>([]);
  const packets = useRef<(Mesh | null)[]>([]);
  const ring = useRef<Group>(null);
  const analysts = useRef<(Group | null)[]>([]);
  const filled = useRef(7);
  const from = useMemo(() => new Vector3(), []);
  const top = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const t = clock.current;
    if (ring.current) ring.current.rotation.y = t * 0.05;

    // Packets fly 1.6 s from the pod to the top of the column, then add a disc.
    packets.current.forEach((m) => m && (m.visible = false));
    closes.current = closes.current.filter((c) => {
      const f = (t - c.at) / 1.6;
      if (f >= 1) {
        filled.current = filled.current >= LEDGER_DISCS ? 7 : filled.current + 1;
        return false;
      }
      const m = packets.current[c.pod];
      if (m) {
        from.copy(podPosition(c.pod, 1.3));
        top.set(0, 0.5 + filled.current * 0.13, 0);
        m.position.lerpVectors(from, top, f);
        m.position.y += Math.sin(f * Math.PI) * 2.2;
        m.visible = true;
      }
      return true;
    });

    discs.current.forEach((d, k) => {
      if (!d) return;
      d.visible = k < filled.current;
      d.rotation.y = t * 0.2 + k * 0.4;
    });

    analysts.current.forEach((a, k) => {
      if (!a) return;
      const ang = t * 0.12 + (k * Math.PI * 2) / 3;
      a.position.set(Math.cos(ang) * 3.7, Math.abs(Math.sin(t * 6 + k)) * 0.05, Math.sin(ang) * 3.7);
      a.rotation.y = -ang;
    });
  });

  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.25, 1.4, 0.4, 40]} />
        <meshStandardMaterial color="#13294a" />
      </mesh>
      {Array.from({ length: LEDGER_DISCS }, (_, k) => (
        <mesh key={k} ref={(m) => void (discs.current[k] = m)} position={[0, 0.5 + k * 0.13, 0]}>
          <cylinderGeometry args={[0.9 - k * 0.012, 0.9 - k * 0.012, 0.08, 6]} />
          <meshStandardMaterial
            color={k % 3 === 0 ? GOLD : "#c9a54a"}
            emissive="#3d2c00"
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
      ))}
      {PURSUITS.map((_, k) => (
        <mesh key={k} ref={(m) => void (packets.current[k] = m)} visible={false}>
          <octahedronGeometry args={[0.16]} />
          <meshBasicMaterial color="#ffd36b" />
        </mesh>
      ))}
      {/* Overhead command ring with a light beam to each pursuit. */}
      <group ref={ring}>
        <mesh position={[0, 5.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[POD_RADIUS, 0.04, 8, 128]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.6} />
        </mesh>
      </group>
      {PURSUITS.map((_, k) => {
        const p = podPosition(k, 3.6);
        return (
          <mesh key={k} position={p}>
            <cylinderGeometry args={[0.015, 0.015, 3.6, 6]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.25} />
          </mesh>
        );
      })}
      {[0, 1, 2].map((k) => (
        <group key={k} ref={(g) => void (analysts.current[k] = g)} scale={0.85}>
          <Agent color="#7d8fa8" />
        </group>
      ))}
    </group>
  );
}

function CameraRig({ pod }: { pod: number | null }) {
  const { camera, size } = useThree();
  const look = useRef(new Vector3());
  const wantPos = useMemo(() => new Vector3(), []);
  const wantLook = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    const compact = size.width < 520;
    if (pod === null) {
      wantPos.set(0, compact ? 17 : 13.5, compact ? 17 : 15.5);
      wantLook.set(0, 0.5, 0);
    } else if (pod < 0) {
      wantPos.set(compact ? 5.5 : 4.5, compact ? 6 : 5, compact ? 8.5 : 7);
      wantLook.set(0, 1.4, 0);
    } else {
      const a = podAngle(pod) + 0.35;
      const dist = compact ? 12 : 10.5;
      wantPos.set(Math.cos(a) * dist, compact ? 6.5 : 5.5, Math.sin(a) * dist);
      const d = podAngle(pod);
      wantLook.set(Math.cos(d) * POD_RADIUS * 0.85, 0.4, Math.sin(d) * POD_RADIUS * 0.85);
    }
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 2.2);
    camera.position.lerp(wantPos, k);
    look.current.lerp(wantLook, k);
    camera.lookAt(look.current);
  });
  return null;
}

/** Label anchors: the six pursuits, then the ledger. */
const ANCHORS = [...PURSUITS.map((_, i) => podPosition(i, 2.35)), new Vector3(0, 2.5, 0)];

function LabelProjector({ labels }: { labels: LabelRefs }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    ANCHORS.forEach((anchor, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.copy(anchor).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      el.style.visibility = visible ? "visible" : "hidden";
      if (visible) {
        // Labels are clamped inside the frame and below the header pills
        // (R2-S1: fixes Intake/pill overlap and Pursuit E edge clip).
        const px = ((v.x + 1) / 2) * size.width;
        const py = ((1 - v.y) / 2) * size.height;
        const halfW = el.offsetWidth > 0 ? el.offsetWidth / 2 : 60;
        const left = Math.min(Math.max(px, halfW + 8), size.width - halfW - 8);
        const top = Math.min(Math.max(py, 76), size.height - 8);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      }
    });
  });
  return null;
}

function Ticker({ clock, paused }: { clock: Clock; paused: boolean }) {
  useFrame((_, delta) => {
    if (!paused) clock.current += Math.min(delta, 0.1);
  });
  return null;
}

function podCaption(i: number): string {
  const p = PURSUITS[i];
  const parts = [`${p.gate} of ${GATES.length} gates passed`];
  if (p.hardStop) parts.push(`held at ${GATES[p.gate].toLowerCase()}`);
  if (!p.dueSet) parts.push("due date NOT SET");
  return parts.join(" · ");
}

export default function ArtPlexCommandRoomScene({ paused = false }: { paused?: boolean }) {
  const clock = useRef(0);
  const closes = useRef<{ pod: number; at: number }[]>([]);
  const labels: LabelRefs = useRef([]);
  const holdUntil = useRef(0);
  const [view, setView] = useState(0);
  const [podPick, setPodPick] = useState<number | null>(null);

  const arcs = useMemo(
    () =>
      Array.from(
        { length: ARC_STEPS + 1 },
        (_, k) => new RingGeometry(1.5, 1.62, 64, 1, Math.PI / 2, Math.max(0.0001, (k / ARC_STEPS) * Math.PI * 2)),
      ),
    [],
  );
  const infinity = useMemo(() => new Lemniscate(), []);
  useEffect(() => () => arcs.forEach((g) => g.dispose()), [arcs]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (clock.current < holdUntil.current) return;
      setPodPick(null);
      setView((v) => (v + 1) % VIEWS.length);
    }, TOUR_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  const pickPod = (i: number) => {
    holdUntil.current = clock.current + TOUR_SECONDS * 2;
    setPodPick(i);
  };
  const pickView = (v: number) => {
    holdUntil.current = clock.current + TOUR_SECONDS * 2;
    setPodPick(null);
    setView(v);
  };
  const onBidClose = (pod: number) => {
    closes.current = [...closes.current.filter((c) => c.pod !== pod), { pod, at: clock.current }];
  };

  const focusPod = podPick ?? VIEWS[view].pod;
  const title = podPick !== null ? PURSUITS[podPick].name : VIEWS[view].title;
  const caption = podPick !== null ? podCaption(podPick) : VIEWS[view].caption;

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 13.5, 15.5], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <color attach="background" args={[NAVY]} />
        <fog attach="fog" args={[NAVY, 22, 44]} />
        <hemisphereLight args={["#fff3d6", NAVY, 0.75]} />
        <directionalLight position={[6, 14, 8]} intensity={1.05} />
        <pointLight position={[0, 4, 0]} intensity={8} distance={12} color={GOLD} />
        <Ticker clock={clock} paused={paused} />
        <CameraRig pod={focusPod} />
        <LabelProjector labels={labels} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[16, 64]} />
          <meshStandardMaterial color="#0e2443" roughness={0.95} />
        </mesh>
        <gridHelper args={[32, 32, "#3a4f6e", "#173156"]} position={[0, 0.002, 0]} />
        <Core clock={clock} closes={closes} />
        {PURSUITS.map((_, i) => (
          <Pod
            key={i}
            index={i}
            clock={clock}
            arcs={arcs}
            infinity={infinity}
            active={focusPod === i}
            onBidClose={onBidClose}
          />
        ))}
      </Canvas>

      {PURSUITS.map((p, i) => (
        <button
          key={p.name}
          ref={(el) => void (labels.current[i] = el)}
          type="button"
          onClick={() => pickPod(i)}
          style={{ left: 0, top: 0, visibility: "hidden" }}
          className={`absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border px-2 py-1 font-mono text-[11px] tracking-wide transition-colors ${
            focusPod === i ? "border-[#d4a017] bg-[#0b1f3b]/90 text-white" : "border-white/15 bg-[#0b1f3b]/75 text-white/75"
          }`}
        >
          {p.name}
          {!p.dueSet && <span className="ml-1.5 text-[#c9d2e0]/80">· NOT SET</span>}
          {p.hardStop && <span className="ml-1.5 text-[#ff8a7f]">· hard stop</span>}
        </button>
      ))}
      <button
        ref={(el) => void (labels.current[PURSUITS.length] = el)}
        type="button"
        onClick={() => pickView(VIEWS.length - 1)}
        style={{ left: 0, top: 0, visibility: "hidden" }}
        className="absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-[#d4a017]/60 bg-[#0b1f3b]/80 px-2 py-1 font-mono text-[11px] tracking-wide text-[#e8c766]"
      >
        Experience ledger
      </button>

      <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap justify-between gap-2 font-mono text-[11px] text-white/75">
        <span className="rounded-full border border-white/15 bg-[#0b1f3b]/80 px-2.5 py-1">ArtPlex · command room</span>
        <span className="rounded-full border border-white/15 bg-[#0b1f3b]/80 px-2.5 py-1">
          Synthetic illustration · no pursuit data
        </span>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
        <div className="pointer-events-none min-w-0 rounded-lg border border-white/15 bg-[#0b1f3b]/85 px-3 py-2 text-white">
          <p className="font-mono text-[11px] text-[#e8c766]">{title}</p>
          <p className="text-sm">{caption}</p>
        </div>
        <div className="flex shrink-0 gap-1.5" role="group" aria-label="Command picture views">
          {VIEWS.map((v, i) => (
            <button
              key={v.title}
              type="button"
              title={v.title}
              aria-label={`Show ${v.title}`}
              onClick={() => pickView(i)}
              className={`h-7 w-7 rounded-md border font-mono text-[11px] ${
                podPick === null && view === i
                  ? "border-[#d4a017] bg-[#0b1f3b]/90 text-white"
                  : "border-white/15 bg-[#0b1f3b]/80 text-white/70"
              }`}
            >
              {i === 0 ? "∞" : i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
