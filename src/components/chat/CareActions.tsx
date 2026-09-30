import { useEffect, useState } from "react";
import { indexCaseHistory } from "@/lib/history.functions";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, CheckCircle2, MessageCircle, Stethoscope, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { matchVeterinarians, type Triage, type VetMatch } from "@/lib/care.functions";
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
        <div role="status" className="mt-3 rounded-xl bg-ice p-3 font-semibold text-deep"><p className="flex items-start gap-1.5 whitespace-pre-line"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {sent}</p><Link to="/account" className="mt-2 inline-block text-xs underline">View in my account</Link></div>
      ) : mode === "booking" ? (
        <DoctorBooking ctx={ctx} triage={triage} onDone={(m) => { setSent(m); setMode("idle"); }} onCancel={() => setMode("idle")} />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {ctx.userId ? (
            <>
              <button type="button" disabled={busy} onClick={escalate} className={cn(btn, triage.suggested_destination === "clinic_staff" ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}><Stethoscope className="size-3.5" /> {busy ? "Sending…" : "Send to clinic staff"}</button>
              {triage.urgency !== "emergency" && <button type="button" onClick={() => setMode("booking")} className={cn(btn, triage.suggested_destination === "booking" ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}><CalendarDays className="size-3.5" /> Find a veterinarian & book</button>}
            </>
          ) : (
            <div className="w-full rounded-xl bg-ice/70 p-3 text-xs text-navy">
              <p>Create your Pet Owner Account to book, send this case to clinic staff, and keep your pet's profile, photos, videos and voice messages attached to the case. Next time Love Vet AI can reuse what you've already told it.</p>
              <Link to="/join/owner" search={{ redirect: "/chat" }} className={cn(btn, "mt-2 bg-primary text-primary-foreground")}>Create account or sign in</Link>
            </div>
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
const WINDOWS: { label: string; w: { from: number; to: number } | null }[] = [
  { label: "Any time", w: null },
  { label: "Morning (before 12)", w: { from: 0, to: 12 } },
  { label: "Between 12 and 3 PM", w: { from: 12, to: 15 } },
  { label: "Afternoon (12–6 PM)", w: { from: 12, to: 18 } },
  { label: "After 3 PM", w: { from: 15, to: 24 } },
  { label: "After 6 PM", w: { from: 18, to: 24 } },
];
const fmtSlot = (iso: string) => new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function DoctorBooking({ ctx, triage, onDone, onCancel }: { ctx: Ctx; triage: Triage; onDone: (m: string) => void; onCancel: () => void }) {
  const match = useServerFn(matchVeterinarians);
  const [pet, setPet] = useState(ctx.petId ?? ctx.pets[0]?.id ?? "");
  const species = ctx.pets.find((p) => p.id === pet)?.species ?? "";
  const [vets, setVets] = useState<VetMatch[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [vetId, setVetId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [type, setType] = useState(triage.urgency === "urgent" ? "Urgent visit" : "Consultation");
  const [win, setWin] = useState(0);
  const [homeVisit, setHomeVisit] = useState(false);
  const [location, setLocation] = useState("");
  const [locQuery, setLocQuery] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    setVets(null); setLoadErr(null); setVetId(null); setSlotId(null); setNote(null);
    match({ data: { species, symptoms: triage.symptoms, summary: triage.short_summary, urgency: triage.urgency, window: WINDOWS[win]!.w, homeVisit, location: locQuery } })
      .then((r) => { if (off) return; if (r.error) setLoadErr(r.error); setNote(r.note ?? null); setVets(r.vets); })
      .catch(() => { if (!off) { setLoadErr("Could not find veterinarians right now."); setVets([]); } });
    return () => { off = true; };
  }, [species, triage, match, win, homeVisit, locQuery]);

  const vet = vets?.find((v) => v.id === vetId) ?? null;
  const slot = vet?.slots.find((s) => s.id === slotId) ?? null;

  async function book() {
    if (!vet || !slot) return;
    setBusy(true); setErr(null);
    const { data: apptId, error } = await supabase.rpc("book_slot", {
      _slot_id: slot.id, _pet_id: (pet || null) as string, _intake_id: ctx.intakeId as string, _conversation_id: ctx.conversationId as string,
      _appointment_type: type, _notes: triage.short_summary,
    });
    setBusy(false);
    if (error) {
      setErr(error.message.includes("unavailable") ? "That time was just taken. Please choose another." : "Could not book this appointment. Please try again.");
      if (error.message.includes("unavailable")) setVets((vs) => vs?.map((v) => v.id === vet.id ? { ...v, slots: v.slots.filter((s) => s.id !== slot.id) } : v) ?? null);
      setSlotId(null);
      return;
    }
    const petRec = ctx.pets.find((p) => p.id === pet);
    // Attach the case package: media stay private files linked through the conversation; this snapshot labels each source.
    const media = { photos: 0, videos: 0, voice: 0 };
    if (ctx.conversationId) {
      const { data: files } = await supabase.from("uploaded_files").select("kind").eq("conversation_id", ctx.conversationId);
      for (const f of files ?? []) { if (f.kind === "photo") media.photos++; else if (f.kind === "video") media.videos++; else if (f.kind === "voice") media.voice++; }
    }
    const pkg = {
      owner_reported: { concerns: triage.symptoms, summary: triage.short_summary },
      triage: { request_type: triage.request_type, urgency: triage.urgency, destination: triage.suggested_destination, confidence: triage.confidence },
      stored_pet_profile: petRec ? { name: petRec.name, species: petRec.species, breed: petRec.breed, age: petRec.age, sex: petRec.sex } : null,
      provider: { name: vet.name, specialty: vet.specialty, provider_type: vet.provider_type, clinic: vet.clinic_name, clinic_address: vet.clinic_address },
      preference: { time_window: WINDOWS[win]!.label, home_visit: homeVisit, location: locQuery },
      media, intake_id: ctx.intakeId, triage_id: ctx.triageId,
    };
    let attached = false;
    if (apptId) {
      const { error: ue } = await supabase.from("appointments").update({ case_package: pkg, clinic_id: vet.clinic_id, visit_location: homeVisit ? locQuery : "" }).eq("id", apptId as string);
      attached = !ue;
      if (ctx.conversationId) void indexCaseHistory({ data: { conversationId: ctx.conversationId } }).catch(() => null);
    }
    const n = media.photos + media.videos + media.voice;
    onDone([
      "You’re booked",
      `Veterinarian: ${vet.name} (${vet.specialty})`,
      petRec ? `Pet: ${petRec.name} (${petRec.species})` : "",
      `Date: ${new Date(slot.starts_at).toLocaleDateString([], { dateStyle: "full" })}`,
      `Time: ${new Date(slot.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
      `Appointment type: ${type}`,
      homeVisit ? `Home visit at: ${locQuery} (stored demo service area)` : `Clinic: ${vet.clinic_name}, ${vet.clinic_address}`,
      attached ? `Case attached: summary, triage${n ? ` and ${n} private file${n > 1 ? "s" : ""} (photos/videos/voice)` : ""} shared with the veterinary team.` : "The appointment is saved; the case summary could not be attached.",
    ].filter(Boolean).join("\n"));
  }

  const input = "h-9 rounded-xl border border-silver-strong/70 bg-card px-3 text-xs text-navy outline-none focus:border-ice-lum";
  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        <label className="text-xs font-semibold text-deep">Pet <select className={input} value={pet} onChange={(e) => setPet(e.target.value)}><option value="">Not specified</option>{ctx.pets.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}</select></label>
        <label className="text-xs font-semibold text-deep">Visit type <select className={input} value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-xs font-semibold text-deep">Preferred time <select className={input} value={win} onChange={(e) => setWin(Number(e.target.value))}>{WINDOWS.map((w, i) => <option key={w.label} value={i}>{w.label}</option>)}</select></label>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-deep"><input type="checkbox" checked={homeVisit} onChange={(e) => setHomeVisit(e.target.checked)} /> I need a home visit</label>
        <form className="flex items-end gap-1.5" onSubmit={(e) => { e.preventDefault(); setLocQuery(location.trim()); }}>
          <label className="text-xs font-semibold text-deep">Your area (town or ZIP) <input className={input} value={location} maxLength={120} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Fairmont Heights" /></label>
          <button type="submit" className="h-9 rounded-full bg-ice px-3 text-xs font-semibold text-deep">Check</button>
        </form>
      </div>
      <p className="text-[0.68rem] text-graphite">Times are in the demo clinic's local time (US Eastern). The demo directory has one clinic (Willowbrook Demo Veterinary Clinic) and one home-visit veterinarian; your area is only used to check the stored home-visit service area.</p>
      <p className="text-[0.68rem] text-graphite">Matching veterinarians from the demo clinic (fictional profiles and demo availability). Matching is scheduling help, not a diagnosis.</p>
      {!vets && <p role="status" className="text-xs text-graphite">Finding matching veterinarians…</p>}
      {loadErr && <p role="alert" className="text-xs text-destructive">{loadErr}</p>}
      {note && <p role="status" className="text-xs font-semibold text-deep">{note}</p>}
      {vets && !vets.length && !loadErr && !note && <p className="text-xs text-graphite">No matching demo veterinarian is currently available.</p>}
      <ul className="space-y-2">
        {vets?.map((v) => (
          <li key={v.id} className={cn("rounded-2xl border bg-card/90 p-3", vetId === v.id ? "border-primary" : "border-ice-lum/60")}>
            <div className="flex items-start gap-3">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-ice text-xs font-bold text-deep">{v.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy">{v.name} <span className="ml-1 rounded-full bg-ice px-2 py-0.5 text-[0.6rem] font-bold text-deep uppercase">Demo veterinarian</span>{v.home_visit && <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-[0.6rem] font-bold text-deep uppercase">Home visits</span>}</p>
                <p className="text-xs text-deep">{v.title}</p>
                <p className="mt-1 text-[0.7rem] text-navy"><b>Specialty:</b> {v.specialty}{v.expertise.length ? ` · ${v.expertise.join(", ")}` : ""}</p>
                <p className="mt-1 text-xs text-graphite">{v.bio}</p>
                <p className="mt-1 text-[0.7rem] text-graphite">Species: {v.species.join(", ")} · Languages: {v.languages.join(", ")} · {v.years_experience} years' experience{v.urgent_care ? " · same-day urgent visits" : ""}</p>
                {v.home_visit && <p className="mt-1 text-[0.7rem] text-graphite">Independent · visits homes in: {v.service_area.join(", ")}</p>}
                {v.clinic_name && <p className="mt-1 text-[0.7rem] text-graphite">{v.clinic_name} · {v.clinic_address}</p>}
                <p className="mt-1 text-[0.7rem] font-semibold text-deep">Why this match: {v.reason}</p>
                <p className="mt-1 text-[0.7rem] text-graphite">Next available: {v.slots[0] ? fmtSlot(v.slots[0].starts_at) : "no open times"}</p>
                <p className="mt-1 text-[0.62rem] text-graphite">Scheduling guidance — not a veterinary diagnosis.</p>
              </div>
              {vetId !== v.id && v.slots.length > 0 && (
                <button type="button" onClick={() => { setVetId(v.id); setSlotId(null); }} className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Book</button>
              )}
            </div>
            {vetId === v.id && (
              <div className="mt-3" role="group" aria-label={`Available times with ${v.name}`}>
                <div className="flex flex-wrap gap-1.5">
                  {v.slots.map((s) => (
                    <button key={s.id} type="button" aria-pressed={slotId === s.id} onClick={() => setSlotId(s.id)}
                      className={cn("rounded-full px-3 py-1.5 text-[0.7rem] font-semibold", slotId === s.id ? "bg-primary text-primary-foreground" : "bg-ice text-deep hover:bg-ice-lum/60")}>
                      {fmtSlot(s.starts_at)}
                    </button>
                  ))}
                </div>
                {slot && <p className="mt-2 text-[0.7rem] text-navy">When you confirm, I'll attach your case summary, triage result and the photos, videos or voice messages from this conversation to the appointment so the veterinary team can review them.</p>}
                <button type="button" disabled={!slot || busy} onClick={() => void book()} className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
                  {busy ? "Booking…" : slot ? "Confirm booking" : "Choose a time"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-xs font-semibold text-deep hover:bg-ice">Back</button>
      {err && <p role="alert" className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
