"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { distToRiver, mulberry32, terrainHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { LAYER_BY_ID } from "@/data/troy/layers";

const RELIGION = new THREE.Color(LAYER_BY_ID.religion.color);
const WATER = new THREE.Color(LAYER_BY_ID.water.color);
const GATE_ANGLE = Math.atan2(-0.9, 3.9);

interface House {
  position: [number, number, number];
  rotY: number;
  scale: number;
  wall: string;
  roof: string;
}

/**
 * The Archaic settlement below the mound, plus the West Sanctuary and the
 * rock-cut spring cave. Houses are instanced (two draw calls total).
 */
export function LowerTown() {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const religionOn = activeLayers.includes("religion");
  const waterOn = activeLayers.includes("water");

  const houses = useMemo<House[]>(() => {
    const rng = mulberry32(2024);
    const result: House[] = [];
    const walls = ["#a8916f", "#b09877", "#9d8768", "#b3a07f"];
    const roofs = ["#8a7355", "#93805e", "#7f6a4e"];
    let guard = 0;
    while (result.length < 38 && guard++ < 400) {
      const radius = 5.4 + rng() * 5.2;
      const angle = GATE_ANGLE + (rng() - 0.5) * 2.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const h = terrainHeight(x, z);
      if (h < 0.45 || distToRiver(x, z) < 2.2) continue;
      result.push({
        position: [x, h, z],
        rotY: rng() * Math.PI,
        scale: 0.7 + rng() * 0.5,
        wall: walls[Math.floor(rng() * walls.length)],
        roof: roofs[Math.floor(rng() * roofs.length)],
      });
    }
    return result;
  }, []);

  const sanctuaryY = terrainHeight(-5, 2);
  const springY = terrainHeight(-4.5, -3);

  return (
    <group>
      <Instances limit={houses.length} castShadow>
        <boxGeometry args={[1, 0.62, 0.78]} />
        <meshStandardMaterial roughness={0.95} />
        {houses.map((house, i) => (
          <Instance
            key={i}
            position={[house.position[0], house.position[1] + 0.28 * house.scale, house.position[2]]}
            rotation={[0, house.rotY, 0]}
            scale={house.scale}
            color={house.wall}
          />
        ))}
      </Instances>
      <Instances limit={houses.length}>
        <coneGeometry args={[0.62, 0.36, 4]} />
        <meshStandardMaterial roughness={0.95} />
        {houses.map((house, i) => (
          <Instance
            key={i}
            position={[house.position[0], house.position[1] + 0.72 * house.scale, house.position[2]]}
            rotation={[0, house.rotY + Math.PI / 4, 0]}
            scale={house.scale}
            color={house.roof}
          />
        ))}
      </Instances>

      {/* West Sanctuary — small cult buildings and altars. */}
      <group position={[-5, sanctuaryY, 2]} rotation-y={0.5}>
        {[
          [-0.7, 0, 0.9, 0.55],
          [0.6, 0.2, 0.75, 0.5],
          [0, -0.9, 0.6, 0.42],
        ].map(([x, z, w, h], i) => (
          <mesh key={i} position={[x, h / 2, z]} castShadow>
            <boxGeometry args={[w, h, w * 0.8]} />
            <meshStandardMaterial
              color="#d5c9ab"
              roughness={0.85}
              emissive={RELIGION}
              emissiveIntensity={religionOn ? 0.45 : 0}
            />
          </mesh>
        ))}
        <mesh position={[0.2, 0.18, 1.1]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.34]} />
          <meshStandardMaterial
            color="#c9bda0"
            roughness={0.9}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.6 : 0}
          />
        </mesh>
        <mesh position={[-1.3, 0.3, 1.2]}>
          <boxGeometry args={[0.12, 0.6, 0.3]} />
          <meshStandardMaterial
            color="#ded3b6"
            roughness={0.85}
            emissive={RELIGION}
            emissiveIntensity={religionOn ? 0.45 : 0}
          />
        </mesh>
      </group>

      {/* Spring cave (KASKAL.KUR) at the western foot of the mound. */}
      <group position={[-4.5, springY, -3]} rotation-y={2.4}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.3, 0.9, 0.8]} />
          <meshStandardMaterial color="#7d7060" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.32, 0.42]}>
          <boxGeometry args={[0.55, 0.6, 0.06]} />
          <meshStandardMaterial color="#12100d" roughness={1} />
        </mesh>
        <mesh position={[0, 0.03, 0.95]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.55, 12]} />
          <meshStandardMaterial
            color="#3d7e96"
            roughness={0.25}
            emissive={WATER}
            emissiveIntensity={waterOn ? 0.7 : 0.08}
          />
        </mesh>
      </group>
    </group>
  );
}
