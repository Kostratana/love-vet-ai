/**
 * RAG 3 — Private Patient History. Every call runs as the signed-in user (RLS applies);
 * public clinic/provider retrieval never touches these rows.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Chunk = { source_type: string; source_id: string; content: string; appointment_id?: string | null; veterinarian_id?: string | null; clinic_id?: string | null; case_date: string };

/** Turns one conversation (a case) into private semantic history chunks for its pet. Idempotent per source. */
export const indexCaseHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ conversationId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const sb = context.supabase;
    const { data: conv } = await sb.from("conversations").select("id,user_id,pet_id,created_at").eq("id", data.conversationId).eq("user_id", context.userId).maybeSingle();
    if (!conv?.pet_id) return { indexed: 0, reason: "no pet selected" };
    const [{ data: intakes }, { data: tri }, { data: files }, { data: appts }] = await Promise.all([
      sb.from("veterinary_intakes").select("id,summary,symptoms,created_at").eq("conversation_id", conv.id),
      sb.from("triage_results").select("id,urgency,short_summary,symptoms,request_type,created_at").eq("conversation_id", conv.id).order("created_at", { ascending: false }).limit(1),
      sb.from("uploaded_files").select("id,kind,transcription,analysis,ocr_text,analysis_status,created_at,pet_id").eq("conversation_id", conv.id),
      sb.from("appointments").select("id,requested_at,appointment_type,status,notes,veterinarian_id,clinic_id,vet:veterinarians(name,specialty)").eq("conversation_id", conv.id),
    ]);
    const chunks: Chunk[] = [];
    const t = tri?.[0];
    for (const i of intakes ?? []) {
      const txt = [
        i.summary && `OWNER REPORTED / case summary: ${i.summary}`,
        i.symptoms?.length && `Concerns: ${i.symptoms.join(", ")}`,
        t && `TRIAGE (routing support, not a diagnosis): urgency ${t.urgency}; ${t.short_summary}`,
      ].filter(Boolean).join("\n");
      if (txt) chunks.push({ source_type: "intake", source_id: i.id, content: txt, case_date: i.created_at });
    }
    for (const f of files ?? []) {
      if (f.pet_id && f.pet_id !== conv.pet_id) continue; // never attach another pet's media
      const txt = f.kind === "voice"
        ? f.transcription && `VOICE transcript (owner's words): ${f.transcription}`
        : f.analysis_status === "done" && f.analysis && `${f.kind.toUpperCase()} — AI observed (not a diagnosis): ${f.analysis}${f.ocr_text ? `\nText in image: ${f.ocr_text}` : ""}`;
      if (txt) chunks.push({ source_type: `media_${f.kind}`, source_id: f.id, content: txt, case_date: f.created_at });
    }
    for (const a of appts ?? []) {
      const vet = (a as unknown as { vet: { name: string; specialty: string } | null }).vet;
      chunks.push({
        source_type: "appointment", source_id: a.id, appointment_id: a.id, veterinarian_id: a.veterinarian_id, clinic_id: a.clinic_id, case_date: a.requested_at,
        content: `APPOINTMENT ${a.appointment_type} (${a.status}) on ${a.requested_at.slice(0, 10)}${vet ? ` with ${vet.name} (${vet.specialty.replace(/_/g, " ")})` : ""}. Reason: ${a.notes || "not recorded"}`,
      });
    }
    if (!chunks.length) return { indexed: 0 };
    const apptLink = (appts ?? [])[0];
    const { embed } = await import("./ai.server");
    const vecs = await embed(chunks.map((c) => c.content));
    const rows = chunks.map((c, i) => ({
      user_id: context.userId, pet_id: conv.pet_id!, conversation_id: conv.id,
      appointment_id: c.appointment_id ?? apptLink?.id ?? null, veterinarian_id: c.veterinarian_id ?? apptLink?.veterinarian_id ?? null, clinic_id: c.clinic_id ?? apptLink?.clinic_id ?? null,
      source_type: c.source_type, source_id: c.source_id, content: c.content, case_date: c.case_date,
      embedding: JSON.stringify(vecs[i]), updated_at: new Date().toISOString(),
    }));
    const { error } = await sb.from("patient_history_chunks").upsert(rows, { onConflict: "source_type,source_id" });
    if (error) { console.error("history index failed", error.message); return { indexed: 0, error: "Could not update pet history." }; }
    return { indexed: rows.length };
  });

export type HistoryCase = { conversationId: string | null; date: string; vet: string | null; similarity: number; snippets: { type: string; text: string }[]; media: { photo: number; video: number; voice: number } };

/** Semantic search over ONE pet's private history, scoped by RLS + explicit pet filter inside the database. */
export const relatedPetHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ petId: z.string().uuid(), query: z.string().min(2).max(2000), excludeConversationId: z.string().uuid().nullable().optional() }).parse(d))
  .handler(async ({ data, context }): Promise<{ cases: HistoryCase[] }> => {
    const { embed } = await import("./ai.server");
    const [vec] = await embed([data.query]);
    const { data: hits, error } = await context.supabase.rpc("match_patient_history", {
      query_embedding: JSON.stringify(vec), _pet_id: data.petId, _exclude_conversation: (data.excludeConversationId ?? null) as string, match_count: 10, min_similarity: 0.55,
    });
    if (error) { console.error("history match failed", error.message); return { cases: [] }; }
    const rows = (hits ?? []) as { conversation_id: string | null; veterinarian_id: string | null; source_type: string; content: string; case_date: string; similarity: number }[];
    const vetIds = [...new Set(rows.map((r) => r.veterinarian_id).filter(Boolean))] as string[];
    const { data: vets } = vetIds.length ? await context.supabase.from("veterinarians").select("id,name").in("id", vetIds) : { data: [] };
    const vetName = new Map((vets ?? []).map((v) => [v.id, v.name]));
    const byCase = new Map<string, HistoryCase>();
    for (const r of rows) {
      const k = r.conversation_id ?? r.case_date;
      const c = byCase.get(k) ?? { conversationId: r.conversation_id, date: r.case_date, vet: null, similarity: r.similarity, snippets: [], media: { photo: 0, video: 0, voice: 0 } };
      if (r.veterinarian_id) c.vet = vetName.get(r.veterinarian_id) ?? c.vet;
      c.similarity = Math.max(c.similarity, r.similarity);
      if (r.source_type.startsWith("media_")) c.media[r.source_type.slice(6) as "photo" | "video" | "voice"]++;
      if (c.snippets.length < 3) c.snippets.push({ type: r.source_type, text: r.content.slice(0, 400) });
      byCase.set(k, c);
    }
    return { cases: [...byCase.values()].sort((a, b) => b.similarity - a.similarity).slice(0, 3) };
  });
