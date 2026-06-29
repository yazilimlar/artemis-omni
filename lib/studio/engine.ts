/**
 * Artemis Studio — generation engine (SERVER ONLY).
 *
 * Produces real, renderable artifacts with zero external dependencies:
 *  - images / renders / posters as procedural SVG data URLs
 *  - sound as a synthesized, playable WAV data URL
 *  - prompts / plots / treatments as structured markdown
 *
 * Default mode is `simulation`: fully deterministic from the prompt, so the
 * studio works on localhost with no API keys. When provider keys are present
 * in the environment, `resolveProvider` flags which generators could run live;
 * wiring a real SDK is then a localized change inside each `*Live` branch.
 *
 * Do NOT import this from a Client Component — it uses Node Buffer and reads
 * process.env.
 */
// NOTE: server-only module. Imported exclusively by app/api/generate/route.ts.
// Uses Node Buffer + process.env; never import from a Client Component.
import { randomUUID } from "node:crypto";
import type {
  GenerateRequest,
  GenerateResponse,
  GeneratedArtifact,
  GeneratorKind,
} from "./types";

/* ----------------------------- deterministic rng ----------------------------- */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------- palettes --------------------------------- */

const palettes: Record<string, string[]> = {
  "navy-gold": ["#0b1020", "#141c33", "#22304f", "#c9a14a", "#f4e6c3", "#e8eef7"],
  monochrome: ["#0a0a0a", "#1c1c1c", "#3a3a3a", "#6b6b6b", "#a9a9a9", "#ededed"],
  blueprint: ["#04121f", "#06243a", "#0a3a5c", "#1f8fd0", "#7cc4ec", "#dff1fb"],
  warm: ["#1a0f08", "#3a200f", "#7a3f1d", "#c97a33", "#e8a55a", "#f7e2c2"],
  neon: ["#0a0014", "#1a0033", "#3a0066", "#b400ff", "#00e5ff", "#f0e6ff"],
};

function paletteFor(name: string | undefined): string[] {
  return palettes[name ?? "navy-gold"] ?? palettes["navy-gold"];
}

function aspectDims(aspect: string | undefined): { w: number; h: number } {
  switch (aspect) {
    case "1:1":
      return { w: 720, h: 720 };
    case "4:5":
      return { w: 640, h: 800 };
    case "3:2":
      return { w: 840, h: 560 };
    case "16:9":
    default:
      return { w: 960, h: 540 };
  }
}

/* ------------------------------- encoders ----------------------------------- */

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Build a minimal 16-bit mono PCM WAV from a sample array in [-1, 1]. */
function pcmToWavDataUrl(samples: Float32Array, sampleRate: number): string {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE((s < 0 ? s * 0x8000 : s * 0x7fff) | 0, 44 + i * 2);
  }
  return `data:audio/wav;base64,${buffer.toString("base64")}`;
}

/* ------------------------------- text helpers ------------------------------- */

const STYLE_BANKS = {
  lighting: ["soft key with gold rim light", "high-contrast chiaroscuro", "overcast diffuse", "neon practicals", "golden-hour backlight"],
  camera: ["85mm portrait, shallow depth of field", "24mm wide establishing", "macro detail, focus stack", "anamorphic 2.39:1", "tilt-shift miniature"],
  texture: ["brushed metal and concrete", "matte composite and rubber", "polished glass and steel", "weathered industrial surfaces"],
  mood: ["precise and trustworthy", "tense and urgent", "calm and editorial", "heroic and aspirational"],
};

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/* ------------------------------- generators --------------------------------- */

function genImageSvg(prompt: string, opts: Record<string, unknown>, kind: GeneratorKind): string {
  const seed = hashString(prompt + JSON.stringify(opts));
  const rng = mulberry32(seed);
  const pal = paletteFor(opts.palette as string);
  const { w, h } = aspectDims(opts.aspect as string);
  const isBlueprint = kind === "render" || opts.palette === "blueprint";

  const shapes: string[] = [];
  const count = 5 + Math.floor(rng() * 7);
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(rng() * w);
    const cy = Math.floor(rng() * h);
    const r = 30 + Math.floor(rng() * (Math.min(w, h) / 3));
    const fill = pal[2 + Math.floor(rng() * (pal.length - 2))];
    const op = (0.18 + rng() * 0.4).toFixed(2);
    if (rng() > 0.5) {
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}" />`);
    } else {
      const rw = r * (0.8 + rng());
      const rot = Math.floor(rng() * 90);
      shapes.push(
        `<rect x="${cx - rw / 2}" y="${cy - r / 2}" width="${rw}" height="${r}" rx="8" fill="${fill}" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})" />`,
      );
    }
  }

  const grid = isBlueprint
    ? `<g stroke="${pal[3]}" stroke-width="0.5" opacity="0.35">${Array.from(
        { length: Math.floor(w / 40) },
        (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${h}" />`,
      ).join("")}${Array.from(
        { length: Math.floor(h / 40) },
        (_, i) => `<line x1="0" y1="${i * 40}" x2="${w}" y2="${i * 40}" />`,
      ).join("")}</g>`
    : "";

  const label = (kind === "render" ? "RENDER" : "STILL").padEnd(8);
  const caption = prompt.length > 64 ? prompt.slice(0, 61) + "…" : prompt;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bg" cx="38%" cy="32%" r="90%">
      <stop offset="0%" stop-color="${pal[1]}" />
      <stop offset="100%" stop-color="${pal[0]}" />
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal[3]}" />
      <stop offset="100%" stop-color="${pal[4]}" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" />
  ${grid}
  ${shapes.join("\n  ")}
  <rect x="0" y="${h - 56}" width="${w}" height="56" fill="${pal[0]}" opacity="0.72" />
  <text x="20" y="${h - 22}" font-family="monospace" font-size="13" fill="${pal[5]}">${label}· ${caption}</text>
  <rect x="${w - 90}" y="20" width="70" height="22" rx="11" fill="url(#accent)" />
  <text x="${w - 55}" y="35" font-family="monospace" font-size="11" fill="${pal[0]}" text-anchor="middle">ARTEMIS</text>
</svg>`;
}

function genAnimatedPoster(prompt: string, opts: Record<string, unknown>, badge: string): string {
  const seed = hashString(prompt + badge);
  const rng = mulberry32(seed);
  const pal = paletteFor((opts.palette as string) ?? "navy-gold");
  const w = 960;
  const h = 540;
  const bars = Array.from({ length: 18 }, (_, i) => {
    const x = 30 + i * 50;
    const dur = (1.6 + rng() * 2.4).toFixed(2);
    const max = 40 + rng() * 240;
    return `<rect x="${x}" y="${h / 2}" width="22" height="${max}" rx="6" fill="${pal[3]}" opacity="0.55">
      <animate attributeName="height" values="20;${max};20" dur="${dur}s" repeatCount="indefinite" />
      <animate attributeName="y" values="${h / 2 - 10};${h / 2 - max / 2};${h / 2 - 10}" dur="${dur}s" repeatCount="indefinite" />
    </rect>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><radialGradient id="pg" cx="50%" cy="40%" r="80%">
    <stop offset="0%" stop-color="${pal[1]}" /><stop offset="100%" stop-color="${pal[0]}" />
  </radialGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#pg)" />
  ${bars}
  <circle cx="${w / 2}" cy="${h / 2}" r="46" fill="none" stroke="${pal[4]}" stroke-width="2" opacity="0.8">
    <animate attributeName="r" values="40;60;40" dur="3s" repeatCount="indefinite" />
  </circle>
  <polygon points="${w / 2 - 12},${h / 2 - 18} ${w / 2 - 12},${h / 2 + 18} ${w / 2 + 22},${h / 2}" fill="${pal[4]}" />
  <text x="30" y="50" font-family="monospace" font-size="14" fill="${pal[5]}">${badge}</text>
</svg>`;
}

function genSound(prompt: string, opts: Record<string, unknown>): string {
  const seed = hashString(prompt + JSON.stringify(opts));
  const rng = mulberry32(seed);
  const sampleRate = 44100;
  const bpm = parseInt((opts.bpm as string) ?? "90", 10);
  const beat = 60 / bpm;
  const seconds = Math.min(6, beat * 8);
  const n = Math.floor(sampleRate * seconds);
  const out = new Float32Array(n);

  const scales: Record<string, number[]> = {
    minor: [0, 2, 3, 5, 7, 8, 10],
    major: [0, 2, 4, 5, 7, 9, 11],
    pentatonic: [0, 3, 5, 7, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
  };
  const scale = scales[(opts.scale as string) ?? "minor"] ?? scales.minor;
  const root = 220; // A3
  const noteLen = Math.floor(sampleRate * beat);
  const numNotes = Math.floor(n / noteLen);

  for (let k = 0; k < numNotes; k++) {
    const degree = scale[Math.floor(rng() * scale.length)];
    const octave = rng() > 0.7 ? 2 : 1;
    const freq = root * octave * Math.pow(2, degree / 12);
    for (let i = 0; i < noteLen; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-3 * (i / noteLen)); // pluck-like decay
      const idx = k * noteLen + i;
      if (idx >= n) break;
      const tone =
        Math.sin(2 * Math.PI * freq * t) * 0.5 +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.2;
      // slow pad underneath
      const pad = Math.sin(2 * Math.PI * (root / 2) * (idx / sampleRate)) * 0.12;
      out[idx] = (tone * env + pad) * 0.6;
    }
  }
  return pcmToWavDataUrl(out, sampleRate);
}

function genPromptText(prompt: string, opts: Record<string, unknown>): string {
  const rng = mulberry32(hashString(prompt));
  const discipline = (opts.discipline as string) ?? "image";
  const tone = (opts.tone as string) ?? "industrial";
  return [
    `## Expanded prompt — ${discipline} · ${tone}`,
    "",
    `**Subject** — ${prompt.trim()}`,
    `**Style** — ${tone}, ${pick(rng, STYLE_BANKS.mood)}`,
    `**Lighting** — ${pick(rng, STYLE_BANKS.lighting)}`,
    `**Camera / framing** — ${pick(rng, STYLE_BANKS.camera)}`,
    `**Surfaces** — ${pick(rng, STYLE_BANKS.texture)}`,
    `**Composition** — rule-of-thirds, clear focal hierarchy, generous negative space`,
    `**Color** — disciplined navy + warm gold accent, controlled contrast`,
    "",
    "**Ready-to-paste prompt**",
    "```",
    `${prompt.trim()}, ${pick(rng, STYLE_BANKS.lighting)}, ${pick(rng, STYLE_BANKS.camera)}, ${pick(rng, STYLE_BANKS.texture)}, ${tone} mood, highly detailed, 8k`,
    "```",
    "",
    "**Negative prompt** — `low-res, watermark, text artifacts, distorted geometry, oversaturated`",
  ].join("\n");
}

function genShotList(prompt: string, opts: Record<string, unknown>): string {
  const rng = mulberry32(hashString(prompt + "shots"));
  const duration = (opts.duration as string) ?? "10s";
  const motion = (opts.motion as string) ?? "dolly";
  const shots = 3 + Math.floor(rng() * 3);
  const lines = Array.from({ length: shots }, (_, i) => {
    return `${i + 1}. **${pick(rng, ["WIDE", "MEDIUM", "CLOSE", "DETAIL", "OTS"])}** — ${pick(rng, STYLE_BANKS.camera)}; ${motion} move; ${pick(rng, STYLE_BANKS.lighting)}.`;
  });
  return [
    `## Shot list — ${duration} · ${motion}`,
    "",
    `_Concept:_ ${prompt.trim()}`,
    "",
    ...lines,
    "",
    `**Transitions** — match-cut on motion; **Grade** — teal/gold, filmic contrast.`,
  ].join("\n");
}

function genPlot(prompt: string, opts: Record<string, unknown>): string {
  const structure = (opts.structure as string) ?? "three-act";
  const genre = (opts.genre as string) ?? "industrial";
  const beats: Record<string, string[]> = {
    "three-act": ["Act I — Setup & inciting incident", "Act II — Rising complications & midpoint reversal", "Act III — Crisis, climax & resolution"],
    "save-the-cat": ["Opening image & theme stated", "Catalyst & debate", "Break into two & fun and games", "Midpoint", "Bad guys close in & dark night of the soul", "Finale & final image"],
    "hero-journey": ["Ordinary world & call", "Crossing the threshold", "Trials & allies", "Ordeal & reward", "The road back & return"],
    "kishōtenketsu": ["Ki — introduction", "Shō — development", "Ten — twist", "Ketsu — reconciliation"],
  };
  const list = beats[structure] ?? beats["three-act"];
  return [
    `## Beat sheet — ${structure} · ${genre}`,
    "",
    `**Controlling idea:** ${prompt.trim()}`,
    "",
    ...list.map((b, i) => `${i + 1}. ${b}`),
    "",
    `**Stakes** — credibility, safety, and a deadline. **Tone** — ${genre}.`,
  ].join("\n");
}

function genMovieTreatment(prompt: string, opts: Record<string, unknown>): string {
  const runtime = (opts.runtime as string) ?? "60s";
  const mood = (opts.mood as string) ?? "heroic";
  const rng = mulberry32(hashString(prompt + "movie"));
  const scenes = Array.from({ length: 3 }, (_, i) =>
    `**Scene ${i + 1}** — ${pick(rng, ["Cold open", "Build", "Reveal", "Payoff"])}: ${pick(rng, STYLE_BANKS.camera)}, ${pick(rng, STYLE_BANKS.lighting)}.`,
  );
  return [
    `## Treatment — ${runtime} · ${mood}`,
    "",
    `**Logline** — ${prompt.trim()}.`,
    `**Theme** — precision earns trust.`,
    "",
    ...scenes,
    "",
    `**End card** — Artemis wordmark on lunar black, gold underline draws in.`,
    `**Music** — ${mood} score, rising to a single resolved chord.`,
  ].join("\n");
}

/* --------------------------------- providers -------------------------------- */

/** Reports whether a live provider key exists for a generator kind. */
function liveCapability(kind: GeneratorKind): { available: boolean; key: string } {
  const text = !!process.env.ANTHROPIC_API_KEY || !!process.env.OPENAI_API_KEY;
  const media = !!process.env.HIGGSFIELD_API_KEY || !!process.env.REPLICATE_API_TOKEN;
  switch (kind) {
    case "prompt":
    case "plot":
    case "movie":
      return { available: text, key: "ANTHROPIC_API_KEY / OPENAI_API_KEY" };
    case "image":
    case "video":
    case "render":
    case "sound":
      return { available: media, key: "HIGGSFIELD_API_KEY / REPLICATE_API_TOKEN" };
  }
}

/* ----------------------------------- main ----------------------------------- */

export async function generate(req: GenerateRequest): Promise<GenerateResponse> {
  const { kind, prompt } = req;
  const opts = req.options ?? {};
  const artifacts: GeneratedArtifact[] = [];
  const notes: string[] = [];
  const cap = liveCapability(kind);

  // Simulation mode (default). Live wiring would branch here when cap.available.
  switch (kind) {
    case "prompt":
      artifacts.push({ type: "text", label: "Expanded prompt", content: genPromptText(prompt, opts) });
      break;
    case "image":
      artifacts.push({
        type: "image",
        label: "Still",
        dataUrl: svgToDataUrl(genImageSvg(prompt, opts, "image")),
        mimeType: "image/svg+xml",
      });
      break;
    case "render":
      artifacts.push({
        type: "image",
        label: `Render · ${(opts.view as string) ?? "isometric"}`,
        dataUrl: svgToDataUrl(genImageSvg(prompt, opts, "render")),
        mimeType: "image/svg+xml",
      });
      artifacts.push({
        type: "text",
        label: "Materials spec",
        content: `## Materials\n- Body: ABS / glass-filled nylon\n- Seal: medical-grade silicone\n- Finish: bead-blast, matte\n- Tolerance: ±0.1mm\n\n_View:_ ${(opts.view as string) ?? "isometric"} · _Fidelity:_ ${(opts.fidelity as string) ?? "standard"}`,
      });
      break;
    case "video":
      artifacts.push({
        type: "image",
        label: "Animated preview",
        dataUrl: svgToDataUrl(genAnimatedPoster(prompt, opts, "VIDEO PREVIEW")),
        mimeType: "image/svg+xml",
      });
      artifacts.push({ type: "text", label: "Shot list", content: genShotList(prompt, opts) });
      break;
    case "sound":
      artifacts.push({
        type: "audio",
        label: "Audio sketch (WAV)",
        dataUrl: genSound(prompt, opts),
        mimeType: "audio/wav",
      });
      break;
    case "plot":
      artifacts.push({ type: "text", label: "Beat sheet", content: genPlot(prompt, opts) });
      break;
    case "movie":
      artifacts.push({
        type: "image",
        label: "Poster",
        dataUrl: svgToDataUrl(genAnimatedPoster(prompt, opts, "BRAND FILM")),
        mimeType: "image/svg+xml",
      });
      artifacts.push({ type: "text", label: "Treatment", content: genMovieTreatment(prompt, opts) });
      break;
  }

  notes.push(
    cap.available
      ? `Live provider key detected (${cap.key}); add the SDK call in engine.ts to switch this generator to live output.`
      : `Running in simulation mode. Set ${cap.key} in .env.local to enable live generation.`,
  );

  return {
    id: randomUUID(),
    kind,
    prompt,
    mode: "simulation",
    provider: "artemis-sim",
    createdAt: new Date().toISOString(),
    artifacts,
    notes,
  };
}
