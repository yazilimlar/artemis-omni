"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { distToRiver, mulberry32, terrainHeight } from "@/lib/time-atlas/terrain";

interface TreeInstance {
  x: number;
  z: number;
  h: number;
  scale: number;
  color: string;
}

const OLIVE_GREENS = ["#7d8f57", "#6e874d", "#8a9a62", "#5f7a44"];
const PINE_GREENS = ["#3d5a3a", "#466345", "#35503a"];

function scatter(
  seed: number,
  count: number,
  sample: (rng: () => number) => [number, number],
  accept: (x: number, z: number, h: number) => boolean,
  palette: string[],
): TreeInstance[] {
  const rng = mulberry32(seed);
  const result: TreeInstance[] = [];
  let guard = 0;
  while (result.length < count && guard++ < count * 14) {
    const [x, z] = sample(rng);
    const h = terrainHeight(x, z);
    if (!accept(x, z, h)) continue;
    result.push({
      x,
      z,
      h,
      scale: 0.75 + rng() * 0.6,
      color: palette[Math.floor(rng() * palette.length)],
    });
  }
  return result;
}

/**
 * Instanced vegetation: olives/oaks on the plain (denser along the river)
 * and pines climbing the Ida foothills. Four draw calls total, no shadows.
 */
export function Trees() {
  const olives = useMemo(
    () =>
      scatter(
        4242,
        120,
        (rng) => [-17 + rng() * 30, -4 + rng() * 24],
        (x, z, h) => {
          if (h < 0.4 || h > 3.2) return false;
          if (Math.hypot(x, z) < 6.2) return false; // citadel mound
          if (Math.hypot(x - 6, z + 0.5) < 4.8) return false; // lower town
          const river = distToRiver(x, z);
          if (river < 1.7) return false;
          // Denser gallery woods along the river, sparse stands elsewhere.
          const hash = Math.abs(Math.sin(x * 12.9898 + z * 78.233)) % 1;
          return river < 5 || hash < 0.3;
        },
        OLIVE_GREENS,
      ),
    [],
  );

  const pines = useMemo(
    () =>
      scatter(
        5151,
        70,
        (rng) => [7 + rng() * 18, -16 + rng() * 16],
        (_x, _z, h) => h > 2.6 && h < 9.5,
        PINE_GREENS,
      ),
    [],
  );

  return (
    <group>
      {/* Olive / oak stands on the plain. */}
      <Instances limit={olives.length}>
        <cylinderGeometry args={[0.055, 0.085, 0.5, 5]} />
        <meshStandardMaterial color="#6b5138" roughness={0.95} />
        {olives.map((tree, i) => (
          <Instance key={i} position={[tree.x, tree.h + 0.24 * tree.scale, tree.z]} scale={tree.scale} />
        ))}
      </Instances>
      <Instances limit={olives.length}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial roughness={0.95} flatShading />
        {olives.map((tree, i) => (
          <Instance
            key={i}
            position={[tree.x, tree.h + 0.68 * tree.scale, tree.z]}
            scale={[tree.scale, tree.scale * 0.8, tree.scale]}
            rotation={[0, i * 1.7, 0]}
            color={tree.color}
          />
        ))}
      </Instances>

      {/* Pines on the foothills toward Ida. */}
      <Instances limit={pines.length}>
        <cylinderGeometry args={[0.05, 0.08, 0.6, 5]} />
        <meshStandardMaterial color="#5d4630" roughness={0.95} />
        {pines.map((tree, i) => (
          <Instance key={i} position={[tree.x, tree.h + 0.28 * tree.scale, tree.z]} scale={tree.scale} />
        ))}
      </Instances>
      <Instances limit={pines.length}>
        <coneGeometry args={[0.4, 1.05, 6]} />
        <meshStandardMaterial roughness={0.95} flatShading />
        {pines.map((tree, i) => (
          <Instance
            key={i}
            position={[tree.x, tree.h + 1.0 * tree.scale, tree.z]}
            scale={tree.scale}
            color={tree.color}
          />
        ))}
      </Instances>
    </group>
  );
}
