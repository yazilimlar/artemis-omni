import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type ImplementationPhaseCardProps = {
  phase: string;
  title: string;
  description: string;
  bullets?: string[];
};

export function ImplementationPhaseCard({
  phase,
  title,
  description,
  bullets = [],
}: ImplementationPhaseCardProps) {
  return (
    <Card className="h-full">
      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
        {phase}
      </span>
      <CardTitle className="mt-3 text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {bullets.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
