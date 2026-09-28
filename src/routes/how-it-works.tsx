import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WorkflowRail } from "@/components/kit/WorkflowRail";
import { Eyebrow, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { intakes } from "@/lib/love-vet-data";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works · Love Vet AI" },
      {
        name: "description",
        content:
          "Understand, assess, route, schedule, handoff — how Love Vet AI turns a pet owner's message into a confirmed veterinary appointment.",
      },
      { property: "og:title", content: "How It Works · Love Vet AI" },
      {
        property: "og:description",
        content:
          "The five stages of the Love Vet AI orchestration: multimodal intake, safety, routing, scheduling and veterinary handoff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const stages = [
  {
    step: "Understand",
    title: "Multimodal intake",
    body: "Owners speak, type, photograph or record a short video in their own language. Every input is preserved.",
  },
  {
    step: "Assess",
    title: "Safety gate",
    body: "Requests are separated into routine, same-day, needs attention and emergency. Urgency assistance, never diagnosis.",
  },
  {
    step: "Route",
    title: "Explainable routing",
    body: "The request is matched to a veterinary service category with a plain-language reason the team can audit.",
  },
  {
    step: "Schedule",
    title: "Location, veterinarian, slot",
    body: "Availability across the network is matched to the service and the owner's location.",
  },
  {
    step: "Handoff",
    title: "Confirmation and follow-up",
    body: "The veterinary team receives the original audio, transcript, media and a structured English summary.",
  },
];

function HowItWorks() {
  const luna = intakes[0]!;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="ambient-glow mx-auto max-w-5xl px-6 pt-16 pb-8">
        <Eyebrow>How it works</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Understand → Assess → Route → Schedule → Handoff
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite">
          Love Vet AI sits in front of your clinic or network as an always-available front desk. It
          collects context the way owners naturally give it, then hands your team a case that is
          already organised.
        </p>

        <WorkflowRail
          className="mt-8"
          steps={stages.map((s) => ({ label: s.step, caption: s.title }))}
        />

        <div className="mt-10 space-y-4">
          {stages.map((s, i) => (
            <GlassCard key={s.step} className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="sm:w-48 sm:shrink-0">
                <StatusBadge tone="info">
                  {i + 1} · {s.step}
                </StatusBadge>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">{s.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite">{s.body}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard variant="ice" className="mt-10">
          <Eyebrow>Worked example</Eyebrow>
          <p className="mt-2 text-sm leading-relaxed text-navy">
            A Russian-speaking owner sends a voice note, a photo and a nine-second video. Love Vet AI
            captures “{luna.concerns.join(" · ")}”, onset {luna.onset.toLowerCase()}, flags{" "}
            {luna.priority}, routes to {luna.route}, and books Dr. Daniel Rivera at 3:30 PM — with
            zero staff scheduling actions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/intake">
              <GlowButton>Start AI Intake</GlowButton>
            </Link>
            <Link to="/workspace/intakes/$intakeId" params={{ intakeId: "int_luna" }}>
              <GlowButton variant="secondary">Open the veterinary case</GlowButton>
            </Link>
          </div>
        </GlassCard>
      </main>
      <SiteFooter />
    </div>
  );
}
