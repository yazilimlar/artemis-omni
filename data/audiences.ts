export const audienceSlugs = [
  "contractors",
  "manufacturers",
  "ceos",
  "executives",
  "holdings",
  "project-managers",
  "operations-executives",
  "board-teams",
  "cfos",
  "engineers",
  "technicians",
  "crews",
  "professionals",
  "auditors",
  "students",
  "small-business",
  "enterprise",
] as const;

export type AudienceSlug = (typeof audienceSlugs)[number];

export type AudiencePage = {
  slug: AudienceSlug;
  label: string;
  headline: string;
  summary: string;
  painPoints: string[];
  connects: string[];
  pathway: string[];
  proofModuleSlugs: string[];
  outcomes: string[];
  cta: string;
};

const implementationPathway = [
  "Diagnose the operating workflow and identify the highest-value decision loop.",
  "Map the source systems, documents, models, and human review gates.",
  "Build a controlled prototype with synthetic or approved data before any private rollout.",
  "Train the team, measure adoption, and convert the prototype into an operating cadence.",
];

export const audiences: AudiencePage[] = [
  {
    slug: "contractors",
    label: "Contractors",
    headline: "Turn field production into a cash-aware project controls system.",
    summary:
      "Artemis helps contractors connect estimates, field progress, actual cost, change exposure, and billing so executives can see where projects are moving before month-end reporting catches up.",
    painPoints: [
      "Forecasts lag the field and arrive after corrective action gets expensive.",
      "Production, cost, and billing data live in separate tools and spreadsheets.",
      "PM judgment is valuable but hard to compare against actuals and system-generated projections.",
    ],
    connects: [
      "Bid estimate and schedule baseline",
      "Field production and installed quantities",
      "Actual cost, billing revenue, and change exposure",
      "PM forecast, system projections, and executive action logs",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "utility-intelligence-bridge",
      "forecast-exposure-control-center",
      "artemis-workbench-shell",
    ],
    outcomes: [
      "Earlier visibility into margin and cashflow movement.",
      "Cleaner executive review meetings with source-labeled assumptions.",
      "A repeatable field-to-finance bridge for pilot projects.",
    ],
    cta: "Request a contractor pilot",
  },
  {
    slug: "manufacturers",
    label: "Manufacturers",
    headline: "Connect production fundamentals to forecast, quality, and revenue decisions.",
    summary:
      "For manufacturers, Artemis frames AI implementation around the operating chain: demand, production, inventory, quality, cost, and customer commitments.",
    painPoints: [
      "Production issues are visible locally but not translated into financial exposure quickly enough.",
      "Planning, shop-floor, quality, and commercial data often require manual reconciliation.",
      "AI pilots stall when they are not tied to an operating decision.",
    ],
    connects: [
      "Demand signals and production schedule",
      "Inventory, quality exceptions, and rework",
      "Labor, materials, throughput, and actual cost",
      "Revenue commitments, risk, and executive action",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "forecast-exposure-control-center",
      "system-graphics-library",
      "artemis-workbench-shell",
    ],
    outcomes: [
      "A sharper view of schedule and cost exposure.",
      "Better translation between operations, finance, and commercial teams.",
      "A practical prototype path before systems integration.",
    ],
    cta: "Scope a manufacturing implementation pilot",
  },
  {
    slug: "ceos",
    label: "CEOs",
    headline: "Make AI implementation accountable to business fundamentals.",
    summary:
      "Artemis gives CEOs a disciplined path from AI interest to implementation: pick the decision loop, connect the evidence, govern the outputs, and measure adoption.",
    painPoints: [
      "AI experiments create activity without changing operating performance.",
      "Executives cannot see which workflows are ready for AI-enabled implementation.",
      "Teams need a credible bridge between strategy, operations, and system delivery.",
    ],
    connects: [
      "Strategic priorities",
      "Operating bottlenecks",
      "Financial and delivery signals",
      "Governance, training, and adoption metrics",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "diana-moonshot-brand-experience",
      "forecast-exposure-control-center",
    ],
    outcomes: [
      "A concrete AI implementation agenda.",
      "Clearer executive sponsorship and adoption checkpoints.",
      "Reduced risk of disconnected AI tooling.",
    ],
    cta: "Request an executive implementation session",
  },
  {
    slug: "executives",
    label: "Executives",
    headline: "See the operating picture before the report becomes history.",
    summary:
      "Artemis turns disconnected project, operational, and financial signals into an executive action layer with assumptions, confidence notes, and review gates.",
    painPoints: [
      "Executive dashboards summarize the past instead of surfacing current decisions.",
      "Forecasts lack confidence ranges and traceable assumptions.",
      "Leadership reviews spend too much time reconciling numbers.",
    ],
    connects: [
      "Operating metrics",
      "Forecast deltas",
      "Risk and opportunity registers",
      "Decision owners and action logs",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "forecast-exposure-control-center",
      "utility-intelligence-bridge",
      "system-graphics-library",
    ],
    outcomes: [
      "Faster decision cycles.",
      "More explicit assumptions and confidence levels.",
      "A clearer path from signal to action.",
    ],
    cta: "Request an executive pilot",
  },
  {
    slug: "holdings",
    label: "Holdings",
    headline: "Create a portfolio operating layer without flattening every company.",
    summary:
      "Artemis helps holding companies standardize executive visibility across operating companies while respecting local systems, workflows, and ownership.",
    painPoints: [
      "Portfolio companies report differently, making cross-company comparisons slow.",
      "Operating risk is discovered late because signals are not normalized.",
      "Central teams need oversight without forcing one brittle system on every business.",
    ],
    connects: [
      "Company-level KPIs",
      "Cashflow, cost, and revenue signals",
      "Operational risks and escalations",
      "Portfolio governance and action cadence",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "forecast-exposure-control-center",
      "artemis-workbench-shell",
    ],
    outcomes: [
      "Comparable operating views across companies.",
      "Earlier risk escalation.",
      "A repeatable implementation pattern for portfolio pilots.",
    ],
    cta: "Map a portfolio pilot",
  },
  {
    slug: "project-managers",
    label: "Project Managers",
    headline: "Connect daily project reality to forecast, billing, and risk.",
    summary:
      "Artemis gives project managers a structured bridge from field status and PM judgment to cashflow, exposure, and executive review.",
    painPoints: [
      "PM forecasts are trapped in spreadsheets or narrative updates.",
      "Risk and opportunity registers are not tied cleanly to cost and schedule movement.",
      "Executive meetings require manual reconciliation before decisions can happen.",
    ],
    connects: [
      "Schedule status",
      "Installed quantities",
      "Actual cost and change exposure",
      "PM forecast and system-generated projections",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "utility-intelligence-bridge",
      "artemis-workbench-shell",
      "geometry-qa-plan-editing-sandbox",
    ],
    outcomes: [
      "A cleaner operating cadence.",
      "More defensible forecasts.",
      "Less manual translation between field, finance, and executives.",
    ],
    cta: "Request a project controls pilot",
  },
  {
    slug: "operations-executives",
    label: "Operations Executives",
    headline: "Turn operating variance into a governed action system.",
    summary:
      "Artemis helps operations leaders connect production, capacity, cost, schedule, and risk into one reviewable decision layer.",
    painPoints: [
      "Operating variance is visible, but commercial impact is delayed.",
      "Teams disagree because each function sees a different data slice.",
      "Improvement work loses momentum without a shared operating cadence.",
    ],
    connects: [
      "Production and capacity signals",
      "Cost, schedule, and revenue movement",
      "Risk, opportunity, and owner decisions",
      "Training, governance, and adoption metrics",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "forecast-exposure-control-center",
      "utility-intelligence-bridge",
      "system-graphics-library",
    ],
    outcomes: [
      "Earlier variance response.",
      "More disciplined cross-functional review.",
      "A path from pilot workflow to operating system.",
    ],
    cta: "Scope an operations pilot",
  },
  {
    slug: "board-teams",
    label: "Board Teams",
    headline: "Give board oversight a clearer view of execution risk.",
    summary:
      "Artemis frames AI implementation and operating visibility in terms board teams can interrogate: sources, logic, review gates, confidence, and limitations.",
    painPoints: [
      "Board materials compress complex operational risk into late-stage summaries.",
      "AI initiatives are hard to evaluate without governance and measurable adoption.",
      "Forecasts often hide the assumptions that matter most.",
    ],
    connects: [
      "Strategic objectives",
      "Operating KPIs",
      "Financial exposure",
      "Governance, assumptions, and action status",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "forecast-exposure-control-center",
      "diana-moonshot-brand-experience",
    ],
    outcomes: [
      "Better oversight questions.",
      "Clearer visibility into execution risk.",
      "A safer framework for AI-enabled operating systems.",
    ],
    cta: "Prepare a board-ready implementation brief",
  },
  {
    slug: "cfos",
    label: "CFOs",
    headline: "Connect operational movement to forecast confidence and cashflow.",
    summary:
      "Artemis helps CFOs see where operating reality is changing cost, billing, revenue, and cash timing before finance has to reconstruct the story after close.",
    painPoints: [
      "Cashflow exposure is discovered after operations have already moved.",
      "Forecast updates do not explain confidence, assumptions, or owner action.",
      "Finance teams spend too much time reconciling operational sources.",
    ],
    connects: [
      "Actual cost",
      "Billing revenue",
      "Change exposure",
      "Forecast range, cash timing, and assumptions",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "forecast-exposure-control-center",
      "model-to-money-inspector",
      "artemis-workbench-shell",
    ],
    outcomes: [
      "More defensible forecast reviews.",
      "Earlier cashflow risk detection.",
      "Clearer reconciliation between operations and finance.",
    ],
    cta: "Request a finance-facing pilot",
  },
  {
    slug: "engineers",
    label: "Engineers",
    headline: "Carry engineering context into project-controls decisions.",
    summary:
      "Artemis helps engineering teams show how geometry, constraints, QA findings, and revisions affect quantities, schedule, cost, and executive action.",
    painPoints: [
      "Engineering issues become commercial issues after too much context is lost.",
      "Model and plan changes are hard to trace into cost and schedule exposure.",
      "QA exceptions need clearer human review and decision paths.",
    ],
    connects: [
      "Design and geometry",
      "Quantities and model QA",
      "Schedule and field production",
      "Cost, risk, and approval gates",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "model-to-money-inspector",
      "geometry-qa-plan-editing-sandbox",
      "geodesic-intelligence-workbench",
    ],
    outcomes: [
      "Better engineering-to-commercial traceability.",
      "More controlled QA workflows.",
      "Clearer communication with project controls and executives.",
    ],
    cta: "Explore an engineering intelligence pilot",
  },
  {
    slug: "technicians",
    label: "Technicians",
    headline: "Turn field and technical observations into reviewable signals.",
    summary:
      "Artemis can help technicians structure observations, exceptions, quantities, and QA notes so the rest of the system can act on them.",
    painPoints: [
      "Important field details remain trapped in notes, photos, and messages.",
      "Technical exceptions are hard to escalate with context and confidence.",
      "Teams need simple review paths, not another disconnected reporting burden.",
    ],
    connects: [
      "Field observations",
      "QA notes and exceptions",
      "Work package context",
      "Review status and downstream cost or schedule impact",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "geometry-qa-plan-editing-sandbox",
      "geodesic-intelligence-workbench",
      "artemis-workbench-shell",
    ],
    outcomes: [
      "More usable field intelligence.",
      "Clearer escalation paths.",
      "Better continuity between technical review and project controls.",
    ],
    cta: "Design a technician workflow pilot",
  },
  {
    slug: "crews",
    label: "Crews",
    headline: "Make production signals easier to capture and easier to trust.",
    summary:
      "Artemis frames crew-facing workflows around simple production, constraint, and exception signals that can flow into project controls without overloading field teams.",
    painPoints: [
      "Crew progress and constraints are often translated several times before executives see them.",
      "Field teams need lightweight workflows that respect the workday.",
      "Production signals lose value when they are not tied to quantities, schedule, and cost.",
    ],
    connects: [
      "Daily production",
      "Constraints and blockers",
      "Installed quantities",
      "Schedule, cost, and forecast impact",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "utility-intelligence-bridge",
      "artemis-workbench-shell",
      "geodesic-intelligence-workbench",
    ],
    outcomes: [
      "Cleaner production visibility.",
      "Less manual re-entry of field status.",
      "A better line from crew reality to project decisions.",
    ],
    cta: "Scope a field production pilot",
  },
  {
    slug: "professionals",
    label: "Professionals",
    headline: "Convert expert judgment into structured implementation systems.",
    summary:
      "Artemis helps professional teams turn judgment, documents, workflows, and review gates into AI-enabled systems that preserve accountability.",
    painPoints: [
      "Expert judgment is valuable but hard to scale without losing context.",
      "Documents and spreadsheets become operating systems by accident.",
      "AI tools need governance, training, and workflow design to matter.",
    ],
    connects: [
      "Documents and process knowledge",
      "Review gates and approvals",
      "Operating metrics",
      "Client or executive deliverables",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "artemis-workbench-shell",
      "diana-moonshot-brand-experience",
    ],
    outcomes: [
      "More repeatable expert workflows.",
      "Clearer source-labeled outputs.",
      "A practical AI implementation roadmap.",
    ],
    cta: "Map a professional workflow pilot",
  },
  {
    slug: "auditors",
    label: "Auditors",
    headline: "Make AI-enabled outputs reviewable, sourced, and bounded.",
    summary:
      "Artemis treats auditability as part of implementation: source labels, assumptions, human review gates, confidence notes, and limitation language.",
    painPoints: [
      "AI-generated work can be hard to inspect without source and review discipline.",
      "Operational forecasts often hide assumptions and manual transformations.",
      "Teams need clear boundaries before automated support enters review workflows.",
    ],
    connects: [
      "Source systems",
      "Transformation logic",
      "Human review",
      "Trusted outputs, exceptions, and limitations",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "model-to-money-inspector",
      "forecast-exposure-control-center",
    ],
    outcomes: [
      "More inspectable implementation artifacts.",
      "Clearer human review and exception handling.",
      "A safer governance posture for AI-enabled workflows.",
    ],
    cta: "Review an audit-aware pilot model",
  },
  {
    slug: "students",
    label: "Students",
    headline: "Learn how AI implementation connects fundamentals to execution.",
    summary:
      "Artemis gives students a concrete way to understand AI in operations: not as a replacement for fundamentals, but as a system that amplifies disciplined workflows.",
    painPoints: [
      "AI education can stay abstract without real operating examples.",
      "Students need to see how engineering, finance, operations, and governance connect.",
      "Career-ready AI literacy requires implementation thinking.",
    ],
    connects: [
      "Project fundamentals",
      "Data and document workflows",
      "Human review and governance",
      "Decision outcomes",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "artemis-workbench-shell",
      "diana-moonshot-brand-experience",
    ],
    outcomes: [
      "Better implementation literacy.",
      "Clearer understanding of source, logic, and review.",
      "A practical vocabulary for AI-enabled work.",
    ],
    cta: "Explore the Artemis learning pathway",
  },
  {
    slug: "small-business",
    label: "Small Business",
    headline: "Build the first useful AI operating layer without overbuilding.",
    summary:
      "Artemis helps small businesses start with one painful workflow, connect the right sources, and create a governed prototype before committing to larger systems.",
    painPoints: [
      "AI tools create scattered experiments instead of dependable workflows.",
      "Owners need practical automation without enterprise implementation overhead.",
      "Small teams cannot afford opaque systems or fragile handoffs.",
    ],
    connects: [
      "Core workflow documents",
      "Customer, operations, and finance signals",
      "Review gates and owner decisions",
      "Pilot metrics and next implementation step",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "artemis-workbench-shell",
      "system-graphics-library",
      "forecast-exposure-control-center",
    ],
    outcomes: [
      "A focused first AI implementation pilot.",
      "Clear owner control and review.",
      "A path to scale only after usefulness is proven.",
    ],
    cta: "Start a small-business pilot",
  },
  {
    slug: "enterprise",
    label: "Enterprise",
    headline: "Pilot AI-enabled execution without bypassing governance.",
    summary:
      "For enterprise teams, Artemis supports controlled implementation: scoped workflows, source mapping, governance boundaries, training, and proof before rollout.",
    painPoints: [
      "Enterprise AI work stalls between experimentation, compliance, and adoption.",
      "Large systems contain useful signals but require controlled integration.",
      "Teams need credible pilots that can survive procurement and governance review.",
    ],
    connects: [
      "Systems of record",
      "Documents and models",
      "Governance and approval gates",
      "Operating metrics and rollout decisions",
    ],
    pathway: implementationPathway,
    proofModuleSlugs: [
      "system-graphics-library",
      "forecast-exposure-control-center",
      "utility-intelligence-bridge",
    ],
    outcomes: [
      "A governed pilot architecture.",
      "Clear integration and adoption checkpoints.",
      "Reusable patterns for future workflow implementations.",
    ],
    cta: "Design an enterprise pilot",
  },
];

export const featuredAudienceSlugs: AudienceSlug[] = [
  "contractors",
  "executives",
  "project-managers",
  "cfos",
  "engineers",
  "enterprise",
];

export function getAudiencePage(slug: string) {
  return audiences.find((audience) => audience.slug === slug);
}

export function getFeaturedAudiences() {
  return featuredAudienceSlugs
    .map((slug) => getAudiencePage(slug))
    .filter((audience): audience is AudiencePage => Boolean(audience));
}
