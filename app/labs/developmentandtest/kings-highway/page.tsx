import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Atlas — King's Highway v0 (Dev & Test)",
  path: "/labs/developmentandtest/kings-highway",
  description:
    "A mutant branch of the Artemis Time Atlas: scroll travels distance instead of time. Five stations of the ancient Aegean corridor — Smyrna, Ephesus, Didyma, Halicarnassus, Patara — rendered as a Peutinger-style ribbon itinerary with evidence-graded sites, station guides, and a downloadable KML dataset. One era, c. 150 AD.",
});

export default function KingsHighwayPage() {
  return (
    <iframe
      title="Artemis Atlas — King's Highway v0"
      src="/standalone/artemis-atlas-kings-highway-v0.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#1c1626]"
      allow="fullscreen; clipboard-write; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
