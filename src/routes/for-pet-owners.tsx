import { createFileRoute, Link } from "@tanstack/react-router";
import { Image as ImageIcon, Languages, Mic, ShieldCheck, Video } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Eyebrow, GlassCard, GlowButton } from "@/components/kit/primitives";
import { VoiceNote } from "@/components/care/VoiceNote";
import { MediaAttachment } from "@/components/care/MediaAttachment";

export const Route = createFileRoute("/for-pet-owners")({
  head: () => ({
    meta: [
      { title: "For Pet Owners · Love Vet AI" },
      {
        name: "description",
        content:
          "Describe your pet's problem by voice, text, photo or video in your own language — Love Vet AI finds the right veterinary appointment.",
      },
      { property: "og:title", content: "For Pet Owners · Love Vet AI" },
      {
        property: "og:description",
        content:
          "No forms, no phone queues. Speak in your language, attach a photo or video, and get the right veterinary care booked.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForPetOwners,
});

const points = [
  {
    icon: Mic,
    title: "Say it, don't fill a form",
    body: "A voice note is enough. Love Vet AI listens, transcribes and organises the details.",
  },
  {
    icon: Languages,
    title: "Your language",
    body: "Write or speak naturally. The veterinary team receives a clear English summary.",
  },
  {
    icon: ImageIcon,
    title: "Show the problem",
    body: "Attach a photo of the affected area so the clinic knows what to expect.",
  },
  {
    icon: Video,
    title: "Record the movement",
    body: "A short video of limping or breathing helps the veterinary team prepare.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "If your description suggests an emergency, you are routed to urgent care instead of a normal booking.",
  },
];

function ForPetOwners() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="ambient-glow mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <Eyebrow>For pet owners</Eyebrow>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Tell the clinic what's wrong — the way you'd tell a friend
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-graphite">
              No forms, no phone queues, no language barrier. Describe what you see, add a photo or
              a short video, and Love Vet AI brings back the right appointment with the right
              veterinarian.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/intake">
                <GlowButton size="lg">Start AI Intake</GlowButton>
              </Link>
              <Link to="/my-pets">
                <GlowButton variant="secondary" size="lg">
                  My Pets
                </GlowButton>
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {points.map((p) => (
                <GlassCard key={p.title}>
                  <span className="grid size-10 place-items-center rounded-lg surface-ice border border-silver-strong/60">
                    <p.icon className="size-4.5 text-deep" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-display text-[0.98rem] font-semibold">{p.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite">{p.body}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <GlassCard glow pad="lg" className="space-y-4 lg:sticky lg:top-24">
            <Eyebrow>What you send</Eyebrow>
            <VoiceNote
              language="Russian"
              durationSeconds={18}
              transcript="Моя собака Луна, золотистый ретривер..."
            />
            <MediaAttachment kind="photo" fileName="luna-leg.jpg" meta="Photo · front left leg" />
            <MediaAttachment
              kind="video"
              fileName="luna-walking.mp4"
              meta="Video · 00:09 · gait"
            />
            <p className="text-xs leading-relaxed text-graphite">
              Your original recording, transcript and media are always kept alongside the summary.
              Love Vet AI does not provide a diagnosis.
            </p>
          </GlassCard>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
