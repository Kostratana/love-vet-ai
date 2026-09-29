import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/", exact: true },
  { label: "Pet Owner Account", to: "/owner", exact: false },
  { label: "Clinic Staff", to: "/workspace", exact: false },
  { label: "Information Desk", to: "/information-desk", exact: false },
  { label: "Ratings", to: "/ratings", exact: false },
  { label: "Write Review", to: "/review", exact: false },
] as const;

const item =
  "shrink-0 whitespace-nowrap rounded-full border border-transparent px-2.5 py-[3px] text-[0.76rem] font-medium tracking-[0.01em] text-deep/65 transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:text-deep hover:shadow-[0_0_14px_-6px_rgb(109_74_255/0.6)]";
const active =
  "!border-primary/45 !bg-[linear-gradient(135deg,rgb(109_74_255/0.16),rgb(160_120_255/0.1))] !text-deep font-bold shadow-[0_0_16px_-6px_rgb(109_74_255/0.75)]";
const chat =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/35 bg-primary/8 px-3 py-[3px] text-[0.76rem] font-semibold text-deep transition-all duration-200 hover:-translate-y-px hover:bg-primary/12 hover:shadow-[0_0_16px_-6px_rgb(109_74_255/0.75)]";
const chatActive =
  "!bg-[image:var(--gradient-primary)] !text-primary-foreground !border-primary/60 shadow-[0_0_18px_-6px_rgb(109_74_255/0.9)]";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav aria-label="Main" className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-1.5 sm:px-4">
        <span className="shrink-0"><Wordmark /></span>
        <div className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} className={item} activeProps={{ className: active, "aria-current": "page" }}>
              {l.label}
            </Link>
          ))}
          <Link to="/chat" className={cn(chat, "ml-1")} activeProps={{ className: chatActive, "aria-current": "page" }}>
            <MessageCircle className="size-3.5" strokeWidth={2} /> Chat with AI
          </Link>
        </div>
      </nav>
    </header>
  );
}
