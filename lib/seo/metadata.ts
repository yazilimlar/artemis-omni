import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

/**
 * SEO metadata helper.
 * Produces a complete Next.js Metadata object with canonical URL, Open Graph,
 * and Twitter cards. Keeps titles consistent and SEO-accessible outside the canvas.
 */
export function createMetadata(input: SeoInput = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "/",
    ogImage = siteConfig.ogImage,
    type = "website",
    noIndex = false,
    keywords,
  } = input;

  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const fullTitle = title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

/** JSON-LD Organization schema for the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
  };
}
