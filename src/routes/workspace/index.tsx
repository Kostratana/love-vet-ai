import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mic } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import {
  FieldLabel,
  GlassCard,
  GlowButton,
  LanguageIndicator,
  StatusBadge,
  priorityTone,
} from "@/components/kit/primitives";
import { dashboardMetrics, intakes, patientById } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/")({
  head: () => ({
    meta: [
      { title: "Workspace Overview · Love Vet AI" },
      {
        name: "description",
        content:
          "Today's appointments, AI-handled bookings, cases needing attention and the live Client requests for your veterinary team.",
      },
      { property: "og:title", content: "Workspace Overview · Love Vet AI" },
      {
        property: "og:description",
        content: "Operational overview of AI chat, routing and bookings across your network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Today at Northline Veterinary Group"
        description="AI chat, routing and scheduling across three locations. Clinical decisions remain with your veterinarians."
        actions={
          <Link to="/workspace/intakes">
            <GlowButton size="sm">
              Open client requests <ArrowRight />
            </GlowButton>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((m) => (
          <GlassCard key={m.label} glow={m.urgent}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-graphite">
                {m.label}
              </p>
              {m.urgent ? <StatusBadge tone="critical">Urgent</StatusBadge> : null}
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-navy">{m.value}</p>
            <p className="mt-1 text-xs text-graphite">{m.note}</p>
          </GlassCard>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Client requests</h2>
          <StatusBadge tone="info">{intakes.length} active</StatusBadge>
        </div>

        <div className="mt-4 space-y-3">
          {intakes.map((intake) => {
            const patient = patientById(intake.patientId)!;
            const featured = intake.id === "int_luna";
            return (
              <GlassCard key={intake.id} glow={featured} pad="md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight uppercase">
                        {patient.name}
                      </h3>
                      <StatusBadge tone={priorityTone(intake.priority)}>
                        {intake.priority}
                      </StatusBadge>
                      <StatusBadge tone={intake.status === "CONFIRMED" ? "success" : "neutral"}>
                        {intake.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-graphite">
                      {patient.species} · {patient.breed} · {patient.age}
                    </p>
                  </div>
                  <Link to="/workspace/intakes/$intakeId" params={{ intakeId: intake.id }}>
                    <GlowButton variant="secondary" size="sm">
                      Open case
                    </GlowButton>
                  </Link>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <FieldLabel>Reported</FieldLabel>
                    <p className="mt-1 text-sm text-navy">{intake.concerns.join(" · ")}</p>
                  </div>
                  <div>
                    <FieldLabel>Language</FieldLabel>
                    <div className="mt-1">
                      <LanguageIndicator from={intake.originalLanguage} to="English" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Inputs</FieldLabel>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-navy">
                      {intake.inputs.includes("Voice") ? (
                        <Mic className="size-3.5 text-deep" aria-hidden />
                      ) : null}
                      {intake.inputs.join(" · ")}
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Route</FieldLabel>
                    <p className="mt-1 text-sm text-navy">{intake.route}</p>
                  </div>
                </div>

                {featured ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-silver bg-silver-white/80 px-3 py-2.5">
                    <FieldLabel>Appointment</FieldLabel>
                    <p className="text-sm text-navy">Dr. Daniel Rivera · 3:30 PM</p>
                    <span className="text-silver-strong">·</span>
                    <p className="text-sm text-navy">Central Veterinary Center</p>
                    <StatusBadge tone="success" className="ml-auto">
                      Booked with 0 staff actions
                    </StatusBadge>
                  </div>
                ) : null}
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
