/**
 * Public navigation model for the Artemis app shell.
 * Primary (header) nav reflects the new public architecture. Existing routes
 * (Labs, Academy, Tools, Case Studies, About) remain reachable via the footer so
 * nothing is orphaned by the new structure.
 */
export type NavLink = { title: string; href: string };

export const primaryNav: NavLink[] = [
  { title: "Solutions", href: "/solutions" },
  { title: "Products", href: "/products" },
  { title: "Studio", href: "/studio" },
  { title: "ArtemisIX", href: "/artemisix" },
  { title: "Demo", href: "/demo" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Library", href: "/library" },
  { title: "Departments", href: "/departments" },
];

export const ctaNav: NavLink = { title: "Request a Pilot", href: "/contact" };

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Platform",
    links: [
      { title: "Solutions", href: "/solutions" },
      { title: "Products", href: "/products" },
      { title: "Demo", href: "/demo" },
    ],
  },
  {
    heading: "Knowledge",
    links: [
      { title: "Library", href: "/library" },
      { title: "Academy", href: "/academy" },
      { title: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { title: "ArtemisIX", href: "/artemisix" },
      { title: "Studio", href: "/studio" },
      { title: "Labs", href: "/labs" },
      { title: "Tools", href: "/tools" },
      { title: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Brand", href: "/brand" },
      { title: "Departments", href: "/departments" },
      { title: "Contact", href: "/contact" },
    ],
  },
];
