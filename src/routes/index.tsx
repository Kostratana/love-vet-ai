import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Globe2,
  Image as ImageIcon,
  Languages,
  Mic,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WorkflowRail } from "@/components/kit/WorkflowRail";
import { Eyebrow, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { LiveIntakePanel } from "@/components/care/LiveIntakePanel";
import { intakes, organization, patients } from "@/lib/love-vet-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Love Vet AI — Describe it. Show it. Book the right care." },
      {
        name: "description",
        content:
          "Multilingual multimodal AI front desk for veterinary care. Voice, text, photo and video become structured intake, safe routing and confirmed appointments.",
      },
      { property: "og:title", content: "Love Vet AI — Describe it. Show it. Book the right care." },
      {
        property: "og:description",
        content:
          "AI front desk and care coordination for veterinary clinics and multi-location networks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Mic,
    title: "Multimodal intake",
    body: "Voice + text + photo + video captured in one conversational flow.",
  },
  {
    icon: Languages,
    title: "Multilingual by default",
    body: "Owners communicate naturally in their language.",
  },
  {
    icon: Sparkles,
    title: "Structured intake",
    body: "Unstructured descriptions become organized case information.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-first routing",
    body: "Potential emergencies are separated from routine booking.",
  },
  {
    icon: RouteIcon,
    title: "Smart booking",
    body: "Match service, location, veterinarian and available time.",
  },
  {
    icon: Stethoscope,
    title: "Veterinary handoff",
    body: "The team receives the original context plus a structured summary.",
  },
  {
    icon: Building2,
    title: "Multi-location ready",
    body: "Designed for individual practices and veterinary networks.",
  },
  {
    icon: Globe2,
    title: "White-label ready",
    body: "Organization, branding, services and routing rules are configurable.",
  },
];

function Home() {
  const luna = patients[0]!;
  const lunaIntake = intakes[0]!;

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="ambient-glow mx-auto max-w-6xl px-6 pt-16 pb-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <StatusBadge tone="info">
              <Sparkles className="size-3" aria-hidden /> AI veterinary front desk
            </StatusBadge>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold sm:text-5xl">
              Describe it. Show it.
              <br />
              <span className="text-gradient-navy">Book the right care.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-graphite">
              Multilingual multimodal AI front desk for veterinary care. Speak, type, upload a photo
              or video — Love Vet AI transforms every request into structured intake and the right
              care pathway.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/intake">
                <GlowButton size="lg">Start AI Intake</GlowButton>
              </Link>
              <Link to="/for-veterinary-teams">
                <GlowButton variant="secondary" size="lg">
                  For Veterinary Teams
                </GlowButton>
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-graphite">
              <span>{organization.locales.length}+ languages detected</span>
              <span className="hidden sm:inline text-silver-strong">·</span>
              <span>Voice · Photo · Video</span>
              <span className="hidden sm:inline text-silver-strong">·</span>
              <span>Routing assistance — not a diagnosis</span>
            </div>
          </div>

          <div className="relative">
            <GlassCard glow pad="lg" className="space-y-4">
              <Eyebrow>Owner message · Russian</Eyebrow>
              <p className="rounded-xl rounded-br-sm bg-[image:var(--gradient-primary)] px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-[var(--glow-primary)]">
                {lunaIntake.originalText}
              </p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="info">
                  <Mic className="size-3" aria-hidden /> Voice 00:18
                </StatusBadge>
                <StatusBadge tone="info">
                  <ImageIcon className="size-3" aria-hidden /> luna-leg.jpg
                </StatusBadge>
                <StatusBadge tone="info">
                  <Video className="size-3" aria-hidden /> luna-walking.mp4
                </StatusBadge>
              </div>
            </GlassCard>

            <div className="mt-4">
              <LiveIntakePanel
                snapshot={{
                  patientName: luna.name,
                  patientMeta: `${luna.breed} · ${luna.age}`,
                  concerns: lunaIntake.concerns,
                  onset: lunaIntake.onset,
                  language: "Russian",
                  inputs: lunaIntake.inputs,
                  priority: "SAME-DAY",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Eyebrow>The flow</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          One conversation, the complete care pathway
        </h2>
        <WorkflowRail
          className="mt-6"
          steps={[
            { label: "Speak / Type / Upload", caption: "Any language, any modality" },
            { label: "AI Intake", caption: "Structured case" },
            { label: "Safety", caption: "Urgency separated" },
            { label: "Smart Routing", caption: "Explainable service match" },
            { label: "Book Care", caption: "Location, vet, slot" },
            { label: "Veterinary Handoff", caption: "Original + summary" },
          ]}
        />
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <GlassCard key={f.title} className="h-full">
              <span className="grid size-10 place-items-center rounded-lg surface-ice border border-silver-strong/60">
                <f.icon className="size-4.5 text-deep" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-[0.98rem] font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <GlassCard glow pad="lg" className="ambient-glow text-center">
          <Eyebrow>Ready when your clinic is</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
            See the full intake, routing and booking flow
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-graphite">
            Explore the seeded Luna case in the AI Front Desk, then open the same case inside the
            veterinary team workspace.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/intake">
              <GlowButton size="lg">Start AI Intake</GlowButton>
            </Link>
            <Link to="/workspace">
              <GlowButton variant="secondary" size="lg">
                Veterinary Workspace
              </GlowButton>
            </Link>
          </div>
        </GlassCard>
      </section>

      <SiteFooter />
    </div>
  );
}
