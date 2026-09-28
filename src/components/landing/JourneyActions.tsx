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
    text: "Tell Love Vet AI what is happening with your pet. You can type, speak, or attach photos and video. The assistant will guide you through the information needed to find suitable veterinary care and arrange an appointment.",
  },
  {
    to: "/join/owner" as const,
    label: "Create Your Account",
    icon: UserPlus,
    text: "Create your free Love Vet AI account to save your pets, conversations, appointments and visit history in one place. No account is needed to start chatting.",
  },
  {
    to: "/review" as const,
    label: "Leave a Review",
    icon: Star,
    text: "After your completed veterinary visit, share your experience and rate the veterinarian and clinic. Your verified feedback can help other pet owners make informed choices and help improve the quality of veterinary services.",
  },
];

export function JourneyActions() {
  return (
    <section aria-labelledby="journey-actions" className="mx-auto max-w-5xl px-6 pb-20">
      <div className="glass rounded-[2rem] px-6 py-12 sm:px-12">
        <h2 id="journey-actions" className="text-center text-2xl font-bold tracking-[-0.02em] text-navy sm:text-3xl">
          Ready when you are
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {actions.map((a) => (
            <div key={a.label} className="flex flex-col">
              <p className="flex-1 text-sm leading-relaxed text-graphite">{a.text}</p>
              <Link
                to={a.to}
                className={cn(buttonVariants({ variant: a.primary ? "primary" : "secondary", size: "md" }), "mt-5 self-start")}
              >
                <a.icon /> {a.label}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-silver/80 pt-8 text-center">
          <p className="text-base font-semibold text-navy">
            Keep your pets' information and visit history organized with Love Vet AI — free for pet owners.
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-graphite">
            Save your pet profiles, veterinary visits, appointment history, conversations and relevant
            information about your pet's health in one secure account.
          </p>
        </div>
      </div>
    </section>
  );
}
