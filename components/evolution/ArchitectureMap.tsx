"use client";

import { SceneIsland } from "@/components/scenes/SceneIsland";
import {
  KIND_COLORS,
  KIND_LABELS,
  architectureEdges,
  architectureNodes,
  type ArchitectureKind,
} from "@/lib/evolution/architecture";

/**
 * Architecture map: the registered 3D scene (evolution-architecture-map) through the
 * ADR-015 island. Under reduced motion, without WebGL, on low devices, or on error it
 * falls back to a static 2D layout of the same graph. The node and edge lists below
 * are always present as text.
 */
export function ArchitectureMap({
  fallbackSrc,
  maxSessionSeconds,
  fpsFloor,
}: {
  fallbackSrc: string;
  maxSessionSeconds: number;
  fpsFloor: number;
}) {
  const label = new Map(architectureNodes.map((n) => [n.id, n.label]));
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,36rem)_1fr]">
      <SceneIsland
        sceneId="evolution-architecture-map"
        fallbackSrc={fallbackSrc}
        fallbackAlt="Artemis architecture map: registries, scripts, routes and services with data flow"
        maxSessionSeconds={maxSessionSeconds}
        fpsFloor={fpsFloor}
      />
      <div className="text-sm text-muted-foreground">
        <ul className="flex flex-wrap gap-3" aria-label="Node kinds">
          {(Object.keys(KIND_COLORS) as ArchitectureKind[]).map((kind) => (
            <li key={kind} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLORS[kind] }} aria-hidden />
              {KIND_LABELS[kind]}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          An arrow runs from where data or control starts to what reads or is produced by it. The
          structure is maintained by hand in <code className="font-mono text-xs">lib/evolution/architecture.ts</code>.
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-foreground/80">Nodes and flows as text</summary>
          <ul className="mt-2 space-y-1">
            {architectureNodes.map((n) => (
              <li key={n.id}>
                <span className="text-foreground">{n.label}</span>: {n.detail}
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-1">
            {architectureEdges.map((e) => (
              <li key={`${e.from}-${e.to}`}>
                {label.get(e.from)} → {label.get(e.to)} ({e.label})
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
