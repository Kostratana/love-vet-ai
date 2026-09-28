import { Link } from "@tanstack/react-router";
import { MessageCircle, Star, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

const actions = [
  {
    to: "/chat" as const,
    label: "Chat with AI",
    icon: MessageCircle,
    primary: true,
    text: "Tell Love Vet AI what is happening with your pet. Type, speak, or attach photos and a short video — the assistant guides you through what's needed.",
  },
  {
    to: "/join/owner" as const,
    label: "Create Your Account",
    icon: UserPlus,
    text: "Save your pets, conversations, appointments and visit history. No account is needed to start chatting.",
  },
  {
    to: "/review" as const,
    label: "Leave a Review",
    icon: Star,
    text: "After a completed veterinary visit, rate the veterinarian and clinic. Verified reviews will require a completed appointment.",
  },
];

export function JourneyActions() {
  return (
    <section aria-labelledby="journey-actions" className="mx-auto max-w-5xl px-6 pb-8">
      <div className="glass rounded-[2rem] px-6 py-12 sm:px-12">
        <h2 id="journey-actions" className="text-center text-2xl font-bold tracking-[-0.02em] text-navy sm:text-3xl">
          Ready when you are
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {actions.map((a) => (
            <div key={a.label} className="flex flex-col">
              <p className="flex-1 text-sm leading-relaxed text-graphite">{a.text}</p>
              <Link to={a.to} className={cn(buttonVariants({ variant: a.primary ? "primary" : "secondary", size: "md" }), "mt-5 self-start")}>
                <a.icon /> {a.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
