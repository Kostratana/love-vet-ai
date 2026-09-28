import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import {
  Disclaimer,
  FieldLabel,
  GlassCard,
  GlowButton,
  LanguageIndicator,
  StatusBadge,
  priorityTone,
} from "@/components/kit/primitives";
import { MediaAttachment } from "@/components/care/MediaAttachment";
import { VoiceNote } from "@/components/care/VoiceNote";
import { RoutingExplanation } from "@/components/care/RoutingExplanation";
import { intakeById, lunaAppointment, patientById } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/intakes/$intakeId")({
  head: () => ({
    meta: [
      { title: "Intake case · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Full intake case: original message, translation, structured concerns, media, priority and the reason behind the suggested care route.",
      },
      { property: "og:title", content: "Intake case · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Original audio, transcript, translation and explainable routing in one case view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const intake = intakeById(params.intakeId);
    if (!intake) throw notFound();
    return { intake };
  },
  component: IntakeCase,
});

function IntakeCase() {
  const { intake } = Route.useLoaderData();
  const patient = patientById(intake.patientId)!;
  const voice = intake.media.find((m) => m.kind === "voice");
  const files = intake.media.filter((m) => m.kind !== "voice");

  return (
    <div>
      <Link
        to="/workspace/intakes"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-deep lg:mt-0"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> Back to intake queue
      </Link>

      <PageHeader
        eyebrow={`Case ${intake.id}`}
        title={`${patient.name} · ${patient.breed}`}
        description={`${patient.species} · ${patient.age} · Owner ${patient.ownerName} · Received ${intake.receivedAt}`}
        actions={
          <>
            <GlowButton size="sm">Confirm route</GlowButton>
            <GlowButton variant="outline" size="sm">
              Reassign service
            </GlowButton>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4">
          <GlassCard>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <FieldLabel>Original message</FieldLabel>
              <LanguageIndicator from={intake.originalLanguage} to="English" />
            </div>
            <p className="mt-3 rounded-lg border border-silver bg-silver-white/70 px-3 py-2.5 text-sm leading-relaxed text-navy">
              {intake.originalText}
            </p>
            <FieldLabel>Translation</FieldLabel>
            <p className="mt-2 text-sm leading-relaxed text-graphite">{intake.translatedText}</p>
          </GlassCard>

          {voice ? (
            <GlassCard>
              <FieldLabel>Voice note</FieldLabel>
              <div className="mt-3">
                <VoiceNote duration={voice.meta} label={voice.fileName} />
              </div>
            </GlassCard>
          ) : null}

          {files.length ? (
            <GlassCard>
              <FieldLabel>Attached media</FieldLabel>
              <div className="mt-3 space-y-2">
                {files.map((m) => (
                  <MediaAttachment
                    key={m.id}
                    kind={m.kind as "photo" | "video"}
                    fileName={m.fileName}
                    meta={m.meta}
                  />
                ))}
              </div>
            </GlassCard>
          ) : null}
        </div>

        <div className="space-y-4">
          <GlassCard variant="solid">
            <FieldLabel>Structured case</FieldLabel>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-graphite">Concerns</dt>
                <dd className="text-right font-medium text-navy">{intake.concerns.join(", ")}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-graphite">Onset</dt>
                <dd className="font-medium text-navy">{intake.onset}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-graphite">Inputs</dt>
                <dd className="font-medium text-navy">{intake.inputs.join(", ")}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-graphite">Priority</dt>
                <dd>
                  <StatusBadge tone={priorityTone(intake.priority)}>{intake.priority}</StatusBadge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-graphite">Status</dt>
                <dd>
                  <StatusBadge tone={intake.status === "CONFIRMED" ? "success" : "neutral"}>
                    {intake.status}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
          </GlassCard>

          <RoutingExplanation
            route={intake.route}
            priority={intake.priority}
            reason={intake.routeReason}
            signals={intake.concerns}
          />

          {intake.status === "CONFIRMED" ? (
            <GlassCard variant="ice">
              <FieldLabel>Scheduled</FieldLabel>
              <p className="mt-2 font-display text-base font-semibold text-navy">
                {lunaAppointment.service}
              </p>
              <p className="text-sm text-graphite">
                {lunaAppointment.veterinarian} · {lunaAppointment.location}
              </p>
              <p className="mt-1 text-sm text-navy">
                {lunaAppointment.date} · {lunaAppointment.time}
              </p>
            </GlassCard>
          ) : null}

          <Disclaimer>
            Love Vet AI organizes and routes requests. It does not diagnose, and it never replaces
            veterinary judgement.
          </Disclaimer>
        </div>
      </div>
    </div>
  );
}
