import { Film, ImageIcon, Play, X } from "lucide-react";
import { GlassCard } from "@/components/kit/primitives";

export type AttachmentKind = "photo" | "video";

export function MediaAttachment({
  kind,
  fileName,
  meta,
  onRemove,
}: {
  kind: AttachmentKind;
  fileName: string;
  meta?: string;
  onRemove?: () => void;
}) {
  return (
    <GlassCard variant="solid" pad="none" className="flex items-center gap-3 p-3">
      <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg surface-ice border border-silver-strong/60">
        {kind === "photo" ? (
          <ImageIcon className="size-5 text-deep" aria-hidden />
        ) : (
          <>
            <Film className="size-5 text-deep" aria-hidden />
            <span className="absolute inset-0 grid place-items-center bg-navy/10">
              <span className="grid size-6 place-items-center rounded-full bg-card shadow-[var(--shadow-glass)]">
                <Play className="size-3 text-deep" aria-hidden />
              </span>
            </span>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{fileName}</p>
        <p className="truncate text-xs text-graphite">
          {meta ?? (kind === "photo" ? "Photo attachment" : "Video attachment")}
        </p>
        <p className="mt-0.5 text-[0.68rem] text-graphite">
          Prepared for veterinary review · no automated diagnosis
        </p>
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${fileName}`}
          className="grid size-8 place-items-center rounded-md border border-silver-strong/60 bg-card text-graphite transition-colors hover:text-navy"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </GlassCard>
  );
}
