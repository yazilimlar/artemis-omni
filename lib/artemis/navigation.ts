/**
 * Public navigation model for the Artemis app shell.
 * Primary (header) nav reflects the public product architecture. Existing routes
 * remain reachable via the footer so nothing is orphaned by structural changes.
 */
export type NavLink = { title: string; href: string };

export const primaryNav: NavLink[] = [
  { title: "Solutions", href: "/solutions" },
  { title: "Products", href: "/products" },
  { title: "Labs", href: "/labs" },
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
      { title: "Integrate", href: "/integrate" },
    ],
  },
  {
    heading: "Knowledge",
    links: [
      { title: "Library", href: "/library" },
      { title: "Insights", href: "/insights" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { title: "Labs", href: "/labs" },
      { title: "Geometric Workbench", href: "/workbench" },
      { title: "Tools", href: "/tools" },
      { title: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    heading: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Platform", href: "/platform" },
      { title: "Departments Artemis Serves", href: "/departments" },
      { title: "Contact", href: "/contact" },
    ],
  },
];
