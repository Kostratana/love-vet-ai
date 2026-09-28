import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ImageIcon,
  MessageCircle,
  Mic,
  ShieldCheck,
  User,
  Video,
  FileText,
  Search,
  Star,
  UserPlus,
} from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GlowButton } from "@/components/kit/primitives";
import { HeartsMark } from "@/components/kit/Wordmark";
import { JourneyActions } from "@/components/landing/JourneyActions";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Love Vet AI — Find the right veterinary care for your pet" },
      {
        name: "description",
        content:
          "Tell our AI assistant about you, your pet and what happened — by text or voice, in your language — and confirm a suitable veterinary appointment.",
      },
      { property: "og:title", content: "Love Vet AI — Find the right veterinary care for your pet" },
      {
        property: "og:description",
        content:
          "AI-powered veterinary appointment coordination: species-aware clinic matching, availability and client-confirmed booking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

type StepAction = { to: "/chat" | "/owner" | "/information-desk" | "/join/veterinarian"; hash?: string; label: string } | { info: string };
const steps: { icon: typeof MessageCircle; title: string; actions?: StepAction[] }[] = [
  { icon: MessageCircle, title: "Chat with the AI assistant", actions: [{ to: "/chat", label: "Open Chat with AI" }] },
  { icon: User, title: "Tell us about yourself and your pet", actions: [{ to: "/chat", label: "Start in chat" }, { to: "/owner", label: "Create an account" }] },
  { icon: FileText, title: "Describe what happened", actions: [{ to: "/chat", label: "Describe in chat" }] },
  { icon: Mic, title: "Speak, type, or add photos and video", actions: [{ to: "/chat", label: "Open chat" }] },
  { icon: ShieldCheck, title: "Automatic safety analysis" },
  { icon: Search, title: "AI identifies suitable veterinary care", actions: [{ to: "/information-desk", label: "Information Desk" }] },
  { icon: Building2, title: "Suitable clinics and veterinary professionals are checked", actions: [{ to: "/join/veterinarian", label: "Clinic / Veterinarian Registration" }] },
  { icon: CalendarDays, title: "Review available appointment options", actions: [{ info: "Appointment options will appear inside Chat with AI after matching. Booking is not connected yet in this preview." }] },
  { icon: CheckCircle2, title: "Confirm your appointment", actions: [{ info: "You'll confirm the appointment yourself inside Chat with AI. Booking is a future step and is not connected yet." }] },
  { icon: ClipboardCheck, title: "Information is prepared for the veterinary professional", actions: [{ info: "Pre-visit handoff: your description, pet details, voice message, photos and video are organized into a short summary for the veterinary professional. The AI never diagnoses — the veterinarian decides." }] },
  { icon: UserPlus, title: "Create your account and save your pets, conversations, appointments and visit history", actions: [{ to: "/owner", label: "Pet Owner Account" }] },
  { icon: Star, title: "After your completed visit, leave a verified review", actions: [{ to: "/owner", hash: "reviews", label: "Leave a review" }] },
];


function IconDot({ icon: Icon, size = "md" }: { icon: typeof MessageCircle; size?: "md" | "lg" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border border-silver-strong/60 bg-card/70 text-deep shadow-[var(--shadow-glass)] backdrop-blur ${size === "lg" ? "size-12" : "size-10"}`}
    >
      <Icon className={size === "lg" ? "size-5" : "size-[18px]"} strokeWidth={1.6} aria-hidden />
    </span>
  );
}

function JourneyStep({ step, n }: { step: (typeof steps)[number]; n: number }) {
  const [open, setOpen] = useState(false);
  const info = step.actions?.find((a): a is { info: string } => "info" in a);
  const links = step.actions?.filter((a): a is Exclude<StepAction, { info: string }> => "to" in a) ?? [];
  return (
    <li className="relative">
      <span className="absolute top-2 -left-[3.05rem]"><IconDot icon={step.icon} /></span>
      <div className={`glass rounded-2xl px-4 py-3 ${step.actions ? "hover-lift" : ""}`}>
        <p className="text-[0.95rem] font-semibold text-navy">
          <span className="mr-2 text-xs font-bold text-deep">{String(n).padStart(2, "0")}</span>
          {step.title}
        </p>
        {(links.length > 0 || info) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {links.map((l) => (
              <Link key={l.label} to={l.to} {...(l.hash ? { hash: l.hash } : {})} className="inline-flex items-center gap-1 rounded-full border border-ice-lum bg-ice/70 px-3 py-1 text-xs font-bold text-deep transition-all hover:bg-ice hover:shadow-[var(--glow-silver-blue)]">
                {l.label} <ArrowRight className="size-3" />
              </Link>
            ))}
            {info && (
              <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 rounded-full border border-ice-lum bg-ice/70 px-3 py-1 text-xs font-bold text-deep hover:bg-ice">
                {open ? "Hide details" : "What happens here?"}
              </button>
            )}
          </div>
        )}
        {info && open && <p className="page-enter mt-3 rounded-xl bg-card/70 p-3 text-sm text-graphite">{info.info}</p>}
      </div>
    </li>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(128_104_255/0.28),transparent)] blur-2xl" />
      <div className="glass chat-hero rounded-3xl p-4 sm:p-5">
        <div className="flex items-center gap-3 border-b border-silver/70 pb-3">
          <HeartsMark className="h-6 w-9" />
          <div>
            <p className="text-sm font-bold text-navy">Love Vet AI</p>
            <p className="text-[0.72rem] text-graphite">AI Veterinary Appointment Assistant</p>
          </div>
        </div>
        <div className="space-y-3 py-5 text-sm leading-relaxed">
          <p className="text-navy">
            Describe what is happening with your pet. You can type or leave a voice message, attach
            photos or a short video, and Love Vet AI will help you find suitable veterinary care and
            arrange an appointment.
          </p>
          <p className="text-xs text-graphite">
            Speak or write in the language you're most comfortable with. Language detection is
            automatic.
          </p>
        </div>
        <Link to="/chat" aria-label="Open Chat with AI" className="flex items-center gap-1 rounded-full border border-silver-strong/60 bg-card/80 py-1.5 pr-1.5 pl-4 transition-shadow duration-200 hover:shadow-[var(--glow-silver-blue)]">
          <span className="flex-1 truncate text-sm text-graphite">Tell me what's happening with your pet...</span>
          {[Mic, ImageIcon, Video].map((I, i) => (
            <span key={i} aria-hidden className="grid size-8 place-items-center rounded-full text-graphite"><I className="size-4" strokeWidth={1.6} /></span>
          ))}
          <span className="grid size-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]">
            <ArrowRight className="size-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="ambient-bg min-h-screen">
      <SiteNav />
      <div className="page-enter">

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-16 pb-10 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-deep uppercase">
            AI-powered veterinary appointment coordination
          </p>
          <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-5xl lg:text-[3.3rem]">
            <span className="text-gradient-hero">Find the right veterinary care for your pet</span>
          </h1>
          <p className="mt-5 text-lg font-semibold text-navy">
            Tell us about yourself, your pet, and what happened.
          </p>
          <div className="mt-4 max-w-xl space-y-3 text-[0.95rem] leading-relaxed text-graphite">
            <p>
              Describe what is happening with your pet — type or speak naturally, and attach photos
              or a short video if you have them. Language detection is automatic.
            </p>
            <p>
              Love Vet AI helps identify suitable veterinary care and veterinary professionals at
              participating clinics, checks availability, and helps you arrange an appointment. The
              veterinary professional can receive the information you shared before your visit.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/chat">
              <GlowButton size="lg"><MessageCircle /> Chat with AI</GlowButton>
            </Link>
            <Link to="/" hash="how-it-works">
              <GlowButton size="lg" variant="secondary">How It Works</GlowButton>
            </Link>
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-3xl scroll-mt-28 px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-[-0.03em] sm:text-4xl">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-graphite">
          One conversation. The assistant asks only for what it doesn't already know.
        </p>
        <ol className="relative mt-12 space-y-4 border-l border-ice-lum/70 pl-8">
          {steps.map((s, i) => <JourneyStep key={s.title} step={s} n={i + 1} />)}
        </ol>
        <p className="mt-10 text-center text-sm text-graphite">
          After your visit, you can rate your experience with the veterinarian and clinic and leave a
          verified review to help other pet owners make informed choices. Your feedback also helps
          veterinary professionals and clinics improve the quality of their service.
        </p>
        <p className="mt-3 text-center text-sm text-graphite">
          Your description, voice message, photos and videos can be included with your appointment
          information and made available to the veterinary professional before your visit.
        </p>
      </section>

      <JourneyActions />

      {/* For clinics */}
      <section id="for-clinics" className="mx-auto grid max-w-6xl scroll-mt-28 items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-deep uppercase">For clinics</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Connect your clinics to Love Vet AI
          </h2>
          <p className="mt-4 text-graphite">
            Veterinary organizations will be able to connect their locations, services,
            veterinarians, capabilities and schedules — and receive appointments with the client's
            description and media already prepared.
          </p>
          <Link to="/join/veterinarian" className="mt-7 mr-3 inline-block">
            <GlowButton size="lg">Clinic / Veterinarian Registration <ArrowRight /></GlowButton>
          </Link>
          <Link to="/workspace" className="mt-7 inline-block">
            <GlowButton size="lg" variant="secondary">Clinic Staff Workspace <ArrowRight /></GlowButton>
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-navy">
          {["Locations & addresses", "Animal species treated", "Veterinarians & specialties", "Services & capabilities", "Opening & holiday hours", "Schedules & availability"].map((t) => (
            <li key={t} className="flex items-center gap-2 border-b border-silver/80 pb-3">
              <CheckCircle2 className="size-4 text-deep" strokeWidth={1.6} aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </section>

      </div>
      <SiteFooter />
    </div>
  );
}
