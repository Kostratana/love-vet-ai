import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, History, ImageIcon, MessageCircle, PawPrint, Star, UserRound } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { EmptyState, PageShell } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";
import { signOutLocal, useAccount } from "@/lib/account-store";
import { cn } from "@/lib/utils";
import { OwnerConversations, OwnerMedia } from "@/components/owner/OwnerData";
import { AppointmentList } from "@/components/workspace/StaffData";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account · Love Vet AI" },
      { name: "description", content: "Your pets, conversations, appointments, visit history, media and reviews in one place." },
      { property: "og:title", content: "My Account · Love Vet AI" },
      { property: "og:description", content: "Pet owner account on Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});

const tabs = [
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
  { id: "upcoming", label: "Upcoming Appointments", icon: CalendarDays },
  { id: "history", label: "Appointment History", icon: History },
  { id: "visits", label: "Visit History", icon: History },
  { id: "media", label: "Uploaded Media", icon: ImageIcon },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "profile", label: "Profile", icon: UserRound },
] as const;

function Account() {
  const { owner, loading, user } = useAccount();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("pets");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (ready && !loading && !user) navigate({ to: "/join/owner", search: { redirect: "/account" } }); }, [ready, loading, user, navigate]);
  if (!owner) return <div className="ambient-bg min-h-screen" />;

  const empty = {
    conversations: <EmptyState icon={MessageCircle} title="No saved conversations yet" action={<Link to="/chat" className={buttonVariants()}>Chat with AI</Link>} />,
    upcoming: <p className="text-xs text-graphite">Book an appointment from Chat with AI after describing your pet’s concern.</p>,
    history: <EmptyState icon={History} title="No appointment history yet" />,
    visits: <EmptyState icon={History} title="No completed visits yet">Completed visits appear here. This is your organized history — not a veterinary medical record.</EmptyState>,
    media: <EmptyState icon={ImageIcon} title="No uploaded media">Photos, videos and voice messages you share in conversations will appear here.</EmptyState>,
    reviews: <EmptyState icon={Star} title="No reviews yet" action={<Link to="/review" search={{}} className={buttonVariants({ variant: "secondary" })}>Leave a Review</Link>}>You can review a veterinarian and clinic after a completed visit.</EmptyState>,
  };

  return (
    <PublicPage>
      <PageShell eyebrow="My Account" title={`Hello, ${owner.firstName || "there"}`}>
        <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="Account sections" className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id}
                className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors", tab === t.id ? "bg-card text-navy shadow-[var(--shadow-glass)]" : "text-graphite hover:text-deep")}>
                <t.icon className="size-4" strokeWidth={1.6} /> {t.label}
              </button>
            ))}
          </nav>
          <section>
            {tab === "pets" && (
              owner.pets.length === 0 ? (
                <EmptyState icon={PawPrint} title="No pets added yet" action={<Link to="/join/owner" className={buttonVariants()}>Add a pet</Link>} />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {owner.pets.map((p) => (
                    <div key={p.id} className="glass rounded-2xl p-5">
                      {p.photoUrl && <img src={p.photoUrl} alt={`${p.name} photo`} className="mb-3 size-20 rounded-xl border border-ice-lum/60 object-cover" />}
                      <p className="font-bold text-navy">{p.name || "Unnamed pet"}</p>
                      <p className="text-sm text-graphite">{[p.species, p.breed, p.age, p.sex].filter(Boolean).join(" · ") || "—"}</p>
                    </div>
                  ))}
                  <Link to="/join/owner" className="grid place-items-center rounded-2xl border border-dashed border-silver-strong/80 p-5 text-sm font-semibold text-deep hover:bg-card/50">+ Add or edit pets</Link>
                </div>
              )
            )}
            {tab === "profile" && (
              <div className="glass space-y-2 rounded-2xl p-6 text-sm text-navy">
                <p><span className="text-graphite">Name:</span> {owner.firstName} {owner.lastName}</p>
                <p><span className="text-graphite">Email:</span> {owner.email || "—"}</p>
                <p><span className="text-graphite">Phone:</span> {owner.phone || "—"}</p>
                <p><span className="text-graphite">Location:</span> {owner.location || "—"}</p>
                <div className="flex gap-2 pt-4">
                  <Link to="/join/owner" className={buttonVariants({ variant: "secondary", size: "sm" })}>Edit</Link>
                  <GlowButton size="sm" variant="ghost" onClick={async () => { await signOutLocal(); navigate({ to: "/" }); }}>Sign out</GlowButton>
                </div>
              </div>
            )}
            {tab === "conversations" && <OwnerConversations empty={empty.conversations} />}
            {tab === "upcoming" && <div className="space-y-4"><AppointmentList scope="own" />{empty.upcoming}</div>}
            {tab === "media" && <OwnerMedia empty={empty.media} />}
            {(tab === "history" || tab === "visits" || tab === "reviews") && empty[tab]}
          </section>
        </div>
      </PageShell>
    </PublicPage>
  );
}
