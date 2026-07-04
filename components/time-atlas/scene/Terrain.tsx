"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  TERRAIN_BOUNDS,
  distToRiver,
  mulberry32,
  terrainHeight,
} from "@/lib/time-atlas/terrain";

const SEABED = new THREE.Color("#3a6a72");
const SAND = new THREE.Color("#c2a87c");
const GRASS_A = new THREE.Color("#6f8c49");
const GRASS_B = new THREE.Color("#a59a56");
const LUSH = new THREE.Color("#587f42");
const ROCK = new THREE.Color("#8b7d6b");
const PLATEAU = new THREE.Color("#a38d6d");

/** Heightfield terrain + the single water plane (strait, cove and river). */
export function Terrain() {
  const geometry = useMemo(() => {
    const width = TERRAIN_BOUNDS.maxX - TERRAIN_BOUNDS.minX;
    const depth = TERRAIN_BOUNDS.maxZ - TERRAIN_BOUNDS.minZ;
    const geo = new THREE.PlaneGeometry(width, depth, 150, 135);
    geo.rotateX(-Math.PI / 2);
    geo.translate(
      (TERRAIN_BOUNDS.minX + TERRAIN_BOUNDS.maxX) / 2,
      0,
      (TERRAIN_BOUNDS.minZ + TERRAIN_BOUNDS.maxZ) / 2,
    );

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const rng = mulberry32(1337);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainHeight(x, z);
      pos.setY(i, h);

      if (h < -0.45) {
        c.copy(SEABED);
      } else if (h < 0.28) {
        c.copy(SAND);
      } else {
        const blend = 0.5 + 0.5 * Math.sin(x * 0.9 + z * 0.7);
        c.copy(GRASS_A).lerp(GRASS_B, blend * 0.7);
        const river = distToRiver(x, z);
        if (river < 4) c.lerp(LUSH, 1 - river / 4);
        const nearMound = Math.hypot(x, z) < 6;
        if (nearMound && h > 4.6) {
          c.copy(PLATEAU);
        } else if (h > 3.6) {
          c.lerp(ROCK, Math.min(1, (h - 3.6) / 4));
        }
      }

      const v = 0.94 + rng() * 0.12;
      colors[i * 3] = c.r * v;
      colors[i * 3 + 1] = c.g * v;
      colors[i * 3 + 2] = c.b * v;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>
      {/* One water plane at sea level covers the strait, the cove and the carved river. */}
      <mesh rotation-x={-Math.PI / 2} position={[-6, 0, -5]}>
        <planeGeometry args={[190, 190]} />
        <meshStandardMaterial
          color="#3d7e96"
          roughness={0.22}
          metalness={0.08}
          transparent
          opacity={0.94}
        />
      </mesh>
    </group>
  );
}
