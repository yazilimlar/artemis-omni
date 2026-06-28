import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentMeta } from "@/lib/content/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Listing card for any content collection (academy, labs, case studies). */
export function ContentCard({ item, basePath }: { item: ContentMeta; basePath: string }) {
  return (
    <Link href={`${basePath}/${item.slug}`} className="group">
      <Card className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2">
          <Badge>{item.category}</Badge>
          <span className="font-mono text-[0.65rem] text-muted-foreground">
            {formatDate(item.date)}
          </span>
        </div>
        <CardTitle className="mt-4">{item.title}</CardTitle>
        <CardDescription className="flex-1">{item.summary}</CardDescription>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
          Read
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Card>
    </Link>
  );
}
