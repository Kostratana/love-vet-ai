import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Field, PageShell, Select, TextArea, TextInput } from "@/components/kit/form";
import { GlowButton, buttonVariants } from "@/components/kit/primitives";

export const Route = createFileRoute("/join/business")({
  head: () => ({
    meta: [
      { title: "Register a Pet-Care Business · Love Vet AI" },
      { name: "description", content: "Register a pet store or pet-care business with the future Love Vet AI network." },
      { property: "og:title", content: "Register a Pet-Care Business · Love Vet AI" },
      { property: "og:description", content: "Pet stores, groomers and pet-care services can join Love Vet AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Business,
});

function Business() {
  const [done, setDone] = useState(false);
  return (
    <PublicPage>
      <PageShell narrow eyebrow="Professionals & Clinics" title="Register a Pet-Care Business">
        {done ? (
          <div className="glass rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-deep" />
            <p className="mt-3 text-graphite">Details received in this preview. Nothing is stored or published until registration is connected.</p>
            <Link to="/professionals" className={buttonVariants({ variant: "secondary" }) + " mt-5"}>Back to Professionals & Clinics</Link>
          </div>
        ) : (
          <form className="glass space-y-4 rounded-3xl p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <Field label="Business name"><TextInput required /></Field>
            <Field label="Business type">
              <Select required defaultValue=""><option value="" disabled>Select…</option><option>Pet store</option><option>Grooming</option><option>Boarding / daycare</option><option>Training</option><option>Other pet-care service</option></Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact email"><TextInput type="email" required /></Field>
              <Field label="Phone"><TextInput type="tel" /></Field>
            </div>
            <Field label="Location / address"><TextInput /></Field>
            <Field label="Animal species served"><TextInput placeholder="e.g. dogs, cats, birds, reptiles" /></Field>
            <Field label="Description"><TextArea rows={4} /></Field>
            <GlowButton type="submit" className="w-full">Register business</GlowButton>
          </form>
        )}
      </PageShell>
    </PublicPage>
  );
}
