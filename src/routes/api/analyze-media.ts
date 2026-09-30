import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const Body = z.object({ fileId: z.string().uuid() });

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
        const { analyzePhoto, analyzeVideo } = await import("@/lib/media-analysis.server");
        try {
          const r = file.kind === "video" ? await analyzeVideo(signed.signedUrl, request.signal) : await analyzePhoto(signed.signedUrl, request.signal);
          await sb.from("uploaded_files").update({ analysis: r.analysis, ocr_text: r.ocr_text, analysis_status: "done", analysis_model: r.model }).eq("id", file.id);
          return Response.json(r);
        } catch (e) {
          console.error("media analysis error", e instanceof Error ? e.message : e);
          await sb.from("uploaded_files").update({ analysis_status: "failed" }).eq("id", file.id);
          const status = (e as { status?: number }).status ?? 502;
          return Response.json({ error: e instanceof Error ? e.message : "Automated analysis was unavailable." }, { status });
        }
      },
    },
  },
});
