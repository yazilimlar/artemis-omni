import Link from "next/link";

const liveExperienceUrl = "https://renaissance-eroticism-art-test.georgegokmen.chatgpt.site";

export const metadata = {
  title: "Sala Rotonda 3D Experience | Artemis Art",
  description:
    "A public Artemis gateway for the Vatican Museums Sala Rotonda and Greco-Roman art spatial experience.",
};

export default function SalaRotondaArtPage() {
  return (
    <main className="min-h-screen bg-[#080607] text-[#fff8ed]">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(232,189,114,0.24),transparent_34%),linear-gradient(180deg,rgba(86,48,58,0.42),#080607_68%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#e8bd72]">
            Artemis Art · Vatican Museums
          </p>
          <h1 className="text-balance font-serif text-5xl leading-[0.95] tracking-[-0.05em] text-[#ffe5b8] md:text-7xl">
            Sala Rotonda 3D Experience
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-[#eaded6] md:text-lg">
            An immersive public study of the Vatican Museums room, Hercules, the dome, and the classical body as spatial memory. Enter the live experience below.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={liveExperienceUrl}
              className="rounded-full border border-[#e8bd72] bg-[#e8bd72] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#120807] transition hover:bg-[#ffe2aa]"
            >
              Open Experience
            </Link>
            <Link
              href="/departments"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#fff8ed] transition hover:border-[#e8bd72] hover:text-[#ffe2aa]"
            >
              Departments
            </Link>
          </div>
          <p className="mt-8 text-xs leading-6 text-white/50">
            Stable route: /departments/art/sala-rotonda
          </p>
        </div>
      </section>
    </main>
  );
}
