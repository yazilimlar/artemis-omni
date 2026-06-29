/**
 * Artemis Studio — generator catalog and prompt presets.
 *
 * Client-safe metadata describing each generator panel and the curated
 * auto-prompt presets that seed the workbench. No secrets, no server imports.
 */
import type { GeneratorKind } from "./types";

export interface GeneratorControl {
  /** Option key sent in `GenerateRequest.options`. */
  key: string;
  label: string;
  type: "select" | "text";
  options?: string[];
  defaultValue: string;
}

export interface GeneratorSpec {
  kind: GeneratorKind;
  title: string;
  tagline: string;
  /** Lucide icon name (resolved in the client component). */
  icon: string;
  /** Placeholder shown in the brief field. */
  placeholder: string;
  controls: GeneratorControl[];
}

export const generators: GeneratorSpec[] = [
  {
    kind: "prompt",
    title: "Auto-Prompt",
    tagline: "Expand a one-line brief into a structured, production-grade prompt.",
    icon: "Wand2",
    placeholder: "A respirator product hero on a concrete bench, industrial mood",
    controls: [
      {
        key: "discipline",
        label: "Discipline",
        type: "select",
        options: ["image", "video", "render", "sound", "cinematic"],
        defaultValue: "image",
      },
      {
        key: "tone",
        label: "Tone",
        type: "select",
        options: ["industrial", "editorial", "cinematic", "minimal", "heroic"],
        defaultValue: "industrial",
      },
    ],
  },
  {
    kind: "image",
    title: "Image",
    tagline: "Generate a still from a prompt — procedural art in simulation mode.",
    icon: "Image",
    placeholder: "Wide hero shot of an N95 respirator, soft gold rim light",
    controls: [
      {
        key: "aspect",
        label: "Aspect",
        type: "select",
        options: ["1:1", "16:9", "4:5", "3:2"],
        defaultValue: "16:9",
      },
      {
        key: "palette",
        label: "Palette",
        type: "select",
        options: ["navy-gold", "monochrome", "blueprint", "warm", "neon"],
        defaultValue: "navy-gold",
      },
    ],
  },
  {
    kind: "video",
    title: "Video",
    tagline: "Build a shot list plus an animated preview frame.",
    icon: "Clapperboard",
    placeholder: "Slow dolly across a factory floor at golden hour",
    controls: [
      {
        key: "duration",
        label: "Duration",
        type: "select",
        options: ["6s", "10s", "15s", "30s"],
        defaultValue: "10s",
      },
      {
        key: "motion",
        label: "Camera",
        type: "select",
        options: ["dolly", "orbit", "static", "handheld", "crane"],
        defaultValue: "dolly",
      },
    ],
  },
  {
    kind: "sound",
    title: "Sound",
    tagline: "Synthesize a short, playable audio sketch from a mood.",
    icon: "AudioLines",
    placeholder: "Warm ambient pad with a slow rising arpeggio",
    controls: [
      {
        key: "scale",
        label: "Scale",
        type: "select",
        options: ["minor", "major", "pentatonic", "lydian", "phrygian"],
        defaultValue: "minor",
      },
      {
        key: "bpm",
        label: "Tempo",
        type: "select",
        options: ["72", "90", "110", "128"],
        defaultValue: "90",
      },
    ],
  },
  {
    kind: "render",
    title: "Render",
    tagline: "Produce a technical blueprint render and a materials spec.",
    icon: "Box",
    placeholder: "Exploded view of a respirator cartridge assembly",
    controls: [
      {
        key: "view",
        label: "View",
        type: "select",
        options: ["isometric", "front", "exploded", "section"],
        defaultValue: "isometric",
      },
      {
        key: "fidelity",
        label: "Fidelity",
        type: "select",
        options: ["draft", "standard", "high"],
        defaultValue: "standard",
      },
    ],
  },
  {
    kind: "plot",
    title: "Plot",
    tagline: "Draft a beat-sheet — acts, turns, and a controlling idea.",
    icon: "GitBranch",
    placeholder: "An engineer races to certify a respirator before a recall deadline",
    controls: [
      {
        key: "structure",
        label: "Structure",
        type: "select",
        options: ["three-act", "save-the-cat", "hero-journey", "kishōtenketsu"],
        defaultValue: "three-act",
      },
      {
        key: "genre",
        label: "Genre",
        type: "select",
        options: ["thriller", "drama", "documentary", "industrial", "promo"],
        defaultValue: "industrial",
      },
    ],
  },
  {
    kind: "movie",
    title: "Movie",
    tagline: "Assemble a full treatment: logline, scenes, and a poster.",
    icon: "Film",
    placeholder: "A short brand film about precision manufacturing",
    controls: [
      {
        key: "runtime",
        label: "Runtime",
        type: "select",
        options: ["30s", "60s", "90s", "3min"],
        defaultValue: "60s",
      },
      {
        key: "mood",
        label: "Mood",
        type: "select",
        options: ["heroic", "intimate", "tense", "wondrous", "corporate"],
        defaultValue: "heroic",
      },
    ],
  },
];

export interface PromptPreset {
  label: string;
  kind: GeneratorKind;
  prompt: string;
}

/** Curated starting points so the studio is never a blank page. */
export const promptPresets: PromptPreset[] = [
  {
    label: "Respirator hero",
    kind: "image",
    prompt: "Hero product shot of an industrial respirator on brushed concrete, gold rim light, shallow depth of field",
  },
  {
    label: "Factory flythrough",
    kind: "video",
    prompt: "Cinematic dolly through a clean manufacturing line, sparks and steam, golden hour",
  },
  {
    label: "Assembly render",
    kind: "render",
    prompt: "Exploded isometric render of a respirator cartridge, labelled components, blueprint grid",
  },
  {
    label: "Brand-film beats",
    kind: "plot",
    prompt: "A team certifies a life-saving respirator against an impossible deadline",
  },
  {
    label: "Ambient signature",
    kind: "sound",
    prompt: "Warm cinematic pad with a slow rising arpeggio, hopeful and precise",
  },
  {
    label: "Launch treatment",
    kind: "movie",
    prompt: "A 60-second brand film about precision and trust in industrial manufacturing",
  },
];

export function getGenerator(kind: GeneratorKind): GeneratorSpec {
  const spec = generators.find((g) => g.kind === kind);
  if (!spec) throw new Error(`Unknown generator: ${kind}`);
  return spec;
}
