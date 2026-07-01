import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Atlas All Countries",
  path: "/labs/artemis-atlas-all-countries",
  description:
    "Standalone 3D game-style world atlas prototype for discovery, trip planning, campaign routes, and partner exploration.",
});

export default function ArtemisAtlasAllCountriesPage() {
  return (
    <iframe
      title="Artemis Atlas All Countries"
      src="/standalone/artemis-atlas-all-countries.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#091314]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
