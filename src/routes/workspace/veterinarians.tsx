import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

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
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Veterinarians" description="Your veterinarians, specialties, species and schedules." icon={Stethoscope} />,
});
