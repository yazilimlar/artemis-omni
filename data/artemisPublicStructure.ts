export type PublicRecordState = "current" | "directional" | "historical";

export const artemisPublicStructure = {
  schemaVersion: 1,
  recordVersion: "2026.07.11",
  lastReviewed: "2026-07-11",
  title: "Artemis Evolution & Structure",
  statement:
    "Artemis is an AI-native, multi-division organization and product platform. Infrastructure and construction intelligence are flagship areas, but no single industry, product, route, branch, or testbed defines the complete Artemis identity.",
  interpretation: {
    current:
      "Verified current structure, public capability, or accepted operating principle.",
    directional:
      "An intended organizational or product direction. It is not a claim that a separate legal entity, staffed business unit, or production product already exists.",
    historical:
      "A dated milestone retained to explain how the platform evolved.",
  },
  divisions: [
    {
      id: "core-platform",
      name: "Artemis Core Platform",
      state: "current" as PublicRecordState,
      status: "Current foundation",
      mission:
        "Shared engineering, provenance, governance, design, data, security, and human-review capabilities used across Artemis.",
      examples: [
        "AIEOS governance and decision records",
        "Shared data, visualization, and export patterns",
        "Auditability, confidence, and human review controls",
      ],
    },
    {
      id: "infrastructure-construction",
      name: "Infrastructure & Construction",
      state: "current" as PublicRecordState,
      status: "Flagship public focus",
      mission:
        "Decision systems for public work, construction intelligence, utility work, project controls, cost, schedule, claims, cashflow, forecasting, and risk.",
      examples: ["CivicBid", "Utility Intelligence", "Construction Intelligence and 5D workflows"],
    },
    {
      id: "atlas-places",
      name: "Atlas & Places",
      state: "current" as PublicRecordState,
      status: "Active public labs",
      mission:
        "Geographic, cultural, historical, route, and place-based intelligence expressed through maps, timelines, evidence, and guided exploration.",
      examples: ["Türkiye Atlas", "Time Atlas", "Cultural and historical route systems"],
    },
    {
      id: "studio-media",
      name: "Studio & Media",
      state: "directional" as PublicRecordState,
      status: "Incubating",
      mission:
        "Visual generation, storytelling, product communication, media systems, and reusable creative production capabilities.",
      examples: ["Visual generation", "Narrative systems", "Public product communication"],
    },
    {
      id: "knowledge-academy",
      name: "Knowledge & Academy",
      state: "current" as PublicRecordState,
      status: "Active and expanding",
      mission:
        "Research, documentation, learning systems, public libraries, explainers, and durable institutional memory.",
      examples: ["Academy", "Library", "Evolution and architecture records"],
    },
    {
      id: "finance-decision-systems",
      name: "Finance & Decision Systems",
      state: "directional" as PublicRecordState,
      status: "Experimental public labs",
      mission:
        "Financial modeling, tax architecture, scenario analysis, forecasting, and evidence-based decision support.",
      examples: ["Finance architecture", "Tax architecture labs", "Scenario and risk analysis"],
    },
    {
      id: "natural-systems",
      name: "Natural Systems",
      state: "directional" as PublicRecordState,
      status: "Research and incubation",
      mission:
        "Structured knowledge, visual systems, and future tools related to botanical, environmental, and natural domains.",
      examples: ["Botanical knowledge systems", "Environmental visualization", "Research prototypes"],
    },
    {
      id: "artemis-labs",
      name: "Artemis Labs",
      state: "current" as PublicRecordState,
      status: "Cross-division incubator",
      mission:
        "A controlled place for experiments, testbeds, prototypes, comparisons, and public-safe demonstrations before product maturity is established.",
      examples: ["Experiments", "Testbeds", "Public-safe prototypes"],
    },
  ],
  operatingLoop: [
    {
      step: "Classify",
      detail:
        "Name the owning division, product, maturity, visibility, data mode, and public-safety boundary.",
    },
    {
      step: "Decide",
      detail:
        "Record architecture changes in an accepted decision record before implementation changes the system.",
    },
    {
      step: "Isolate",
      detail:
        "Use one scoped branch or worktree for one concern; preserve unrelated work and production stability.",
    },
    {
      step: "Build",
      detail:
        "Implement against repository truth, product registries, feature passports, and verified source material.",
    },
    {
      step: "Verify",
      detail:
        "Run typecheck, lint, build, security review, data-mode review, and any product-specific tests.",
    },
    {
      step: "Preview",
      detail:
        "Inspect the real deployed preview and the exact change set before promotion.",
    },
    {
      step: "Approve",
      detail:
        "Human review remains the final gate for public or production changes.",
    },
    {
      step: "Memorialize",
      detail:
        "Merge the reviewed change, update registries and evolution notes, and preserve the reason for the decision.",
    },
  ],
  branchLifecycle: [
    {
      name: "Experiment",
      state: "directional" as PublicRecordState,
      purpose: "Short-lived technical exploration that is never treated as production authority.",
    },
    {
      name: "Testbed",
      state: "current" as PublicRecordState,
      purpose:
        "Reusable capability trial. It remains preserved until useful capabilities are migrated, retained for testing, rejected, or archived with evidence.",
    },
    {
      name: "Feature or Product",
      state: "current" as PublicRecordState,
      purpose: "One isolated product concern developed and reviewed against the stable system.",
    },
    {
      name: "Rescue",
      state: "current" as PublicRecordState,
      purpose:
        "Selective extraction of valuable work from mixed or obsolete ancestry; donor branches are not merged wholesale.",
    },
    {
      name: "Governance",
      state: "current" as PublicRecordState,
      purpose: "Architecture, decision records, registries, standards, and operating rules only.",
    },
    {
      name: "Main",
      state: "current" as PublicRecordState,
      purpose:
        "The reviewed, deployable integration line. Product maturity is still determined by evidence, not merely by presence on main.",
    },
    {
      name: "Release or Archive",
      state: "directional" as PublicRecordState,
      purpose:
        "A dated checkpoint or preserved historical state with a documented supersession or retirement reason.",
    },
  ],
  recordLayers: [
    {
      name: "Engineering truth",
      audience: "Internal builders and reviewers",
      source: "Running code, tests, accepted decisions, registries, feature passports, and handovers",
      purpose: "The authoritative record used to build and govern Artemis.",
    },
    {
      name: "Public structure",
      audience: "Clients, collaborators, researchers, and the public",
      source: "This curated, versioned record",
      purpose:
        "A readable projection of verified structure and explicitly labeled direction without exposing sensitive operations.",
    },
    {
      name: "Evolution log",
      audience: "Future Artemis builders and interested readers",
      source: "Dated milestones and change notes",
      purpose: "Why major decisions were made, what changed, and what was superseded.",
    },
    {
      name: "Change trace",
      audience: "Authorized reviewers",
      source: "Pull requests, commits, automated checks, and preview deployments",
      purpose: "Who changed what, why it changed, how it was verified, and when it was promoted.",
    },
  ],
  milestones: [
    {
      date: "June 2026",
      state: "historical" as PublicRecordState,
      title: "Public platform foundation",
      detail:
        "Artemis consolidated around a versioned Next.js application, preview-first deployment, reusable routes, and public-safe demonstrations.",
    },
    {
      date: "June 2026",
      state: "historical" as PublicRecordState,
      title: "AIEOS governance foundation",
      detail:
        "Repository truth, accepted decisions, feature passports, session protocols, validation, and handover requirements became durable operating rules.",
    },
    {
      date: "July 2026",
      state: "current" as PublicRecordState,
      title: "Multi-division Artemis architecture",
      detail:
        "Artemis was formally defined as an umbrella organization and platform. Construction remains a flagship division rather than the boundary of the Artemis identity.",
    },
    {
      date: "Ongoing",
      state: "directional" as PublicRecordState,
      title: "Product-by-product maturation",
      detail:
        "Labs and testbeds are being evaluated individually, with explicit data modes, maturity labels, migration decisions, and public-safety gates.",
    },
  ],
  publicationBoundary: {
    publish: [
      "Accepted organizational and product structure",
      "Public product maturity and data-mode labels",
      "Verified public milestones and supersession reasons",
      "Operating principles, review gates, and public-safety commitments",
      "Review date and public record version",
    ],
    withhold: [
      "Credentials, tokens, environment contents, and security-sensitive configuration",
      "Private client, employee, financial, or operational data",
      "Unreleased donor-branch details and exact emergency rollback coordinates",
      "Unverified claims, confidential commercial strategy, and speculative promises",
      "Internal weaknesses whose publication would create avoidable security risk",
    ],
  },
} as const;

export type ArtemisPublicStructure = typeof artemisPublicStructure;
