import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileText, History, Images } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  Eyebrow,
  FieldLabel,
  GlassCard,
  GlowButton,
  LanguageIndicator,
  StatusBadge,
} from "@/components/kit/primitives";
import { MediaAttachment } from "@/components/care/MediaAttachment";
import { intakes, lunaAppointment, patients } from "@/lib/love-vet-data";

export const Route = createFileRoute("/my-pets")({
  head: () => ({
    meta: [
      { title: "My Pets · Love Vet AI" },
      {
        name: "description",
        content:
          "Upcoming appointments, previous visits, AI intake history, uploaded media and care documents for your pets.",
      },
      { property: "og:title", content: "My Pets · Love Vet AI" },
      {
        property: "og:description",
        content: "Your pet's care timeline: appointments, intake history, media and documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyPets,
});

function MyPets() {
  const luna = patients[0]!;
  const lunaIntake = intakes[0]!;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="ambient-glow mx-auto max-w-5xl px-6 pt-16 pb-8">
        <Eyebrow>My care</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">My Pets</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <GlassCard glow>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl surface-ice border border-silver-strong/60 font-display text-base font-semibold text-deep">
                  LU
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold">{luna.name}</h2>
                  <p className="text-sm text-graphite">
                    {luna.breed} · {luna.age}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge tone="info">Dog</StatusBadge>
                <StatusBadge>Owner: {luna.ownerName}</StatusBadge>
              </div>
            </GlassCard>

            <GlassCard variant="solid">
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>Upcoming appointment</FieldLabel>
                <StatusBadge tone="success">Confirmed</StatusBadge>
              </div>
              <p className="mt-3 font-display text-base font-semibold text-navy">
                {lunaAppointment.service}
              </p>
              <p className="text-sm text-graphite">
                {lunaAppointment.veterinarian} · {lunaAppointment.location}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-navy">
                <CalendarDays className="size-4 text-deep" aria-hidden />
                {lunaAppointment.date} · {lunaAppointment.time}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <GlowButton size="sm">Add to Calendar</GlowButton>
                <GlowButton variant="outline" size="sm">
                  Reschedule
                </GlowButton>
                <GlowButton variant="ghost" size="sm">
                  Cancel
                </GlowButton>
              </div>
            </GlassCard>

            <GlassCard>
              <FieldLabel>Previous visits</FieldLabel>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between gap-3 rounded-lg border border-silver bg-card px-3 py-2.5">
                  <span className="text-navy">Annual wellness exam</span>
                  <span className="text-xs text-graphite">Mar 12, 2026</span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-lg border border-silver bg-card px-3 py-2.5">
                  <span className="text-navy">Vaccination · booster</span>
                  <span className="text-xs text-graphite">Nov 04, 2025</span>
                </li>
              </ul>
            </GlassCard>
          </div>

          <div className="space-y-4">
            <GlassCard>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>AI intake history</FieldLabel>
                <History className="size-4 text-graphite" aria-hidden />
              </div>
              <div className="mt-3 rounded-lg border border-silver bg-card p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy">
                    {lunaIntake.concerns.join(" · ")}
                  </p>
                  <StatusBadge tone="info">{lunaIntake.priority}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-graphite">Received {lunaIntake.receivedAt}</p>
                <div className="mt-2">
                  <LanguageIndicator from="Russian" to="English" />
                </div>
                <Link to="/workspace/intakes/int_luna" className="mt-3 inline-block">
                  <GlowButton variant="secondary" size="sm">
                    View structured case
                  </GlowButton>
                </Link>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>Uploaded media</FieldLabel>
                <Images className="size-4 text-graphite" aria-hidden />
              </div>
              <div className="mt-3 space-y-2">
                <MediaAttachment kind="photo" fileName="luna-leg.jpg" meta="Photo · front left leg" />
                <MediaAttachment kind="video" fileName="luna-walking.mp4" meta="Video · 00:09" />
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>Care documents</FieldLabel>
                <FileText className="size-4 text-graphite" aria-hidden />
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between gap-3 rounded-lg border border-silver bg-card px-3 py-2.5">
                  <span className="text-navy">Vaccination record 2026</span>
                  <span className="text-xs text-graphite">PDF</span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-lg border border-silver bg-card px-3 py-2.5">
                  <span className="text-navy">Wellness exam summary</span>
                  <span className="text-xs text-graphite">PDF</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
