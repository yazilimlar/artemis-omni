"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Color,
  DoubleSide,
  Object3D,
  Shape,
  ShapeGeometry,
  type Group,
  type InstancedMesh,
} from "three";

/**
 * Botanical garden (ADR-015 scene). A Fibonacci phyllotaxis: petals placed at the
 * golden angle (~137.5°), upright near the centre and opening outward, each one
 * breathing on its own phase while the whole flower turns slowly. One instanced
 * mesh (a single draw call). Procedural; no external assets, no drei loaders.
 */

const PETALS = 180;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°

// Rainbow Botanics palette (components/rainbow): deep greens into warm amber/gold.
const INNER = new Color("#31513f");
const MID = new Color("#9c792f");
const OUTER = new Color("#d2b86c");

type PetalLayout = { angle: number; radius: number; scale: number; tilt: number; phase: number };

function layout(): PetalLayout[] {
  return Array.from({ length: PETALS }, (_, i) => {
    const f = (i + 1) / PETALS;
    return {
      angle: i * GOLDEN_ANGLE,
      radius: 0.11 * Math.sqrt(i + 1),
      scale: 0.28 + 0.62 * Math.sqrt(f),
      tilt: 1.25 - 1.0 * f, // upright inside, nearly flat at the rim
      phase: i * 0.21,
    };
  });
}

/** A leaf-shaped petal lying flat with its tip pointing along +Z. */
function petalGeometry(): ShapeGeometry {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.2, 0.22, 0.14, 0.72, 0, 1);
  shape.bezierCurveTo(-0.14, 0.72, -0.2, 0.22, 0, 0);
  const geometry = new ShapeGeometry(shape, 6);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

function Flower({ paused }: { paused: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);
  const time = useRef(0);
  const petals = useMemo(layout, []);
  const geometry = useMemo(petalGeometry, []);
  const dummy = useMemo(() => {
    const object = new Object3D();
    object.rotation.order = "YXZ";
    return object;
  }, []);

  useLayoutEffect(() => {
    const instances = mesh.current;
    if (!instances) return;
    const color = new Color();
    petals.forEach((_, i) => {
      const f = i / (PETALS - 1);
      if (f < 0.5) color.copy(INNER).lerp(MID, f * 2);
      else color.copy(MID).lerp(OUTER, (f - 0.5) * 2);
      instances.setColorAt(i, color);
    });
    if (instances.instanceColor) instances.instanceColor.needsUpdate = true;
  }, [petals]);

  useFrame((_, delta) => {
    const instances = mesh.current;
    if (!instances) return;
    if (!paused) time.current += Math.min(delta, 0.1);
    const t = time.current;
    petals.forEach((p, i) => {
      const breathe = 0.12 * Math.sin(0.9 * t + p.phase);
      dummy.position.set(p.radius * Math.cos(p.angle), 0.08 * (1 - p.radius / 1.6), p.radius * Math.sin(p.angle));
      dummy.rotation.set(-(p.tilt + breathe), Math.PI / 2 - p.angle, 0);
      dummy.scale.setScalar(p.scale * (1 + 0.04 * Math.sin(0.9 * t + p.phase)));
      dummy.updateMatrix();
      instances.setMatrixAt(i, dummy.matrix);
    });
    instances.instanceMatrix.needsUpdate = true;
    if (group.current) group.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, PETALS]}>
        <meshStandardMaterial side={DoubleSide} roughness={0.6} metalness={0.05} />
      </instancedMesh>
      <mesh position={[0, 0.12, 0]} scale={[1, 0.55, 1]}>
        <icosahedronGeometry args={[0.32, 2]} />
        <meshStandardMaterial color="#91621b" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

export default function BotanicalGardenScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 2.6, 3.4], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0b251b"]} />
      <hemisphereLight args={["#fff3c4", "#10351f", 0.7]} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.1} />
      <pointLight position={[-2, 1.5, -1.5]} intensity={0.5} color="#e65b17" />
      <Flower paused={paused} />
    </Canvas>
  );
}
