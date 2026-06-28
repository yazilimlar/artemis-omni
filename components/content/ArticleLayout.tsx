import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/content/Prose";
import type { ContentMeta } from "@/lib/content/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Shared reading layout for any MDX content item. */
export function ArticleLayout({
  meta,
  backHref,
  backLabel,
  children,
}: {
  meta: ContentMeta;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <header className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-90" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
        <Container className="py-16 lg:py-20">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge>{meta.category}</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(meta.date)}
            </span>
            {meta.readingTime ? (
              <span className="font-mono text-xs text-muted-foreground">
                · {meta.readingTime}
              </span>
            ) : null}
          </div>
          <h1 className="display-serif mt-4 max-w-3xl text-balance text-4xl leading-tight text-parchment sm:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.summary}</p>
        </Container>
      </header>

      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <Prose>{children}</Prose>

          {(meta.relatedTools?.length || meta.tags?.length) ? (
            <footer className="mt-12 border-t border-border/50 pt-6">
              {meta.relatedTools?.length ? (
                <div className="mb-4">
                  <p className="eyebrow mb-2">Related tools</p>
                  <div className="flex flex-wrap gap-2">
                    {meta.relatedTools.map((slug) => (
                      <Link
                        key={slug}
                        href={`/tools/${slug}`}
                        className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold-soft hover:border-gold"
                      >
                        {slug}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              {meta.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </footer>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
