import { Link } from "@tanstack/react-router";
import { useId } from "react";

const HEART = "M12 21.5C12 21.5 2.5 15.6 2.5 9.2A4.9 4.9 0 0 1 12 7a4.9 4.9 0 0 1 9.5 2.2C21.5 15.6 12 21.5 12 21.5Z";

/**
 * Two interlocking hearts — owner (violet/silver) and animal (warm red).
 * Animated: light travels along the contours, strokes softly dissolve and restore.
 * `quiet` renders a static version (footer, tiny sizes).
 */
export function HeartsMark({ className = "size-9", quiet = false }: { className?: string; quiet?: boolean }) {
  const id = useId().replace(/:/g, "");
  const anim = !quiet;
  return (
    <svg viewBox="0 0 36 26" className={className} aria-hidden fill="none" overflow="visible">
      <defs>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8068FF" />
          <stop offset="0.55" stopColor="#6D4AFF" />
          <stop offset="1" stopColor="#4B2FCF" />
        </linearGradient>
        <linearGradient id={`r${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EC4A6A" />
          <stop offset="1" stopColor="#C8243A" />
        </linearGradient>
        <radialGradient id={`g${id}`}>
          <stop offset="0" stopColor="#C9B8FF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C9B8FF" stopOpacity="0" />
        </radialGradient>
        <mask id={`m${id}`}>
          <rect width="36" height="26" fill="white" />
          <path d={HEART} transform="translate(10.5 0)" stroke="black" strokeWidth="5" />
        </mask>
      </defs>
      {anim && <circle className="hearts-core" cx="17.5" cy="13" r="5" fill={`url(#g${id})`} />}
      <g className={anim ? "heart-breathe" : undefined}>
        <path d={HEART} transform="translate(0.5 0)" stroke={`url(#v${id})`} strokeWidth="2.4" strokeLinejoin="round" mask={`url(#m${id})`} />
      </g>
      <g className={anim ? "heart-breathe heart-breathe-late" : undefined}>
        <path d={HEART} transform="translate(10.5 0)" stroke={`url(#r${id})`} strokeWidth="2.4" strokeLinejoin="round" />
      </g>
      <g className={anim ? "heart-breathe" : undefined}>
        <path d={HEART} transform="translate(0.5 0)" stroke={`url(#v${id})`} strokeWidth="2.4" strokeLinejoin="round" style={{ clipPath: "inset(55% 0 0 0)" }} />
      </g>
      {anim && (
        <>
          <path className="heart-light" pathLength={100} d={HEART} transform="translate(0.5 0)" stroke="#F4F0FF" strokeWidth="1.3" strokeLinecap="round" />
          <path className="heart-light heart-light-late" pathLength={100} d={HEART} transform="translate(10.5 0)" stroke="#FFE3EA" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Wordmark({ compact = false, quiet = false }: { compact?: boolean; quiet?: boolean }) {
  return (
    <Link to="/" className="group inline-flex shrink-0 items-center gap-2.5 rounded-full" aria-label="Love Vet AI home">
      <span className="relative grid place-items-center">
        {!quiet && <span aria-hidden className="heart-glow absolute inset-0 -z-10 rounded-full bg-ice-lum/50 blur-md" />}
        <HeartsMark className="h-7 w-10" quiet={quiet} />
      </span>
      {!compact && (
        <span className={`${quiet ? "text-deep" : "wordmark-light"} text-[1.02rem] font-extrabold tracking-[0.06em] uppercase`}>
          Love Vet AI
        </span>
      )}
    </Link>
  );
}
