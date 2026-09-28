import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/workspace/PageHeader";
import { FieldLabel, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { locationById, veterinarians } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/veterinarians")({
  head: () => ({
    meta: [
      { title: "Veterinarians · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Veterinary team profiles with specialties, spoken languages and the locations where each clinician sees patients.",
      },
      { property: "og:title", content: "Veterinarians · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Team specialties and languages drive how intake requests are matched.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Veterinarians,
});

function Veterinarians() {
  return (
    <div>
      <PageHeader
        eyebrow="Team"
        title="Veterinarians"
        description="Specialty and language data is what lets intake match an owner to the right clinician."
        actions={<GlowButton size="sm">Invite veterinarian</GlowButton>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {veterinarians.map((v) => (
          <GlassCard key={v.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl surface-ice border border-silver-strong/60 font-display text-sm font-semibold text-deep">
                {v.initials}
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-navy">{v.name}</h2>
                <p className="text-xs text-graphite">{v.specialty}</p>
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel>Languages</FieldLabel>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {v.languages.map((l) => (
                  <StatusBadge key={l} tone="info">
                    {l}
                  </StatusBadge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel>Locations</FieldLabel>
              <ul className="mt-1.5 space-y-1 text-sm text-navy">
                {v.locationIds.map((id) => (
                  <li key={id}>{locationById(id)?.name}</li>
                ))}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
