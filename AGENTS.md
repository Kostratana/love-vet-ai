<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Pet owner / vet accounts and reviews are frontend-only via `src/lib/account-store.ts` (browser storage) — brief forbids backend for these until integration is planned.
- Keep `/` as the canonical Home route and redirect legacy `/home` visits to it — stale preview links must not reach the 404 page.

- Accounts, pets, chats, media, triage, requests, appointments live in Lovable Cloud (`account-store.ts` wraps auth + tables); browser-only storage is only a pre-confirmation stash. Why: replaces the old frontend-only rule.
- Clinic staff role is granted manually (never self-assigned at registration). Why: prevents anyone reading owners' cases.
- Demo clinic/vets/slots are DB rows flagged is_demo; booking goes through the security-definer book_slot() RPC. Why: atomic, prevents double-booking, keeps RLS on appointments.
- Clinic/vet facts come only from `src/lib/retrieval.server.ts` (clinics table + knowledge_documents + veterinarians.embedding via match_veterinarians); slots always read live from vet_slots. Why: embeddings never hold availability; LLM never invents doctors.
- Voice is recorded as 16 kHz WAV (`src/lib/record-wav.ts`); failed transcripts are never sent to the assistant. Why: browser MediaRecorder containers (e.g. Safari fragmented MP4 labelled webm) failed to decode.
- Appointment pre-visit case = `appointments.case_package` snapshot + live links (conversation_id → uploaded_files, pet_id, user_id → profiles); media stay private in chat-media. Why: one case, no private data in public RAG.
- Reviews live in `public.reviews`; RLS insert only for the owner's own `completed` appointment. Why: no fake or pre-visit reviews.
- Read-aloud uses `/api/tts` (google/gemini-3.1-flash-tts-preview, WAV, user-initiated). Why: supported zero-retention speech model.
