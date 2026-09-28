import { useId } from "react";

/** Love Vet AI Assistant — a friendly dog + cat face in one mark. Represents the AI assistant, not a veterinarian. */
export function AssistantAvatar({ className = "size-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Love Vet AI Assistant">
      <defs>
        <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCD1FF" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#bg${id})`} stroke="#8068FF" strokeOpacity=".55" strokeWidth="1" />
      {/* cat (behind, right) */}
      <path d="M21.5 15.5 23 8.5l4.2 4.6M32.5 15.5 31 8.5l-4.2 4.6" fill="#EEE8FF" stroke="#6D4AFF" strokeWidth="1.3" strokeLinejoin="round" />
      <ellipse cx="27" cy="20" rx="7.2" ry="6.6" fill="#F7F4FF" stroke="#6D4AFF" strokeWidth="1.3" />
      <circle cx="24.6" cy="19.3" r=".95" fill="#34275A" />
      <circle cx="29.4" cy="19.3" r=".95" fill="#34275A" />
      <path d="M26.3 21.9h1.4l-.7.8Z" fill="#E0566F" />
      <path d="M31 22.3l3.3-.5M31 23.3l3.2.4" stroke="#8068FF" strokeWidth=".6" strokeLinecap="round" />
      {/* dog (front, left) */}
      <circle cx="14.5" cy="24" r="7.6" fill="#FFFFFF" stroke="#4B2FCF" strokeWidth="1.3" />
      <path d="M8.2 19.2c-2.4.4-3.3 4.8-1.8 7.6 1.1-.3 2-1.7 2.4-3.4M20.8 19.2c2.4.4 3.3 4.8 1.8 7.6-1.1-.3-2-1.7-2.4-3.4" fill="#C9B8FF" stroke="#4B2FCF" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="12" cy="23" r=".95" fill="#34275A" />
      <circle cx="17" cy="23" r=".95" fill="#34275A" />
      <ellipse cx="14.5" cy="26.2" rx="1.5" ry="1.05" fill="#34275A" />
      <path d="M13 27.8c.8.8 2.2.8 3 0" stroke="#34275A" strokeWidth=".8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
