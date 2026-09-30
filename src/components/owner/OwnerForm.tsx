import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, SectionTitle, Select, TextInput } from "@/components/kit/form";
import { GlowButton } from "@/components/kit/primitives";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SPECIES, saveOwner, stashPendingOwner, useAccount, type OwnerProfile, type Pet } from "@/lib/account-store";

void Link;
const newPet = (): Pet => ({ id: crypto.randomUUID(), name: "", species: "", breed: "", age: "", sex: "" });

export function OwnerForm({ redirect, onModeChange }: { redirect?: string | undefined; onModeChange?: (m: "register" | "signin") => void }) {
  const router = useRouter();
  const acct = useAccount();
  const [owner, setOwner] = useState<Omit<OwnerProfile, "pets">>(
    acct.owner ?? { firstName: "", lastName: "", email: "", phone: "", location: "" },
  );
  // Stable first id for server render; swapped for a real random id after hydration (avoids SSR id mismatch).
  const [pets, setPets] = useState<Pet[]>(acct.owner?.pets.length ? acct.owner.pets : [{ ...newPet(), id: "pending-pet" }]);
  useEffect(() => { setPets((ps) => ps.map((p) => (p.id === "pending-pet" ? { ...p, id: crypto.randomUUID() } : p))); }, []);
  const [mode, setMode] = useState<"register" | "signin">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<Record<string, File>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const signedIn = !!acct.user;
  const [errs, setErrs] = useState<Record<string, string>>({});
  const err = (k: string) => errs[k] ? <p id={`err-${k}`} className="mt-1 text-xs font-medium text-destructive">{errs[k]}</p> : null;
  const inv = (k: string) => errs[k] ? { "aria-invalid": true, "aria-describedby": `err-${k}`, className: "border-destructive" } : {};

  /** App-level validation (no browser bubbles). Keeps every entered value; focuses the first invalid field. */
  function validate() {
    const e: Record<string, string> = {};
    if (!owner.firstName.trim()) e["firstName"] = "Please enter your first name.";
    if (!owner.lastName.trim()) e["lastName"] = "Please enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email.trim())) e["email"] = "Please enter a valid email address, e.g. name@example.com.";
    if (owner.phone.trim() && !/^[+\d][\d\s().-]{5,}$/.test(owner.phone.trim())) e["phone"] = "Please enter a valid phone number (digits, spaces, + or -).";
    if (!signedIn && password.length < 8) e["password"] = `Password must be at least 8 characters (currently ${password.length}).`;
    pets.forEach((p) => {
      const used = p.name || p.species || p.breed || p.age || photos[p.id];
      if (used && !p.name.trim()) e[`pet-${p.id}-name`] = "Please enter your pet's name.";
      if (used && !p.species) e[`pet-${p.id}-species`] = "Please choose the animal species.";
    });
    setErrs(e);
    const first = Object.keys(e)[0];
    if (first) {
      const el = document.getElementById(`f-${first}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }
    return !first;
  }

  // Fill the form with saved details once they load.
  useEffect(() => {
    if (!acct.owner) return;
    const { pets: savedPets, ...rest } = acct.owner;
    setOwner(rest);
    if (savedPets.length) setPets(savedPets);
  }, [acct.owner]);

  const upd = (k: keyof typeof owner) => (e: React.ChangeEvent<HTMLInputElement>) => setOwner({ ...owner, [k]: e.target.value });
  const updPet = (id: string, k: keyof Pet, v: string) => setPets(pets.map((p) => (p.id === id ? { ...p, [k]: v } : p)));

  const go = () => router.history.push(redirect ?? "/account");

  async function register(profile: OwnerProfile) {
    setBusy(true); setMsg(null);
    try {
      if (signedIn && acct.user) { await saveOwner(acct.user.id, profile, photos); return go(); }
      const { data, error } = await supabase.auth.signUp({
        email: profile.email, password,
        options: { emailRedirectTo: `${window.location.origin}${redirect ?? "/account"}`, data: { first_name: profile.firstName, last_name: profile.lastName, phone: profile.phone, location: profile.location, account_type: "owner" } },
      });
      if (error) throw error;
      if (data.session && data.user) { await saveOwner(data.user.id, profile, photos); return go(); }
      stashPendingOwner(profile);
      setMsg(`Check your email to confirm your account, then sign in. Your pets will be saved when you do.${Object.keys(photos).length ? " Add pet photos again after signing in." : ""}`);
    } catch (e) { setMsg(e instanceof Error ? e.message : "Could not create your account."); }
    finally { setBusy(false); }
  }

  async function signIn() {
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
    go();
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + (redirect ?? "/account") });
    if (r.error) setMsg(r.error.message ?? "Google sign-in failed.");
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
          <form className="glass space-y-4 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); void signIn(); }}>
            <Field label="Email"><TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
            <Field label="Password"><TextInput type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            <GlowButton type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</GlowButton>
            <GlowButton type="button" variant="secondary" className="w-full" onClick={google}>Continue with Google</GlowButton>
            {msg && <p role="alert" className="text-sm font-medium text-destructive">{msg}</p>}
          </form>
        ) : (
          <form noValidate className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (!validate()) return; void register({ ...owner, pets: pets.filter((p) => p.name || p.species || photos[p.id]) }); }}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <SectionTitle>Personal information</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name"><TextInput id="f-firstName" {...inv("firstName")} value={owner.firstName} onChange={upd("firstName")} autoComplete="given-name" />{err("firstName")}</Field>
                <Field label="Last name"><TextInput id="f-lastName" {...inv("lastName")} value={owner.lastName} onChange={upd("lastName")} autoComplete="family-name" />{err("lastName")}</Field>
                <Field label="Email"><TextInput id="f-email" type="email" {...inv("email")} value={owner.email} onChange={upd("email")} autoComplete="email" />{err("email")}</Field>
                <Field label="Phone" hint="optional"><TextInput id="f-phone" type="tel" {...inv("phone")} value={owner.phone} onChange={upd("phone")} autoComplete="tel" />{err("phone")}</Field>
                {!signedIn && <Field label="Password" hint="at least 8 characters" className="sm:col-span-2"><TextInput id="f-password" type="password" {...inv("password")} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />{errs["password"] ? err("password") : <p className={`mt-1 text-xs ${password.length >= 8 ? "text-deep" : "text-graphite"}`}>{password.length >= 8 ? "✓ At least 8 characters" : `At least 8 characters · ${password.length}/8`}</p>}</Field>}
                <Field label="Location / address" hint="optional" className="sm:col-span-2"><TextInput value={owner.location} onChange={upd("location")} autoComplete="street-address" /></Field>
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
                  <Field label="Pet name"><TextInput id={`f-pet-${p.id}-name`} {...inv(`pet-${p.id}-name`)} value={p.name} onChange={(e) => updPet(p.id, "name", e.target.value)} />{err(`pet-${p.id}-name`)}</Field>
                  <Field label="Animal species">
                    <Select id={`f-pet-${p.id}-species`} {...inv(`pet-${p.id}-species`)} value={p.species} onChange={(e) => updPet(p.id, "species", e.target.value)}>
                      <option value="">Select…</option>
                      {SPECIES.map((s) => <option key={s}>{s}</option>)}
                    </Select>
                    {err(`pet-${p.id}-species`)}
                  </Field>
                  <Field label="Breed" hint="if relevant"><TextInput value={p.breed} onChange={(e) => updPet(p.id, "breed", e.target.value)} /></Field>
                  <Field label="Age or date of birth"><TextInput value={p.age} onChange={(e) => updPet(p.id, "age", e.target.value)} /></Field>
                  <Field label="Sex" hint="if relevant">
                    <Select value={p.sex} onChange={(e) => updPet(p.id, "sex", e.target.value)}>
                      <option value="">—</option><option>Female</option><option>Male</option><option>Unknown</option>
                    </Select>
                  </Field>
                  <Field label="Pet photo" hint="optional">
                    {(photos[p.id] || p.photoUrl) && <img src={photos[p.id] ? URL.createObjectURL(photos[p.id]!) : p.photoUrl} alt={`${p.name || "Pet"} photo`} className="mb-2 size-20 rounded-xl border border-ice-lum/60 object-cover" />}
                    <TextInput type="file" accept="image/jpeg,image/png,image/webp" aria-label={p.photoUrl ? "Replace pet photo" : "Pet photo"} onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhotos((ph) => ({ ...ph, [p.id]: f })); }} className="file:mr-3 file:rounded-full file:border-0 file:bg-ice file:px-3 file:py-1 file:text-xs file:font-semibold file:text-deep" />
                  </Field>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <GlowButton type="button" variant="secondary" onClick={() => setPets([...pets, newPet()])}><Plus /> Add another pet</GlowButton>
              <GlowButton type="submit" size="lg" disabled={busy}>{busy ? "Saving…" : signedIn ? "Save changes" : "Create account"}</GlowButton>
            </div>
            {Object.keys(errs).length > 0 && <p role="alert" className="text-sm font-medium text-destructive">Please fix the {Object.keys(errs).length === 1 ? "highlighted field" : `${Object.keys(errs).length} highlighted fields`} above. Nothing you entered was lost.</p>}
            {msg && <p role="alert" className="text-sm font-medium text-deep">{msg}</p>}
            <p className="text-xs text-graphite">
              Your details are saved securely to your account. Love Vet AI is not a veterinary medical record system.
            </p>
          </form>
        )}
    </div>
  );
}
