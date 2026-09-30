import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { ChipToggle, Field, SectionTitle, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { SPECIES, useAccount } from "@/lib/account-store";
import { useServerFn } from "@tanstack/react-start";
import { addKnowledge } from "@/lib/care.functions";
import { StaffGate } from "@/components/workspace/StaffData";

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
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { isStaff } = useAccount();
  const add = useServerFn(addKnowledge);

  async function save(form: HTMLFormElement) {
    if (!isStaff) return setErr("Only verified clinic staff can save clinic information.");
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    const org = g("org") || "The clinic";
    const entries: { category: string; title: string; content: string }[] = [];
    locs.forEach((l, i) => {
      const loc = l.name || `Location ${i + 1}`;
      const lines = [l.address && `Address: ${l.address}`, l.contact && `Contact: ${l.contact}`].filter(Boolean);
      if (lines.length) entries.push({ category: "location", title: `${org} — ${loc}`, content: lines.join("\n") });
      const hours = [l.hours && `Opening hours: ${l.hours}`, l.weekend && `Weekend hours: ${l.weekend}`, l.holiday && `Holiday / special hours: ${l.holiday}`].filter(Boolean);
      if (hours.length) entries.push({ category: "hours", title: `Opening hours — ${loc}`, content: hours.join("\n") });
    });
    if (species.length) entries.push({ category: "services", title: "Animal species treated", content: `${org} treats: ${species.join(", ")}.` });
    if (emergency.length) entries.push({ category: "policies", title: "Emergency availability", content: `Emergency availability: ${emergency.join(", ")}.` });
    for (const [k, cat, title] of [["services", "services", "Veterinary services"], ["equipment", "services", "Equipment"], ["capabilities", "services", "Clinic capabilities"], ["pricing", "policies", "Pricing"], ["knowledge", "faq", "Policies, preparation & FAQs"]] as const) {
      if (g(k)) entries.push({ category: cat, title, content: g(k) });
    }
    if (!entries.length) return setErr("Add some clinic information first.");
    setBusy(true); setErr(null); setSaved(null);
    for (const e of entries) {
      const r = await add({ data: e }).catch(() => ({ ok: false, error: "Could not save." }));
      if (!r.ok) { setBusy(false); return setErr(r.error ?? "Could not save."); }
    }
    setBusy(false);
    setSaved(`Saved ${entries.length} entries to the Information Desk`);
  }
  const upd = (id: string, k: keyof Loc, v: string) => setLocs(locs.map((l) => (l.id === id ? { ...l, [k]: v } : l)));

  return (
    <div>
      <PageHeader eyebrow="Registration" title="Clinic setup" description="Configure your organization so Love Vet AI can match owners by real suitability. Saved details become the clinic information the Information Desk answers from." />
      <form className="max-w-3xl space-y-6" onSubmit={(e) => { e.preventDefault(); void save(e.currentTarget); }}>
        <StaffGate><span /></StaffGate>
        <div className="glass rounded-2xl p-6">
          <SectionTitle>Organization</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization name"><TextInput name="org" required /></Field>
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
          <Field label="Veterinary services"><TextArea name="services" rows={2} /></Field>
          <Field label="Equipment"><TextArea name="equipment" rows={2} placeholder="e.g. digital X-ray, ultrasound, in-house lab" /></Field>
          <Field label="Clinic capabilities"><TextArea name="capabilities" rows={2} /></Field>
          <Field label="Pricing / price ranges"><TextArea name="pricing" rows={2} /></Field>
          <Field label="Clinic knowledge" hint="policies, preparation instructions, FAQs"><TextArea name="knowledge" rows={3} /></Field>
        </div>
        <p className="text-sm text-graphite">Veterinarians, schedules, appointments, client requests and reviews are managed in their own workspace sections.</p>
        <div className="flex items-center justify-end gap-3">
          {err && <span role="alert" className="text-sm text-destructive">{err}</span>}
          {saved && <span role="status" className="flex items-center gap-1.5 text-sm text-deep"><CheckCircle2 className="size-4" /> {saved}</span>}
          <GlowButton type="submit" disabled={busy || !isStaff}>{busy ? "Saving…" : "Save clinic setup"}</GlowButton>
        </div>
      </form>
    </div>
  );
}
