import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldLabel, LanguageIndicator } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

const BARS = [
  6, 10, 16, 22, 14, 9, 18, 26, 30, 20, 12, 8, 14, 24, 28, 18, 10, 7, 13, 21, 27, 19, 11, 8, 15, 23,
  29, 17, 9, 6, 12, 20, 25, 16, 10, 7,
];

/**
 * Playable voice note component (demo playback simulated with a timer).
 * Swap the timer for a real <audio> element when audio storage is connected.
 */
export function VoiceNote({
  durationSeconds = 18,
  language,
  transcript,
  compact = false,
}: {
  durationSeconds?: number;
  language: string;
  transcript?: string;
  compact?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.2 >= durationSeconds) {
          setPlaying(false);
          return 0;
        }
        return e + 0.2;
      });
    }, 200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, durationSeconds]);

  const progress = elapsed / durationSeconds;
  const clock = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="glass-solid rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>Voice note</FieldLabel>
        <LanguageIndicator from={`Detected: ${language}`} />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause voice note" : "Play voice note"}
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>

        <div
          className="flex h-10 flex-1 items-center gap-[2px]"
          role="progressbar"
          aria-label="Voice note playback"
          aria-valuenow={Math.round(progress * 100)}
        >
          {BARS.map((h, i) => (
            <span
              key={i}
              className={cn(
                "w-full rounded-full transition-colors duration-150",
                i / BARS.length <= progress ? "bg-deep" : "bg-silver-strong/70",
              )}
              style={{ height: `${h + 6}px` }}
            />
          ))}
        </div>

        <span className="w-20 shrink-0 text-right font-mono text-xs text-graphite">
          {clock(elapsed)} / {clock(durationSeconds)}
        </span>
      </div>

      {transcript && !compact ? (
        <div className="mt-3 rounded-lg border border-silver bg-silver-white/80 p-3">
          <FieldLabel>Original transcript</FieldLabel>
          <p className="mt-1.5 text-sm leading-relaxed text-navy">{transcript}</p>
        </div>
      ) : null}
    </div>
  );
}
