# Roadmap — Backend + AI integration

- [x] Database schema, access rules, private media storage
- [x] Live AI chat (gpt-6-astra); photos + OCR (gpt-6-astra); video analysis (google/gemini-3.8-flash)
- [x] Sign up / sign in / sign out on owner & clinic pages; profile + pets in database
- [x] Signed-in chats saved and reloaded (/chat/:id), pet selection
- [x] Uploads to private storage; voice transcription (gemini-3.5-transcribe)
- [x] Structured triage (jev-latest + astra extraction), saved, routing card
- [x] Send to clinic staff; workspace shows real requests (verified staff only)
- [x] Information Desk RAG (gemini-embedding-2); Clinic Setup feeds it
- [x] Booking in chat; appointments in account + workspace
- [ ] Signed-in end-to-end browser test — blocked: needs a confirmed test account (email confirmation is on)
- [ ] Staff verification — blocked: owner must say which clinic accounts get staff access
- [ ] Confirmation email — blocked: needs verified sending domain (stub in email.server.ts)
- [x] Pet photo persistence; workspace appointments empty-state fix
