import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogOut, Menu, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Wordmark } from "@/components/kit/Wordmark";
import { GlowButton } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with AI · Love Vet AI" },
      { name: "description", content: "AI veterinary appointment assistant — type or speak in your language and add photos or video." },
      { property: "og:title", content: "Chat with AI · Love Vet AI" },
      { property: "og:description", content: "Conversational veterinary appointment coordination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatLayout,
});

export const conversationsKey = ["conversations"] as const;

function ChatLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  void navigate; void useEffect;

  const { data: threads = [] } = useQuery({
    queryKey: conversationsKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id,title,updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <div className="ambient-bg min-h-screen" />;
  if (!user) {
    // Guests can chat immediately — no registration required.
    return (
      <div className="ambient-bg flex h-[100dvh] flex-col gap-3 p-0 lg:p-4">
        <div className="flex items-center justify-between gap-3 px-4 pt-3 lg:px-2 lg:pt-0">
          <Wordmark />
          <p className="text-xs text-graphite">
            <Link to="/auth" className="font-semibold text-deep hover:underline">Sign in</Link> to save your conversations.
          </p>
        </div>
        <main className="relative flex min-h-0 flex-1 flex-col"><Outlet /></main>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2 py-1">
        <Wordmark />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close conversations"><X className="size-4" /></button>
      </div>
      <Link to="/chat" onClick={() => setOpen(false)} className="mt-5">
        <GlowButton size="sm" className="w-full"><Plus /> New conversation</GlowButton>
      </Link>
      <p className="mt-6 px-2 text-[0.68rem] font-semibold tracking-[0.14em] text-graphite uppercase">Conversations</p>
      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto">
        {threads.map((t) => (
          <Link
            key={t.id}
            to="/chat/$threadId"
            params={{ threadId: t.id }}
            onClick={() => setOpen(false)}
            className="block truncate rounded-lg px-3 py-2 text-sm text-graphite hover:bg-card/70 hover:text-navy"
            activeProps={{ className: "bg-card text-navy font-semibold shadow-[var(--shadow-glass)]" }}
          >
            {t.title}
          </Link>
        ))}
        {threads.length === 0 && <p className="px-3 py-2 text-xs text-graphite">No conversations yet.</p>}
      </nav>
      <div className="mt-3 border-t border-silver pt-3">
        <p className="truncate px-2 text-xs text-graphite">{user.email}</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-graphite hover:text-deep"
        >
          <LogOut className="size-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="ambient-bg flex h-[100dvh] gap-4 p-0 lg:p-4">
      <aside className="glass hidden w-64 shrink-0 rounded-3xl p-3 lg:block">{sidebar}</aside>
      <div
        className={cn("fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setOpen(false)}
      >
        <aside className="glass h-full w-72 bg-background p-3" onClick={(e) => e.stopPropagation()}>{sidebar}</aside>
      </div>
      <main className="relative flex min-w-0 flex-1 flex-col">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open conversations"
          className="absolute top-3.5 left-3 z-10 grid size-10 place-items-center rounded-full border border-silver-strong/60 bg-card/80 text-navy lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
