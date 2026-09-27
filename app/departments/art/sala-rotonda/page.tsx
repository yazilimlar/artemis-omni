const liveExperienceUrl = "https://renaissance-eroticism-art-test.georgegokmen.chatgpt.site";

export const metadata = {
  title: "Octavian Rotunda | Artemis Art",
  description:
    "An embedded Artemis art experience for the Vatican Museums, Greco-Roman bodies, and octagonal spatial memory.",
};

export default function SalaRotondaArtPage() {
  return (
    <main className="min-h-screen bg-[#080607] text-[#fff8ed]">
      <section className="relative h-screen min-h-[680px] overflow-hidden bg-[#080607]">
        <iframe
          src={liveExperienceUrl}
          title="Octavian Rotunda interactive art experience"
          className="absolute inset-0 h-full w-full border-0 bg-[#080607]"
          allow="autoplay; fullscreen"
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#080607]/80 via-[#080607]/28 to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-[calc(100vw-2rem)] rounded-full border border-[#e8bd72]/30 bg-[#080607]/58 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#ffe5b8] backdrop-blur-md md:left-6 md:top-6">
          Artemis Art · Octavian Rotunda
        </div>
        <a
          href={liveExperienceUrl}
          className="absolute bottom-4 right-4 z-20 rounded-full border border-[#e8bd72]/40 bg-[#080607]/62 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#ffe5b8] backdrop-blur-md transition hover:border-[#e8bd72] hover:bg-[#e8bd72] hover:text-[#120807] md:bottom-6 md:right-6"
        >
          Open Standalone
        </a>
      </section>
    </main>
  );
}
