import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/locations")({
  head: () => ({
    meta: [
      { title: "Locations · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Clinic locations, opening, weekend and holiday hours." },
      { property: "og:title", content: "Locations · Love Vet AI" },
      { property: "og:description", content: "Clinic locations, opening, weekend and holiday hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Locations" description="Clinic locations, opening, weekend and holiday hours." icon={Building2} />,
});
