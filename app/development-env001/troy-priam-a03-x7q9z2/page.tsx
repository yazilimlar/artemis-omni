import { TimeAtlasTroyExperience } from "@/components/time-atlas/troy/TimeAtlasTroyExperience";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Development Env001 - Priam Lens A0.3",
  path: "/development-env001/troy-priam-a03-x7q9z2",
  description: "A public development route for the Artemis Time Atlas Troy vertical slice.",
  noIndex: true,
});

export default function PriamLensDevelopmentPage() {
  return <TimeAtlasTroyExperience surface="development" />;
}
