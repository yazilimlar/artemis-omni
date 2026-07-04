"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { eraProximity } from "@/lib/time-atlas/motion";
import { terrainHeight } from "@/lib/time-atlas/terrain";

function makeGhostMaterial(color: string): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
}

/**
 * Wireframe teasers for the non-active eras, faded in by scroll proximity:
 * 1200 BC (Troy VI grandeur), 150 AD (Roman Ilium), 2026 AD (the dig site).
 * The 600 BC diorama stays underneath as spatial context.
 */
export function GhostEras() {
  const bronzeRef = useRef<THREE.Group>(null);
  const romanRef = useRef<THREE.Group>(null);
  const modernRef = useRef<THREE.Group>(null);

  const materials = useMemo(
    () => ({
      bronze: makeGhostMaterial("#e09a68"),
      roman: makeGhostMaterial("#ccd3e4"),
      modern: makeGhostMaterial("#7fd4b8"),
    }),
    [],
  );

  useFrame(() => {
    const eras: Array<[THREE.Group | null, THREE.MeshBasicMaterial, number]> = [
      [bronzeRef.current, materials.bronze, 0],
      [romanRef.current, materials.roman, 2],
      [modernRef.current, materials.modern, 3],
    ];
    for (const [group, material, order] of eras) {
      const prox = eraProximity(order);
      material.opacity = Math.max(0, prox - 0.12) * 0.8;
      if (group) {
        group.visible = material.opacity > 0.02;
        group.position.y = (1 - prox) * 1.4;
      }
    }
  });

  const plateauY = terrainHeight(0, 0);
  const townY = terrainHeight(6, -0.5);

  return (
    <>
      {/* 1200 BC — Troy VI/VIIa: great circuit, towers, palace terraces. */}
      <group ref={bronzeRef} visible={false}>
        <mesh material={materials.bronze} position={[0, plateauY - 1.2, 0]}>
          <cylinderGeometry args={[5.5, 6.1, 2.6, 18, 1, true]} />
        </mesh>
        {[0.35, 1.7, 3.7, 5.1].map((angle) => (
          <mesh
            key={angle}
            material={materials.bronze}
            position={[Math.cos(angle) * 5.7, plateauY - 0.6, Math.sin(angle) * 5.7]}
            rotation-y={-angle}
          >
            <boxGeometry args={[1.7, 3.2, 1.7]} />
          </mesh>
        ))}
        <mesh material={materials.bronze} position={[-0.4, plateauY + 0.9, 0.4]}>
          <boxGeometry args={[2.8, 1.5, 1.7]} />
        </mesh>
        <mesh material={materials.bronze} position={[4, townY - 0.3, 0]} scale={[1, 1, 0.8]}>
          <cylinderGeometry args={[11, 11.6, 1.4, 22, 1, true]} />
        </mesh>
      </group>

      {/* 150 AD — Roman Ilium: grand temple, odeon, street grid. */}
      <group ref={romanRef} visible={false}>
        <mesh material={materials.roman} position={[0.8, plateauY + 0.9, -1.5]} rotation-y={-0.2}>
          <boxGeometry args={[5.4, 1.9, 3.1]} />
        </mesh>
        <mesh
          material={materials.roman}
          position={[6.5, townY + 0.5, 1.8]}
          rotation-y={2.4}
        >
          <cylinderGeometry args={[2.1, 2.1, 1.2, 14, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh material={materials.roman} position={[4.8, townY + 0.4, -3.2]}>
          <boxGeometry args={[1.8, 1.1, 1.8]} />
        </mesh>
        {[-1.5, 1.5].map((offset) => (
          <mesh
            key={`a${offset}`}
            material={materials.roman}
            position={[6 + offset, townY + 0.05, -0.5 - offset]}
            rotation-y={0.8}
          >
            <boxGeometry args={[9, 0.08, 0.5]} />
          </mesh>
        ))}
        {[-1.8, 1.8].map((offset) => (
          <mesh
            key={`b${offset}`}
            material={materials.roman}
            position={[6 + offset, townY + 0.05, -0.5 + offset]}
            rotation-y={-0.75}
          >
            <boxGeometry args={[9, 0.08, 0.5]} />
          </mesh>
        ))}
      </group>

      {/* 2026 AD — the excavated mound: trenches, shelter, visitor ramp. */}
      <group ref={modernRef} visible={false}>
        {/* Schliemann's great north-south trench. */}
        <mesh material={materials.modern} position={[-1, plateauY - 1, 0.4]} rotation-y={0.3}>
          <boxGeometry args={[2.2, 2.4, 6.5]} />
        </mesh>
        <mesh material={materials.modern} position={[2.2, plateauY - 0.5, 1.6]} rotation-y={-0.6}>
          <boxGeometry args={[1.4, 1.4, 3.4]} />
        </mesh>
        {/* Protective shelter roof. */}
        <mesh material={materials.modern} position={[1.2, plateauY + 1.7, -0.8]} rotation-z={0.08}>
          <boxGeometry args={[5.4, 0.14, 4.2]} />
        </mesh>
        {/* Visitor ramp circling the mound. */}
        <mesh
          material={materials.modern}
          position={[0, plateauY - 1.6, 0]}
          rotation-x={-Math.PI / 2}
        >
          <torusGeometry args={[6.6, 0.28, 4, 28, Math.PI * 1.35]} />
        </mesh>
        {/* Entrance building at the site edge. */}
        <mesh material={materials.modern} position={[9.5, terrainHeight(9.5, -4) + 0.5, -4]}>
          <boxGeometry args={[2.2, 1, 1.4]} />
        </mesh>
      </group>
    </>
  );
}
