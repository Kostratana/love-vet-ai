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
  "shrink-0 whitespace-nowrap rounded-full border border-transparent px-2.5 py-1 text-[0.78rem] font-semibold tracking-[0.01em] text-deep/75 transition-all duration-200 hover:border-ice-lum/60 hover:bg-white/40 hover:text-deep";
const active =
  "!border-ice-lum/90 !bg-[linear-gradient(135deg,rgb(221_210_255/0.75),rgb(240_200_235/0.55))] !text-deep font-extrabold shadow-[0_0_0_1px_rgb(128_104_255/0.22),0_6px_18px_-8px_rgb(109_74_255/0.75)]";
const chat =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-ice-lum bg-[linear-gradient(135deg,rgb(255_255_255/0.75),rgb(221_210_255/0.75))] px-3.5 py-1.5 text-[0.8rem] font-bold text-deep shadow-[0_0_0_1px_rgb(128_104_255/0.25),0_8px_22px_-12px_rgb(109_74_255/0.8)] transition-all duration-200 hover:-translate-y-px";
const chatActive =
  "!bg-[image:var(--gradient-primary)] !text-primary-foreground !border-primary shadow-[0_0_0_3px_rgb(128_104_255/0.25),0_10px_26px_-8px_rgb(109_74_255/0.9)]";

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
