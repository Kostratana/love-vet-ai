import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, PawPrint, Stethoscope } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { PageShell } from "@/components/kit/form";
import { buttonVariants } from "@/components/kit/primitives";
import { safeRedirect } from "@/lib/account-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({ redirect: safeRedirect(s["redirect"]) }),
  head: () => ({
    meta: [
      { title: "Sign in or create an account · Love Vet AI" },
      { name: "description", content: "Continue as a pet owner, veterinarian or clinic staff member on Love Vet AI." },
      { property: "og:title", content: "Sign in or create an account · Love Vet AI" },
      { property: "og:description", content: "Accounts for pet owners, veterinarians and clinics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Join,
});

function Join() {
  const { redirect } = Route.useSearch();
  const roles = [
    { icon: PawPrint, title: "Pet Owner", text: "Save your pets, conversations, appointments and visit history. Leave verified reviews after completed visits.", link: <Link to="/join/owner" search={{ redirect }} className={cn(buttonVariants({ size: "sm" }))}>Continue <ArrowRight /></Link> },
    { icon: Stethoscope, title: "Veterinarian", text: "Create your professional profile: specialties, species treated, clinics, languages and availability.", link: <Link to="/join/veterinarian" className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}>Continue <ArrowRight /></Link> },
    { icon: Building2, title: "Clinic / Staff", text: "Configure your organization, locations, services, capabilities, hours and schedules.", link: <Link to="/workspace/clinic-setup" className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}>Continue <ArrowRight /></Link> },
  ];
  return (
    <PublicPage>
      <PageShell
        eyebrow="Account"
        title="Continue as"
        intro={<p>You don't need an account to start a conversation — <Link to="/chat" className="font-semibold text-deep underline-offset-4 hover:underline">Chat with AI</Link> right away and create one later.</p>}
      >
        <div className="glass divide-y divide-silver/80 rounded-3xl">
          {roles.map((r) => (
            <div key={r.title} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-7">
              <r.icon className="size-6 shrink-0 text-deep" strokeWidth={1.5} aria-hidden />
              <div className="flex-1">
                <h2 className="font-bold text-navy">{r.title}</h2>
                <p className="mt-1 text-sm text-graphite">{r.text}</p>
              </div>
              {r.link}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-graphite">
          Account creation is a preview: details stay in this browser until secure sign-in is connected.
        </p>
      </PageShell>
    </PublicPage>
  );
}
