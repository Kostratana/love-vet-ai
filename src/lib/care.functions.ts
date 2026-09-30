import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Msg = z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) });

export const DESTINATIONS = ["ai", "clinic_staff", "information_desk", "booking"] as const;
export const URGENCIES = ["routine", "soon", "urgent", "emergency"] as const;

export type Triage = {
  request_type: string;
  urgency: (typeof URGENCIES)[number];
  suggested_destination: (typeof DESTINATIONS)[number];
  symptoms: string[];
  short_summary: string;
  confidence: number;
};

/** Structured, non-diagnostic triage. jev-latest decides type/urgency/destination; gpt-6-astra extracts symptoms + summary. */
export const runTriage = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ messages: z.array(Msg).min(1).max(60) }).parse(d))
  .handler(async ({ data }): Promise<{ triage: Triage | null; error?: string }> => {
    const { jev, generate, GatewayError } = await import("./ai.server");
    const transcript = data.messages.map((m) => `${m.role === "user" ? "Owner" : "Assistant"}: ${m.content}`).join("\n").slice(-12000);
    try {
      const [answers, extracted] = await Promise.all([
        jev({ conversation: transcript }, {
          request_type: {
            type: "choice",
            instructions: "What kind of request is the pet owner making in `conversation`? This is routing, not a diagnosis.",
            criteria: {
              health_concern: "The owner describes symptoms, illness, injury or a behaviour change in an animal.",
              appointment: "The owner mainly wants to book, change or cancel a veterinary visit (checkup, vaccination, routine care).",
              clinic_information: "The owner asks about clinic services, hours, prices, staff, policies, preparation or other clinic facts.",
              general_question: "A general pet care question without a specific health problem.",
              other: "None of the above.",
            },
          },
          urgency: {
            type: "choice",
            instructions: "How quickly should a veterinarian see the animal, based only on what the owner reported in `conversation`? Do not diagnose.",
            criteria: {
              routine: "No worrying signs; a regular appointment is fine, or no visit is needed.",
              soon: "Mild but real symptoms that should be checked within a few days.",
              urgent: "Significant symptoms (e.g. repeated vomiting, not eating for over a day, lameness, pain) that should be seen today.",
              emergency: "Possible emergency signs: difficulty breathing, collapse, seizures, heavy bleeding, suspected poisoning, bloated abdomen, unable to urinate, severe trauma, pale gums.",
            },
          },
          destination: {
            type: "choice",
            instructions: "What is the best next step for this owner in `conversation`?",
            criteria: {
              ai: "Keep talking with the assistant: important details (species, what happened, duration) are still missing.",
              clinic_staff: "Clinic staff should review the case personally, e.g. urgent or complex symptoms, emergencies, or media to review.",
              information_desk: "The owner needs clinic information or general educational answers, not a visit.",
              booking: "Enough is known and the owner should book a veterinary appointment.",
            },
          },
        }),
        generate(
          "You extract structured facts from a pet owner conversation. Output ONLY compact JSON: {\"symptoms\": string[], \"short_summary\": string}. Symptoms are what the owner reported, in plain words (max 8). The summary is 1-2 neutral sentences in English for clinic staff. Never diagnose or name a condition.",
          transcript,
        ),
      ]);
      let symptoms: string[] = [];
      let short_summary = "";
      try {
        const j = JSON.parse(extracted.slice(extracted.indexOf("{"), extracted.lastIndexOf("}") + 1)) as { symptoms?: unknown; short_summary?: unknown };
        symptoms = Array.isArray(j.symptoms) ? j.symptoms.filter((s): s is string => typeof s === "string").slice(0, 8) : [];
        short_summary = typeof j.short_summary === "string" ? j.short_summary : "";
      } catch { /* leave empty */ }
      const rt = answers["request_type"], ur = answers["urgency"], de = answers["destination"];
      if (!rt?.choice || !ur?.choice || !de?.choice) return { triage: null, error: "Triage could not be completed." };
      let dest = de.choice as Triage["suggested_destination"];
      if (ur.choice === "emergency" || ur.choice === "urgent") dest = "clinic_staff";
      return {
        triage: {
          request_type: rt.choice,
          urgency: ur.choice as Triage["urgency"],
          suggested_destination: dest,
          symptoms,
          short_summary,
          confidence: Math.round(Math.min(rt.confidence ?? 0, ur.confidence ?? 0, de.confidence ?? 0) * 100) / 100,
        },
      };
    } catch (e) {
      return { triage: null, error: e instanceof GatewayError ? e.message : "Triage could not be completed." };
    }
  });

/** Information Desk: answers only from stored clinic knowledge + stored veterinarian records + stored slots. */
export const askInformationDesk = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ question: z.string().min(2).max(1000) }).parse(d))
  .handler(async ({ data }): Promise<{ answer: string; sources: { title: string; category: string }[]; available: boolean; error?: string }> => {
    const { generate, GatewayError } = await import("./ai.server");
    const { groundedContext, publicDb } = await import("./retrieval.server");
    const NA = "This information is not available yet. The clinic has not added it to Love Vet AI. Please contact the clinic directly.";
    try {
      await publicDb().rpc("ensure_demo_slots");
      const { context, sources } = await groundedContext(data.question, { withSlots: true });
      if (!context) return { answer: NA, sources: [], available: false };
      const answer = await generate(
        `You are the Information Desk of a DEMO veterinary clinic. Answer using ONLY the numbered entries ([K] clinic entries, [V] veterinarian records with stored next slots). Copy names, addresses, times and numbers exactly as written. If the entries do not contain the answer, reply with this sentence translated into the question's language: "${NA}" Never invent facts, prices, hours, doctors, addresses or times, and never use general knowledge. Only list veterinarians whose record actually matches the question. Reply in the language of the question, concisely. No medical diagnosis.`,
        `Entries:\n${context}\n\nQuestion: ${data.question}`,
      );
      const available = !/not available yet|no está disponible|n'est pas encore disponible|nicht verfügbar|недоступн/i.test(answer);
      return { answer, available, sources: available ? sources : [] };
    } catch (e) {
      return { answer: "", sources: [], available: false, error: e instanceof GatewayError ? e.message : "The Information Desk could not answer right now." };
    }
  });

/** Staff: add a clinic knowledge entry with its embedding. RLS enforces the staff role. */
export const addKnowledge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ category: z.string().min(2).max(60), title: z.string().min(2).max(200), content: z.string().min(5).max(8000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { embed } = await import("./ai.server");
    const [vec] = await embed([`${data.title}\n${data.content}`]);
    const { error } = await context.supabase.from("knowledge_documents").insert({ ...data, embedding: JSON.stringify(vec), created_by: context.userId });
    if (error) return { ok: false, error: error.code === "42501" ? "Only verified clinic staff can add clinic information." : error.message };
    return { ok: true };
  });

export type VetMatch = {
  id: string; name: string; title: string; specialty: string; expertise: string[]; species: string[]; languages: string[];
  years_experience: number; bio: string; initials: string; urgent_care: boolean; appointment_types: string[];
  clinic_name: string; clinic_address: string; clinic_id: string | null;
  provider_type: string; home_visit: boolean; service_area: string[];
  reason: string; slots: { id: string; starts_at: string; duration_min: number }[];
};

const SPECIALTY_LABEL: Record<string, string> = {
  general: "general veterinary medicine", emergency: "urgent care", dermatology: "dermatology", internal_medicine: "internal medicine",
  surgery: "surgery", exotics: "rabbit & small-mammal medicine", feline_medicine: "feline medicine", canine_medicine: "canine medicine",
  senior_care: "senior & chronic care",
};

/** Retrieves stored veterinarians for the case, validates against structured records, attaches real slots. Never generates a doctor. */
export const matchVeterinarians = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    species: z.string().max(60).optional().default(""),
    symptoms: z.array(z.string().max(200)).max(12).default([]),
    summary: z.string().max(2000).default(""),
    urgency: z.enum(URGENCIES),
    /** Preferred clinic-local hour window, e.g. afternoon = 12–17. */
    window: z.object({ from: z.number().min(0).max(24), to: z.number().min(0).max(24) }).nullable().optional().default(null),
    homeVisit: z.boolean().optional().default(false),
    location: z.string().max(120).optional().default(""),
  }).parse(d))
  .handler(async ({ data }): Promise<{ specialty: string; vets: VetMatch[]; note?: string; error?: string }> => {
    const { jev, embed } = await import("./ai.server");
    const { ensureIndexed, retrieveVets, nextSlots, publicDb, servesArea } = await import("./retrieval.server");
    await Promise.all([publicDb().rpc("ensure_demo_slots"), ensureIndexed()]);
    let specialty = "general";
    const [spec, vec] = await Promise.all([
      jev({ species: data.species || "unknown", symptoms: data.symptoms, summary: data.summary, urgency: data.urgency }, {
        specialty: {
          type: "choice",
          instructions: "Which clinic service best fits a first visit for this animal, based only on `species`, `symptoms`, `summary` and `urgency`? This is scheduling, not a diagnosis.",
          criteria: {
            exotics: "The animal is a rabbit, guinea pig, hamster, chinchilla, ferret, bird or reptile.",
            emergency: "Dog or cat with urgency 'urgent' needing a same-day visit.",
            dermatology: "Dog or cat with mainly skin, coat, itching, scratching, hair loss or ear concerns.",
            internal_medicine: "Dog or cat with vomiting, diarrhoea, appetite, drinking, urination or weight changes.",
            surgery: "Dog or cat with lumps, wounds, lameness or post-operative checks.",
            senior_care: "An older dog or cat with slowing down, stiffness or a long-term condition.",
            general: "Routine care, vaccination, checkups, or anything else.",
          },
        },
      }).then((a) => a["specialty"]?.choice).catch(() => undefined),
      embed([`Species: ${data.species || "unknown"}. Concern: ${data.symptoms.join(", ")}. ${data.summary} Urgency: ${data.urgency}.`]).then((v) => v[0]).catch(() => undefined),
    ]);
    if (spec) specialty = spec;
    if (!vec) return { specialty, vets: [], error: "Could not search the veterinarian directory right now." };
    const sp = data.species.toLowerCase().trim();
    const cands = await retrieveVets(vec, 16);
    let note: string | undefined;
    // Structured validation: the stored record must list this species.
    const treats = (v: { species: string[] }) => !sp || v.species.some((s) => sp.includes(s) || s.includes(sp));
    const urgentCase = data.urgency === "urgent";
    const pool = data.homeVisit ? cands.filter((v) => v.home_visit && servesArea(v, data.location)) : cands.filter((v) => !v.home_visit);
    if (data.homeVisit) {
      if (!data.location.trim()) return { specialty, vets: [], note: "Tell us your town or ZIP code so we can check whether the stored home-visit provider covers your area." };
      if (!pool.length) note = "No home-visit veterinarian in the demo directory covers this location. You can book a visit at the demo clinic instead.";
    }
    const ranked = pool.filter(treats).filter((v) => !urgentCase || v.urgent_care || v.specialty === specialty)
      .map((v) => ({ v, score: v.similarity * 4 + (v.specialty === specialty ? 2 : 0) + (urgentCase && v.urgent_care ? 2 : 0) }))
      .sort((a, b) => b.score - a.score);
    const out: VetMatch[] = [];
    for (const { v } of ranked) {
      if (out.length >= 3) break;
      const slots = await nextSlots(v.id, urgentCase ? 4 : 8, data.window);
      if (!slots.length) continue;
      const text = `${data.symptoms.join(" ")} ${data.summary}`.toLowerCase();
      const hit = v.conditions.filter((c) => c.split(" ").some((w) => w.length > 3 && text.includes(w.slice(0, -1)))).slice(0, 2);
      const reason = [
        `${SPECIALTY_LABEL[v.specialty] ?? v.specialty.replace(/_/g, " ")}${v.specialty === specialty ? ", the service that fits this concern" : ""}`,
        hit.length ? `sees ${hit.join(" and ")}` : "",
        sp ? `treats ${sp}s` : "",
        urgentCase && v.urgent_care ? "offers same-day urgent visits" : "",
        v.home_visit ? `home visits in the stored service area (${v.service_area.join(", ")})` : "",
      ].filter(Boolean).join(" · ");
      out.push({
        id: v.id, name: v.name, title: v.title, specialty: SPECIALTY_LABEL[v.specialty] ?? v.specialty, expertise: [...v.secondary_specialties, ...v.interests].slice(0, 5),
        species: v.species, languages: v.languages, years_experience: v.years_experience, bio: v.bio, initials: v.initials, urgent_care: v.urgent_care,
        appointment_types: v.appointment_types, clinic_name: v.clinic?.name ?? "", clinic_address: v.clinic?.address ?? "", reason, slots,
        clinic_id: null, provider_type: v.provider_type, home_visit: v.home_visit, service_area: v.service_area,
      });
    }
    if (!out.length && !note && data.window) note = "No stored open times match that time preference. Try a wider time range.";
    return { specialty, vets: out, ...(note ? { note } : {}) };
  });
