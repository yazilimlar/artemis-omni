import { Leaf, MapPin, Sprout, Database, FlaskConical, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Rainbow House Botanical Encyclopedia",
  path: "/labs/rainbow-house-botanical",
  description:
    "A living botanical field compendium documenting the plants, provenance, phenology, microclimates, and ecology of Rainbow House in the Hudson Valley.",
});

const species = [
  {
    id: "RH-FL-001",
    common: "French Marigold",
    scientific: "Tagetes patula",
    family: "Asteraceae",
    origin: "Mexico / Central America",
    life: "Annual",
    color: "Mahogany · orange · saffron",
    ecology: "Pollinator resource; Tagetes roots contain thiophenes associated with suppression of some plant-parasitic nematodes.",
  },
  {
    id: "RH-FL-002",
    common: "Common Zinnia",
    scientific: "Zinnia elegans",
    family: "Asteraceae",
    origin: "Mexico",
    life: "Annual",
    color: "Magenta · blush · salmon · gold · bicolor",
    ecology: "Long-season butterfly and bee resource; open and semi-double morphotypes provide especially accessible floral rewards.",
  },
  {
    id: "RH-FL-003",
    common: "Sulphur Cosmos",
    scientific: "Cosmos sulphureus",
    family: "Asteraceae",
    origin: "Mexico to Central America",
    life: "Annual / self-seeding",
    color: "Tangerine · orange",
    ecology: "Heat- and drought-tolerant meadow annual that performs well in lean, sunny soils and readily reseeds.",
  },
  {
    id: "RH-FL-004",
    common: "Fleabane",
    scientific: "Erigeron sp. (likely E. annuus)",
    family: "Asteraceae",
    origin: "North America",
    life: "Annual / biennial",
    color: "White · gold",
    ecology: "Volunteer meadow plant supporting small native bees, hoverflies, parasitoid wasps, and other beneficial insects.",
  },
  {
    id: "RH-FL-005",
    common: "Garden Cosmos",
    scientific: "Cosmos bipinnatus",
    family: "Asteraceae",
    origin: "Mexico",
    life: "Annual / self-seeding",
    color: "Burgundy · magenta · lilac · blush",
    ecology: "Airy tall meadow layer; strong pollinator value; flowers best in full sun and lean-to-moderate fertility.",
  },
  {
    id: "RH-FL-006",
    common: "Moss / Slender Verbena",
    scientific: "Glandularia sp. cf. G. bipinnatifida",
    family: "Verbenaceae",
    origin: "North / Central America if confirmed",
    life: "Tender perennial / annual behavior",
    color: "Violet · lavender",
    ecology: "Low spreading nectar layer favoring full sun, sharp drainage, and dry rocky edges; species identification remains provisional.",
  },
];

const provenance = [
  ["P0", "Unknown", "No source evidence yet."],
  ["P1", "Possible", "Could originate from a documented seed mix."],
  ["P2", "Probable", "Timing, species list, and planting area align."],
  ["P3", "Confirmed purchase", "Exact species or plant appears in a transaction record."],
  ["P4", "Confirmed lineage", "Purchase + planting location + emergence / photographic continuity established."],
];

export default function RainbowHouseBotanicalPage() {
  return (
    <>
      <PageHero
        eyebrow="Artemis Labs · Living Systems"
        title="Rainbow House Botanical Encyclopedia"
        description="A longitudinal field record of a Hudson Valley landscape: taxonomy, plant biology, climate adaptation, seed provenance, phenology, pollinator ecology, and the changing color architecture of one living property."
      >
        <div className="flex flex-wrap gap-3">
          <StatusBadge tone="test">Field project · active</StatusBadge>
          <StatusBadge tone="synthetic">Human + AI identification</StatusBadge>
          <StatusBadge tone="private">Exact residence location withheld</StatusBadge>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-14 lg:py-18">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              [Leaf, "6", "Current flower taxa"],
              [MapPin, "Hudson Valley", "Field region"],
              [CalendarDays, "2026 →", "Longitudinal survey"],
              [Database, "P0–P4", "Provenance evidence scale"],
            ].map(([Icon, value, label]) => {
              const I = Icon as typeof Leaf;
              return (
                <div key={String(label)} className="rounded-lg border border-border/70 bg-navy-deep/45 p-5">
                  <I className="h-5 w-5 text-gold" aria-hidden />
                  <div className="display-serif mt-4 text-2xl text-parchment">{String(value)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{String(label)}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">Field Compendium · Plates 01–06</div>
            <h2 className="display-serif mt-3 text-4xl text-parchment sm:text-5xl">The living inventory</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Identifications are treated as evidence-backed field observations rather than permanent labels. Species confidence can be revised as leaves, stems, fruit, seed heads, and seasonal behavior provide stronger diagnostic evidence.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {species.map((plant) => (
              <article key={plant.id} className="rounded-lg border border-border/70 bg-background/35 p-6 shadow-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-soft">{plant.id} · {plant.family}</div>
                    <h3 className="display-serif mt-2 text-3xl text-parchment">{plant.common}</h3>
                    <p className="mt-1 italic text-signal-soft">{plant.scientific}</p>
                  </div>
                  <Sprout className="h-6 w-6 shrink-0 text-gold" aria-hidden />
                </div>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-muted-foreground">Native origin</dt><dd className="mt-1 text-foreground">{plant.origin}</dd></div>
                  <div><dt className="text-muted-foreground">Life cycle here</dt><dd className="mt-1 text-foreground">{plant.life}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-muted-foreground">Rainbow color index</dt><dd className="mt-1 text-foreground">{plant.color}</dd></div>
                </dl>
                <p className="mt-5 border-t border-border/60 pt-5 text-sm leading-relaxed text-muted-foreground">{plant.ecology}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-navy-deep/25 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft"><FlaskConical className="h-4 w-4" /> Climate model</div>
            <h2 className="display-serif mt-3 text-4xl text-parchment">One property, several microclimates</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The field guide uses an approximate USDA 6b–7a design envelope, but each record also receives a site microclimate: south-facing sunny slope, stone / rock margin, open meadow, woodland edge, or house-foundation thermal zone. Drainage, wind, snow cover, radiant heat, and soil moisture can matter as much as the regional hardiness number.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Full-sun slope", "Rock margin", "Open meadow", "Woodland edge", "Foundation microclimate"].map((x) => (
                <span key={x} className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground">{x}</span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/35 p-6">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">Provenance scale</div>
            <div className="mt-5 space-y-4">
              {provenance.map(([code, name, note]) => (
                <div key={code} className="grid grid-cols-[42px_1fr] gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="font-mono text-gold">{code}</div>
                  <div><div className="text-sm font-medium text-parchment">{name}</div><div className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl rounded-lg border border-gold/25 bg-gold/5 p-7">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">Documented procurement trail</div>
            <h2 className="display-serif mt-3 text-3xl text-parchment">Seed provenance is part of the science.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Purchase records document multiple waves of intentional introductions, including eBay specialty seed lots, a September 2025 Amazon order containing pampas grass, creeping thyme, Japanese wisteria, hydrangea, and climbing rose seed, and an April 2026 Amazon 10,000+ seed butterfly / hummingbird wildflower mix. The encyclopedia distinguishes a confirmed purchase from a confirmed living lineage so plausible connections are never presented as proof.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
