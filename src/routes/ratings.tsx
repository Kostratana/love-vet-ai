import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";

export const Route = createFileRoute("/ratings")({
  head: () => ({
    meta: [
      { title: "Ratings · Top Veterinary Clinics & Professionals · Love Vet AI" },
      { name: "description", content: "Discover highly rated veterinary clinics and professionals, ranked by verified Love Vet AI reviews from completed visits." },
      { property: "og:title", content: "Ratings · Love Vet AI" },
      { property: "og:description", content: "Verified ratings of veterinary clinics and professionals — coming as real reviews arrive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ratings,
});

const clinicFilters = ["Species", "Specialty", "Location", "Service", "Rating"];
const specialties = ["General Veterinary Care", "Emergency Care", "Exotic Animals", "Small Animals", "Surgery", "Dermatology", "Orthopedics", "Ophthalmology", "Diagnostic Imaging"];

function RankingSection({
  id, icon: Icon, eyebrow, title, intro, filters, columns, empty,
}: { id: string; icon: LucideIcon; eyebrow: string; title: string; intro: string; filters: string[]; columns: string[]; empty: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full border border-ice-lum/70 bg-white/40 text-deep"><Icon className="size-4" strokeWidth={1.6} aria-hidden /></span>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>
      </div>
      <h2 id={`${id}-h`} className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-graphite">{intro}</p>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filters (available once ratings exist)">
        {filters.map((f) => (
          <span key={f} className="rounded-full border border-white/50 bg-white/30 px-3 py-1 text-xs font-semibold text-deep/70 backdrop-blur">{f}</span>
        ))}
      </div>

      <div className="mt-6 hidden grid-cols-[3rem_2fr_1fr_1fr_1fr] gap-4 border-b border-ice-lum/50 pb-2 text-[0.68rem] font-semibold tracking-[0.12em] text-primary/70 uppercase sm:grid">
        <span>#</span>{columns.map((c) => <span key={c}>{c}</span>)}
      </div>
      <div className="py-12 text-center">
        <p className="font-semibold text-deep">{empty}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-graphite">Only reviews linked to a completed appointment will count. No sample ratings are shown.</p>
      </div>
    </section>
  );
}

function Ratings() {
  return (
    <PublicPage>
      <div className="mx-auto max-w-5xl px-6 pt-14 pb-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Ratings</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl"><span className="text-gradient-hero">Highly rated veterinary care</span></h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">
          Discover veterinary clinics and professionals through verified reviews from pet owners who completed a visit.
          Ratings help you choose, but species and specialty suitability always come first.
        </p>
        <nav aria-label="Ratings sections" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <a href="#clinics" className="text-deep hover:underline">Top Veterinary Clinics</a>
          <a href="#professionals" className="text-deep hover:underline">Top Veterinary Professionals</a>
        </nav>

        <div className="mt-16 space-y-20">
          <RankingSection
            id="clinics" icon={Building2} eyebrow="Clinics" title="Top Veterinary Clinics"
            intro="Future rankings will show each clinic's location, verified rating and review count, species supported, services, specialties, emergency availability and a short review summary."
            filters={clinicFilters} columns={["Clinic", "Verified rating", "Species", "Emergency"]}
            empty="Clinic ratings will appear here as verified Love Vet AI reviews become available."
          />
          <RankingSection
            id="professionals" icon={Stethoscope} eyebrow="Professionals" title="Top Veterinary Professionals"
            intro="Future rankings will show each veterinarian's photo, clinic, specialty, species treated, verified rating, review count and a short professional profile."
            filters={specialties} columns={["Veterinarian", "Verified rating", "Specialty", "Clinic"]}
            empty="Veterinarian ratings will appear here as verified Love Vet AI reviews become available."
          />
        </div>

        <p className="mt-16 border-t border-ice-lum/40 pt-6 text-sm text-graphite">
          Had a completed visit?{" "}
          <Link to="/review" search={{}} className="inline-flex items-center gap-1 font-semibold text-deep hover:underline">Write a review <ArrowRight className="size-3.5" /></Link>
        </p>
      </div>
    </PublicPage>
  );
}
