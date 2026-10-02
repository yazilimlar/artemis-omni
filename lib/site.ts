/**
 * Central site configuration. Edit nav, brand, and base URL here.
 * NEXT_PUBLIC_SITE_URL lets Vercel/preview environments override the canonical host.
 */
export const siteConfig = {
  name: "Artemis Omni",
  shortName: "Artemis",
  tagline: "AI-Enabled Execution Bridge",
  description:
    "Artemis is an AI-native, multi-division product platform. Current public work spans infrastructure and construction intelligence, Atlas and places, knowledge systems, finance and decision tools, media, natural systems, and controlled Labs.",
  // Canonical site URL. Override per environment with NEXT_PUBLIC_SITE_URL.
  // artemis.agoraxai.com is the verified Vercel production subdomain as of 2026-06-30.
  // Keep the apex/root agoraxai.com domain on Squarespace unless ownership explicitly changes.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://artemis.agoraxai.com",
  ogImage: "/og/artemis-default.svg",
  locale: "en_US",
  creator: "Artemis Omni",
  links: {
    contact: "/contact",
    pilotEmail: "hello@agoraxai.com",
  },
} as const;
