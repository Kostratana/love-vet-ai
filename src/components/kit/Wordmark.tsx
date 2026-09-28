import { Link } from "@tanstack/react-router";
import { useId } from "react";

const HEART = "M12 21.5C12 21.5 2.5 15.6 2.5 9.2A4.9 4.9 0 0 1 12 7a4.9 4.9 0 0 1 9.5 2.2C21.5 15.6 12 21.5 12 21.5Z";

/**
 * Two interlocking hearts — owner (violet) and animal (red).
 * This is the ONLY heart symbol in the product.
 */
export function HeartsMark({ className = "size-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 36 26" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={`v${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8068FF" />
          <stop offset="1" stopColor="#4B2FCF" />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect width="36" height="26" fill="white" />
          {/* gap where the red heart passes over the violet one */}
          <path d={HEART} transform="translate(10.5 0)" stroke="black" strokeWidth="5" />
        </mask>
      </defs>
      <path d={HEART} transform="translate(0.5 0)" stroke={`url(#v${id})`} strokeWidth="2.4" strokeLinejoin="round" mask={`url(#m${id})`} />
      <path d={HEART} transform="translate(10.5 0)" stroke="#D92D3A" strokeWidth="2.4" strokeLinejoin="round" />
      {/* re-draw violet over red on the lower crossing for the interlock */}
      <path d={HEART} transform="translate(0.5 0)" stroke={`url(#v${id})`} strokeWidth="2.4" strokeLinejoin="round" clipPath="inset(55% 0 0 0)" style={{ clipPath: "inset(55% 0 0 0)" }} />
    </svg>
  );
}

export function Wordmark({ compact = false, to = "/" }: { compact?: boolean; to?: "/" | "/workspace" }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5" aria-label="Love Vet AI home">
      <span className="relative grid place-items-center">
        <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-ice-lum/40 blur-md transition-opacity group-hover:opacity-100" />
        <HeartsMark className="h-7 w-10" />
      </span>
      {!compact && (
        <span className="text-[1.02rem] font-bold tracking-[-0.02em] text-navy">
          Love Vet <span className="text-deep">AI</span>
        </span>
      )}
    </Link>
  );
}
