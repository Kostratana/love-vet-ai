import { Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, ImageIcon, MessageCircle, Mic, PawPrint, Search, Sparkles, Video } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GlowButton } from "@/components/kit/primitives";
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

type Step = { icon: typeof MessageCircle; title: string; text: string; to?: "/chat" | "/information-desk" };
const steps: Step[] = [
  { icon: PawPrint, title: "Tell us about your pet", text: "Species, age, and anything we should know.", to: "/chat" },
  { icon: MessageCircle, title: "Share what happened", text: "Type, speak, or add photos and a short video.", to: "/chat" },
  { icon: Sparkles, title: "AI understands the request", text: "Language is detected and a safety check runs first." },
  { icon: Search, title: "Find suitable veterinary care", text: "Matched by species, specialty, location and hours.", to: "/information-desk" },
  { icon: CalendarDays, title: "Review available options", text: "Options will appear in chat once booking is connected." },
  { icon: CheckCircle2, title: "Confirm appointment", text: "You confirm — nothing is booked without you." },
  { icon: ClipboardCheck, title: "Information prepared for the team", text: "The veterinarian receives a summary before the visit. The AI never diagnoses." },
];

function JourneyStep({ step, n }: { step: Step; n: number }) {
  const Icon = step.icon;
  const inner = (
    <>
      <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-ice-lum bg-card text-deep shadow-[0_0_0_4px_rgb(183_168_255/0.18),0_8px_22px_-10px_rgb(109_74_255/0.7)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_6px_rgb(183_168_255/0.3),0_10px_26px_-8px_rgb(109_74_255/0.85)]">
        <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
      </span>
      <span className="lg:mt-4 lg:block">
        <span className="block text-[0.7rem] font-bold tracking-[0.14em] text-primary/70">{String(n).padStart(2, "0")}</span>
        <span className="mt-0.5 block text-sm font-bold text-navy group-hover:text-deep">
          {step.title}{step.to && <ArrowRight className="ml-1 inline size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-graphite">{step.text}</span>
      </span>
    </>
  );
  const cls = "group flex items-start gap-4 text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center";
  return (
    <li className="relative">
      {step.to ? <Link to={step.to} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>}
    </li>
  );
}

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
            <Link to="/chat">
              <GlowButton size="lg"><MessageCircle /> Chat with AI</GlowButton>
            </Link>
            <Link to="/" hash="how-it-works" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex h-11 items-center gap-1.5 self-center rounded-full border border-primary/40 bg-white/40 px-5 text-sm font-semibold text-deep backdrop-blur transition-all duration-200 hover:-translate-y-px hover:bg-white/60 hover:shadow-[0_8px_20px_-10px_rgb(109_74_255/0.7)]">
              How It Works <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
        <HeroPreview />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-[-0.03em] sm:text-4xl"><span className="text-gradient-hero">How it works</span></h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-graphite">
          One conversation. The assistant asks only for what it doesn't already know.
        </p>
        <div className="relative mt-12">
          <div aria-hidden className="absolute top-[22px] right-[7%] left-[7%] hidden h-px bg-[linear-gradient(90deg,transparent,rgb(128_104_255/0.55)_12%,rgb(216_150_220/0.55)_50%,rgb(128_104_255/0.55)_88%,transparent)] lg:block" />
          <div aria-hidden className="absolute top-2 bottom-2 left-[21px] w-px bg-[linear-gradient(180deg,transparent,rgb(128_104_255/0.5),rgb(216_150_220/0.5),transparent)] lg:hidden" />
          <ol className="relative grid gap-7 lg:grid-cols-7 lg:gap-4">
            {steps.map((s, i) => <JourneyStep key={s.title} step={s} n={i + 1} />)}
          </ol>
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
