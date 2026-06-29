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

export type AtelierSource = {
  title: string;
  status: string;
  tone: StatusTone;
  pattern: string;
  publishRule: string;
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
      "A narrated, visual article with diagrams, dashboard motifs, and storyboard beats inspired by the Atelier format.",
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

export const atelierSources: AtelierSource[] = [
  {
    title: "Multimodel Atelier 5D Masterclass",
    status: "Private source reference",
    tone: "private",
    pattern:
      "Module progression, live sandbox, prompt vault, QA harness, video prompts, and export discipline.",
    publishRule:
      "Use as method inspiration only; do not publish raw case-study labels, source HTML, or project-specific examples.",
  },
  {
    title: "Multimodel Atelier Tutorial Series",
    status: "Sanitize before extraction",
    tone: "sanitize",
    pattern:
      "Bilingual EN/TR tutorial flow, scripted narration, storyboard beats, and multi-AI synthesis method.",
    publishRule:
      "Extract public-safe lesson formats and replace project-specific references with generic teaching scenarios.",
  },
  {
    title: "Multimodel Atelier Changelog",
    status: "Reference discipline",
    tone: "reference",
    pattern:
      "Version notes, QA improvements, live mini-model evolution, and release-readiness evidence.",
    publishRule:
      "Convert into Artemis changelog doctrine for public features, not a dump of internal development notes.",
  },
];
