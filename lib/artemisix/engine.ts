// SERVER ONLY. Imported exclusively by app/api/artemisix/generate/route.ts.
import { generate as baseGenerate } from "@/lib/studio/engine";
import { MODEL_GLB_URL } from "./catalog";
import type { GeneratorKind } from "@/lib/studio/types";
import type { IXGenerateRequest, IXGenerateResponse, GeneratedArtifact } from "./types";

const BASE_KINDS: GeneratorKind[] = [
  "prompt",
  "image",
  "video",
  "sound",
  "render",
  "plot",
  "movie",
];

/* ------------------------------- dialects ------------------------------- */

const DIALECTS: { voice: string; lens: (s: string) => string }[] = [
  {
    voice: "Executive",
    lens: (s) => `Bottom line: ${s} We hold the line on margin and surface the decision early.`,
  },
  {
    voice: "Estimator",
    lens: (s) => `Quantities and unit rates re-priced. ${s} Basis-of-estimate notes updated; contingency re-allocated.`,
  },
  {
    voice: "Field Superintendent",
    lens: (s) => `On the ground: ${s} Sequence and crew loading adjusted; safety controls verified before re-entry.`,
  },
  {
    voice: "Project Controls",
    lens: (s) => `Schedule + cost integration: ${s} Forecast re-baselined; variance flagged with source labels for audit.`,
  },
  {
    voice: "Claims / Legal",
    lens: (s) => `Entitlement posture: ${s} Causation and notice timeline documented; records preserved for the file.`,
  },
  {
    voice: "Owner / Client",
    lens: (s) => `What it means for you: ${s} Transparent impact, mitigation in motion, no surprises at the next gate.`,
  },
];

function genDialects(prompt: string, opts: Record<string, unknown>): GeneratedArtifact {
  const emphasis = (opts.register as string) ?? "balanced";
  const core = prompt.trim().replace(/\s+/g, " ");
  const lines = DIALECTS.map(
    (d) => `### ${d.voice}\n${d.lens(core.endsWith(".") ? core : core + ".")}`,
  );
  return {
    type: "text",
    label: `Six dialects · ${emphasis}`,
    content: [
      `## One truth, six professional dialects`,
      "",
      `_Source statement:_ ${core}`,
      "",
      ...lines,
    ].join("\n"),
  };
}

/* -------------------------------- model3d ------------------------------- */

function genModel3d(prompt: string, opts: Record<string, unknown>): GeneratedArtifact[] {
  const turntable = (opts.turntable as string) ?? "on";
  const environment = (opts.environment as string) ?? "studio";
  return [
    {
      type: "json",
      label: "Live 3D model",
      content: prompt.trim(),
      meta: { modelUrl: MODEL_GLB_URL, turntable, environment },
    },
    {
      type: "text",
      label: "Model notes",
      content: [
        `## Artemis conceptual architecture`,
        "",
        `Source: \`ARTEMIS_conceptual_architecture.glb\` (bundled conceptual export).`,
        `Orbit, pan, and zoom with the controls. Auto-rotate: **${turntable}** · Lighting: **${environment}**.`,
        "",
        `_Concept:_ ${prompt.trim()}`,
      ].join("\n"),
    },
  ];
}

/* ---------------------------------- main -------------------------------- */

export async function generateIX(req: IXGenerateRequest): Promise<IXGenerateResponse> {
  const { kind, prompt } = req;
  const opts = req.options ?? {};

  if (BASE_KINDS.includes(kind as GeneratorKind)) {
    const base = await baseGenerate({ kind: kind as GeneratorKind, prompt, options: opts });
    return { ...base, kind, provider: "artemisix" };
  }

  const artifacts: GeneratedArtifact[] = [];
  if (kind === "dialects") artifacts.push(genDialects(prompt, opts));
  else if (kind === "model3d") artifacts.push(...genModel3d(prompt, opts));

  return {
    id: crypto.randomUUID(),
    kind,
    prompt,
    mode: "simulation",
    provider: "artemisix",
    createdAt: new Date().toISOString(),
    artifacts,
    notes: [
      "ArtemisIX simulation mode — deterministic, key-free. Add provider keys in .env.local to enable live media/text generation.",
    ],
  };
}
