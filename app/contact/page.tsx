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
          </div>
        </Container>
      </section>
    </>
  );
}
