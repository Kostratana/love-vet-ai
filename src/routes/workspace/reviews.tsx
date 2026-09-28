import { createFileRoute } from "@tanstack/react-router";
import { LineChart, MessageSquareQuote } from "lucide-react";
import { PageHeader } from "@/components/workspace/PageHeader";
import { EmptyState } from "@/components/kit/form";
import { ReputationPanels } from "@/components/care/Reputation";

export const Route = createFileRoute("/workspace/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & quality · Clinic Staff Workspace" },
      { name: "description", content: "Verified visit reviews, AI-summarized themes and private service-quality trends for your clinic." },
      { property: "og:title", content: "Reviews & quality · Clinic Staff Workspace" },
      { property: "og:description", content: "Verified reviews and service-quality analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <div>
      <PageHeader eyebrow="Quality" title="Reviews & service quality" description="Ratings are calculated only from verified reviews. AI summaries of recurring themes are labelled and kept separate from the original reviews." />
      <ReputationPanels />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <EmptyState icon={MessageSquareQuote} title="No verified reviews yet">Reviews from completed Love Vet AI appointments will appear here in full.</EmptyState>
        <EmptyState icon={LineChart} title="No quality trends yet">Private analytics — rating trends, recurring positive themes and recurring complaints — appear once reviews exist.</EmptyState>
      </div>
    </div>
  );
}
