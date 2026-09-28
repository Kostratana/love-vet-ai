import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, History, MessageCircle, PawPrint, Star, UserRound } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { EmptyState } from "@/components/kit/form";
import { buttonVariants } from "@/components/kit/primitives";
import { OwnerForm } from "@/components/owner/OwnerForm";
import { ReviewForm } from "@/components/owner/ReviewForm";
import { useAccount } from "@/lib/account-store";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Pet Owner Account · Love Vet AI" },
      { name: "description", content: "Create a free Love Vet AI account for your pets, conversations, appointments, visit history and verified reviews." },
      { property: "og:title", content: "Pet Owner Account · Love Vet AI" },
      { property: "og:description", content: "Register, add multiple pets and leave verified reviews after completed visits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerPage,
});

const sections = [
  { id: "register", label: "Create Account", icon: UserRound },
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "visits", label: "Visit History", icon: History },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "profile", label: "Profile", icon: UserRound },
];

function OwnerPage() {
  const { owner } = useAccount();
  return (
    <PublicPage>
      <section className="mx-auto max-w-5xl px-6 pt-14">
        <p className="text-xs font-bold tracking-[0.2em] text-deep uppercase">Page 2 · Pet Owner</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"><span className="text-gradient-hero">Pet Owner Account</span></h1>
        <p className="mt-4 max-w-2xl text-graphite">
          Free for pet owners. You can <Link to="/chat" className="font-semibold text-deep hover:underline">chat with AI</Link> without an account —
          create one to save your pets, conversations, appointments and visit history.
        </p>
        <nav aria-label="Account sections" className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="glass hover-lift inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-navy">
              <s.icon className="size-4 text-deep" /> {s.label}
            </a>
          ))}
        </nav>
      </section>

      <section id="register" className="mx-auto max-w-3xl scroll-mt-28 px-6 pt-12">
        <h2 className="mb-5 text-2xl font-bold">{owner ? "Your account details" : "Create Your Account"}</h2>
        <OwnerForm redirect="/owner" />
      </section>

      <div className="mx-auto grid max-w-5xl gap-5 px-6 pt-16 md:grid-cols-2">
        <div id="pets" className="glass scroll-mt-28 rounded-3xl p-6">
          <h2 className="mb-3 text-lg font-bold">My Pets</h2>
          {owner?.pets.length ? (
            <ul className="space-y-2">{owner.pets.map((p) => <li key={p.id} className="rounded-xl bg-card/70 px-4 py-3 text-sm"><b className="text-navy">{p.name || "Unnamed pet"}</b> <span className="text-graphite">· {p.species || "species not set"}{p.breed && ` · ${p.breed}`}</span></li>)}</ul>
          ) : <EmptyState icon={PawPrint} title="No pets added yet">Add one or more pets in the form above.</EmptyState>}
        </div>
        <div id="conversations" className="glass scroll-mt-28 rounded-3xl p-6">
          <h2 className="mb-3 text-lg font-bold">Conversations</h2>
          <EmptyState icon={MessageCircle} title="No saved conversations yet" action={<Link to="/chat" className={buttonVariants()}>Chat with AI</Link>} />
        </div>
        <div id="appointments" className="glass scroll-mt-28 rounded-3xl p-6">
          <h2 className="mb-3 text-lg font-bold">Appointments</h2>
          <EmptyState icon={CalendarDays} title="No appointments yet">Appointments you confirm in Chat with AI will appear here.</EmptyState>
        </div>
        <div id="visits" className="glass scroll-mt-28 rounded-3xl p-6">
          <h2 className="mb-3 text-lg font-bold">Visit History</h2>
          <EmptyState icon={History} title="No completed visits yet">Your organized history — not a veterinary medical record.</EmptyState>
        </div>
      </div>

      <section id="reviews" className="mx-auto max-w-3xl scroll-mt-28 px-6 pt-16">
        <h2 className="text-2xl font-bold">Leave a Verified Review</h2>
        <p className="mt-2 mb-5 text-sm text-graphite">
          Completed veterinary visit → sign in → select the completed appointment → leave a verified review.
          Reviews unlock only after a real completed visit.
        </p>
        <ReviewForm />
      </section>

      <section id="profile" className="mx-auto max-w-3xl scroll-mt-28 px-6 pt-16">
        <div className="glass rounded-3xl p-6">
          <h2 className="mb-2 text-lg font-bold">Profile</h2>
          <p className="text-sm text-graphite">
            {owner ? `${owner.firstName} ${owner.lastName} · ${owner.email}` : "Your profile appears here after you create an account."}
          </p>
          {owner && <Link to="/account" className={buttonVariants({ variant: "secondary", size: "sm" }) + " mt-4"}>Open full account</Link>}
        </div>
      </section>
    </PublicPage>
  );
}
