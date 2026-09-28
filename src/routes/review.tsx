import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Field, PageShell, SectionTitle, Select, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";
import { useAccount } from "@/lib/account-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Leave a Review · Love Vet AI" },
      { name: "description", content: "Rate the veterinarian and clinic after a completed Love Vet AI appointment." },
      { property: "og:title", content: "Leave a Review · Love Vet AI" },
      { property: "og:description", content: "Verified visit reviews help pet owners choose and help clinics improve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Review,
});

function Stars({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <span className="text-sm font-medium text-navy">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} of 5`} onClick={() => onChange(n)} className="p-0.5">
            <Star className={cn("size-6 transition-colors", n <= value ? "fill-primary text-primary" : "text-silver-strong")} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  );
}

function YesNo({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <span className="text-sm font-medium text-navy">{label}</span>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
            className={cn("rounded-full border px-4 py-1.5 text-xs font-semibold", value === v ? "border-primary bg-primary text-primary-foreground" : "border-silver-strong/70 bg-card text-graphite")}>
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

const RATINGS = ["Overall experience", "Veterinarian", "Clinic / service", "Quality of care", "Communication", "Service experience"] as const;

function Review() {
  const { owner } = useAccount();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [r, setR] = useState<Record<string, number>>({});
  const [recVet, setRecVet] = useState<boolean | null>(null);
  const [recClinic, setRecClinic] = useState<boolean | null>(null);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (ready && !owner) navigate({ to: "/join/owner", search: { redirect: "/review" } }); }, [ready, owner, navigate]);
  if (!owner) return <div className="ambient-bg min-h-screen" />;

  if (done) {
    return (
      <PublicPage>
        <PageShell narrow title="Thank you for sharing your experience.">
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-deep" strokeWidth={1.5} />
            <p className="mt-4 text-graphite">Your feedback helps other pet owners and supports continuous improvement in veterinary care.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/account" className={buttonVariants({ variant: "secondary" })}>My Account</Link>
              <Link to="/" className={buttonVariants({ variant: "ghost" })}>Home</Link>
            </div>
          </div>
        </PageShell>
      </PublicPage>
    );
  }

  return (
    <PublicPage>
      <PageShell
        narrow
        eyebrow="Leave a Review"
        title="Verified Visit Review"
        intro={<p>Reviews from completed Love Vet AI appointments help other pet owners make informed choices and help veterinary professionals and clinics improve their services.</p>}
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <SectionTitle>Your visit</SectionTitle>
            <Field label="Completed visit / appointment">
              <Select defaultValue="">
                <option value="" disabled>No completed Love Vet AI appointments yet</option>
              </Select>
            </Field>
            <p className="flex items-start gap-2 text-xs text-graphite">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-deep" />
              Once appointments are connected, only completed visits can be reviewed, and the veterinarian and clinic fill in automatically.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Veterinarian"><TextInput placeholder="From your completed visit" /></Field>
              <Field label="Veterinary clinic"><TextInput placeholder="From your completed visit" /></Field>
            </div>
          </div>
          <div className="glass divide-y divide-silver/70 rounded-3xl px-6 py-3 sm:px-8">
            {RATINGS.map((k) => <Stars key={k} label={k} value={r[k] ?? 0} onChange={(n) => setR({ ...r, [k]: n })} />)}
          </div>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <Field label="Written review"><TextArea rows={5} placeholder="What went well? What could be better?" /></Field>
            <div className="divide-y divide-silver/70">
              <YesNo label="Would you recommend this veterinarian?" value={recVet} onChange={setRecVet} />
              <YesNo label="Would you recommend this clinic?" value={recClinic} onChange={setRecClinic} />
            </div>
          </div>
          <div className="flex justify-end"><GlowButton type="submit" size="lg">Submit Review</GlowButton></div>
          <p className="text-xs text-graphite">Preview: reviews are not stored or published until verified appointments are connected.</p>
        </form>
      </PageShell>
    </PublicPage>
  );
}
