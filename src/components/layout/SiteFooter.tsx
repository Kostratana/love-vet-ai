import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/kit/Wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-silver">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Wordmark />
          <p className="max-w-md text-xs leading-relaxed text-graphite">
            AI-powered veterinary appointment coordination. Love Vet AI does not diagnose — final
            assessment and treatment decisions belong to a veterinary professional.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite">
          <Link to="/" hash="how-it-works" className="hover:text-deep">How It Works</Link>
          <Link to="/" hash="platform" className="hover:text-deep">Platform</Link>
          <Link to="/" hash="for-clinics" className="hover:text-deep">For Clinics</Link>
          <Link to="/chat" className="hover:text-deep">Chat with AI</Link>
          <Link to="/workspace" className="hover:text-deep">Clinic Staff Workspace</Link>
        </div>
      </div>
    </footer>
  );
}
