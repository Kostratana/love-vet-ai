import { createFileRoute } from "@tanstack/react-router";
import { FileVideo, ImageIcon, Mic, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";

export const Route = createFileRoute("/workspace/")({
  head: () => ({
    meta: [
      { title: "Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Example of the case information a veterinary professional will receive from Love Vet AI before a visit." },
      { property: "og:title", content: "Clinic Staff Workspace · Love Vet AI" },
      { property: "og:description", content: "Sample interface showing the structure of a pre-visit case." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExampleCase,
});

const groups: { title: string; rows: [string, string][] }[] = [
  { title: "Owner information", rows: [["Name", "Sample Owner"], ["Phone", "+00 000 000 000"], ["Email", "owner@example.com"], ["Location", "Sample city"]] },
  { title: "Pet information", rows: [["Species", "Rabbit"], ["Pet name", "Sample pet"], ["Age", "3 years"], ["Sex", "Female"]] },
  { title: "Reason for visit", rows: [["Reported issue", "Eating less than usual"], ["When it started", "Two days ago"], ["Original language", "Spanish (auto-detected)"]] },
  { title: "Appointment information", rows: [["Preferred date", "Sample date"], ["Preferred time", "Morning"], ["Status", "Awaiting client confirmation"]] },
];

function ExampleCase() {
  return (
    <div>
      <PageHeader eyebrow="Clinic Staff Workspace" title="Example of the case information a veterinary professional will receive" description="Sample interface — no real patient data. This card shows the future structure of a pre-visit case prepared by Love Vet AI." />
      <article className="glass rounded-3xl p-6 sm:p-8">
        <p className="inline-block rounded-full border border-ice-lum bg-ice px-3 py-1 text-xs font-extrabold tracking-[0.14em] text-deep uppercase">Sample case · fictional</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="text-sm font-bold text-navy">{g.title}</h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                {g.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-ice-lum/30 pb-1.5"><dt className="text-deep/80">{k}</dt><dd className="text-right font-medium text-navy">{v}</dd></div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <section className="mt-8">
          <h2 className="text-sm font-bold text-navy">Original client message</h2>
          <p className="mt-2 rounded-2xl border border-ice-lum/50 bg-card/70 p-4 text-sm text-navy">"Mi conejita come menos desde hace dos días y está más quieta."</p>
          <h2 className="mt-5 text-sm font-bold text-navy">Media</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-deep">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/70 px-3 py-1"><Mic className="size-3.5" /> Voice message · transcript attached</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/70 px-3 py-1"><ImageIcon className="size-3.5" /> 2 photos</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/70 px-3 py-1"><FileVideo className="size-3.5" /> 1 short video</span>
          </div>
          <h2 className="mt-5 text-sm font-bold text-navy">AI-prepared structured summary</h2>
          <p className="mt-2 text-sm text-graphite">Owner reports reduced appetite and lower activity for two days. No diagnosis is made — the veterinarian decides.</p>
          <h2 className="mt-5 text-sm font-bold text-navy">Routing context</h2>
          <p className="mt-2 text-sm text-graphite">Matched on species support (small mammals / rabbits), service type and availability — not just distance.</p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/70 px-3 py-1 text-xs font-semibold text-deep"><ShieldCheck className="size-3.5" /> Safety status: no urgent warning signs reported</p>
        </section>
      </article>
    </div>
  );
}
