import { useState } from "react";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { Field, SectionTitle, Select, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

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

export const RATINGS = ["Overall experience", "Veterinarian", "Clinic / service", "Quality of care", "Communication", "Service experience"] as const;

export function ReviewForm() {
  const [done, setDone] = useState(false);
  const [r, setR] = useState<Record<string, number>>({});
  const [recVet, setRecVet] = useState<boolean | null>(null);
  const [recClinic, setRecClinic] = useState<boolean | null>(null);
  // No real completed visits exist yet, so submission stays locked.
  const canSubmit = false;
  if (done) return <div className="glass rounded-3xl p-8 text-center"><CheckCircle2 className="mx-auto size-8 text-deep" /><p className="mt-3 text-graphite">Thank you for sharing your experience.</p></div>;
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2"><SectionTitle>Your visit</SectionTitle><span className="rounded-full border border-silver-strong/70 bg-card/70 px-3 py-1 text-[0.7rem] font-bold tracking-[0.1em] text-graphite uppercase">Verified visit status: no completed visit</span></div>
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
          <div className="flex justify-end"><GlowButton type="submit" size="lg" disabled={!canSubmit} className="disabled:cursor-not-allowed disabled:opacity-50">Submit Review</GlowButton></div>
          <p className="text-xs text-graphite">Preview: reviews are not stored or published until verified appointments are connected.</p>
        </form>
  );
}
