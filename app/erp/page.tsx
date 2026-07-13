import {
  Activity,
  BadgeDollarSign,
  Boxes,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileText,
  HardHat,
  Landmark,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/erp",
  title: "Prime Industrial ERP | Artemis",
  description:
    "A public-safe MVP for industrial operations, project controls, finance, procurement, equipment, compliance, and executive decision support.",
});

const metrics = [
  { label: "Active projects", value: "12", note: "3 require action" },
  { label: "Committed cost", value: "$48.6M", note: "82% confidence" },
  { label: "Open procurement", value: "$6.4M", note: "17 packages" },
  { label: "Equipment readiness", value: "91%", note: "4 exceptions" },
];

const modules = [
  { title: "Projects", detail: "Portfolio, WBS, milestones, RFIs, submittals, changes", icon: Building2 },
  { title: "Cost Engineering", detail: "Budget, commitments, actuals, forecast, EAC and cash", icon: ChartNoAxesCombined },
  { title: "Estimating", detail: "Bid packages, takeoffs, assumptions and estimate versions", icon: HardHat },
  { title: "Procurement", detail: "Requisitions, bids, POs, expediting and vendor status", icon: PackageSearch },
  { title: "Equipment", detail: "Fleet, utilization, maintenance, rentals and inspections", icon: Truck },
  { title: "Inventory", detail: "Materials, warehouses, transfers and reorder signals", icon: Boxes },
  { title: "CRM", detail: "Clients, opportunities, contacts and pursuit pipeline", icon: Users },
  { title: "GoodLedger AI", detail: "Invoices, receipts, banking, coding and compliance evidence", icon: Landmark },
  { title: "Workforce", detail: "Timecards, crews, certifications and labor productivity", icon: CalendarClock },
  { title: "Compliance", detail: "Filings, insurance, licenses, audit trails and controls", icon: ShieldCheck },
  { title: "Documents", detail: "Contracts, drawings, forms and governed records", icon: FileText },
  { title: "Maintenance", detail: "Work orders, parts, downtime and preventive schedules", icon: Wrench },
];

const actions = [
  ["Invoice exception", "Vendor invoice exceeds PO tolerance by 8.4%", "Finance review"],
  ["Schedule exposure", "Two long-lead packages threaten Area 3 mobilization", "Procurement"],
  ["Equipment alert", "Excavator EX-04 inspection expires in 6 days", "Fleet manager"],
  ["Compliance watch", "Insurance certificate renewal is pending", "Risk control"],
];

export default function PrimeIndustrialErpPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.16]" aria-hidden />
        <Container className="py-16 lg:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">
              Public MVP · Synthetic demonstration data
            </span>
            <span className="eyebrow">Artemis Operating Systems</span>
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-gold-soft">Prime Industrial ERP</p>
              <h1 className="display-serif mt-3 max-w-4xl text-balance text-4xl leading-[1.04] text-parchment sm:text-5xl lg:text-6xl">
                One industrial operating picture from pursuit to payment.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                A modular ERP workbench for contractors, equipment businesses, manufacturers, and project-driven companies. It connects operations, project controls, procurement, equipment, finance, records, and executive action without pretending that demonstration data is production truth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#dashboard" size="lg">Open executive dashboard</Button>
                <Button href="/contact" variant="outline" size="lg">Request a controlled pilot</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-navy-deep/70 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">System status</p>
                  <h2 className="mt-2 text-xl font-semibold text-parchment">Executive control tower</h2>
                </div>
                <Activity className="h-7 w-7 text-gold" />
              </div>
              <div className="mt-6 space-y-4">
                {["Project evidence connected", "Cost forecast reviewed", "Procurement exceptions surfaced", "Compliance watch active"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 font-mono text-xs text-gold">0{index + 1}</span>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
        <div className="meander-divider" aria-hidden />
      </section>

      <section id="dashboard" className="border-b border-border/60 py-14 lg:py-18">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Executive Dashboard</p>
              <h2 className="display-serif mt-3 text-3xl text-parchment sm:text-4xl">Operating health at a glance</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Demonstration values show the intended decision architecture. Production deployment will replace these with governed integrations and role-based access.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-border/70 bg-card/70 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-parchment">{metric.value}</p>
                <p className="mt-2 text-sm text-gold-soft">{metric.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-2xl border border-border/70 bg-card/70 p-6">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-gold" />
                <h3 className="text-lg font-semibold text-parchment">Priority action register</h3>
              </div>
              <div className="mt-5 space-y-3">
                {actions.map(([title, detail, owner]) => (
                  <div key={title} className="grid gap-2 rounded-xl border border-border/60 bg-background/25 p-4 md:grid-cols-[0.7fr_1.5fr_0.6fr] md:items-center">
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{detail}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-soft md:text-right">{owner}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-gold/20 bg-navy-deep/65 p-6">
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="h-5 w-5 text-gold" />
                <h3 className="text-lg font-semibold text-parchment">Forecast corridor</h3>
              </div>
              <div className="mt-7 space-y-5">
                <div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current EAC</span><span className="text-parchment">$59.2M</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/60"><div className="h-full w-[74%] rounded-full bg-gold" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Approved revenue</span><span className="text-parchment">$63.8M</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/60"><div className="h-full w-[82%] rounded-full bg-gold-soft" /></div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold-soft">Decision note</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Margin remains positive, but procurement exposure and pending change recovery require named executive action this cycle.</p>
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container>
          <p className="eyebrow">Modular Architecture</p>
          <h2 className="display-serif mt-3 max-w-3xl text-3xl text-parchment sm:text-4xl">Start with the highest-value decision loop, then expand.</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map(({ title, detail, icon: Icon }) => (
              <article key={title} className="group rounded-2xl border border-border/70 bg-card/60 p-5 transition hover:-translate-y-0.5 hover:border-gold/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-parchment">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-14 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <ReceiptText className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Evidence first</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Every KPI should resolve to source records, assumptions, review status, and an accountable owner.</p>
          </article>
          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <ShieldCheck className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Controlled automation</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">AI proposes classifications, forecasts, and actions; governed users review and approve material decisions.</p>
          </article>
          <article className="rounded-2xl border border-border/70 bg-card/60 p-6">
            <ChartNoAxesCombined className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl font-semibold text-parchment">Executive consequence</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The system links field and back-office signals to cost, schedule, cash, margin, risk, and next action.</p>
          </article>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/65 p-8 text-center lg:p-12">
            <p className="eyebrow">Prime Industrial ERP · MVP 0.1</p>
            <h2 className="display-serif mx-auto mt-4 max-w-3xl text-3xl text-parchment sm:text-4xl">A public review surface now. A governed operating system next.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">The next implementation layer is authentication, organization tenancy, Supabase schema, live connectors, audit logs, and role-specific workflows.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg">Start pilot scoping</Button>
              <Button href="/labs" variant="outline" size="lg">Explore Artemis proofs</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
