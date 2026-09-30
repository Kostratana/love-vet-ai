import type { ReactNode } from "react";
import { CalendarDays, FileVideo, History, ImageIcon, Mic, PawPrint, ShieldCheck, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

/** One normalized pre-visit case. Filled from the fictional sample OR from a real booked appointment. */
export type CaseView = {
  kind: "sample" | "real";
  owner: { name: string; phone: string; email: string; location: string };
  pet: { name: string; species: string; breed: string; age: string; sex: string; notes?: string };
  reported: { reason: string; started: string; concerns: string[]; quote?: string; quoteLanguage?: string };
  intake: [string, string][];
  triage: { urgency: string; summary: string; destination: string; confidence: number | null } | null;
  media: { id: string; kind: "photo" | "video" | "voice"; label: string; url?: string | undefined; transcript?: string | null; observation?: string | null; ocr?: string | null; duration?: string }[];
  history?: { id: string; date: string; vet: string | null; snippets: string[]; media: string; similarity?: number }[];
  appointment: { vet: string; specialty: string; clinic: string; address: string; when: string; type: string; status: string; homeVisit?: string | undefined };
};

const Tag = ({ children, tone = "ice" }: { children: ReactNode; tone?: "ice" | "ai" | "owner" | "triage" }) => (
  <span className={cn("rounded-full px-2 py-0.5 text-[0.6rem] font-extrabold tracking-[0.1em] uppercase",
    tone === "owner" ? "bg-primary/15 text-deep" : tone === "ai" ? "bg-[rgb(245_205_230/0.7)] text-deep" : tone === "triage" ? "bg-destructive/10 text-destructive" : "bg-ice text-deep")}>{children}</span>
);

function Block({ n, title, tag, children }: { n: number; title: string; tag?: ReactNode; children: ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-ice-lum/40 py-5 sm:grid-cols-[11rem_1fr]">
      <div>
        <h3 className="flex items-baseline gap-2 text-sm font-bold text-navy"><span className="font-mono text-xs text-primary">{String(n).padStart(2, "0")}</span>{title}</h3>
        {tag && <div className="mt-1.5">{tag}</div>}
      </div>
      <div className="min-w-0 text-sm text-navy">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-ice-lum/25 pb-1.5">
          <dt className="text-graphite">{k}</dt><dd className="text-right font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MediaTile({ m, sample }: { m: CaseView["media"][number]; sample: boolean }) {
  const Icon = m.kind === "photo" ? ImageIcon : m.kind === "video" ? FileVideo : Mic;
  return (
    <div className="rounded-2xl border border-ice-lum/60 bg-card/70 p-3">
      <div className="flex items-center gap-2 text-xs font-bold text-deep"><Icon className="size-3.5" /> {m.label}{m.duration && <span className="font-medium text-graphite">· {m.duration}</span>}{sample && <Tag>Sample attachment</Tag>}</div>
      <div className="mt-2">
        {m.url && m.kind === "photo" && <img src={m.url} alt={`${m.label} submitted by the owner`} className="max-h-52 rounded-xl" />}
        {m.url && m.kind === "video" && <video src={m.url} controls className="max-h-56 rounded-xl" />}
        {m.url && m.kind === "voice" && <audio src={m.url} controls className="w-full" />}
        {!m.url && (
          <div className="grid h-24 place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(221_210_255/0.7),rgb(245_205_230/0.6))] text-deep/70">
            <Icon className="size-6" aria-hidden /><span className="sr-only">Original file placeholder</span>
          </div>
        )}
      </div>
      {m.transcript && <p className="mt-2 text-xs"><Tag tone="owner">Owner's words · transcript</Tag> <span className="mt-1 block italic">"{m.transcript}"</span></p>}
      {m.observation && <p className="mt-2 text-xs whitespace-pre-line"><Tag tone="ai">AI observed · not a diagnosis</Tag> <span className="mt-1 block text-graphite">{m.observation}</span></p>}
      {m.ocr && <p className="mt-1 text-xs text-graphite"><b>Text in image:</b> {m.ocr}</p>}
    </div>
  );
}

export function PreVisitCaseView({ c }: { c: CaseView }) {
  const sample = c.kind === "sample";
  return (
    <article className="rounded-3xl border border-ice-lum/60 bg-card/60 px-5 pb-2 shadow-[var(--shadow-glass)] backdrop-blur sm:px-7">
      <header className="flex flex-wrap items-center gap-4 py-5">
        <span className="grid size-14 place-items-center rounded-full border border-ice-lum bg-[linear-gradient(135deg,rgb(221_210_255),rgb(245_205_230))] text-deep"><PawPrint className="size-6" /></span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-[0.68rem] font-extrabold tracking-[0.14em] uppercase", sample ? "text-primary" : "text-deep")}>{sample ? "Sample case · Fictional · No real patient data" : "Booked patient case"}</p>
          <p className="text-xl font-bold text-navy">{c.pet.name} · {c.pet.species}</p>
          <p className="text-sm text-graphite">{c.reported.reason}</p>
        </div>
        <div className="rounded-2xl bg-ice/80 px-4 py-2 text-right text-xs text-navy">
          <p className="font-bold">{c.appointment.when}</p>
          <p className="text-graphite">{c.appointment.vet}</p>
        </div>
      </header>

      <Block n={1} title="Owner"><div className="flex gap-2"><User className="mt-0.5 size-4 shrink-0 text-deep" /><div className="flex-1"><Rows rows={[["Name", c.owner.name], ["Phone", c.owner.phone], ["Email", c.owner.email], ["Location", c.owner.location]]} /></div></div></Block>
      <Block n={2} title="Pet" tag={<Tag>Stored pet profile</Tag>}>
        <Rows rows={[["Name", c.pet.name], ["Species", c.pet.species], ["Breed", c.pet.breed], ["Age", c.pet.age], ["Sex", c.pet.sex]]} />
        {c.pet.notes && <p className="mt-2 text-xs text-graphite">{c.pet.notes}</p>}
      </Block>
      <Block n={3} title="Reason for visit" tag={<Tag tone="owner">Owner reported</Tag>}>
        <Rows rows={[["Concern", c.reported.reason], ["Started", c.reported.started]]} />
        {c.reported.concerns.length > 0 && <p className="mt-2 text-xs text-graphite">Reported: {c.reported.concerns.join(" · ")}</p>}
        {c.reported.quote && <p className="mt-2 border-l-2 border-primary/50 pl-3 italic">"{c.reported.quote}"{c.reported.quoteLanguage && <span className="ml-1 not-italic text-xs text-graphite">({c.reported.quoteLanguage})</span>}</p>}
      </Block>
      <Block n={4} title="Intake" tag={<Tag tone="owner">Collected by Love Vet AI</Tag>}>
        {c.intake.length ? <Rows rows={c.intake} /> : <p className="text-graphite">No additional intake answers recorded.</p>}
      </Block>
      <Block n={5} title="Triage" tag={<Tag tone="triage">Routing support</Tag>}>
        {c.triage ? (
          <>
            <p className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-ice px-2.5 py-0.5 text-xs font-bold text-deep">Urgency: {c.triage.urgency}</span><span className="text-xs text-graphite">Next step: {c.triage.destination}{c.triage.confidence != null && ` · confidence ${Math.round(c.triage.confidence * 100)}%`}</span></p>
            {c.triage.summary && <p className="mt-2">{c.triage.summary}</p>}
          </>
        ) : <p className="text-graphite">No triage recorded.</p>}
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-deep"><ShieldCheck className="size-3.5" /> Routing support — not a veterinary diagnosis. The veterinarian decides.</p>
      </Block>
      <Block n={6} title="Case materials" tag={<Tag tone="ai"><Sparkles className="mr-0.5 inline size-2.5" />Voice · photo · video</Tag>}>
        {c.media.length ? <div className="grid gap-3 md:grid-cols-2">{c.media.map((m) => <MediaTile key={m.id} m={m} sample={sample} />)}</div> : <p className="text-graphite">No photos, videos or voice messages were attached.</p>}
      </Block>
      <Block n={7} title="Appointment" tag={<Tag>Retrieved clinic / provider data</Tag>}>
        <div className="flex gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-deep" /><div className="flex-1"><Rows rows={[["Veterinarian", c.appointment.vet], ["Specialty", c.appointment.specialty], ["Clinic", c.appointment.clinic], ["Address", c.appointment.address], ["Home visit at", c.appointment.homeVisit ?? ""], ["Date & time", c.appointment.when], ["Type", c.appointment.type], ["Status", c.appointment.status]]} /></div></div>
      </Block>
      <Block n={8} title="Relevant patient history" tag={<Tag>Retrieved patient history</Tag>}>
        {c.history?.length ? (
          <ul className="space-y-2">
            {c.history.map((h) => (
              <li key={h.id} className="rounded-2xl border border-ice-lum/50 bg-card/60 p-3">
                <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-deep"><History className="size-3.5" /> {h.date}{h.vet && <span className="font-medium text-graphite">· {h.vet}</span>}{h.media && <span className="font-medium text-graphite">· {h.media}</span>}{sample && <Tag>Fictional</Tag>}</p>
                {h.snippets.map((t, i) => <p key={i} className="mt-1 text-xs whitespace-pre-line text-navy/85">{t}</p>)}
              </li>
            ))}
            <li className="text-xs text-graphite">Semantically related previous cases for this pet only — continuity, not a diagnosis.</li>
          </ul>
        ) : <p className="text-graphite">No related previous cases stored for this pet.</p>}
      </Block>
    </article>
  );
}
