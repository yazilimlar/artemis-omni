import type { StatusTone } from "@/data/proofLibrary";

export type InsightPipelineStage = {
  title: string;
  summary: string;
  artifact: string;
};

export type InsightTopic = {
  title: string;
  signal: string;
  articleAngle: string;
  visual: string;
};

export type InsightAudience = {
  group: string;
  learns: string;
  outcome: string;
};

export type InsightFormat = {
  title: string;
  cadence: string;
  description: string;
  checks: string[];
};

export type LearningSource = {
  title: string;
  status: string;
  tone: StatusTone;
  pattern: string;
  publishRule: string;
};

export type ContractReasoningMode = {
  title: string;
  method: string;
  contractUse: string;
  aiRole: string;
};

export type ClaimControlGate = {
  title: string;
  checks: string;
  output: string;
};

export type PresentationAssignment = {
  title: string;
  pseudoName: string;
  status: string;
  tone: StatusTone;
  sourcePattern: string;
  presentationUse: string;
  publicRule: string;
};

export const insightPipeline: InsightPipelineStage[] = [
  {
    title: "Capture",
    summary:
      "Collect field notes, controls logs, procurement events, payment records, and document signals as source material.",
    artifact: "Source register",
  },
  {
    title: "Normalize",
    summary:
      "Translate messy project language into consistent topics, roles, dates, quantities, risks, costs, and open questions.",
    artifact: "Semantic brief",
  },
  {
    title: "Sanitize",
    summary:
      "Remove client names, project identifiers, coordinates, private correspondence, live disputes, and sensitive commercial detail.",
    artifact: "Public-safe draft set",
  },
  {
    title: "Interpret",
    summary:
      "Use AI as a review board for hidden assumptions, caveats, counterexamples, and practical implementation lessons.",
    artifact: "Insight memo",
  },
  {
    title: "Visualize",
    summary:
      "Convert the idea into diagrams, dashboards, timeline strips, flow maps, checklists, and cinematic story panels.",
    artifact: "Visual kit",
  },
  {
    title: "Review",
    summary:
      "Run human review for accuracy, confidentiality, safety, legal/financial boundaries, and public usefulness.",
    artifact: "Approval note",
  },
  {
    title: "Publish",
    summary:
      "Release the article, tutorial, or graphic as educational material with clear boundaries and source limitations.",
    artifact: "Public article",
  },
  {
    title: "Learn",
    summary:
      "Track questions and reuse reader feedback to improve future explainers, tools, and Artemis implementation playbooks.",
    artifact: "Backlog item",
  },
];

export const insightTopics: InsightTopic[] = [
  {
    title: "Safety Stories",
    signal: "Near misses, hazards, access constraints, method changes, and supervision notes.",
    articleAngle: "What the event teaches teams before the next shift starts.",
    visual: "Hazard path diagram with prevention gates.",
  },
  {
    title: "Delay + Claim Management",
    signal: "Notice dates, critical-path movement, field evidence, photos, diaries, RFIs, and owner direction.",
    articleAngle: "How to separate facts, entitlement, causation, and quantum before positions harden.",
    visual: "Timeline with evidence pins and decision gates.",
  },
  {
    title: "Change Orders",
    signal: "Scope deltas, drawing revisions, T&M tickets, unit rates, quotes, and approval status.",
    articleAngle: "How change work moves from field event to auditable commercial record.",
    visual: "Change-order lifecycle strip.",
  },
  {
    title: "Value Engineering + Design Changes",
    signal: "Alternates, redesign concepts, lifecycle tradeoffs, constructability notes, and cost exposure.",
    articleAngle: "How a design change can improve value only when assumptions stay visible.",
    visual: "Tradeoff matrix: cost, time, risk, quality.",
  },
  {
    title: "Procurement + Equipment Rentals",
    signal: "Lead times, rental logs, standby exposure, vendor quotes, delivery windows, and utilization.",
    articleAngle: "How procurement slippage becomes production loss and cash timing pressure.",
    visual: "Procurement-to-production dependency map.",
  },
  {
    title: "Crews, Subcontractors + Labor",
    signal: "Union crews, subcontractor commitments, productivity, access windows, handoffs, and constraints.",
    articleAngle: "How crew logic connects schedule promise to actual field capacity.",
    visual: "Crew loading and constraint board.",
  },
  {
    title: "Permits, Submittals + RFIs",
    signal: "Open review cycles, response aging, approval dependencies, and specification gaps.",
    articleAngle: "How document latency becomes field and commercial exposure.",
    visual: "Document aging heatmap.",
  },
  {
    title: "Payments, Logs + Accruals",
    signal: "Payment applications, reconciliation logs, receipts, accruals, retainage, and billing status.",
    articleAngle: "How to keep cash, revenue, cost, and evidence from drifting apart.",
    visual: "Payment reconciliation bridge.",
  },
];

export const insightAudiences: InsightAudience[] = [
  {
    group: "CEOs, COOs, Board Teams + Investors",
    learns:
      "How operational facts turn into strategic risk, cash pressure, growth constraints, and implementation priorities.",
    outcome: "Sharper executive action without requiring everyone to read raw project logs.",
  },
  {
    group: "CFOs, Accountants + Admins",
    learns:
      "How payment logs, receipts, accruals, billing status, and cost exposure connect to project reality.",
    outcome: "Cleaner reconciliation conversations and fewer late surprises.",
  },
  {
    group: "Project Managers + Supervision Teams",
    learns:
      "How RFIs, submittals, field diaries, safety events, T&M tickets, and change work become decision records.",
    outcome: "More disciplined escalation and better daily-to-monthly translation.",
  },
  {
    group: "Architects, Engineers + Builders",
    learns:
      "How design intent, constructability, quantities, cost, schedule, and field feedback stay linked.",
    outcome: "Better revision decisions and clearer implementation consequences.",
  },
  {
    group: "Subcontractors, Small Companies + Crews",
    learns:
      "How to explain field constraints, document work cleanly, protect payment paths, and use AI without losing control.",
    outcome: "Practical operating habits that can scale without enterprise overhead.",
  },
  {
    group: "Agencies, Technicians + Individuals",
    learns:
      "How Artemis turns public-safe examples into training material, checklists, visuals, and repeatable methods.",
    outcome: "Accessible education without exposing private disputes or raw project data.",
  },
];

export const insightFormats: InsightFormat[] = [
  {
    title: "Executive Field Brief",
    cadence: "Weekly",
    description:
      "A short article that converts field activity, open decisions, and risk movement into executive language.",
    checks: ["No private identifiers", "Decision required is explicit", "Assumptions are labeled"],
  },
  {
    title: "Claim + Delay Clinic",
    cadence: "Biweekly",
    description:
      "A structured explanation of notice, causation, evidence, schedule logic, and commercial posture using synthetic examples.",
    checks: ["No legal advice", "Evidence categories only", "Dates and facts are illustrative"],
  },
  {
    title: "Payment Reconciliation Note",
    cadence: "Monthly",
    description:
      "A practical guide to matching payment applications, receipts, accruals, logs, and cost/revenue status.",
    checks: ["No real account data", "No financial advice", "Controls and caveats visible"],
  },
  {
    title: "AI Prompt Vault Lesson",
    cadence: "Series",
    description:
      "A reproducible prompt-and-review module that shows how multiple AI models critique the same problem from different roles.",
    checks: ["Human signs the synthesis", "Model roles are distinct", "Protected logic is not rewritten silently"],
  },
  {
    title: "Cinematic Systems Story",
    cadence: "Campaign",
    description:
      "A narrated, visual article with diagrams, dashboard motifs, and storyboard beats inspired by the masterclass reference format.",
    checks: ["No raw HTML embeds", "Visuals explain system logic", "Boundary language remains visible"],
  },
  {
    title: "Implementation Playbook",
    cadence: "Evergreen",
    description:
      "A reusable guide that turns one operating problem into process, data model, review gate, and improvement loop.",
    checks: ["Audience is named", "Workflow is reproducible", "Expected outcomes avoid overclaiming"],
  },
];

export const contractReasoningModes: ContractReasoningMode[] = [
  {
    title: "Deductive",
    method: "Start from the agreement, specifications, procedures, notice clauses, and stated responsibilities.",
    contractUse:
      "Extract requirements, deadlines, approval paths, notice triggers, entitlement tests, and responsible parties.",
    aiRole:
      "Multiple models check clause interpretation, missing prerequisites, and whether the proposed action follows the contract logic.",
  },
  {
    title: "Inductive",
    method: "Read the pattern across RFIs, submittals, changes, diaries, payment logs, delays, and correspondence.",
    contractUse:
      "Detect repeated review bottlenecks, evidence clusters, aging issues, productivity impacts, and recurring commercial exposure.",
    aiRole:
      "Models compare records, rank signals, and surface patterns that a project team may not see from one document at a time.",
  },
  {
    title: "Abductive",
    method: "When the facts are incomplete, generate the most plausible explanations and the evidence needed to test them.",
    contractUse:
      "Frame claim hypotheses, causation questions, missing records, alternative explanations, and next required actions.",
    aiRole:
      "Models propose competing hypotheses, challenge weak evidence, and keep uncertainty visible until humans verify the record.",
  },
];

export const claimControlGates: ClaimControlGate[] = [
  {
    title: "Agreement Basis",
    checks: "Which article, specification, drawing, procedure, or direction creates the requirement?",
    output: "Contract basis note",
  },
  {
    title: "Responsibility Map",
    checks: "Who must act, approve, respond, document, pay, notify, mitigate, or preserve rights?",
    output: "Responsibility matrix",
  },
  {
    title: "Rights Trigger",
    checks: "What notice, reservation, change, delay, T&M, or payment right must be initiated timely?",
    output: "Action trigger",
  },
  {
    title: "Evidence Linkage",
    checks: "Which RFIs, submittals, diaries, letters, photos, payment logs, and records support or contradict the issue?",
    output: "Evidence bundle",
  },
  {
    title: "Impact Test",
    checks: "Does the issue affect time, cost, productivity, cash, billing, procurement, safety, or access?",
    output: "Impact memo",
  },
  {
    title: "Human Authorization",
    checks: "Who signs the action, what caveats remain, and what cannot be represented as final advice?",
    output: "Reviewed instruction",
  },
];

export const presentationAssignments: PresentationAssignment[] = [
  {
    title: "Private delay/claim dashboard reference",
    pseudoName: "Contract Evidence Control Center",
    status: "Private demo reference",
    tone: "private",
    sourcePattern:
      "Dashboard-style linkage of delay events, potential damages, RFIs, document evidence, confidence labels, and narrative support.",
    presentationUse:
      "Use as a presentation story for contract-reasoning controls: agreement requirements, timely rights, responsibility mapping, evidence linkage, and multi-model review.",
    publicRule:
      "Do not publish raw records, source HTML, claim names, project identifiers, dates, dollar values, document paths, or dispute narratives.",
  },
  {
    title: "Private utility parametric workbench reference",
    pseudoName: "Utility Parametric 5D Workbench",
    status: "Private demo reference",
    tone: "private",
    sourcePattern:
      "Parametric utility model with 3D model controls, standards library, 4D planning controls, 5D earned-value logic, and cost-code mapping.",
    presentationUse:
      "Use as a visual demonstration of how design, geometry, standards, schedule, quantities, cost codes, and PM controls can be narrated as one implementation system.",
    publicRule:
      "Do not publish raw source HTML, agency labels, utility standards, private model logic, cost-code mappings, or project-specific parameters.",
  },
  {
    title: "Private control-budget audit reference",
    pseudoName: "Control Budget Audit Studio",
    status: "Private demo reference",
    tone: "private",
    sourcePattern:
      "Budget intelligence interface with audit trail, budget split, component breakdown, bid-item ranking, and commercial-control views.",
    presentationUse:
      "Use as a presentation story for executive budget governance: source of truth, component traceability, auditability, and model-to-money review.",
    publicRule:
      "Do not publish raw budget data, person names, project identifiers, bid items, audit records, dollar values, or source HTML.",
  },
  {
    title: "Private field-story ecosystem reference",
    pseudoName: "Field Production Story Theater",
    status: "Private visual reference",
    tone: "private",
    sourcePattern:
      "Interactive field narrative with mission framing, infrastructure context, stakeholder education, and blue engineering ecosystem visuals.",
    presentationUse:
      "Use as a format model for cinematic public education: field story, stakeholder map, engineering logic, and implementation lessons without revealing source records.",
    publicRule:
      "Do not publish raw field-story HTML, project names, organization names, site history, visit details, or embedded private narrative content.",
  },
  {
    title: "Private forecast matrix reference",
    pseudoName: "Forecast Exposure Matrix",
    status: "Private demo reference",
    tone: "private",
    sourcePattern:
      "Forecast matrix dashboard with executive rules, exposure ranges, design logic, and PM forecast-to-budget comparison patterns.",
    presentationUse:
      "Use as the public-safe backbone for explaining forecast exposure, confidence ranges, cash timing, and executive escalation rules.",
    publicRule:
      "Do not publish raw forecast data, project identifiers, budget labels, exposure values, source formulas, or source HTML.",
  },
  {
    title: "Private category-risk lens reference",
    pseudoName: "Category Risk Ownership Lens",
    status: "Private demo reference",
    tone: "private",
    sourcePattern:
      "Risk lens extension for winners, losers, category ownership, delta audit, and exposure classification across commercial categories.",
    presentationUse:
      "Use as a sharper executive narrative for who owns the risk, which category moved, why it moved, and what decision is required next.",
    publicRule:
      "Do not publish raw category data, risk ownership labels tied to real parties, project identifiers, exposure values, or source HTML.",
  },
];

export const learningSources: LearningSource[] = [
  {
    title: "Multimodel 5D Masterclass",
    status: "Private source reference",
    tone: "private",
    pattern:
      "Module progression, live sandbox, prompt vault, QA harness, video prompts, and export discipline.",
    publishRule:
      "Use as method inspiration only; do not publish raw case-study labels, source HTML, or project-specific examples.",
  },
  {
    title: "Multimodel 5D Tutorial Series",
    status: "Sanitize before extraction",
    tone: "sanitize",
    pattern:
      "Bilingual EN/TR tutorial flow, scripted narration, storyboard beats, and multi-AI synthesis method.",
    publishRule:
      "Extract public-safe lesson formats and replace project-specific references with generic teaching scenarios.",
  },
  {
    title: "Multimodel 5D Changelog",
    status: "Reference discipline",
    tone: "reference",
    pattern:
      "Version notes, QA improvements, live mini-model evolution, and release-readiness evidence.",
    publishRule:
      "Convert into Artemis changelog doctrine for public features, not a dump of internal development notes.",
  },
];
