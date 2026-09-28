import { Check, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";
import type { Veterinarian } from "@/lib/love-vet-data";

export function VeterinarianCard({
  vet,
  selected,
  recommended,
  onSelect,
}: {
  vet: Veterinarian;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "glass flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
        selected && "border-ice-lum shadow-[var(--shadow-float),var(--glow-silver-blue)]",
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg surface-ice border border-silver-strong/60 font-display text-sm font-semibold text-deep">
        {vet.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display text-sm font-semibold text-navy">{vet.name}</span>
          {recommended ? (
            <StatusBadge tone="info">
              <Sparkles className="size-3" aria-hidden /> Recommended
            </StatusBadge>
          ) : null}
        </span>
        <span className="mt-0.5 block text-xs text-graphite">{vet.specialty}</span>
        <span className="mt-0.5 block text-[0.68rem] text-graphite">
          Speaks {vet.languages.join(", ")}
        </span>
      </span>
      {selected ? (
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Check className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </button>
  );
}
