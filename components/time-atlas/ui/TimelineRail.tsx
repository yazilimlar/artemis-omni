"use client";

import { ERAS } from "@/data/troy/eras";
import { useTimeAtlas } from "@/lib/time-atlas/store";

/** Vertical era rail on the right edge; tap a year to scroll to that era. */
export function TimelineRail({ onJump }: { onJump: (order: number) => void }) {
  const activeEraId = useTimeAtlas((s) => s.activeEraId);

  return (
    <nav
      aria-label="Timeline"
      className="pointer-events-auto absolute right-2.5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-end gap-5"
    >
      {ERAS.map((era) => {
        const active = era.id === activeEraId;
        return (
          <button
            key={era.id}
            type="button"
            onClick={() => onJump(era.order)}
            aria-current={active ? "step" : undefined}
            className="group flex items-center gap-2"
          >
            <span
              className={`font-mono text-[10px] tracking-widest transition-all duration-300 ${
                active ? "opacity-95" : "opacity-40 group-hover:opacity-70"
              }`}
              style={{ color: active ? era.accent : "#fff" }}
            >
              {era.year}
            </span>
            <span
              className="h-2 w-2 rounded-full border transition-all duration-300"
              style={{
                borderColor: active ? era.accent : "rgba(255,255,255,0.4)",
                backgroundColor: active ? era.accent : "transparent",
                boxShadow: active ? `0 0 10px ${era.accent}` : "none",
                transform: active ? "scale(1.35)" : "scale(1)",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
