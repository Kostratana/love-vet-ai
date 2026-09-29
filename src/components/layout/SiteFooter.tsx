import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";

const ext = "font-semibold text-primary underline-offset-4 transition-[filter,color] duration-200 hover:text-deep hover:underline hover:[filter:drop-shadow(0_0_6px_rgb(128_104_255/0.55))]";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className="glass page-enter fixed right-4 bottom-4 z-40 grid size-10 place-items-center rounded-full text-deep transition-shadow hover:shadow-[var(--glow-silver-blue)]"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ice-lum/40 px-6 py-10 text-center">
      <div className="flex justify-center"><Wordmark quiet /></div>
      <div className="mt-4 space-y-1 text-sm text-graphite">
        <p className="font-bold text-deep">Svetlana Rumyantseva</p>
        <p className="text-primary/75">AI Engineer · Data Scientist</p>
        <p><a className={ext} href="https://www.goldendragonai.com/" target="_blank" rel="noopener noreferrer">Golden Dragon AI Studio</a></p>
        <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
          <a className={ext} href="mailto:srumyantseva7@gmail.com" target="_blank" rel="noopener noreferrer">srumyantseva7@gmail.com</a>
          <a className={ext} href="https://github.com/Kostratana" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className={ext} href="https://www.linkedin.com/in/svetlana-rumyantseva-ai" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </p>
        <p className="pt-3 text-xs text-deep/80">Created for the Contra × Lovable Challenge 2026</p>
      </div>
      <BackToTop />
    </footer>
  );
}
