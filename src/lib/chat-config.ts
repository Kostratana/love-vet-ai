/**
 * Configurable chat upload limits. Change here when backend/storage limits are finalized.
 */
export const UPLOAD_LIMITS = {
  photo: {
    accept: ["image/jpeg", "image/png", "image/webp"],
    extensions: "JPG, JPEG, PNG, WEBP",
    maxBytes: 10 * 1024 * 1024,
    maxCount: 5,
  },
  video: {
    accept: ["video/mp4", "video/quicktime", "video/webm"],
    extensions: "MP4, MOV, WEBM",
    maxBytes: 100 * 1024 * 1024,
    maxCount: 1,
  },
} as const;

export const OPENING_MESSAGE = `Hello. I'm your veterinary appointment assistant.

Tell me what's happening with your pet. I'll ask you for the information needed to help arrange your appointment and find appropriate veterinary care.

You can type or leave a voice message in the language you're most comfortable with.

If you have photos or a short video that may help show the problem, you can upload them here.`;

export type AttachmentMeta = {
  kind: "photo" | "video" | "voice";
  name: string;
  size: number;
  durationSec?: number | undefined;
  mime?: string | undefined;
  /** Storage path when saved to the signed-in user's private media. */
  path?: string | undefined;
  transcription?: string | undefined;
};

/**
 * Future orchestration states, in order. The UI surfaces the current stage once
 * the assistant service is connected.
 */
export const ORCHESTRATION_STAGES = [
  "language_detection",
  "information_collection",
  "case_extraction",
  "safety_check",
  "grounded_routing",
  "species_service_filtering",
  "location_hours_filtering",
  "veterinarian_availability",
  "appointment_options",
  "client_confirmation",
  "pre_visit_handoff",
] as const;

export const formatBytes = (b: number) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
