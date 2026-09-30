import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/workspace/veterinarians")({
  head: () => ({
    meta: [
      { title: "Veterinarians · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Your veterinarians, specialties, species and schedules." },
      { property: "og:title", content: "Veterinarians · Love Vet AI" },
      { property: "og:description", content: "Your veterinarians, specialties, species and schedules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VetsPage,
});

type Vet = { id: string; name: string; title: string; species: string[]; languages: string[]; interests: string[]; years_experience: number; bio: string; availability: string; initials: string; is_demo: boolean };

function VetsPage() {
  const [vets, setVets] = useState<Vet[] | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    supabase.from("veterinarians").select("id,name,title,species,languages,interests,years_experience,bio,availability,initials,is_demo").eq("active", true).order("name")
      .then(({ data, error }) => { if (error) setErr(true); setVets((data as Vet[]) ?? []); });
  }, []);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold tracking-[0.08em] text-deep uppercase">Clinic Staff Workspace</p>
        <h1 className="text-2xl font-bold text-navy">Veterinarians</h1>
        <p className="text-sm text-graphite">Demo clinic profiles — fictional people used for the Challenge booking flow.</p>
      </div>
      {!vets && <p role="status" className="text-sm text-graphite">Loading veterinarians…</p>}
      {err && <p role="alert" className="text-sm text-destructive">Could not load veterinarians.</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {vets?.map((v) => (
          <li key={v.id} className="glass rounded-2xl p-4 text-sm text-navy">
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center rounded-full bg-ice font-bold text-deep">{v.initials}</span>
              <div><p className="font-bold">{v.name} {v.is_demo && <span className="ml-1 rounded-full bg-ice px-2 py-0.5 text-[0.6rem] font-bold text-deep uppercase">Demo</span>}</p><p className="text-xs text-deep">{v.title}</p></div>
            </div>
            <p className="mt-2 text-graphite">{v.bio}</p>
            <p className="mt-2 text-xs text-graphite">Species: {v.species.join(", ")}</p>
            <p className="text-xs text-graphite">Interests: {v.interests.join(", ")}</p>
            <p className="text-xs text-graphite">Languages: {v.languages.join(", ")} · {v.years_experience} yrs · {v.availability}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
