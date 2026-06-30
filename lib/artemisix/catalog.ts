/**
 * ArtemisIX — generator catalog, presets, and the source demonstrator library.
 * Client-safe metadata. No secrets, no server imports.
 */
import { generators as baseGenerators, type GeneratorSpec } from "@/lib/studio/catalog";
import type { IXKind } from "./types";

export type { GeneratorControl } from "@/lib/studio/catalog";

export interface IXGeneratorSpec extends Omit<GeneratorSpec, "kind"> {
  kind: IXKind;
}

/** The two new ArtemisIX generators, layered on top of the Studio seven. */
const ixOnly: IXGeneratorSpec[] = [
  {
    kind: "dialects",
    title: "Dialects",
    tagline: "One truth, six professional voices — exec, estimator, field, controls, claims, owner.",
    icon: "Languages",
    placeholder: "Trench collapse risk on the Astoria sewer reach pushed the forecast +8%",
    controls: [
      {
        key: "register",
        label: "Emphasis",
        type: "select",
        options: ["balanced", "commercial", "technical", "risk"],
        defaultValue: "balanced",
      },
    ],
  },
  {
    kind: "model3d",
    title: "3D",
    tagline: "Load the Artemis conceptual architecture as a live, orbitable GLB model.",
    icon: "Boxes",
    placeholder: "Conceptual architecture of the Artemis intelligence bridge",
    controls: [
      {
        key: "turntable",
        label: "Auto-rotate",
        type: "select",
        options: ["on", "off"],
        defaultValue: "on",
      },
      {
        key: "environment",
        label: "Lighting",
        type: "select",
        options: ["studio", "neutral", "dramatic"],
        defaultValue: "studio",
      },
    ],
  },
];

export const ixGenerators: IXGeneratorSpec[] = [...baseGenerators, ...ixOnly];

/** Path to the bundled GLB used by the 3D generator. */
export const MODEL_GLB_URL = "/artemisix/models/ARTEMIS_conceptual_architecture.glb";

export interface DemonstratorEntry {
  slug: string;
  title: string;
  summary: string;
  tag: string;
  href: string;
}

/** The real Artemis demonstrators, bundled into /public and opened in a new tab. */
export const demonstrators: DemonstratorEntry[] = [
  {
    slug: "sewer-bridge-rc8-4",
    title: "DEP Sewer Utility Intelligence Bridge — RC8.4",
    summary:
      "Dual-story cockpit: estimate engine, Monte-Carlo risk register, CMiC bridge, GIS, and field-claims hardening across six professional dialects.",
    tag: "Cockpit",
    href: "/artemisix/library/sewer-bridge-rc8-4.html",
  },
  {
    slug: "cockpit-v1",
    title: "Utility Intelligence Bridge — Cockpit v1.0",
    summary:
      "The original polished cockpit narrative: the estimate engine computing in front of you, every capability mapped to its discipline.",
    tag: "Cockpit",
    href: "/artemisix/library/cockpit-v1.html",
  },
  {
    slug: "diana-moonshot-v3",
    title: "A.R.T.E.M.I.S. Diana — Moonshot Demonstrator v3",
    summary:
      "Animated intelligence demonstrator — the cinematic moonshot expression of the Artemis/Diana system.",
    tag: "Cinematic",
    href: "/artemisix/library/diana-moonshot-v3.html",
  },
];

export const ixPromptPresets: { label: string; kind: IXKind; prompt: string }[] = [
  {
    label: "Sewer reach risk",
    kind: "dialects",
    prompt: "Trench collapse risk on the Astoria sewer reach pushed the P50 forecast +8% this period",
  },
  {
    label: "Architecture model",
    kind: "model3d",
    prompt: "Conceptual architecture of the Artemis intelligence bridge",
  },
  {
    label: "Bid-day hero",
    kind: "image",
    prompt: "Cinematic hero of a DEP sewer cockpit dashboard at night, gold data accents",
  },
  {
    label: "Cost-curve film",
    kind: "movie",
    prompt: "A 60-second film: from sub-grade geometry to executive action on a utility program",
  },
  {
    label: "Risk arpeggio",
    kind: "sound",
    prompt: "Tense ambient bed that resolves as the Monte-Carlo forecast converges",
  },
];

export function getIXGenerator(kind: IXKind): IXGeneratorSpec {
  const spec = ixGenerators.find((g) => g.kind === kind);
  if (!spec) throw new Error(`Unknown ArtemisIX generator: ${kind}`);
  return spec;
}
