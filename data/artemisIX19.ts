export type ArtemisIX19AssetType =
  | "prompt"
  | "image"
  | "render"
  | "video"
  | "plot"
  | "movie"
  | "sound";

export type ArtemisIX19Audience =
  | "Executive"
  | "Fabrication"
  | "Product"
  | "Story";

export type ArtemisIX19Privacy = "public-safe" | "private-pilot";

export type ArtemisIX19SolutionIntentId =
  | "risk-claim-control"
  | "field-production"
  | "cashflow-board"
  | "public-learning";

export type ArtemisIX19SolutionTerrainId =
  | "contractor"
  | "executive"
  | "field"
  | "finance";

export type ArtemisIX19Source = {
  id: string;
  title: string;
  family: string;
  status: "Public-safe rebuild" | "Private reference" | "Sanitize before release";
  summary: string;
  sourceSet: string[];
  signals: string[];
  outputAngles: string[];
  boundary: string;
};

export type ArtemisIX19AssetProfile = {
  id: ArtemisIX19AssetType;
  label: string;
  command: string;
  output: string;
};

export type ArtemisIX19SolutionIntent = {
  id: ArtemisIX19SolutionIntentId;
  label: string;
  question: string;
  pain: string;
  purpose: string;
  meaning: string;
  point: string;
  visualState: string;
};

export type ArtemisIX19SolutionTerrain = {
  id: ArtemisIX19SolutionTerrainId;
  label: string;
  audience: ArtemisIX19Audience;
  pressure: string;
  connects: string[];
  revenueIdea: string;
};

export type ArtemisIX19DailyStream = {
  dateKey: string;
  essayTitle: string;
  essay: string;
  updateTitle: string;
  update: string;
  quote: string;
  stoicCartoon: string;
  question: string;
  irony: string;
  observation: string;
  publicRevenueIdea: string;
  alternatives: { quadrant: string; examples: string[] }[];
};

export type ArtemisIX19GeneratedPackage = {
  title: string;
  sourceTitle: string;
  assetLabel: string;
  audience: ArtemisIX19Audience;
  privacy: ArtemisIX19Privacy;
  intensity: number;
  prompt: string;
  imagePrompt: string;
  renderPlan: string[];
  storyboard: string[];
  movieBeats: string[];
  plotPoints: { label: string; value: number }[];
  soundCue: string;
  categories: {
    promptCategory: string;
    movieCategory: string;
    timeEraCategory: string;
    renderType: string;
    styleType: string;
    videoPrompt: string;
    solutionCategory: string;
    publicRevenueIdea: string;
  };
  convergence: {
    clickPath: string[];
    triangleState: string;
    imageState: string;
    projectPoint: string;
    purpose: string;
    meaning: string;
  };
  manifest: {
    version: string;
    route: string;
    generatedBy: string;
    publicBoundary: string;
    sourceSignals: string[];
    exportTypes: ArtemisIX19AssetType[];
    solutionIntent: ArtemisIX19SolutionIntentId;
    solutionTerrain: ArtemisIX19SolutionTerrainId;
    triangleLocked: boolean;
  };
};

export const artemisIX19Sources: ArtemisIX19Source[] = [
  {
    id: "geodesic-fabrication",
    title: "Geodesic Fabrication Shell",
    family: "Goldberg dome · dowel/socket · shop cards",
    status: "Sanitize before release",
    summary:
      "Turns geodesic dome workbench lineage into public-safe fabrication narratives, render directions, shop-card prompts, connector logic, and inspection plots.",
    sourceSet: [
      "Goldberg geodesic shell workbench",
      "Dowel/socket connector system",
      "Assembly labels and dimensioned shop cards",
      "Solid shell dome visual shop card",
    ],
    signals: [
      "Hex/pent cell logic",
      "Dowel/socket connector language",
      "Level schedule",
      "Inspection labels",
      "Print-safe shop card hierarchy",
    ],
    outputAngles: [
      "Fabrication prompt pack",
      "Exploded connector render brief",
      "Shop-card plot and tolerance story",
      "Sound cue for precision assembly",
    ],
    boundary:
      "Use generic dome geometry and synthetic dimensions only. Do not publish raw source HTML, embedded assets, or unverified fabrication values.",
  },
  {
    id: "table-topology",
    title: "Table Topology Workbench",
    family: "Node-driven base · Gemini miter augmentation",
    status: "Public-safe rebuild",
    summary:
      "Converts the table-base experiments into an autonomous topology generator for prompts, visual assembly logic, constraint plots, and product storytelling.",
    sourceSet: [
      "Verified node-driven topology",
      "Gemini miter augmented table base",
    ],
    signals: [
      "Node topology",
      "Miter intent",
      "Two-leg alignment",
      "Constraint validation",
      "Readable assembly sequence",
    ],
    outputAngles: [
      "Product render brief",
      "Topology validation plot",
      "Assembly movie beats",
      "Material and joinery sound palette",
    ],
    boundary:
      "Present as a design-system prototype. Do not claim manufacturing readiness without tolerance, load, and material verification.",
  },
  {
    id: "turkiye-atlas",
    title: "Türkiye Atlas Story Engine",
    family: "Mapbox 3D · character guides · itinerary deck",
    status: "Sanitize before release",
    summary:
      "Reframes the atlas into a story generator for public-safe routes, map-scene prompts, character-guide boards, video sequences, and ambient soundscapes.",
    sourceSet: [
      "Clinical Mapbox 3D satellite atlas",
      "Polished interactive atlas",
      "Mapbox 3D enabled atlas",
    ],
    signals: [
      "Satellite/terrain mode",
      "Character guides",
      "Itinerary state",
      "Regional story lenses",
      "Map engine fallback awareness",
    ],
    outputAngles: [
      "Atlas scene prompt",
      "Route-story storyboard",
      "Terrain confidence plot",
      "Cinematic travel sound cue",
    ],
    boundary:
      "Use planning-grade, generic route language unless locations and coordinates are independently verified for publication.",
  },
  {
    id: "brand-3d",
    title: "Artemis 3D Brand Mark",
    family: "Three.js brand render · cinematic logo system",
    status: "Public-safe rebuild",
    summary:
      "Converts the 3D brand-mark reference into a reusable motion identity system for image prompts, render scripts, movie openers, and audio logo cues.",
    sourceSet: [
      "Artemis 3D brand mark",
      "Cinematic logo lighting reference",
      "Moonshot visual language",
    ],
    signals: [
      "Delta-A silhouette",
      "Crescent geometry",
      "Metallic gold/platinum/cyan accents",
      "Orbit and scan motion",
      "Executive-grade dark stage",
    ],
    outputAngles: [
      "Logo render prompt",
      "Launch-film opener",
      "Brand waveform cue",
      "Visual identity plot",
    ],
    boundary:
      "Use as a brand-experience layer, not as evidence of product capability beyond the implemented Artemis system.",
  },
];

export const artemisIX19AssetProfiles: ArtemisIX19AssetProfile[] = [
  {
    id: "prompt",
    label: "Prompt",
    command: "Write autonomous multi-model instructions",
    output: "A reusable prompt with role, source signals, constraints, and review gates.",
  },
  {
    id: "image",
    label: "Image",
    command: "Generate visual prompt language",
    output: "A detailed image brief for stills, thumbnails, hero visuals, or concept boards.",
  },
  {
    id: "render",
    label: "Render",
    command: "Plan a 3D/SVG/WebGL render",
    output: "A render direction with camera, material, lighting, and inspection overlays.",
  },
  {
    id: "video",
    label: "Video",
    command: "Build a short-form storyboard",
    output: "A timed sequence for demo clips, explainers, or social cuts.",
  },
  {
    id: "plot",
    label: "Plot",
    command: "Create a signal/metric plot",
    output: "A chart concept with deterministic values and executive interpretation.",
  },
  {
    id: "movie",
    label: "Movie",
    command: "Produce cinematic sequence beats",
    output: "A longer narrative arc for launch films, product trailers, and demo reels.",
  },
  {
    id: "sound",
    label: "Sound",
    command: "Design a sound cue",
    output: "A sonic direction for UI confirmation, trailer beds, or logo stings.",
  },
];

export const artemisIX19SolutionIntents: ArtemisIX19SolutionIntent[] = [
  {
    id: "risk-claim-control",
    label: "Control Risk + Claims",
    question: "Where are delay, entitlement, payment, and change risks accumulating?",
    pain:
      "Contract obligations, field facts, cost records, and notices drift apart until recovery becomes argument instead of evidence.",
    purpose:
      "Convert agreement language, live conditions, and production evidence into a timed control valve for rights, responsibilities, and decisions.",
    meaning:
      "The system makes hidden exposure visible early enough for a manager to act before the issue becomes permanent loss.",
    point: "Contract requirement -> event evidence -> timely right",
    visualState:
      "a triangular control valve where contract clauses, field actuals, and financial exposure settle into one decision point",
  },
  {
    id: "field-production",
    label: "Stabilize Field Production",
    question: "Which constraint blocks crews, equipment, material, access, or supervision today?",
    pain:
      "Production plans fail when procurement, equipment rental, union crews, subcontractors, permits, RFIs, and submittals move on separate clocks.",
    purpose:
      "Connect schedule intent to field readiness so the next production move has the labor, equipment, material, access, and documentation it needs.",
    meaning:
      "The system turns scattered readiness checks into a simple production truth that foremen and executives can both understand.",
    point: "Ready work -> constrained work -> executive unblock",
    visualState:
      "a live production board where crews, equipment, material, permit, and RFI signals converge on a single release gate",
  },
  {
    id: "cashflow-board",
    label: "Explain Cashflow + Board Exposure",
    question: "Which billing, accrual, reconciliation, and forecast signals change the executive story?",
    pain:
      "Payments, receipts, T&M logs, accruals, budget revisions, and projections often explain the business too late.",
    purpose:
      "Translate operational facts into board-level movement across actual cost, billing revenue, forecast, cashflow, risk, and opportunity.",
    meaning:
      "The system lets leadership see what changed, why it changed, and what must be decided without waiting for a static monthly deck.",
    point: "Actual cost -> billing revenue -> forecast action",
    visualState:
      "a breathing executive dashboard where cost, billing, forecast, and cashflow lines tighten into one board decision",
  },
  {
    id: "public-learning",
    label: "Publish Public Learning",
    question: "Which insight should become an essay, visual, tutorial, prompt, or revenue idea?",
    pain:
      "Hard-earned construction, operations, and AI implementation knowledge disappears into private files instead of teaching the market.",
    purpose:
      "Turn safe lessons, caveats, examples, and alternative solution logic into daily public knowledge without leaking private records.",
    meaning:
      "The system becomes a disciplined public learning engine: useful enough to teach, bounded enough to publish.",
    point: "Private lesson -> public-safe story -> reusable solution",
    visualState:
      "a publication forge where article, visual, prompt, movie, cartoon, and solution blocks orbit one teaching point",
  },
];

export const artemisIX19SolutionTerrains: ArtemisIX19SolutionTerrain[] = [
  {
    id: "contractor",
    label: "Builder / Contractor",
    audience: "Product",
    pressure:
      "Margin, schedule credibility, change recovery, subcontractor coordination, and field throughput.",
    connects: [
      "Contract agreement",
      "Schedule and field actuals",
      "Change orders and T&Ms",
      "Subcontractor and equipment signals",
    ],
    revenueIdea:
      "Package a weekly contractor risk-control memo with three recoverable events, two unblock actions, and one public-safe lesson.",
  },
  {
    id: "executive",
    label: "CEO / COO / Board",
    audience: "Executive",
    pressure:
      "Capital allocation, execution confidence, delayed bad news, governance, and portfolio-wide opportunity cost.",
    connects: [
      "System-generated projections",
      "Cashflow and forecast exposure",
      "Risk and opportunity register",
      "Executive action log",
    ],
    revenueIdea:
      "Publish an executive implementation note that explains one operational blind spot and the board decision it should trigger.",
  },
  {
    id: "field",
    label: "Project / Field Team",
    audience: "Fabrication",
    pressure:
      "Crew readiness, utility conflicts, plan ambiguity, inspection evidence, late RFIs, and fragmented daily logs.",
    connects: [
      "Permits, RFIs, and submittals",
      "Crew and equipment readiness",
      "Geometry and plan edits",
      "Photos, logs, and inspection gates",
    ],
    revenueIdea:
      "Create a field-ready tutorial card that shows the constraint, the required proof, and the clean next action.",
  },
  {
    id: "finance",
    label: "CFO / Controls",
    audience: "Executive",
    pressure:
      "Receipts, payment logs, accruals, reconciliation, billing timing, forecast drift, and claim reserve discipline.",
    connects: [
      "Payment applications and receipts",
      "Control budget and accruals",
      "Billing revenue and actual cost",
      "Forecast, claim, and cashflow exposure",
    ],
    revenueIdea:
      "Generate a public-safe controls bulletin that teaches one reconciliation failure pattern and one prevention mechanism.",
  },
];

const audienceDirectives: Record<ArtemisIX19Audience, string> = {
  Executive:
    "Frame every output around decision clarity, implementation confidence, and reviewable next action.",
  Fabrication:
    "Prioritize geometry, dimensions, tolerance language, labels, inspection, and shop readability.",
  Product:
    "Translate the source into a reusable product surface with controls, states, outputs, and pilot value.",
  Story:
    "Build a cinematic sequence with setting, signal, transformation, reveal, and call-to-action.",
};

const privacyRules: Record<ArtemisIX19Privacy, string> = {
  "public-safe":
    "Use synthetic examples, generic names, no raw local source, no private coordinates, no client identifiers, and no unverified technical claims.",
  "private-pilot":
    "Allow deeper pilot language but keep a human review gate before using real assets, project records, exact coordinates, or fabrication values.",
};

const assetInstructions: Record<ArtemisIX19AssetType, string> = {
  prompt:
    "Return a master prompt, model-specific variations, negative constraints, acceptance checks, and a handoff note.",
  image:
    "Return a still-image brief with subject, environment, camera, material, lighting, labels, aspect ratio, and negative prompt.",
  render:
    "Return a render plan with camera path, scene graph, materials, overlays, performance budget, and fallback image.",
  video:
    "Return a 30-60 second storyboard with shot timing, motion, captions, transition logic, and export ratio.",
  plot:
    "Return a chart concept with axes, data source assumptions, confidence labels, annotations, and executive reading.",
  movie:
    "Return a cinematic product-trailer treatment with act structure, scene beats, sound, typography, and final CTA.",
  sound:
    "Return a sound design cue with tempo, instrumentation, texture, UI moments, mix notes, and avoidances.",
};

const intensityLabels = [
  "restrained",
  "polished",
  "cinematic",
  "high-energy",
  "launch-grade",
] as const;

const promptCategories = [
  "Contract intelligence",
  "Field production intelligence",
  "Financial controls intelligence",
  "Public learning intelligence",
] as const;

const movieCategories = [
  "Executive systems thriller",
  "Field operations documentary",
  "Technical product reveal",
  "Public learning mini-lecture",
] as const;

const eraCategories = [
  "near-future construction command center",
  "classical Artemis observatory",
  "modern infrastructure war room",
  "post-crisis implementation review",
] as const;

const renderTypes = [
  "SVG system diagram",
  "dashboard simulation",
  "3D still render",
  "annotated cinematic frame",
] as const;

const styleTypes = [
  "platinum blueprint",
  "cyan signal trace",
  "gold executive annotation",
  "dark technical stage",
] as const;

const dailyEssays = [
  {
    title: "The Clause Is Not the Control",
    body:
      "A contract clause becomes useful only when the organization turns it into a timed action. Artemis treats the clause as a signal source, then connects it to field proof, cost effect, responsible party, deadline, and executive decision.",
  },
  {
    title: "Delay Is Usually a Data Architecture Problem",
    body:
      "Most delay stories are not born in court. They start when the RFI, permit, crew, equipment, and daily log stop speaking the same language. The daily task is to restore semantic alignment before the schedule hardens around a false story.",
  },
  {
    title: "Forecasts Should Explain Their Own Fear",
    body:
      "A forecast that only shows a number asks leadership to trust a shadow. A useful forecast names the assumption, the evidence, the counter-evidence, and the action that would change the result.",
  },
  {
    title: "The Public Lesson Must Be Safer Than the Private File",
    body:
      "Public knowledge can teach without exposing a client. Strip names, coordinates, private values, and raw records. Keep the pattern, the caveat, the question, and the solution logic.",
  },
] as const;

const dailyUpdates = [
  "Watch the gap between procurement lead times and field sequence promises. The moment those clocks diverge, the claim story and the production story begin to separate.",
  "Reconcile T&M tickets against daily logs before the memory of the work disappears. The evidence is operational first and financial second.",
  "Treat equipment rentals as schedule evidence, not only cost. Idle equipment often explains access, readiness, or coordination failure.",
  "Do not let value engineering become undocumented redesign. Every savings idea needs design authority, risk transfer language, and downstream schedule review.",
] as const;

const dailyQuotes = [
  "The right to act is weaker than the system that remembers when to act.",
  "A hidden constraint is just a future explanation arriving late.",
  "The best dashboard is a decision that can defend itself.",
  "A useful public story is a private lesson with the unsafe details removed.",
] as const;

const dailyCartoons = [
  "A calm superintendent points at a triangle labeled Clause, Field, Cost while a late email tries to sneak out the side door.",
  "A stoic accountant weighs a payment log against a stack of receipts while a tiny forecast line asks for evidence.",
  "A project manager offers a hardhat to a confused RFI, then guides it toward a glowing decision gate.",
  "A board table watches a schedule bar breathe in and out while Artemis asks, 'What changed since yesterday?'",
] as const;

const dailyQuestions = [
  "Which obligation has a deadline but no visible owner today?",
  "Which payment, receipt, or accrual changed the project story this week?",
  "Which field constraint would be obvious if the dashboard spoke crew language?",
  "Which public lesson can be shared without exposing a private file?",
] as const;

const dailyIronies = [
  "The meeting lasted an hour to avoid writing the three sentences that would have solved the problem.",
  "The project had a dashboard for every metric except the decision everyone was avoiding.",
  "The cheapest value-engineering idea became expensive when nobody priced the approval path.",
  "The contract was precise; the calendar was not.",
] as const;

const dailyObservations = [
  "Claims, forecasts, and production logs become stronger when they share the same event grammar.",
  "A good AI workflow should reduce ambiguity before it increases output volume.",
  "The public website can teach the market while the private system protects the client.",
  "Board confidence improves when limits, assumptions, and next actions are visible together.",
] as const;

const alternativeQuadrants = [
  {
    quadrant: "Prevent",
    examples: [
      "Clause-to-deadline watchlist",
      "Permit readiness heat map",
      "Submittal aging lane",
      "Procurement lead-time gate",
    ],
  },
  {
    quadrant: "Recover",
    examples: [
      "T&M evidence bundle",
      "Change order narrative",
      "Delay notice draft",
      "Payment reconciliation brief",
    ],
  },
  {
    quadrant: "Explain",
    examples: [
      "Board exposure memo",
      "Field story timeline",
      "Value engineering tradeoff",
      "Forecast assumption ledger",
    ],
  },
  {
    quadrant: "Publish",
    examples: [
      "Public-safe daily essay",
      "Stoic cartoon prompt",
      "Alternative solution card",
      "Revenue idea worksheet",
    ],
  },
] as const;

export function getArtemisIX19Source(id: string) {
  return artemisIX19Sources.find((source) => source.id === id) ?? artemisIX19Sources[0];
}

export function getArtemisIX19AssetProfile(id: ArtemisIX19AssetType) {
  return artemisIX19AssetProfiles.find((profile) => profile.id === id) ?? artemisIX19AssetProfiles[0];
}

export function getArtemisIX19SolutionIntent(id?: ArtemisIX19SolutionIntentId) {
  return (
    artemisIX19SolutionIntents.find((intent) => intent.id === id) ??
    artemisIX19SolutionIntents[0]
  );
}

export function getArtemisIX19SolutionTerrain(id?: ArtemisIX19SolutionTerrainId) {
  return (
    artemisIX19SolutionTerrains.find((terrain) => terrain.id === id) ??
    artemisIX19SolutionTerrains[0]
  );
}

function seedFrom(value: string) {
  return Array.from(value).reduce((seed, character) => seed + character.charCodeAt(0), 31);
}

function pick<T>(items: readonly T[], seed: number, offset = 0) {
  return items[Math.abs(seed + offset) % items.length];
}

export function buildArtemisIX19DailyStream({
  dateKey,
  sourceId,
  intentId,
  terrainId,
}: {
  dateKey: string;
  sourceId: string;
  intentId: ArtemisIX19SolutionIntentId;
  terrainId: ArtemisIX19SolutionTerrainId;
}): ArtemisIX19DailyStream {
  const seed = seedFrom(`${dateKey}:${sourceId}:${intentId}:${terrainId}`);
  const intent = getArtemisIX19SolutionIntent(intentId);
  const terrain = getArtemisIX19SolutionTerrain(terrainId);
  const essay = pick(dailyEssays, seed);

  return {
    dateKey,
    essayTitle: essay.title,
    essay: `${essay.body} Today's lens: ${intent.label.toLowerCase()} for ${terrain.label.toLowerCase()}.`,
    updateTitle: "Daily Industry Update (public-safe synthetic)",
    update: pick(dailyUpdates, seed, 3),
    quote: pick(dailyQuotes, seed, 5),
    stoicCartoon: pick(dailyCartoons, seed, 7),
    question: pick(dailyQuestions, seed, 11),
    irony: pick(dailyIronies, seed, 13),
    observation: pick(dailyObservations, seed, 17),
    publicRevenueIdea: terrain.revenueIdea,
    alternatives: alternativeQuadrants.map((quadrant, index) => ({
      quadrant: quadrant.quadrant,
      examples: quadrant.examples.map((example, exampleIndex) =>
        exampleIndex === index
          ? `${example} for ${intent.label.toLowerCase()}`
          : example,
      ),
    })),
  };
}

export function buildArtemisIX19Package({
  sourceId,
  assetType,
  audience,
  privacy,
  intensity,
  intentId = "risk-claim-control",
  terrainId = "contractor",
  triangleLocked = false,
}: {
  sourceId: string;
  assetType: ArtemisIX19AssetType;
  audience: ArtemisIX19Audience;
  privacy: ArtemisIX19Privacy;
  intensity: number;
  intentId?: ArtemisIX19SolutionIntentId;
  terrainId?: ArtemisIX19SolutionTerrainId;
  triangleLocked?: boolean;
}): ArtemisIX19GeneratedPackage {
  const source = getArtemisIX19Source(sourceId);
  const asset = getArtemisIX19AssetProfile(assetType);
  const intent = getArtemisIX19SolutionIntent(intentId);
  const terrain = getArtemisIX19SolutionTerrain(terrainId);
  const boundedIntensity = Math.min(Math.max(Math.round(intensity), 1), 5);
  const intensityLabel = intensityLabels[boundedIntensity - 1];
  const signalList = source.signals.map((signal) => `- ${signal}`).join("\n");
  const categorySeed = seedFrom(`${source.id}:${assetType}:${intent.id}:${terrain.id}:${boundedIntensity}`);
  const selectedMovieCategory = pick(movieCategories, categorySeed, 2);
  const selectedEraCategory = pick(eraCategories, categorySeed, 4);
  const selectedRenderType = pick(renderTypes, categorySeed, 6);
  const selectedStyleType = `${intensityLabel} ${pick(styleTypes, categorySeed, 8)}`;
  const triangleState = triangleLocked
    ? "Third-click triangle locked: the project has settled to one point, purpose, and meaning."
    : "Awaiting third-click triangle: keep options visible until the client commits the convergence point.";

  const prompt = [
    `Role: You are ArtemisIX19, an autonomous Artemis content and media generation operator.`,
    `Mission: ${asset.command} for ${source.title}.`,
    `Two-click solution path: ${intent.label} for ${terrain.label}.`,
    `Third-click triangle: ${triangleState}`,
    `Audience: ${audience}. ${audienceDirectives[audience]}`,
    `Client pressure: ${terrain.pressure}`,
    `Reasoning mode: deductive contract requirements, inductive field and financial patterns, abductive alternative-solution discovery.`,
    `Style: ${intensityLabel}; premium, technical, clear, source-labeled, and implementation-aware.`,
    `Source signals:\n${signalList}`,
    `Connected records: ${terrain.connects.join("; ")}.`,
    `Output rule: ${assetInstructions[assetType]}`,
    `Boundary: ${privacyRules[privacy]} ${source.boundary}`,
    `Acceptance checks: name the decision improved, identify the source signal, state the limitation, and end with the next review action.`,
  ].join("\n\n");

  const imagePrompt = [
    `${source.title} visual system, ${source.family}, ${intensityLabel} Artemis execution aesthetic.`,
    `Project transformation: ${intent.visualState}.`,
    `Show ${source.signals.slice(0, 3).join(", ").toLowerCase()} as a clean executive-grade composition.`,
    `Use dark technical staging, warm gold annotation, platinum geometry, cyan signal traces, readable labels, and no private source screenshots.`,
    `Negative prompt: raw HTML UI, real project identifiers, hidden coordinates, clutter, illegible text, decorative-only spectacle.`,
  ].join(" ");

  const renderPlan = [
    `Scene: ${source.title} rebuilt from public-safe primitives, not raw source embedding.`,
    `Camera: ${boundedIntensity >= 4 ? "slow orbital push-in with final inspection lock" : "steady three-quarter technical view"}.`,
    `Materials: matte lunar base, brushed platinum structure, restrained gold edges, cyan signal overlays.`,
    `Overlays: ${source.signals.slice(0, 4).join(", ")}.`,
    `Convergence: render three decision inputs as a triangle that settles on ${intent.point.toLowerCase()}.`,
    `Fallback: static SVG/PNG export with the same source labels and boundary note.`,
  ];

  const storyboard = [
    `00-05s: First click selects the client need - ${intent.label}.`,
    `05-10s: Second click selects the operating terrain - ${terrain.label}.`,
    `10-14s: Third click locks the triangle - ${intent.point}.`,
    `14-22s: Show the first signal entering the Artemis chain: ${source.signals[0]}.`,
    `22-34s: Transform signals into ${asset.output.toLowerCase()}.`,
    `34-46s: Reveal decision value for ${audience.toLowerCase()} users.`,
    `46-55s: Display limitation and review gate: ${source.boundary}`,
  ];

  const movieBeats = [
    `Act I - Signal: ${source.sourceSet[0]} becomes the opening object of attention.`,
    `Act II - System: ${source.signals.slice(1, 4).join(", ")} connect into a controlled Artemis workflow.`,
    `Act III - Proof: the output becomes ${asset.output.toLowerCase()}`,
    `Act IV - Governance: public-safe limits are made visible before the final call-to-action.`,
  ];

  const base = source.id.length + assetType.length + boundedIntensity * 7;
  const plotPoints = source.signals.slice(0, 5).map((signal, index) => ({
    label: signal,
    value: 38 + ((base + index * 13) % 58),
  }));

  const soundCue = [
    `${boundedIntensity >= 4 ? "92" : "72"} BPM`,
    "low analog pulse",
    "brushed-metal ticks",
    "soft sub impact on decision reveal",
    source.id === "turkiye-atlas" ? "distant terrain wind and hand-drum texture" : "cyan scan shimmer",
    "no melodramatic trailer boom; keep executive restraint",
  ].join(" · ");

  return {
    title: `ArtemisIX19 ${asset.label} Package`,
    sourceTitle: source.title,
    assetLabel: asset.label,
    audience,
    privacy,
    intensity: boundedIntensity,
    prompt,
    imagePrompt,
    renderPlan,
    storyboard,
    movieBeats,
    plotPoints,
    soundCue,
    categories: {
      promptCategory: pick(promptCategories, categorySeed),
      movieCategory: selectedMovieCategory,
      timeEraCategory: selectedEraCategory,
      renderType: selectedRenderType,
      styleType: selectedStyleType,
      videoPrompt: `Create a ${selectedMovieCategory.toLowerCase()} in a ${selectedEraCategory} using ${selectedRenderType.toLowerCase()} language, ${selectedStyleType}, and a final triangle convergence around ${intent.point}.`,
      solutionCategory: intent.label,
      publicRevenueIdea: terrain.revenueIdea,
    },
    convergence: {
      clickPath: [
        `1. ${intent.label}`,
        `2. ${terrain.label}`,
        `3. Triangle ${triangleLocked ? "locked" : "ready"}`,
      ],
      triangleState,
      imageState: `${source.title} changes into ${intent.visualState}.`,
      projectPoint: intent.point,
      purpose: intent.purpose,
      meaning: intent.meaning,
    },
    manifest: {
      version: "ArtemisIX19-v2",
      route: "/labs/artemisix19",
      generatedBy: "Autonomous in-browser rules engine",
      publicBoundary: source.boundary,
      sourceSignals: source.signals,
      exportTypes: artemisIX19AssetProfiles.map((profile) => profile.id),
      solutionIntent: intent.id,
      solutionTerrain: terrain.id,
      triangleLocked,
    },
  };
}

export function formatArtemisIX19Markdown(
  generated: ArtemisIX19GeneratedPackage,
  dailyStream?: ArtemisIX19DailyStream,
) {
  const lines = [
    `# ${generated.title}`,
    "",
    `Source: ${generated.sourceTitle}`,
    `Asset: ${generated.assetLabel}`,
    `Audience: ${generated.audience}`,
    `Visibility: ${generated.privacy}`,
    `Intensity: ${generated.intensity}`,
    `Version: ${generated.manifest.version}`,
    "",
    "## Triangle Convergence",
    "",
    generated.convergence.triangleState,
    "",
    `- Project point: ${generated.convergence.projectPoint}`,
    `- Purpose: ${generated.convergence.purpose}`,
    `- Meaning: ${generated.convergence.meaning}`,
    `- Image state: ${generated.convergence.imageState}`,
    "",
    "## Category Stack",
    "",
    `- Prompt category: ${generated.categories.promptCategory}`,
    `- Movie category: ${generated.categories.movieCategory}`,
    `- Time / era: ${generated.categories.timeEraCategory}`,
    `- Render type: ${generated.categories.renderType}`,
    `- Style type: ${generated.categories.styleType}`,
    `- Solution category: ${generated.categories.solutionCategory}`,
    `- Public revenue idea: ${generated.categories.publicRevenueIdea}`,
    "",
    "## Master Prompt",
    "",
    "```text",
    generated.prompt,
    "```",
    "",
    "## Image Prompt",
    "",
    generated.imagePrompt,
    "",
    "## Video Prompt",
    "",
    generated.categories.videoPrompt,
    "",
    "## Render Plan",
    "",
    ...generated.renderPlan.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Storyboard",
    "",
    ...generated.storyboard.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Movie Beats",
    "",
    ...generated.movieBeats.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Signal Plot",
    "",
    ...generated.plotPoints.map((point) => `- ${point.label}: ${point.value}`),
    "",
    "## Sound Cue",
    "",
    generated.soundCue,
    "",
    "## Boundary",
    "",
    generated.manifest.publicBoundary,
  ];

  if (dailyStream) {
    lines.push(
      "",
      `## Daily Flow ${dailyStream.dateKey}`,
      "",
      `### ${dailyStream.essayTitle}`,
      "",
      dailyStream.essay,
      "",
      `- ${dailyStream.updateTitle}: ${dailyStream.update}`,
      `- Daily quote: ${dailyStream.quote}`,
      `- Daily stoic cartoon prompt: ${dailyStream.stoicCartoon}`,
      `- Daily question: ${dailyStream.question}`,
      `- Daily irony: ${dailyStream.irony}`,
      `- Daily observation: ${dailyStream.observation}`,
      `- Daily public revenue generator idea: ${dailyStream.publicRevenueIdea}`,
      "",
      "## Alternative Solutions 4 x 4",
      "",
      ...dailyStream.alternatives.flatMap((quadrant) => [
        `### ${quadrant.quadrant}`,
        "",
        ...quadrant.examples.map((example) => `- ${example}`),
        "",
      ]),
    );
  }

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
