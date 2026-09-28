import { ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  Disclaimer,
  FieldLabel,
  GlassCard,
  StatusBadge,
  priorityTone,
} from "@/components/kit/primitives";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/love-vet-data";

export function RoutingExplanation({
  route,
  priority,
  reason,
}: {
  route: string;
  priority: Priority;
  reason: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard variant="solid">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <FieldLabel>Suggested care route</FieldLabel>
          <p className="mt-1 font-display text-lg font-semibold text-navy">{route}</p>
          <p className="text-sm text-graphite">
            Priority: {priority === "SAME-DAY" ? "Same-day assessment" : priority.toLowerCase()}
          </p>
        </div>
        <StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-silver bg-silver-white/70 px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-ice/60"
      >
        <span className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-deep" aria-hidden />
          Why this route?
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="mt-3 space-y-2 rounded-lg border border-silver bg-card p-3">
          <p className="text-sm leading-relaxed text-navy">{reason}</p>
          <p className="text-sm font-semibold text-navy">Veterinarian assessment required.</p>
          <Disclaimer>AI routing assistance — not a diagnosis.</Disclaimer>
        </div>
      ) : null}
    </GlassCard>
  );
}
