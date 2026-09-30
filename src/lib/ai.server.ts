/** Server-only helpers for Lovable AI Gateway calls. */
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const GATEWAY = "https://ai.gateway.lovable.dev/v1";
export const CHAT_MODEL = "openai/gpt-6-astra";
export const TRIAGE_MODEL = "typesafe/jev-latest";
export const EMBED_MODEL = "google/gemini-embedding-2";
export const STT_MODEL = "google/gemini-3.5-transcribe";

export class GatewayError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function apiKey() {
  const k = process.env["LOVABLE_API_KEY"];
  if (!k) throw new GatewayError(500, "The assistant is not configured.");
  return k;
}

export function friendly(status: number) {
  if (status === 429) return "The assistant is busy right now. Please try again in a moment.";
  if (status === 402) return "The assistant is temporarily unavailable (AI credits exhausted).";
  if (status === 403) return "The assistant is not available for this request.";
  return "The assistant could not complete this request. Please try again.";
}

export function provider() {
  const key = apiKey();
  return createOpenAI({ baseURL: GATEWAY, apiKey: key, headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" } });
}

/** Streams a one-shot text answer and returns the full text. */
export async function generate(system: string, prompt: string) {
  const result = streamText({
    model: provider().responses(CHAT_MODEL),
    system,
    prompt,
    maxRetries: 0,
    providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
  });
  return await result.text;
}

export async function embed(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${GATEWAY}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) throw new GatewayError(res.status, friendly(res.status));
  const json = (await res.json()) as { data: { index: number; embedding: number[] }[] };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

type JevAnswer = { choice?: string; confidence?: number; probabilities?: Record<string, number>; noul?: number };
export async function jev(state: unknown, questions: Record<string, unknown>) {
  const res = await fetch(`${GATEWAY}/systemone`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({ model: TRIAGE_MODEL, state, questions }),
  });
  if (!res.ok) throw new GatewayError(res.status, friendly(res.status));
  const json = (await res.json()) as { answers?: Record<string, JevAnswer> };
  if (!json.answers) throw new GatewayError(502, "Triage returned no result.");
  return json.answers;
}
