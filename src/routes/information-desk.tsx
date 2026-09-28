import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Cat, Dog, FlaskConical, Lightbulb, MapPin, Pill, Sparkles, Stethoscope, Turtle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { buttonVariants } from "@/components/kit/primitives";

export const Route = createFileRoute("/information-desk")({
  head: () => ({
    meta: [
      { title: "Information Desk · Love Vet AI" },
      { name: "description", content: "A curated editorial hub for better pet care: veterinary innovations, exotic animal care, nutrition, research and pet-friendly places." },
      { property: "og:title", content: "Information Desk · Love Vet AI" },
      { property: "og:description", content: "Editorial pet-care hub for owners, veterinary professionals and animal lovers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InformationDesk,
});

type Story = { title: string; text: string };
type Section = { id: string; icon: LucideIcon; title: string; intro: string; stories: Story[]; note?: string };

const sections: Section[] = [
  {
    id: "innovations", icon: Lightbulb, title: "Veterinary Innovations",
    intro: "How new technology is changing everyday veterinary care.",
    stories: [
      { title: "What AI can — and can't — do in a veterinary clinic", text: "AI can organise information and save time. Medical decisions stay with the veterinarian." },
      { title: "Remote monitoring for recovering pets", text: "An introduction to wearable monitoring and when clinics may use it." },
      { title: "Modern rehabilitation for mobility", text: "Hydrotherapy, physiotherapy and other approaches explained simply." },
    ],
  },
  {
    id: "exotic", icon: Turtle, title: "Exotic Animal Care",
    intro: "Rabbits, hamsters, birds, reptiles and rarer species need veterinarians with the right experience.",
    stories: [
      { title: "Finding a vet who treats exotic animals", text: "Why species experience matters more than distance — and what to ask a clinic." },
      { title: "Small mammals: rabbits, hamsters and guinea pigs", text: "Everyday care considerations and signs worth mentioning to a veterinarian." },
      { title: "Birds and reptiles: specialist care", text: "Temperature, diet and handling needs that differ from cats and dogs." },
    ],
  },
  {
    id: "dog-nutrition", icon: Dog, title: "Dog Nutrition & Recipes",
    intro: "Inspiration for simple home-prepared meal ideas, such as oats, carrot and suitable vegetables.",
    stories: [
      { title: "Simple home-prepared meal ideas for dogs", text: "Educational ideas to discuss with your veterinarian — not a complete diet." },
      { title: "Reading a dog food label", text: "What the ingredient list and nutrition statement actually tell you." },
    ],
    note: "Nutrition needs vary by dog. Discuss diet changes with a veterinarian where appropriate.",
  },
  {
    id: "cat-nutrition", icon: Cat, title: "Cat Nutrition & Recipes",
    intro: "Cats have very specific nutritional needs — human-style recipes are not complete meals for cats.",
    stories: [
      { title: "Why cats need a different diet", text: "An introduction to feline nutrition and why it differs from dogs." },
      { title: "Treat ideas to talk through with your vet", text: "Occasional treats, framed as inspiration rather than a prescription." },
    ],
    note: "This is informational content, not a veterinary dietary prescription.",
  },
  {
    id: "supplements", icon: Pill, title: "Pet Vitamins & Supplements",
    intro: "A future home for editorial reviews and product information. Sponsored content will always be labelled.",
    stories: [
      { title: "Do pets need supplements?", text: "Questions to ask your veterinarian before starting any vitamin or supplement." },
    ],
  },
  {
    id: "research", icon: FlaskConical, title: "Veterinary Research & Science",
    intro: "Plain-language summaries of animal health research will appear here.",
    stories: [
      { title: "How to read a veterinary study", text: "Sample size, species and what a result really means." },
      { title: "Research on exotic species", text: "Why fewer studies exist for rarer animals — and why that matters." },
    ],
  },
  {
    id: "places", icon: MapPin, title: "Pet-Friendly Places",
    intro: "Cafés, parks, walking routes, hotels and travel ideas to enjoy with your pet.",
    stories: [
      { title: "Planning a trip with your pet", text: "A checklist for travel, from documents to rest stops." },
      { title: "What makes a place truly pet-friendly", text: "Water, shade, space and a welcoming attitude." },
    ],
  },
];

function InformationDesk() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <p className="text-xs font-bold tracking-[0.2em] text-deep uppercase">Information Desk</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          <span className="text-gradient-hero">A curated hub for better pet care</span>
        </h1>
        <p className="mt-4 max-w-2xl text-navy/85">
          Discover useful veterinary information, new specialists, animal-care innovations, nutrition ideas,
          research, products and pet-friendly places.
        </p>
      </section>

      {/* Featured + two smaller */}
      <section aria-label="Featured" className="mx-auto mt-10 grid max-w-6xl gap-5 px-6 lg:grid-cols-[1.6fr_1fr]">
        <a href="#exotic" className="glass hover-lift group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[2rem] p-8">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_80%_20%,rgb(255_170_214/0.45),transparent),radial-gradient(60%_70%_at_20%_30%,rgb(128_104_255/0.35),transparent)]" />
          <p className="text-xs font-bold tracking-[0.18em] text-deep uppercase">Featured · Exotic Animal Care</p>
          <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-[-0.02em] text-navy">Not every vet treats every animal</h2>
          <p className="mt-3 max-w-lg text-navy/80">
            From rabbits to reptiles — and one day even rare species like crocodilians — the right care starts with a
            veterinarian experienced with your animal.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-deep">Read the section <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
        </a>
        <div className="grid gap-5">
          <a href="#innovations" className="glass hover-lift rounded-3xl p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-deep uppercase">Innovations</p>
            <h3 className="mt-2 text-lg font-bold text-navy">What AI can — and can't — do for your pet's care</h3>
          </a>
          <a href="#dog-nutrition" className="glass hover-lift rounded-3xl p-6">
            <p className="text-xs font-bold tracking-[0.18em] text-deep uppercase">Nutrition</p>
            <h3 className="mt-2 text-lg font-bold text-navy">Simple home-prepared meal ideas for dogs</h3>
          </a>
        </div>
      </section>

      <p className="mx-auto mt-4 max-w-6xl px-6 text-xs text-graphite">
        Illustrative editorial previews — full articles are being written. No clinics, products or partners are featured yet.
      </p>

      {/* Editorial sections */}
      <div className="mx-auto mt-14 max-w-6xl space-y-14 px-6">
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 border-t border-ice-lum/50 pt-8">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div>
                <span className="grid size-10 place-items-center rounded-full border border-ice-lum/70 bg-card/70 text-deep"><s.icon className="size-[18px]" strokeWidth={1.6} /></span>
                <h2 id={`${s.id}-h`} className="mt-3 text-2xl font-bold tracking-[-0.02em] text-navy">{s.title}</h2>
                <p className="mt-2 text-sm text-navy/75">{s.intro}</p>
              </div>
              <div>
                <ul className="divide-y divide-ice-lum/50">
                  {s.stories.map((st) => (
                    <li key={st.title} className="py-4 first:pt-0">
                      <h3 className="font-bold text-navy">{st.title}</h3>
                      <p className="mt-1 text-sm text-graphite">{st.text}</p>
                    </li>
                  ))}
                </ul>
                {s.note && <p className="mt-3 rounded-2xl bg-card/60 px-4 py-2.5 text-xs text-navy/80">{s.note}</p>}
              </div>
            </div>
          </section>
        ))}

        <section aria-labelledby="news-h" className="border-t border-ice-lum/50 pt-8">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 size-5 text-deep" strokeWidth={1.6} />
            <div>
              <h2 id="news-h" className="text-2xl font-bold tracking-[-0.02em] text-navy">New Specialists & Clinic News</h2>
              <p className="mt-2 max-w-2xl text-sm text-navy/75">
                Announcements such as a new exotic-animal veterinarian joining a participating clinic will appear here once
                real clinics are connected. Nothing is published yet.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Single join CTA */}
      <section className="mx-auto mt-16 max-w-3xl px-6">
        <div className="glass flex flex-col items-center gap-4 rounded-[2rem] px-6 py-10 text-center">
          <Stethoscope className="size-6 text-deep" strokeWidth={1.6} />
          <p className="text-lg font-bold text-navy">For veterinary professionals and clinics</p>
          <Link to="/join/veterinarian" className={buttonVariants({ size: "md" })}>Join Love Vet AI</Link>
        </div>
      </section>
    </PublicPage>
  );
}
