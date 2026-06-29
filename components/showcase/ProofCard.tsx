import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatusBadge, type ShowcaseStatus } from "@/components/showcase/StatusBadge";

export type ProofItem = {
  slug: string;
  title: string;
  status: ShowcaseStatus;
  executiveValue: string;
  technicalProof: string;
  dataConnected: string;
  decisionImproved: string;
  cta: { label: string; href: string | null };
};

/** Executive proof-library card for the Labs page. */
export function ProofCard({ item, className }: { item: ProofItem; className?: string }) {
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="mt-3">
      <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground/85">{value}</p>
    </div>
  );

  const body = (
    <div
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border/70 bg-navy-deep/40 p-6 transition-colors hover:border-gold/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="display-serif text-lg text-parchment">{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.executiveValue}</p>
      <div className="flex-1">
        <Row label="Technical proof" value={item.technicalProof} />
        <Row label="Data connected" value={item.dataConnected} />
        <Row label="Decision improved" value={item.decisionImproved} />
      </div>
      <div className="mt-5">
        {item.cta.href ? (
          <span className="inline-flex items-center gap-2 text-sm text-gold">
            {item.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">{item.cta.label}</span>
        )}
      </div>
    </div>
  );

  return item.cta.href ? (
    <Link href={item.cta.href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}
