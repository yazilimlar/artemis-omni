import { Container } from "@/components/ui/container";
import { HeroVideo } from "@/components/home/HeroVideo";
import { PilotForm } from "@/components/integrate/PilotForm";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Integrate Artemis",
  path: "/integrate",
  description:
    "Bring Artemis into one decision loop first: connect the signals, define the review gates, and run a controlled pilot on synthetic or approved data.",
});

const NEXT_STEPS = [
  "We read your target workflow and reply within two business days to confirm fit.",
  "A short working session maps the signals, systems, and review gates for one decision loop.",
  "You receive a scoped pilot plan that starts on synthetic or approved data before anything live.",
];

export default function IntegratePage() {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="eyebrow">Integration</p>
          <h1 className="display-serif mt-3 text-balance text-4xl text-parchment sm:text-5xl">
            Integrate Artemis
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Artemis starts with one decision loop, not a platform migration. Tell us which
            workflow matters most and we will scope a controlled pilot around it.
          </p>
          <div className="mt-8">
            <HeroVideo variant="compact" />
          </div>
          <div className="mt-10">
            <h2 className="display-serif text-2xl text-parchment">What happens next</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground">
              {NEXT_STEPS.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-soft" aria-hidden />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-navy-deep/50 p-6 shadow-panel lg:p-8">
          <h2 className="display-serif text-2xl text-parchment">Request a pilot</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fields marked * are required.</p>
          <div className="mt-6">
            <PilotForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
