import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/", exact: true },
  { label: "Pet Owner Account", to: "/owner", exact: false },
  { label: "Clinic Staff", to: "/workspace", exact: false },
  { label: "Information Desk", to: "/information-desk", exact: false },
  { label: "Ratings", to: "/ratings", exact: false },
  { label: "Payment", to: "/payment", exact: false },
  { label: "Write Review", to: "/review", exact: false },
] as const;

const item = "lv-pill shrink-0 px-2.5 py-[2px] text-[0.75rem]";
const active = "lv-pill-active";
const chat = "lv-cta shrink-0 px-3 py-[2px] text-[0.75rem]";
const chatActive = "lv-cta-active";

export function SiteNav() {
  const loc = useRouterState({ select: (st) => st.location });
  const reviewFlow = loc.pathname.startsWith("/join/owner") && (loc.search as { redirect?: string }).redirect === "/review";
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav aria-label="Main" className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-1.5 sm:px-4">
        <span className="shrink-0"><Wordmark /></span>
        <div className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} className={cn(item, reviewFlow && l.to === "/review" && active)} aria-current={reviewFlow && l.to === "/review" ? "page" : undefined} activeProps={{ className: active, "aria-current": "page" }}>
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
