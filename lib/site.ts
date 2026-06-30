/**
 * Central site configuration. Edit nav, brand, and base URL here.
 * NEXT_PUBLIC_SITE_URL lets Vercel/preview environments override the canonical host.
 */
export const siteConfig = {
  name: "Artemis Omni",
  shortName: "Artemis",
  tagline: "AI-Enabled Execution Bridge",
  description:
    "Artemis turns project fundamentals into AI-enabled execution by connecting design, geometry, quantities, schedule, field production, actual cost, billing revenue, PM forecast, system-generated projections, cashflow, risk, and executive action.",
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
    description: "5D construction intelligence for heavy civil, infrastructure, and project controls.",
  },
  {
    title: "Labs",
    href: "/labs",
    description: "Experimental forecasting, digital-twin, and project-controls prototypes.",
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
    description: "Outcomes from 5D construction intelligence on real programs.",
  },
  {
    title: "About",
    href: "/about",
    description: "The team, the method, the mission.",
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
