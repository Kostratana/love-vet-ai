import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/settings")({
  head: () => ({
    meta: [
      { title: "Clinic Settings · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Organization details, team access and clinic knowledge." },
      { property: "og:title", content: "Clinic Settings · Love Vet AI" },
      { property: "og:description", content: "Organization details, team access and clinic knowledge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Clinic Settings" description="Organization details, team access and clinic knowledge." icon={Settings} />,
});
