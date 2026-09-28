import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  ClipboardList,
  BarChart3,
  Building2,
  CalendarDays,
  Inbox,
  LayoutDashboard,
  PawPrint,
  Settings,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Wordmark } from "@/components/kit/Wordmark";
import { GlowButton, StatusBadge } from "@/components/kit/primitives";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceLayout,
});

const nav = [
  { label: "Dashboard", to: "/workspace", icon: LayoutDashboard, exact: true },
  { label: "Appointments", to: "/workspace/appointments", icon: CalendarDays },
  { label: "Client Requests", to: "/workspace/intakes", icon: Inbox },
  { label: "Patients", to: "/workspace/patients", icon: PawPrint },
  { label: "Veterinarians", to: "/workspace/veterinarians", icon: Stethoscope },
  { label: "Services", to: "/workspace/services", icon: Wrench },
  { label: "Locations", to: "/workspace/locations", icon: Building2 },
  { label: "Reviews", to: "/workspace/reviews", icon: Star },
  { label: "Analytics", to: "/workspace/analytics", icon: BarChart3 },
    { label: "Clinic Setup", to: "/workspace/clinic-setup", icon: ClipboardList },
  { label: "Clinic Settings", to: "/workspace/settings", icon: Settings },
] as const;

function WorkspaceLayout() {
  return (
    <div className="ambient-bg min-h-screen">
      <div className="mx-auto flex max-w-[1500px] gap-0 lg:gap-6 lg:px-6 lg:py-6">
        {/* Sidebar (desktop) */}
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-xl p-3 lg:flex">
          <Link to="/" className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-deep hover:bg-ice"><ArrowLeft className="size-3.5" /> Back to Love Vet AI</Link>
          <div className="px-2 py-2">
            <Wordmark />
          </div>
          <p className="mt-3 px-2 text-sm font-bold text-navy">Clinic Staff Workspace</p>
          <p className="px-2 text-[0.68rem] leading-relaxed text-graphite">
            For veterinary clinics and staff · sample data
          </p>
          <nav className="mt-4 flex flex-1 flex-col gap-0.5">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-graphite transition-all duration-200 hover:bg-ice/70 hover:text-deep"
                activeProps={{
                  className:
                    "!border-ice-lum bg-ice !text-deep font-semibold shadow-[0_0_0_1px_rgb(128_104_255/0.25),0_8px_24px_-12px_rgb(109_74_255/0.6)]",
                }}
              >
                <n.icon className="size-4" aria-hidden />
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/" className="mt-3">
            <GlowButton variant="secondary" size="sm" className="w-full">
              Exit to website
            </GlowButton>
          </Link>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile nav */}
          <div className="glass sticky top-0 z-40 flex items-center gap-3 rounded-none px-4 py-3 lg:hidden">
            <Wordmark compact />
            <StatusBadge tone="info">Clinic Staff Workspace</StatusBadge>
            <Link to="/" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-deep">
              <ArrowLeft className="size-3.5" /> Back to Love Vet AI
            </Link>
          </div>
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="shrink-0 rounded-full border border-silver bg-card/70 px-3 py-2 text-xs font-medium text-graphite"
                activeProps={{ className: "!border-ice-lum bg-ice !text-deep font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <main className="px-4 pb-16 lg:px-0">
            <p role="note" className="glass mb-5 rounded-2xl px-4 py-2.5 text-xs leading-relaxed text-navy">
              <span className="mr-1.5 font-extrabold tracking-[0.12em] text-deep">SAMPLE WORKSPACE</span>
              — No real clinics, veterinarians, patients or appointments are connected. All information
              shown here is fictional placeholder data for product demonstration.
            </p>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
