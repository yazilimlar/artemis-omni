import * as React from "react";
import { Container } from "@/components/ui/container";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
};

/** Lightweight inner-page hero with the lunar/blueprint atmosphere. */
export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-90" aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.14]"
        aria-hidden
      />
      <Container className="py-20 lg:py-28">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-serif mt-4 max-w-3xl text-balance text-4xl leading-tight text-parchment sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}
