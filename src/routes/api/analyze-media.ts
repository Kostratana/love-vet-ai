import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { CHAT_MODEL, GATEWAY, apiKey, friendly, provider } from "@/lib/ai.server";
import { streamText } from "ai";

export const VIDEO_MODEL = "google/gemini-3.8-flash";

const Body = z.object({ fileId: z.string().uuid() });

const VIDEO_PROMPT = `You review a pet owner's video for a veterinary intake. Report ONLY what is directly observable. Never diagnose, never name a condition, never guess causes.
Return plain text with these headings, writing "Not observable" when something cannot be seen:
Animal: species/size if visible
Behavior:
Mobility / gait:
Posture:
Breathing pattern (only if visibly observable):
Scratching / licking / shaking:
Visible skin, wound or swelling:
Timeline of notable events (with approximate seconds):
Visible text (exact, only if legible):
Video quality limits:`;

const PHOTO_PROMPT = `You review a pet owner's photo for a veterinary intake.
1) OBSERVATIONS: 2-4 neutral sentences of what is visible (animal, body area, visible skin/wound/swelling, posture). No diagnosis, no condition names.
2) TEXT: transcribe exactly any legible text (veterinary reports, prescriptions, medication labels, lab results, discharge instructions). Mark unreadable parts as [unreadable]. Never guess text. If there is no text, write exactly: NONE
Format:
OBSERVATIONS:
...
TEXT:
...`;

/** Analyzes a stored photo or video owned by the signed-in user and saves the result on the file row. */
export const Route = createFileRoute("/api/analyze-media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Sign in to analyze media." }, { status: 401 });
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
        const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
          auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: u } = await sb.auth.getUser(token);
        if (!u.user) return Response.json({ error: "Sign in to analyze media." }, { status: 401 });
        // RLS: only the owner's own file row is visible here.
        const { data: file } = await sb.from("uploaded_files").select("*").eq("id", parsed.data.fileId).eq("user_id", u.user.id).maybeSingle();
        if (!file || (file.kind !== "photo" && file.kind !== "video")) return Response.json({ error: "File not found." }, { status: 404 });
        const { data: signed } = await sb.storage.from("chat-media").createSignedUrl(file.storage_path, 900);
        if (!signed?.signedUrl) return Response.json({ error: "File not available." }, { status: 404 });

        const save = (patch: { analysis?: string | null; ocr_text?: string | null; analysis_status: string; analysis_model?: string }) =>
          sb.from("uploaded_files").update(patch).eq("id", file.id);

        try {
          if (file.kind === "video") {
            const res = await fetch(`${GATEWAY}/chat/completions`, {
              method: "POST",
              signal: request.signal,
              headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
              body: JSON.stringify({
                model: VIDEO_MODEL,
                stream: true,
                messages: [{ role: "user", content: [{ type: "text", text: VIDEO_PROMPT }, { type: "video_url", video_url: { url: signed.signedUrl } }] }],
              }),
            });
            if (!res.ok || !res.body) {
              console.error("video analysis failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
              await save({ analysis_status: "failed", analysis_model: VIDEO_MODEL });
              return Response.json({ error: friendly(res.status) }, { status: res.status === 200 ? 502 : res.status });
            }
            const reader = res.body.getReader();
            const dec = new TextDecoder();
            let buf = "", text = "";
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              buf += dec.decode(value, { stream: true });
              const lines = buf.split("\n");
              buf = lines.pop() ?? "";
              for (const line of lines) {
                const d = line.startsWith("data:") ? line.slice(5).trim() : "";
                if (!d || d === "[DONE]") continue;
                try { text += (JSON.parse(d) as { choices?: { delta?: { content?: string } }[] }).choices?.[0]?.delta?.content ?? ""; } catch { /* partial */ }
              }
            }
            text = text.trim();
            if (!text) { await save({ analysis_status: "failed", analysis_model: VIDEO_MODEL }); return Response.json({ error: "Automated video analysis returned nothing." }, { status: 502 }); }
            const ocr = /Visible text[^:]*:\s*(.+)/i.exec(text)?.[1]?.trim();
            await save({ analysis: text, ocr_text: ocr && !/not observable|none/i.test(ocr) ? ocr : null, analysis_status: "done", analysis_model: VIDEO_MODEL });
            return Response.json({ analysis: text, model: VIDEO_MODEL });
          }

          // Photo: the actual image is sent to gpt-6-astra (not a text description).
          const result = streamText({
            model: provider().responses(CHAT_MODEL),
            maxRetries: 0,
            abortSignal: request.signal,
            messages: [{ role: "user", content: [{ type: "text", text: PHOTO_PROMPT }, { type: "image", image: new URL(signed.signedUrl) }] }],
            providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
          });
          const out = (await result.text).trim();
          const obs = /OBSERVATIONS:\s*([\s\S]*?)(?:\n\s*TEXT:|$)/i.exec(out)?.[1]?.trim() ?? out;
          const txt = /TEXT:\s*([\s\S]*)$/i.exec(out)?.[1]?.trim() ?? "";
          const ocr = txt && txt.toUpperCase() !== "NONE" ? txt : null;
          await save({ analysis: obs, ocr_text: ocr, analysis_status: "done", analysis_model: CHAT_MODEL });
          return Response.json({ analysis: obs, ocr_text: ocr, model: CHAT_MODEL });
        } catch (e) {
          console.error("media analysis error", e instanceof Error ? e.message : e);
          await save({ analysis_status: "failed" });
          return Response.json({ error: "Automated analysis was unavailable." }, { status: 502 });
        }
      },
    },
  },
});
