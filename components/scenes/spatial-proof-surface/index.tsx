"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, PlaneGeometry, type BufferAttribute } from "three";

/**
 * Spatial proof surface (ADR-015 scene). A procedural height field:
 * pulsating Gaussian peaks plus a travelling Fourier-series ripple, coloured from
 * trough (signal blue) to crest (gold). No external assets, no drei loaders.
 */

const SIZE = 6;
const SEGMENTS = 96;

/** Gaussian peaks: centre (x, z), spread, base amplitude, pulse speed and phase. */
const PEAKS = [
  { x: -1.2, z: -0.6, sigma: 0.75, amp: 0.85, speed: 0.9, phase: 0 },
  { x: 1.3, z: 0.4, sigma: 0.6, amp: 0.65, speed: 1.3, phase: 2.1 },
  { x: 0.1, z: 1.6, sigma: 0.9, amp: 0.5, speed: 0.7, phase: 4.2 },
];
const HARMONICS = 4;

const TROUGH = new Color("hsl(204, 100%, 42%)");
const CREST = new Color("hsl(41, 64%, 56%)");

/** Height of the surface at (x, z) and time t (pure). */
function height(x: number, z: number, t: number): number {
  let h = 0;
  for (const p of PEAKS) {
    const d2 = (x - p.x) ** 2 + (z - p.z) ** 2;
    const pulse = 1 + 0.35 * Math.sin(p.speed * t + p.phase);
    h += p.amp * pulse * Math.exp(-d2 / (2 * p.sigma * p.sigma));
  }
  // Fourier series ripple: harmonics weighted 1/n, travelling diagonally.
  for (let n = 1; n <= HARMONICS; n++) {
    h += (0.09 / n) * Math.sin(n * (0.9 * x + 0.6 * t)) * Math.cos(n * (0.7 * z - 0.4 * t));
  }
  return h;
}

function Surface({ paused }: { paused: boolean }) {
  const time = useRef(0);
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);
    geo.setAttribute("color", geo.attributes.position.clone());
    return geo;
  }, []);

  const scratch = useMemo(() => new Color(), []);

  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.1);
    const t = time.current;
    const position = geometry.attributes.position as BufferAttribute;
    const color = geometry.attributes.color as BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const y = height(x, z, t);
      position.setY(i, y);
      scratch.copy(TROUGH).lerp(CREST, Math.min(1, Math.max(0, (y + 0.15) / 1.25)));
      color.setXYZ(i, scratch.r, scratch.g, scratch.b);
    }
    position.needsUpdate = true;
    color.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0.002, 0]}>
        <meshBasicMaterial wireframe color="#c9d6e6" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function SpatialProofSurfaceScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [4.6, 3.4, 4.6], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0b1324"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} />
      <pointLight position={[-3, 2, -2]} intensity={0.6} color="#d9b46a" />
      <Surface paused={paused} />
    </Canvas>
  );
}
