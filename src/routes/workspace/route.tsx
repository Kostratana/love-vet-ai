import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarDays, ClipboardList, FolderHeart, PawPrint, Stethoscope } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceLayout,
});

const nav = [
  { label: "Cases", to: "/workspace", icon: FolderHeart, exact: true },
  { label: "Appointments", to: "/workspace/appointments", icon: CalendarDays },
  { label: "Patients", to: "/workspace/patients", icon: PawPrint },
  { label: "Veterinarians", to: "/workspace/veterinarians", icon: Stethoscope },
  { label: "Locations", to: "/workspace/locations", icon: Building2 },
  { label: "Clinic Setup", to: "/workspace/clinic-setup", icon: ClipboardList },
] as const;

function WorkspaceLayout() {
  return (
    <div className="ambient-bg min-h-screen">
      <SiteNav />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 pt-6 sm:px-6">
        <aside className="glass sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto rounded-2xl p-3 lg:block">
          <p className="px-2 text-sm font-bold text-navy">Clinic Staff Workspace</p>
          <p className="px-2 text-[0.7rem] text-graphite">For veterinary clinics and staff</p>
          <nav aria-label="Workspace" className="mt-3 flex flex-col gap-0.5">
            {nav.map((n) => (
              <Link key={n.label} to={n.to} activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-graphite transition-all hover:bg-card/60 hover:text-deep"
                activeProps={{ className: "!border-ice-lum bg-card/70 !text-deep font-semibold shadow-[0_6px_18px_-10px_rgb(109_74_255/0.6)]" }}>
                <n.icon className="size-4" aria-hidden /> {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:hidden">
            {nav.map((n) => (
              <Link key={n.label} to={n.to} activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="shrink-0 rounded-full border border-ice-lum/50 bg-card/60 px-3 py-1.5 text-xs font-medium text-graphite"
                activeProps={{ className: "!border-ice-lum bg-card !text-deep font-semibold" }}>
                {n.label}
              </Link>
            ))}
          </div>
          <main>
            <p role="note" className="glass mb-5 rounded-2xl px-4 py-2.5 text-xs leading-relaxed text-navy">
              <span className="mr-1.5 font-extrabold tracking-[0.12em] text-deep">SAMPLE WORKSPACE</span>
              — Demo clinic and fictional sample case. Real patient cases are shown only to verified clinic staff.
            </p>
            <Outlet />
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
