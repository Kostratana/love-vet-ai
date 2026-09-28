import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { GlowButton } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

const links = [
  { label: "How It Works", hash: "how-it-works" },
  { label: "Platform", hash: "platform" },
  { label: "For Clinics", hash: "for-clinics" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2 sm:px-4">
        <Wordmark />
        <div className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.hash}
              to="/"
              hash={l.hash}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-graphite transition-colors hover:text-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link to="/workspace" className="px-3 text-sm font-medium text-graphite hover:text-deep">
            Clinic Staff Workspace
          </Link>
          <Link to="/chat">
            <GlowButton size="sm">
              <MessageCircle /> Chat with AI
            </GlowButton>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto grid size-10 place-items-center rounded-full border border-silver-strong/60 bg-card text-navy md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>
      <div
        className={cn(
          "glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl transition-all md:hidden",
          open ? "max-h-96 p-3 opacity-100" : "max-h-0 border-0 p-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.hash} to="/" hash={l.hash} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-graphite">
              {l.label}
            </Link>
          ))}
          <Link to="/chat" onClick={() => setOpen(false)} className="mt-2">
            <GlowButton className="w-full"><MessageCircle /> Chat with AI</GlowButton>
          </Link>
          <Link to="/workspace" onClick={() => setOpen(false)}>
            <GlowButton variant="secondary" className="w-full">Clinic Staff Workspace</GlowButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
