import { Link, createFileRoute } from "@tanstack/react-router";
import { BookOpen, Building2, Lightbulb, Megaphone, Package, ShoppingBag, Sparkles, Star, Stethoscope, Wrench } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { buttonVariants } from "@/components/kit/primitives";

export const Route = createFileRoute("/information-desk")({
  head: () => ({
    meta: [
      { title: "Information Desk · Love Vet AI" },
      { name: "description", content: "A curated information hub for clinics, veterinary professionals, pet products, services and pet-care news — coming to Love Vet AI." },
      { property: "og:title", content: "Information Desk · Love Vet AI" },
      { property: "og:description", content: "Future curated discovery of clinics, professionals, pet products and pet-care information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InformationDesk,
});

const areas = [
  { icon: Building2, title: "Featured Clinics" },
  { icon: Stethoscope, title: "Veterinary Professionals" },
  { icon: ShoppingBag, title: "Pet Stores" },
  { icon: Package, title: "Pet Products & New Products" },
  { icon: Wrench, title: "Pet Services" },
  { icon: Lightbulb, title: "Veterinary Innovations" },
  { icon: Sparkles, title: "What's New" },
  { icon: Star, title: "Partner Spotlight" },
  { icon: BookOpen, title: "Useful Pet-Care Information" },
  { icon: Megaphone, title: "Sponsored Placements" },
];

function InformationDesk() {
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <p className="text-xs font-bold tracking-[0.2em] text-deep uppercase">Information Desk</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"><span className="text-gradient-hero">A curated hub for pet care</span></h1>
        <p className="mt-4 max-w-2xl text-graphite">
          The Information Desk will bring together clinics, veterinary professionals, pet products, services and
          useful pet-care information. No partners are connected yet — every section below is waiting for real content.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/join/veterinarian" className={buttonVariants({ size: "lg" })}><Stethoscope /> Clinic / Veterinarian Registration</Link>
          <Link to="/join/business" className={buttonVariants({ size: "lg", variant: "secondary" })}><ShoppingBag /> Register a Pet-Care Business</Link>
        </div>
      </section>
      <section aria-label="Future content" className="mx-auto grid max-w-6xl gap-4 px-6 pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <article key={a.title} className="glass hover-lift rounded-3xl p-6">
            <span className="grid size-10 place-items-center rounded-full border border-ice-lum/70 bg-card/70 text-deep"><a.icon className="size-[18px]" strokeWidth={1.6} /></span>
            <h2 className="mt-4 text-lg font-bold text-navy">{a.title}</h2>
            <p className="mt-1 text-sm text-graphite">Coming soon — nothing is published here yet.</p>
          </article>
        ))}
      </section>
    </PublicPage>
  );
}
