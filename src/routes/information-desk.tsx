import { Link, createFileRoute } from "@tanstack/react-router";
import { ClinicQuestion } from "@/components/care/ClinicQuestion";
import { ArrowUpRight } from "lucide-react";
import horse from "@/assets/horse-health-ai.jpg";
import { PublicPage } from "@/components/layout/PublicPage";

export const Route = createFileRoute("/information-desk")({
  head: () => ({
    meta: [
      { title: "Information Desk · Love Vet AI" },
      { name: "description", content: "A curated editorial hub for better pet care: veterinary innovations, nutrition, supplements, pet travel and animal world news." },
      { property: "og:title", content: "Information Desk · Love Vet AI" },
      { property: "og:description", content: "Editorial pet-care hub for owners, veterinary professionals and animal lovers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InformationDesk,
});

const categories = [
  { id: "innovations", title: "Veterinary Innovations" },
  { id: "nutrition", title: "Nutrition" },
  { id: "supplements", title: "Vitamins & Supplements" },
  { id: "travel", title: "Travel with Pets" },
  { id: "documents", title: "Documents & Pet Travel Requirements" },
  { id: "news", title: "Animal World News" },
];

const upcoming: Record<string, string> = {
  nutrition: "Editorial nutrition content and recipes are being prepared and will be published here.",
  supplements: "Articles about vitamins and supplements are being prepared. Always discuss supplements with a veterinarian.",
  travel: "Guides to travelling with pets are being prepared.",
  documents: "Information about pet travel documents and requirements is being prepared. Official rules vary by country.",
  news: "News from the animal world will appear here once published.",
};

function InformationDesk() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-5xl px-6 pt-14">
        <p className="text-xs font-bold tracking-[0.2em] text-deep uppercase">Information Desk</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
          <span className="text-gradient-hero">A curated hub for better pet care</span>
        </h1>
        <p className="mt-4 max-w-2xl text-navy/85">Innovations, nutrition, supplements, travel and news from the animal world.</p>
        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="lv-pill px-3 py-1 text-xs">{c.title}</a>
          ))}
        </nav>
        <ClinicQuestion />
      </section>

      <div className="mx-auto mt-12 max-w-5xl divide-y divide-ice-lum/50 px-6">
        <section id="innovations" aria-labelledby="innovations-h" className="scroll-mt-24 py-10">
          <p className="text-[0.7rem] font-bold tracking-[0.18em] text-deep uppercase">01 · Category</p>
          <h2 id="innovations-h" className="mt-2 text-2xl font-bold text-navy">Veterinary Innovations</h2>
          <article className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <img src={horse} alt="A bay horse in soft violet light with subtle health-screening data overlays" width={1536} height={1024} loading="lazy" className="w-full rounded-2xl object-cover shadow-[var(--shadow-float)]" />
            <div>
              <p className="text-[0.7rem] font-bold tracking-[0.18em] text-deep uppercase">Featured innovation</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-navy">Golden Dragon AI — Horse Health AI</h3>
              <p className="mt-1 text-sm font-semibold text-graphite">Multimodal AI health screening research for horses</p>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-navy/85">
                <p>Golden Dragon AI is developing Horse Health AI, an innovative technology project focused on earlier and more objective health screening for horses.</p>
                <p>The project explores how multimodal artificial intelligence can help identify meaningful changes in an individual horse over time and provide additional information that may support veterinary examination.</p>
                <p>Horse Health AI is being developed as a portable, non-invasive and personalized approach to equine health screening. The concept is particularly relevant to situations where changes in movement, behaviour or other health-related signals may appear before the underlying cause is clear.</p>
                <p>The goal is not to replace veterinarians or veterinary diagnosis. The technology is being developed as an additional screening and decision-support layer that can help owners and veterinary professionals recognize changes earlier and determine when further professional examination may be appropriate.</p>
                <p>Horse Health AI is currently under development by Golden Dragon AI.</p>
              </div>
              <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-ice-lum/50 pt-4 text-sm sm:grid-cols-2">
                <div><dt className="text-[0.68rem] font-semibold tracking-[0.12em] text-graphite uppercase">Project</dt><dd className="text-navy">Golden Dragon AI</dd></div>
                <div><dt className="text-[0.68rem] font-semibold tracking-[0.12em] text-graphite uppercase">Founder & AI Systems Architect</dt><dd className="text-navy">Svetlana Rumyantseva</dd></div>
                <div><dt className="text-[0.68rem] font-semibold tracking-[0.12em] text-graphite uppercase">Website</dt><dd><a href="https://www.goldendragonai.com/" target="_blank" rel="noopener noreferrer" className="text-deep hover:underline">www.goldendragonai.com</a></dd></div>
                <div><dt className="text-[0.68rem] font-semibold tracking-[0.12em] text-graphite uppercase">Contact</dt><dd><a href="mailto:srumyantseva7@gmail.com" target="_blank" rel="noopener noreferrer" className="text-deep hover:underline">srumyantseva7@gmail.com</a></dd></div>
              </dl>
              <a href="https://www.goldendragonai.com/" target="_blank" rel="noopener noreferrer" className="lv-pill mt-6 px-4 py-1.5 text-sm">
                Visit Golden Dragon AI <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </article>
        </section>

        {categories.slice(1).map((c, i) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-24 grid gap-2 py-8 sm:grid-cols-[280px_1fr] sm:gap-8">
            <div>
              <p className="text-[0.7rem] font-bold tracking-[0.18em] text-deep uppercase">0{i + 2} · Category</p>
              <h2 id={`${c.id}-h`} className="mt-1 text-xl font-bold text-navy">{c.title}</h2>
            </div>
            <p className="text-sm text-graphite sm:pt-5">{upcoming[c.id]}</p>
          </section>
        ))}
      </div>

      <section className="mx-auto mt-10 max-w-5xl border-t border-ice-lum/50 px-6 pt-10 text-center">
        <p className="text-lg font-bold text-navy">For veterinary professionals and clinics</p>
        <Link to="/join/veterinarian" className="lv-cta mt-4 h-9 px-5 text-sm">Join Love Vet AI</Link>
      </section>
    </PublicPage>
  );
}
