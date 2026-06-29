import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A framed card for a system/architecture graphic. Every Artemis system graphic
 * should answer: what decision is improved, what data is connected, what logic is
 * applied, what human review exists, what output is trusted, what limitation remains.
 */
export function SystemDiagramCard({
  title,
  caption,
  children,
  footnote,
  className,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
  footnote?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-navy-deep/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-5 py-3">
        <figcaption className="display-serif text-base text-parchment">{title}</figcaption>
        {caption ? (
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </div>
      <div className="bg-blueprint-grid bg-grid p-5">{children}</div>
      {footnote ? (
        <p className="border-t border-border/50 px-5 py-3 text-xs text-muted-foreground">{footnote}</p>
      ) : null}
    </figure>
  );
}
