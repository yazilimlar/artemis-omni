import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ConfidenceNoteProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function ConfidenceNote({
  title = "Confidence note",
  children,
  className,
}: ConfidenceNoteProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-sky-300/25 bg-sky-400/10 p-5 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <p className="font-mono text-[0.66rem] uppercase tracking-wider text-sky-200">{title}</p>
      <div className="mt-2">{children}</div>
    </aside>
  );
}
