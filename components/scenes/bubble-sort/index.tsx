"use client";

import { useEffect, useRef } from "react";
import { BAR_COUNT, BASE_SEED, generateBubbleSortSteps, shuffled, swapsThrough, type Step } from "./algorithm";

/**
 * Bubble sort (ADR-015 scene, ADR-020 Tier 2). 20 bars, a deterministic shuffle, one
 * comparison per step, drawn on a Canvas 2D. Hand-written: no animation library, no assets,
 * no fonts (system-ui). The steps are generated up front, so each frame is a pure function of
 * the step index. After the sort finishes it holds for two seconds, then reshuffles with the
 * next seed and restarts.
 */

const STEP_MS = 90;
const HOLD_MS = 2000;
const COLORS = {
  background: "#0b1324",
  text: "#e8edf5",
  bar: "#475569",
  comparing: "#06b6d4",
  swapping: "#eab308",
  sorted: "#22c55e",
};

type Run = { values: number[]; steps: Step[] };

function makeRun(round: number): Run {
  const values = shuffled(BAR_COUNT, BASE_SEED + round);
  return { values, steps: generateBubbleSortSteps(values) };
}

/** Draws the state after step `index` (-1 means before the first comparison). */
function draw(ctx: CanvasRenderingContext2D, width: number, height: number, run: Run, index: number) {
  const step = index >= 0 ? run.steps[Math.min(index, run.steps.length - 1)] : undefined;
  const array = step ? step.array : run.values;
  const comparisons = step ? Math.min(index, run.steps.length - 1) + 1 : 0;
  const swaps = step ? swapsThrough(run.steps, index) : 0;
  const sortedFrom = step ? step.sortedFrom : array.length;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const pad = Math.max(12, width * 0.04);
  const headerSize = Math.max(11, Math.min(20, width * 0.045));
  ctx.fillStyle = COLORS.text;
  ctx.font = `600 ${headerSize}px system-ui, sans-serif`;
  ctx.textBaseline = "top";
  ctx.fillText(`Bubble Sort — comparisons: ${comparisons}, swaps: ${swaps}`, pad, pad);

  const top = pad + headerSize + pad;
  const chartHeight = height - top - pad;
  const slot = (width - pad * 2) / array.length;
  const barWidth = slot * 0.78;
  const labels = barWidth >= 18;
  ctx.font = `${Math.max(9, Math.min(13, barWidth * 0.5))}px system-ui, sans-serif`;
  ctx.textAlign = "center";

  array.forEach((value, i) => {
    const barHeight = (value / array.length) * chartHeight;
    const x = pad + i * slot + (slot - barWidth) / 2;
    const y = top + chartHeight - barHeight;
    const comparing = step && (i === step.comparing[0] || i === step.comparing[1]);
    ctx.fillStyle =
      i >= sortedFrom ? COLORS.sorted : comparing ? (step.swapped ? COLORS.swapping : COLORS.comparing) : COLORS.bar;
    ctx.fillRect(x, y, barWidth, barHeight);
    if (labels) {
      ctx.fillStyle = COLORS.text;
      ctx.textBaseline = "bottom";
      ctx.fillText(String(value), x + barWidth / 2, y - 2);
    }
  });
  ctx.textAlign = "left";
}

export default function BubbleSortScene({ paused = false }: { paused?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const element = container.current;
    const target = canvas.current;
    const ctx = target?.getContext("2d");
    if (!element || !target || !ctx) return;

    let width = 0;
    let height = 0;
    let round = 0;
    let run = makeRun(round);
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = element.clientWidth;
      height = element.clientHeight;
      target.width = Math.max(1, Math.round(width * dpr));
      target.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    const frame = (now: number) => {
      const delta = Math.min(now - last, 100);
      last = now;
      if (!pausedRef.current) elapsed += delta;
      if (elapsed >= run.steps.length * STEP_MS + HOLD_MS) {
        round += 1;
        run = makeRun(round);
        elapsed = 0;
      }
      draw(ctx, width, height, run, Math.min(Math.floor(elapsed / STEP_MS), run.steps.length - 1));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={container} className="h-full w-full">
      <canvas
        ref={canvas}
        className="block h-full w-full"
        role="img"
        aria-label="Bubble sort of 20 bars: pairs are compared and swapped until the bars are in order, then the sort restarts on a new shuffle."
      />
    </div>
  );
}
