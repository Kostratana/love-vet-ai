import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";

export function SectionPlaceholder({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: LucideIcon }) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="glass grid place-items-center rounded-3xl px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full border border-ice-lum/70 bg-card/70 text-deep"><Icon className="size-5" strokeWidth={1.6} /></span>
        <p className="mt-4 font-bold text-navy">Nothing here yet</p>
        <p className="mt-1 max-w-md text-sm text-graphite">This section will fill with real data once your clinic is connected. No sample records are shown.</p>
      </div>
    </div>
  );
}
