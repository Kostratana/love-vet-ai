/** Grounded retrieval over stored clinic knowledge + veterinarian records. Server-only. */
import { createClient } from "@supabase/supabase-js";
import { embed } from "./ai.server";

export function publicDb() {
  return createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false } });
}

/** Embeds any clinic entries or veterinarian records whose embedding was cleared (new or edited). */
export async function ensureIndexed() {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: docs }, { data: vets }] = await Promise.all([
      supabaseAdmin.from("knowledge_documents").select("id,title,content").is("embedding", null).limit(40),
      supabaseAdmin.from("veterinarians").select("id,search_text").is("embedding", null).neq("search_text", "").limit(40),
    ]);
    if (docs?.length) {
      const v = await embed(docs.map((p) => `${p.title}\n${p.content}`));
      await Promise.all(docs.map((p, i) => supabaseAdmin.from("knowledge_documents").update({ embedding: JSON.stringify(v[i]) }).eq("id", p.id)));
    }
    if (vets?.length) {
      const v = await embed(vets.map((p) => p.search_text));
      await Promise.all(vets.map((p, i) => supabaseAdmin.from("veterinarians").update({ embedding: JSON.stringify(v[i]) }).eq("id", p.id)));
    }
  } catch { /* use what is already indexed */ }
}

export type VetRecord = {
  id: string; name: string; title: string; specialty: string; secondary_specialties: string[]; interests: string[]; conditions: string[];
  species: string[]; languages: string[]; years_experience: number; bio: string; initials: string; appointment_types: string[];
  appointment_durations: Record<string, number>; urgent_care: boolean;
  provider_type: string; clinic_id: string | null; home_visit: boolean; home_visit_types: string[]; service_area: string[];
  clinic: { name: string; address: string } | null;
};

const VET_COLS = "id,name,title,specialty,secondary_specialties,interests,conditions,species,languages,years_experience,bio,initials,appointment_types,appointment_durations,urgent_care,provider_type,home_visit,home_visit_types,service_area,clinic_id,clinics(name,street,city,region,postal_code,country)";

type Row = Omit<VetRecord, "clinic" | "appointment_durations"> & { appointment_durations: unknown; clinics: { name: string; street: string; city: string; region: string; postal_code: string; country: string } | null };
const toRecord = (r: Row): VetRecord => ({
  ...r,
  appointment_durations: (r.appointment_durations ?? {}) as Record<string, number>,
  clinic: r.clinics ? { name: r.clinics.name, address: `${r.clinics.street}, ${r.clinics.city}, ${r.clinics.region} ${r.clinics.postal_code}, ${r.clinics.country}` } : null,
});

/** Semantic veterinarian retrieval; returns the STRUCTURED records (never the embedding text) ranked by similarity. */
export async function retrieveVets(queryVec: number[], count = 10) {
  const sb = publicDb();
  const { data: hits } = await sb.rpc("match_veterinarians", { query_embedding: JSON.stringify(queryVec), match_count: count });
  const list = (hits ?? []) as { id: string; similarity: number }[];
  if (!list.length) return [] as (VetRecord & { similarity: number })[];
  const { data } = await sb.from("veterinarians").select(VET_COLS).in("id", list.map((h) => h.id)).eq("active", true);
  const byId = new Map(((data ?? []) as unknown as Row[]).map((r) => [r.id, toRecord(r)]));
  return list.flatMap((h) => { const r = byId.get(h.id); return r ? [{ ...r, similarity: h.similarity }] : []; });
}

/** Local clinic hour (US Eastern, where the demo clinic operates) of a slot. */
export function clinicHour(iso: string) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date(iso));
  return Number(p.find((x) => x.type === "hour")?.value ?? 0) + Number(p.find((x) => x.type === "minute")?.value ?? 0) / 60;
}

/** Real, unbooked, future slots from structured availability, optionally inside a clinic-local hour window [from, to). */
export async function nextSlots(vetId: string, limit: number, window?: { from: number; to: number } | null) {
  const { data } = await publicDb().from("vet_slots").select("id,starts_at,duration_min").eq("veterinarian_id", vetId).eq("booked", false)
    .gte("starts_at", new Date(Date.now() + 3600_000).toISOString()).order("starts_at").limit(window ? 200 : limit);
  const rows = data ?? [];
  if (!window) return rows;
  return rows.filter((r) => { const h = clinicHour(r.starts_at); return h >= window.from && h < window.to; }).slice(0, limit);
}

/** True when the stored service area of a home-visit provider covers the owner's stated location. */
export function servesArea(v: Pick<VetRecord, "service_area">, location: string) {
  const loc = location.toLowerCase().trim();
  if (!loc) return false;
  return v.service_area.some((a) => loc.includes(a.toLowerCase()) || a.toLowerCase().includes(loc));
}

export function vetFacts(v: VetRecord, next?: string | null) {
  return [
    `${v.name} — ${v.title} (DEMO veterinarian)`,
    `Provider type: ${v.provider_type === "home_visit" ? "independent / home-visit veterinarian (visits the owner's home)" : "clinic veterinarian"}`,
    v.home_visit ? `Home visits: ${v.home_visit_types.join(", ")}. Stored service area ONLY: ${v.service_area.join(", ")}` : "",
    `Specialty: ${v.specialty.replace(/_/g, " ")}; also: ${[...v.secondary_specialties, ...v.interests].join(", ")}`,
    `Species: ${v.species.join(", ")}`,
    `Problems seen: ${v.conditions.join(", ")}`,
    `Languages: ${v.languages.join(", ")}`,
    `Experience: ${v.years_experience} years`,
    `Appointment types: ${Object.entries(v.appointment_durations).map(([k, m]) => `${k} ${m} min`).join(", ") || v.appointment_types.join(", ")}`,
    `Urgent same-day care: ${v.urgent_care ? "yes" : "no"}`,
    v.clinic ? `Clinic: ${v.clinic.name}, ${v.clinic.address}` : "",
    next !== undefined ? `Next available slot (from stored availability): ${next ?? "none open"}` : "",
  ].filter(Boolean).join("\n");
}

/**
 * Builds the grounded context block for a question: clinic knowledge entries + matching veterinarian records
 * (+ next stored slot per vet). Returns "" when nothing relevant is stored.
 */
export async function groundedContext(question: string, opts: { withSlots?: boolean } = {}) {
  await ensureIndexed();
  const [vec] = await embed([question]);
  const sb = publicDb();
  const [{ data: kHits }, vets] = await Promise.all([
    sb.rpc("match_knowledge", { query_embedding: JSON.stringify(vec), match_count: 5, min_similarity: 0.5 }),
    retrieveVets(vec!, 4),
  ]);
  const docs = (kHits ?? []) as { title: string; category: string; content: string }[];
  const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) + " (US Eastern)";
  const vetBlocks = await Promise.all(vets.filter((v) => v.similarity >= 0.45).map(async (v) => {
    const s = opts.withSlots ? (await nextSlots(v.id, 1))[0] : undefined;
    return vetFacts(v, opts.withSlots ? (s ? fmt(s.starts_at) : null) : undefined);
  }));
  const parts = [
    ...docs.map((d, i) => `[K${i + 1}] (${d.category}) ${d.title}\n${d.content}`),
    ...vetBlocks.map((b, i) => `[V${i + 1}] Veterinarian record\n${b}`),
  ];
  return { context: parts.join("\n\n"), sources: [...docs.map((d) => ({ title: d.title, category: d.category })), ...vets.filter((v) => v.similarity >= 0.45).map((v) => ({ title: v.name, category: "Veterinarian" }))] };
}
