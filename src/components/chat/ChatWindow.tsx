import { useEffect, useRef, useState } from "react";
import { ArrowUp, FileVideo, Globe, ImageIcon, Mic, ShieldCheck, Square, Trash2, Video, X } from "lucide-react";
import { AssistantAvatar } from "@/components/chat/AssistantAvatar";
import { ChatDecor } from "@/components/chat/ChatDecor";
import { OPENING_MESSAGE, UPLOAD_LIMITS, formatBytes, type AttachmentMeta } from "@/lib/chat-config";
import { cn } from "@/lib/utils";

type Pending = AttachmentMeta & { id: string; url: string };
type Msg = { id: string; role: string; content: string; attachments: AttachmentMeta[]; created_at: string };

/** Frontend-only chat. Messages live in memory until the assistant backend is connected. */
export function ChatWindow(_props: { threadId: string | null }) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function addFiles(files: FileList | null, kind: "photo" | "video") {
    if (!files) return;
    setError(null);
    const lim = UPLOAD_LIMITS[kind];
    const existing = pending.filter((p) => p.kind === kind).length;
    const next: Pending[] = [];
    for (const f of Array.from(files)) {
      if (!(lim.accept as readonly string[]).includes(f.type)) { setError(`${f.name}: please use ${lim.extensions}.`); continue; }
      if (f.size > lim.maxBytes) { setError(`${f.name} is larger than ${formatBytes(lim.maxBytes)}.`); continue; }
      if (existing + next.length >= lim.maxCount) { setError(`You can add up to ${lim.maxCount} ${kind === "photo" ? "photos" : "video"}.`); break; }
      next.push({ id: crypto.randomUUID(), kind, name: f.name, size: f.size, url: URL.createObjectURL(f) });
    }
    setPending((p) => [...p, ...next]);
  }

  function send(extra?: Pending) {
    const atts = extra ? [...pending, extra] : pending;
    const content = text.trim();
    if (!content && atts.length === 0) return;
    const meta: AttachmentMeta[] = atts.map(({ kind, name, size, durationSec }) => ({ kind, name, size, durationSec }));
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content, attachments: meta, created_at: new Date().toISOString() }]);
    setText("");
    setPending([]);
    setError(null);
  }

  const hasUserMessages = messages.length > 0;

  return (
    <div className="chat-frame relative flex h-[min(78vh,760px)] min-h-[520px] flex-col overflow-hidden rounded-3xl">
      <ChatDecor />
      <header className="relative flex items-center gap-3 border-b border-ice-lum/40 px-5 py-3.5">
        <AssistantAvatar className="size-10" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">Love Vet AI</p>
          <p className="truncate text-xs font-medium text-deep/80">AI Veterinary Appointment Assistant</p>
        </div>
        <div className="ml-auto hidden items-center gap-4 text-xs font-medium text-graphite md:flex">
          <span className="inline-flex items-center gap-1.5"><Globe className="size-3.5 text-deep" strokeWidth={1.6} /> Language detection is automatic</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-deep" strokeWidth={1.6} /> Automatic safety analysis</span>
        </div>
      </header>

      <div ref={listRef} className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <AssistantBubble text={OPENING_MESSAGE} />
          {messages.map((m) => (m.role === "user" ? <UserBubble key={m.id} m={m} /> : <AssistantBubble key={m.id} text={m.content} />))}
          {hasUserMessages && (
            <p role="status" className="mx-auto w-fit rounded-full border border-ice-lum/60 bg-card/70 px-4 py-1.5 text-center text-xs font-medium text-graphite">
              The assistant service is not connected yet — replies will appear here once it is.
            </p>
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
          {error && <p role="alert" className="mb-2 text-xs font-medium text-destructive">{error}</p>}
          <Composer
            text={text}
            setText={setText}
            taRef={taRef}
            onSend={() => send()}
            onVoice={(v) => send(v)}
            onPhoto={() => photoRef.current?.click()}
            onVideo={() => videoRef.current?.click()}
            disabled={false}
          />
          <p className="mt-2 text-center text-[0.68rem] font-medium text-graphite">
            Photos: {UPLOAD_LIMITS.photo.extensions} · up to {UPLOAD_LIMITS.photo.maxCount}, {formatBytes(UPLOAD_LIMITS.photo.maxBytes)} each · Video: {UPLOAD_LIMITS.video.extensions} · {UPLOAD_LIMITS.video.maxCount}, up to {formatBytes(UPLOAD_LIMITS.video.maxBytes)} · The assistant does not diagnose.
          </p>
          <input ref={photoRef} type="file" hidden multiple accept={UPLOAD_LIMITS.photo.accept.join(",")} onChange={(e) => { addFiles(e.target.files, "photo"); e.target.value = ""; }} />
          <input ref={videoRef} type="file" hidden accept={UPLOAD_LIMITS.video.accept.join(",")} onChange={(e) => { addFiles(e.target.files, "video"); e.target.value = ""; }} />
        </div>
      </div>
    </div>
  );
}

function AssistantBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <AssistantAvatar className="mt-5 size-9 shrink-0" />
      <div className="min-w-0 max-w-[85%]">
        <p className="mb-1 text-[0.7rem] font-bold tracking-[0.08em] text-deep uppercase">Love Vet AI</p>
        <div className="rounded-2xl rounded-tl-md border border-ice-lum/60 bg-card/80 px-4 py-3 text-[0.95rem] leading-relaxed whitespace-pre-line text-navy shadow-[0_8px_24px_-16px_rgb(109_74_255/0.5)] backdrop-blur">
          {text}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ m }: { m: Msg }) {
  return (
    <div className="ml-auto w-fit max-w-[85%] space-y-1.5">
      <p className="text-right text-[0.7rem] font-bold tracking-[0.08em] text-graphite uppercase">Client</p>
      {m.content && (
        <div className="rounded-2xl rounded-tr-md bg-[image:var(--gradient-primary)] px-4 py-2.5 text-[0.95rem] whitespace-pre-wrap text-primary-foreground shadow-[var(--glow-primary)]">
          {m.content}
        </div>
      )}
      {m.attachments?.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1.5">
          {m.attachments.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-ice-lum/60 bg-card/80 px-3 py-1 text-xs font-medium text-deep">
              {a.kind === "photo" ? <ImageIcon className="size-3.5" /> : a.kind === "video" ? <Video className="size-3.5" /> : <Mic className="size-3.5" />}
              {a.kind === "voice" ? `Voice message · ${a.durationSec ?? 0}s` : a.name}
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
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [secs, setSecs] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const chunks = useRef<Blob[]>([]);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      chunks.current = [];
      cancelled.current = false;
      r.ondataavailable = (e) => chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (!cancelled.current) {
          const blob = new Blob(chunks.current, { type: r.mimeType });
          props.onVoice({ id: crypto.randomUUID(), kind: "voice", name: "voice-message", size: blob.size, durationSec: secsRef.current, url: URL.createObjectURL(blob) });
        }
        setRec(null);
        setSecs(0);
        secsRef.current = 0;
      };
      r.start();
      setRec(r);
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
        <IconBtn label="Record voice message" onClick={start}><Mic className="size-[19px]" strokeWidth={1.6} /></IconBtn>
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
