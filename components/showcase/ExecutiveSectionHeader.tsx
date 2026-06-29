import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Optional thin meander accent above the eyebrow. */
  meander?: boolean;
};

/**
 * Executive-grade section header: optional meander accent, mono eyebrow, serif
 * display title, and a measured lede. Tighter and more authoritative than the
 * generic SectionHeading.
 */
export function ExecutiveSectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  meander = false,
}: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {meander ? (
        <div
          className={cn("meander-divider mb-5 max-w-[140px]", align === "center" && "mx-auto")}
          aria-hidden
        />
      ) : null}
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="display-serif mt-3 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{lede}</p>
      ) : null}
    </div>
  );
}
