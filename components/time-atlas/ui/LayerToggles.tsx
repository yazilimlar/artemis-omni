"use client";

import { LAYERS } from "@/data/troy/layers";
import { useTimeAtlas } from "@/lib/time-atlas/store";

/** Thematic overlay chips — Defense / Trade / Religion / Agriculture / Water. */
export function LayerToggles({ visible }: { visible: boolean }) {
  const activeLayers = useTimeAtlas((s) => s.activeLayers);
  const toggleLayer = useTimeAtlas((s) => s.toggleLayer);

  return (
    <div
      className={`pointer-events-auto flex gap-1.5 overflow-x-auto px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 transition-opacity duration-500 [scrollbar-width:none] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="group"
      aria-label="Overlay layers"
    >
      {LAYERS.map((layer) => {
        const active = activeLayers.includes(layer.id);
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => toggleLayer(layer.id)}
            aria-pressed={active}
            title={layer.description}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition-colors"
            style={{
              borderColor: active ? layer.color : "rgba(255,255,255,0.18)",
              color: active ? layer.color : "rgba(255,255,255,0.72)",
              backgroundColor: active ? `${layer.color}26` : "rgba(10,8,16,0.45)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: active ? layer.color : "rgba(255,255,255,0.35)" }}
            />
            {layer.name}
          </button>
        );
      })}
    </div>
  );
}
