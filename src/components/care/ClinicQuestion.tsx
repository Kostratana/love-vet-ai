import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { askInformationDesk } from "@/lib/care.functions";

/** Clinic questions answered only from the clinic's stored information. */
export function ClinicQuestion() {
  const ask = useServerFn(askInformationDesk);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ answer: string; sources: { title: string; category: string }[]; error?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    setBusy(true); setRes(null);
    try { setRes(await ask({ data: { question: q.trim() } })); }
    catch { setRes({ answer: "", sources: [], error: "The Information Desk could not answer right now." }); }
    finally { setBusy(false); }
  }

  return (
    <div className="glass mt-8 max-w-3xl rounded-3xl p-5">
      <p className="text-sm font-bold text-navy">Ask about the clinic</p>
      <p className="text-xs text-graphite">Services, hours, staff, policies, appointments, visit preparation. Answers come only from information the clinic has added.</p>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Your question" placeholder="e.g. What are your opening hours?" className="h-11 flex-1 rounded-full border border-silver-strong/70 bg-card px-4 text-sm text-navy outline-none focus:border-ice-lum" />
        <button type="submit" disabled={busy} className="lv-cta inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold disabled:opacity-60"><Search className="size-4" /> {busy ? "Searching…" : "Ask"}</button>
      </form>
      {res?.error && <p role="alert" className="mt-3 text-sm text-destructive">{res.error}</p>}
      {res && !res.error && (
        <div role="status" className="mt-3 rounded-2xl bg-card/70 p-4 text-sm whitespace-pre-line text-navy">
          {res.answer}
          {res.sources.length > 0 && <p className="mt-2 text-xs text-graphite">From: {res.sources.map((s) => `${s.title} (${s.category})`).join(" · ")}</p>}
        </div>
      )}
    </div>
  );
}
