"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/** Rotating icosahedron. Purely procedural: no external assets, no drei loaders. */
function Orb({ paused }: { paused: boolean }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.x += delta * 0.25;
    mesh.current.rotation.y += delta * 0.4;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshStandardMaterial color="#8fa3d9" flatShading roughness={0.45} metalness={0.15} />
    </mesh>
  );
}

/** ADR-015 first scene (synthetic proof of concept). */
export default function HelloOrbScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0c1426"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#d9b46a" />
      <Orb paused={paused} />
    </Canvas>
  );
}
