import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Confirmed appointments booked through Love Vet AI." },
      { property: "og:title", content: "Appointments · Love Vet AI" },
      { property: "og:description", content: "Confirmed appointments booked through Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Appointments" description="Confirmed appointments booked through Love Vet AI." icon={CalendarDays} />,
});
