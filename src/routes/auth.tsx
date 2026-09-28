import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Wordmark } from "@/components/kit/Wordmark";
import { GlowButton } from "@/components/kit/primitives";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Love Vet AI" },
      { name: "description", content: "Sign in to chat with the Love Vet AI appointment assistant and keep your conversations." },
      { property: "og:title", content: "Sign in · Love Vet AI" },
      { property: "og:description", content: "Your conversations are saved to your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/chat" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/chat` } });
    setBusy(false);
    if (res.error) return setMsg(res.error.message);
    if (mode === "up" && !res.data.session) setMsg("Check your email to confirm your account.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setMsg(r.error.message ?? "Google sign-in failed.");
  }

  const input = "h-11 w-full rounded-xl border border-silver-strong/70 bg-card/80 px-4 text-sm text-navy outline-none focus:border-blue";

  return (
    <div className="ambient-bg grid min-h-screen place-items-center px-4">
      <div className="glass violet-glow w-full max-w-sm rounded-3xl p-7">
        <Wordmark />
        <h1 className="mt-6 text-xl font-bold">{mode === "in" ? "Sign in to chat" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-graphite">Your conversations are saved to your account.</p>
        <GlowButton variant="secondary" className="mt-6 w-full" onClick={google} type="button">
          Continue with Google
        </GlowButton>
        <div className="my-5 flex items-center gap-3 text-xs text-graphite"><span className="h-px flex-1 bg-silver" />or<span className="h-px flex-1 bg-silver" /></div>
        <form onSubmit={submit} className="space-y-3">
          <input className={input} type="email" required placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={input} type="password" required minLength={6} placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <GlowButton className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</GlowButton>
        </form>
        {msg && <p role="status" className="mt-3 text-sm text-deep">{msg}</p>}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-5 text-sm font-medium text-deep">
          {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
