import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Typographic wrapper for rendered MDX bodies. Tuned to the Artemis palette:
 * parchment text, gold links/headers accents, silver rules.
 */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:font-serif prose-headings:font-medium prose-headings:text-parchment",
        "prose-p:text-foreground/85 prose-li:text-foreground/85",
        "prose-strong:text-parchment",
        "prose-a:text-gold prose-a:no-underline hover:prose-a:underline",
        "prose-code:text-gold-soft prose-code:before:content-none prose-code:after:content-none",
        "prose-hr:border-border prose-blockquote:border-l-gold prose-blockquote:text-muted-foreground",
        "prose-table:text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
