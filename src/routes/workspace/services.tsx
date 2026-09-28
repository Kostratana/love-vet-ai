import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader } from "@/components/workspace/PageHeader";
import { GlowButton, StatusBadge } from "@/components/kit/primitives";
import { locations, services } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/services")({
  head: () => ({
    meta: [
      { title: "Services · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Consultation types, durations, routing categories and which locations offer each veterinary service.",
      },
      { property: "og:title", content: "Services · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Service catalogue and routing categories used by AI chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title="Service catalogue"
        description="Routing categories map reported concerns to a bookable consultation type — never to a diagnosis."
        actions={<GlowButton size="sm">Add service</GlowButton>}
      />
      <DataTable
        columns={["Service", "Routing category", "Duration", "Offered at"]}
        rows={services.map((s) => [
          <span key="n" className="font-semibold">
            {s.name}
          </span>,
          <StatusBadge key="c" tone="info">
            {s.category}
          </StatusBadge>,
          `${s.durationMin} min`,
          <span key="l" className="text-xs text-graphite">
            {locations
              .filter((l) => l.services.includes(s.category))
              .map((l) => l.name)
              .join(", ") || "—"}
          </span>,
        ])}
      />
    </div>
  );
}
