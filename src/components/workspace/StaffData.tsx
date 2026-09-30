import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, FileVideo, ImageIcon, Inbox, Mic, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account-store";
import { cn } from "@/lib/utils";

/** Explains access state when the viewer is not verified clinic staff. Returns null for staff. */
export function StaffGate({ children }: { children: React.ReactNode }) {
  const { user, isStaff, loading } = useAccount();
  if (loading) return <p role="status" className="glass mb-6 rounded-2xl p-4 text-sm text-graphite">Checking access…</p>;
  if (isStaff) return <>{children}</>;
  return (
    <div className="glass mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm text-navy">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-deep" />
      <p>
        {user
          ? "Your account is not yet verified as clinic staff, so real client cases are hidden. Love Vet AI enables access after verifying your clinic."
          : <>Real client cases are visible only to verified clinic staff. <Link to="/join/veterinarian" className="font-semibold text-deep hover:underline">Register your clinic</Link> or sign in.</>}
      </p>
    </div>
  );
}

type Req = {
  id: string; created_at: string; status: string; summary: string; symptoms: string[]; urgency: string; conversation_id: string | null; intake_id: string | null; user_id: string;
  pet: { name: string; species: string; breed: string | null; age: string | null } | null;
  owner: { first_name: string; last_name: string; email: string; phone: string } | null;
  files: { id: string; kind: string; storage_path: string; transcription: string | null; analysis: string | null; ocr_text: string | null; analysis_status: string; url?: string | undefined }[];
};

const STATUSES = ["new", "in_review", "contacted", "closed"];

export function StaffRequests({ onCount }: { onCount?: (n: number) => void }) {
  const { isStaff } = useAccount();
  const [rows, setRows] = useState<Req[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("clinic_staff_requests").select("*, pet:pets(name,species,breed,age)").order("created_at", { ascending: false }).limit(50);
    if (error) { setErr("Could not load requests."); setRows([]); return; }
    const userIds = [...new Set(data.map((r) => r.user_id))];
    const convIds = data.map((r) => r.conversation_id).filter((x): x is string => !!x);
    const [{ data: owners }, { data: files }] = await Promise.all([
      userIds.length ? supabase.from("profiles").select("id,first_name,last_name,email,phone").in("id", userIds) : Promise.resolve({ data: [] as never[] }),
      convIds.length ? supabase.from("uploaded_files").select("id,kind,storage_path,transcription,conversation_id,analysis,ocr_text,analysis_status").in("conversation_id", convIds) : Promise.resolve({ data: [] as never[] }),
    ]);
    const signed = await Promise.all((files ?? []).map(async (f) => ({ ...f, url: (await supabase.storage.from("chat-media").createSignedUrl(f.storage_path, 3600)).data?.signedUrl })));
    const out: Req[] = data.map((r) => ({
      ...r,
      pet: (r as unknown as { pet: Req["pet"] }).pet,
      owner: owners?.find((o) => o.id === r.user_id) ?? null,
      files: signed.filter((f) => f.conversation_id === r.conversation_id),
    }));
    setRows(out);
    onCount?.(out.length);
  }, [onCount]);

  useEffect(() => { if (isStaff) void load(); }, [isStaff, load]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("clinic_staff_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return setErr("Could not update status.");
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
  }

  if (!isStaff) return null;
  if (!rows) return <p role="status" className="mb-6 text-sm text-graphite">Loading client requests…</p>;
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-lg font-bold text-navy">Client requests</h2>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      {rows.length === 0 && (
        <div className="glass flex items-center gap-3 rounded-2xl p-5 text-sm text-graphite"><Inbox className="size-5 text-deep" /> No client requests yet. Cases sent from Chat with AI appear here.</div>
      )}
      {rows.map((r) => (
        <article key={r.id} className="glass rounded-2xl p-5 text-sm text-navy">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">{r.pet ? `${r.pet.name} · ${r.pet.species}` : "Pet not specified"}</p>
            <span className={cn("rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold", r.urgency === "emergency" || r.urgency === "urgent" ? "bg-destructive/10 text-destructive" : "bg-ice text-deep")}>{r.urgency}</span>
            <span className="text-xs text-graphite">{new Date(r.created_at).toLocaleString()}</span>
            <select aria-label="Request status" value={r.status} onChange={(e) => void setStatus(r.id, e.target.value)} className="ml-auto h-8 rounded-full border border-silver-strong/70 bg-card px-3 text-xs font-semibold">
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <p className="mt-1 text-xs text-graphite">Owner: {r.owner ? `${r.owner.first_name} ${r.owner.last_name}`.trim() || r.owner.email : "—"}{r.owner?.email && ` · ${r.owner.email}`}{r.owner?.phone && ` · ${r.owner.phone}`}</p>
          {r.summary && <p className="mt-2">{r.summary}</p>}
          {r.symptoms.length > 0 && <p className="mt-1 text-xs text-graphite">Reported: {r.symptoms.join(", ")}</p>}
          {r.files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {r.files.map((f) => f.kind === "photo" && f.url ? (
                <a key={f.id} href={f.url} target="_blank" rel="noreferrer"><img src={f.url} alt="Owner photo" className="size-20 rounded-xl border border-ice-lum/60 object-cover" /></a>
              ) : f.kind === "video" && f.url ? (
                <video key={f.id} src={f.url} controls className="h-20 rounded-xl border border-ice-lum/60" />
              ) : f.kind === "voice" ? (
                <div key={f.id} className="max-w-xs rounded-xl border border-ice-lum/60 bg-card/70 p-2 text-xs">
                  <p className="flex items-center gap-1 font-semibold text-deep"><Mic className="size-3" /> Voice message</p>
                  {f.url && <audio src={f.url} controls className="mt-1 h-8 w-full" />}
                  {f.transcription && <p className="mt-1 text-graphite">{f.transcription}</p>}
                </div>
              ) : (
                <span key={f.id} className="inline-flex items-center gap-1 text-xs text-graphite">{f.kind === "video" ? <FileVideo className="size-3" /> : <ImageIcon className="size-3" />} file</span>
              ))}
            </div>
          )}
          {r.files.some((f) => f.analysis || f.ocr_text || f.analysis_status === "failed") && (
            <div className="mt-3 space-y-2 text-xs">
              {r.files.map((f, i) => (f.analysis || f.ocr_text || f.analysis_status === "failed") && (
                <div key={f.id} className="rounded-xl bg-card/70 p-3">
                  <p className="font-semibold text-deep">{f.kind === "video" ? "Video" : "Photo"} {i + 1} · automated observations (not a diagnosis)</p>
                  {f.analysis_status === "failed" && <p className="text-graphite">Automated analysis was unavailable — please review the file.</p>}
                  {f.analysis && <p className="mt-1 whitespace-pre-line text-navy">{f.analysis}</p>}
                  {f.ocr_text && <p className="mt-1 whitespace-pre-line text-graphite"><b>Text in image:</b> {f.ocr_text}</p>}
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

type Appt = { id: string; requested_at: string; appointment_type: string; status: string; notes: string; pet: { name: string; species: string } | null; vet: { name: string } | null; reviewed?: boolean };

export function AppointmentList({ scope, empty, header }: { scope: "own" | "staff"; empty?: React.ReactNode; header?: React.ReactNode }) {
  const { user, isStaff } = useAccount();
  const [rows, setRows] = useState<Appt[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const enabled = scope === "own" ? !!user : isStaff;

  useEffect(() => {
    if (!enabled) return;
    let q = supabase.from("appointments").select("id,requested_at,appointment_type,status,notes,pet:pets(name,species),vet:veterinarians(name)").order("requested_at");
    if (scope === "own" && user) q = q.eq("user_id", user.id);
    q.then(async ({ data, error }) => {
      if (error) setErr("Could not load appointments.");
      const list = (data as unknown as Appt[]) ?? [];
      if (scope === "own" && list.some((a) => a.status === "completed")) {
        const { data: rv } = await supabase.from("reviews").select("appointment_id");
        const done = new Set((rv ?? []).map((r) => r.appointment_id));
        list.forEach((a) => { a.reviewed = done.has(a.id); });
      }
      setRows(list);
    });
  }, [enabled, scope, user]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("appointments").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return setErr("Could not update the appointment.");
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
  }

  if (!enabled) return null;
  if (!rows) return <p role="status" className="text-sm text-graphite">Loading appointments…</p>;
  if (err) return <p role="alert" className="text-sm text-destructive">{err}</p>;
  if (!rows.length) return <>{empty ?? null}</>;
  return (
    <>{header}<ul className="space-y-2">
      {rows.map((a) => (
        <li key={a.id} className="glass rounded-2xl px-4 py-3 text-sm text-navy"><div className="flex flex-wrap items-center gap-3">
          <CalendarDays className="size-4 text-deep" />
          <span className="font-semibold">{new Date(a.requested_at).toLocaleString()}</span>
          <span className="text-graphite">{a.appointment_type}{a.pet && ` · ${a.pet.name} (${a.pet.species})`}{a.vet && ` · ${a.vet.name}`}</span>
          {scope === "staff" ? (
            <select aria-label="Appointment status" value={a.status} onChange={(e) => void setStatus(a.id, e.target.value)} className="ml-auto h-8 rounded-full border border-silver-strong/70 bg-card px-3 text-xs font-semibold">
              {["requested", "confirmed", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}
            </select>
          ) : (
            <span className="ml-auto flex items-center gap-2">
              <span className="rounded-full bg-ice px-2.5 py-0.5 text-xs font-bold text-deep">{a.status}</span>
              {(a.status === "requested" || a.status === "confirmed") && new Date(a.requested_at) > new Date() && <button type="button" onClick={() => void setStatus(a.id, "cancelled")} className="text-xs font-semibold text-graphite hover:text-destructive">Cancel</button>}
              {a.status === "completed" && (a.reviewed ? <span className="text-xs text-graphite">Reviewed</span> : <Link to="/review" search={{ appointment: a.id }} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Rate this visit</Link>)}
            </span>
          )}
          </div>
          {scope === "staff" && <CasePackage apptId={a.id} />}
        </li>
      ))}
    </ul></>
  );
}

type Pkg = {
  owner_reported?: { concerns?: string[]; summary?: string };
  triage?: { request_type?: string; urgency?: string; destination?: string; confidence?: number };
  stored_pet_profile?: { name?: string; species?: string; breed?: string; age?: string; sex?: string } | null;
  provider?: { name?: string; specialty?: string; provider_type?: string; clinic?: string; clinic_address?: string };
  preference?: { time_window?: string; home_visit?: boolean; location?: string };
};

/** Pre-visit case package for staff: owner, pet, owner-reported concern, triage, provider, original private media + AI observations. */
function CasePackage({ apptId }: { apptId: string }) {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<null | {
    pkg: Pkg; notes: string; visit_location: string;
    owner: { first_name: string; last_name: string; email: string; phone: string } | null;
    pet: { name: string; species: string; breed: string | null; age: string | null; sex: string | null } | null;
    files: { id: string; kind: string; transcription: string | null; analysis: string | null; ocr_text: string | null; url?: string | undefined }[];
  }>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (!open || d) return;
    (async () => {
      const { data: a, error } = await supabase.from("appointments").select("user_id,conversation_id,case_package,notes,visit_location,pet:pets(name,species,breed,age,sex)").eq("id", apptId).single();
      if (error || !a) return setErr(true);
      const [{ data: owner }, { data: files }] = await Promise.all([
        supabase.from("profiles").select("first_name,last_name,email,phone").eq("id", a.user_id).maybeSingle(),
        a.conversation_id ? supabase.from("uploaded_files").select("id,kind,storage_path,transcription,analysis,ocr_text").eq("conversation_id", a.conversation_id).order("created_at") : Promise.resolve({ data: [] as never[] }),
      ]);
      const signed = await Promise.all((files ?? []).map(async (f) => ({ ...f, url: (await supabase.storage.from("chat-media").createSignedUrl(f.storage_path, 3600)).data?.signedUrl })));
      setD({ pkg: (a.case_package ?? {}) as Pkg, notes: a.notes, visit_location: a.visit_location, owner: owner ?? null, pet: (a as unknown as { pet: NonNullable<typeof d>["pet"] }).pet, files: signed });
    })();
  }, [open, d, apptId]);
  const H = ({ children }: { children: React.ReactNode }) => <p className="mt-3 text-[0.68rem] font-bold tracking-[0.08em] text-deep uppercase">{children}</p>;
  return (
    <div className="mt-2">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="text-xs font-semibold text-deep hover:underline">{open ? "Hide case package" : "Open pre-visit case package"}</button>
      {open && !d && !err && <p role="status" className="mt-2 text-xs text-graphite">Loading case…</p>}
      {err && <p role="alert" className="mt-2 text-xs text-destructive">Could not load this case.</p>}
      {d && (
        <div className="mt-2 rounded-xl bg-card/70 p-3 text-xs">
          <H>Owner</H>
          <p>{d.owner ? `${d.owner.first_name} ${d.owner.last_name}`.trim() || "Name not provided" : "Not available"}{d.owner?.phone && ` · ${d.owner.phone}`}{d.owner?.email && ` · ${d.owner.email}`}</p>
          <H>Stored pet profile</H>
          <p>{d.pet ? [d.pet.name, d.pet.species, d.pet.breed, d.pet.age, d.pet.sex].filter(Boolean).join(" · ") : "No pet selected"}</p>
          <H>Owner reported</H>
          <p>{d.pkg.owner_reported?.summary || d.notes || "—"}</p>
          {!!d.pkg.owner_reported?.concerns?.length && <p className="text-graphite">Concerns: {d.pkg.owner_reported.concerns.join(", ")}</p>}
          {d.pkg.triage && <><H>Triage result (routing, not a diagnosis)</H><p>{d.pkg.triage.request_type} · urgency {d.pkg.triage.urgency} · {d.pkg.triage.destination}</p></>}
          {d.pkg.provider && <><H>Retrieved clinic / provider data</H><p>{d.pkg.provider.name} ({d.pkg.provider.specialty}) · {d.pkg.provider.clinic || "Independent"}{d.pkg.provider.clinic_address && `, ${d.pkg.provider.clinic_address}`}</p></>}
          {d.visit_location && <p>Home visit location: {d.visit_location}</p>}
          {d.pkg.preference?.time_window && <p className="text-graphite">Owner time preference: {d.pkg.preference.time_window}</p>}
          <H>Case materials (original private files)</H>
          {!d.files.length && <p className="text-graphite">No photos, videos or voice messages were attached.</p>}
          <div className="space-y-2">
            {d.files.map((f) => (
              <div key={f.id} className="rounded-lg border border-ice-lum/50 p-2">
                {f.kind === "photo" && f.url && <img src={f.url} alt="Owner-submitted photo" className="max-h-48 rounded-lg" />}
                {f.kind === "video" && f.url && <video src={f.url} controls className="max-h-56 rounded-lg" />}
                {f.kind === "voice" && f.url && <audio src={f.url} controls className="w-full" />}
                {f.transcription && <p className="mt-1"><b>Voice transcript (owner's words):</b> {f.transcription}</p>}
                {f.analysis && <p className="mt-1 whitespace-pre-line text-graphite"><b>AI observed (not a diagnosis):</b> {f.analysis}</p>}
                {f.ocr_text && <p className="mt-1 text-graphite"><b>Text in image:</b> {f.ocr_text}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
