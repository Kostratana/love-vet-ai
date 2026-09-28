import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with AI · Love Vet AI" },
      { name: "description", content: "AI veterinary appointment assistant — type or speak in your language and add photos or video." },
      { property: "og:title", content: "Chat with AI · Love Vet AI" },
      { property: "og:description", content: "Conversational veterinary appointment coordination." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <div className="ambient-bg min-h-screen">
      <SiteNav />
      <p className="px-4 pt-4 text-center text-xs text-graphite">
        No account needed to start.{" "}
        <Link to="/owner" className="font-semibold text-deep hover:underline">Create a Pet Owner Account</Link> to save your conversations later.
      </p>
      <main className="page-enter mx-auto w-full max-w-5xl px-3 pt-3 lg:px-5">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
