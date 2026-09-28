import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  Image as ImageIcon,
  Mic,
  RotateCcw,
  Send,
  Square,
  Video,
  XCircle,
} from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  Disclaimer,
  Eyebrow,
  FieldLabel,
  GlassCard,
  GlowButton,
  LanguageIndicator,
  StatusBadge,
} from "@/components/kit/primitives";
import { VoiceNote } from "@/components/care/VoiceNote";
import { MediaAttachment } from "@/components/care/MediaAttachment";
import { LiveIntakePanel, type IntakeSnapshot } from "@/components/care/LiveIntakePanel";
import { RoutingExplanation } from "@/components/care/RoutingExplanation";
import { SafetyAlert } from "@/components/care/LiveSafetyAlert";
import { LocationCard } from "@/components/care/LocationCard";
import { VeterinarianCard } from "@/components/care/VeterinarianCard";
import { SlotPicker, demoDays } from "@/components/care/SlotPicker";
import {
  emergencyIntake,
  intakes,
  locations,
  patients,
  timeSlots,
  veterinarians,
} from "@/lib/love-vet-data";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "AI Front Desk · Love Vet AI" },
      {
        name: "description",
        content:
          "Speak, type or upload a photo or video. Love Vet AI turns any pet-owner request into a structured veterinary intake and the right care pathway.",
      },
      { property: "og:title", content: "AI Front Desk · Love Vet AI" },
      {
        property: "og:description",
        content:
          "Multilingual multimodal AI intake: voice, text, photo and video become a structured veterinary case with explainable care routing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FrontDesk,
});

type Attachment = { id: string; kind: "photo" | "video"; fileName: string; meta: string };
type Message = { id: string; from: "owner" | "ai"; text: string; language?: string };

const lunaIntake = intakes[0]!;
const luna = patients[0]!;

const emptySnapshot: IntakeSnapshot = { concerns: [], inputs: [] };

function FrontDesk() {
  const [mode, setMode] = useState<"idle" | "luna" | "emergency">("idle");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      from: "ai",
      text: "Tell me what's happening with your pet. You can speak, type, add photos, or upload a short video.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [snapshot, setSnapshot] = useState<IntakeSnapshot>(emptySnapshot);

  const [locationId, setLocationId] = useState(locations[0]!.id);
  const [vetId, setVetId] = useState(veterinarians[0]!.id);
  const [day, setDay] = useState(demoDays[0]!.id);
  const [slot, setSlot] = useState<string | null>("3:30 PM");
  const [confirmed, setConfirmed] = useState(false);
  const [shared, setShared] = useState(false);

  const selectedLocation = locations.find((l) => l.id === locationId)!;
  const selectedVet = veterinarians.find((v) => v.id === vetId)!;
  const selectedDay = demoDays.find((d) => d.id === day)!;

  const reset = () => {
    setMode("idle");
    setMessages([
      {
        id: "m0",
        from: "ai",
        text: "Tell me what's happening with your pet. You can speak, type, add photos, or upload a short video.",
      },
    ]);
    setDraft("");
    setRecording(false);
    setHasVoice(false);
    setAttachments([]);
    setSnapshot(emptySnapshot);
    setConfirmed(false);
    setShared(false);
    setSlot("3:30 PM");
  };

  const loadLuna = () => {
    setMode("luna");
    setHasVoice(true);
    setRecording(false);
    setDraft("");
    setAttachments([
      { id: "a1", kind: "photo", fileName: "luna-leg.jpg", meta: "Photo · front left leg" },
      { id: "a2", kind: "video", fileName: "luna-walking.mp4", meta: "Video · 00:09 · gait" },
    ]);
    setMessages([
      { id: "m1", from: "owner", text: lunaIntake.originalText, language: "Russian" },
      {
        id: "m2",
        from: "ai",
        text: "Спасибо. Я записала: Луна, золотистый ретривер, 6 лет — хромота на передней лапе с вчерашнего дня и периодический кашель. Готовлю структурированное резюме для ветеринарной команды на английском.",
      },
      {
        id: "m3",
        from: "ai",
        text: "A veterinarian should assess Luna today. I've prepared the care route and available appointments below.",
      },
    ]);
    setSnapshot({
      patientName: luna.name,
      patientMeta: `${luna.breed} · ${luna.age}`,
      concerns: lunaIntake.concerns,
      onset: lunaIntake.onset,
      language: "Russian",
      inputs: lunaIntake.inputs,
      priority: "SAME-DAY",
    });
    setConfirmed(false);
    setLocationId("loc_central");
    setVetId("vet_rivera");
    setDay(demoDays[0]!.id);
    setSlot("3:30 PM");
  };

  const loadEmergency = () => {
    setMode("emergency");
    setHasVoice(false);
    setAttachments([]);
    setDraft("");
    setMessages([
      { id: "e1", from: "owner", text: emergencyIntake.originalText, language: "English" },
      {
        id: "e2",
        from: "ai",
        text: "I'm treating this as urgent. I am not diagnosing — these reported symptoms may require immediate veterinary assessment.",
      },
    ]);
    setSnapshot({
      patientName: "Unnamed patient",
      patientMeta: "Dog · details pending",
      concerns: emergencyIntake.concerns,
      onset: emergencyIntake.onset,
      language: "English",
      inputs: ["Text"],
      priority: "EMERGENCY",
    });
    setConfirmed(false);
  };

  const send = () => {
    const text = draft.trim();
    if (!text && !hasVoice && attachments.length === 0) return;
    setMessages((m) => [
      ...m,
      ...(text ? [{ id: `u${m.length}`, from: "owner" as const, text, language: "Detected" }] : []),
      {
        id: `a${m.length + 1}`,
        from: "ai" as const,
        text: "Thank you. I've added this to the intake. You can open a seeded demonstration case below to see the full routing and booking flow.",
      },
    ]);
    setDraft("");
    setSnapshot((s) => ({
      ...s,
      concerns: text ? [...s.concerns, text.slice(0, 80)] : s.concerns,
      inputs: Array.from(
        new Set([
          ...s.inputs,
          ...(text ? ["Text"] : []),
          ...(hasVoice ? ["Voice"] : []),
          ...attachments.map((a) => (a.kind === "photo" ? "Photo" : "Video")),
        ]),
      ),
      language: s.language ?? "Auto-detected",
    }));
  };

  const addAttachment = (kind: "photo" | "video") => {
    setAttachments((a) => [
      ...a,
      {
        id: `${kind}-${a.length + 1}`,
        kind,
        fileName: kind === "photo" ? `pet-photo-${a.length + 1}.jpg` : `pet-video-${a.length + 1}.mp4`,
        meta: kind === "photo" ? "Photo attachment" : "Video attachment · 00:08",
      },
    ]);
    setSnapshot((s) => ({
      ...s,
      inputs: Array.from(new Set([...s.inputs, kind === "photo" ? "Photo" : "Video"])),
    }));
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="ambient-glow mx-auto max-w-6xl px-6 pt-10 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>AI Front Desk</Eyebrow>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Tell me what's happening with your pet.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite">
              You can speak, type, add photos, or upload a short video.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GlowButton variant="secondary" size="sm" onClick={loadLuna}>
              Demo: Luna (Russian)
            </GlowButton>
            <GlowButton variant="outline" size="sm" onClick={loadEmergency}>
              Demo: Emergency
            </GlowButton>
            <GlowButton variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> Reset
            </GlowButton>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* LEFT: conversation + multimodal input */}
          <div className="space-y-4">
            <GlassCard pad="lg" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <FieldLabel>AI conversation</FieldLabel>
                <LanguageIndicator from="Automatic language detection" />
              </div>

              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.from === "owner"
                        ? "ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-[image:var(--gradient-primary)] px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-[var(--glow-primary)]"
                        : "max-w-[90%] rounded-xl rounded-bl-sm border border-silver bg-card px-4 py-3 text-sm leading-relaxed text-navy"
                    }
                  >
                    {m.from === "owner" && m.language ? (
                      <p className="mb-1 text-[0.66rem] font-semibold tracking-[0.12em] uppercase text-primary-foreground/75">
                        Owner · {m.language}
                      </p>
                    ) : null}
                    {m.text}
                  </div>
                ))}
              </div>

              {hasVoice ? (
                <VoiceNote
                  language="Russian"
                  durationSeconds={18}
                  transcript="Моя собака Луна, золотистый ретривер..."
                />
              ) : null}

              {attachments.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {attachments.map((a) => (
                    <MediaAttachment
                      key={a.id}
                      kind={a.kind}
                      fileName={a.fileName}
                      meta={a.meta}
                      onRemove={() =>
                        setAttachments((list) => list.filter((x) => x.id !== a.id))
                      }
                    />
                  ))}
                </div>
              ) : null}

              {/* composer */}
              <div className="rounded-xl border border-silver-strong/60 bg-card p-3 shadow-[var(--shadow-glass)]">
                <label htmlFor="composer" className="sr-only">
                  Describe what's happening with your pet
                </label>
                <textarea
                  id="composer"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Describe the symptoms in your own language…"
                  className="w-full resize-none bg-transparent text-sm leading-relaxed text-navy placeholder:text-graphite/70 focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-silver pt-3">
                  <GlowButton
                    variant={recording ? "critical" : "secondary"}
                    size="sm"
                    onClick={() => {
                      if (recording) {
                        setRecording(false);
                        setHasVoice(true);
                        setSnapshot((s) => ({
                          ...s,
                          inputs: Array.from(new Set([...s.inputs, "Voice"])),
                        }));
                      } else {
                        setRecording(true);
                      }
                    }}
                    aria-label={recording ? "Stop recording" : "Start voice recording"}
                  >
                    {recording ? <Square /> : <Mic />}
                    {recording ? "Stop recording" : "Voice"}
                  </GlowButton>
                  <GlowButton variant="secondary" size="sm" onClick={() => addAttachment("photo")}>
                    <ImageIcon /> Photo
                  </GlowButton>
                  <GlowButton variant="secondary" size="sm" onClick={() => addAttachment("video")}>
                    <Video /> Video
                  </GlowButton>
                  <GlowButton size="sm" className="ml-auto" onClick={send}>
                    <Send /> Send
                  </GlowButton>
                </div>

                {recording ? (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-silver bg-silver-white/80 px-3 py-2">
                    <span className="size-2 animate-pulse rounded-full bg-destructive" aria-hidden />
                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-navy">
                      Recording
                    </span>
                    <div className="flex flex-1 items-center gap-[2px]" aria-hidden>
                      {Array.from({ length: 34 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-full animate-pulse rounded-full bg-ice-lum"
                          style={{
                            height: `${8 + ((i * 7) % 20)}px`,
                            animationDelay: `${i * 40}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <Disclaimer>
                Speak or type in your language. Love Vet AI automatically detects supported
                languages.
              </Disclaimer>
            </GlassCard>
          </div>

          {/* RIGHT: live intake */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <LiveIntakePanel snapshot={snapshot} />
            {mode === "luna" ? (
              <RoutingExplanation
                route={lunaIntake.route}
                priority="SAME-DAY"
                reason={lunaIntake.routeReason}
              />
            ) : null}
          </div>
        </div>

        {/* EMERGENCY STATE */}
        {mode === "emergency" ? (
          <section className="mt-10 space-y-4">
            <SafetyAlert onShare={() => setShared(true)} />
            {shared ? (
              <GlassCard variant="solid" className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-deep" aria-hidden />
                <p className="text-sm text-navy">
                  Intake shared with the emergency desk. The clinic sees the original message,
                  detected language and structured summary.
                </p>
              </GlassCard>
            ) : null}
          </section>
        ) : null}

        {/* BOOKING FLOW */}
        {mode === "luna" && !confirmed ? (
          <section className="mt-12 space-y-8">
            <div>
              <Eyebrow>Step 1 · Location</Eyebrow>
              <h2 className="mt-1 font-display text-2xl font-semibold">Choose a location</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {locations.map((l) => (
                  <LocationCard
                    key={l.id}
                    location={l}
                    selected={l.id === locationId}
                    onSelect={() => setLocationId(l.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Eyebrow>Step 2 · Veterinarian</Eyebrow>
              <h2 className="mt-1 font-display text-2xl font-semibold">Choose a veterinarian</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {veterinarians.map((v) => (
                  <VeterinarianCard
                    key={v.id}
                    vet={v}
                    recommended={v.id === "vet_rivera"}
                    selected={v.id === vetId}
                    onSelect={() => setVetId(v.id)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <GlassCard pad="lg">
                <Eyebrow>Step 3 · Time</Eyebrow>
                <h2 className="mt-1 mb-5 font-display text-2xl font-semibold">
                  Select an available time
                </h2>
                <SlotPicker
                  selectedDay={day}
                  onSelectDay={setDay}
                  slots={timeSlots}
                  selectedSlot={slot}
                  onSelectSlot={setSlot}
                />
              </GlassCard>

              <GlassCard variant="solid" pad="lg" className="lg:sticky lg:top-24 lg:self-start">
                <FieldLabel>Booking summary</FieldLabel>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Patient" value={`${luna.name} · ${luna.breed}`} />
                  <Row label="Service" value="Mobility / Orthopedic Consultation" />
                  <Row label="Location" value={selectedLocation.name} />
                  <Row label="Veterinarian" value={selectedVet.name} />
                  <Row
                    label="Date"
                    value={`${selectedDay.label} · ${selectedDay.weekday} ${selectedDay.day}`}
                  />
                  <Row label="Time" value={slot ?? "Not selected"} />
                </dl>
                <GlowButton
                  className="mt-6 w-full"
                  size="lg"
                  disabled={!slot}
                  onClick={() => setConfirmed(true)}
                >
                  Confirm Appointment
                </GlowButton>
                <p className="mt-3 text-xs text-graphite">
                  Priority: same-day assessment · Veterinarian assessment required.
                </p>
              </GlassCard>
            </div>
          </section>
        ) : null}

        {/* CONFIRMATION */}
        {mode === "luna" && confirmed ? (
          <section className="mt-12">
            <GlassCard glow pad="lg" className="mx-auto max-w-2xl text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl surface-ice border border-silver-strong/60">
                <CheckCircle2 className="size-6 text-deep" aria-hidden />
              </span>
              <StatusBadge tone="success" className="mt-4">
                Appointment confirmed
              </StatusBadge>
              <h2 className="mt-3 font-display text-3xl font-semibold">Luna</h2>
              <p className="text-sm text-graphite">Mobility / Orthopedic Consultation</p>

              <dl className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                <Row label="Veterinarian" value={selectedVet.name} />
                <Row label="Location" value={selectedLocation.name} />
                <Row label="Date" value="September 28, 2026" />
                <Row label="Time" value={slot ?? "3:30 PM"} />
              </dl>

              <div className="mt-6 rounded-lg border border-silver bg-silver-white/80 p-3">
                <p className="text-sm font-semibold text-navy">
                  Love Vet AI prepared Luna's intake before the visit.
                </p>
                <p className="mt-1 text-xs text-graphite">
                  Original Russian voice note, transcript, photo and video travel with the English
                  structured summary.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <GlowButton>
                  <CalendarPlus /> Add to Calendar
                </GlowButton>
                <Link to="/my-pets">
                  <GlowButton variant="secondary">View Appointment</GlowButton>
                </Link>
                <GlowButton variant="outline" onClick={() => setConfirmed(false)}>
                  Reschedule
                </GlowButton>
                <GlowButton variant="ghost" onClick={reset}>
                  <XCircle /> Cancel
                </GlowButton>
              </div>
            </GlassCard>
          </section>
        ) : null}

        {mode === "idle" ? (
          <GlassCard variant="ice" className="mt-10">
            <p className="text-sm leading-relaxed text-navy">
              This demo runs on seeded data. Open <strong>Demo: Luna (Russian)</strong> to see
              multilingual multimodal intake, safety routing and a complete booking, or{" "}
              <strong>Demo: Emergency</strong> to see the safety gate.
            </p>
          </GlassCard>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <dd className="mt-1 text-sm font-medium text-navy">{value}</dd>
    </div>
  );
}
