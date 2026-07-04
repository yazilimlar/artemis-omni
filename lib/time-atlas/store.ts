"use client";

import { create } from "zustand";
import { ACTIVE_ERA } from "@/data/troy/eras";
import type { LayerId } from "@/data/troy/layers";

/**
 * Discrete UI state for the Time Atlas. High-frequency values (scroll
 * progress, parallax) intentionally live in lib/time-atlas/motion.ts as
 * mutable refs so the 3D scene can read them per-frame without re-renders.
 */
interface TimeAtlasState {
  activeEraId: string;
  selectedPoiId: string | null;
  activeLayers: LayerId[];
  setActiveEra: (eraId: string) => void;
  selectPoi: (poiId: string | null) => void;
  toggleLayer: (layerId: LayerId) => void;
}

export const useTimeAtlas = create<TimeAtlasState>((set) => ({
  activeEraId: ACTIVE_ERA.id,
  selectedPoiId: null,
  activeLayers: [],
  setActiveEra: (eraId) =>
    set((state) =>
      state.activeEraId === eraId ? state : { activeEraId: eraId, selectedPoiId: null },
    ),
  selectPoi: (poiId) => set({ selectedPoiId: poiId }),
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layerId)
        ? state.activeLayers.filter((id) => id !== layerId)
        : [...state.activeLayers, layerId],
    })),
}));
