import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type SystemDiagramNode = {
  label: string;
  detail?: string;
  tone?: "source" | "logic" | "review" | "output";
};

const nodeStyles: Record<NonNullable<SystemDiagramNode["tone"]>, string> = {
  source: "border-sky-300/35 bg-sky-400/10",
  logic: "border-gold/35 bg-gold/10",
  review: "border-violet-300/35 bg-violet-400/10",
  output: "border-emerald-300/35 bg-emerald-400/10",
};

type SystemDiagramCardProps = {
  title: string;
  description: string;
  decision: string;
  nodes: SystemDiagramNode[];
  outcome: string;
};

export function SystemDiagramCard({
  title,
  description,
  decision,
  nodes,
  outcome,
}: SystemDiagramCardProps) {
  return (
    <Card className="h-full">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="mt-5 rounded-xl border border-border/60 bg-background/35 p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
          Decision
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/84">{decision}</p>
      </div>
      <ol className="mt-5 grid gap-3 lg:grid-cols-4">
        {nodes.map((node, index) => (
          <li key={`${node.label}-${index}`}>
            <div
              className={cn(
                "h-full rounded-xl border p-4",
                nodeStyles[node.tone ?? "source"],
              )}
            >
              <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm font-medium text-parchment">{node.label}</p>
              {node.detail ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {node.detail}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-emerald-200">
          Trusted output
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/84">{outcome}</p>
      </div>
    </Card>
  );
}
