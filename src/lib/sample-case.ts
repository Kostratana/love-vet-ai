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
