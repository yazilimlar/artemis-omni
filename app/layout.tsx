import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { createMetadata, organizationJsonLd } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-artemis-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-artemis-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-artemis-mono",
  display: "swap",
});

const themeBootScript = `
  try {
    var savedTheme = localStorage.getItem("artemis-color-theme");
    var theme = savedTheme === "day" ? "day" : "night";
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "night");
    document.documentElement.style.colorScheme = theme === "day" ? "light" : "dark";
  } catch (_) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createMetadata(),
};

export const viewport: Viewport = {
  themeColor: "#070a14",
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
    <html
      lang="en"
      data-theme="night"
      className={`${sans.variable} ${serif.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
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
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
