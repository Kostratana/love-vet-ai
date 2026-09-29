const HEART = "M12 21.5C12 21.5 2.5 15.6 2.5 9.2A4.9 4.9 0 0 1 12 7a4.9 4.9 0 0 1 9.5 2.2C21.5 15.6 12 21.5 12 21.5Z";

const items: { kind: "hearts" | "bubble" | "spark"; left: string; top: string; size: number; delay: number; dur: number }[] = [
  { kind: "hearts", left: "8%", top: "70%", size: 44, delay: 0, dur: 26 },
  { kind: "bubble", left: "22%", top: "30%", size: 26, delay: 4, dur: 22 },
  { kind: "spark", left: "35%", top: "80%", size: 6, delay: 2, dur: 18 },
  { kind: "hearts", left: "78%", top: "25%", size: 36, delay: 7, dur: 30 },
  { kind: "bubble", left: "88%", top: "65%", size: 40, delay: 1, dur: 28 },
  { kind: "spark", left: "62%", top: "45%", size: 5, delay: 9, dur: 20 },
  { kind: "bubble", left: "50%", top: "85%", size: 18, delay: 12, dur: 24 },
  { kind: "spark", left: "14%", top: "18%", size: 4, delay: 5, dur: 16 },
];

/** Decorative, slow-floating hearts, bubbles and light particles — chat surface only. */
export function ChatDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="chat-float absolute"
          style={{ left: it.left, top: it.top, width: it.size, height: it.size, animationDelay: `-${it.delay}s`, animationDuration: `${it.dur}s` }}
        >
          {it.kind === "hearts" ? (
            <svg viewBox="0 0 36 26" className="size-full opacity-[0.26]" fill="none">
              <path d={HEART} transform="translate(0.5 0)" stroke="#8068FF" strokeWidth="1.6" />
              <path d={HEART} transform="translate(10.5 0)" stroke="#B7A8FF" strokeWidth="1.6" />
            </svg>
          ) : it.kind === "bubble" ? (
            <span className="block size-full rounded-full border border-white/70 bg-[radial-gradient(circle_at_30%_30%,rgb(255_255_255/0.8),rgb(236_180_220/0.28))] opacity-60" />
          ) : (
            <span className="block size-full rounded-full bg-white opacity-85 shadow-[0_0_10px_3px_rgb(183_168_255/0.6)]" />
          )}
        </span>
      ))}
    </div>
  );
}
