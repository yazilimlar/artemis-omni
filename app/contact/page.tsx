import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { PilotIntakeForm } from "@/components/artemis/PilotIntakeForm";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact / Pilot Request",
  path: "/contact",
  description:
    "Request an Artemis pilot. Tell us about your systems, your pain point, and where AI implementation can help. Pilot-ready, human-reviewed, audit-aware.",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Pilot Request"
        title="Start a pilot with Artemis"
        description="We run focused, pilot-ready implementation engagements on real data. Tell us where the pain is and we'll propose a tight, audit-aware scope."
      />
      <section className="py-14 lg:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <PilotIntakeForm />

            <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
              <h2 className="text-sm font-semibold text-foreground">Connect on LinkedIn</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Follow Artemis for construction intelligence insights, pilot announcements, and
                technical deep-dives on 5D cost-schedule integration.
              </p>
              <a
                href="https://www.linkedin.com/company/artemis-omni"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-blueprint/10 px-4 py-2 text-sm font-medium text-blueprint transition-colors hover:bg-blueprint/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn →
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
