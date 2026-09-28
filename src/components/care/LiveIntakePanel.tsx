import { FieldLabel, GlassCard, StatusBadge, priorityTone } from "@/components/kit/primitives";
import type { Priority } from "@/lib/love-vet-data";

export type IntakeSnapshot = {
  patientName?: string;
  patientMeta?: string;
  concerns: string[];
  onset?: string;
  language?: string;
  inputs: string[];
  priority?: Priority;
};

export function LiveIntakePanel({ snapshot }: { snapshot: IntakeSnapshot }) {
  const empty =
    !snapshot.patientName && snapshot.concerns.length === 0 && snapshot.inputs.length === 0;

  return (
    <GlassCard glow pad="lg" className="h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <FieldLabel>Live</FieldLabel>
          <h3 className="font-display text-lg font-semibold">AI Intake</h3>
        </div>
        {snapshot.priority ? (
          <StatusBadge tone={priorityTone(snapshot.priority)}>{snapshot.priority}</StatusBadge>
        ) : (
          <StatusBadge>Listening</StatusBadge>
        )}
      </div>

      {empty ? (
        <p className="mt-6 text-sm leading-relaxed text-graphite">
          The structured case builds here as you speak, type or upload. Nothing is sent to the
          veterinary team until you confirm.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {snapshot.patientName ? (
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-navy uppercase">
                {snapshot.patientName}
              </p>
              <p className="text-sm text-graphite">{snapshot.patientMeta}</p>
            </div>
          ) : null}

          {snapshot.concerns.length ? (
            <div>
              <FieldLabel>Reported concerns</FieldLabel>
              <ul className="mt-2 space-y-1.5">
                {snapshot.concerns.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-navy">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ice-lum" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-4">
            {snapshot.onset ? (
              <div>
                <FieldLabel>Onset</FieldLabel>
                <dd className="mt-1 text-sm text-navy">{snapshot.onset}</dd>
              </div>
            ) : null}
            {snapshot.language ? (
              <div>
                <FieldLabel>Input language</FieldLabel>
                <dd className="mt-1 text-sm text-navy">{snapshot.language}</dd>
              </div>
            ) : null}
          </dl>

          {snapshot.inputs.length ? (
            <div>
              <FieldLabel>Inputs</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {snapshot.inputs.map((i) => (
                  <StatusBadge key={i} tone="info">
                    {i}
                  </StatusBadge>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-silver bg-silver-white/80 p-3">
            <p className="text-sm font-semibold text-navy">Veterinarian assessment required.</p>
            <p className="mt-1 text-xs leading-relaxed text-graphite">
              Love Vet AI structures and routes the request. It does not provide a diagnosis.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
