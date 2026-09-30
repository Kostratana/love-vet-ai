import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { GATEWAY, TTS_MODEL, apiKey, friendly } from "@/lib/ai.server";

const Body = z.object({ text: z.string().min(1).max(4000) });

/** Reads an assistant reply aloud. Returns a complete WAV file (user-initiated playback only). */
export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Nothing to read aloud." }, { status: 400 });
        // Strip markdown markers so they are not spoken.
        const text = parsed.data.text.replace(/\*\*|__|`|^#+\s*/gm, "").replace(/^\s*[-*]\s+/gm, "").trim();
        const res = await fetch(`${GATEWAY}/audio/speech`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: TTS_MODEL,
            contents: [{ role: "user", parts: [{ text: `Read this aloud warmly and clearly, in the language it is written in:\n\n${text}` }] }],
            generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } },
            stream_format: "audio",
          }),
          signal: request.signal,
        }).catch(() => null);
        if (!res || !res.ok || !res.body) {
          if (res) console.error("tts failed", res.status, await res.text().catch(() => ""));
          return Response.json({ error: res ? friendly(res.status) : "Audio is unavailable right now." }, { status: res?.status ?? 502 });
        }
        return new Response(res.body, { status: 200, headers: { "Content-Type": res.headers.get("content-type") ?? "audio/wav", "Cache-Control": "no-cache" } });
      },
    },
  },
});
