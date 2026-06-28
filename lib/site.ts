/**
 * Central site configuration. Edit nav, brand, and base URL here.
 * NEXT_PUBLIC_SITE_URL lets Vercel/preview environments override the canonical host.
 */
export const siteConfig = {
  name: "Artemis Omni",
  shortName: "Artemis",
  tagline: "The Artemis Intelligence Atelier",
  description:
    "Artemis Omni is an AI-first intelligence platform for engineering, construction, project controls, and business operations — turning technical artifacts into executive-grade decisions.",
  // Production canonical. Temporary test host: artemis.agoraxai.com (see docs/DeploymentPlan.md).
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://artemis.agoraxai.com",
  ogImage: "/og/artemis-default.svg",
  locale: "en_US",
  creator: "Artemis Omni",
  links: {
    contact: "/contact",
  },
} as const;

export type NavItem = {
  title: string;
  href: string;
  description: string;
};

export const mainNav: NavItem[] = [
  {
    title: "Solutions",
    href: "/solutions",
    description: "AI systems for engineering, construction, and project controls.",
  },
  {
    title: "Labs",
    href: "/labs",
    description: "Experimental cinematic intelligence demos and prototypes.",
  },
  {
    title: "Academy",
    href: "/academy",
    description: "Tutorials, explainers, and executive reporting frameworks.",
  },
  {
    title: "Tools",
    href: "/tools",
    description: "Calculators, dashboards, and interactive decision support.",
  },
  {
    title: "Case Studies",
    href: "/case-studies",
    description: "Outcomes from AI-driven project intelligence.",
  },
  {
    title: "About",
    href: "/about",
    description: "The studio, the philosophy, the people.",
  },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Platform",
    items: [
      mainNav[0],
      mainNav[1],
      mainNav[3],
    ],
  },
  {
    heading: "Knowledge",
    items: [mainNav[2], mainNav[4]],
  },
  {
    heading: "Company",
    items: [
      mainNav[5],
      {
        title: "Pilot Request",
        href: "/contact",
        description: "Start a pilot engagement.",
      },
    ],
  },
];
