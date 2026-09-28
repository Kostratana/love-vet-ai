import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { GlowButton } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

const links = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "For Pet Owners", to: "/for-pet-owners" },
  { label: "For Veterinary Teams", to: "/for-veterinary-teams" },
  { label: "Platform", to: "/platform" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center gap-3 rounded-xl px-3 py-2.5 sm:px-4">
        <Wordmark />

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-graphite transition-colors hover:bg-card hover:text-navy"
              activeProps={{ className: "bg-card text-navy" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link to="/workspace">
            <GlowButton variant="secondary" size="sm">
              Veterinary Workspace
            </GlowButton>
          </Link>
          <Link to="/intake">
            <GlowButton size="sm">Start AI Intake</GlowButton>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto grid size-10 place-items-center rounded-lg border border-silver-strong/60 bg-card text-navy md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      <div
        className={cn(
          "glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-xl transition-all md:hidden",
          open ? "max-h-96 p-3 opacity-100" : "max-h-0 border-0 p-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-graphite hover:bg-card hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Link to="/intake" onClick={() => setOpen(false)}>
              <GlowButton className="w-full">Start AI Intake</GlowButton>
            </Link>
            <Link to="/workspace" onClick={() => setOpen(false)}>
              <GlowButton variant="secondary" className="w-full">
                Veterinary Workspace
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
