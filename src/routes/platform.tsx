import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WorkflowRail } from "@/components/kit/WorkflowRail";
import { Eyebrow, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { organization } from "@/lib/love-vet-data";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform · Love Vet AI" },
      {
        name: "description",
        content:
          "Organization, locations, services, veterinarians, schedules, appointments, patients, intakes and media — the Love Vet AI platform architecture.",
      },
      { property: "og:title", content: "Platform · Love Vet AI" },
      {
        property: "og:description",
        content:
          "A multi-clinic SaaS architecture with configurable branding, scheduling rules and AI routing rules, ready for white-label deployment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Platform,
});

const hierarchy = [
  { level: "Organization", detail: "Veterinary group or single practice, branding and locales" },
  { level: "Locations", detail: "Sites with their own hours, capacity and service mix" },
  { level: "Services", detail: "Consultation types, durations and routing categories" },
  { level: "Veterinarians", detail: "Specialties, languages and site assignments" },
  { level: "Schedules", detail: "Availability rules and bookable slots" },
  { level: "Appointments", detail: "Confirmed bookings with full intake context" },
  { level: "Patients", detail: "Species, breed, age and care history" },
  { level: "Intakes", detail: "Original message, language, structured case and priority" },
  { level: "Media", detail: "Voice notes, photos and videos retained with the case" },
];

const settings = [
  "Organization",
  "Branding",
  "Locations",
  "Services",
  "Team",
  "Scheduling Rules",
  "AI Routing Rules",
];

function Platform() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="ambient-glow mx-auto max-w-6xl px-6 pt-16 pb-8">
        <Eyebrow>Platform</Eyebrow>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
          Built as a veterinary network platform, not a clinic website
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite">
          Every screen is driven by configurable organization data. Clinics, services, veterinarians
          and routing rules are data — never hardcoded into the interface.
        </p>

        <WorkflowRail
          className="mt-8"
          steps={[
            { label: "Understand", caption: "Multimodal intake" },
            { label: "Assess", caption: "Safety" },
            { label: "Route", caption: "Explainable routing" },
            { label: "Schedule", caption: "Availability match" },
            { label: "Handoff", caption: "Confirmation & follow-up" },
          ]}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <GlassCard pad="lg">
            <Eyebrow>Data hierarchy</Eyebrow>
            <ol className="mt-4 space-y-2">
              {hierarchy.map((h, i) => (
                <li
                  key={h.level}
                  className="flex items-start gap-3 rounded-lg border border-silver bg-card px-3 py-2.5"
                  style={{ marginInlineStart: `${Math.min(i, 4) * 10}px` }}
                >
                  <span className="mt-0.5 font-mono text-[0.68rem] text-graphite">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold text-navy">
                      {h.level}
                    </span>
                    <span className="block text-xs text-graphite">{h.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard variant="solid" pad="lg">
              <Eyebrow>White-label readiness</Eyebrow>
              <p className="mt-2 text-sm leading-relaxed text-graphite">
                Deploy as “{organization.brandLine}” or fully white-label for a veterinary network.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {settings.map((s) => (
                  <StatusBadge key={s} tone="neutral">
                    {s}
                  </StatusBadge>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="ice" pad="lg">
              <Eyebrow>Connect later</Eyebrow>
              <p className="mt-2 text-sm leading-relaxed text-navy">
                This build runs on seeded data. Speech-to-text, multimodal analysis, database
                persistence, scheduling APIs and payments connect behind the same interfaces.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/intake">
                  <GlowButton>Start AI Intake</GlowButton>
                </Link>
                <Link to="/workspace">
                  <GlowButton variant="secondary">Veterinary Workspace</GlowButton>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
