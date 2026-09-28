import { Check, Clock, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";
import type { Location } from "@/lib/love-vet-data";

export function LocationCard({
  location,
  selected,
  onSelect,
}: {
  location: Location;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "glass w-full rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
        selected && "border-ice-lum shadow-[var(--shadow-float),var(--glow-silver-blue)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-navy">{location.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-graphite">
            <MapPin className="size-3.5" aria-hidden /> {location.area} · {location.distance}
          </p>
        </div>
        {selected ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Check className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {location.services.map((s) => (
          <span
            key={s}
            className="rounded-md border border-silver bg-card px-2 py-0.5 text-[0.68rem] text-graphite"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-silver pt-3">
        <Clock className="size-3.5 text-deep" aria-hidden />
        <span className="text-xs text-graphite">Next available:</span>
        <StatusBadge tone="info">{location.nextAvailable}</StatusBadge>
      </div>
    </button>
  );
}
