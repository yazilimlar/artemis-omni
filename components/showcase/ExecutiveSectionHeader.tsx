import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ExecutiveSectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function ExecutiveSectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: ExecutiveSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="display-serif mt-3 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
