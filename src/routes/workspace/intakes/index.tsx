import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";

export const Route = createFileRoute("/workspace/intakes/")({
  head: () => ({
    meta: [
      { title: "Client Requests · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Conversations prepared by the assistant for your team." },
      { property: "og:title", content: "Client Requests · Love Vet AI" },
      { property: "og:description", content: "Conversations prepared by the assistant for your team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Client Requests" description="Conversations prepared by the assistant for your team." icon={Inbox} />,
});
