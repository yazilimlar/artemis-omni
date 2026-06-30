type StoryScene = {
  label: string;
  title: string;
  body: string;
};

type CinematicStoryPanelProps = {
  eyebrow?: string;
  title: string;
  summary: string;
  scenes: StoryScene[];
};

export function CinematicStoryPanel({
  eyebrow = "Cinematic story",
  title,
  summary,
  scenes,
}: CinematicStoryPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-deep/55 p-6 shadow-panel">
      <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.1]" aria-hidden />
      <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">{eyebrow}</p>
      <h3 className="display-serif mt-3 max-w-2xl text-3xl leading-tight text-parchment">
        {title}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{summary}</p>

      <div className="mt-7 grid gap-4">
        {scenes.map((scene, index) => (
          <article
            key={scene.title}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-background/35 p-4"
          >
            <div
              className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-signal-soft via-gold to-transparent"
              aria-hidden
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-signal-soft/35 bg-signal-soft/10 font-mono text-xs text-signal-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  {scene.label}
                </p>
                <h4 className="mt-1 text-base font-semibold text-parchment">{scene.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{scene.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
