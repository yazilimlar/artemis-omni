"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { distToRiver, mulberry32, terrainHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { LAYER_BY_ID } from "@/data/troy/layers";

const AGRICULTURE = new THREE.Color(LAYER_BY_ID.agriculture.color);

interface Patch {
  position: [number, number, number];
  rotY: number;
  scale: [number, number];
  color: string;
}

/**
 * Field systems on the Scamander plain: flat crop patches flanking the
 * river (instanced) plus a few haystacks. Conjectural layout — see the
 * scamander-farms POI card.
 */
export function Farms() {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const agricultureOn = activeLayers.includes("agriculture");

  const patches = useMemo<Patch[]>(() => {
    const rng = mulberry32(808);
    const colors = ["#96a24e", "#b3a453", "#7f9448", "#c0ab5c", "#8aa050"];
    const result: Patch[] = [];
    let guard = 0;
    while (result.length < 30 && guard++ < 500) {
      // Scatter around the plain south-west of the mound, hugging the river.
      const x = -9 + rng() * 14;
      const z = 3 + rng() * 15;
      const h = terrainHeight(x, z);
      const river = distToRiver(x, z);
      if (h < 0.4 || h > 2.6 || river < 1.9 || river > 8) continue;
      if (Math.hypot(x - 6, z + 0.5) < 4.5) continue; // keep out of the lower town
      result.push({
        position: [x, h + 0.05, z],
        rotY: (rng() - 0.5) * 0.6,
        scale: [1.6 + rng() * 1.4, 1.1 + rng() * 0.9],
        color: colors[Math.floor(rng() * colors.length)],
      });
    }
    return result;
  }, []);

  const haystacks = useMemo(() => {
    const rng = mulberry32(909);
    return patches.slice(0, 5).map((patch) => ({
      position: [
        patch.position[0] + (rng() - 0.5) * 2,
        terrainHeight(patch.position[0], patch.position[2] + 1),
        patch.position[2] + 1,
      ] as [number, number, number],
    }));
  }, [patches]);

  return (
    <group>
      <Instances limit={patches.length}>
        <planeGeometry />
        <meshStandardMaterial
          roughness={1}
          side={THREE.DoubleSide}
          emissive={AGRICULTURE}
          emissiveIntensity={agricultureOn ? 0.35 : 0}
          polygonOffset
          polygonOffsetFactor={-1}
        />
        {patches.map((patch, i) => (
          <Instance
            key={i}
            position={patch.position}
            rotation={[-Math.PI / 2, 0, patch.rotY]}
            scale={[patch.scale[0], patch.scale[1], 1]}
            color={patch.color}
          />
        ))}
      </Instances>
      {haystacks.map((stack, i) => (
        <mesh key={i} position={stack.position} castShadow>
          <coneGeometry args={[0.32, 0.55, 7]} />
          <meshStandardMaterial color="#c8ab62" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
