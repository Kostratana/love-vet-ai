import { PhoneCall, Send, Siren } from "lucide-react";
import { Disclaimer, FieldLabel, GlowButton } from "@/components/kit/primitives";

/**
 * Emergency routing state. Ordinary scheduling is intentionally hidden here.
 * Restrained functional red is used only for this genuine critical state.
 */
export function SafetyAlert({ onShare }: { onShare?: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/35 bg-card p-5 shadow-[var(--shadow-float)] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-destructive/30 bg-destructive/8">
          <Siren className="size-5 text-destructive" aria-hidden />
        </span>
        <div>
          <FieldLabel>Safety gate · Emergency</FieldLabel>
          <h3 className="mt-1 font-display text-xl font-semibold text-destructive">
            Urgent veterinary attention recommended
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy">
            These reported symptoms may require immediate veterinary assessment. Appointment
            scheduling is paused for this request.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <GlowButton variant="critical">
          <Siren /> Contact Emergency Clinic
        </GlowButton>
        <GlowButton variant="outline">
          <PhoneCall /> Call Clinic
        </GlowButton>
        <GlowButton variant="secondary" onClick={onShare}>
          <Send /> Share Intake With Clinic
        </GlowButton>
      </div>

      <div className="mt-5 rounded-lg border border-silver bg-silver-white/80 p-3">
        <Disclaimer>
          Love Vet AI does not provide a diagnosis. It recognises urgency signals in the owner's
          description and routes the request to a veterinary professional.
        </Disclaimer>
      </div>
    </div>
  );
}
