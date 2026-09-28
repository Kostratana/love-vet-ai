import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable, PageHeader } from "@/components/workspace/PageHeader";
import { GlowButton, StatusBadge } from "@/components/kit/primitives";
import { intakes, patients } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/patients")({
  head: () => ({
    meta: [
      { title: "Patients · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Patient records with species, breed, age, owner and the most recent AI chat for each animal.",
      },
      { property: "og:title", content: "Patients · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Patient list linked to intake history and care routes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Patients,
});

function Patients() {
  return (
    <div>
      <PageHeader
        eyebrow="Patients"
        title="Patient records"
        description="Care history stays attached to the animal, including original messages and media from every intake."
      />
      <DataTable
        columns={["Patient", "Species", "Breed", "Age", "Owner", "Latest intake", ""]}
        rows={patients.map((p) => {
          const intake = intakes.find((i) => i.patientId === p.id);
          return [
            <span key="n" className="font-semibold">
              {p.name}
            </span>,
            p.species,
            p.breed,
            p.age,
            p.ownerName,
            intake ? (
              <span key="i" className="flex flex-wrap items-center gap-2">
                <span>{intake.route}</span>
                <StatusBadge tone="neutral">{intake.receivedAt}</StatusBadge>
              </span>
            ) : (
              "—"
            ),
            intake ? (
              <Link key="a" to="/workspace/intakes/$intakeId" params={{ intakeId: intake.id }}>
                <GlowButton variant="secondary" size="sm">
                  Open case
                </GlowButton>
              </Link>
            ) : null,
          ];
        })}
      />
    </div>
  );
}
