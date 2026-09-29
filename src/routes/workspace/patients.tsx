import { Link, createFileRoute } from "@tanstack/react-router";
import { FileText, ImageIcon, Mic, PawPrint, Video } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { sampleCase as c } from "@/lib/sample-case";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace/patients")({
  head: () => ({
    meta: [
      { title: "Patients · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "A visual list of pets, their owners, current reason for visit and submitted media." },
      { property: "og:title", content: "Patients · Love Vet AI" },
      { property: "og:description", content: "Each pet with its owner, reason for visit and submitted media." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Patients,
});

function Indicator({ icon: Icon, label, count }: { icon: typeof ImageIcon; label: string; count: number }) {
  return (
    <span title={`${count} ${label}`} className={cn("inline-flex items-center gap-1 text-xs", count ? "text-deep" : "text-graphite/50")}>
      <Icon className="size-3.5" aria-hidden />{count}<span className="sr-only"> {label}</span>
    </span>
  );
}

function Patients() {
  return (
    <div>
      <PageHeader eyebrow="Clinic Staff Workspace" title="Patients" description="Each pet with its owner, the reason for the current visit and everything submitted before it. Sample interface — no real patient data." />
      <ul className="divide-y divide-ice-lum/40 border-y border-ice-lum/40">
        <li>
          <Link to="/workspace" className="flex flex-wrap items-center gap-4 px-1 py-4 transition-colors hover:bg-card/40">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ice-lum bg-[linear-gradient(135deg,rgb(221_210_255),rgb(245_205_230))] text-deep"><PawPrint className="size-5" /></span>
            <div className="min-w-[10rem] flex-1">
              <p className="font-semibold text-navy">{c.pet.name} <span className="text-xs font-normal text-graphite">· {c.pet.species} · {c.pet.age}</span></p>
              <p className="text-xs text-graphite">{c.owner.name} · {c.reason}</p>
            </div>
            <div className="flex gap-3">
              <Indicator icon={ImageIcon} label="photos" count={c.media.photos} />
              <Indicator icon={Video} label="videos" count={c.media.videos} />
              <Indicator icon={Mic} label="voice messages" count={c.media.voice} />
              <Indicator icon={FileText} label="files" count={c.media.files} />
            </div>
            <span className="text-xs font-semibold text-deep">{c.visitType} · {c.status}</span>
            <span className="text-sm font-semibold text-primary">Open Patient →</span>
          </Link>
        </li>
      </ul>
      <p className="mt-4 text-xs text-graphite">Fictional example row. Real patients appear here once your clinic is connected and owners book through Love Vet AI.</p>
    </div>
  );
}
