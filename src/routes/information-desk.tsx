import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ShoppingBag, Stethoscope, UserRound, X } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { EmptyState } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";

export const Route = createFileRoute("/professionals")({
  head: () => ({
    meta: [
      { title: "Professionals & Clinics · Love Vet AI" },
      { name: "description", content: "The future Love Vet AI veterinary network: veterinarians, clinics and pet-care businesses. Register your practice." },
      { property: "og:title", content: "Professionals & Clinics · Love Vet AI" },
      { property: "og:description", content: "Register as a veterinarian, clinic or pet-care business on Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Professionals,
});

const example: [string, string][] = [
  ["Professional title", "Doctor of Veterinary Medicine"],
  ["Specialization", "Small & exotic mammals, general practice"],
  ["Animal species treated", "Rabbits, guinea pigs, hamsters, ferrets, cats"],
  ["Professional experience", "Example: 8 years"],
  ["Education / qualifications", "Example: DVM, exotic animal medicine certificate"],
  ["Languages spoken", "English, Spanish"],
  ["Services", "Consultations, dental checks, preventive care"],
  ["Clinic affiliation", "Example clinic (not a real clinic)"],
  ["Location", "Example city"],
  ["Availability", "Example: Mon–Fri, 9:00–17:00"],
  ["Consultation price range", "Example range set by the clinic"],
  ["Verified rating", "Appears after verified completed visits"],
  ["Verified reviews", "None — example profile"],
];

function Professionals() {
  const [open, setOpen] = useState(false);
  return (
    <PublicPage>
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <p className="text-xs font-bold tracking-[0.2em] text-deep uppercase">Page 3 · Veterinary network</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"><span className="text-gradient-hero">Professionals & Clinics</span></h1>
        <p className="mt-4 max-w-2xl text-graphite">
          The future Love Vet AI ecosystem connects pet owners with suitable veterinarians, clinics and
          pet-care businesses — matched by species, service and capability first.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/workspace/clinic-setup" className={buttonVariants({ size: "lg" })}><Building2 /> Register a Clinic</Link>
          <Link to="/join/veterinarian" className={buttonVariants({ size: "lg", variant: "secondary" })}><Stethoscope /> Register as a Veterinarian</Link>
          <Link to="/join/business" className={buttonVariants({ size: "lg", variant: "secondary" })}><ShoppingBag /> Register a Pet-Care Business</Link>
        </div>
      </section>

      <section aria-labelledby="vets" className="mx-auto max-w-6xl px-6 pt-16">
        <h2 id="vets" className="text-2xl font-bold">Veterinarians</h2>
        <article className="glass hover-lift mt-5 rounded-3xl p-6 sm:p-8">
          <p className="inline-block rounded-full border border-ice-lum bg-ice px-3 py-1 text-xs font-extrabold tracking-[0.14em] text-deep uppercase">Example Veterinarian Profile</p>
          <p className="mt-3 text-sm font-medium text-graphite">
            This is an example of how a veterinarian's professional profile may appear on Love Vet AI. No real veterinarian is represented.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-[10rem_1fr]">
            <div className="grid aspect-square w-40 place-items-center rounded-2xl border border-dashed border-ice-lum bg-card/60 text-deep" aria-label="Photo placeholder">
              <UserRound className="size-12" strokeWidth={1.2} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Dr. Example Name <span className="text-sm font-semibold text-graphite">(fictional)</span></h3>
              <p className="mt-2 text-sm text-graphite">
                Professional description: an example veterinarian focused on calm, species-appropriate care for small and exotic mammals.
              </p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {example.map(([k, v]) => (
                  <div key={k} className="border-b border-silver/80 pb-2"><dt className="text-xs font-semibold text-deep">{k}</dt><dd className="text-navy">{v}</dd></div>
                ))}
              </dl>
              <GlowButton className="mt-5" onClick={() => setOpen(true)}>View Profile</GlowButton>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pt-16 md:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="mb-3 text-xl font-bold">Veterinary Clinics</h2>
          <EmptyState icon={Building2} title="No participating clinics are connected yet." action={<Link to="/workspace/clinic-setup" className={buttonVariants({ variant: "secondary" })}>Register a Clinic</Link>}>
            Professional clinic profiles will appear here as the Love Vet AI network grows.
          </EmptyState>
        </div>
        <div className="glass rounded-3xl p-6">
          <h2 className="mb-3 text-xl font-bold">Pet Stores & Pet-Care Businesses</h2>
          <EmptyState icon={ShoppingBag} title="Registered pet-care businesses will appear here." action={<Link to="/join/business" className={buttonVariants({ variant: "secondary" })}>Register a Pet-Care Business</Link>} />
        </div>
      </section>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Example veterinarian profile" className="fixed inset-0 z-[60] grid place-items-center bg-navy/30 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass page-enter w-full max-w-lg rounded-3xl bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-extrabold tracking-[0.14em] text-deep uppercase">Example profile</p>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="size-4" /></button>
            </div>
            <p className="mt-3 text-sm text-graphite">
              Full veterinarian profiles — schedule, services, clinic locations and verified reviews — will open here once real
              veterinarians join Love Vet AI. This example does not represent a real person.
            </p>
            <Link to="/join/veterinarian" className={buttonVariants() + " mt-5"}>Register as a Veterinarian</Link>
          </div>
        </div>
      )}
    </PublicPage>
  );
}
