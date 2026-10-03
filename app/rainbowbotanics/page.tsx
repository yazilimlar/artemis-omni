import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rainbow House Botanical Intelligence Atlas",
  description:
    "The Rainbow House evidence-led botanical collection, field atlas, and longitudinal garden observatory.",
  robots: { index: false, follow: false },
};

export default function RainbowBotanicsIndexPage() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#17241c]">
      <iframe
        src="/rainbow-botanics/atlas-v10/index.html"
        title="Rainbow House Botanical Intelligence Atlas v10"
        className="block min-h-[calc(100dvh-5rem)] w-full border-0"
        loading="eager"
      />
    </div>
  );
}
