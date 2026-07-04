"use client";

import * as THREE from "three";
import { terrainHeight } from "@/lib/time-atlas/terrain";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { LAYER_BY_ID } from "@/data/troy/layers";

const TRADE = new THREE.Color(LAYER_BY_ID.trade.color);

function Ship({
  position,
  rotY,
  sail = true,
}: {
  position: [number, number, number];
  rotY: number;
  sail?: boolean;
}) {
  return (
    <group position={position} rotation-y={rotY}>
      <mesh position-y={0.06} castShadow>
        <boxGeometry args={[2.0, 0.32, 0.58]} />
        <meshStandardMaterial color="#6d4f33" roughness={0.85} />
      </mesh>
      <mesh position={[0.98, 0.3, 0]} rotation-z={-0.55}>
        <boxGeometry args={[0.5, 0.15, 0.42]} />
        <meshStandardMaterial color="#7a5a3b" roughness={0.85} />
      </mesh>
      <mesh position={[-0.98, 0.3, 0]} rotation-z={0.55}>
        <boxGeometry args={[0.5, 0.15, 0.42]} />
        <meshStandardMaterial color="#7a5a3b" roughness={0.85} />
      </mesh>
      <mesh position-y={0.95}>
        <cylinderGeometry args={[0.035, 0.045, 1.5, 5]} />
        <meshStandardMaterial color="#5a4128" roughness={0.9} />
      </mesh>
      {sail ? (
        <>
          <mesh position-y={1.6} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.03, 0.03, 1.15, 5]} />
            <meshStandardMaterial color="#5a4128" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.18, 0]}>
            <planeGeometry args={[1.05, 0.8]} />
            <meshStandardMaterial color="#e8dbb8" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </>
      ) : (
        <mesh position-y={1.55} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.05, 0.05, 1.1, 5]} />
          <meshStandardMaterial color="#d9ccab" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

/**
 * The beach-harbor cove on the NW shore: timber jetty, storerooms and ships
 * drawn up or riding at anchor in the strait.
 */
export function Harbor() {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const tradeOn = activeLayers.includes("trade");
  const tradeGlow = tradeOn ? 0.4 : 0;

  const pierYaw = Math.atan2(2.4, -2.2); // deck long axis toward open water

  return (
    <group>
      {/* Jetty. */}
      <group position={[-12.4, 0, -4.2]} rotation-y={pierYaw}>
        {[0, 1.5, 3.0].map((offset) => (
          <mesh key={offset} position={[offset, 0.34, 0]} castShadow>
            <boxGeometry args={[1.55, 0.12, 0.95]} />
            <meshStandardMaterial
              color="#8a6f4d"
              roughness={0.9}
              emissive={TRADE}
              emissiveIntensity={tradeGlow}
            />
          </mesh>
        ))}
        {[-0.6, 0.9, 2.4, 3.6].map((offset) => (
          <mesh key={offset} position={[offset, -0.2, 0.35]}>
            <cylinderGeometry args={[0.07, 0.07, 1.1, 5]} />
            <meshStandardMaterial color="#5a4128" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Storerooms above the beach. */}
      {(
        [
          [-10.9, -2.2, 1.5, 0.9, 0.4],
          [-9.9, -3.2, 1.2, 0.75, -0.2],
        ] as Array<[number, number, number, number, number]>
      ).map(([x, z, w, h, rot], i) => {
        const y = terrainHeight(x, z);
        return (
          <group key={i} position={[x, y, z]} rotation-y={rot}>
            <mesh position-y={h / 2} castShadow>
              <boxGeometry args={[w, h, w * 0.62]} />
              <meshStandardMaterial
                color="#ad9573"
                roughness={0.95}
                emissive={TRADE}
                emissiveIntensity={tradeGlow}
              />
            </mesh>
            <mesh position-y={h + 0.16} rotation-y={Math.PI / 4}>
              <coneGeometry args={[w * 0.55, 0.32, 4]} />
              <meshStandardMaterial color="#8a7355" roughness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* Ships: drawn up at the cove, and waiting at anchor in the strait. */}
      <Ship position={[-13.6, 0, -5.6]} rotY={2.2} sail={false} />
      <Ship position={[-12.5, 0, -7.1]} rotY={1.8} sail={false} />
      <Ship position={[-16.5, 0, -13]} rotY={0.6} />
      <Ship position={[-13, 0, -16.5]} rotY={-0.4} />
      <Ship position={[-6.5, 0, -19]} rotY={0.3} />
    </group>
  );
}
