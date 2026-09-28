import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PublicPage } from "@/components/layout/PublicPage";
import { PageShell } from "@/components/kit/form";
import { OwnerForm } from "@/components/owner/OwnerForm";
import { safeRedirect } from "@/lib/account-store";

export const Route = createFileRoute("/join/owner")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({ redirect: safeRedirect(s["redirect"]) }),
  head: () => ({
    meta: [
      { title: "Create your pet owner account · Love Vet AI" },
      { name: "description", content: "A free Love Vet AI account keeps your pets, conversations, appointments and visit history in one place." },
      { property: "og:title", content: "Create your pet owner account · Love Vet AI" },
      { property: "og:description", content: "Free for pet owners. Supports multiple pets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerRegistration,
});

function OwnerRegistration() {
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"register" | "signin">("register");
  return (
    <PublicPage>
      <PageShell
        narrow
        eyebrow="Pet owner"
        title={mode === "register" ? "Create your account" : "Sign in"}
        intro={<p>Free for pet owners. You can <Link to="/chat" className="font-semibold text-deep hover:underline">start chatting</Link> without an account.</p>}
      >
        <OwnerForm redirect={redirect} onModeChange={setMode} />
      </PageShell>
    </PublicPage>
  );
}
