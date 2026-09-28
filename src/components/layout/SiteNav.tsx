import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, MessageCircle, UserRound, X } from "lucide-react";
import { useAccount } from "@/lib/account-store";
import { Wordmark } from "@/components/kit/Wordmark";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/", exact: true },
  { label: "Chat with AI", to: "/chat", exact: false },
  { label: "Pet Owner Account", to: "/owner", exact: false },
  { label: "Professionals & Clinics", to: "/professionals", exact: false },
  { label: "Clinic Staff Workspace", to: "/workspace", exact: false },
] as const;

const item =
  "rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-graphite transition-all duration-200 hover:bg-ice/70 hover:text-deep";
const active =
  "!border-ice-lum bg-ice !text-deep shadow-[0_0_0_1px_rgb(128_104_255/0.2),0_8px_22px_-12px_rgb(109_74_255/0.6)]";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { role } = useAccount();
  const acctTo = role === "veterinarian" ? "/veterinarian-profile" : role === "owner" ? "/account" : "/join";
  const acctLabel = role ? "My Account" : "Sign In";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav aria-label="Main" className="glass mx-auto flex max-w-7xl items-center gap-2 rounded-full px-3 py-2 sm:px-4">
        <Wordmark />
        <div className="ml-4 hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} className={item} activeProps={{ className: active, "aria-current": "page" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link to={acctTo} className={cn(item, "ml-auto hidden items-center gap-1.5 xl:inline-flex")} activeProps={{ className: active }}>
          <UserRound className="size-4" strokeWidth={1.8} /> {acctLabel}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto grid size-10 place-items-center rounded-full border border-silver-strong/60 bg-card/70 text-deep xl:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>
      <div className={cn("glass mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl transition-all duration-300 xl:hidden", open ? "max-h-[32rem] p-3 opacity-100" : "pointer-events-none max-h-0 border-0 p-0 opacity-0")}>
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact }} onClick={() => setOpen(false)} className={cn(item, "rounded-xl py-3")} activeProps={{ className: active, "aria-current": "page" }}>
              {l.to === "/chat" && <MessageCircle className="mr-1.5 inline size-4" />}
              {l.label}
            </Link>
          ))}
          <Link to={acctTo} onClick={() => setOpen(false)} className={cn(item, "rounded-xl py-3")} activeProps={{ className: active }}>
            <UserRound className="mr-1.5 inline size-4" /> {acctLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
