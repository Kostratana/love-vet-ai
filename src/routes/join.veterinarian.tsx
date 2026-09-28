import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { ChipToggle, Field, PageShell, SectionTitle, Select, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";
import { SPECIES } from "@/lib/account-store";

export const Route = createFileRoute("/join/veterinarian")({
  head: () => ({
    meta: [
      { title: "Clinic / Veterinarian Registration · Love Vet AI" },
      { name: "description", content: "Register a veterinary clinic or veterinary professional with Love Vet AI — separate from pet owner accounts." },
      { property: "og:title", content: "Clinic / Veterinarian Registration · Love Vet AI" },
      { property: "og:description", content: "Registration for veterinary clinics and professionals, leading to the Clinic Staff Workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClinicRegistration,
});

const SPECIALTIES = ["General practice", "Surgery", "Orthopedics", "Dermatology", "Cardiology", "Dentistry", "Internal medicine", "Emergency & critical care", "Exotic animal medicine", "Avian medicine", "Behavior"];
const SERVICES = ["Consultations", "Vaccinations", "Diagnostics", "Surgery", "Dental care", "Emergency care", "Preventive care", "Grooming"];
const CAPABILITIES = ["Laboratory", "X-ray", "Ultrasound", "Hospitalization", "24/7 emergency", "Exotic animal handling", "Home visits"];

function ClinicRegistration() {
  const [done, setDone] = useState(false);
  const [species, setSpecies] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [caps, setCaps] = useState<string[]>([]);
  return (
    <PublicPage>
      <PageShell narrow eyebrow="For veterinary clinics & professionals" title="Clinic / Veterinarian Registration"
        intro={<p>This registration is separate from Pet Owner Accounts. Once connected, it will lead to the Clinic Staff Workspace. Nothing is stored or approved in this preview.</p>}>
        {done ? (
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-deep" />
            <p className="mt-3 text-graphite">Details received in this preview only. Accounts are not created until registration is connected.</p>
            <Link to="/workspace" className={buttonVariants() + " mt-5"}>Open Clinic Staff Workspace</Link>
          </div>
        ) : (
          <form className="glass space-y-5 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); setDone(true); window.scrollTo({ top: 0 }); }}>
            <Field label="Registering as">
              <Select required defaultValue=""><option value="" disabled>Select…</option><option>Veterinary Clinic</option><option>Veterinarian / Veterinary Professional</option></Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Organization / Clinic name"><TextInput required /></Field>
              <Field label="Professional name"><TextInput /></Field>
              <Field label="Professional role"><TextInput placeholder="e.g. Veterinarian, Practice manager" /></Field>
              <Field label="Email"><TextInput type="email" required /></Field>
              <Field label="Phone"><TextInput type="tel" /></Field>
              <Field label="Website"><TextInput type="url" placeholder="https://" /></Field>
            </div>
            <Field label="Clinic address"><TextInput /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City / Region"><TextInput /></Field>
              <Field label="Country"><TextInput /></Field>
            </div>
            <SectionTitle>Care profile</SectionTitle>
            <ChipToggle label="Animal species treated" options={[...SPECIES]} value={species} onChange={setSpecies} />
            <ChipToggle label="Veterinary services" options={SERVICES} value={services} onChange={setServices} />
            <ChipToggle label="Veterinarian specialties" options={SPECIALTIES} value={specialties} onChange={setSpecialties} />
            <ChipToggle label="Clinic capabilities" options={CAPABILITIES} value={caps} onChange={setCaps} />
            <Field label="Opening hours"><TextArea rows={3} placeholder="e.g. Mon–Fri 9:00–18:00, Sat 10:00–14:00" /></Field>
            <GlowButton type="submit" className="w-full">Submit registration</GlowButton>
          </form>
        )}
      </PageShell>
    </PublicPage>
  );
}
