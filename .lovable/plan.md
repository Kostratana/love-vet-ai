# Love Vet AI — Backend + AI integration

Keep every existing page, style and flow. Only wire them to real data and AI. This replaces the earlier "accounts are browser-only / assistant not connected" rules.

## Phases (built in order, each verified before the next)

1. **Accounts** — Email/password + Google sign-in on the existing owner and clinic registration pages. Sessions persist. Owner profile and pets move from browser storage to the database. Clinic staff get a separate staff role.
2. **AI chat** — The existing chat window gets real streamed replies (openai/gpt-6-astra). A safety prompt: no diagnosis, emergency signs mean "see a vet now". Signed-in chats are saved and reload after refresh. Guests can still chat without saving.
3. **Uploads + voice** — Photos, video and voice notes upload to private storage, using the size/type limits already in place. Voice notes are transcribed (google/gemini-3.5-transcribe) and the transcript appears in the chat.
4. **Triage** — After each exchange, a structured result (request type, urgency, destination, symptoms, summary, confidence) is produced with typesafe/jev-latest and saved. A small routing card in the chat offers the matching next step: Information Desk, Clinic Staff, or Booking. It is never labeled a diagnosis.
5. **Clinic Staff** — "Send to clinic staff" creates a request that includes the pet, summary, symptoms, triage and files. The Clinic Staff Workspace (Cases, Patients, Appointments) shows real requests to staff users. The fictional rabbit sample stays as a labeled example when the workspace is empty.
6. **Information Desk knowledge** — A clinic knowledge store (services, hours, policies, prep, FAQs) with google/gemini-embedding-2 search. Clinic questions are answered only from stored entries. Otherwise the answer is "not available yet". It starts empty, and staff add entries from Clinic Setup. No invented clinic facts.
7. **Booking** — The chat and case flow gets a booking form (date/time, type, pet) that saves appointments and shows them in the owner account and the workspace. Calendar sync is kept as a pluggable slot for later.
8. **Confirmation email** — Sent with Lovable's built-in email once an email domain is set up. Booking works without it.

## Technical details
- Tables: profiles, user_roles (separate), pets, conversations, messages, uploaded_files, veterinary_intakes, triage_results, clinic_staff_requests, appointments, knowledge_documents (pgvector). RLS: owners see only their own rows, staff role sees requests/appointments. GRANTs are included in every migration.
- Server functions in `src/lib/*.functions.ts` with auth middleware. The chat stream runs through `src/routes/api/chat.ts`. AI keys stay on the server.
- `account-store.ts` is replaced by hooks backed by the database. Forms and layouts stay the same.
- Reviews and ratings stay as they are, gated on completed appointments, which now exist for real.
- AGENTS.md and the project memory get updated to drop the "frontend-only" rule.

## Needs your input
- Real clinic information for the knowledge base. Until then it stays empty and says so.
- An email domain for confirmation emails (optional).
