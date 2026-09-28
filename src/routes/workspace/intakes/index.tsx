import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable } from "@/components/workspace/PageHeader";
import {
  GlowButton,
  LanguageIndicator,
  StatusBadge,
  priorityTone,
} from "@/components/kit/primitives";
import { intakes, patientById } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/intakes/")({
  head: () => ({
    meta: [
      { title: "AI Intakes · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Every AI chat with detected language, reported concerns, priority and suggested care route, ready for veterinary review.",
      },
      { property: "og:title", content: "AI Intakes · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Structured multilingual intake queue with explainable routing for your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Intakes,
});

function Intakes() {
  return (
    <div>
      <PageHeader
        eyebrow="AI Intakes"
        title="Intake queue"
        description="Received requests, structured and routed. Original audio, transcript and media are preserved on every case."
      />

      <DataTable
        columns={["Patient", "Reported", "Language", "Inputs", "Priority", "Status", ""]}
        rows={intakes.map((i) => {
          const p = patientById(i.patientId)!;
          return [
            <div key="p">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-graphite">
                {p.species} · {p.breed}
              </p>
            </div>,
            <div key="c">
              <p>{i.concerns.join(" · ")}</p>
              <p className="text-xs text-graphite">Onset {i.onset.toLowerCase()}</p>
            </div>,
            <LanguageIndicator key="l" from={i.originalLanguage} to="English" />,
            <span key="in" className="text-xs text-graphite">
              {i.inputs.join(" · ")}
            </span>,
            <StatusBadge key="pr" tone={priorityTone(i.priority)}>
              {i.priority}
            </StatusBadge>,
            <StatusBadge key="s" tone={i.status === "CONFIRMED" ? "success" : "neutral"}>
              {i.status}
            </StatusBadge>,
            <Link key="a" to="/workspace/intakes/$intakeId" params={{ intakeId: i.id }}>
              <GlowButton variant="secondary" size="sm">
                Open
              </GlowButton>
            </Link>,
          ];
        })}
      />
    </div>
  );
}
