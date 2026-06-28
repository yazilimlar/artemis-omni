import * as React from "react";
import { cn } from "@/lib/utils/cn";

type FloatingDashboardPanelProps = {
  title: string;
  /** monospace eyebrow shown above title, e.g. "5D · COST" */
  kicker?: string;
  children?: React.ReactNode;
  className?: string;
  /** float animation class — controlled by parent so reduced-motion can disable */
  floatClass?: string;
};

/**
 * A styled glass panel that frames a floating artifact (dashboard fragment,
 * BIM fragment, schedule bar, cash-flow curve, AI nodes...). Pure HTML/CSS;
 * intended to be composed inside ArtemisSceneCanvas.
 */
export function FloatingDashboardPanel({
  title,
  kicker,
  children,
  className,
  floatClass,
}: FloatingDashboardPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-silver/15 bg-navy-deep/70 p-3 shadow-panel backdrop-blur-md",
        floatClass,
        className,
      )}
    >
      {/* Title bar */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-silver/70">
            {kicker ?? "Artemis"}
          </p>
        </div>
        <div className="flex gap-1" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-silver/30" />
          <span className="h-1 w-1 rounded-full bg-silver/30" />
          <span className="h-1 w-1 rounded-full bg-silver/30" />
        </div>
      </div>
      <p className="display-serif text-sm text-parchment">{title}</p>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

/** Small schedule (Gantt) fragment used inside a panel. */
export function ScheduleFragment() {
  const bars = [
    { w: "w-3/4", off: "ml-0" },
    { w: "w-1/2", off: "ml-6" },
    { w: "w-2/3", off: "ml-3" },
    { w: "w-1/3", off: "ml-12" },
  ];
  return (
    <div className="space-y-1.5">
      {bars.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-1 w-6 rounded bg-silver/20" />
          <span className={cn("h-1.5 rounded-full bg-gold/70", b.w, b.off)} />
        </div>
      ))}
    </div>
  );
}

/** BIM / structural grid fragment. */
export function BimFragment() {
  return (
    <svg viewBox="0 0 120 70" className="h-16 w-full" aria-hidden>
      <g stroke="hsl(210 18% 78% / 0.5)" strokeWidth="1" fill="none">
        <path d="M10 60 L40 20 L80 20 L110 60 Z" />
        <path d="M40 20 L40 60 M80 20 L80 60 M10 60 L110 60" />
        <path d="M25 40 L95 40" strokeDasharray="3 3" />
        <path d="M60 20 L60 60" strokeOpacity="0.4" />
      </g>
      <circle cx="40" cy="20" r="2" fill="hsl(41 64% 56%)" />
      <circle cx="80" cy="20" r="2" fill="hsl(41 64% 56%)" />
    </svg>
  );
}

/** AI agent node cluster fragment. */
export function AiNodesFragment() {
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full" aria-hidden>
      <g stroke="hsl(41 64% 56% / 0.45)" strokeWidth="1">
        <line x1="20" y1="30" x2="60" y2="12" />
        <line x1="20" y1="30" x2="60" y2="48" />
        <line x1="60" y1="12" x2="100" y2="30" />
        <line x1="60" y1="48" x2="100" y2="30" />
        <line x1="60" y1="12" x2="60" y2="48" />
      </g>
      {[
        [20, 30],
        [60, 12],
        [60, 48],
        [100, 30],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3.4"
          fill="hsl(230 35% 4%)"
          stroke="hsl(41 64% 56%)"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}
