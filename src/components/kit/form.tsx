import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-silver-strong/70 bg-card/85 px-3.5 py-2.5 text-sm text-navy outline-none transition-shadow placeholder:text-graphite/70 focus:border-ice-lum focus:shadow-[var(--glow-silver-blue)]";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-semibold text-navy">{label}</span>
      {hint && <span className="ml-1.5 text-xs text-graphite">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function TextInput(props: ComponentProps<"input">) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function TextArea(props: ComponentProps<"textarea">) {
  return <textarea rows={4} {...props} className={cn(control, "resize-y", props.className)} />;
}

export function Select({ children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={cn(control, "appearance-none", props.className)}>
      {children}
    </select>
  );
}

export function ChipToggle({ options, value, onChange, label }: { options: string[]; value: string[]; onChange: (v: string[]) => void; label: string }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-navy">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                on ? "border-primary bg-primary text-primary-foreground" : "border-silver-strong/70 bg-card/80 text-graphite hover:text-deep",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold tracking-[-0.01em] text-navy">{children}</h2>
      {sub && <p className="mt-0.5 text-sm text-graphite">{sub}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children, action }: { icon: typeof import("lucide-react").Inbox; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-silver-strong/80 bg-card/40 px-6 py-10 text-center">
      <Icon className="mx-auto size-6 text-deep" strokeWidth={1.5} aria-hidden />
      <p className="mt-3 text-sm font-semibold text-navy">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-sm text-sm text-graphite">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageShell({ eyebrow, title, intro, children, narrow }: { eyebrow?: string; title: string; intro?: ReactNode; children: ReactNode; narrow?: boolean }) {
  return (
    <main className={cn("mx-auto px-6 pt-12 pb-24", narrow ? "max-w-2xl" : "max-w-5xl")}>
      {eyebrow && <p className="text-xs font-semibold tracking-[0.2em] text-deep uppercase">{eyebrow}</p>}
      <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-navy sm:text-4xl">{title}</h1>
      {intro && <div className="mt-3 max-w-2xl text-graphite">{intro}</div>}
      <div className="mt-10">{children}</div>
    </main>
  );
}

export function FrontendNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-xs text-graphite">{children}</p>;
}
