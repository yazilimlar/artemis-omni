"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { atlasMotion } from "@/lib/time-atlas/motion";

const BASE_TARGET = new THREE.Vector3(-1.5, 1.4, -1.5);
const CAMERA_OFFSET = new THREE.Vector3(26, 24, 26);
/** Screen-right axis of the isometric view, in world space. */
const RIGHT = new THREE.Vector3(1, 0, -1).normalize();

/**
 * Fixed cinematic camera: no free navigation. The camera translates a few
 * units along the screen axes (gentle auto-pan + pointer/tilt parallax) and
 * re-derives zoom from the viewport so the portrait composition holds.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const pan = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = Math.max(9, Math.min(size.width / 23, size.height / 45));
    ortho.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (atlasMotion.reducedMotion) {
      desired.set(0, 0, 0);
    } else {
      const autoPan = Math.sin(t * 0.07) * 1.4;
      const px = THREE.MathUtils.clamp(atlasMotion.parallaxX, -1, 1);
      const py = THREE.MathUtils.clamp(atlasMotion.parallaxY, -1, 1);
      desired
        .copy(RIGHT)
        .multiplyScalar(autoPan + px * 1.1)
        .add(scratch.set(0, Math.sin(t * 0.05) * 0.5 - py * 0.8, 0));
    }
    const lambda = 2.2;
    pan.x = THREE.MathUtils.damp(pan.x, desired.x, lambda, delta);
    pan.y = THREE.MathUtils.damp(pan.y, desired.y, lambda, delta);
    pan.z = THREE.MathUtils.damp(pan.z, desired.z, lambda, delta);

    camera.position.copy(BASE_TARGET).add(CAMERA_OFFSET).add(pan);
    scratch.copy(BASE_TARGET).add(pan);
    camera.lookAt(scratch);
  });

  return null;
}
