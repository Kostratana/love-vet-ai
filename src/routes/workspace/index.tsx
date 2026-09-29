import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, FileText, ImageIcon, PawPrint, ShieldCheck, User } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { VoiceNote } from "@/components/care/VoiceNote";
import { sampleCase as c } from "@/lib/sample-case";

export const Route = createFileRoute("/workspace/")({
  head: () => ({
    meta: [
      { title: "Pre-Visit Cases · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "One coherent pre-visit case per pet: owner, animal, reported problem, media, documents and appointment." },
      { property: "og:title", content: "Pre-Visit Cases · Love Vet AI" },
      { property: "og:description", content: "Understand the reason for the visit before the owner arrives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PreVisitCase,
});

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-ice-lum/40 py-6 sm:grid-cols-[11rem_1fr]">
      <h2 className="flex items-baseline gap-2 text-sm font-bold text-navy">
        <span className="font-mono text-xs text-primary">{String(n).padStart(2, "0")}</span>{title}
      </h2>
      <div className="min-w-0 text-sm text-navy">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-ice-lum/25 pb-1.5">
          <dt className="text-deep/75">{k}</dt><dd className="text-right font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Thumb({ label, video }: { label: string; video?: boolean }) {
  return (
    <div className="relative grid aspect-square w-24 place-items-center rounded-xl border border-ice-lum/60 bg-[linear-gradient(135deg,rgb(221_210_255/0.7),rgb(245_205_230/0.6))]">
      {video ? (
        <button type="button" disabled title="Playback available when media storage is connected" className="grid size-9 place-items-center rounded-full bg-card/90 text-deep shadow">▶</button>
      ) : <ImageIcon className="size-6 text-deep/70" aria-hidden />}
      <span className="absolute bottom-1 left-1.5 text-[0.62rem] font-semibold text-deep">{label}</span>
    </div>
  );
}

function PreVisitCase() {
  return (
    <div>
      <PageHeader eyebrow="Clinic Staff Workspace · Cases" title="Pre-Visit Case" description="Everything the owner shared with Love Vet AI, organised so the veterinarian understands the reason for the visit before the owner arrives. Sample interface — no real patient data." />

      <article className="px-1">
        <header className="flex flex-wrap items-center gap-4 pb-6">
          <span className="grid size-16 place-items-center rounded-full border border-ice-lum bg-[linear-gradient(135deg,rgb(221_210_255),rgb(245_205_230))] text-deep"><PawPrint className="size-7" /></span>
          <div>
            <p className="text-[0.68rem] font-extrabold tracking-[0.14em] text-primary uppercase">Sample case · fictional</p>
            <p className="font-display text-xl font-semibold text-navy">{c.pet.name} · {c.pet.species}</p>
            <p className="text-sm text-graphite">{c.reason} · {c.visitType} · {c.status}</p>
          </div>
        </header>

        <Block n={1} title="Owner"><div className="flex gap-2"><User className="mt-0.5 size-4 text-deep" /><Rows rows={[["Name", c.owner.name], ["Phone", c.owner.phone], ["Email", c.owner.email], ["Location", c.owner.location]]} /></div></Block>
        <Block n={2} title="Pet"><Rows rows={[["Species", c.pet.species], ["Breed", c.pet.breed], ["Age", c.pet.age], ["Sex", c.pet.sex]]} /></Block>
        <Block n={3} title="Reason for visit"><Rows rows={[["Reported problem", c.reason], ["Started", c.started], ["Context", c.context]]} /></Block>
        <Block n={4} title="Owner's description">
          <p className="border-l-2 border-primary/50 pl-3 italic">"{c.originalMessage}"</p>
          <p className="mt-1 text-xs text-graphite">Original language: {c.originalLanguage}</p>
        </Block>
        <Block n={5} title="AI-prepared information">
          <p>{c.summary}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-deep"><ShieldCheck className="size-3.5" /> Safety check: no urgent warning signs reported</p>
        </Block>
        <Block n={6} title="Photos"><div className="flex flex-wrap gap-2"><Thumb label="Photo 1" /><Thumb label="Photo 2" /></div></Block>
        <Block n={7} title="Videos"><div className="flex flex-wrap gap-2"><Thumb label="Video · 0:12" video /></div></Block>
        <Block n={8} title="Voice + transcript"><VoiceNote language="Spanish" durationSeconds={14} transcript={c.originalMessage} /></Block>
        <Block n={9} title="Documents & medical information">
          <p className="flex items-center gap-2 text-graphite"><FileText className="size-4 text-deep" /> No documents submitted.</p>
          <p className="mt-1 text-xs text-graphite">Previous medical reports, laboratory results, examination records and discharge documents shared by the owner will appear here.</p>
        </Block>
        <Block n={10} title="Visit history">
          <p><span className="rounded-full bg-ice px-2.5 py-0.5 text-xs font-bold text-deep">First visit</span></p>
          <p className="mt-2 text-xs text-graphite">For returning patients this area lists previous visits, earlier reported problems, past appointments and previously shared media — once clinic records are connected.</p>
        </Block>
        <Block n={11} title="Appointment">
          <div className="flex gap-2"><CalendarDays className="mt-0.5 size-4 text-deep" /><Rows rows={[["Preferred", c.appointment.preferred], ["Veterinary professional", c.appointment.professional], ["Status", c.status]]} /></div>
        </Block>
      </article>
    </div>
  );
}
