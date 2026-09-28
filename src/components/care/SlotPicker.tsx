import { CalendarDays } from "lucide-react";
import { FieldLabel } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

export type DayOption = { id: string; label: string; weekday: string; day: string };

export const demoDays: DayOption[] = [
  { id: "2026-09-28", label: "Today", weekday: "Mon", day: "28" },
  { id: "2026-09-29", label: "Tomorrow", weekday: "Tue", day: "29" },
  { id: "2026-09-30", label: "Wed", weekday: "Wed", day: "30" },
  { id: "2026-10-01", label: "Thu", weekday: "Thu", day: "01" },
  { id: "2026-10-02", label: "Fri", weekday: "Fri", day: "02" },
];

export function SlotPicker({
  days = demoDays,
  selectedDay,
  onSelectDay,
  slots,
  selectedSlot,
  onSelectSlot,
}: {
  days?: DayOption[];
  selectedDay: string;
  onSelectDay: (id: string) => void;
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Select date</FieldLabel>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDay(d.id)}
              aria-pressed={selectedDay === d.id}
              className={cn(
                "glass min-w-[5.25rem] rounded-lg px-3 py-2.5 text-center transition-all duration-200 hover:-translate-y-0.5",
                selectedDay === d.id &&
                  "border-ice-lum bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]",
              )}
            >
              <span
                className={cn(
                  "block text-[0.66rem] font-semibold tracking-[0.12em] uppercase",
                  selectedDay === d.id ? "text-primary-foreground/80" : "text-graphite",
                )}
              >
                {d.weekday}
              </span>
              <span
                className={cn(
                  "block font-display text-lg font-semibold",
                  selectedDay === d.id ? "text-primary-foreground" : "text-navy",
                )}
              >
                {d.day}
              </span>
              <span
                className={cn(
                  "block text-[0.66rem]",
                  selectedDay === d.id ? "text-primary-foreground/80" : "text-graphite",
                )}
              >
                {d.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Available times</FieldLabel>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectSlot(s)}
              aria-pressed={selectedSlot === s}
              className={cn(
                "rounded-lg border border-silver-strong/60 bg-card px-3 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glass)]",
                selectedSlot === s &&
                  "border-transparent bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-graphite">
          <CalendarDays className="size-3.5" aria-hidden />
          Availability shown from seeded scheduling data.
        </p>
      </div>
    </div>
  );
}
