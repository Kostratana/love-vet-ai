import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/kit/Wordmark";
import { organization } from "@/lib/love-vet-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-silver bg-silver-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Wordmark />
          <p className="max-w-md text-xs leading-relaxed text-graphite">
            Multilingual multimodal AI front desk and care coordination for veterinary clinics and
            networks. Love Vet AI provides routing assistance — not a medical diagnosis.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite">
          <Link to="/how-it-works" className="hover:text-navy">
            How It Works
          </Link>
          <Link to="/platform" className="hover:text-navy">
            Platform
          </Link>
          <Link to="/intake" className="hover:text-navy">
            AI Front Desk
          </Link>
          <Link to="/workspace" className="hover:text-navy">
            Workspace
          </Link>
        </div>
      </div>
      <div className="border-t border-silver px-6 py-4 text-center text-[0.7rem] tracking-wide text-graphite">
        {organization.brandLine} · White-label ready for veterinary networks
      </div>
    </footer>
  );
}
