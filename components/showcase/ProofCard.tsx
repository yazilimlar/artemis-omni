import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import type { ProofModule } from "@/data/proofLibrary";

type ProofCardProps = {
  module: ProofModule;
  compact?: boolean;
};

export function ProofCard({ module, compact = false }: ProofCardProps) {
  const content = (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={module.statusTone}>{module.statusLabel}</StatusBadge>
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
          {module.eyebrow}
        </span>
      </div>
      <CardTitle className="mt-4 text-xl">{module.title}</CardTitle>
      <CardDescription className="flex-1">{module.summary}</CardDescription>
      {!compact ? (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            Decision improved
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/82">{module.decision}</p>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {module.signals.slice(0, compact ? 3 : 5).map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-border/60 bg-background/35 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {signal}
          </span>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{module.boundary}</p>
      {module.href ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
          Open proof page
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      ) : (
        <span className="mt-5 font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
          Page not published yet
        </span>
      )}
    </Card>
  );

  if (module.href) {
    return (
      <Link id={module.slug} href={module.href} className="group block h-full">
        {content}
      </Link>
    );
  }

  return (
    <article id={module.slug} className="h-full">
      {content}
    </article>
  );
}
