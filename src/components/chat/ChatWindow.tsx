import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, FileVideo, Globe, ImageIcon, Mic, ShieldCheck, Square, Trash2, Video, X } from "lucide-react";
import { AssistantAvatar } from "@/components/chat/AssistantAvatar";
import { ChatDecor } from "@/components/chat/ChatDecor";
import { RoutingCard } from "@/components/chat/CareActions";
import { ListenButton, RichText } from "@/components/chat/RichText";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account-store";
import { runTriage, type Triage } from "@/lib/care.functions";
import { indexCaseHistory, relatedPetHistory } from "@/lib/history.functions";
import { OPENING_MESSAGE, UPLOAD_LIMITS, formatBytes, type AttachmentMeta } from "@/lib/chat-config";
import { cn } from "@/lib/utils";
import { recordWav } from "@/lib/record-wav";

type Pending = AttachmentMeta & { id: string; url: string; file: Blob };
type Msg = { id: string; role: string; content: string; attachments: AttachmentMeta[]; created_at: string; images?: string[] };

const BUCKET = "chat-media";
const GUEST_VIDEO_MAX = 20 * 1024 * 1024;
const blobToDataUrl = (b: Blob) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(b); });

/** Chat with AI. Signed-in chats, media and triage are saved; guests chat in memory only. */
export function ChatWindow({ threadId }: { threadId: string | null }) {
  const acct = useAccount();
  const userId = acct.user?.id ?? null;
  const pets = acct.owner?.pets ?? [];
  const navigate = useNavigate();
  const doTriage = useServerFn(runTriage);
  const doIndex = useServerFn(indexCaseHistory);
  const doHistory = useServerFn(relatedPetHistory);
  const nearBottom = useRef(true);
  const [text, setText] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [convId, setConvId] = useState<string | null>(threadId);
  const [petId, setPetId] = useState<string | null>(null);
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [triage, setTriage] = useState<{ t: Triage; id: string | null } | null>(null);
  const [hideCard, setHideCard] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loadingThread, setLoadingThread] = useState(!!threadId);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Load a saved conversation.
  useEffect(() => {
    if (!threadId || acct.loading) return;
    if (!userId) { setLoadingThread(false); return; }
    let off = false;
    (async () => {
      const [{ data: conv }, { data: msgs }, { data: tri }, { data: intake }] = await Promise.all([
        supabase.from("conversations").select("*").eq("id", threadId).maybeSingle(),
        supabase.from("conversation_messages").select("*").eq("conversation_id", threadId).order("created_at"),
        supabase.from("triage_results").select("*").eq("conversation_id", threadId).order("created_at", { ascending: false }).limit(1),
        supabase.from("veterinary_intakes").select("id").eq("conversation_id", threadId).limit(1),
      ]);
      if (off) return;
      if (!conv) { setError("This conversation was not found."); setLoadingThread(false); return; }
      setPetId(conv.pet_id);
      setMessages((msgs ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content, attachments: (m.attachments as AttachmentMeta[]) ?? [], created_at: m.created_at })));
      const t = tri?.[0];
      if (t) setTriage({ id: t.id, t: { request_type: t.request_type, urgency: t.urgency as Triage["urgency"], suggested_destination: t.suggested_destination as Triage["suggested_destination"], symptoms: t.symptoms, short_summary: t.short_summary, confidence: t.confidence } });
      setIntakeId(intake?.[0]?.id ?? null);
      setLoadingThread(false);
    })();
    return () => { off = true; };
  }, [threadId, userId, acct.loading]);

  // Follow new content only when the reader is already near the bottom; never scroll the page itself.
  const lastLen = messages[messages.length - 1]?.content.length ?? 0;
  useEffect(() => {
    const el = listRef.current;
    if (el && nearBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages.length, lastLen, triage, status]);

  function addFiles(files: FileList | null, kind: "photo" | "video") {
    if (!files) return;
    setError(null);
    const lim = UPLOAD_LIMITS[kind];
    const existing = pending.filter((p) => p.kind === kind).length;
    const next: Pending[] = [];
    for (const f of Array.from(files)) {
      if (!(lim.accept as readonly string[]).includes(f.type)) { setError(`${f.name}: please use ${lim.extensions}.`); continue; }
      if (f.size > lim.maxBytes) { setError(`${f.name} is larger than ${formatBytes(lim.maxBytes)}.`); continue; }
      if (kind === "video" && !userId && f.size > GUEST_VIDEO_MAX) { setError(`${f.name}: guest videos can be up to ${formatBytes(GUEST_VIDEO_MAX)}. Sign in for larger videos.`); continue; }
      if (existing + next.length >= lim.maxCount) { setError(`You can add up to ${lim.maxCount} ${kind === "photo" ? "photos" : "video"}.`); break; }
      next.push({ id: crypto.randomUUID(), kind, name: f.name, size: f.size, mime: f.type, url: URL.createObjectURL(f), file: f });
    }
    setPending((p) => [...p, ...next]);
  }

  async function ensureConversation(firstText: string) {
    if (!userId) return null;
    if (convId) return convId;
    const { data, error: e } = await supabase.from("conversations").insert({ user_id: userId, pet_id: petId, title: (firstText || "Conversation").slice(0, 60) }).select("id").single();
    if (e || !data) throw new Error("Could not save the conversation.");
    setConvId(data.id);
    return data.id;
  }

  async function uploadAll(atts: Pending[], cid: string | null): Promise<{ meta: AttachmentMeta[]; images: string[] }> {
    const meta: AttachmentMeta[] = [];
    const images: string[] = [];
    const guest: [AttachmentMeta, Blob][] = [];
    for (const a of atts) {
      const m: AttachmentMeta = { kind: a.kind, name: a.name, size: a.size, durationSec: a.durationSec, mime: a.mime, transcription: a.transcription };
      if (userId && cid) {
        const path = `${userId}/${cid}/${crypto.randomUUID()}-${a.name.replace(/[^\w.-]/g, "_")}`;
        const { error: ue } = await supabase.storage.from(BUCKET).upload(path, a.file, { contentType: a.mime ?? "application/octet-stream" });
        if (ue) throw new Error(`Upload failed for ${a.name}. Please try again.`);
        const { data: row } = await supabase.from("uploaded_files").insert({ user_id: userId, conversation_id: cid, pet_id: petId, intake_id: intakeId, kind: a.kind, mime_type: a.mime ?? "application/octet-stream", size_bytes: a.size, storage_path: path, transcription: a.transcription ?? null }).select("id").single();
        m.path = path;
        m.fileId = row?.id;
        if (a.kind === "photo") {
          const { data: s } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
          if (s?.signedUrl) images.push(s.signedUrl);
        }
      } else if (a.kind === "photo") {
        images.push(await blobToDataUrl(a.file));
      }
      meta.push(m);
      if (!userId && (a.kind === "photo" || a.kind === "video")) guest.push([m, a.file]);
    }
    // Analyze stored photos (observations + OCR) and videos (observations) before the assistant replies.
    const toAnalyze = meta.filter((m) => m.fileId && (m.kind === "photo" || m.kind === "video"));
    if (toAnalyze.length) {
      setStatus(toAnalyze.some((m) => m.kind === "video") ? "Analyzing your video and photos…" : "Reading your photos…");
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      await Promise.all(toAnalyze.map(async (m) => {
        try {
          const r = await fetch("/api/analyze-media", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ fileId: m.fileId }) });
          const j = (await r.json().catch(() => ({}))) as { analysis?: string; ocr_text?: string | null };
          if (!r.ok || !j.analysis) { m.analysisStatus = "failed"; return; }
          m.analysis = j.analysis; m.ocrText = j.ocr_text ?? undefined; m.analysisStatus = "done";
        } catch { m.analysisStatus = "failed"; }
      }));
    }
    // Guests: temporary in-memory analysis (nothing stored); observations stay in this conversation's context.
    if (guest.length) {
      setStatus(guest.some(([m]) => m.kind === "video") ? "Analyzing your video (not saved)…" : "Reading your photos (not saved)…");
      await Promise.all(guest.map(async ([m, file]) => {
        try {
          const fd = new FormData();
          fd.append("file", new File([file], m.name, { type: m.mime ?? "" }));
          const r = await fetch("/api/analyze-guest-media", { method: "POST", body: fd });
          const j = (await r.json().catch(() => ({}))) as { analysis?: string; ocr_text?: string | null };
          if (!r.ok || !j.analysis) { m.analysisStatus = "failed"; return; }
          m.analysis = j.analysis; m.ocrText = j.ocr_text ?? undefined; m.analysisStatus = "done";
        } catch { m.analysisStatus = "failed"; }
      }));
    }
    return { meta, images };
  }

  const [busy, setBusy] = useState(false);
  const [failedVoice, setFailedVoice] = useState<Pending | null>(null);

  async function transcribe(v: Pending): Promise<string> {
    setStatus("Transcribing your voice message…");
    const fd = new FormData();
    fd.append("file", new File([v.file], v.name || "voice-message.wav", { type: v.mime || "audio/wav" }));
    const res = await fetch("/api/transcribe", { method: "POST", body: fd });
    const j = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
    if (!res.ok || !j.text) throw new Error(j.error ?? "The voice message could not be transcribed.");
    return j.text;
  }

  async function send(extra?: Pending) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      let voice = extra;
      if (voice) {
        try { voice = { ...voice, transcription: await transcribe(voice) }; setFailedVoice(null); }
        catch (e) {
          // Never send an empty/failed voice event to the assistant; keep the recording for retry.
          setFailedVoice(voice);
          setError(`Voice transcription failed. ${e instanceof Error ? e.message : ""} You can retry or type your message instead.`);
          setBusy(false); setStatus(null); return;
        }
      }
      const atts = voice ? [...pending, voice] : pending;
      const typed = text.trim();
      const content = [typed, voice?.transcription ?? ""].filter(Boolean).join("\n\n");
      if (!content && atts.length === 0) { setBusy(false); setStatus(null); return; }
      setStatus(atts.length ? "Uploading…" : null);
      const cid = await ensureConversation(content);
      const { meta, images } = await uploadAll(atts, cid);
      setStatus(null);
      if (meta.some((m) => m.analysisStatus === "failed")) setError(userId ? "Automated analysis was unavailable for some media. The files are saved for clinic staff to review." : "Automated analysis was unavailable for some media.");
      const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content, attachments: meta, created_at: new Date().toISOString(), images };
      if (cid && userId) await supabase.from("conversation_messages").insert({ id: userMsg.id, conversation_id: cid, user_id: userId, role: "user", content, attachments: meta });
      const history = [...messages, userMsg];
      nearBottom.current = true;
      setMessages(history);
      if (!meta.some((m) => m.analysisStatus === "failed")) setError(null);
      setText("");
      setPending([]);
      setHideCard(false);

      const attNote = (m: Msg, earlier: boolean) => {
        const parts: string[] = [];
        if (earlier && m.attachments.some((a) => a.analysisStatus === "done")) parts.push("Media below was attached and SUCCESSFULLY analyzed earlier in this conversation. You did see it; these stored observations remain valid context. Never claim it was unavailable.");
        if (m.attachments.some((a) => a.kind === "voice")) parts.push("The owner's text above is a transcribed voice message.");
        m.attachments.forEach((a, i) => {
          if (a.kind === "photo") {
            if (a.analysis) parts.push(`Photo ${i + 1} (${a.name}) observations (automated, not a diagnosis): ${a.analysis}`);
            else if (a.analysisStatus === "failed") parts.push(`Photo ${i + 1} (${a.name}): automated analysis failed; do not describe it.`);
            if (a.ocrText) parts.push(`Photo ${i + 1} text read from image: ${a.ocrText}`);
          } else if (a.kind === "video") {
            if (a.analysisStatus === "done" && a.analysis) parts.push(`Video observations (automated, not a diagnosis):\n${a.analysis}`);
            else parts.push(a.path ? "A video was saved for clinic staff; automated video analysis was unavailable, so you have not seen it." : "A video was attached but automated analysis failed; you have not seen it.");
          }
        });
        return parts.length ? `\n\n[Case context]\n${parts.join("\n")}` : "";
      };
      const o = acct.owner;
      const pet = pets.find((p) => p.id === petId);
      const known = [
        o ? `[Owner account] Signed in. First name: ${o.firstName || "unknown"}; last name: ${o.lastName || "unknown"}; phone: ${o.phone ? "on file" : "missing"}; email: ${o.email ? "on file" : "missing"}; area: ${o.location || "unknown"}.` : "[Owner account] Guest (not signed in).",
        pet ? `[Pet profile — the selected pet for THIS case; media and history belong to it only] Name: ${pet.name}; species: ${pet.species}; breed: ${pet.breed || "unknown"}; age: ${pet.age || "unknown"}; sex: ${pet.sex || "unknown"}.` : "",
      ].filter(Boolean).join("\n");
      // RAG 3: private history for THIS pet only (server-side, RLS-scoped). Continuity, never a diagnosis.
      let histBlock = "";
      if (userId && petId && content.length > 1) {
        const h = await doHistory({ data: { petId, query: content.slice(0, 2000), excludeConversationId: cid } }).catch(() => null);
        if (h?.cases.length) histBlock = `\n\n[Retrieved patient history — this pet only; related previous cases, NOT a diagnosis and not proof it is the same problem]\n${h.cases.map((c, i) => `H${i + 1}. ${c.date.slice(0, 10)}${c.vet ? ` · ${c.vet}` : ""} · media: ${c.media.photo} photo, ${c.media.video} video, ${c.media.voice} voice\n${c.snippets.map((s) => s.text).join("\n")}`).join("\n\n")}`;
      }
      const payload = history.map((m, idx) => ({
        role: m.role as "user" | "assistant",
        content: (idx === 0 && m.role === "user" ? `${known}\n\n` : "") + (m.content || "(attachment only)") + (m.role === "user" ? attNote(m, m.id !== userMsg.id) : "") + (m.id === userMsg.id ? histBlock : ""),
        ...(m.id === userMsg.id && images.length ? { images } : {}),
      }));
      const aid = crypto.randomUUID();
      setMessages((m) => [...m, { id: aid, role: "assistant", content: "", attachments: [], created_at: new Date().toISOString() }]);
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: payload }) });
      if (!res.ok || !res.body) {
        throw new Error(res.status === 429 ? "The assistant is busy right now. Please try again in a moment." : res.status === 402 ? "The assistant is temporarily unavailable (AI credits exhausted)." : "The assistant could not reply. Please try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => m.map((x) => (x.id === aid ? { ...x, content: acc } : x)));
      }
      if (!acc.trim()) throw new Error("The assistant returned no reply. Please try again.");
      if (cid && userId) {
        await supabase.from("conversation_messages").insert({ id: aid, conversation_id: cid, user_id: userId, role: "assistant", content: acc, attachments: [] });
        await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", cid);
      }
      const full = [...history, { id: aid, role: "assistant", content: acc, attachments: [], created_at: "" }];
      if (!threadId && cid) navigate({ to: "/chat/$threadId", params: { threadId: cid }, replace: true });
      void triageAfter(full, cid);
    } catch (e) {
      setMessages((m) => m.filter((x) => x.role !== "assistant" || x.content));
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  async function triageAfter(history: Msg[], cid: string | null) {
    if (history.filter((m) => m.role === "user").length < 1) return;
    const r = await doTriage({ data: { messages: history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content || "(attachment)" })) } }).catch(() => null);
    if (!r?.triage) return;
    const t = r.triage;
    let tid: string | null = null;
    if (userId && cid) {
      let iid = intakeId;
      if (!iid) {
        const { data } = await supabase.from("veterinary_intakes").insert({ user_id: userId, conversation_id: cid, pet_id: petId, summary: t.short_summary, symptoms: t.symptoms }).select("id").single();
        iid = data?.id ?? null;
        setIntakeId(iid);
        if (iid) await supabase.from("uploaded_files").update({ intake_id: iid }).eq("conversation_id", cid).is("intake_id", null);
      } else {
        await supabase.from("veterinary_intakes").update({ summary: t.short_summary, symptoms: t.symptoms, pet_id: petId, updated_at: new Date().toISOString() }).eq("id", iid);
      }
      const { data } = await supabase.from("triage_results").insert({ user_id: userId, conversation_id: cid, intake_id: iid, ...t }).select("id").single();
      tid = data?.id ?? null;
    }
    setTriage({ t, id: tid });
    if (userId && cid && petId) void doIndex({ data: { conversationId: cid } }).catch(() => null);
  }

  async function choosePet(id: string) {
    const v = id || null;
    setPetId(v);
    if (convId) await supabase.from("conversations").update({ pet_id: v }).eq("id", convId);
    if (intakeId) await supabase.from("veterinary_intakes").update({ pet_id: v }).eq("id", intakeId);
  }

  const lastIsEmptyAssistant = busy && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content;

  return (
    <div className="chat-frame relative flex h-[calc(100dvh-8.5rem)] max-h-[820px] min-h-[460px] w-full min-w-0 flex-col overflow-hidden rounded-3xl">
      <ChatDecor />
      <header className="relative flex items-center gap-3 border-b border-ice-lum/40 px-5 py-3.5">
        <AssistantAvatar className="size-10" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">Love Vet AI</p>
          <p className="truncate text-xs font-medium text-deep/80">AI Veterinary Appointment Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs font-medium text-graphite">
          {userId && pets.length > 0 && (
            <select aria-label="Which pet is this about?" value={petId ?? ""} onChange={(e) => void choosePet(e.target.value)} className="h-8 rounded-full border border-silver-strong/70 bg-card/80 px-3 text-xs font-semibold text-navy outline-none">
              <option value="">Which pet?</option>
              {pets.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}
            </select>
          )}
          <span className="hidden items-center gap-1.5 md:inline-flex"><Globe className="size-3.5 text-deep" strokeWidth={1.6} /> Language detection is automatic</span>
          <span className="hidden items-center gap-1.5 lg:inline-flex"><ShieldCheck className="size-3.5 text-deep" strokeWidth={1.6} /> Automatic safety analysis</span>
        </div>
      </header>

      <div ref={listRef} onScroll={(e) => { const el = e.currentTarget; nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120; }} className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain [overflow-anchor:none] px-3 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <AssistantBubble text={OPENING_MESSAGE} />
          {loadingThread && <p role="status" className="text-center text-xs text-graphite">Loading your conversation…</p>}
          {messages.map((m) => (m.role === "user" ? <UserBubble key={m.id} m={m} /> : m.content ? <AssistantBubble key={m.id} text={m.content} listen={!busy || m.id !== messages[messages.length - 1]?.id} /> : null))}
          {lastIsEmptyAssistant && (
            <p role="status" className="mx-auto w-fit rounded-full border border-ice-lum/60 bg-card/70 px-4 py-1.5 text-center text-xs font-medium text-graphite">
              Love Vet AI is thinking…
            </p>
          )}
          {triage && !hideCard && !busy && (
            <RoutingCard key={triage.id ?? JSON.stringify(triage.t)} triage={triage.t} onContinue={() => { setHideCard(true); taRef.current?.focus(); }}
              ctx={{ userId, conversationId: convId, intakeId, triageId: triage.id, petId, pets }} />
          )}
        </div>
      </div>

      <div className="relative border-t border-ice-lum/40 bg-card/30 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mx-auto max-w-3xl">
          {pending.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {pending.map((p) => (
                <div key={p.id} className="relative">
                  {p.kind === "photo" ? (
                    <img src={p.url} alt={p.name} className="size-16 rounded-xl border border-ice-lum/60 object-cover" />
                  ) : (
                    <div className="grid size-16 place-items-center rounded-xl border border-ice-lum/60 bg-card text-deep"><FileVideo className="size-5" /></div>
                  )}
                  <button
                    onClick={() => setPending((ps) => ps.filter((x) => x.id !== p.id))}
                    aria-label={`Remove ${p.name}`}
                    className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-deep text-primary-foreground"
                  ><X className="size-3" /></button>
                </div>
              ))}
            </div>
          )}
          {status && <p role="status" className="mb-2 text-xs font-medium text-deep">{status}</p>}
          {error && <p role="alert" className="mb-2 text-xs font-medium text-destructive">{error}</p>}
          {failedVoice && !busy && (
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <audio controls src={failedVoice.url} className="h-8" aria-label="Your recording" />
              <button type="button" onClick={() => void send(failedVoice)} className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground">Retry transcription</button>
              <button type="button" onClick={() => { setFailedVoice(null); setError(null); }} className="rounded-full px-3 py-1.5 font-semibold text-deep hover:bg-ice">Discard</button>
            </div>
          )}
          <Composer
            text={text}
            setText={setText}
            taRef={taRef}
            onSend={() => send()}
            onVoice={(v) => send(v)}
            onPhoto={() => photoRef.current?.click()}
            onVideo={() => videoRef.current?.click()}
            disabled={busy}
          />
          <p className="mt-2 text-center text-[0.68rem] font-medium text-graphite">
            Photos: {UPLOAD_LIMITS.photo.extensions} · up to {UPLOAD_LIMITS.photo.maxCount}, {formatBytes(UPLOAD_LIMITS.photo.maxBytes)} each · Video: {UPLOAD_LIMITS.video.extensions} · {UPLOAD_LIMITS.video.maxCount}, up to {formatBytes(UPLOAD_LIMITS.video.maxBytes)} · {userId ? "Saved to your account." : "Not saved — sign in to keep this chat."} · The assistant does not diagnose.
          </p>
          <input ref={photoRef} type="file" hidden multiple accept={UPLOAD_LIMITS.photo.accept.join(",")} onChange={(e) => { addFiles(e.target.files, "photo"); e.target.value = ""; }} />
          <input ref={videoRef} type="file" hidden accept={UPLOAD_LIMITS.video.accept.join(",")} onChange={(e) => { addFiles(e.target.files, "video"); e.target.value = ""; }} />
        </div>
      </div>
    </div>
  );
}

function AssistantBubble({ text, listen = false }: { text: string; listen?: boolean }) {
  return (
    <div className="flex gap-3">
      <AssistantAvatar className="mt-5 size-9 shrink-0" />
      <div className="min-w-0 max-w-[85%]">
        <p className="mb-1 text-[0.7rem] font-bold tracking-[0.08em] text-deep uppercase">Love Vet AI</p>
        <div className="rounded-2xl rounded-tl-md border border-[rgb(236_170_205/0.6)] bg-[linear-gradient(150deg,rgb(255_247_251/0.92),rgb(252_228_242/0.78)_55%,rgb(240_226_255/0.72))] px-4 py-3 text-[0.95rem] leading-relaxed text-navy shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_8px_24px_-16px_rgb(214_110_170/0.55)] backdrop-blur">
          <RichText text={text} />
        </div>
        {listen && <ListenButton text={text} />}
      </div>
    </div>
  );
}

function UserBubble({ m }: { m: Msg }) {
  return (
    <div className="ml-auto w-fit max-w-[85%] space-y-1.5">
      <p className="text-right text-[0.7rem] font-bold tracking-[0.08em] text-graphite uppercase">Client</p>
      {m.content && (
        <div className="rounded-2xl rounded-tr-md border border-primary/35 bg-[linear-gradient(150deg,rgb(238_232_255/0.95),rgb(214_202_255/0.8))] px-4 py-2.5 text-[0.95rem] whitespace-pre-wrap text-navy shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_8px_24px_-14px_rgb(109_74_255/0.6)] backdrop-blur">
          {m.content}
        </div>
      )}
      {m.attachments?.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1.5">
          {m.attachments.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/80 px-3 py-1 text-xs font-medium text-deep">
              {a.kind === "photo" ? <ImageIcon className="size-3.5" /> : a.kind === "video" ? <Video className="size-3.5" /> : <Mic className="size-3.5" />}
              {a.kind === "voice" ? `Voice message · ${a.durationSec ?? 0}s · transcribed` : `${a.name}${a.analysisStatus === "done" ? " · analyzed" : a.analysisStatus === "failed" ? " · analysis unavailable, saved for staff" : !a.path && a.analysisStatus === "done" ? "" : ""}${!a.path && a.kind !== "voice" ? " · not saved" : ""}${a.ocrText ? " · text read" : ""}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, children, className }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn("grid size-10 shrink-0 place-items-center rounded-full text-graphite transition-all duration-200 hover:bg-ice hover:text-deep", className)}
    >
      {children}
    </button>
  );
}

function Composer(props: {
  text: string;
  setText: (v: string) => void;
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  onSend: () => void;
  onVoice: (p: Pending) => void;
  onPhoto: () => void;
  onVideo: () => void;
  disabled: boolean;
}) {
  const [rec, setRec] = useState<{ stop: () => void } | null>(null);
  const [secs, setSecs] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const cancelled = useRef(false);
  const secsRef = useRef(0);

  useEffect(() => {
    if (!rec) return;
    const t = setInterval(() => setSecs((s) => { secsRef.current = s + 1; return s + 1; }), 1000);
    return () => clearInterval(t);
  }, [rec]);

  async function start() {
    setMicError(null);
    try {
      const r = await recordWav();
      cancelled.current = false;
      setRec({
        stop: () => {
          const dur = secsRef.current;
          setRec(null); setSecs(0); secsRef.current = 0;
          void r.stop().then((file) => {
            if (cancelled.current) return;
            props.onVoice({ id: crypto.randomUUID(), kind: "voice", name: "voice-message.wav", mime: "audio/wav", size: file.size, durationSec: dur, url: URL.createObjectURL(file), file });
          }).catch((e) => setMicError(e instanceof Error ? e.message : "The recording could not be read. Please record again."));
        },
      });
    } catch {
      setMicError("Microphone access is needed to record a voice message.");
    }
  }

  const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  if (rec) {
    return (
      <div className="flex items-center gap-3 rounded-[1.6rem] border border-ice-lum bg-card/90 p-2 pl-5 shadow-[var(--glow-silver-blue)]">
        <span className="size-2.5 animate-pulse rounded-full bg-destructive" aria-hidden />
        <span className="text-sm font-semibold text-navy tabular-nums" aria-live="polite">Recording {mmss}</span>
        <IconBtn label="Cancel recording" className="ml-auto" onClick={() => { cancelled.current = true; rec.stop(); }}><Trash2 className="size-[18px]" strokeWidth={1.6} /></IconBtn>
        <button
          type="button"
          onClick={() => rec.stop()}
          aria-label="Stop and send voice message"
          className="flex h-10 items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-4 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)]"
        >
          <Square className="size-3.5 fill-current" /> Send
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end gap-1 rounded-[1.6rem] border border-silver-strong/70 bg-card/85 p-1.5 pl-4 shadow-[var(--shadow-glass)] transition-shadow focus-within:border-ice-lum focus-within:shadow-[var(--glow-silver-blue)]">
        <textarea
          ref={props.taRef}
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); props.onSend(); } }}
          placeholder="Tell me what's happening with your pet..."
          aria-label="Message"
          rows={1}
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-[0.95rem] text-navy outline-none placeholder:text-graphite/80"
        />
        <IconBtn label="Record voice message" onClick={() => { if (!props.disabled) void start(); }}><Mic className="size-[19px]" strokeWidth={1.6} /></IconBtn>
        <IconBtn label="Add photos" onClick={props.onPhoto}><ImageIcon className="size-[19px]" strokeWidth={1.6} /></IconBtn>
        <IconBtn label="Add a short video" onClick={props.onVideo}><Video className="size-[19px]" strokeWidth={1.6} /></IconBtn>
        <button
          type="button"
          onClick={props.onSend}
          disabled={props.disabled}
          aria-label="Send message"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <ArrowUp className="size-[18px]" />
        </button>
      </div>
      {micError && <p role="alert" className="mt-2 text-xs text-destructive">{micError}</p>}
    </>
  );
}
