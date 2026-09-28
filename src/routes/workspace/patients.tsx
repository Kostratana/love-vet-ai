import { Link, createFileRoute } from "@tanstack/react-router";
import { Camera, ClipboardList, FileText, Mic, PawPrint, User, Video } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";

export const Route = createFileRoute("/workspace/patients")({
  head: () => ({
    meta: [
      { title: "Patients · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Patient cards with each pet and the information its owner shared before the visit." },
      { property: "og:title", content: "Patients · Love Vet AI" },
      { property: "og:description", content: "Patient cards with each pet and the owner's pre-visit information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Patients,
});

const fields = [
  { icon: PawPrint, label: "Pet photo, name, species, age, breed" },
  { icon: User, label: "Owner and linked appointment / case" },
  { icon: FileText, label: "Owner's description and reported complaint" },
  { icon: Camera, label: "Uploaded photos" },
  { icon: Video, label: "Uploaded video" },
  { icon: Mic, label: "Voice message and transcript" },
  { icon: ClipboardList, label: "Case status" },
];

function Patients() {
  return (
    <div>
      <PageHeader eyebrow="Clinic Staff Workspace" title="Patients" description="See each animal together with everything its owner shared before the visit." />
      <div className="glass rounded-3xl p-6 sm:p-8">
        <p className="font-bold text-navy">No patients yet</p>
        <p className="mt-1 max-w-xl text-sm text-graphite">
          When your clinic is connected, every pet booked through Love Vet AI will appear here as a patient card. Each card will show:
        </p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {fields.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5 text-sm text-navy">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ice-lum/70 bg-card/70 text-deep"><f.icon className="size-4" strokeWidth={1.6} /></span>
              {f.label}
            </li>
          ))}
        </ul>
        <Link to="/workspace" className="mt-6 inline-block text-sm font-semibold text-deep hover:underline">See the example veterinary case →</Link>
      </div>
    </div>
  );
}
