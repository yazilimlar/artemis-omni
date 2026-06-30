import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { brandVisualAssets, featuredBrandVisualAsset } from "@/data/brandVisualAssets";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/showcase/StatusBadge";

type BrandVisualLibraryProps = {
  variant?: "full" | "preview";
};

export function BrandVisualLibrary({ variant = "full" }: BrandVisualLibraryProps) {
  const isPreview = variant === "preview";
  const assets = isPreview ? brandVisualAssets.slice(1, 4) : brandVisualAssets;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative overflow-hidden rounded-2xl border border-signal-soft/20 bg-navy-deep/55 p-4 shadow-panel">
          <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.12]" aria-hidden />
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-silver/15 bg-background/40">
            <Image
              src={featuredBrandVisualAsset.src}
              alt={featuredBrandVisualAsset.alt}
              width={featuredBrandVisualAsset.width}
              height={featuredBrandVisualAsset.height}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border/70 bg-background/35 p-6">
          <div className="flex flex-wrap gap-3">
            <StatusBadge tone="reference">Optimized public asset</StatusBadge>
            <StatusBadge tone="test">Brand library</StatusBadge>
          </div>
          <p className="eyebrow mt-6">Logo Library & Visual Assets</p>
          <h3 className="display-serif mt-3 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
            Curated Artemis visuals for the story layer
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            These assets translate the attached logo and Diana references into a public
            Labs library. They support the brand experience, material palette, and
            cinematic narrative while the product story remains implementation,
            governance, project controls, and reviewed executive action.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Blue / white", "Signal, wireframe, constellation"],
              ["Gold / platinum", "Premium materials and executive finish"],
              ["Graphite relief", "Industrial restraint and dimensional depth"],
            ].map(([label, detail]) => (
              <div key={label} className="rounded-xl border border-border/60 bg-navy-deep/40 p-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-wider text-signal-soft">
                  {label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Public boundary: these are optimized concept assets, not final product claims,
            not raw source files, and not current product-capability evidence.
          </p>
          {isPreview ? (
            <div className="mt-6">
              <Button href="/labs/diana-moonshot" variant="outline">
                Open Full Brand Library
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <article
            key={asset.slug}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-navy-deep/45 shadow-panel"
          >
            <div
              className={
                asset.orientation === "landscape"
                  ? "relative aspect-[4/3] overflow-hidden border-b border-border/60 bg-background/40"
                  : "relative aspect-[3/4] overflow-hidden border-b border-border/60 bg-background/40"
              }
            >
              <Image
                src={asset.src}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.025]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                {asset.assetType}
              </p>
              <h4 className="display-serif mt-2 text-xl leading-tight text-parchment">
                {asset.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{asset.role}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{asset.boundary}</p>
              <a
                href={asset.src}
                className="mt-5 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-soft"
              >
                Open asset
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
