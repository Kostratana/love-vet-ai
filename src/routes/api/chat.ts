import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const SYSTEM = `You are Love Vet AI, a veterinary appointment coordination assistant.
You help pet owners describe what is happening with their animal so a veterinarian can see them.
- Reply in the language the owner writes in.
- Understand the concern, identify the symptoms mentioned, and ask 1-3 focused follow-up questions for missing details (species, age, duration, eating/drinking, energy, changes).
- Give only general informational guidance. Never give a diagnosis, never name a definitive condition, never prescribe medication or doses. Say the veterinarian decides.
- If there are possible emergency signs (difficulty breathing, collapse, seizures, heavy bleeding, suspected poisoning, bloated abdomen, unable to urinate, severe trauma, pale gums), say clearly and first: contact an emergency veterinarian right away.
- When enough information is collected, give a short case summary and suggest the next step: booking a veterinary appointment, sending to clinic staff, or the Information Desk for general questions.
- When the owner shares photos you can see, describe only what is visible, neutrally, without diagnosing. Videos cannot be viewed by you: say they are saved for the clinic staff to review.
- Never invent clinic names, hours, prices or veterinarians.
Keep replies concise and warm.`;

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000), images: z.array(z.string().url()).max(5).optional() }))
    .min(1)
    .max(60),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Invalid request", { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Assistant is not configured", { status: 500 });

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM,
          messages: parsed.data.messages.map((m) =>
            m.role === "user" && m.images?.length
              ? { role: "user" as const, content: [{ type: "text" as const, text: m.content }, ...m.images.map((u) => ({ type: "image" as const, image: new URL(u) }))] }
              : { role: m.role, content: m.content },
          ),
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return result.toTextStreamResponse({ headers: { "Cache-Control": "no-cache, no-transform" } });
      },
    },
  },
});
