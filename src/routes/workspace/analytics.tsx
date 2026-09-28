import { createFileRoute } from "@tanstack/react-router";
import { Bars, PageHeader } from "@/components/workspace/PageHeader";
import { Disclaimer, Eyebrow, GlassCard } from "@/components/kit/primitives";
import { analytics } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "AI-handled booking share, average booking completion time, staff actions avoided, and volume by location, service and language.",
      },
      { property: "og:title", content: "Analytics · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "Operational impact of AI intake across locations, services and languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Operational impact"
        description="How much of the intake and scheduling workload the AI front desk absorbs."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.headline.map((h) => (
          <GlassCard key={h.label}>
            <Eyebrow>{h.label}</Eyebrow>
            <p className="mt-2 font-display text-3xl font-semibold text-navy">{h.value}</p>
            <p className="mt-1 text-xs text-graphite">{h.note}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard variant="solid">
          <Eyebrow>Volume by location</Eyebrow>
          <div className="mt-4">
            <Bars data={analytics.byLocation} />
          </div>
        </GlassCard>
        <GlassCard variant="solid">
          <Eyebrow>Volume by service</Eyebrow>
          <div className="mt-4">
            <Bars data={analytics.byService} />
          </div>
        </GlassCard>
        <GlassCard variant="solid">
          <Eyebrow>Requests by language</Eyebrow>
          <div className="mt-4">
            <Bars data={analytics.byLanguage} />
          </div>
        </GlassCard>
      </div>

      <div className="mt-6">
        <Disclaimer>
          Demo figures from seeded data. Connect your practice management system to report on real
          volume.
        </Disclaimer>
      </div>
    </div>
  );
}
