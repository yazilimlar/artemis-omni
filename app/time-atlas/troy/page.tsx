import { TimeAtlasTroyExperience } from "@/components/time-atlas/troy/TimeAtlasTroyExperience";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Time Atlas - Troy c. 600 BC",
  path: "/time-atlas/troy",
  description: "A museum-quality interactive reconstruction of Troy through time.",
});

export default function TroyTimeAtlasPage() {
  return <TimeAtlasTroyExperience surface="canonical" />;
}
