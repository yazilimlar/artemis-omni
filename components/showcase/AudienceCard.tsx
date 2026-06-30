import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { AudiencePage } from "@/data/audiences";

type AudienceCardProps = {
  audience: AudiencePage;
};

export function AudienceCard({ audience }: AudienceCardProps) {
  return (
    <Link href={`/for/${audience.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col">
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
          For {audience.label}
        </p>
        <CardTitle className="mt-4 text-xl">{audience.headline}</CardTitle>
        <CardDescription className="flex-1">{audience.summary}</CardDescription>
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
            First pressure point
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/82">
            {audience.painPoints[0]}
          </p>
        </div>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
          View pathway
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Card>
    </Link>
  );
}
