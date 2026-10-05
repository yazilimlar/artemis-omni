/**
 * Public showcase catalog — data for /portfolio, the single demos-and-portfolio
 * page. EVERY entry links to a live public route. Internal triage of demo
 * candidates (classifications, priorities, sanitization notes) lives in
 * docs/showcases/ExecutiveDemoLibrary.md and is never rendered here.
 */
export type ShowcaseAsset = {
  name: string;
  description: string;
  href: string;
  tag: string;
};

export const showcaseAssets: ShowcaseAsset[] = [
  {
    name: "Geometric Workbench",
    description:
      "Parametric geodesic and fabrication geometry, running live in the browser.",
    href: "/workbench",
    tag: "Live tool",
  },
  {
    name: "CivicBid Intelligence Bridge",
    description:
      "Bid intelligence for public-works pursuits — opportunities, deadlines, and pursuit triage.",
    href: "/labs/civicbid-intelligence-bridge",
    tag: "Live lab",
  },
  {
    name: "Construction Intelligence Workbench",
    description:
      "A synthetic-data showcase of Artemis construction-intelligence patterns.",
    href: "/labs/construction-intelligence-workbench",
    tag: "Synthetic demo",
  },
  {
    name: "ArtemisIX19",
    description:
      "A public-safe generator studio for prompts, images, renders, videos, plots, and sound cues.",
    href: "/labs/artemisix19",
    tag: "Live lab",
  },
  {
    name: "Fuel Price Adjustment Calculator",
    description:
      "Interactive contract fuel-price adjustment model — runs in the browser.",
    href: "/tools/fuel-price-adjustment",
    tag: "Live tool",
  },
];
