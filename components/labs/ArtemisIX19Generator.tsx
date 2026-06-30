"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CalendarDays,
  Check,
  Clipboard,
  Copy,
  Download,
  FileText,
  Film,
  Image,
  Library as LibraryIcon,
  LineChart,
  MousePointer2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Triangle,
  Trash2,
  Video,
  Volume2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import {
  artemisIX19AssetProfiles,
  artemisIX19SolutionIntents,
  artemisIX19SolutionTerrains,
  artemisIX19Sources,
  buildArtemisIX19DailyStream,
  buildArtemisIX19Package,
  formatArtemisIX19Markdown,
  type ArtemisIX19AssetType,
  type ArtemisIX19Audience,
  type ArtemisIX19DailyStream,
  type ArtemisIX19GeneratedPackage,
  type ArtemisIX19Privacy,
  type ArtemisIX19SolutionIntentId,
  type ArtemisIX19SolutionTerrainId,
} from "@/data/artemisIX19";
import { cn } from "@/lib/utils/cn";

const assetIcons: Record<ArtemisIX19AssetType, LucideIcon> = {
  prompt: Wand2,
  image: Image,
  render: Box,
  video: Video,
  plot: LineChart,
  movie: Film,
  sound: Volume2,
};

const audiences: ArtemisIX19Audience[] = ["Executive", "Fabrication", "Product", "Story"];
const privacyModes: { id: ArtemisIX19Privacy; label: string }[] = [
  { id: "public-safe", label: "Public-safe" },
  { id: "private-pilot", label: "Private pilot" },
];

const savedPackagesStorageKey = "artemisix19.savedPackages.v2";

type SavedArtemisIX19Package = {
  id: string;
  savedAt: string;
  label: string;
  sourceTitle: string;
  assetLabel: string;
  markdown: string;
  generated: ArtemisIX19GeneratedPackage;
  dailyStream: ArtemisIX19DailyStream;
};

export function ArtemisIX19Generator() {
  const [sourceId, setSourceId] = useState(artemisIX19Sources[0].id);
  const [assetType, setAssetType] = useState<ArtemisIX19AssetType>("prompt");
  const [audience, setAudience] = useState<ArtemisIX19Audience>("Executive");
  const [privacy, setPrivacy] = useState<ArtemisIX19Privacy>("public-safe");
  const [intentId, setIntentId] = useState<ArtemisIX19SolutionIntentId>(
    artemisIX19SolutionIntents[0].id,
  );
  const [terrainId, setTerrainId] = useState<ArtemisIX19SolutionTerrainId>(
    artemisIX19SolutionTerrains[0].id,
  );
  const [triangleLocked, setTriangleLocked] = useState(false);
  const [intensity, setIntensity] = useState(3);
  const [copied, setCopied] = useState(false);
  const [markdownCopied, setMarkdownCopied] = useState(false);
  const [savedPackages, setSavedPackages] = useState<SavedArtemisIX19Package[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const dailyKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const generated = useMemo(
    () =>
      buildArtemisIX19Package({
        sourceId,
        assetType,
        audience,
        privacy,
        intensity,
        intentId,
        terrainId,
        triangleLocked,
      }),
    [sourceId, assetType, audience, privacy, intensity, intentId, terrainId, triangleLocked],
  );

  const source = artemisIX19Sources.find((item) => item.id === sourceId) ?? artemisIX19Sources[0];
  const intent =
    artemisIX19SolutionIntents.find((item) => item.id === intentId) ??
    artemisIX19SolutionIntents[0];
  const terrain =
    artemisIX19SolutionTerrains.find((item) => item.id === terrainId) ??
    artemisIX19SolutionTerrains[0];
  const dailyStream = useMemo(
    () => buildArtemisIX19DailyStream({ dateKey: dailyKey, sourceId, intentId, terrainId }),
    [dailyKey, sourceId, intentId, terrainId],
  );
  const markdown = useMemo(
    () => formatArtemisIX19Markdown(generated, dailyStream),
    [generated, dailyStream],
  );
  const maxPlot = Math.max(...generated.plotPoints.map((point) => point.value));

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(savedPackagesStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedArtemisIX19Package[];
        if (Array.isArray(parsed)) {
          setSavedPackages(parsed.slice(0, 8));
        }
      }
    } catch {
      setSavedPackages([]);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(
      savedPackagesStorageKey,
      JSON.stringify(savedPackages.slice(0, 8)),
    );
  }, [savedPackages, storageReady]);

  function reset() {
    setSourceId(artemisIX19Sources[0].id);
    setAssetType("prompt");
    setAudience("Executive");
    setPrivacy("public-safe");
    setIntentId(artemisIX19SolutionIntents[0].id);
    setTerrainId(artemisIX19SolutionTerrains[0].id);
    setTriangleLocked(false);
    setIntensity(3);
    setCopied(false);
    setMarkdownCopied(false);
    setSavedNotice(false);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(generated.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setMarkdownCopied(true);
    window.setTimeout(() => setMarkdownCopied(false), 1800);
  }

  function downloadTextFile({
    content,
    filename,
    type,
  }: {
    content: string;
    filename: string;
    type: string;
  }) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadJson() {
    downloadTextFile({
      content: JSON.stringify(generated, null, 2),
      filename: `artemisix19-${source.id}-${assetType}.json`,
      type: "application/json",
    });
  }

  function downloadMarkdown() {
    downloadTextFile({
      content: markdown,
      filename: `artemisix19-${source.id}-${assetType}.md`,
      type: "text/markdown",
    });
  }

  function savePackage() {
    const savedAt = new Date().toISOString();
    const record: SavedArtemisIX19Package = {
      id: `${savedAt}-${source.id}-${assetType}`,
      savedAt,
      label: `${source.title} · ${generated.assetLabel}`,
      sourceTitle: source.title,
      assetLabel: generated.assetLabel,
      markdown,
      generated,
      dailyStream,
    };

    setSavedPackages((current) => [
      record,
      ...current.filter((item) => item.id !== record.id),
    ].slice(0, 8));
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  }

  function removeSavedPackage(id: string) {
    setSavedPackages((current) => current.filter((item) => item.id !== id));
  }

  function downloadSavedPackage(record: SavedArtemisIX19Package) {
    downloadTextFile({
      content: record.markdown,
      filename: `${record.id}.md`,
      type: "text/markdown",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-wider text-signal-soft">
              Autonomous Console
            </p>
            <h2 className="display-serif mt-2 text-2xl text-parchment">ArtemisIX19 Generator</h2>
          </div>
          <ShieldCheck className="h-6 w-6 text-gold-soft" aria-hidden />
        </div>

        <div className="mt-6 space-y-6">
          <ControlGroup label="2-click solution path">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MousePointer2 className="h-3.5 w-3.5 text-signal-soft" aria-hidden />
                  <span>Click 1: purpose</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {artemisIX19SolutionIntents.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={intentId === item.id}
                      onClick={() => {
                        setIntentId(item.id);
                        setTriangleLocked(false);
                      }}
                      className={cn(
                        "min-h-24 rounded-md border p-3 text-left transition-colors",
                        intentId === item.id
                          ? "border-gold/55 bg-gold/10 text-parchment"
                          : "border-border/70 bg-background/25 text-muted-foreground hover:border-signal-soft/45 hover:text-foreground",
                      )}
                    >
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed">{item.question}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MousePointer2 className="h-3.5 w-3.5 text-signal-soft" aria-hidden />
                  <span>Click 2: operating terrain</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {artemisIX19SolutionTerrains.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={terrainId === item.id}
                      onClick={() => {
                        setTerrainId(item.id);
                        setAudience(item.audience);
                        setTriangleLocked(false);
                      }}
                      className={cn(
                        "min-h-24 rounded-md border p-3 text-left transition-colors",
                        terrainId === item.id
                          ? "border-signal-soft/55 bg-signal-soft/10 text-parchment"
                          : "border-border/70 bg-background/25 text-muted-foreground hover:border-signal-soft/45 hover:text-foreground",
                      )}
                    >
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed">{item.pressure}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                aria-pressed={triangleLocked}
                onClick={() => setTriangleLocked(true)}
                className={cn(
                  "group relative flex w-full items-center gap-4 overflow-hidden rounded-md border p-4 text-left transition-colors",
                  triangleLocked
                    ? "border-gold/60 bg-gold/10 text-parchment shadow-[0_0_36px_rgba(242,208,107,0.14)]"
                    : "border-border/70 bg-background/25 text-muted-foreground hover:border-gold/45 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-16 w-16 shrink-0 place-items-center rounded-md border transition-transform group-hover:scale-105",
                    triangleLocked
                      ? "border-gold/55 bg-gold/15 text-gold-soft"
                      : "border-signal-soft/30 bg-signal-soft/10 text-signal-soft",
                  )}
                >
                  <Triangle className="h-8 w-8" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Click 3: triangle convergence</span>
                  <span className="mt-1 block text-xs leading-relaxed">
                    {triangleLocked
                      ? `${intent.point}. The solution has settled to a point, purpose, and meaning.`
                      : "Lock the triangle after the first two choices to converge the project into a specific solution."}
                  </span>
                </span>
              </button>
            </div>
          </ControlGroup>

          <ControlGroup label="Source family">
            <div className="grid gap-2">
              {artemisIX19Sources.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={sourceId === item.id}
                  onClick={() => {
                    setSourceId(item.id);
                    setTriangleLocked(false);
                  }}
                  className={cn(
                    "rounded-md border p-3 text-left transition-colors",
                    sourceId === item.id
                      ? "border-gold/55 bg-gold/10 text-parchment"
                      : "border-border/70 bg-background/25 text-muted-foreground hover:border-signal-soft/45 hover:text-foreground",
                  )}
                >
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed">{item.family}</span>
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Asset type">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 xl:grid-cols-4">
              {artemisIX19AssetProfiles.map((profile) => {
                const Icon = assetIcons[profile.id];
                return (
                  <button
                    key={profile.id}
                    type="button"
                    title={profile.command}
                    aria-label={profile.label}
                    aria-pressed={assetType === profile.id}
                    onClick={() => setAssetType(profile.id)}
                    className={cn(
                      "grid aspect-square place-items-center rounded-md border transition-colors",
                      assetType === profile.id
                        ? "border-gold/60 bg-gold/10 text-gold-soft"
                        : "border-border/70 bg-background/25 text-muted-foreground hover:border-signal-soft/45 hover:text-signal-soft",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </button>
                );
              })}
            </div>
          </ControlGroup>

          <ControlGroup label="Audience">
            <div className="grid grid-cols-2 gap-2">
              {audiences.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={audience === item}
                  onClick={() => setAudience(item)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors",
                    audience === item
                      ? "border-gold/55 bg-gold/10 text-parchment"
                      : "border-border/70 bg-background/25 text-muted-foreground hover:border-signal-soft/45 hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Visibility">
            <div className="grid grid-cols-2 gap-2">
              {privacyModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={privacy === item.id}
                  onClick={() => setPrivacy(item.id)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors",
                    privacy === item.id
                      ? "border-emerald-300/45 bg-emerald-400/10 text-emerald-100"
                      : "border-border/70 bg-background/25 text-muted-foreground hover:border-emerald-300/35 hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label={`Intensity ${intensity}`}>
            <input
              aria-label="Generation intensity"
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
              className="w-full accent-gold"
            />
            <div className="mt-2 flex justify-between font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
              <span>Restrained</span>
              <span>Launch</span>
            </div>
          </ControlGroup>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex items-center gap-2 rounded-md border border-gold/35 bg-gold/10 px-4 py-2 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              <Clipboard className="h-4 w-4" aria-hidden />
              {copied ? "Copied" : "Copy Prompt"}
            </button>
            <button
              type="button"
              onClick={copyMarkdown}
              className="inline-flex items-center gap-2 rounded-md border border-gold/35 bg-gold/10 px-4 py-2 text-sm text-gold-soft transition-colors hover:bg-gold/15"
            >
              {markdownCopied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {markdownCopied ? "Markdown Copied" : "Copy Markdown"}
            </button>
            <button
              type="button"
              onClick={savePackage}
              className="inline-flex items-center gap-2 rounded-md border border-emerald-300/35 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 transition-colors hover:bg-emerald-400/15"
            >
              {savedNotice ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <LibraryIcon className="h-4 w-4" aria-hidden />
              )}
              {savedNotice ? "Saved" : "Save Package"}
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex items-center gap-2 rounded-md border border-signal-soft/35 bg-signal-soft/10 px-4 py-2 text-sm text-signal-soft transition-colors hover:bg-signal-soft/15"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export JSON
            </button>
            <button
              type="button"
              onClick={downloadMarkdown}
              className="inline-flex items-center gap-2 rounded-md border border-signal-soft/35 bg-signal-soft/10 px-4 py-2 text-sm text-signal-soft transition-colors hover:bg-signal-soft/15"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Export MD
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/25 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-silver/35 hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border/70 bg-background/30 p-5 shadow-panel">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-start">
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-wider text-gold-soft">
              {generated.assetLabel} Package
            </p>
            <h2 className="display-serif mt-2 text-2xl text-parchment">{generated.sourceTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {source.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {generated.convergence.clickPath.map((step) => (
                <span
                  key={step}
                  className="rounded-full border border-border/60 bg-navy-deep/45 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Autonomous
          </span>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.86fr]">
          <div className="space-y-5">
            <ConvergenceCard generated={generated} />
            <ArtifactPreview generated={generated} maxPlot={maxPlot} />

            <OutputBlock title="Master Prompt">
              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/84">
                {generated.prompt}
              </pre>
            </OutputBlock>
            <OutputBlock title="Image Prompt">
              <p className="text-sm leading-relaxed text-foreground/84">{generated.imagePrompt}</p>
            </OutputBlock>
            <OutputBlock title="Video Prompt">
              <p className="text-sm leading-relaxed text-foreground/84">
                {generated.categories.videoPrompt}
              </p>
            </OutputBlock>
          </div>

          <div className="space-y-5">
            <OutputBlock title="Category Stack">
              <dl className="grid gap-3 text-sm">
                {[
                  ["Prompt", generated.categories.promptCategory],
                  ["Movie", generated.categories.movieCategory],
                  ["Time / Era", generated.categories.timeEraCategory],
                  ["Render", generated.categories.renderType],
                  ["Style", generated.categories.styleType],
                  ["Solution", generated.categories.solutionCategory],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-border/50 bg-background/25 p-3"
                  >
                    <dt className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 text-foreground/84">{value}</dd>
                  </div>
                ))}
              </dl>
            </OutputBlock>

            <PackageVault
              savedPackages={savedPackages}
              onDownload={downloadSavedPackage}
              onRemove={removeSavedPackage}
            />

            <OutputBlock title="Signal Plot">
              <div className="space-y-3">
                {generated.plotPoints.map((point) => (
                  <div key={point.label}>
                    <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                      <span>{point.label}</span>
                      <span className="font-mono text-gold-soft">{point.value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-signal-soft"
                        style={{ width: `${(point.value / maxPlot) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </OutputBlock>

            <OutputBlock title="Render Plan">
              <OrderedList items={generated.renderPlan} />
            </OutputBlock>

            <OutputBlock title="Storyboard">
              <OrderedList items={generated.storyboard} />
            </OutputBlock>

            <OutputBlock title="Movie Beats">
              <OrderedList items={generated.movieBeats} />
            </OutputBlock>

            <OutputBlock title="Sound Cue">
              <p className="text-sm leading-relaxed text-foreground/84">{generated.soundCue}</p>
            </OutputBlock>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <OutputBlock title={`Daily Flow ${dailyStream.dateKey}`}>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/84">
              <div className="rounded-md border border-border/50 bg-background/25 p-3">
                <div className="mb-2 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Daily Essay
                </div>
                <h3 className="text-base font-semibold text-parchment">{dailyStream.essayTitle}</h3>
                <p className="mt-2">{dailyStream.essay}</p>
              </div>
              <DailyLine label={dailyStream.updateTitle} value={dailyStream.update} />
              <DailyLine label="Daily Quote" value={dailyStream.quote} />
              <DailyLine label="Daily Stoic Cartoon Prompt" value={dailyStream.stoicCartoon} />
              <DailyLine label="Daily Question" value={dailyStream.question} />
              <DailyLine label="Daily Irony" value={dailyStream.irony} />
              <DailyLine label="Daily Observation" value={dailyStream.observation} />
              <DailyLine
                label="Daily Public Revenue Generator Idea"
                value={dailyStream.publicRevenueIdea}
              />
            </div>
          </OutputBlock>

          <OutputBlock title="Alternative Solutions 4 x 4">
            <div className="grid gap-3 sm:grid-cols-2">
              {dailyStream.alternatives.map((quadrant) => (
                <div
                  key={quadrant.quadrant}
                  className="rounded-md border border-border/50 bg-background/25 p-3"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-signal-soft" aria-hidden />
                    <h3 className="text-sm font-semibold text-parchment">{quadrant.quadrant}</h3>
                  </div>
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {quadrant.examples.map((example) => (
                      <li key={example} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-soft" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </OutputBlock>
        </div>
      </section>
    </div>
  );
}

function ConvergenceCard({ generated }: { generated: ArtemisIX19GeneratedPackage }) {
  return (
    <OutputBlock title="Triangle Convergence">
      <div className="grid items-start gap-4 md:grid-cols-[0.72fr_1fr]">
        <div className="relative min-h-56 overflow-hidden rounded-md border border-signal-soft/25 bg-navy-deep/55 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,207,255,0.16),transparent_38%)]" />
          <svg
            viewBox="0 0 240 220"
            role="img"
            aria-label="Three inputs converging into the Artemis triangle"
            className="relative h-full min-h-48 w-full"
          >
            <defs>
              <linearGradient id="ix19Triangle" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#F2D06B" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <path
              d="M120 28 202 176 38 176Z"
              fill="rgba(0,207,255,0.06)"
              stroke="url(#ix19Triangle)"
              strokeWidth="2"
            />
            <path
              d="M120 61 170 156 70 156Z"
              fill="rgba(242,208,107,0.08)"
              stroke="#D8D8D8"
              strokeWidth="1.5"
            />
            <path d="M60 54 120 103 184 54" stroke="#00CFFF" strokeOpacity="0.55" />
            <path d="M42 178 120 103 204 178" stroke="#F2D06B" strokeOpacity="0.55" />
            {[
              [60, 54],
              [184, 54],
              [42, 178],
              [204, 178],
              [120, 103],
            ].map(([cx, cy], index) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={index === 4 ? 8 : 5}
                fill={index === 4 ? "#F2D06B" : "#00CFFF"}
                opacity={index === 4 ? "0.95" : "0.7"}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-foreground/84">
            {generated.convergence.triangleState}
          </p>
          {[
            ["Project point", generated.convergence.projectPoint],
            ["Purpose", generated.convergence.purpose],
            ["Meaning", generated.convergence.meaning],
            ["Image state", generated.convergence.imageState],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border/50 bg-background/25 p-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/84">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </OutputBlock>
  );
}

function ArtifactPreview({
  generated,
  maxPlot,
}: {
  generated: ArtemisIX19GeneratedPackage;
  maxPlot: number;
}) {
  const waveform = generated.plotPoints.map((point, index) => ({
    x: 18 + index * 34,
    height: 18 + ((point.value + index * 11) % 44),
  }));

  return (
    <OutputBlock title="Generated Artifact Preview">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.82fr]">
        <div className="overflow-hidden rounded-md border border-signal-soft/25 bg-background/25">
          <svg
            viewBox="0 0 420 250"
            role="img"
            aria-label="Deterministic preview for the selected ArtemisIX19 artifact"
            className="aspect-[16/9] w-full"
          >
            <defs>
              <linearGradient id="artifactPreviewGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F2D06B" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <rect width="420" height="250" fill="#07111D" />
            <rect x="18" y="18" width="384" height="214" rx="8" fill="#0B1726" stroke="#25455C" />
            <path
              d="M58 176 210 46 360 176Z"
              fill="rgba(0,207,255,0.06)"
              stroke="url(#artifactPreviewGlow)"
              strokeWidth="2"
            />
            <path
              d="M76 184 C132 108 186 142 226 88 S310 80 356 58"
              fill="none"
              stroke="#00CFFF"
              strokeLinecap="round"
              strokeWidth="3"
            />
            {generated.plotPoints.slice(0, 5).map((point, index) => {
              const height = 82 * (point.value / maxPlot);
              return (
                <rect
                  key={point.label}
                  x={56 + index * 58}
                  y={194 - height}
                  width="22"
                  height={height}
                  rx="4"
                  fill={index % 2 === 0 ? "#F2D06B" : "#00CFFF"}
                  opacity="0.78"
                />
              );
            })}
            {waveform.map((bar, index) => (
              <rect
                key={`${bar.x}-${bar.height}`}
                x={bar.x}
                y={224 - bar.height}
                width="12"
                height={bar.height}
                rx="6"
                fill="#D8D8D8"
                opacity={0.28 + index * 0.08}
              />
            ))}
            <circle cx="210" cy="104" r="9" fill="#F2D06B" />
            <text x="28" y="42" fill="#D8D8D8" fontSize="12" fontFamily="monospace">
              {generated.assetLabel.toUpperCase()} / {generated.categories.renderType.toUpperCase()}
            </text>
            <text x="28" y="216" fill="#8EA4B7" fontSize="10" fontFamily="monospace">
              PREVIEW IS SYNTHETIC · SOURCE-SAFE · EXPORT READY
            </text>
          </svg>
        </div>

        <div className="grid gap-3">
          {generated.storyboard.slice(0, 3).map((frame, index) => (
            <div key={frame} className="rounded-md border border-border/50 bg-background/25 p-3">
              <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                Frame {index + 1}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/84">{frame}</p>
            </div>
          ))}
          <div className="rounded-md border border-border/50 bg-background/25 p-3">
            <p className="font-mono text-[0.58rem] uppercase tracking-wider text-signal-soft">
              Sound Wave
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/84">
              {generated.soundCue}
            </p>
          </div>
        </div>
      </div>
    </OutputBlock>
  );
}

function PackageVault({
  savedPackages,
  onDownload,
  onRemove,
}: {
  savedPackages: SavedArtemisIX19Package[];
  onDownload: (record: SavedArtemisIX19Package) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <OutputBlock title="Local Package Vault">
      {savedPackages.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Save packages here to keep the last eight generated Markdown briefs in this browser.
        </p>
      ) : (
        <div className="space-y-3">
          {savedPackages.map((record) => (
            <div key={record.id} className="rounded-md border border-border/50 bg-background/25 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-parchment">{record.label}</p>
                  <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                    {record.assetLabel} · {formatSavedAt(record.savedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    title="Download saved Markdown"
                    aria-label={`Download ${record.label}`}
                    onClick={() => onDownload(record)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-signal-soft/35 bg-signal-soft/10 text-signal-soft transition-colors hover:bg-signal-soft/15"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    title="Remove saved package"
                    aria-label={`Remove ${record.label}`}
                    onClick={() => onRemove(record.id)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-border/70 bg-background/25 text-muted-foreground transition-colors hover:border-rose-300/45 hover:text-rose-100"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </OutputBlock>
  );
}

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(savedAt));
}

function DailyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/50 bg-background/25 p-3">
      <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function OutputBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border/60 bg-navy-deep/45 p-4">
      <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
        {title}
      </p>
      {children}
    </div>
  );
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 text-sm leading-relaxed text-foreground/84">
      {items.map((item) => (
        <li key={item} className="rounded-md border border-border/50 bg-background/25 p-3">
          {item}
        </li>
      ))}
    </ol>
  );
}
