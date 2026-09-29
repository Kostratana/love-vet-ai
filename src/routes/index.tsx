import { Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, ImageIcon, MessageCircle, Mic, Video } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeartsMark } from "@/components/kit/Wordmark";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Love Vet AI — Find the right vet for your pet" },
      {
        name: "description",
        content:
          "Tell our AI assistant about you, your pet and what happened — by text or voice, in your language — and confirm a suitable veterinary appointment.",
      },
      { property: "og:title", content: "Love Vet AI — Find the right vet for your pet" },
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

const steps: { title: string; text: string[] }[] = [
  { title: "Start the conversation", text: ["Open Chat with AI and tell the assistant what is happening with your pet. You can start chatting without creating an account first."] },
  { title: "Tell us about yourself and your pet", text: ["During the conversation, the AI assistant will ask only for information that is still needed, such as your name, contact details, location and information about your pet."] },
  { title: "Describe what happened", text: ["Explain the reason for the visit in your own words. You can type or leave a voice message in the language you're most comfortable with. Language detection is automatic."] },
  { title: "Add photos, video or voice", text: ["If useful, attach photos or a short video showing the problem. You can also use a voice message. These materials can be included with the information prepared for the veterinary team."] },
  { title: "Review suitable veterinary care", text: ["Love Vet AI can help identify suitable participating veterinary care based on relevant factors such as the animal species, required type of service, location, clinic capabilities, opening hours and availability."] },
  { title: "Create your account when needed", text: ["You do not need to register before starting the conversation.", "When you want to securely save your conversation, pet information and appointment details, Love Vet AI will ask you to create or sign in to your account. The conversation continues without losing the information already provided."] },
  { title: "Choose and confirm your appointment", text: ["When booking is connected, available suitable options can be presented to you. You choose the clinic or veterinary option and confirm the appointment. Nothing is booked without your confirmation."] },
  { title: "Information is prepared for the veterinary team", text: ["The information collected during the conversation — including the reason for the visit and any submitted photos, video, voice messages or relevant files — can be associated with the appointment and made available to the veterinary professional before the visit."] },
];

function HeroPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-y-10 inset-x-0 -z-10 rounded-full sm:-inset-10 bg-[radial-gradient(closest-side,rgb(128_104_255/0.34),rgb(240_160_215/0.18)_60%,transparent)] blur-2xl" />
      <div className="glass chat-hero rounded-3xl p-4 sm:p-5">
        <div className="flex items-center gap-3 border-b border-silver/70 pb-3">
          <HeartsMark className="h-6 w-9" />
          <div>
            <p className="text-gradient-hero text-[0.8rem] font-extrabold tracking-[0.16em] uppercase">Love Vet AI</p>
            <p className="text-[0.74rem] font-medium text-primary/80">Veterinary Appointment Assistant</p>
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
  const hash = useRouterState({ select: (st) => st.location.hash });
  useEffect(() => {
    if (hash !== "how-it-works") return;
    const t = window.setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);
  return (
    <div className="ambient-bg min-h-screen overflow-x-clip">
      <SiteNav />
      <div className="page-enter">

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pt-16 pb-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-deep uppercase">
            AI-powered veterinary appointment coordination
          </p>
          <h1 className="mt-4 text-[2.4rem] leading-[1.08] font-extrabold tracking-[-0.035em] [text-wrap:balance] sm:text-5xl lg:text-[3.4rem]">
            <span className="text-gradient-hero">Find the right vet for&nbsp;your&nbsp;pet</span>
          </h1>
          <p className="mt-5 text-lg font-semibold text-deep">
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
            <Link to="/chat" className="lv-cta h-9 px-5 text-sm">
              <MessageCircle className="size-4" /> Chat with AI
            </Link>
            <button type="button" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="lv-pill h-9 border-[rgb(117_97_201/0.55)] bg-[linear-gradient(135deg,rgb(128_108_212/0.34),rgb(160_142_230/0.24))] px-5 text-sm text-[#3E2E86]">
              How It Works <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-[-0.03em] sm:text-4xl"><span className="text-gradient-hero">How Love Vet AI Works</span></h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-graphite">
          Start a conversation with the AI assistant and describe what is happening with your pet. Love Vet AI guides you through the information needed to help arrange appropriate veterinary care.
        </p>
        <ol className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-[rgb(117_97_201/0.25)] pt-4">
              <p className="text-xs font-bold tracking-[0.14em] text-primary/70">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-sm font-bold text-navy">{s.title}</h3>
              {s.text.map((t) => <p key={t} className="mt-1.5 text-xs leading-relaxed text-graphite">{t}</p>)}
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-graphite">
          Love Vet AI helps coordinate veterinary care and prepare information for the veterinary team. It does not replace professional veterinary diagnosis or treatment.
        </p>
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
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <Link to="/join/veterinarian" className="inline-flex items-center gap-1 text-deep hover:underline">Clinic / Veterinarian Registration <ArrowRight className="size-3.5" /></Link>
            <Link to="/workspace" className="inline-flex items-center gap-1 text-primary hover:underline">See the Clinic Staff Workspace <ArrowRight className="size-3.5" /></Link>
          </div>
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
