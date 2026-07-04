"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { POI_BY_ID } from "@/data/troy/pois";
import { LAYER_BY_ID } from "@/data/troy/layers";
import { ACTIVE_ERA } from "@/data/troy/eras";
import { useTimeAtlas } from "@/lib/time-atlas/store";
import { ConfidenceBadge } from "./ConfidenceBadge";

/** Bottom-sheet POI card: layers, confidence, evidence snippet, source note. */
export function PoiSheet() {
  const selectedPoiId = useTimeAtlas((s) => s.selectedPoiId);
  const selectPoi = useTimeAtlas((s) => s.selectPoi);
  const poi = selectedPoiId ? POI_BY_ID[selectedPoiId] : null;

  return (
    <AnimatePresence>
      {poi && (
        <motion.div
          key={poi.id}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 500) selectPoi(null);
          }}
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 mx-auto max-w-md rounded-t-2xl border border-b-0 border-white/12 bg-[#12101cf2] px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3 shadow-[0_-18px_60px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25" aria-hidden />
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                {ACTIVE_ERA.year} · {ACTIVE_ERA.title}
              </p>
              <h2 className="mt-1 font-serif text-xl leading-tight text-parchment">{poi.name}</h2>
            </div>
            <button
              type="button"
              onClick={() => selectPoi(null)}
              aria-label="Close card"
              className="rounded-full border border-white/15 p-1.5 text-white/60 transition-colors hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <ConfidenceBadge confidence={poi.confidence} />
            {poi.layers.map((layerId) => {
              const layer = LAYER_BY_ID[layerId];
              return (
                <span
                  key={layerId}
                  className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                  style={{
                    borderColor: `${layer.color}66`,
                    color: layer.color,
                    backgroundColor: `${layer.color}14`,
                  }}
                >
                  {layer.name}
                </span>
              );
            })}
          </div>

          <p className="text-sm leading-relaxed text-white/85">{poi.summary}</p>

          <blockquote
            className="mt-3 border-l-2 pl-3 text-[13px] leading-relaxed text-white/60"
            style={{ borderColor: LAYER_BY_ID[poi.layers[0]].color }}
          >
            {poi.evidence}
          </blockquote>

          <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
            SOURCE — {poi.source}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
