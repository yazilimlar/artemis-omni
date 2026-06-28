"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { CostCurveArtifact } from "@/components/cinematic/CostCurveArtifact";
import { TechnicalAnnotation } from "@/components/cinematic/TechnicalAnnotation";
import {
  FloatingDashboardPanel,
  ScheduleFragment,
  BimFragment,
  AiNodesFragment,
} from "@/components/cinematic/FloatingDashboardPanel";

/**
 * The animated cinematic layer for "The Artemis Intelligence Atelier".
 *
 * Deliberately NOT WebGL in this first pass: it's a composed set of floating
 * HTML/SVG artifacts with CSS float animations and a light pointer-parallax.
 * This keeps first load tiny and guarantees it works without WebGL, while
 * establishing the structure/visual direction for a future React Three Fiber
 * scene (which would be swapped in behind this same component boundary and
 * lazy-loaded the same way).
 */
export function ArtemisSceneCanvas({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = React.useState({ x: 0, y: 0 });

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px, y: py });
  }, []);

  const shift = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
  });

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setParallax({ x: 0, y: 0 })}
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-silver/15 bg-lunar-radial [perspective:1200px]",
        className,
      )}
    >
      {/* Atmosphere: blueprint grid, fog, bloom */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-60" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,_hsl(41_64%_56%/0.16),transparent_55%)]"
        aria-hidden
      />

      {/* Drifting particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[
          { l: "18%", t: "70%", d: "0s" },
          { l: "42%", t: "40%", d: "1.4s" },
          { l: "66%", t: "78%", d: "2.6s" },
          { l: "80%", t: "52%", d: "0.8s" },
          { l: "30%", t: "24%", d: "3.2s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold/70 animate-drift"
            style={{ left: p.l, top: p.t, animationDelay: p.d }}
          />
        ))}
      </div>

      {/* Lunar orb with sheen sweep */}
      <div className="absolute right-8 top-7 transition-transform duration-300" style={shift(-22)}>
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gold-sheen shadow-gold animate-float-slow sm:h-28 sm:w-28">
          <span className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/30 blur-md animate-sweep" />
        </div>
        <TechnicalAnnotation
          className="mt-2"
          side="left"
          label="ARTEMIS"
          value="LUNAR CORE"
        />
      </div>

      {/* Primary artifact: 5D cost-intelligence curve */}
      <div
        className="absolute inset-x-6 bottom-6 transition-transform duration-300 sm:inset-x-10"
        style={shift(14)}
      >
        <FloatingDashboardPanel
          kicker="5D · COST INTELLIGENCE"
          title="Project Control Curve"
          floatClass="animate-float"
        >
          <div className="h-28 sm:h-36">
            <CostCurveArtifact />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <TechnicalAnnotation label="EAC" value="+3.1%" />
            <TechnicalAnnotation side="left" label="SPI" value="0.97" />
          </div>
        </FloatingDashboardPanel>
      </div>

      {/* Schedule fragment */}
      <div
        className="absolute left-5 top-6 w-36 transition-transform duration-300 sm:left-8 sm:top-10 sm:w-40"
        style={shift(28)}
      >
        <FloatingDashboardPanel kicker="SCHEDULE" title="Critical Path" floatClass="animate-float-slow">
          <ScheduleFragment />
        </FloatingDashboardPanel>
      </div>

      {/* BIM fragment */}
      <div
        className="absolute left-6 top-44 hidden w-36 transition-transform duration-300 md:block"
        style={shift(20)}
      >
        <FloatingDashboardPanel kicker="BIM" title="Structural Grid" floatClass="animate-float">
          <BimFragment />
        </FloatingDashboardPanel>
      </div>

      {/* AI nodes fragment */}
      <div
        className="absolute right-7 top-40 hidden w-36 transition-transform duration-300 sm:block"
        style={shift(34)}
      >
        <FloatingDashboardPanel kicker="AGENTS" title="AI Decision Mesh" floatClass="animate-float-slow">
          <AiNodesFragment />
        </FloatingDashboardPanel>
      </div>
    </div>
  );
}

export default ArtemisSceneCanvas;
