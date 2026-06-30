"use client";

import * as React from "react";
import {
  Wand2,
  Image as ImageIcon,
  Clapperboard,
  AudioLines,
  Box,
  GitBranch,
  Film,
  Languages,
  Boxes,
  Loader2,
  Download,
  Sparkles,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  ixGenerators,
  ixPromptPresets,
  demonstrators,
  getIXGenerator,
} from "@/lib/artemisix/catalog";
import type { IXKind, IXGenerateResponse } from "@/lib/artemisix/types";

const ICONS: Record<string, LucideIcon> = {
  Wand2,
  Image: ImageIcon,
  Clapperboard,
  AudioLines,
  Box,
  GitBranch,
  Film,
  Languages,
  Boxes,
};

const MODEL_VIEWER_SRC =
  "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js";

/** Lazily inject the <model-viewer> web component once, client-side. */
function useModelViewer() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (customElements.get("model-viewer")) {
      setReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[data-model-viewer]`);
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.type = "module";
    s.src = MODEL_VIEWER_SRC;
    s.dataset.modelViewer = "true";
    s.addEventListener("load", () => setReady(true), { once: true });
    document.head.appendChild(s);
  }, []);
  return ready;
}

// Custom element — typed loosely so we can pass web-component attributes.
const ModelViewerEl = "model-viewer" as unknown as React.FC<
  React.HTMLAttributes<HTMLElement> & Record<string, unknown>
>;

export function StudioIX() {
  const [kind, setKind] = React.useState<IXKind>("dialects");
  const [prompt, setPrompt] = React.useState("");
  const [options, setOptions] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<IXGenerateResponse | null>(null);
  const [library, setLibrary] = React.useState<IXGenerateResponse[]>([]);

  const spec = getIXGenerator(kind);

  React.useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const c of spec.controls) defaults[c.key] = c.defaultValue;
    setOptions(defaults);
  }, [spec]);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError("Enter a brief first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artemisix/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, prompt: prompt.trim(), options }),
      });
      const data = (await res.json()) as IXGenerateResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResult(data);
      setLibrary((prev) => [data, ...prev].slice(0, 24));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Generator tabs */}
          <div className="flex flex-wrap gap-2">
            {ixGenerators.map((g) => {
              const Icon = ICONS[g.icon] ?? Sparkles;
              const active = g.kind === kind;
              const isNew = g.kind === "dialects" || g.kind === "model3d";
              return (
                <button
                  key={g.kind}
                  type="button"
                  onClick={() => setKind(g.kind)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    active
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-border/70 text-muted-foreground hover:border-gold/40 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {g.title}
                  {isNew && (
                    <span className="rounded-full bg-gold/20 px-1.5 text-[0.55rem] font-mono uppercase text-gold">
                      IX
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Brief + controls */}
          <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="display-serif text-xl text-parchment">{spec.title}</h3>
              <Badge>simulation</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{spec.tagline}</p>

            <label className="mt-5 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Brief
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={spec.placeholder}
              rows={3}
              className="mt-2 w-full resize-y rounded-lg border border-border/70 bg-lunar/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-gold/50"
            />

            {spec.controls.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {spec.controls.map((c) => (
                  <div key={c.key}>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </label>
                    <select
                      value={options[c.key] ?? c.defaultValue}
                      onChange={(e) => setOptions((o) => ({ ...o, [c.key]: e.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-border/70 bg-lunar/40 px-3 py-2 text-sm text-foreground outline-none focus:border-gold/50"
                    >
                      {(c.options ?? []).map((opt) => (
                        <option key={opt} value={opt} className="bg-navy-deep">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate
                  </>
                )}
              </Button>
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>
          </div>

          {result && <ResultView result={result} />}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Presets</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {ixPromptPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setKind(p.kind);
                    setPrompt(p.prompt);
                  }}
                  className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Session library
            </h4>
            {library.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Generations you create this session collect here.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {library.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setResult(entry)}
                      className="flex w-full items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-gold/40"
                    >
                      <span className="font-mono text-[0.6rem] uppercase text-gold-soft">
                        {entry.kind}
                      </span>
                      <span className="truncate text-muted-foreground">{entry.prompt}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Demonstrator library */}
      <section>
        <h2 className="display-serif text-2xl text-parchment">Demonstrator library</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The source Artemis cockpits ArtemisIX is built from — open them live.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demonstrators.map((d) => (
            <a
              key={d.slug}
              href={d.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border/70 bg-navy-deep/40 p-5 transition-colors hover:border-gold/40"
            >
              <Badge>{d.tag}</Badge>
              <h3 className="display-serif mt-3 text-lg text-parchment">{d.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{d.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-gold">
                Open <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResultView({ result }: { result: IXGenerateResponse }) {
  const modelReady = useModelViewer();

  return (
    <div className="rounded-xl border border-border/70 bg-navy-deep/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="display-serif text-lg text-parchment">Output</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
          {result.provider} · {result.mode}
        </span>
      </div>

      <div className="mt-4 space-y-5">
        {result.artifacts.map((a, i) => {
          const modelUrl = (a.meta as Record<string, unknown> | undefined)?.modelUrl as
            | string
            | undefined;
          return (
            <div key={i}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {a.label}
                </span>
                {a.dataUrl && (
                  <a
                    href={a.dataUrl}
                    download={`artemisix-${result.kind}-${i}`}
                    className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-soft"
                  >
                    <Download className="h-3.5 w-3.5" /> Save
                  </a>
                )}
              </div>

              {/* 3D model */}
              {result.kind === "model3d" && modelUrl && (
                <div className="overflow-hidden rounded-lg border border-border/60 bg-lunar/40">
                  {modelReady ? (
                    <ModelViewerEl
                      src={modelUrl}
                      loading="eager"
                      reveal="auto"
                      camera-controls="true"
                      auto-rotate={
                        (a.meta as Record<string, unknown>)?.turntable === "off" ? undefined : "true"
                      }
                      shadow-intensity="1"
                      exposure="1.1"
                      style={{ width: "100%", height: "420px", display: "block" }}
                    />
                  ) : (
                    <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading 3D viewer…
                    </div>
                  )}
                </div>
              )}

              {a.type === "image" && a.dataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.dataUrl} alt={a.label} className="w-full rounded-lg border border-border/60" />
              )}
              {a.type === "audio" && a.dataUrl && (
                <audio controls src={a.dataUrl} className="w-full">
                  Your browser does not support audio playback.
                </audio>
              )}
              {a.type === "text" && a.content && (
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-lunar/40 p-4 text-sm leading-relaxed text-foreground/90">
                  {a.content}
                </pre>
              )}
            </div>
          );
        })}
      </div>

      {result.notes && result.notes.length > 0 && (
        <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {result.notes.join(" ")}
        </p>
      )}
    </div>
  );
}
