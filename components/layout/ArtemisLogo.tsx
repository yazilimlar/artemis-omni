import { ArtemisMark } from "@/components/layout/ArtemisMark";
import { cn } from "@/lib/utils/cn";

type ArtemisLogoProps = {
  className?: string;
  compact?: boolean;
};

export function ArtemisLogo({ className, compact = false }: ArtemisLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center">
        <span
          className="absolute inset-0 rounded-full bg-signal-soft/20 blur-md"
          aria-hidden
        />
        <ArtemisMark className="relative h-9 w-9 drop-shadow-[0_0_14px_rgba(0,207,255,0.18)]" />
      </span>
      {compact ? null : (
        <span className="leading-none">
          <span className="block text-[1.05rem] font-semibold uppercase tracking-[0.18em] text-parchment">
            Artemis
          </span>
          <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.28em] text-signal-soft">
            System Blueprint
          </span>
        </span>
      )}
    </span>
  );
}
