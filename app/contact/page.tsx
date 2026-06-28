import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { PilotRequestForm } from "@/components/tools/PilotRequestForm";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact / Pilot Request",
  path: "/contact",
  description:
    "Request an Artemis Omni pilot. Tell us about your engineering or construction project and where intelligence can help.",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Pilot Request"
        title="Start a pilot with Artemis"
        description="We run focused pilots that prove value on real project data in weeks, not quarters. Tell us where the pain is and we'll propose a tight scope."
      />
      <section className="py-14 lg:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <PilotRequestForm />
          </div>
        </Container>
      </section>
    </>
  );
}
