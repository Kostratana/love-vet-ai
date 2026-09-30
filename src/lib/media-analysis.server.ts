/** Shared photo/video understanding. Observations only — never a diagnosis. Server-only. */
import { streamText } from "ai";
import { CHAT_MODEL, GATEWAY, GatewayError, apiKey, friendly, provider } from "./ai.server";

export const VIDEO_MODEL = "google/gemini-3.8-flash";

const VIDEO_PROMPT = `You review a pet owner's short video for a veterinary intake. Report ONLY what is directly observable. Never diagnose, never name a condition, never infer pain, lameness or neurological disease, never guess causes.
Start each observation with "Observable in the video:". Write "Not observable" when something cannot be seen.
Return plain text with these headings:
Animal: species/size if visible
Behavior:
Mobility / gait (pace, weight bearing, visible asymmetry, repeated movement patterns — only if clearly visible):
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

/** url may be an https signed URL or a data: URL (guest, never stored). */
export async function analyzeVideo(url: string, signal?: AbortSignal) {
  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    signal: signal ?? null,
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: VIDEO_MODEL, stream: true, messages: [{ role: "user", content: [{ type: "text", text: VIDEO_PROMPT }, { type: "video_url", video_url: { url } }] }] }),
  });
  if (!res.ok || !res.body) {
    console.error("video analysis failed", res.status, (await res.text().catch(() => "")).slice(0, 300));
    throw new GatewayError(res.status === 200 ? 502 : res.status, friendly(res.status));
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
  if (!text) throw new GatewayError(502, "Automated video analysis returned nothing.");
  const ocr = /Visible text[^:]*:\s*(.+)/i.exec(text)?.[1]?.trim();
  return { analysis: text, ocr_text: ocr && !/not observable|none/i.test(ocr) ? ocr : null, model: VIDEO_MODEL };
}

export async function analyzePhoto(url: string, signal?: AbortSignal) {
  const result = streamText({
    model: provider().responses(CHAT_MODEL),
    maxRetries: 0,
    ...(signal ? { abortSignal: signal } : {}),
    messages: [{ role: "user", content: [{ type: "text", text: PHOTO_PROMPT }, { type: "image", image: url.startsWith("data:") ? url : new URL(url) }] }],
    providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
  });
  const out = (await result.text).trim();
  const obs = /OBSERVATIONS:\s*([\s\S]*?)(?:\n\s*TEXT:|$)/i.exec(out)?.[1]?.trim() ?? out;
  const txt = /TEXT:\s*([\s\S]*)$/i.exec(out)?.[1]?.trim() ?? "";
  return { analysis: obs, ocr_text: txt && txt.toUpperCase() !== "NONE" ? txt : null, model: CHAT_MODEL };
}
