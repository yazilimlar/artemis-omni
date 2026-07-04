"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { terrainHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { LAYER_BY_ID } from "@/data/troy/layers";

const WALL_RADIUS = 4.0;
const GATE_ANGLE = Math.atan2(-0.9, 3.9);

const DEFENSE = new THREE.Color(LAYER_BY_ID.defense.color);
const RELIGION = new THREE.Color(LAYER_BY_ID.religion.color);

const PLATEAU_HOUSES: Array<[number, number, number, number]> = [
  // [x, z, footprint, rotation]
  [-1.9, 0.6, 1.1, 0.4],
  [-1.1, 2.0, 0.9, -0.2],
  [0.7, 1.9, 1.0, 0.9],
  [2.1, 0.8, 0.9, -0.5],
  [-2.3, -1.1, 1.0, 0.1],
];

function angularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

/**
 * The citadel crowning Hisarlık: the (reused) Bronze Age wall ring with
 * towers and gate, a handful of Archaic houses, and the open-air sanctuary
 * of Athena Ilias with its early temple and altar.
 */
export function Citadel() {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const defenseOn = activeLayers.includes("defense");
  const religionOn = activeLayers.includes("religion");

  const wallSegments = useMemo(() => {
    const segments: Array<{ position: [number, number, number]; rotY: number }> = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      if (angularDistance(theta, GATE_ANGLE) < Math.PI / count) continue; // gate gap
      const x = Math.cos(theta) * WALL_RADIUS;
      const z = Math.sin(theta) * WALL_RADIUS;
      segments.push({ position: [x, terrainHeight(x, z) + 0.55, z], rotY: -theta });
    }
    return segments;
  }, []);

  const towers = useMemo(() => {
    const angles = [0.95, 2.5, 4.3, GATE_ANGLE - 0.34, GATE_ANGLE + 0.34];
    return angles.map((theta) => {
      const x = Math.cos(theta) * (WALL_RADIUS + 0.15);
      const z = Math.sin(theta) * (WALL_RADIUS + 0.15);
      return { position: [x, terrainHeight(x, z) + 0.95, z] as [number, number, number] };
    });
  }, []);

  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.1, 0);
    shape.lineTo(1.1, 0);
    shape.lineTo(0, 0.62);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 3.6, bevelEnabled: false });
    geo.translate(0, 0, -1.8);
    geo.rotateY(Math.PI / 2); // ridge along local x (temple long axis)
    return geo;
  }, []);

  const templeY = terrainHeight(0.8, -1.5);

  return (
    <group>
      {/* Wall circuit (Troy VI masonry, reused). */}
      {wallSegments.map((seg, i) => (
        <mesh key={i} position={seg.position} rotation-y={seg.rotY} castShadow>
          <boxGeometry args={[0.75, 1.7, 1.85]} />
          <meshStandardMaterial
            color="#98876e"
            roughness={0.9}
            emissive={DEFENSE}
            emissiveIntensity={defenseOn ? 0.5 : 0}
          />
        </mesh>
      ))}
      {towers.map((tower, i) => (
        <mesh key={i} position={tower.position} castShadow>
          <boxGeometry args={[1.35, 2.7, 1.35]} />
          <meshStandardMaterial
            color="#8e7d64"
            roughness={0.9}
            emissive={DEFENSE}
            emissiveIntensity={defenseOn ? 0.5 : 0}
          />
        </mesh>
      ))}

      {/* Archaic houses on the plateau. */}
      {PLATEAU_HOUSES.map(([x, z, s, rot], i) => {
        const y = terrainHeight(x, z);
        return (
          <group key={i} position={[x, y, z]} rotation-y={rot}>
            <mesh position-y={0.34} castShadow>
              <boxGeometry args={[s, 0.68, s * 0.8]} />
              <meshStandardMaterial color="#a8916f" roughness={0.95} />
            </mesh>
            <mesh position-y={0.85} rotation-y={Math.PI / 4}>
              <coneGeometry args={[s * 0.72, 0.4, 4]} />
              <meshStandardMaterial color="#8a7355" roughness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* Sanctuary of Athena Ilias. */}
      <group position={[0.8, templeY, -1.5]} rotation-y={-0.2}>
        <mesh position-y={0.12} receiveShadow>
          <boxGeometry args={[4.1, 0.24, 2.45]} />
          <meshStandardMaterial color="#cfc2a4" roughness={0.85} />
        </mesh>
        <mesh position-y={0.36} castShadow>
          <boxGeometry args={[3.6, 0.26, 2.0]} />
          <meshStandardMaterial
            color="#ddd2b6"
            roughness={0.85}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.35 : 0}
          />
        </mesh>
        <Instances limit={10} castShadow>
          <cylinderGeometry args={[0.1, 0.125, 0.95, 6]} />
          <meshStandardMaterial
            color="#e6dcc0"
            roughness={0.8}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.35 : 0}
          />
          {[-1.45, -0.5, 0.5, 1.45].flatMap((x) =>
            [-0.72, 0.72].map((z) => <Instance key={`${x}:${z}`} position={[x, 0.96, z]} />),
          )}
          <Instance position={[-1.45, 0.96, 0]} />
          <Instance position={[1.45, 0.96, 0]} />
        </Instances>
        <mesh position-y={1.55}>
          <boxGeometry args={[3.4, 0.22, 1.9]} />
          <meshStandardMaterial color="#d8cdb0" roughness={0.85} />
        </mesh>
        <mesh geometry={roofGeometry} position-y={1.66} scale={[1, 1, 0.86]} castShadow>
          <meshStandardMaterial
            color="#b3674f"
            roughness={0.9}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.3 : 0}
          />
        </mesh>
        {/* Altar east of the temple front. */}
        <mesh position={[2.6, 0.3, 0]} castShadow>
          <boxGeometry args={[0.55, 0.6, 0.55]} />
          <meshStandardMaterial
            color="#c9bda0"
            roughness={0.9}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.5 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}
