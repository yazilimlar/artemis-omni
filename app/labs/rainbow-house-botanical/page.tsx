import {
  Leaf,
  MapPin,
  Sprout,
  Database,
  FlaskConical,
  CalendarDays,
  ShieldCheck,
  Layers3,
  Camera,
  TestTube2,
  NotebookTabs,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Rainbow House Botanical Encyclopedia",
  path: "/labs/rainbow-house-botanical",
  description:
    "A living botanical field compendium documenting taxonomy, provenance, phenology, microclimates, morphology, and ecology at Rainbow House in the Hudson Valley.",
});

const species = [
  {
    id: "RH-FL-001",
    plate: "Plate 01",
    common: "French Marigold",
    scientific: "Tagetes patula complex",
    family: "Asteraceae",
    authority: "Tagetes patula L.",
    origin: "Mexico / Central America",
    life: "Tender annual; frost-killed",
    provenance: "P1",
    confidence: "Confirmed genus / cultivar complex",
    layer: "Terraced border / edge",
    color: "Mahogany · orange · saffron",
    morphology:
      "Compact, heavily branched herb with aromatic pinnately divided foliage and a terminal composite flower head. The observed ray florets grade from mahogany-crimson through orange to saffron margins around a dense central disc.",
    ecology:
      "Useful nectar and pollen resource for small bees and hoverflies. Tagetes roots contain thiophenes, including alpha-terthienyl; suppression of some plant-parasitic nematodes is context-dependent and is strongest in sufficiently dense rotations or cover-crop use rather than as a universal neighboring-plant effect.",
    management:
      "Full sun, ordinary well-drained soil, moderate establishment water. Save fully mature dark achenes from the most distinctive bicolored heads.",
    verify: "Retain dried capitula and seed-head bracts if cultivar-level comparison is attempted.",
  },
  {
    id: "RH-FL-002",
    plate: "Plate 02",
    common: "Common Zinnia",
    scientific: "Zinnia elegans",
    family: "Asteraceae",
    authority: "Zinnia elegans Jacq. (syn. Z. violacea)",
    origin: "Mexico",
    life: "Tender summer annual",
    provenance: "P1–P2",
    confidence: "Confirmed species; polymorphic population",
    layer: "Cultivated rock-margin / mid-story",
    color: "Magenta · blush · salmon · gold · bicolor",
    morphology:
      "Upright annual with opposite, nearly sessile, rough-pubescent leaves and sturdy stems. Rainbow House currently contains single, semi-double, dahlia/pompon, bicolor mahogany-gold, and partially quilled/striped morphotypes.",
    ecology:
      "Strong long-season resource for butterflies, bees, skippers, and hoverflies. Open and semi-double morphotypes generally provide easier floral access than densely double forms. Hummingbird use should be treated as secondary/opportunistic rather than the primary ecological role.",
    management:
      "Full sun, strong airflow, well-drained soil, and ground-level irrigation. Maintain separate maternal seed envelopes from the bicolor, quilled, deepest magenta, and strongest double forms for the 2027 RH-Z selection program.",
    verify: "Track ray-floret versus disc-floret seed set during harvest and record which maternal heads produce viable offspring.",
  },
  {
    id: "RH-FL-003",
    plate: "Plate 03",
    common: "Sulphur Cosmos",
    scientific: "Cosmos sulphureus",
    family: "Asteraceae",
    authority: "Cosmos sulphureus Cav.",
    origin: "Mexico through Central America; extending into tropical America",
    life: "Tender annual / ready self-seeder",
    provenance: "P1–P2",
    confidence: "Confirmed species",
    layer: "Meadow transition / mid-story",
    color: "Tangerine · orange",
    morphology:
      "Erect branching annual with divided foliage and vivid warm-toned composite heads. The observed specimen shows bright orange ray florets with gently scalloped termini around orange-yellow disc florets.",
    ecology:
      "Performs well in heat, strong sun, lean mineral soils, and periodic dryness. Frequently used by bees, butterflies, and syrphid flies. Excessive nitrogen can produce excessive vegetative growth and weaker flowering structure.",
    management:
      "Allow selected seedheads to stand in naturalized zones to test self-recruitment rather than deadheading the entire population.",
    verify: "Log spring 2027 volunteer emergence from undisturbed soil pockets and compare with intentionally sown areas.",
  },
  {
    id: "RH-FL-004",
    plate: "Plate 04",
    common: "Fleabane",
    scientific: "Erigeron sp. — likely E. annuus / E. strigosus complex",
    family: "Asteraceae",
    authority: "Species provisional",
    origin: "Eastern / central North America",
    life: "Annual, winter annual, or biennial behavior",
    provenance: "P0",
    confidence: "Confirmed genus; provisional species",
    layer: "Volunteer native / field matrix",
    color: "White · gold",
    morphology:
      "Erect, lightly to strongly pubescent stems carrying loose clusters of small daisy-like heads. Each capitulum has numerous very narrow white rays surrounding a broad yellow disc.",
    ecology:
      "A useful early-successional native wildflower supporting small native bees, syrphids, parasitoid wasps, flies, and other beneficial insects. It is valuable habitat structure, but the current evidence does not justify calling it a universal keystone species.",
    management:
      "Retain non-interfering drifts in meadow and stone-edge zones; thin only where dense volunteers suppress intentionally established seedlings.",
    verify: "Photograph the basal rosette, lower and upper leaves, stem pubescence, and whole plant to resolve E. annuus versus E. strigosus.",
  },
  {
    id: "RH-FL-005",
    plate: "Plate 05",
    common: "Garden Cosmos",
    scientific: "Cosmos bipinnatus",
    family: "Asteraceae",
    authority: "Cosmos bipinnatus Cav.",
    origin: "Mexico",
    life: "Tender annual / self-seeding",
    provenance: "P1–P2",
    confidence: "Confirmed species",
    layer: "Meadow canopy / upper border",
    color: "Burgundy · magenta · lilac · blush",
    morphology:
      "Tall, airy annual with fine bipinnatisect foliage, long slender peduncles, and broad ray florets surrounding a yellow disc. Documented forms include carmine/burgundy, lilac-pink, and blush-white flowers with magenta basal flushing.",
    ecology:
      "Excellent late-season nectar and pollen station for bees, hoverflies, and butterflies. Lean-to-moderate fertility favors flowering; excess nitrogen promotes tall weak growth and lodging.",
    management:
      "Use as the upper moving layer of naturalistic borders. Save maternal seed separately from the most distinctive color forms and test self-sown recruitment next spring.",
    verify: "Do not assign a marketed cultivar name such as Picotee until purchase or packet evidence confirms it.",
  },
  {
    id: "RH-FL-006",
    plate: "Plate 06",
    common: "Moss / Slender Verbena",
    scientific: "Glandularia sp. cf. G. bipinnatifida / G. tenuisecta",
    family: "Verbenaceae",
    authority: "Species provisional",
    origin: "North / Central America if G. bipinnatifida; South America if G. tenuisecta",
    life: "Tender short-lived perennial; annual behavior possible locally",
    provenance: "P1",
    confidence: "Confirmed genus; species provisional (~85%)",
    layer: "Rocky outcrop / understory edge",
    color: "Violet · lavender",
    morphology:
      "Low-spreading plant with finely divided foliage and dense terminal clusters of violet-purple, five-lobed salverform flowers with pale centers. The photographed morphology fits the finely divided Glandularia group but does not yet settle species identity.",
    ecology:
      "Drought-tolerant once established, strongly sun-loving, and sensitive to persistent crown/root wetness. Useful nectar resource for small butterflies, skippers, bees, and bee flies.",
    management:
      "Treat conservatively as an annual rockery groundcover until winter survival is documented. Favor sharp drainage and hot stone interfaces.",
    verify: "Capture whole-plant habit, side view of the flower cluster, calyx/bract detail, stem hairiness, and leaf-base attachment.",
  },
];

const provenance = [
  ["P0", "Unknown", "No source evidence yet."],
  ["P1", "Possible", "Could originate from a documented seed mix or purchase event."],
  ["P2", "Probable", "Timing, known composition, sowing area, or morphology strongly align."],
  ["P3", "Confirmed purchase", "The exact species or plant appears in a transaction / shipment record."],
  ["P4", "Confirmed lineage", "Purchase + planting location + emergence + photographic continuity are established."],
];

const rulings = [
  "Canonical RH identifiers are frozen. RH-FL-005 remains Garden Cosmos; RH-FL-006 remains Glandularia sp. and will not be renumbered if the species determination changes.",
  "Observation, identification, purchase history, and lineage are separate evidence layers. A plausible seed source is not treated as proof of origin.",
  "Uncertain identifications remain at genus level or use cf. notation until diagnostic leaves, stems, fruit, or whole-plant views are available.",
  "Ecological language is qualified: Tagetes nematode effects are context-dependent; zinnias are primarily insect-pollinator resources; Erigeron is a valuable pioneer rather than automatically a keystone species.",
  "Annuals are described by frost sensitivity and life cycle rather than misleading perennial-style USDA zone labels.",
];

const actions = [
  "Recover the April 2026 Amazon 21-variety wildflower mix ingredient list or packet image before elevating zinnia/cosmos/verbena provenance beyond P1–P2.",
  "Create a Glandularia voucher set: whole plant, side inflorescence, calyx/bracts, stem hairiness, and leaf-base detail.",
  "Create an Erigeron voucher set: basal rosette, lower/upper leaves, stem, flower cluster, and whole-plant scale view.",
  "Isolate maternal seed from RH-FL-002D/002E and the most distinctive RH-FL-005 color forms for 2027 segregation tracking.",
  "Begin GPS/bed codes and phenology logging: emergence, first flower, peak bloom, first mature seed, frost damage, and dieback.",
];

export default function RainbowHouseBotanicalPage() {
  return (
    <>
      <PageHero
        eyebrow="Artemis Labs · Living Systems"
        title="Rainbow House Botanical Encyclopedia"
        description="A rigorous longitudinal field record with a field-guide voice: taxonomy, plant biology, climate adaptation, seed provenance, morphology, phenology, pollinator ecology, and the changing color architecture of one Hudson Valley landscape."
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
              [Leaf, "6", "Canonical flower taxa"],
              [NotebookTabs, "01–06", "Frozen plate sequence"],
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

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">
              <ShieldCheck className="h-4 w-4" aria-hidden /> Canonical rulings
            </div>
            <h2 className="display-serif mt-3 text-4xl text-parchment sm:text-5xl">One source of record, many augmentation layers</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The registry uses a scientific evidence backbone for identity and provenance, while descriptive field-guide prose, color mapping, and landscape-layer analysis remain presentation layers. Rich narration can expand a record; it cannot silently change its identifier, certainty, or documented origin.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {rulings.map((rule) => (
              <div key={rule} className="flex gap-3 rounded-lg border border-border/70 bg-background/35 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <p className="text-sm leading-relaxed text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">Field Compendium · Plates 01–06</div>
            <h2 className="display-serif mt-3 text-4xl text-parchment sm:text-5xl">Master botanical registry</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Each plate separates what was observed from what was inferred. Taxonomic certainty, provenance tier, ecological interpretation, and management recommendation are stored independently so future photographs or records can refine one layer without corrupting the others.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            {species.map((plant) => (
              <article key={plant.id} className="rounded-lg border border-border/70 bg-background/35 p-6 shadow-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-soft">
                      {plant.plate} · {plant.id} · {plant.family}
                    </div>
                    <h3 className="display-serif mt-2 text-3xl text-parchment">{plant.common}</h3>
                    <p className="mt-1 italic text-signal-soft">{plant.scientific}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{plant.authority}</p>
                  </div>
                  <Sprout className="h-6 w-6 shrink-0 text-gold" aria-hidden />
                </div>

                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-muted-foreground">ID status</dt><dd className="mt-1 text-foreground">{plant.confidence}</dd></div>
                  <div><dt className="text-muted-foreground">Provenance</dt><dd className="mt-1 text-foreground">{plant.provenance}</dd></div>
                  <div><dt className="text-muted-foreground">Native origin</dt><dd className="mt-1 text-foreground">{plant.origin}</dd></div>
                  <div><dt className="text-muted-foreground">Life cycle here</dt><dd className="mt-1 text-foreground">{plant.life}</dd></div>
                  <div><dt className="text-muted-foreground">Landscape layer</dt><dd className="mt-1 text-foreground">{plant.layer}</dd></div>
                  <div><dt className="text-muted-foreground">Color index</dt><dd className="mt-1 text-foreground">{plant.color}</dd></div>
                </dl>

                <div className="mt-6 space-y-4 border-t border-border/60 pt-5 text-sm leading-relaxed text-muted-foreground">
                  <div><span className="font-medium text-parchment">Observed morphology. </span>{plant.morphology}</div>
                  <div><span className="font-medium text-parchment">Ecology. </span>{plant.ecology}</div>
                  <div><span className="font-medium text-parchment">Management. </span>{plant.management}</div>
                  <div className="rounded-md border border-gold/20 bg-gold/5 p-4"><span className="font-medium text-gold-soft">Open verification. </span>{plant.verify}</div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-navy-deep/25 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft"><FlaskConical className="h-4 w-4" /> Climate model</div>
            <h2 className="display-serif mt-3 text-4xl text-parchment">Regional zone + local microclimate</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The project uses an approximate USDA 6b–7a design envelope as a regional planning frame, not as a substitute for site measurement. Each record also receives a Rainbow House microclimate class because slope orientation, stone thermal mass, drainage, wind exposure, snow cover, and soil moisture can dominate survival at plant scale.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["South-facing sunny slope", "Stone / rock margin", "Open meadow", "Woodland edge", "Foundation thermal zone"].map((x) => (
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
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-background/35 p-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft"><Layers3 className="h-4 w-4" /> Landscape chromatic architecture</div>
              <h2 className="display-serif mt-3 text-3xl text-parchment">Color organized by elevation</h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <div><span className="font-medium text-parchment">Upper canopy · 3–5 ft:</span> RH-FL-005 Garden Cosmos — diffuse, wind-responsive carmine, lilac, and blush color.</div>
                <div><span className="font-medium text-parchment">Mid-story · 1.5–3 ft:</span> RH-FL-003 Sulphur Cosmos + RH-FL-002 Zinnia — denser tangerine, amber, magenta, and bicolor blocks.</div>
                <div><span className="font-medium text-parchment">Understory · 6–18 in:</span> RH-FL-006 Glandularia — violet ground-plane accents along sharply drained stone edges.</div>
                <div><span className="font-medium text-parchment">Volunteer matrix:</span> RH-FL-004 Erigeron threads small white/gold flowers through the intentionally planted layers.</div>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/35 p-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft"><TestTube2 className="h-4 w-4" /> Morphology Study MS-01</div>
              <h2 className="display-serif mt-3 text-3xl text-parchment">Developing bud / involucre study</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The previously ambiguous “Nigella or Cosmos” image is not assigned an RH-FL taxon. It is retained as a structural morphology plate documenting a developing terminal bud and surrounding bracts. Its taxonomic identity remains unresolved until it can be linked to a mature flower or whole plant.
              </p>
              <div className="mt-5 rounded-md border border-gold/20 bg-gold/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-gold-soft">Governance rule:</span> morphology studies may illustrate developmental architecture, but they do not receive a species identifier unless diagnostic evidence supports one.
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl rounded-lg border border-gold/25 bg-gold/5 p-7">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">Documented procurement trail</div>
            <h2 className="display-serif mt-3 text-3xl text-parchment">Seed provenance is part of the science.</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Purchase records document multiple waves of intentional introductions: January 2025 eBay specialty lots including Gardenia, Nicotiana, Gomphrena, foxglove, lavender, climbing rose, columbine, and “blue daisy” listings; a September 2025 Amazon order containing pampas grass, multiple creeping-thyme lots, Japanese wisteria, hydrangea, and climbing-rose seed; and an April 2026 Amazon 10,000+ seed butterfly / hummingbird wildflower mix advertised as 21 annual/perennial varieties. These records establish purchase events, not automatically field lineage.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A purchased Eastern redbud can be P3 even before its current field location is documented. By contrast, cosmos or zinnia remain P1–P2 candidates for the April mix until the original ingredient list and planting continuity are recovered.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold-soft"><Camera className="h-4 w-4" /> Open field actions</div>
            <h2 className="display-serif mt-3 text-4xl text-parchment">What closes the next evidence gaps</h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {actions.map((action, i) => (
              <div key={action} className="flex gap-4 rounded-lg border border-border/70 bg-background/35 p-5">
                <div className="font-mono text-sm text-gold">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{action}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 text-gold" aria-hidden />
            Future records: RH ID · Plate · specimen photo · date · GPS/bed code · provenance tier · microclimate · phenology · seed action · verification status.
          </div>
        </Container>
      </section>
    </>
  );
}
