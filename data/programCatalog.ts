import type { StatusTone } from "@/data/proofLibrary";

export type ProgramCatalogItem = {
  slug: string;
  title: string;
  kind: "Tutorial" | "Program" | "Showcase" | "Solution" | "Brand demo";
  statusLabel: string;
  statusTone: StatusTone;
  sourceType: string;
  summary: string;
  bestPublicLink: {
    href: string;
    label: string;
  };
  tutorialUse: string;
  solutionFit: string;
  migrationPath: string[];
  boundary: string;
};

export const programCatalogItems: ProgramCatalogItem[] = [
  {
    slug: "sewer-simulator-formula-icons",
    title: "Sewer Construction Formula Tutorial",
    kind: "Tutorial",
    statusLabel: "Extract tutorial",
    statusTone: "sanitize",
    sourceType: "Attached local HTML reference",
    summary:
      "Formula explanation, construction inputs, standards, structures, and field-condition learning flow for a sewer construction intelligence simulator.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Best used as an Academy/tutorial extraction source for formulas, input explanations, and estimator education.",
    solutionFit:
      "Supports the utility bridge by explaining why quantities, field conditions, crew assumptions, and construction standards change cost and schedule exposure.",
    migrationPath: [
      "Extract formulas and explanatory copy into public-safe tutorial modules.",
      "Replace local/project-specific labels with generic utility-construction language.",
      "Connect tutorial examples to the Utility Intelligence Bridge proof page.",
    ],
    boundary:
      "Do not publish the raw HTML. Public tutorial examples should use synthetic inputs and generic work-package naming.",
  },
  {
    slug: "sewer-simulator-3d-time",
    title: "Sewer Construction 3D Time Simulator",
    kind: "Program",
    statusLabel: "Rebuild later",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Clickable 3D and construction-time simulation concept for showing how field sequence, geometry, work windows, and duration assumptions change execution risk.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Useful as the blueprint for a future interactive training tool once it is rebuilt with synthetic geometry and browser-safe code.",
    solutionFit:
      "Extends the bridge from static executive narrative into time-aware production planning and constructability review.",
    migrationPath: [
      "Inventory the interaction model and time-simulation assumptions.",
      "Rebuild a lightweight public-safe version with synthetic geometry.",
      "Move reusable education content into Academy and tool patterns.",
    ],
    boundary:
      "Do not iframe or embed the raw simulator. Any public 3D/time tool must be rebuilt with generic data and reviewed controls.",
  },
  {
    slug: "diana-moonshot-demonstrator",
    title: "Diana Animated Intelligence Demonstrator",
    kind: "Brand demo",
    statusLabel: "Public narrative live",
    statusTone: "test",
    sourceType: "Attached local HTML reference",
    summary:
      "Cinematic brand demonstrator with 2D-to-3D transition logic, scan beams, engineering overlays, and the Diana/Artemis visual system.",
    bestPublicLink: {
      href: "/labs/diana-moonshot",
      label: "Diana Moonshot",
    },
    tutorialUse:
      "Use as visual-system inspiration for brand narration, not as a tutorial for product capability.",
    solutionFit:
      "Supports executive experience design, logo library presentation, and the public brand narrative around implementation confidence.",
    migrationPath: [
      "Keep the raw embedded 3D artifact private.",
      "Translate effects into lightweight SVG/CSS visuals and optimized image assets.",
      "Use the Diana Moonshot page as the public-safe destination.",
    ],
    boundary:
      "This is a brand-experience reference, not evidence that robotics products exist today.",
  },
  {
    slug: "utility-bridge-cockpit-v1",
    title: "Utility Intelligence Bridge Cockpit",
    kind: "Solution",
    statusLabel: "Showcase mapped",
    statusTone: "public",
    sourceType: "Attached local HTML reference",
    summary:
      "Executive cockpit concept for one parametric model across utility disciplines, estimate logic, capability mapping, and review gates.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Useful for explaining the implementation method: inputs, disciplines, estimate engine, expert review, and verification gate.",
    solutionFit:
      "Primary source direction for the Utility Intelligence Bridge public narrative and future pilot cockpit.",
    migrationPath: [
      "Keep the raw agency/project-specific source private.",
      "Preserve the executive cockpit story as public-safe page copy and diagrams.",
      "Rebuild any future live cockpit with approved or synthetic data only.",
    ],
    boundary:
      "Public pages should describe the system pattern without agency names, project identifiers, source HTML, or private formulas.",
  },
  {
    slug: "utility-bridge-field-claims-cockpit",
    title: "Utility Field Claims + Actuals Cockpit",
    kind: "Program",
    statusLabel: "Private reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Advanced dual-story cockpit concept for field status, actuals, claim posture, public-demo GIS treatment, and executive controls.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Useful as a source for future training around claims, actuals, field evidence, and review discipline.",
    solutionFit:
      "Defines the deeper private pilot direction after the public Utility Intelligence Bridge narrative is accepted.",
    migrationPath: [
      "Separate public story, private pilot logic, and raw demonstration code.",
      "Sanitize field/claim language and replace program-specific content.",
      "Promote only generic operating patterns to the website.",
    ],
    boundary:
      "Do not publish raw GIS, actuals, claims logic, project naming, or source HTML. Use only public-safe narrative and synthetic examples.",
  },
];

export const programCatalogSummary = {
  liveRoute: "/library/programs",
  publicDestinations: [
    "/labs/utility-intelligence-bridge",
    "/labs/diana-moonshot",
    "/labs/construction-intelligence-workbench",
    "/tools",
  ],
} as const;
