import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ratings")({
  head: () => ({
    meta: [
      { title: "Pet Owner Reviews · Love Vet AI" },
      { name: "description", content: "See what a veterinarian and clinic review looks like on Love Vet AI: five clear criteria, written after a completed visit." },
      { property: "og:title", content: "Pet Owner Reviews · Love Vet AI" },
      { property: "og:description", content: "Reviews from completed veterinary visits, rated on five clear criteria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ratings,
});

const CRITERIA = ["Attentiveness", "Professional Expertise", "Quality of Service", "Kindness to Animals", "Value for Money"] as const;

type DemoReview = { vet: string; specialty: string; initials: string; visit: string; scores: [number, number, number, number, number]; text: string; owner: string };

const DEMO: DemoReview[] = [
  { vet: "Dr. Aiko Brennan", specialty: "Veterinary dermatology", initials: "AB", visit: "Dog · ear and skin consultation", owner: "Fictional owner · Max's family",
    scores: [5, 5, 5, 5, 4],
    text: "Dr. Brennan was attentive and explained the next steps clearly. She was gentle with our dog and took time to answer our questions. The appointment felt organized and we appreciated having the case information prepared before the visit." },
  { vet: "Dr. Noor Castellan", specialty: "Exotic & small-mammal medicine", initials: "NC", visit: "Rabbit · consultation", owner: "Fictional owner · Clover's family",
    scores: [5, 5, 4, 5, 4],
    text: "Our rabbit was eating less and we were worried. Dr. Castellan already knew what we had reported and had seen the video, so the visit started right away. She handled Clover calmly and explained everything in plain language." },
  { vet: "Dr. Sofia Lindqvist", specialty: "Feline medicine", initials: "SL", visit: "Cat · routine checkup", owner: "Fictional owner · Miso's family",
    scores: [4, 5, 4, 5, 4],
    text: "A calm, unhurried checkup for a very nervous cat. Dr. Lindqvist let Miso settle before examining her and gave us clear notes on what to watch at home. Waiting time was short." },
];

function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} aria-hidden className={cn(size === "lg" ? "size-5" : "size-3.5", n <= Math.round(value) ? "fill-primary text-primary" : "text-silver-strong")} strokeWidth={1.5} />)}
    </span>
  );
}

function ReviewCard({ r }: { r: DemoReview }) {
  const overall = r.scores.reduce((a, b) => a + b, 0) / r.scores.length;
  return (
    <article className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-start gap-4">
        <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-ice font-bold text-deep">{r.initials}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.62rem] font-extrabold tracking-[0.14em] text-primary uppercase">Demo review · Fictional</p>
          <h2 className="text-lg font-bold text-navy">{r.vet}</h2>
          <p className="text-sm text-graphite">{r.specialty} · Willowbrook Demo Veterinary Clinic</p>
          <p className="text-xs text-graphite">{r.visit}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold text-navy">{overall.toFixed(1)}</p>
          <Stars value={overall} size="lg" />
          <p className="text-[0.65rem] text-graphite">Overall</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {CRITERIA.map((c, i) => (
          <div key={c} className="flex items-center justify-between gap-3 border-b border-ice-lum/30 pb-1.5">
            <dt className="text-sm text-navy">{c}</dt>
            <dd className="flex items-center gap-2"><Stars value={r.scores[i]!} /><span className="w-3 text-xs font-bold text-deep">{r.scores[i]}</span></dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm leading-relaxed text-navy/85">"{r.text}"</p>
      <p className="mt-2 text-xs text-graphite">{r.owner}</p>
    </article>
  );
}

function Ratings() {
  return (
    <PublicPage>
      <div className="mx-auto max-w-4xl px-6 pt-14 pb-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Ratings</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl"><span className="text-gradient-hero">Pet Owner Reviews</span></h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">Reviews from completed veterinary visits help owners understand the experience with a veterinarian or clinic.</p>
        <p className="mt-2 text-sm text-graphite">The examples below are fictional demo reviews showing how a review looks. Real reviews can only be written after a completed Love Vet AI appointment.</p>

        <div className="mt-10 space-y-5">{DEMO.map((r) => <ReviewCard key={r.vet} r={r} />)}</div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-ice-lum/40 pt-6">
          <Link to="/review" search={{}} className="lv-cta inline-flex h-10 items-center gap-1.5 px-5 text-sm">Write a Review <ArrowRight className="size-4" /></Link>
          <p className="text-sm text-graphite">Reviews are available after a completed visit.</p>
        </div>
      </div>
    </PublicPage>
  );
}
