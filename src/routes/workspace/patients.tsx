import { createFileRoute } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/patients")({
  head: () => ({
    meta: [
      { title: "Patients · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Animals seen by your clinic through Love Vet AI." },
      { property: "og:title", content: "Patients · Love Vet AI" },
      { property: "og:description", content: "Animals seen by your clinic through Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Patients" description="Animals seen by your clinic through Love Vet AI." icon={PawPrint} />,
});
