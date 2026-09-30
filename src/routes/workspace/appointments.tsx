import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { SectionPlaceholder } from "@/components/workspace/SectionPlaceholder";
import { AppointmentList, StaffGate } from "@/components/workspace/StaffData";
import { PageHeader } from "@/components/workspace/PageHeader";
import { useAccount } from "@/lib/account-store";

export const Route = createFileRoute("/workspace/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments · Clinic Staff Workspace · Love Vet AI" },
      { name: "description", content: "Confirmed appointments booked through Love Vet AI." },
      { property: "og:title", content: "Appointments · Love Vet AI" },
      { property: "og:description", content: "Confirmed appointments booked through Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppointmentsPage />
  ),
});

function AppointmentsPage() {
  const { isStaff, loading } = useAccount();
  const placeholder = <SectionPlaceholder eyebrow="Clinic Staff Workspace" title="Appointments" description="Appointments requested through Love Vet AI. Staff confirm, complete or cancel them here." icon={CalendarDays} />;
  if (loading || !isStaff) return <div><StaffGate><span /></StaffGate>{placeholder}</div>;
  return (
    <AppointmentList scope="staff" empty={placeholder}
      header={<PageHeader eyebrow="Clinic Staff Workspace" title="Appointments" description="Appointments requested through Love Vet AI. Staff confirm, complete or cancel them here." />} />
  );
}
