import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/workspace/PageHeader";
import { PreVisitCaseView } from "@/components/workspace/PreVisitCaseView";
import { sampleCaseView } from "@/lib/sample-case";
import { BookedCases, StaffGate, StaffRequests } from "@/components/workspace/StaffData";

export const Route = createFileRoute("/workspace/")({
  head: () => ({
    meta: [
      { title: "Pre-Visit Cases · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "One coherent pre-visit case per pet: owner, animal, reported problem, media, documents and appointment." },
      { property: "og:title", content: "Pre-Visit Cases · Love Vet AI" },
      { property: "og:description", content: "Understand the reason for the visit before the owner arrives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PreVisitCase,
});

function PreVisitCase() {
  return (
    <div>
      <PageHeader eyebrow="Clinic Staff Workspace · Cases" title="Pre-Visit Case" description="After a pet owner books, the veterinary team receives a prepared case: everything the owner shared with Love Vet AI, organised before the visit." />
      <StaffGate><BookedCases /><StaffRequests /></StaffGate>
      <PreVisitCaseView c={sampleCaseView} />
    </div>
  );
}
