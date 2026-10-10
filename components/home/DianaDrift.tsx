"use client";

import * as React from "react";

/**
 * Ambient "Diana" decoration — crescent moon, orbital rings, a drawn-bow arc
 * and drifting particles in brand blue/gold. Pure 2D canvas, no dependencies,
 * a few KB. A featherweight echo of the Artemis Diana 3D demonstrator, meant
 * as subtle background ornament, not the full interactive piece.
 *
 * Decorative only: pointer-transparent, hidden from assistive tech, paused
 * when offscreen or when the tab is hidden. Static frame under reduced motion.
 */
export function DianaDrift({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = 280;
    const H = 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: 64 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      speed: Math.random() * 6 + 2,
      tw: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let running = false;
    const t0 = performance.now();

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H * 0.44;

      // Drifting particles.
      for (const p of particles) {
        const y = (((p.y - t * p.speed) % H) + H) % H;
        const a = 0.22 + 0.18 * Math.sin(t * 1.6 + p.tw);
        ctx.beginPath();
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 200, 255, ${a.toFixed(3)})`;
        ctx.fill();
      }

      // Orbital rings, slow counter-rotation.
      const rings: Array<[number, number, number]> = [
        [150, 0.34, 0.5],
        [120, 0.28, -0.4],
        [185, 0.22, 0.9],
      ];
      rings.forEach(([ry, alpha, tilt], i) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt + t * 0.05 * (i % 2 === 0 ? 1 : -1));
        ctx.beginPath();
        ctx.ellipse(0, 0, 118, ry * 0.52, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(98, 199, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Drawn-bow arc + string, breathing gently.
      ctx.save();
      ctx.translate(cx + 64, cy);
      ctx.rotate(-0.32 + Math.sin(t * 0.3) * 0.02);
      ctx.beginPath();
      ctx.arc(0, 0, 128, -1.05, 1.05);
      ctx.strokeStyle = "rgba(210, 176, 116, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      const sx = 128 * Math.cos(1.05);
      ctx.beginPath();
      ctx.moveTo(sx, 128 * Math.sin(-1.05));
      ctx.lineTo(sx, 128 * Math.sin(1.05));
      ctx.strokeStyle = "rgba(150, 200, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Crescent moon (gold disc with an offset punch-out).
      const pulse = 1 + Math.sin(t * 0.8) * 0.025;
      ctx.save();
      ctx.translate(cx - 58, cy - 148);
      ctx.scale(pulse, pulse);
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210, 176, 116, 0.55)";
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(13, -9, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!reduced && running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduced) {
        if (reduced) draw(t0);
        return;
      }
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
    const onVis = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().top < window.innerHeight) start();
    };
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: 280, height: 420 }}
    />
  );
}
