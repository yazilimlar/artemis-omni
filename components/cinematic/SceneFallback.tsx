import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { CostCurveArtifact } from "@/components/cinematic/CostCurveArtifact";
import {
  FloatingDashboardPanel,
  ScheduleFragment,
  AiNodesFragment,
} from "@/components/cinematic/FloatingDashboardPanel";

/**
 * Static, animation-free rendering of the 5D Construction Intelligence Bridge scene.
 * Used on mobile, when WebGL is unavailable, and as the visual for the
 * reduced-motion fallback. Lightweight SVG/HTML only — no client JS required.
 */
export function SceneFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-silver/15 bg-lunar-radial",
        className,
      )}
    >
      {/* Blueprint grid + fog */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-60" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_hsl(41_64%_56%/0.12),transparent_55%)]"
        aria-hidden
      />

      {/* Lunar orb / Artemis symbol */}
      <div
        className="absolute right-6 top-6 h-20 w-20 rounded-full bg-gold-sheen opacity-90 shadow-gold sm:h-24 sm:w-24"
        aria-hidden
      />

      {/* Primary artifact: cost-intelligence curve */}
      <div className="absolute inset-x-6 bottom-6 sm:inset-x-10">
        <FloatingDashboardPanel kicker="5D · CASHFLOW FORECAST" title="Cashflow Intelligence Engine">
          <div className="h-28 sm:h-32">
            <CostCurveArtifact />
          </div>
        </FloatingDashboardPanel>
      </div>

      {/* Supporting artifacts */}
      <div className="absolute left-6 top-6 w-36 sm:left-10 sm:top-12">
        <FloatingDashboardPanel kicker="SCHEDULE" title="Critical Path">
          <ScheduleFragment />
        </FloatingDashboardPanel>
      </div>
      <div className="absolute right-6 top-32 hidden w-36 sm:block">
        <FloatingDashboardPanel kicker="FORECAST" title="System Projections">
          <AiNodesFragment />
        </FloatingDashboardPanel>
      </div>
    </div>
  );
}
