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

