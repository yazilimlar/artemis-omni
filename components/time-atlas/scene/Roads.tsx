"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { groundHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { LAYER_BY_ID } from "@/data/troy/layers";

const TRADE = new THREE.Color(LAYER_BY_ID.trade.color);

/** Polylines: gate road / inland ridge road, harbor road, farm track. */
const ROUTES: Array<Array<[number, number]>> = [
  [
    [3.9, -0.9],
    [6, -0.5],
    [8, 1.2],
    [10, 4],
    [11.8, 8],
    [12.8, 12],
  ],
  [
    [6, -0.5],
    [3, -3],
    [-1, -5],
    [-5.5, -5.2],
    [-9, -5.6],
    [-11.3, -3.4],
  ],
  [
    [-1, 3],
    [-3.2, 5],
    [-4.5, 7.5],
    [-4, 10.5],
  ],
];

interface Segment {
  position: [number, number, number];
  rotY: number;
  length: number;
}

/**
 * Dirt roads as short ground-hugging ribbon segments, subdivided so they
 * follow the terrain. The harbor road fords the Scamander on a plank bridge.
 */
export function Roads() {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const tradeOn = activeLayers.includes("trade");

  const segments = useMemo<Segment[]>(() => {
    const result: Segment[] = [];
    for (const route of ROUTES) {
      for (let i = 0; i < route.length - 1; i++) {
        const [ax, az] = route[i];
        const [bx, bz] = route[i + 1];
        const dist = Math.hypot(bx - ax, bz - az);
        const steps = Math.max(1, Math.round(dist / 1.4));
        for (let s = 0; s < steps; s++) {
          const t0 = s / steps;
          const t1 = (s + 1) / steps;
          const x0 = ax + (bx - ax) * t0;
          const z0 = az + (bz - az) * t0;
          const x1 = ax + (bx - ax) * t1;
          const z1 = az + (bz - az) * t1;
          const mx = (x0 + x1) / 2;
          const mz = (z0 + z1) / 2;
          result.push({
            position: [mx, groundHeight(mx, mz) + 0.06, mz],
            rotY: Math.atan2(x1 - x0, z1 - z0),
            length: Math.hypot(x1 - x0, z1 - z0) + 0.25,
          });
        }
      }
    }
    return result;
  }, []);

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh key={i} position={seg.position} rotation={[-Math.PI / 2, 0, seg.rotY]}>
          <planeGeometry args={[0.55, seg.length]} />
          <meshStandardMaterial
            color="#c0a980"
            roughness={1}
            transparent
            opacity={0.9}
            polygonOffset
            polygonOffsetFactor={-2}
            emissive={TRADE}
            emissiveIntensity={tradeOn ? 0.3 : 0}
          />
        </mesh>
      ))}
      {/* Plank bridge where the harbor road crosses the river. */}
      <mesh position={[-10.2, 0.28, -4.6]} rotation-y={0.5} castShadow>
        <boxGeometry args={[3.2, 0.12, 0.7]} />
        <meshStandardMaterial
          color="#8a6f4d"
          roughness={0.9}
          emissive={TRADE}
          emissiveIntensity={tradeOn ? 0.35 : 0}
        />
      </mesh>
    </group>
  );
}
