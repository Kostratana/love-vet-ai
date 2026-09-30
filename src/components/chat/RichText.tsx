import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, Pause, Play, RotateCcw, Volume2 } from "lucide-react";

/** Inline markdown → React nodes (bold, italic, code). Never injects HTML. */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g;
  let last = 0, i = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;
    if (t.startsWith("**") || t.startsWith("__")) out.push(<strong key={k} className="font-bold">{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k} className="rounded bg-card/70 px-1 text-[0.9em]">{t.slice(1, -1)}</code>);
    else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index! + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Safe, minimal markdown: paragraphs, headings, bullet and numbered lists, inline emphasis. */
export function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(<Tag key={`l${blocks.length}`} className={list.ordered ? "ml-5 list-decimal space-y-0.5" : "ml-5 list-disc space-y-0.5"}>{list.items.map((it, j) => <li key={j}>{inline(it, `li${blocks.length}-${j}`)}</li>)}</Tag>);
    list = null;
  };
  text.split("\n").forEach((raw, idx) => {
    const line = raw.trimEnd();
    const b = /^\s*[-*•]\s+(.*)$/.exec(line);
    const n = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (b || n) {
      const ordered = !!n;
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((b ?? n)![1]!);
      return;
    }
    flush();
    if (!line.trim()) return;
    const h = /^#{1,6}\s+(.*)$/.exec(line);
    if (h) blocks.push(<p key={`h${idx}`} className="font-bold">{inline(h[1]!, `h${idx}`)}</p>);
    else blocks.push(<p key={`p${idx}`}>{inline(line, `p${idx}`)}</p>);
  });
  flush();
  return <div className="space-y-1.5">{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}

/** User-initiated read-aloud. Fetches audio once, then play / pause / replay locally. */
export function ListenButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused" | "ended" | "error">("idle");
  const audio = useRef<HTMLAudioElement | null>(null);
  const url = useRef<string | null>(null);
  useEffect(() => () => { audio.current?.pause(); if (url.current) URL.revokeObjectURL(url.current); }, []);

  async function click() {
    if (state === "playing") { audio.current?.pause(); return; }
    if (audio.current && (state === "paused" || state === "ended")) { if (state === "ended") audio.current.currentTime = 0; void audio.current.play(); return; }
    setState("loading");
    try {
      const res = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text.slice(0, 4000) }) });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      if (!blob.size) throw new Error();
      url.current = URL.createObjectURL(blob);
      const a = new Audio(url.current);
      a.onplay = () => setState("playing");
      a.onpause = () => setState((s) => (s === "playing" ? "paused" : s));
      a.onended = () => setState("ended");
      a.onerror = () => setState("error");
      audio.current = a;
      await a.play();
    } catch { setState("error"); }
  }

  const label = { idle: "Listen", loading: "Preparing audio…", playing: "Pause", paused: "Resume", ended: "Replay", error: "Audio unavailable — try again" }[state];
  const Icon = state === "loading" ? Loader2 : state === "playing" ? Pause : state === "paused" ? Play : state === "ended" ? RotateCcw : Volume2;
  return (
    <button type="button" onClick={() => void click()} disabled={state === "loading"} aria-label={`${label}: read this reply aloud`}
      className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.7rem] font-semibold text-deep hover:bg-ice disabled:opacity-60">
      <Icon className={state === "loading" ? "size-3.5 animate-spin" : "size-3.5"} /> {label}
    </button>
  );
}
