import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  ImageIcon,
  MapPin,
  MessageCircle,
  Mic,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Sun,
  User,
  Video,
  Wrench,
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

const steps = [
  { icon: MessageCircle, title: "Chat with the AI assistant" },
  { icon: User, title: "Tell us about yourself and your pet" },
  { icon: FileText, title: "Describe what happened" },
  { icon: Mic, title: "Speak, type, or add photos and video" },
  { icon: ShieldCheck, title: "Automatic safety analysis" },
  { icon: Search, title: "AI identifies suitable veterinary care" },
  { icon: Building2, title: "Suitable clinics and veterinary professionals are checked" },
  { icon: CalendarDays, title: "Review available appointment options" },
  { icon: CheckCircle2, title: "Confirm your appointment" },
  { icon: ClipboardCheck, title: "Information is prepared for the veterinary professional" },
  { icon: UserPlus, title: "Create your account to securely save your pets, conversations, appointments and visit history" },
  { icon: Star, title: "After your completed visit, leave a verified review of the veterinarian and clinic" },
];

const criteria = [
  { icon: PawPrint, label: "Animal species" },
  { icon: Stethoscope, label: "Veterinary service" },
  { icon: User, label: "Veterinarian specialization" },
  { icon: Wrench, label: "Clinic capabilities" },
  { icon: MapPin, label: "Location" },
  { icon: Clock, label: "Opening hours" },
  { icon: Sun, label: "Holiday status" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: CalendarCheck, label: "Appointment availability" },
  { icon: FileText, label: "Price range" },
  { icon: Star, label: "Verified reviews" },
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

function HeroPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(128_104_255/0.28),transparent)] blur-2xl" />
      <div className="glass violet-glow rounded-3xl p-4 sm:p-5">
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
        </div>
        <Link to="/chat" aria-label="Open Chat with AI" className="flex items-center gap-1 rounded-full border border-silver-strong/60 bg-card/80 py-1.5 pr-1.5 pl-4 transition-shadow duration-200 hover:shadow-[var(--glow-silver-blue)]">
          <span className="flex-1 truncate text-sm text-graphite">Tell me what's happening with your pet...</span>
          {[Mic, ImageIcon, Video].map((I, i) => (
            <span key={i} className="grid size-8 place-items-center rounded-full text-graphite"><I className="size-4" strokeWidth={1.6} /></span>
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
        <ol className="relative mt-12 space-y-7 border-l border-ice-lum/70 pl-8">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="absolute top-0 -left-[3.05rem]"><IconDot icon={s.icon} /></span>
              <p className="pt-2 text-[0.95rem] font-semibold text-navy">
                <span className="mr-2 text-xs font-bold text-deep">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </p>
            </li>
          ))}
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

      {/* Platform */}
      <section id="platform" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
        <div className="glass rounded-[2rem] px-6 py-14 sm:px-12">
          <p className="text-center text-xs font-semibold tracking-[0.2em] text-deep uppercase">Platform</p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            More than finding the nearest clinic
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-graphite">
            Love Vet AI is designed to identify suitable veterinary care based on the specific
            animal, reported problem, clinic capabilities, appropriate veterinary service, location
            and availability. A nearby clinic that treats only cats and dogs isn't a match for a hamster —
            a farther clinic with a veterinarian experienced in small or exotic mammals may be. Reviews
            help compare suitable options; they never override suitability.
          </p>
          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {criteria.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2 rounded-full border border-silver-strong/60 bg-card/70 px-4 py-2 text-sm font-medium text-navy">
                <c.icon className="size-4 text-deep" strokeWidth={1.6} aria-hidden />
                {c.label}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-graphite">
            The assistant never diagnoses. It organizes your information and helps you reach a
            veterinary professional, who makes every medical assessment and treatment decision.
          </p>
        </div>
      </section>

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

      <SiteFooter />
    </div>
  );
}
