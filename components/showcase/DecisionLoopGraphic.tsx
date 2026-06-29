import * as React from "react";
import { cn } from "@/lib/utils/cn";

const NODES = [
  "Connected Data",
  "Audit-grade Logic",
  "Human Review",
  "Executive Decision",
  "Field Action",
];

/**
 * Executive decision loop — data → logic → human review → decision → action,
 * looping back. Pure SVG; communicates controlled, accountable automation.
 */
export function DecisionLoopGraphic({ className }: { className?: string }) {
  const W = 760;
  const H = 220;
  const n = NODES.length;
  const cx = (i: number) => 70 + (i * (W - 140)) / (n - 1);
  const cy = 80;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Artemis decision loop: connected data to audit-grade logic to human review to executive decision to field action, looping back"
    >
      {/* forward connectors */}
      {NODES.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1={cx(i) + 52}
          y1={cy}
          x2={cx(i + 1) - 52}
          y2={cy}
          stroke="hsl(var(--blueprint) / 0.5)"
          strokeWidth="1.5"
          markerEnd="url(#dl-arrow)"
        />
      ))}
      {/* return loop */}
      <path
        d={`M ${cx(n - 1)} ${cy + 30} C ${cx(n - 1)} ${H - 18}, ${cx(0)} ${H - 18}, ${cx(0)} ${cy + 30}`}
        fill="none"
        stroke="hsl(var(--gold) / 0.5)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        markerEnd="url(#dl-arrow-gold)"
      />
      <text
        x={W / 2}
        y={H - 22}
        textAnchor="middle"
        fill="hsl(var(--gold-soft))"
        fontSize="11"
        fontFamily="monospace"
      >
        actuals feed back · the loop closes
      </text>

      <defs>
        <marker id="dl-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--blueprint))" />
        </marker>
        <marker id="dl-arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--gold))" />
        </marker>
      </defs>

      {/* nodes */}
      {NODES.map((label, i) => (
        <g key={label}>
          <circle
            cx={cx(i)}
            cy={cy}
            r="30"
            fill="hsl(var(--navy-deep))"
            stroke={i === 2 ? "hsl(var(--gold))" : "hsl(var(--silver) / 0.4)"}
            strokeWidth={i === 2 ? "1.8" : "1.2"}
          />
          <text
            x={cx(i)}
            y={cy + 50}
            textAnchor="middle"
            fill="hsl(var(--foreground) / 0.85)"
            fontSize="11"
            fontFamily="ui-sans-serif, system-ui"
          >
            {label}
          </text>
          <text x={cx(i)} y={cy + 4} textAnchor="middle" fill="hsl(var(--gold-soft))" fontSize="13" fontFamily="monospace">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
