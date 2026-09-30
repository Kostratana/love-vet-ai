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

/** Information Desk: answers only from stored clinic knowledge. */
export const askInformationDesk = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ question: z.string().min(2).max(1000) }).parse(d))
  .handler(async ({ data }): Promise<{ answer: string; sources: { title: string; category: string }[]; available: boolean; error?: string }> => {
    const { embed, generate, GatewayError } = await import("./ai.server");
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false } });
    const NA = "This information is not available yet. The clinic has not added it to Love Vet AI. Please contact the clinic directly.";
    try {
      // Embed any clinic entries that were added without an embedding (e.g. the demo clinic seed).
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: pending } = await supabaseAdmin.from("knowledge_documents").select("id,title,content").is("embedding", null).limit(20);
        if (pending?.length) {
          const vecs = await embed(pending.map((p) => `${p.title}\n${p.content}`));
          await Promise.all(pending.map((p, i) => supabaseAdmin.from("knowledge_documents").update({ embedding: JSON.stringify(vecs[i]) }).eq("id", p.id)));
        }
      } catch { /* answer with what is already indexed */ }
      const { count } = await sb.from("knowledge_documents").select("id", { count: "exact", head: true });
      if (!count) return { answer: NA, sources: [], available: false };
      const [vec] = await embed([data.question]);
      const { data: hits, error } = await sb.rpc("match_knowledge", { query_embedding: JSON.stringify(vec), match_count: 5, min_similarity: 0.5 });
      if (error) throw error;
      const list = (hits ?? []) as { title: string; category: string; content: string }[];
      if (!list.length) return { answer: NA, sources: [], available: false };
      const ctx = list.map((h, i) => `[${i + 1}] (${h.category}) ${h.title}\n${h.content}`).join("\n\n");
      const answer = await generate(
        `You answer questions about a veterinary clinic using ONLY the numbered entries provided. If the entries do not contain the answer, reply exactly: "${NA}" Never invent facts, prices, hours or names. Reply in the language of the question. No medical diagnosis.`,
        `Entries:\n${ctx}\n\nQuestion: ${data.question}`,
      );
      const available = !answer.includes("not available yet");
      return { answer, available, sources: available ? list.map((h) => ({ title: h.title, category: h.category })) : [] };
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
  id: string; name: string; title: string; specialty: string; species: string[]; languages: string[]; bio: string; initials: string;
  reason: string; slots: { id: string; starts_at: string; duration_min: number }[];
};

const SPECIALTY_LABEL: Record<string, string> = {
  general: "general veterinary medicine", emergency: "urgent care", dermatology: "dermatology",
  internal_medicine: "internal medicine", surgery: "surgery", exotics: "exotic & small mammal medicine",
};

/** Matches ONLY stored veterinarian records to the case. Routing help, not a diagnosis. */
export const matchVeterinarians = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({
    species: z.string().max(60).optional().default(""),
    symptoms: z.array(z.string().max(200)).max(12).default([]),
    summary: z.string().max(2000).default(""),
    urgency: z.enum(URGENCIES),
  }).parse(d))
  .handler(async ({ data }): Promise<{ specialty: string; vets: VetMatch[]; error?: string }> => {
    const { jev } = await import("./ai.server");
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false } });
    await sb.rpc("ensure_demo_slots");
    let specialty = "general";
    try {
      const a = await jev({ species: data.species || "unknown", symptoms: data.symptoms, summary: data.summary, urgency: data.urgency }, {
        specialty: {
          type: "choice",
          instructions: "Which clinic service best fits a first visit for this animal, based only on `species`, `symptoms`, `summary` and `urgency`? This is scheduling, not a diagnosis.",
          criteria: {
            exotics: "The animal is a rabbit, guinea pig, hamster, chinchilla, ferret, bird or reptile.",
            emergency: "Dog or cat with urgency 'urgent' needing a same-day visit.",
            dermatology: "Dog or cat with mainly skin, coat, itching, hair loss or ear concerns.",
            internal_medicine: "Dog or cat with vomiting, diarrhoea, appetite, drinking, urination or weight changes.",
            surgery: "Dog or cat with lumps, wounds, lameness or post-operative checks.",
            general: "Routine care, vaccination, checkups, or anything else.",
          },
        },
      });
      if (a["specialty"]?.choice) specialty = a["specialty"].choice;
    } catch { /* fall back to general */ }
    const sp = data.species.toLowerCase().trim();
    const { data: vets, error } = await sb.from("veterinarians").select("id,name,title,specialty,species,languages,bio,initials").eq("active", true);
    if (error || !vets) return { specialty, vets: [], error: "Could not load veterinarians." };
    const treats = (v: { species: string[] }) => !sp || v.species.some((s) => sp.includes(s) || s.includes(sp));
    const ranked = vets.filter(treats).map((v) => ({ v, score: (v.specialty === specialty ? 3 : 0) + (v.specialty === "general" ? 1 : 0) + (data.urgency === "urgent" && v.specialty === "emergency" ? 2 : 0) }))
      .sort((a, b) => b.score - a.score).slice(0, 3);
    const out: VetMatch[] = [];
    for (const { v } of ranked) {
      const { data: slots } = await sb.from("vet_slots").select("id,starts_at,duration_min").eq("veterinarian_id", v.id).eq("booked", false)
        .gte("starts_at", new Date(Date.now() + 3600_000).toISOString()).order("starts_at").limit(data.urgency === "urgent" ? 4 : 8);
      const reason = v.specialty === specialty
        ? `Offers ${SPECIALTY_LABEL[v.specialty] ?? v.specialty}, which fits the reported concern${sp ? ` for a ${sp}` : ""}.`
        : `${SPECIALTY_LABEL[v.specialty] ?? v.specialty} — ${sp ? `treats ${sp}s` : "sees many species"} and can do a first assessment.`;
      out.push({ ...v, reason, slots: slots ?? [] });
    }
    return { specialty, vets: out };
  });
