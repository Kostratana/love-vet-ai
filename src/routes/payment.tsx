import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/layout/PublicPage";
import { GlowButton } from "@/components/kit/primitives";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Plans & Payment · Love Vet AI" },
      { name: "description", content: "Love Vet AI monthly plans for veterinarians and clinics: Independent Veterinarian, Clinic and Clinic Pro. Choose a plan and pay monthly." },
      { property: "og:title", content: "Plans & Payment · Love Vet AI" },
      { property: "og:description", content: "Monthly plans for veterinarians and clinics: Independent Veterinarian $20, Clinic $50, Clinic Pro $99." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Payment,
});

type Plan = {
  name: string;
  price: number;
  period: string;
  description: string;
};

const PLANS: Plan[] = [
  {
    name: "Independent Veterinarian",
    price: 20,
    period: "USD / month",
    description: "For one veterinarian using Love Vet AI in daily practice.",
  },
  {
    name: "Clinic",
    price: 50,
    period: "USD / month",
    description: "For a veterinary clinic team coordinating care together.",
  },
  {
    name: "Clinic Pro",
    price: 99,
    period: "USD / month",
    description: "For larger clinic teams that need the full workspace.",
  },
];

function PlanRow({ plan, last }: { plan: Plan; last: boolean }) {
  const [note, setNote] = useState(false);

  return (
    <div className={last ? "" : "border-b border-silver-strong/30"}>
      <div className="flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:gap-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-navy">{plan.name}</h2>
          <p className="mt-1 text-sm text-graphite">{plan.description}</p>
        </div>
        <p className="shrink-0 sm:text-right">
          <span className="text-3xl font-extrabold text-navy">${plan.price}</span>
          <span className="ml-2 text-xs font-semibold tracking-wide text-graphite">{plan.period}</span>
        </p>
        <div className="shrink-0 sm:w-44 sm:text-right">
          <GlowButton
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => setNote(true)}
          >
            Choose Plan
          </GlowButton>
        </div>
      </div>
      {note && (
        <p className="pb-6 text-sm text-graphite" role="status">
          Online checkout is not active yet. Please contact us to start a subscription.
        </p>
      )}
    </div>
  );
}

function Payment() {
  return (
    <PublicPage>
      <section className="mx-auto w-full max-w-3xl px-6 pt-14 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Plans &amp; Payment</h1>
        <p className="mt-3 max-w-xl text-base text-graphite">
          Monthly plans for veterinarians and clinics. All plans are billed monthly in US dollars.
        </p>

        <div className="mt-10">
          {PLANS.map((plan, i) => (
            <PlanRow key={plan.name} plan={plan} last={i === PLANS.length - 1} />
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
