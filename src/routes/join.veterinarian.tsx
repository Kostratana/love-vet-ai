import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PublicPage } from "@/components/layout/PublicPage";
import { ChipToggle, Field, PageShell, SectionTitle, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { SPECIES, setAccount, useAccount, type VetProfile } from "@/lib/account-store";

export const Route = createFileRoute("/join/veterinarian")({
  head: () => ({
    meta: [
      { title: "Veterinarian registration · Love Vet AI" },
      { name: "description", content: "Create a Love Vet AI professional profile with specialties, species treated, clinics, languages and availability." },
      { property: "og:title", content: "Veterinarian registration · Love Vet AI" },
      { property: "og:description", content: "Professional profiles for veterinarians." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VetRegistration,
});

const SPECIALTIES = ["General practice", "Surgery", "Orthopedics", "Dermatology", "Cardiology", "Dentistry", "Internal medicine", "Emergency & critical care", "Exotic animal medicine", "Avian medicine", "Behavior"];

const EMPTY: VetProfile = { firstName: "", lastName: "", title: "", specialties: [], species: [], experience: "", education: "", languages: "", services: "", clinics: "", locations: "", availability: "", price: "", description: "" };

function VetRegistration() {
  const acct = useAccount();
  const navigate = useNavigate();
  const [v, setV] = useState<VetProfile>(acct.vet ?? EMPTY);
  const t = (k: keyof VetProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });

  return (
    <PublicPage>
      <PageShell narrow eyebrow="Veterinarian" title="Create your professional profile" intro={<p>Your profile helps Love Vet AI match owners with the right professional — by species, specialty, services and availability, not just distance.</p>}>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAccount({ role: "veterinarian", vet: v }); navigate({ to: "/veterinarian-profile" }); }}>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <SectionTitle>Identity</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name"><TextInput required value={v.firstName} onChange={t("firstName")} /></Field>
              <Field label="Last name"><TextInput required value={v.lastName} onChange={t("lastName")} /></Field>
              <Field label="Professional title"><TextInput value={v.title} onChange={t("title")} placeholder="e.g. DVM" /></Field>
              <Field label="Professional photo"><TextInput type="file" accept="image/*" /></Field>
            </div>
          </div>
          <div className="glass space-y-5 rounded-3xl p-6 sm:p-8">
            <SectionTitle>Practice</SectionTitle>
            <ChipToggle label="Veterinary specialties" options={SPECIALTIES} value={v.specialties} onChange={(x) => setV({ ...v, specialties: x })} />
            <ChipToggle label="Animal species treated" options={SPECIES} value={v.species} onChange={(x) => setV({ ...v, species: x })} />
            <Field label="Services provided"><TextInput value={v.services} onChange={t("services")} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Professional experience"><TextInput value={v.experience} onChange={t("experience")} /></Field>
              <Field label="Education / qualifications"><TextInput value={v.education} onChange={t("education")} /></Field>
              <Field label="Languages spoken"><TextInput value={v.languages} onChange={t("languages")} /></Field>
              <Field label="Consultation price or range"><TextInput value={v.price} onChange={t("price")} /></Field>
            </div>
          </div>
          <div className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <SectionTitle sub="You can work at more than one clinic.">Clinics & schedule</SectionTitle>
            <Field label="Clinic affiliation(s)"><TextInput value={v.clinics} onChange={t("clinics")} /></Field>
            <Field label="Locations"><TextInput value={v.locations} onChange={t("locations")} /></Field>
            <Field label="Availability / schedule"><TextInput value={v.availability} onChange={t("availability")} /></Field>
            <Field label="Professional description"><TextArea value={v.description} onChange={t("description")} /></Field>
          </div>
          <div className="flex justify-end"><GlowButton type="submit" size="lg">Save profile</GlowButton></div>
          <p className="text-xs text-graphite">Preview: your profile stays in this browser until professional sign-in is connected.</p>
        </form>
      </PageShell>
    </PublicPage>
  );
}
