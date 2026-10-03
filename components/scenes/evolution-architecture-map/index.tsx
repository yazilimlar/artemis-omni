"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, Quaternion, Vector3, type Group } from "three";
import {
  KIND_COLORS,
  architectureEdges,
  architectureNodes,
  type ArchitectureNode,
} from "@/lib/evolution/architecture";
import { ARROW_HEIGHT, ARROW_RADIUS, ARROW_SEGMENTS, NODE_RADIUS, NODE_SEGMENTS } from "./geometry";

/**
 * Evolution architecture map (ADR-015 scene, ADR-018). The platform as a 3D node
 * graph: spheres are registries, routes, scripts and services; lines with arrowheads
 * are data flow. Positions come from lib/evolution/architecture.ts. No external assets;
 * labels are DOM overlays (drei Html), so no font files are needed.
 */

const UP = new Vector3(0, 1, 0);

function position(node: ArchitectureNode): Vector3 {
  return new Vector3(node.pos[0], node.pos[1], node.pos[2]);
}

function Graph({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);
  const time = useRef(0);

  const { lines, arrows } = useMemo(() => {
    const byId = new Map(architectureNodes.map((n) => [n.id, n]));
    const points: number[] = [];
    const heads: { at: Vector3; quaternion: Quaternion }[] = [];
    for (const edge of architectureEdges) {
      const a = byId.get(edge.from);
      const b = byId.get(edge.to);
      if (!a || !b) continue;
      const from = position(a);
      const to = position(b);
      const dir = to.clone().sub(from).normalize();
      // Stop the line and arrow at the sphere surfaces.
      const start = from.clone().addScaledVector(dir, NODE_RADIUS);
      const end = to.clone().addScaledVector(dir, -(NODE_RADIUS + ARROW_HEIGHT));
      points.push(start.x, start.y, start.z, end.x, end.y, end.z);
      heads.push({
        at: to.clone().addScaledVector(dir, -(NODE_RADIUS + ARROW_HEIGHT / 2)),
        quaternion: new Quaternion().setFromUnitVectors(UP, dir),
      });
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(points, 3));
    return { lines: geo, arrows: heads };
  }, []);

  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.1);
    // A gentle sway keeps labels readable (no full rotation).
    if (group.current) group.current.rotation.y = Math.sin(time.current * 0.25) * 0.45;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#c9d6e6" transparent opacity={0.45} />
      </lineSegments>
      {arrows.map((arrow, i) => (
        <mesh key={i} position={arrow.at} quaternion={arrow.quaternion}>
          <coneGeometry args={[ARROW_RADIUS, ARROW_HEIGHT, ARROW_SEGMENTS, 1]} />
          <meshBasicMaterial color="#c9d6e6" />
        </mesh>
      ))}
      {architectureNodes.map((node) => (
        <group key={node.id} position={node.pos}>
          <mesh>
            <sphereGeometry args={[NODE_RADIUS, ...NODE_SEGMENTS]} />
            <meshStandardMaterial color={KIND_COLORS[node.kind]} roughness={0.5} metalness={0.1} />
          </mesh>
          <Html center distanceFactor={9} position={[0, -0.38, 0]} style={{ pointerEvents: "none" }}>
            <span className="whitespace-nowrap rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {node.label}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function EvolutionArchitectureMapScene({ paused = false }: { paused?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 9.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0b1324"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={1.1} />
      <Graph paused={paused} />
    </Canvas>
  );
}
