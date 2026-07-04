"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { POIS, type Poi } from "@/data/troy/pois";
import { LAYER_BY_ID } from "@/data/troy/layers";
import { groundHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { eraProximity } from "@/lib/time-atlas/motion";

function Marker({ poi, phase }: { poi: Poi; phase: number }) {
  const group = useRef<THREE.Group>(null);
  const selected = useTimeAtlas((s) => s.selectedPoiId === poi.id);
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const selectPoi = useTimeAtlas((s) => s.selectPoi);

  const dimmed =
    activeLayers.length > 0 && !poi.layers.some((layer) => activeLayers.includes(layer));
  const color = LAYER_BY_ID[poi.layers[0]].color;
  const baseY = useMemo(
    () => groundHeight(poi.position[0], poi.position[2]) + poi.position[1] + 0.6,
    [poi],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Markers belong to the 600 BC era — they recede on ghost eras.
    const era = eraProximity(1);
    const target = era * (selected ? 1.4 : dimmed ? 0.45 : 1);
    const s = THREE.MathUtils.damp(group.current.scale.x, target, 6, delta);
    group.current.scale.setScalar(Math.max(s, 0.0001));
    group.current.visible = s > 0.04;
    group.current.position.y = baseY + Math.sin(t * 1.7 + phase) * 0.12;
    group.current.rotation.y = t * 0.7 + phase;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectPoi(poi.id);
  };

  return (
    <group
      ref={group}
      position={[poi.position[0], baseY, poi.position[2]]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1.6 : 0.9}
          transparent
          opacity={dimmed ? 0.45 : 1}
        />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.55, 0.03, 6, 26]} />
        <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.2 : 0.75} />
      </mesh>
      {/* Generous invisible hit target for touch. */}
      <mesh>
        <sphereGeometry args={[1.05, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Clickable POI hotspots for the active (600 BC) era. */
export function Hotspots() {
  return (
    <group>
      {POIS.map((poi, i) => (
        <Marker key={poi.id} poi={poi} phase={i * 1.31} />
      ))}
    </group>
  );
}
