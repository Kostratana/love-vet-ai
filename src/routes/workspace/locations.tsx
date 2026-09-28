import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { FieldLabel, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { locations, veterinarians } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/locations")({
  head: () => ({
    meta: [
      { title: "Locations · Clinic Staff Workspace" },
      {
        name: "description",
        content:
          "Clinic sites with service mix, assigned veterinarians and next available appointment for each location.",
      },
      { property: "og:title", content: "Locations · Clinic Staff Workspace" },
      {
        property: "og:description",
        content: "Multi-site configuration: services, team and availability per clinic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Locations,
});

function Locations() {
  return (
    <div>
      <PageHeader
        eyebrow="Locations"
        title="Clinic network"
        description="Each site carries its own services, team and availability, so routing respects real capacity."
        actions={<GlowButton size="sm">Add location</GlowButton>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations.map((l) => (
          <GlassCard key={l.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-semibold text-navy">{l.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-graphite">
                  <MapPin className="size-3.5 text-deep" aria-hidden /> {l.area}
                </p>
              </div>
              <StatusBadge tone="info">{l.nextAvailable}</StatusBadge>
            </div>

            <div className="mt-4">
              <FieldLabel>Services</FieldLabel>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {l.services.map((s) => (
                  <StatusBadge key={s}>{s}</StatusBadge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel>Veterinarians</FieldLabel>
              <ul className="mt-1.5 space-y-1 text-sm text-navy">
                {veterinarians
                  .filter((v) => v.locationIds.includes(l.id))
                  .map((v) => (
                    <li key={v.id}>
                      {v.name} · <span className="text-graphite">{v.specialty}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
