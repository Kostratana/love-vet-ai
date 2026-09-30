import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account-store";

export function OwnerConversations({ empty }: { empty: ReactNode }) {
  const { user } = useAccount();
  const [rows, setRows] = useState<{ id: string; title: string; updated_at: string }[] | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("conversations").select("id,title,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(30)
      .then(({ data }) => setRows(data ?? []));
  }, [user]);
  if (!user) return <>{empty}</>;
  if (!rows) return <p role="status" className="text-sm text-graphite">Loading conversations…</p>;
  if (!rows.length) return <>{empty}</>;
  return (
    <ul className="space-y-2">
      {rows.map((c) => (
        <li key={c.id}>
          <Link to="/chat/$threadId" params={{ threadId: c.id }} className="flex items-center gap-3 rounded-xl bg-card/70 px-4 py-3 text-sm hover:bg-card">
            <MessageCircle className="size-4 text-deep" />
            <span className="flex-1 truncate font-semibold text-navy">{c.title}</span>
            <span className="text-xs text-graphite">{new Date(c.updated_at).toLocaleDateString()}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OwnerMedia({ empty }: { empty: ReactNode }) {
  const { user } = useAccount();
  const [rows, setRows] = useState<{ id: string; kind: string; url?: string; transcription: string | null }[] | null>(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("uploaded_files").select("id,kind,storage_path,transcription").eq("user_id", user.id).order("created_at", { ascending: false }).limit(40);
      const out = await Promise.all((data ?? []).map(async (f) => ({ ...f, url: (await supabase.storage.from("chat-media").createSignedUrl(f.storage_path, 3600)).data?.signedUrl })));
      setRows(out);
    })();
  }, [user]);
  if (!rows) return <p role="status" className="text-sm text-graphite">Loading media…</p>;
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="flex flex-wrap gap-3">
      {rows.map((f) => f.kind === "photo" ? <img key={f.id} src={f.url} alt="Uploaded photo" className="size-24 rounded-xl border border-ice-lum/60 object-cover" />
        : f.kind === "video" ? <video key={f.id} src={f.url} controls className="h-24 rounded-xl border border-ice-lum/60" />
        : <div key={f.id} className="glass max-w-xs rounded-xl p-3 text-xs"><p className="flex items-center gap-1 font-semibold text-deep"><Mic className="size-3" /> Voice message</p>{f.url && <audio src={f.url} controls className="mt-1 h-8 w-full" />}{f.transcription && <p className="mt-1 text-graphite">{f.transcription}</p>}</div>)}
    </div>
  );
}
