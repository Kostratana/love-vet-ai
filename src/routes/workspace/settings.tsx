import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/workspace/PageHeader";
import {
  Disclaimer,
  FieldLabel,
  GlassCard,
  GlowButton,
  StatusBadge,
} from "@/components/kit/primitives";
import { organization } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Love Vet AI Workspace" },
      {
        name: "description",
        content:
          "Configure organization details, branding, supported languages, scheduling rules and AI routing rules for your veterinary network.",
      },
      { property: "og:title", content: "Settings · Love Vet AI Workspace" },
      {
        property: "og:description",
        content: "White-label configuration: branding, languages, scheduling and routing rules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

const schedulingRules = [
  { label: "Same-day booking window", value: "Until 4 hours before slot" },
  { label: "Emergency handling", value: "Bypass scheduling · route to emergency desk" },
  { label: "Slot buffer", value: "5 minutes between consultations" },
  { label: "Cancellation window", value: "12 hours before appointment" },
];

const routingRules = [
  { label: "Limping, stiffness, gait change", value: "Mobility / Orthopedic Care" },
  { label: "Itching, coat or skin change", value: "Dermatology" },
  { label: "Appetite or energy change", value: "General Medicine · human review" },
  { label: "Collapse, breathing difficulty, seizure", value: "Emergency · no online booking" },
];

function Settings() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Organization configuration"
        description="Everything the interface shows is configuration, which is what makes this deployable for any veterinary network."
        actions={<GlowButton size="sm">Save changes</GlowButton>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard variant="solid">
          <FieldLabel>Organization</FieldLabel>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-graphite">Name</dt>
              <dd className="font-medium text-navy">{organization.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-graphite">Brand line</dt>
              <dd className="font-medium text-navy">{organization.brandLine}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-graphite">White-label mode</dt>
              <dd>
                <StatusBadge tone="info">Available</StatusBadge>
              </dd>
            </div>
          </dl>
        </GlassCard>

        <GlassCard variant="solid">
          <FieldLabel>Supported languages</FieldLabel>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {organization.locales.map((l) => (
              <StatusBadge key={l} tone="info">
                {l}
              </StatusBadge>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-graphite">
            Owners write or speak in their own language; your team always reads English alongside the
            original.
          </p>
        </GlassCard>

        <GlassCard>
          <FieldLabel>Scheduling rules</FieldLabel>
          <ul className="mt-3 space-y-2 text-sm">
            {schedulingRules.map((r) => (
              <li
                key={r.label}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-silver bg-card px-3 py-2.5"
              >
                <span className="text-graphite">{r.label}</span>
                <span className="font-medium text-navy">{r.value}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <FieldLabel>AI routing rules</FieldLabel>
          <ul className="mt-3 space-y-2 text-sm">
            {routingRules.map((r) => (
              <li
                key={r.label}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-silver bg-card px-3 py-2.5"
              >
                <span className="text-graphite">{r.label}</span>
                <span className="font-medium text-navy">{r.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Disclaimer>
              Routing maps reported signals to a service category and priority. It never produces a
              diagnosis.
            </Disclaimer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
