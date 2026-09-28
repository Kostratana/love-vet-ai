import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/", exact: true },
  { label: "Pet Owner Account", to: "/owner", exact: false },
  { label: "Clinic Staff", to: "/workspace", exact: false },
  { label: "Information Desk", to: "/information-desk", exact: false },
] as const;

const item =
  "rounded-full border border-transparent px-3 py-1.5 text-[0.8rem] font-semibold tracking-[0.01em] text-graphite transition-all duration-200 hover:border-ice-lum/70 hover:bg-card/60 hover:text-deep";
const active =
  "!border-ice-lum/90 bg-card/70 !text-deep shadow-[0_0_0_1px_rgb(128_104_255/0.18),0_6px_18px_-10px_rgb(109_74_255/0.65)]";
const chat =
  "inline-flex items-center gap-1.5 rounded-full border border-ice-lum bg-[linear-gradient(135deg,rgb(255_255_255/0.75),rgb(221_210_255/0.75))] px-3.5 py-1.5 text-[0.8rem] font-bold text-deep shadow-[0_0_0_1px_rgb(128_104_255/0.25),0_8px_22px_-12px_rgb(109_74_255/0.8)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_0_1px_rgb(128_104_255/0.45),0_10px_26px_-10px_rgb(109_74_255/0.9)]";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <nav aria-label="Main" className="glass relative mx-auto flex max-w-6xl items-center gap-2 rounded-full px-3 py-1.5 sm:px-4">
        <Wordmark />
        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} className={item} activeProps={{ className: active, "aria-current": "page" }}>
              {l.label}
            </Link>
          ))}
          <Link to="/chat" className={cn(chat, "ml-2")} activeProps={{ "aria-current": "page" }}>
            <MessageCircle className="size-3.5" strokeWidth={2} /> Chat with AI
          </Link>
        </div>
        <Link to="/chat" className={cn(chat, "ml-auto px-3 lg:hidden")} aria-label="Chat with AI">
          <MessageCircle className="size-3.5" strokeWidth={2} /> <span className="hidden sm:inline">Chat with AI</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-9 place-items-center rounded-full border border-ice-lum/70 bg-card/60 text-deep lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
        {open && (
          <div id="mobile-menu" className="glass page-enter absolute top-full right-2 mt-2 w-56 rounded-2xl p-2 lg:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} onClick={() => setOpen(false)} className={cn(item, "block rounded-xl py-2.5")} activeProps={{ className: active, "aria-current": "page" }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
