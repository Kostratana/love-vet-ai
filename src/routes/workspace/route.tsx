import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
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
import { organization } from "@/lib/love-vet-data";

export const Route = createFileRoute("/workspace")({
  component: WorkspaceLayout,
});

const nav = [
  { label: "Overview", to: "/workspace", icon: LayoutDashboard, exact: true },
  { label: "AI Intakes", to: "/workspace/intakes", icon: Inbox },
  { label: "Appointments", to: "/workspace/appointments", icon: CalendarDays },
  { label: "Patients", to: "/workspace/patients", icon: PawPrint },
  { label: "Veterinarians", to: "/workspace/veterinarians", icon: Stethoscope },
  { label: "Services", to: "/workspace/services", icon: Wrench },
  { label: "Locations", to: "/workspace/locations", icon: Building2 },
  { label: "Analytics", to: "/workspace/analytics", icon: BarChart3 },
  { label: "Settings", to: "/workspace/settings", icon: Settings },
] as const;

function WorkspaceLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1500px] gap-0 lg:gap-6 lg:px-6 lg:py-6">
        {/* Sidebar (desktop) */}
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-xl p-3 lg:flex">
          <div className="px-2 py-2">
            <Wordmark />
          </div>
          <p className="mt-2 px-2 text-[0.68rem] leading-relaxed text-graphite">
            {organization.name}
          </p>
          <nav className="mt-4 flex flex-1 flex-col gap-0.5">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-graphite transition-colors hover:bg-card hover:text-navy"
                activeProps={{
                  className:
                    "bg-card text-navy shadow-[var(--shadow-glass)] border border-silver-strong/50",
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
            <StatusBadge tone="info">Workspace</StatusBadge>
            <Link to="/" className="ml-auto text-xs font-semibold text-deep">
              Exit
            </Link>
          </div>
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 lg:hidden">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                activeOptions={{ exact: "exact" in n ? n.exact : false }}
                className="shrink-0 rounded-lg border border-silver bg-card px-3 py-2 text-xs font-medium text-graphite"
                activeProps={{ className: "border-ice-lum text-navy" }}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <main className="px-4 pb-16 lg:px-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
