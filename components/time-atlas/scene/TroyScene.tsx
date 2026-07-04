"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { CameraRig } from "./CameraRig";
import { Terrain } from "./Terrain";
import { Backdrop } from "./Backdrop";
import { Citadel } from "./Citadel";
import { LowerTown } from "./LowerTown";
import { Farms } from "./Farms";
import { Roads } from "./Roads";
import { Harbor } from "./Harbor";
import { Trees } from "./Trees";
import { Hotspots } from "./Hotspots";
import { GhostEras } from "./GhostEras";

/**
 * Guarantees R3F's pointer listeners are attached to the DOM. Under React
 * StrictMode's double-invoked effects the built-in connect can end up
 * disconnected, which silently kills all hotspot interaction.
 */
function EventBridge() {
  const gl = useThree((s) => s.gl);
  const events = useThree((s) => s.events);
  useEffect(() => {
    if (!events.connected) {
      events.connect?.(gl.domElement.parentElement ?? gl.domElement);
    }
  }, [events, gl]);
  return null;
}

/**
 * The fixed isometric diorama of Troy / Ilion c. 600 BC.
 * Mobile-first budget: procedural geometry only, instanced scatter,
 * one shadow-casting light, no post-processing. The canvas is transparent —
 * the golden-hour sky is a CSS gradient behind it.
 */
export function TroyScene() {
  const selectPoi = useTimeAtlas((s) => s.selectPoi);

  return (
    <Canvas
      className="absolute inset-0"
      orthographic
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [26, 24, 26], zoom: 16, near: 2, far: 160 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => selectPoi(null)}
      onCreated={(state) => {
        // Dev-only handle for debugging/e2e probing; absent in production builds.
        if (process.env.NODE_ENV !== "production") {
          (window as unknown as Record<string, unknown>).__troyState = state;
        }
      }}
    >
      <fog attach="fog" args={["#dd9a66", 42, 100]} />

      {/* Golden hour: warm key light low over the strait + cool ambient fill. */}
      <directionalLight
        castShadow
        color="#ffb46b"
        intensity={2.6}
        position={[-26, 15, -12]}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={2}
        shadow-camera-far={90}
      />
      <directionalLight color="#8d9bd8" intensity={0.55} position={[24, 12, 18]} />
      <hemisphereLight args={["#ffd9ad", "#4a3c60", 0.95]} />

      <EventBridge />
      <CameraRig />
      <Backdrop />
      <Terrain />
      <Citadel />
      <LowerTown />
      <Farms />
      <Roads />
      <Harbor />
      <Trees />
      <GhostEras />
      <Hotspots />
    </Canvas>
  );
}
