import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { ChipToggle, Field, SectionTitle, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { SPECIES } from "@/lib/account-store";

export const Route = createFileRoute("/workspace/clinic-setup")({
  head: () => ({
    meta: [
      { title: "Clinic setup · Clinic Staff Workspace" },
      { name: "description", content: "Register your organization and configure locations, species, services, equipment, hours, emergency availability and pricing." },
      { property: "og:title", content: "Clinic setup · Clinic Staff Workspace" },
      { property: "og:description", content: "Multi-location clinic configuration for Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClinicSetup,
});

type Loc = { id: string; name: string; address: string; contact: string; hours: string; weekend: string; holiday: string };
const newLoc = (): Loc => ({ id: crypto.randomUUID(), name: "", address: "", contact: "", hours: "", weekend: "", holiday: "" });

function ClinicSetup() {
  const [locs, setLocs] = useState<Loc[]>([newLoc()]);
  const [species, setSpecies] = useState<string[]>([]);
  const [emergency, setEmergency] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const upd = (id: string, k: keyof Loc, v: string) => setLocs(locs.map((l) => (l.id === id ? { ...l, [k]: v } : l)));

  return (
    <div>
      <PageHeader eyebrow="Registration" title="Clinic setup" description="Configure your organization so Love Vet AI can match owners by real suitability. Settings are a preview and are not saved to a server yet." />
      <form className="max-w-3xl space-y-6" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
        <div className="glass rounded-2xl p-6">
          <SectionTitle>Organization</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization name"><TextInput required /></Field>
            <Field label="Main contact (email or phone)"><TextInput /></Field>
          </div>
        </div>
        {locs.map((l, i) => (
          <div key={l.id} className="glass rounded-2xl p-6">
            <SectionTitle>Location {i + 1}</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location name"><TextInput value={l.name} onChange={(e) => upd(l.id, "name", e.target.value)} /></Field>
              <Field label="Contact"><TextInput value={l.contact} onChange={(e) => upd(l.id, "contact", e.target.value)} /></Field>
              <Field label="Address" className="sm:col-span-2"><TextInput value={l.address} onChange={(e) => upd(l.id, "address", e.target.value)} /></Field>
              <Field label="Opening hours"><TextInput value={l.hours} onChange={(e) => upd(l.id, "hours", e.target.value)} placeholder="Mon–Fri 8:00–18:00" /></Field>
              <Field label="Weekend hours"><TextInput value={l.weekend} onChange={(e) => upd(l.id, "weekend", e.target.value)} /></Field>
              <Field label="Holiday / special hours" className="sm:col-span-2"><TextInput value={l.holiday} onChange={(e) => upd(l.id, "holiday", e.target.value)} /></Field>
            </div>
          </div>
        ))}
        <GlowButton type="button" variant="secondary" onClick={() => setLocs([...locs, newLoc()])}><Plus /> Add location</GlowButton>
        <div className="glass space-y-5 rounded-2xl p-6">
          <SectionTitle>Care & capabilities</SectionTitle>
          <ChipToggle label="Animal species treated" options={SPECIES} value={species} onChange={setSpecies} />
          <ChipToggle label="Emergency availability" options={["During opening hours", "Evenings", "Weekends", "24/7", "Not available"]} value={emergency} onChange={setEmergency} />
          <Field label="Veterinary services"><TextArea rows={2} /></Field>
          <Field label="Equipment"><TextArea rows={2} placeholder="e.g. digital X-ray, ultrasound, in-house lab" /></Field>
          <Field label="Clinic capabilities"><TextArea rows={2} /></Field>
          <Field label="Pricing / price ranges"><TextArea rows={2} /></Field>
          <Field label="Clinic knowledge" hint="policies, preparation instructions, FAQs"><TextArea rows={3} /></Field>
        </div>
        <p className="text-sm text-graphite">Veterinarians, schedules, appointments, client requests and reviews are managed in their own workspace sections.</p>
        <div className="flex items-center justify-end gap-3">
          {saved && <span role="status" className="flex items-center gap-1.5 text-sm text-deep"><CheckCircle2 className="size-4" /> Saved in this preview</span>}
          <GlowButton type="submit">Save clinic setup</GlowButton>
        </div>
      </form>
    </div>
  );
}
