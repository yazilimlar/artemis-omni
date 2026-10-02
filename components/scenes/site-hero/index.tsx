"use client";

import { useEffect, useRef } from "react";
import { subdividedIcosahedron, type Vec3 } from "./geometry";

/**
 * site-hero (ADR-016): a slowly rotating wireframe icosahedron whose vertices
 * breathe in and out. Drawn with the native Canvas 2D API; no 3D library, so
 * the homepage never loads three.js/R3F (ADR-016 renderer exception).
 */

const { vertices: BASE, edges: EDGES } = subdividedIcosahedron();
const GOLD = [214, 182, 110]; // site gold (hsl 41 55% 72%, approx.)
const BLUE = [64, 170, 230]; // signal blue accent

export default function SiteHeroScene({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const phases = BASE.map((_, i) => i * 0.71);
    const projected: { x: number; y: number; z: number }[] = BASE.map(() => ({ x: 0, y: 0, z: 0 }));
    let t = 0;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!pausedRef.current) t += delta;

      const rotY = t * 0.25;
      const rotX = 0.35 + 0.12 * Math.sin(t * 0.3);
      const [cy, sy, cx, sx] = [Math.cos(rotY), Math.sin(rotY), Math.cos(rotX), Math.sin(rotX)];
      const scale = Math.min(width, height) * 0.34;

      BASE.forEach(([x0, y0, z0]: Vec3, i) => {
        const r = 1 + 0.07 * Math.sin(1.3 * t + phases[i]);
        const x = x0 * r;
        const y = y0 * r;
        const z = z0 * r;
        // rotate around Y, then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const perspective = 3.2 / (3.2 + z2);
        projected[i].x = width / 2 + x1 * scale * perspective;
        projected[i].y = height / 2 + y2 * scale * perspective;
        projected[i].z = z2;
      });

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (2 - (pa.z + pb.z) / 2) / 3; // 1 = front, ~0.33 = back
        const mix = Math.max(0, Math.min(1, depth));
        const [r, g, bl] = GOLD.map((c, k) => Math.round(BLUE[k] + (c - BLUE[k]) * mix));
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${0.18 + 0.55 * mix})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      for (const p of projected) {
        const front = p.z < 0;
        ctx.fillStyle = front ? "rgba(232, 208, 150, 0.95)" : "rgba(120, 170, 210, 0.45)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, front ? 2.2 : 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      role="img"
      aria-label="Artemis System: rotating wireframe icosahedron"
    />
  );
}
