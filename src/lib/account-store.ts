/**
 * Frontend-only account state (no authentication or database yet).
 * Stored in the browser so navigation and flows work end-to-end as a UI preview.
 * Replace with real auth + persistence when the backend integration is built.
 */
import { useSyncExternalStore } from "react";

export type Role = "owner" | "veterinarian" | "clinic";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  sex?: string;
  photoName?: string;
};

export type OwnerProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  pets: Pet[];
};

export type VetProfile = {
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  species: string[];
  experience: string;
  education: string;
  languages: string;
  services: string;
  clinics: string;
  locations: string;
  availability: string;
  price: string;
  description: string;
};

export type AccountState = {
  role: Role | null;
  owner: OwnerProfile | null;
  vet: VetProfile | null;
};

const KEY = "lovevet.account.v1";
const EMPTY: AccountState = { role: null, owner: null, vet: null };
let cache: AccountState | null = null;
const listeners = new Set<() => void>();

function read(): AccountState {
  if (cache) return cache;
  try {
    cache = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function setAccount(update: Partial<AccountState>) {
  cache = { ...read(), ...update };
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function signOutLocal() {
  cache = EMPTY;
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function useAccount(): AccountState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}

/** Configurable species list — never limited to dogs and cats. */
export const SPECIES = [
  "Dog",
  "Cat",
  "Rabbit",
  "Hamster",
  "Guinea pig",
  "Bird",
  "Reptile",
  "Small mammal",
  "Exotic animal",
  "Other",
];

export const safeRedirect = (r: unknown) =>
  typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? r : undefined;
