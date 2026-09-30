import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Field, PageShell, SectionTitle, Select, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";
import { useAccount } from "@/lib/account-store";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
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
  validateSearch: (s) => z.object({ appointment: z.string().uuid().optional() }).parse(s),
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

type Visit = { id: string; requested_at: string; appointment_type: string; veterinarian_id: string | null; clinic_id: string | null; vet: { name: string } | null; clinic: { name: string } | null };

function Review() {
  const { owner, user } = useAccount();
  const { appointment } = Route.useSearch();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [sel, setSel] = useState(appointment ?? "");
  const [overall, setOverall] = useState(0);
  const [vetR, setVetR] = useState(0);
  const [matched, setMatched] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (ready && !owner) navigate({ to: "/join/owner", search: { redirect: "/review" } }); }, [ready, owner, navigate]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: appts }, { data: rv }] = await Promise.all([
        supabase.from("appointments").select("id,requested_at,appointment_type,veterinarian_id,clinic_id,vet:veterinarians(name),clinic:clinics(name)").eq("user_id", user.id).eq("status", "completed").order("requested_at", { ascending: false }),
        supabase.from("reviews").select("appointment_id"),
      ]);
      const done = new Set((rv ?? []).map((r) => r.appointment_id));
      const list = ((appts as unknown as Visit[]) ?? []).filter((a) => !done.has(a.id));
      setVisits(list);
      setSel((s) => (list.some((v) => v.id === s) ? s : list[0]?.id ?? ""));
    })();
  }, [user]);
  if (!owner) return <div className="ambient-bg min-h-screen" />;
  const visit = visits?.find((v) => v.id === sel) ?? null;

  async function submit() {
    if (!visit || !user || !overall || !vetR) return setErr("Choose a completed visit and give both star ratings.");
    setBusy(true); setErr(null);
    const { error } = await supabase.from("reviews").insert({ user_id: user.id, appointment_id: visit.id, veterinarian_id: visit.veterinarian_id, clinic_id: visit.clinic_id, overall_rating: overall, vet_rating: vetR, matched_expectations: matched, comment: comment.slice(0, 3000) });
    setBusy(false);
    if (error) return setErr("Could not save your review. Only completed visits can be reviewed, once.");
    setDone(true);
  }

  if (done) {
    return (
      <PublicPage>
        <PageShell narrow title="Thank you for sharing your experience.">
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-deep" strokeWidth={1.5} />
            <p className="mt-4 text-graphite">Your review is saved and linked to this visit and veterinarian.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/account" className={buttonVariants({ variant: "secondary" })}>My Account</Link>
              <Link to="/" className={buttonVariants({ variant: "ghost" })}>Home</Link>
            </div>
          </div>
        </PageShell>
      </PublicPage>
    );
  }

  const locked = !visits?.length;
  return (
    <PublicPage>
      <PageShell narrow eyebrow="Leave a Review" title="Verified Visit Review"
        intro={<p>Only completed Love Vet AI appointments can be reviewed. Your review is linked to the visit, veterinarian and clinic.</p>}>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <SectionTitle>Your visit</SectionTitle>
            <Field label="Completed visit / appointment">
              <Select value={sel} onChange={(e) => setSel(e.target.value)} disabled={locked}>
                {locked ? <option value="">{visits ? "No completed visits to review yet" : "Loading…"}</option> : visits!.map((v) => <option key={v.id} value={v.id}>{new Date(v.requested_at).toLocaleDateString()} · {v.appointment_type}{v.vet ? ` · ${v.vet.name}` : ""}</option>)}
              </Select>
            </Field>
            <p className="flex items-start gap-2 text-xs text-graphite"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-deep" /> The veterinarian and clinic come from your completed appointment.</p>
            {visit && <p className="text-sm text-navy">{visit.vet?.name ?? "Veterinarian"} · {visit.clinic?.name ?? "Independent / home visit"}</p>}
          </div>
          <div className="glass divide-y divide-silver/70 rounded-3xl px-6 py-3 sm:px-8">
            <Stars label="Overall experience" value={overall} onChange={setOverall} />
            <Stars label="Veterinarian" value={vetR} onChange={setVetR} />
            <YesNo label="Did the visit match your expectations?" value={matched} onChange={setMatched} />
          </div>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <Field label="Written review (optional)"><TextArea rows={5} maxLength={3000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What went well? What could be better?" /></Field>
          </div>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <div className="flex justify-end"><GlowButton type="submit" size="lg" disabled={locked || busy}>{busy ? "Saving…" : "Submit Review"}</GlowButton></div>
        </form>
      </PageShell>
    </PublicPage>
  );
}
