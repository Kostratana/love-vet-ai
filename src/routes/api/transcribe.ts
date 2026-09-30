import { createFileRoute } from "@tanstack/react-router";
import { GATEWAY, STT_MODEL, apiKey, friendly } from "@/lib/ai.server";

const MAX = 13 * 1024 * 1024; // Gemini transcription limit is 14 MB

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const len = Number(request.headers.get("content-length") ?? 0);
        if (len > MAX + 64 * 1024) return Response.json({ error: "The voice message is too long. Please keep it under a few minutes." }, { status: 413 });
        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File) || file.size === 0) return Response.json({ error: "No audio was received." }, { status: 400 });
        if (file.size > MAX) return Response.json({ error: "The voice message is too long." }, { status: 413 });
        const type = file.type.startsWith("audio/") ? file.type.split(";")[0]! : "audio/webm";
        const up = new FormData();
        up.append("file", new File([await file.arrayBuffer()], file.name || "voice.webm", { type }));
        up.append("model", STT_MODEL);
        up.append("stream", "true");
        const res = await fetch(`${GATEWAY}/audio/transcriptions`, { method: "POST", headers: { Authorization: `Bearer ${apiKey()}` }, body: up, signal: request.signal });
        if (!res.ok || !res.body) {
          console.error("transcribe failed", res.status, await res.text().catch(() => ""));
          return Response.json({ error: res.status === 400 ? "This recording could not be read. Please try again." : friendly(res.status) }, { status: res.status });
        }
        // Parse SSE: transcript.text.delta / transcript.text.done
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "", text = "", final: string | null = null;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const d = line.slice(5).trim();
            if (!d || d === "[DONE]") continue;
            try {
              const ev = JSON.parse(d) as { type?: string; delta?: string; text?: string };
              if (ev.type === "transcript.text.delta" && ev.delta) text += ev.delta;
              if (ev.type === "transcript.text.done" && typeof ev.text === "string") final = ev.text;
            } catch { /* partial line */ }
          }
        }
        const out = (final ?? text).trim();
        if (!out) return Response.json({ error: "No speech was detected in the recording." }, { status: 422 });
        return Response.json({ text: out });
      },
    },
  },
});
