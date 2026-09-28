import { Link, createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { EmptyState, PageShell } from "@/components/kit/form";
import { buttonVariants } from "@/components/kit/primitives";
import { ReputationPanels } from "@/components/care/Reputation";
import { useAccount } from "@/lib/account-store";

export const Route = createFileRoute("/veterinarian-profile")({
  head: () => ({
    meta: [
      { title: "Veterinarian profile · Love Vet AI" },
      { name: "description", content: "Public veterinarian profile: specialties, species treated, clinics, availability, pricing and verified reviews." },
      { property: "og:title", content: "Veterinarian profile · Love Vet AI" },
      { property: "og:description", content: "Professional profile with verified Love Vet AI reviews." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VetProfilePage,
});

function VetProfilePage() {
  const { vet } = useAccount();
  if (!vet) {
    return (
      <PublicPage>
        <PageShell narrow title="Veterinarian profile">
          <EmptyState icon={UserRound} title="No profile yet" action={<Link to="/join/veterinarian" className={buttonVariants()}>Create your professional profile</Link>}>
            Veterinarians can create a profile that shows specialties, species treated and availability.
          </EmptyState>
        </PageShell>
      </PublicPage>
    );
  }
  const rows: [string, string][] = [
    ["Specialties", vet.specialties.join(", ")],
    ["Species treated", vet.species.join(", ")],
    ["Services", vet.services],
    ["Clinics", vet.clinics],
    ["Locations", vet.locations],
    ["Availability", vet.availability],
    ["Languages", vet.languages],
    ["Consultation price", vet.price],
    ["Experience", vet.experience],
    ["Education", vet.education],
  ];
  return (
    <PublicPage>
      <PageShell eyebrow="Veterinarian profile · preview" title={`${vet.firstName} ${vet.lastName}${vet.title ? `, ${vet.title}` : ""}`} intro={vet.description && <p>{vet.description}</p>}>
        <dl className="glass grid gap-x-8 gap-y-5 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
          {rows.map(([k, val]) => (
            <div key={k}>
              <dt className="text-xs font-semibold text-graphite">{k}</dt>
              <dd className="mt-0.5 text-sm text-navy">{val || "—"}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-12 mb-4 text-xl font-bold text-navy">Reputation</h2>
        <ReputationPanels />
        <div className="mt-8 flex gap-3">
          <Link to="/join/veterinarian" className={buttonVariants({ variant: "secondary" })}>Edit profile</Link>
        </div>
      </PageShell>
    </PublicPage>
  );
}
