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
    slug: "artemisix19-generator-studio",
    title: "ArtemisIX19 Autonomous Generator Studio",
    kind: "Showcase",
    statusLabel: "Generator live",
    statusTone: "test",
    sourceType: "Attached Artemis HTML reference set",
    summary:
      "A new generator route that converts the geodesic, table, atlas, fabrication, and 3D brand-mark references into public-safe prompt, image, render, video, plot, movie, and sound packages.",
    bestPublicLink: {
      href: "/labs/artemisix19",
      label: "ArtemisIX19",
    },
    tutorialUse:
      "Use as the central prompt and media-production surface for future content, library entries, render briefs, storyboards, sound cues, and AI-model handoffs.",
    solutionFit:
      "Creates a safe bridge between protected experimental HTML workbenches and public-facing Artemis content development.",
    migrationPath: [
      "Keep raw HTML references protected and summarize them as source families.",
      "Generate public-safe media packages through the ArtemisIX19 rules engine.",
      "Upgrade later with approved AI/image/video/audio services behind the same boundary model.",
    ],
    boundary:
      "Do not publish source HTML, embedded assets, exact Desktop paths, unverified fabrication values, private coordinates, or raw generated code from old prototypes.",
  },
  {
    slug: "tax-architecture-2026",
    title: "1040 Finance Architecture 2026",
    kind: "Showcase",
    statusLabel: "Standalone live",
    statusTone: "test",
    sourceType: "Reviewed standalone HTML prototype",
    summary:
      "A True 3D finance-architecture model that turns the individual tax flow into a spatial executive learning surface with scenarios, deduction logic, credits, payments, audit table, CSV export, and print review.",
    bestPublicLink: {
      href: "/labs/tax-architecture-2026",
      label: "1040 Finance Architecture",
    },
    tutorialUse:
      "Use as a finance-education and executive-literacy route for explaining how source income, deductions, taxable income, credits, payments, and scenario choices change the final review picture.",
    solutionFit:
      "Broadens Artemis beyond construction controls into financial architecture storytelling, advisory intake, educational products, and premium scenario workshops.",
    migrationPath: [
      "Keep the standalone route live as a reviewed prototype.",
      "Extract reusable scenario, export, and print patterns into future native Artemis components.",
      "Add professional review disclaimers and product packaging before offering paid finance sessions.",
    ],
    boundary:
      "Educational prototype only. It is not tax, legal, accounting, filing, or investment advice and should not be presented as production tax software.",
  },
  {
    slug: "turkiye-atlas-public-lab",
    title: "ARTEMIS Turkiye Atlas",
    kind: "Showcase",
    statusLabel: "Standalone live",
    statusTone: "test",
    sourceType: "Reviewed standalone HTML prototype",
    summary:
      "An interactive cultural-route and destination-intelligence atlas with Mapbox, MapLibre, Leaflet fallback, route planning, storytelling, partner CRM concepts, commercial layers, and dataset diagnostics.",
    bestPublicLink: {
      href: "/labs/turkiye-atlas",
      label: "Turkiye Atlas",
    },
    tutorialUse:
      "Use as the foundation for destination storytelling, bilingual cultural-route education, tourism campaign planning, and map-engine reliability notes.",
    solutionFit:
      "Creates a revenue path for destination pilots, local partner discovery, itinerary products, sponsorship packages, and public-sector cultural/economic development proposals.",
    migrationPath: [
      "Keep the standalone route live as a reviewed prototype.",
      "URL-restrict or rotate the public Mapbox pk token before stronger promotion.",
      "Move reusable route, partner, and diagnostics models into native Artemis data modules over time.",
    ],
    boundary:
      "Contains a public browser Mapbox pk token. Public pk tokens are not secrets, but they must be URL-restricted to approved domains and never replaced with an sk secret token.",
  },
  {
    slug: "george-aegean-quest",
    title: "George Aegean Quest",
    kind: "Showcase",
    statusLabel: "iPhone game",
    statusTone: "test",
    sourceType: "New standalone iPhone Atlas game",
    summary:
      "A mobile-only, one-thumb Artemis Atlas game surface starring George on a default 17-stop route, now enhanced with editable stops, character switching, and a Troy Time Atlas KML anchor layer.",
    bestPublicLink: {
      href: "/labs/george-aegean-quest",
      label: "George Aegean Quest",
    },
    tutorialUse:
      "Use as the first character-led mobile Atlas pattern for simplified itinerary progression, destination storytelling, KML anchor interpretation, and iPhone game pacing.",
    solutionFit:
      "Creates a route for sponsored destination quests, premium character guides, cultural itinerary products, mobile funnel testing, and future booking handoff flows.",
    migrationPath: [
      "Keep this iPhone game route isolated from the heavier map-engine Atlas.",
      "Validate George, one-thumb controls, route pacing, and character-led storytelling before adding dynamic data.",
      "Add future route packs, richer KML imports, and booking handoffs behind the same lightweight game shell.",
    ],
    boundary:
      "Stylized route prototype only. It does not use Mapbox, does not expose a map token, and should not be treated as a complete GIS, navigation, or booking product. KML points are projected onto a designed game board.",
  },
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
    title: "Diana Moonshot Demonstrator",
    kind: "Brand demo",
    statusLabel: "Public narrative live",
    statusTone: "test",
    sourceType: "Attached local HTML reference",
    summary:
      "Cinematic brand demonstrator with 2D-to-3D transition logic, scan beams, engineering overlays, moonshot sequencing, and the Diana/Artemis visual system.",
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
      "This is a brand-experience reference, not a current product-capability claim.",
  },
  {
    slug: "diana-threejs-standalone-viewer",
    title: "Diana Three.js Standalone Viewer",
    kind: "Brand demo",
    statusLabel: "Private 3D reference",
    statusTone: "private",
    sourceType: "Attached standalone HTML reference",
    summary:
      "Standalone embedded 3D viewer reference for the Diana visual system, including model presentation, camera treatment, lighting, and viewer-state behavior.",
    bestPublicLink: {
      href: "/labs/diana-moonshot",
      label: "Diana Moonshot",
    },
    tutorialUse:
      "Useful as a private reference for future brand-experience build notes, camera choreography, and optimized 3D presentation guidance.",
    solutionFit:
      "Supports the Diana Moonshot showcase as the visual source direction for a future rebuilt public viewer or rendered asset sequence.",
    migrationPath: [
      "Keep the embedded 3D payload and raw viewer private.",
      "Extract only presentation decisions, still renders, and public-safe motion language.",
      "Rebuild any public 3D viewer with reviewed assets, licensing notes, and performance budgets.",
    ],
    boundary:
      "Do not publish the standalone viewer, embedded model payload, or source code until the viewer is rebuilt and reviewed for licensing, performance, and public messaging.",
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
      "Advanced dual-story cockpit concept for field status, actuals, claim posture, GIS-style presentation, and executive controls.",
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
  {
    slug: "utility-gis-actuals-deliverables-package",
    title: "Utility GIS + Actuals Deliverables Package",
    kind: "Showcase",
    statusLabel: "Deliverables package",
    statusTone: "private",
    sourceType: "Attached ZIP reference",
    summary:
      "Protected deliverables bundle for the utility cockpit lineage, including clean public-demo treatment, GIS-style corridor data, and verification notes.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Useful as a private implementation checklist for how public demo files, map treatment, and test evidence should be packaged together.",
    solutionFit:
      "Strengthens the Utility Intelligence Bridge proof story by showing the future private-pilot handoff pattern: demo, spatial reference, and validation report.",
    migrationPath: [
      "Keep the ZIP and contained source files out of public routes.",
      "Extract only sanitized verification patterns and generic map/corridor concepts.",
      "Rebuild future public examples with synthetic corridor data and approved screenshots.",
    ],
    boundary:
      "Do not publish the raw package, source HTML, corridor data, actuals, claims logic, agency identifiers, or test-report internals.",
  },
  {
    slug: "contract-evidence-control-center",
    title: "Contract Evidence Control Center",
    kind: "Solution",
    statusLabel: "Private demo reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named presentation reference for delay and claim controls: contract requirements, responsibilities, rights triggers, evidence linkage, confidence labels, and narrative support.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as a demonstration storyline for deductive contract review, inductive pattern detection, abductive issue framing, and multi-model AI check-and-balance review.",
    solutionFit:
      "Supports the Artemis claim and contract reasoning narrative: identify requirements, exercise responsibilities, initiate rights timely, and keep evidence gates visible.",
    migrationPath: [
      "Keep the raw dashboard and source records private.",
      "Rename the concept for public presentation as Contract Evidence Control Center.",
      "Extract only sanitized workflow diagrams, reasoning modes, and control-gate language.",
    ],
    boundary:
      "Do not publish source HTML, delay records, claim names, project identifiers, dates, dollar values, document paths, correspondence, dispute narratives, or legal advice.",
  },
  {
    slug: "utility-parametric-5d-workbench",
    title: "Utility Parametric 5D Workbench",
    kind: "Program",
    statusLabel: "Private demo reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named presentation reference for utility modeling: 3D controls, standards library, 4D planning, 5D earned-value logic, and cost-code governance.",
    bestPublicLink: {
      href: "/labs/utility-intelligence-bridge",
      label: "Utility Intelligence Bridge",
    },
    tutorialUse:
      "Use as a demonstration path for model-to-schedule-to-cost reasoning with generic utility construction examples.",
    solutionFit:
      "Supports the Utility Intelligence Bridge by showing how standards, geometry, schedule, quantities, and cost coding can become one controlled workbench.",
    migrationPath: [
      "Keep the raw utility workbench private.",
      "Rename the concept for public presentation as Utility Parametric 5D Workbench.",
      "Extract only sanitized diagrams, workflow copy, and synthetic control examples.",
    ],
    boundary:
      "Do not publish source HTML, agency labels, utility standards, private model logic, cost-code mappings, project parameters, or raw 3D assets.",
  },
  {
    slug: "control-budget-audit-studio",
    title: "Control Budget Audit Studio",
    kind: "Solution",
    statusLabel: "Private demo reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named presentation reference for budget governance: audit trail, budget split, component breakdown, bid-item ranking, and commercial-control views.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as a public-safe storyline for explaining budget traceability, source-of-truth controls, and executive audit readiness.",
    solutionFit:
      "Supports model-to-money and executive finance narratives without exposing raw budget records.",
    migrationPath: [
      "Keep raw budget data and audit records private.",
      "Rename the concept for presentation as Control Budget Audit Studio.",
      "Create synthetic budget examples before any public article or demo.",
    ],
    boundary:
      "Do not publish source HTML, raw budget data, person names, project identifiers, bid items, audit records, or dollar values.",
  },
  {
    slug: "field-production-story-theater",
    title: "Field Production Story Theater",
    kind: "Showcase",
    statusLabel: "Private visual reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named visual reference for an interactive field narrative: mission framing, infrastructure context, stakeholder education, and engineering ecosystem visuals.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as a format model for cinematic field education and public knowledge articles.",
    solutionFit:
      "Supports the Artemis public storytelling layer by turning technical field context into a narrated, role-aware experience.",
    migrationPath: [
      "Keep the raw field story private.",
      "Extract presentation structure, narrative cadence, and visual treatment only.",
      "Rebuild future public versions with synthetic or approved public context.",
    ],
    boundary:
      "Do not publish source HTML, project names, organization names, site history, visit details, embedded private narrative content, or raw media.",
  },
  {
    slug: "forecast-exposure-matrix",
    title: "Forecast Exposure Matrix",
    kind: "Solution",
    statusLabel: "Private demo reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named presentation reference for forecast exposure: executive rules, exposure ranges, design logic, and PM forecast-to-budget comparison patterns.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as a source pattern for articles and visuals about forecast ranges, cash timing, assumptions, and escalation thresholds.",
    solutionFit:
      "Supports the Forecast Exposure Control Center narrative and future public-safe finance/control tutorials.",
    migrationPath: [
      "Keep the raw forecast dashboard private.",
      "Rename the concept for presentation as Forecast Exposure Matrix.",
      "Rebuild charts with synthetic figures and explicit caveats.",
    ],
    boundary:
      "Do not publish source HTML, raw forecast data, project identifiers, budget labels, exposure values, or source formulas.",
  },
  {
    slug: "category-risk-ownership-lens",
    title: "Category Risk Ownership Lens",
    kind: "Solution",
    statusLabel: "Private demo reference",
    statusTone: "private",
    sourceType: "Attached local HTML reference",
    summary:
      "Pseudo-named presentation reference for category-level exposure: winners, losers, ownership lens, delta audit, and risk classification.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as an advanced article format for explaining who owns risk, which category moved, and what executive decision is required.",
    solutionFit:
      "Extends forecast exposure storytelling into ownership, accountability, and decision routing.",
    migrationPath: [
      "Keep the raw category-risk dashboard private.",
      "Rename the concept for presentation as Category Risk Ownership Lens.",
      "Extract sanitized category logic and rebuild with synthetic exposure values.",
    ],
    boundary:
      "Do not publish source HTML, raw category data, real-party ownership labels, project identifiers, exposure values, or source formulas.",
  },
  {
    slug: "multimodel-5d-masterclass",
    title: "Multimodel 5D Masterclass",
    kind: "Tutorial",
    statusLabel: "Method source",
    statusTone: "sanitize",
    sourceType: "Attached local HTML reference",
    summary:
      "Masterclass reference for modular lessons, live sandbox thinking, multi-AI prompt vaults, QA harnesses, scripted narration, and visual prompt discipline.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Use as the format model for future Artemis education: module promise, build steps, prompt roles, QA checklist, visual idea, and public caveat.",
    solutionFit:
      "Supports an AI-assisted publication system where field knowledge becomes reviewed articles, graphics, and implementation playbooks.",
    migrationPath: [
      "Extract the module structure without publishing raw HTML.",
      "Replace private case-study labels with synthetic construction and business scenarios.",
      "Use /insights as the public operating model for article and visual production.",
    ],
    boundary:
      "Do not publish source HTML, private case-study labels, embedded project specifics, or unreviewed AI prompts.",
  },
  {
    slug: "multimodel-5d-tutorial-series",
    title: "Multimodel 5D Tutorial Series",
    kind: "Tutorial",
    statusLabel: "Bilingual source",
    statusTone: "sanitize",
    sourceType: "Attached local HTML reference",
    summary:
      "Bilingual tutorial-series reference for explaining multi-AI synthesis, 5D model semantics, scripted storyboards, and public lesson flow.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Useful for future EN/TR article and lesson formats that teach AI-assisted implementation without exposing private examples.",
    solutionFit:
      "Shows how Artemis can teach CEOs, CFOs, project teams, engineers, builders, and operators through role-aware content.",
    migrationPath: [
      "Inventory reusable lesson structure and bilingual UX patterns.",
      "Remove private project references and replace them with synthetic examples.",
      "Promote the public-safe teaching pattern into Academy and Insights.",
    ],
    boundary:
      "Do not publish raw tutorial HTML, private case-study context, project names, coordinates, or unreviewed bilingual translations.",
  },
  {
    slug: "multimodel-5d-changelog",
    title: "Multimodel 5D Changelog",
    kind: "Program",
    statusLabel: "Reference discipline",
    statusTone: "reference",
    sourceType: "Attached markdown reference",
    summary:
      "Changelog reference for documenting live sandbox improvements, QA hardening, prompt vault changes, visual prompt additions, and release-readiness evidence.",
    bestPublicLink: {
      href: "/insights",
      label: "Insights Engine",
    },
    tutorialUse:
      "Useful as a model for explaining how Artemis articles, tutorials, and visual systems improve over time.",
    solutionFit:
      "Supports disciplined publication operations: every release should have version notes, caveats, test evidence, and public boundary language.",
    migrationPath: [
      "Convert changelog structure into public feature notes.",
      "Keep internal development notes and source filenames private.",
      "Attach release evidence to future public article and visual updates.",
    ],
    boundary:
      "Do not publish internal source filenames, raw changelog notes, or implementation details that reveal private source material.",
  },
];

export const programCatalogSummary = {
  liveRoute: "/library/programs",
  publicDestinations: [
    "/labs/utility-intelligence-bridge",
    "/labs/diana-moonshot",
    "/labs/construction-intelligence-workbench",
    "/labs/tax-architecture-2026",
    "/labs/turkiye-atlas",
    "/labs/george-aegean-quest",
    "/insights",
    "/tools",
  ],
} as const;
