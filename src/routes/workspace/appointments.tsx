import { createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader } from "@/components/workspace/PageHeader";
import { GlowButton, StatusBadge } from "@/components/kit/primitives";
import { appointments } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Scheduled visits across all locations, showing which bookings were completed by AI intake and which needed staff.",
      },
      { property: "og:title", content: "Appointments · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Network-wide appointment schedule with AI versus staff booking source.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Appointments,
});

function Appointments() {
  return (
    <div>
      <PageHeader
        eyebrow="Appointments"
        title="Schedule"
        description="Every booking carries its intake context, so the veterinarian opens the room already informed."
        actions={<GlowButton size="sm">New appointment</GlowButton>}
      />
      <DataTable
        columns={["Time", "Patient", "Service", "Veterinarian", "Location", "Source", "Status"]}
        rows={appointments.map((a) => [
          <span key="t" className="font-medium">
            {a.time}
          </span>,
          a.patient,
          a.service,
          a.veterinarian,
          a.location,
          <StatusBadge key="src" tone={a.source === "AI Intake" ? "info" : "neutral"}>
            {a.source}
          </StatusBadge>,
          <StatusBadge key="s" tone={a.status === "CONFIRMED" ? "success" : "attention"}>
            {a.status}
          </StatusBadge>,
        ])}
      />
    </div>
  );
}
