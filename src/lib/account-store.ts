/**
 * Account state backed by Lovable Cloud auth + database.
 * Owner profile and pets live in `profiles` / `pets`; roles come from `user_roles`.
 * Veterinarian profile details are stored in the user's auth metadata.
 */
import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "owner" | "veterinarian" | "clinic";

export type Pet = { id: string; name: string; species: string; breed?: string; age?: string; sex?: string; photoName?: string; photoPath?: string | null; photoUrl?: string | undefined };

export type OwnerProfile = { firstName: string; lastName: string; email: string; phone: string; location: string; pets: Pet[] };

export type VetProfile = {
  firstName: string; lastName: string; title: string; specialties: string[]; species: string[]; experience: string;
  education: string; languages: string; services: string; clinics: string; locations: string; availability: string;
  price: string; description: string;
};

export type AccountState = {
  loading: boolean;
  user: User | null;
  role: Role | null;
  isStaff: boolean;
  owner: OwnerProfile | null;
  vet: VetProfile | null;
};

const EMPTY: AccountState = { loading: true, user: null, role: null, isStaff: false, owner: null, vet: null };
let state: AccountState = EMPTY;
const listeners = new Set<() => void>();
const emit = (s: AccountState) => { state = s; listeners.forEach((l) => l()); };
let started = false;
const PENDING_KEY = "lovevet.pending-owner.v1";

async function load(user: User | null) {
  if (!user) return emit({ ...EMPTY, loading: false });
  await flushPending(user.id);
  const [{ data: prof }, { data: pets }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("pets").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const vet = (meta["vet_profile"] as VetProfile | undefined) ?? null;
  const accountType = meta["account_type"] as Role | undefined;
  emit({
    loading: false,
    user,
    role: accountType ?? "owner",
    isStaff: !!roles?.some((r) => r.role === "staff" || r.role === "admin"),
    vet,
    owner: {
      firstName: prof?.first_name ?? "", lastName: prof?.last_name ?? "", email: prof?.email || user.email || "",
      phone: prof?.phone ?? "", location: prof?.location ?? "",
      pets: await Promise.all((pets ?? []).map(async (p) => ({
        id: p.id, name: p.name, species: p.species, breed: p.breed ?? "", age: p.age ?? "", sex: p.sex ?? "", photoPath: p.photo_path,
        photoUrl: p.photo_path ? (await supabase.storage.from("chat-media").createSignedUrl(p.photo_path, 3600)).data?.signedUrl : undefined,
      }))),
    },
  });
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  supabase.auth.onAuthStateChange((_e, s) => { setTimeout(() => void load(s?.user ?? null), 0); });
  supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
}

export const refreshAccount = async () => {
  const { data } = await supabase.auth.getUser();
  await load(data.user);
};

/** Saves profile + pets to the database for the signed-in user. */
export async function saveOwner(userId: string, profile: OwnerProfile, photos: Record<string, File> = {}) {
  const { error } = await supabase.from("profiles").upsert({
    id: userId, email: profile.email, first_name: profile.firstName, last_name: profile.lastName,
    phone: profile.phone, location: profile.location,
  });
  if (error) throw new Error(error.message);
  const { data: existing } = await supabase.from("pets").select("id").eq("user_id", userId);
  const keep = profile.pets.filter((p) => p.name || p.species || photos[p.id]);
  const keepIds = new Set(keep.map((p) => p.id));
  const remove = (existing ?? []).filter((e) => !keepIds.has(e.id)).map((e) => e.id);
  if (remove.length) await supabase.from("pets").delete().in("id", remove);
  if (keep.length) {
    const { error: pe } = await supabase.from("pets").upsert(keep.map((p) => ({
      id: p.id, user_id: userId, name: p.name || "Unnamed pet", species: p.species || "Other",
      breed: p.breed || null, age: p.age || null, sex: p.sex || null,
    })));
    if (pe) throw new Error(pe.message);
  }
  // Pet photos: private storage under the owner's folder; replacing removes the old file.
  for (const p of keep) {
    const f = photos[p.id];
    if (!f) continue;
    if (!f.type.startsWith("image/") || f.size > 10 * 1024 * 1024) throw new Error("Pet photos must be images up to 10 MB.");
    const path = `${userId}/pets/${p.id}-${Date.now()}.${(f.name.split(".").pop() || "jpg").toLowerCase()}`;
    const { error: ue } = await supabase.storage.from("chat-media").upload(path, f, { contentType: f.type });
    if (ue) throw new Error("Could not upload the pet photo.");
    const { error: we } = await supabase.from("pets").update({ photo_path: path }).eq("id", p.id);
    if (we) throw new Error(we.message);
    if (p.photoPath) await supabase.storage.from("chat-media").remove([p.photoPath]);
  }
  await refreshAccount();
}

/** Keeps registration details until the email is confirmed and the user signs in. */
export function stashPendingOwner(profile: OwnerProfile) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(profile));
}
async function flushPending(userId: string) {
  const raw = typeof window !== "undefined" ? localStorage.getItem(PENDING_KEY) : null;
  if (!raw) return;
  localStorage.removeItem(PENDING_KEY);
  try {
    const p = JSON.parse(raw) as OwnerProfile;
    await supabase.from("profiles").upsert({ id: userId, email: p.email, first_name: p.firstName, last_name: p.lastName, phone: p.phone, location: p.location });
    const pets = p.pets.filter((x) => x.name || x.species);
    if (pets.length) await supabase.from("pets").upsert(pets.map((x) => ({ id: x.id, user_id: userId, name: x.name || "Unnamed pet", species: x.species || "Other", breed: x.breed || null, age: x.age || null, sex: x.sex || null })));
  } catch { /* ignore malformed pending data */ }
}

export async function signOutLocal() {
  await supabase.auth.signOut();
  emit({ ...EMPTY, loading: false });
}

export function useAccount(): AccountState {
  start();
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => EMPTY,
  );
}

/** Configurable species list — never limited to dogs and cats. */
export const SPECIES = ["Dog", "Cat", "Rabbit", "Hamster", "Guinea pig", "Bird", "Reptile", "Small mammal", "Exotic animal", "Other"];

export const safeRedirect = (r: unknown) =>
  typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? r : undefined;
