import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkflowRail({
  steps,
  className,
}: {
  steps: { label: string; caption?: string }[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step.label} className="flex flex-1 items-center gap-0">
          <div className="glass flex-1 rounded-xl px-4 py-3">
            <p className="text-[0.66rem] font-semibold tracking-[0.14em] uppercase text-graphite">
              Step {i + 1}
            </p>
            <p className="mt-1 font-display text-sm font-semibold text-navy">{step.label}</p>
            {step.caption ? (
              <p className="mt-0.5 text-xs text-graphite">{step.caption}</p>
            ) : null}
          </div>
          {i < steps.length - 1 ? (
            <ChevronRight
              aria-hidden
              className="mx-1 hidden size-4 shrink-0 text-silver-strong sm:block"
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
