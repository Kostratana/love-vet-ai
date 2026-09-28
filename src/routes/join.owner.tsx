import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Field, PageShell, SectionTitle, Select, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { SPECIES, safeRedirect, setAccount, useAccount, type OwnerProfile, type Pet } from "@/lib/account-store";

export const Route = createFileRoute("/join/owner")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({ redirect: safeRedirect(s["redirect"]) }),
  head: () => ({
    meta: [
      { title: "Create your pet owner account · Love Vet AI" },
      { name: "description", content: "A free Love Vet AI account keeps your pets, conversations, appointments and visit history in one place." },
      { property: "og:title", content: "Create your pet owner account · Love Vet AI" },
      { property: "og:description", content: "Free for pet owners. Supports multiple pets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerRegistration,
});

const newPet = (): Pet => ({ id: crypto.randomUUID(), name: "", species: "", breed: "", age: "", sex: "" });

function OwnerRegistration() {
  const { redirect } = Route.useSearch();
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
    <PublicPage>
      <PageShell
        narrow
        eyebrow="Pet owner"
        title={mode === "register" ? "Create your account" : "Sign in"}
        intro={
          <p>
            Free for pet owners. You can <Link to="/chat" className="font-semibold text-deep hover:underline">start chatting</Link> without
            an account — create one when you want to save your pets, conversations and visits.
          </p>
        }
      >
        <div className="mb-6 inline-flex rounded-full border border-silver-strong/60 bg-card/70 p-1 text-sm">
          {(["register", "signin"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
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
      </PageShell>
    </PublicPage>
  );
}
