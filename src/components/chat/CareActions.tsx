import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, CheckCircle2, MessageCircle, Stethoscope, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Triage } from "@/lib/care.functions";
import type { Pet } from "@/lib/account-store";
import { cn } from "@/lib/utils";

const URG: Record<Triage["urgency"], { label: string; cls: string }> = {
  routine: { label: "Routine", cls: "bg-ice text-deep" },
  soon: { label: "See a vet soon", cls: "bg-ice text-deep" },
  urgent: { label: "Urgent — today", cls: "bg-destructive/10 text-destructive" },
  emergency: { label: "Possible emergency", cls: "bg-destructive text-primary-foreground" },
};
const DEST: Record<Triage["suggested_destination"], string> = {
  ai: "Continue with Love Vet AI",
  clinic_staff: "Clinic staff review",
  information_desk: "Information Desk",
  booking: "Book a veterinary appointment",
};

type Ctx = { userId: string | null; conversationId: string | null; intakeId: string | null; triageId: string | null; petId: string | null; pets: Pet[] };

export function RoutingCard({ triage, ctx, onContinue }: { triage: Triage; ctx: Ctx; onContinue: () => void }) {
  const [mode, setMode] = useState<"idle" | "booking">("idle");
  const [sent, setSent] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const u = URG[triage.urgency];

  async function escalate() {
    if (!ctx.userId) return;
    setBusy(true); setErr(null);
    const { error } = await supabase.from("clinic_staff_requests").insert({
      user_id: ctx.userId, pet_id: ctx.petId, intake_id: ctx.intakeId, triage_id: ctx.triageId, conversation_id: ctx.conversationId,
      summary: triage.short_summary, symptoms: triage.symptoms, urgency: triage.urgency, status: "new",
    });
    setBusy(false);
    if (error) return setErr("Could not send to clinic staff. Please try again.");
    setSent("Sent to clinic staff. They will review your case, photos and videos.");
  }

  const btn = "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors";
  return (
    <div className="ml-12 max-w-[85%] rounded-2xl border border-ice-lum/70 bg-card/85 p-4 text-sm text-navy shadow-[var(--shadow-glass)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.7rem] font-bold tracking-[0.08em] text-deep uppercase">Suggested next step</span>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold", u.cls)}>{u.label}</span>
        <span className="text-[0.7rem] text-graphite">{DEST[triage.suggested_destination]} · confidence {Math.round(triage.confidence * 100)}%</span>
      </div>
      {triage.urgency === "emergency" && (
        <p className="mt-2 flex items-start gap-1.5 font-semibold text-destructive"><TriangleAlert className="mt-0.5 size-4 shrink-0" /> Contact an emergency veterinarian right away. Do not wait for an appointment.</p>
      )}
      {triage.short_summary && <p className="mt-2 text-graphite">{triage.short_summary}</p>}
      {triage.symptoms.length > 0 && <p className="mt-1 text-xs text-graphite">Reported: {triage.symptoms.join(", ")}</p>}
      <p className="mt-2 text-[0.68rem] text-graphite">This is routing help, not a diagnosis. A veterinarian decides.</p>

      {sent ? (
        <p role="status" className="mt-3 flex items-center gap-1.5 font-semibold text-deep"><CheckCircle2 className="size-4" /> {sent}</p>
      ) : mode === "booking" ? (
        <BookingForm ctx={ctx} triage={triage} onDone={(m) => { setSent(m); setMode("idle"); }} onCancel={() => setMode("idle")} />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {ctx.userId ? (
            <>
              <button type="button" disabled={busy} onClick={escalate} className={cn(btn, triage.suggested_destination === "clinic_staff" ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}><Stethoscope className="size-3.5" /> {busy ? "Sending…" : "Send to clinic staff"}</button>
              <button type="button" onClick={() => setMode("booking")} className={cn(btn, triage.suggested_destination === "booking" ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}><CalendarDays className="size-3.5" /> Book appointment</button>
            </>
          ) : (
            <Link to="/join/owner" search={{ redirect: "/chat" }} className={cn(btn, "bg-primary text-primary-foreground")}>Sign in to send to clinic staff or book</Link>
          )}
          <Link to="/information-desk" className={cn(btn, triage.suggested_destination === "information_desk" ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}><BookOpen className="size-3.5" /> Information Desk</Link>
          <button type="button" onClick={onContinue} className={cn(btn, "text-deep hover:bg-ice")}><MessageCircle className="size-3.5" /> Keep chatting</button>
        </div>
      )}
      {err && <p role="alert" className="mt-2 text-xs text-destructive">{err}</p>}
    </div>
  );
}

const TYPES = ["Consultation", "Follow-up", "Vaccination", "Routine checkup", "Urgent visit"];

function BookingForm({ ctx, triage, onDone, onCancel }: { ctx: Ctx; triage: Triage; onDone: (m: string) => void; onCancel: () => void }) {
  const [when, setWhen] = useState("");
  const [type, setType] = useState(triage.urgency === "urgent" ? "Urgent visit" : "Consultation");
  const [pet, setPet] = useState(ctx.petId ?? ctx.pets[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = "h-10 w-full rounded-xl border border-silver-strong/70 bg-card px-3 text-sm text-navy outline-none focus:border-ice-lum";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ctx.userId) return;
    const d = new Date(when);
    if (!when || isNaN(d.getTime()) || d.getTime() < Date.now()) return setErr("Please choose a future date and time.");
    setBusy(true); setErr(null);
    const { error } = await supabase.from("appointments").insert({
      user_id: ctx.userId, pet_id: pet || null, intake_id: ctx.intakeId, conversation_id: ctx.conversationId,
      requested_at: d.toISOString(), appointment_type: type, status: "requested", notes: notes || triage.short_summary,
    });
    setBusy(false);
    if (error) return setErr("Could not save the appointment. Please try again.");
    onDone(`Appointment requested for ${d.toLocaleString()} (${type}). Status: requested — the clinic will confirm. See it in your account.`);
  }

  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-2">
      <label className="text-xs font-semibold text-deep">Date & time<input type="datetime-local" required className={input} value={when} onChange={(e) => setWhen(e.target.value)} /></label>
      <label className="text-xs font-semibold text-deep">Type<select className={input} value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
      <label className="text-xs font-semibold text-deep">Pet<select className={input} value={pet} onChange={(e) => setPet(e.target.value)}><option value="">Not specified</option>{ctx.pets.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}</select></label>
      <label className="text-xs font-semibold text-deep">Notes<input className={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" /></label>
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Request appointment"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-xs font-semibold text-deep hover:bg-ice">Cancel</button>
      </div>
      {err && <p role="alert" className="text-xs text-destructive sm:col-span-2">{err}</p>}
    </form>
  );
}
