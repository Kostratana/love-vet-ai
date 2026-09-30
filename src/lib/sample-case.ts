/** One clearly fictional pre-visit case used to demonstrate the workspace structure. */
export const sampleCase = {
  id: "sample",
  status: "Awaiting client confirmation",
  visitType: "First visit" as "First visit" | "Returning patient",
  owner: { name: "Sample Owner", phone: "+00 000 000 000", email: "owner@example.com", location: "Sample city" },
  pet: { name: "Sample pet", species: "Rabbit", breed: "Mixed", age: "3 years", sex: "Female" },
  reason: "Eating less than usual",
  started: "Two days ago",
  context: "Indoor rabbit, no recent diet change reported by the owner.",
  originalMessage: "Mi conejita come menos desde hace dos días y está más quieta.",
  originalLanguage: "Spanish (auto-detected)",
  summary: "Owner reports reduced appetite and lower activity for two days. No diagnosis is made — the veterinarian decides.",
  appointment: { preferred: "Sample date · Morning", professional: "Not yet assigned" },
  media: { photos: 2, videos: 1, voice: 1, files: 0 },
};

import type { CaseView } from "@/components/workspace/PreVisitCaseView";

/** The same fictional rabbit, in the exact structure real booked cases use. */
export const sampleCaseView: CaseView = {
  kind: "sample",
  owner: { name: "Elena Marsh (fictional)", phone: "+1 555 0142 (fictional)", email: "elena.marsh@example.com", location: "Fairmont Heights, NY (fictional)" },
  pet: { name: "Clover", species: "Rabbit", breed: "Holland Lop", age: "3 years", sex: "Female, spayed", notes: "Indoor rabbit · hay, fresh greens and pellets · no known allergies (fictional profile)." },
  reported: {
    reason: "Eating less than usual and quieter than usual",
    started: "About two days ago",
    concerns: ["Eating less", "Quieter / less active", "Fewer droppings"],
    quote: "Mi conejita come menos desde hace dos días y está más quieta.",
    quoteLanguage: "Spanish, auto-detected",
  },
  intake: [
    ["Still eating hay", "Yes, less than usual"],
    ["Drinking", "Normal"],
    ["Droppings", "Fewer and smaller since yesterday"],
    ["Diet change", "None reported"],
    ["Energy", "Resting more, still moves around"],
    ["Other animals at home", "None"],
  ],
  triage: { urgency: "soon", summary: "Owner reports reduced appetite, lower activity and fewer droppings for about two days. Recommended to see a rabbit-experienced veterinarian soon.", destination: "Book a veterinary appointment", confidence: 0.82 },
  media: [
    { id: "v", kind: "voice", label: "Voice message", duration: "0:14", transcript: "Mi conejita come menos desde hace dos días y está más quieta." },
    { id: "p", kind: "photo", label: "Photo 1", observation: "Rabbit sitting hunched in a corner of the pen; hay visible and largely untouched; food bowl appears full." },
    { id: "vid", kind: "video", label: "Short video", duration: "0:12", observation: "Rabbit moves a few steps then settles; little interest shown when greens are offered." },
  ],
  appointment: {
    vet: "Dr. Noor Castellan", specialty: "Exotic & small-mammal medicine", clinic: "Willowbrook Demo Veterinary Clinic",
    address: "48 Willowbrook Lane, Suite 2, Fairmont Heights, NY 12601", when: "Demo date · Tue 10:00 AM", type: "Consultation", status: "Confirmed (sample)",
  },
};
