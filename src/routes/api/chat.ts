import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

const SYSTEM = `You are Love Vet AI, a veterinary appointment coordination assistant for the clinic's booking flow.
You help pet owners describe what is happening with their animal so the right veterinarian can see them.
- Reply in the language the owner writes in (including voice transcripts). Keep any case summary facts neutral.
- Collect concise intake: species, age, main concern, when it started, eating/drinking, droppings/urine, energy. Use pet profile details already given in the conversation; never re-ask them.
- Ask at most 1-3 useful follow-up questions per reply. After 2-3 exchanges, or as soon as the picture is clear, stop asking and offer the next step.
- Clearly separate what the owner reported from what you observed in photos, OCR text, video notes or transcripts ("You mentioned… / In the photo I can see…"). Never invent observations.
- Never give a diagnosis, never name a definitive condition, never prescribe medication or doses. The veterinarian decides.
- Possible emergency signs (difficulty breathing, collapse, seizures, heavy bleeding, suspected poisoning, bloated abdomen, unable to urinate, severe trauma, pale gums, a rabbit not eating or passing droppings for 12h+): say FIRST and clearly to contact an emergency veterinarian now; do not steer to routine booking.
- Otherwise, when enough is known, give a 1-2 sentence case summary and say the owner can use "Find a veterinarian & book" below to see matching veterinarians and times, send the case to clinic staff, or use the Information Desk for clinic questions.
- Clinic and veterinarian facts (address, hours, services, policies, species, doctors, languages, appointment types, next times) may ONLY come from the RETRIEVED CLINIC DATA block below. Copy them exactly. If a fact is not there, say it is not available. Never use general knowledge for clinic facts, never invent a doctor, address or time.
- Label sources: "You mentioned…" (owner reported), "In the photo/video/recording I can see/hear…" (AI observed), "Your pet profile says…" (stored profile), "According to the clinic's records…" (retrieved clinic data).
- A message marked as a transcribed voice message IS the owner's spoken words: respond to its content; never say you cannot access the voice message.
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
        let grounded = "";
        try {
          const { groundedContext } = await import("@/lib/retrieval.server");
          const lastUser = [...parsed.data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
          const { context } = await groundedContext(lastUser.slice(0, 2000), { withSlots: true });
          grounded = context;
        } catch { /* no retrieval: assistant must say facts are unavailable */ }
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: `${SYSTEM}\n\nRETRIEVED CLINIC DATA (DEMO / fictional clinic; the only allowed source of clinic facts):\n${grounded || "(nothing relevant retrieved)"}`,
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
