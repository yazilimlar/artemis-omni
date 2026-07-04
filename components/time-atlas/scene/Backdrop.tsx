"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Billboard } from "@react-three/drei";

function makeGlowTexture(stops: Array<[number, string]>): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Golden-hour atmosphere: the low sun over the strait, a soft haze band at
 * the waterline, and the far silhouettes — Gallipoli shore, Imbros and the
 * peak of Samothrace (Iliad 13.12). All unlit, fog-affected, no post-processing.
 */
export function Backdrop() {
  const sunTexture = useMemo(
    () =>
      makeGlowTexture([
        [0, "rgba(255, 236, 200, 1)"],
        [0.25, "rgba(255, 190, 120, 0.85)"],
        [1, "rgba(255, 160, 90, 0)"],
      ]),
    [],
  );
  const hazeTexture = useMemo(
    () =>
      makeGlowTexture([
        [0, "rgba(255, 205, 150, 0.5)"],
        [1, "rgba(255, 185, 130, 0)"],
      ]),
    [],
  );

  return (
    <group>
      {/* Low sun over the Dardanelles. */}
      <Billboard position={[-30, 8, -24]}>
        <mesh renderOrder={-2}>
          <planeGeometry args={[17, 17]} />
          <meshBasicMaterial
            map={sunTexture}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </mesh>
      </Billboard>

      {/* Haze band along the waterline. */}
      <Billboard position={[-11, 1.6, -13]}>
        <mesh renderOrder={-1} scale={[64, 9, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={hazeTexture} transparent depthWrite={false} fog={false} />
        </mesh>
      </Billboard>

      {/* Gallipoli shore across the strait — long low ridge. */}
      <group position={[-4, 0, -19]}>
        <mesh scale={[1.9, 1, 1]}>
          <coneGeometry args={[5.5, 2.2, 9]} />
          <meshStandardMaterial color="#6f5a68" roughness={1} />
        </mesh>
        <mesh position={[6.5, 0, -1]} scale={[1.5, 1, 1]}>
          <coneGeometry args={[4.5, 1.6, 9]} />
          <meshStandardMaterial color="#6f5a68" roughness={1} />
        </mesh>
      </group>
      {/* Imbros. */}
      <group position={[-25, 0, -17]}>
        <mesh scale={[1.6, 1, 1.1]}>
          <coneGeometry args={[5.5, 3.2, 9]} />
          <meshStandardMaterial color="#655370" roughness={1} />
        </mesh>
        <mesh position={[-4, 0, 2]}>
          <coneGeometry args={[4, 2, 9]} />
          <meshStandardMaterial color="#655370" roughness={1} />
        </mesh>
      </group>
      {/* Samothrace — far peak in the haze (Iliad 13.12). */}
      <mesh position={[-29, 0, -33]} scale={[1.4, 1, 1]}>
        <coneGeometry args={[7.5, 6.5, 9]} />
        <meshStandardMaterial color="#71617e" roughness={1} />
      </mesh>
    </group>
  );
}
