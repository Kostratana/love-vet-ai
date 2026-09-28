import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, SectionTitle, Select, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { SPECIES, setAccount, useAccount, type OwnerProfile, type Pet } from "@/lib/account-store";

void Link;
const newPet = (): Pet => ({ id: crypto.randomUUID(), name: "", species: "", breed: "", age: "", sex: "" });

export function OwnerForm({ redirect, onModeChange }: { redirect?: string | undefined; onModeChange?: (m: "register" | "signin") => void }) {
  const router = useRouter();
  const acct = useAccount();
  const [owner, setOwner] = useState<Omit<OwnerProfile, "pets">>(
    acct.owner ?? { firstName: "", lastName: "", email: "", phone: "", location: "" },
  );
  const [pets, setPets] = useState<Pet[]>(acct.owner?.pets.length ? acct.owner.pets : [newPet()]);
  const [mode, setMode] = useState<"register" | "signin">("register");
  const [email, setEmail] = useState("");

  const upd = (k: keyof typeof owner) => (e: React.ChangeEvent<HTMLInputElement>) => setOwner({ ...owner, [k]: e.target.value });
  const updPet = (id: string, k: keyof Pet, v: string) => setPets(pets.map((p) => (p.id === id ? { ...p, [k]: v } : p)));

  function finish(profile: OwnerProfile) {
    setAccount({ role: "owner", owner: profile });
    router.history.push(redirect ?? "/account");
  }

  return (
    <div>
        <div className="mb-6 inline-flex rounded-full border border-silver-strong/60 bg-card/70 p-1 text-sm">
          {(["register", "signin"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); onModeChange?.(m); }} aria-pressed={mode === m}
              className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-graphite"}`}>
              {m === "register" ? "Create account" : "Sign in"}
            </button>
          ))}
        </div>

        {mode === "signin" ? (
          <form className="glass space-y-4 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); finish(acct.owner ?? { firstName: "", lastName: "", email, phone: "", location: "", pets: [] }); }}>
            <Field label="Email"><TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
            <Field label="Password"><TextInput type="password" required autoComplete="current-password" /></Field>
            <GlowButton type="submit" className="w-full">Sign in</GlowButton>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); finish({ ...owner, pets: pets.filter((p) => p.name || p.species) }); }}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <SectionTitle>Personal information</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name"><TextInput required value={owner.firstName} onChange={upd("firstName")} autoComplete="given-name" /></Field>
                <Field label="Last name"><TextInput required value={owner.lastName} onChange={upd("lastName")} autoComplete="family-name" /></Field>
                <Field label="Email"><TextInput type="email" required value={owner.email} onChange={upd("email")} autoComplete="email" /></Field>
                <Field label="Phone"><TextInput type="tel" value={owner.phone} onChange={upd("phone")} autoComplete="tel" /></Field>
                <Field label="Location / address" className="sm:col-span-2"><TextInput value={owner.location} onChange={upd("location")} autoComplete="street-address" /></Field>
              </div>
            </div>

            {pets.map((p, i) => (
              <div key={p.id} className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <SectionTitle>{i === 0 ? "My pet" : `Pet ${i + 1}`}</SectionTitle>
                  {pets.length > 1 && (
                    <button type="button" onClick={() => setPets(pets.filter((x) => x.id !== p.id))} aria-label="Remove pet" className="text-graphite hover:text-destructive"><Trash2 className="size-4" /></button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pet name"><TextInput value={p.name} onChange={(e) => updPet(p.id, "name", e.target.value)} /></Field>
                  <Field label="Animal species">
                    <Select value={p.species} onChange={(e) => updPet(p.id, "species", e.target.value)}>
                      <option value="">Select…</option>
                      {SPECIES.map((s) => <option key={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field label="Breed" hint="if relevant"><TextInput value={p.breed} onChange={(e) => updPet(p.id, "breed", e.target.value)} /></Field>
                  <Field label="Age or date of birth"><TextInput value={p.age} onChange={(e) => updPet(p.id, "age", e.target.value)} /></Field>
                  <Field label="Sex" hint="if relevant">
                    <Select value={p.sex} onChange={(e) => updPet(p.id, "sex", e.target.value)}>
                      <option value="">—</option><option>Female</option><option>Male</option><option>Unknown</option>
                    </Select>
                  </Field>
                  <Field label="Pet photo" hint="optional">
                    <TextInput type="file" accept="image/*" onChange={(e) => updPet(p.id, "photoName", e.target.files?.[0]?.name ?? "")} className="file:mr-3 file:rounded-full file:border-0 file:bg-ice file:px-3 file:py-1 file:text-xs file:font-semibold file:text-deep" />
                  </Field>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <GlowButton type="button" variant="secondary" onClick={() => setPets([...pets, newPet()])}><Plus /> Add another pet</GlowButton>
              <GlowButton type="submit" size="lg">Create account</GlowButton>
            </div>
            <p className="text-xs text-graphite">
              Preview: your details stay in this browser until secure sign-in is connected. Love Vet AI is
              not a veterinary medical record system.
            </p>
          </form>
        )}
    </div>
  );
}
