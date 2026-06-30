/**
 * ArtemisIX — agents & connections manifest.
 *
 * Declares the multiple AI providers and data connections the autonomous
 * studio orchestrates, and the self-maintenance loop. Client-safe metadata;
 * no keys here (keys live in .env.local and are read server-side only).
 */

export interface AgentConnection {
  id: string;
  name: string;
  role: string;
  /** Which generators/modules it powers. */
  powers: string;
  /** Env key that activates it, or "built-in" for key-free. */
  activatedBy: string;
  status: "live" | "simulation" | "key-required";
}

export const connections: AgentConnection[] = [
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    role: "Reasoning & language",
    powers: "Auto-prompt, plot, movie treatments, six-dialect translation",
    activatedBy: "ANTHROPIC_API_KEY",
    status: "key-required",
  },
  {
    id: "media",
    name: "Higgsfield / Replicate",
    role: "Media synthesis",
    powers: "Image, video, render, sound generators",
    activatedBy: "HIGGSFIELD_API_KEY / REPLICATE_API_TOKEN",
    status: "key-required",
  },
  {
    id: "model-viewer",
    name: "model-viewer (WebGL)",
    role: "3D presentation",
    powers: "Live GLB conceptual model + bundled three.js workbenches",
    activatedBy: "built-in",
    status: "live",
  },
  {
    id: "mapbox",
    name: "Mapbox GL",
    role: "Geospatial",
    powers: "Atlas department — 3D satellite command atlases",
    activatedBy: "NEXT_PUBLIC_MAPBOX_TOKEN",
    status: "key-required",
  },
  {
    id: "registry",
    name: "Self-discovering registry",
    role: "Autonomous maintenance",
    powers: "Scans public/artemisix/apps and auto-classifies new modules",
    activatedBy: "built-in",
    status: "live",
  },
  {
    id: "sim-engine",
    name: "Artemis simulation engine",
    role: "Key-free fallback",
    powers: "Deterministic SVG/WAV/text when no provider key is present",
    activatedBy: "built-in",
    status: "live",
  },
];

export interface MaintenanceStep {
  title: string;
  detail: string;
}

/** The autonomous update/maintain loop, surfaced on the modules page. */
export const maintenanceLoop: MaintenanceStep[] = [
  {
    title: "Discover",
    detail: "On each request the registry scans the apps folder — new HTML demonstrators appear automatically.",
  },
  {
    title: "Classify",
    detail: "Each app is assigned a dimension, department, and module code — known apps via overrides, unknown via keyword inference.",
  },
  {
    title: "Generate",
    detail: "The studio engine produces prompts/media/3D/dialects; provider keys upgrade simulation output to live.",
  },
  {
    title: "Expose",
    detail: "The registry is published at /api/artemisix/registry so other agents and connections can read live state.",
  },
];
