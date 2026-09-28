import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/kit/Wordmark";

const ext = "font-medium text-deep hover:underline";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-silver/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-sm text-xs leading-relaxed text-graphite">
            AI-powered veterinary appointment coordination. Love Vet AI does not diagnose — final
            assessment and treatment decisions belong to a veterinary professional.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm text-graphite">
          <Link to="/" className="hover:text-deep">Home</Link>
          <Link to="/chat" className="hover:text-deep">Chat with AI</Link>
          <Link to="/owner" className="hover:text-deep">Pet Owner Account</Link>
          <Link to="/professionals" className="hover:text-deep">Professionals & Clinics</Link>
          <Link to="/workspace" className="hover:text-deep">Clinic Staff Workspace</Link>
        </nav>
        <div className="space-y-1.5 text-sm text-graphite">
          <p className="font-bold text-navy">Svetlana Rumyantseva</p>
          <p>AI Engineer · Data Scientist</p>
          <p>Golden Dragon AI</p>
          <p><a className={ext} href="mailto:srumyantseva7@gmail.com">srumyantseva7@gmail.com</a></p>
          <p><a className={ext} href="https://www.goldendragonai.com" target="_blank" rel="noreferrer">goldendragonai.com</a></p>
          <p className="flex gap-4">
            <a className={ext} href="https://github.com/Kostratana" target="_blank" rel="noreferrer">GitHub</a>
            <a className={ext} href="https://www.linkedin.com/in/svetlana-rumyantseva-ai" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
          <p className="pt-2 text-xs">Created for the Contra × Lovable Challenge 2026</p>
        </div>
      </div>
    </footer>
  );
}
