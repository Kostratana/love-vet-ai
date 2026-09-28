import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ClipboardList, Clock, Languages, Users } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Eyebrow, GlassCard, GlowButton, StatusBadge } from "@/components/kit/primitives";
import { analytics, dashboardMetrics } from "@/lib/love-vet-data";

export const Route = createFileRoute("/for-veterinary-teams")({
  head: () => ({
    meta: [
      { title: "For Veterinary Teams · Love Vet AI" },
      {
        name: "description",
        content:
          "Fewer phone calls, structured cases, multilingual handoff and measurable scheduling time saved for clinics and veterinary networks.",
      },
      { property: "og:title", content: "For Veterinary Teams · Love Vet AI" },
      {
        property: "og:description",
        content:
          "An AI front desk that hands your team organised cases: original audio, media, structured summary and explainable routing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForVetTeams,
});

const benefits = [
  {
    icon: Clock,
    title: "Reception time back",
    body: "Routine intake and scheduling happen before anyone picks up the phone.",
  },
  {
    icon: ClipboardList,
    title: "Cases arrive structured",
    body: "Concerns, onset, priority and suggested route in one consistent format.",
  },
  {
    icon: Languages,
    title: "Multilingual handoff",
    body: "Owner speaks Russian, your team reads English — original always preserved.",
  },
  {
    icon: Activity,
    title: "Safety separation",
    body: "Potential emergencies never sit silently in a booking queue.",
  },
  {
    icon: Users,
    title: "Network-ready",
    body: "Locations, services, veterinarians and scheduling rules are configurable per site.",
  },
];

function ForVetTeams() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="ambient-glow mx-auto max-w-6xl px-6 pt-16 pb-8">
        <Eyebrow>For veterinary teams</Eyebrow>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
          Your front desk, handled — with an operational workspace behind it
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite">
          Love Vet AI answers, understands and routes every request, then hands your team a dense,
          auditable case view. Clinical decisions stay entirely with your veterinarians.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/workspace">
            <GlowButton size="lg">Open Veterinary Workspace</GlowButton>
          </Link>
          <Link to="/platform">
            <GlowButton variant="secondary" size="lg">
              Platform architecture
            </GlowButton>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((m) => (
            <GlassCard key={m.label}>
              <p className="text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-graphite">
                {m.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-navy">{m.value}</p>
              <p className="mt-1 text-xs text-graphite">{m.note}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <GlassCard key={b.title} className="h-full">
              <span className="grid size-10 place-items-center rounded-lg surface-ice border border-silver-strong/60">
                <b.icon className="size-4.5 text-deep" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-[0.98rem] font-semibold">{b.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite">{b.body}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard variant="solid" pad="lg" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Eyebrow>Measured outcomes</Eyebrow>
              <h2 className="mt-1 font-display text-xl font-semibold">Operational impact</h2>
            </div>
            <StatusBadge tone="info">Seeded 30-day sample</StatusBadge>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.headline.map((h) => (
              <div key={h.label} className="rounded-lg border border-silver bg-silver-white/70 p-4">
                <p className="font-display text-2xl font-semibold text-navy">{h.value}</p>
                <p className="mt-1 text-sm text-navy">{h.label}</p>
                <p className="text-xs text-graphite">{h.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
      <SiteFooter />
    </div>
  );
}
