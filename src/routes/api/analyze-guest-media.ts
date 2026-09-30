import { createFileRoute } from "@tanstack/react-router";

/** Guest demo: analyze a short photo/video in memory only. Nothing is stored; the file is discarded after the call. */
const LIMITS = { photo: 10 * 1024 * 1024, video: 20 * 1024 * 1024 };
const TYPES = { photo: ["image/jpeg", "image/png", "image/webp"], video: ["video/mp4", "video/quicktime", "video/webm"] };

export const Route = createFileRoute("/api/analyze-guest-media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const fd = await request.formData().catch(() => null);
        const file = fd?.get("file");
        if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
        const kind = TYPES.video.includes(file.type) ? "video" : TYPES.photo.includes(file.type) ? "photo" : null;
        if (!kind) return Response.json({ error: "Unsupported file type." }, { status: 400 });
        if (file.size > LIMITS[kind]) return Response.json({ error: `Guest ${kind}s can be up to ${LIMITS[kind] / 1048576} MB. Sign in for larger files.` }, { status: 413 });
        const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        const url = `data:${file.type === "video/quicktime" ? "video/mp4" : file.type};base64,${b64}`;
        const { analyzePhoto, analyzeVideo } = await import("@/lib/media-analysis.server");
        try {
          const r = kind === "video" ? await analyzeVideo(url, request.signal) : await analyzePhoto(url, request.signal);
          return Response.json({ ...r, stored: false });
        } catch (e) {
          console.error("guest media analysis error", e instanceof Error ? e.message : e);
          return Response.json({ error: e instanceof Error ? e.message : "Automated analysis was unavailable." }, { status: (e as { status?: number }).status ?? 502 });
        }
      },
    },
  },
});
