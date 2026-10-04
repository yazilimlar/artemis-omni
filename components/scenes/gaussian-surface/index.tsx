"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferAttribute, Float32BufferAttribute, PlaneGeometry, type Group } from "three";
import { HEIGHT_SCALE, SEGMENTS, SIZE, colorAt, gaussian } from "./surface";

/**
 * Gaussian surface (ADR-015 scene, ADR-020 Tier 1). z = exp(-(x² + y²) / 2σ²) with σ = 1 on a
 * 64 x 64-cell grid (4,225 vertices), coloured blue -> cyan -> gold by height and turning slowly
 * about the vertical axis. Plain R3F: the geometry is built once, so the only per-frame work
 * is the rotation. No external assets, no drei loaders, no extra dependencies.
 */

const ROTATION_RAD_PER_SEC = 0.1;

function Surface({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);
  const angle = useRef(0);

  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2); // lay the plane flat: x, z span the grid, y is height
    const position = geo.attributes.position as BufferAttribute;
    const colors = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) {
      const z = gaussian(position.getX(i), position.getZ(i));
      position.setY(i, z * HEIGHT_SCALE);
      const [r, g, b] = colorAt(z);
      colors.set([r, g, b], i * 3);
    }
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!paused) angle.current += ROTATION_RAD_PER_SEC * Math.min(delta, 0.1);
    if (group.current) group.current.rotation.y = angle.current;
  });

  return (
    <group ref={group} position={[0, -0.7, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0.002, 0]}>
        <meshBasicMaterial wireframe color="#c9d6e6" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function GaussianSurfaceScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [4.2, 3.2, 4.2], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0b1324"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#d9b46a" />
      <Surface paused={paused} />
    </Canvas>
  );
}
