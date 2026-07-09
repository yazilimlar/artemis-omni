import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { createMetadata, organizationJsonLd } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createMetadata(),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070a14" },
    { media: "(prefers-color-scheme: light)", color: "#f5f2ed" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning on <html>/<body>: browser extensions (theme / reading /
    // "text mode" tools) mutate these top-level attributes before React hydrates, which
    // would otherwise log a benign hydration mismatch. It does NOT hide real mismatches
    // in our own components — only attribute noise on <html>/<body>.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Prevent flash of wrong theme: apply saved or preferred scheme before any
          React hydration runs. Reads localStorage (if safe) and falls back to
          prefers-color-scheme. Sets class="dark" or class="light" on <html>.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("artemis-theme");if(t==="light"||t==="dark"){document.documentElement.className=t;return}}catch(e){}var m=window.matchMedia("(prefers-color-scheme: light)");document.documentElement.className=m.matches?"light":"dark"})()`,
          }}
        />
        {/*
          Fonts are loaded via Google Fonts links (not next/font) so the build
          never depends on network font fetching. If offline, the CSS variable
          fallbacks (Georgia / system sans / system mono) apply gracefully.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="min-h-dvh" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-lunar"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
