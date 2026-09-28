import { createFileRoute } from "@tanstack/react-router";
import { Syringe } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/services")({
  head: () => ({
    meta: [
      { title: "Services · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Veterinary services, capabilities and preparation instructions." },
      { property: "og:title", content: "Services · Love Vet AI" },
      { property: "og:description", content: "Veterinary services, capabilities and preparation instructions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Veterinary Services" description="Veterinary services your clinic offers, with capabilities and preparation instructions." icon={Syringe} />,
});
