# Love Vet AI 🐾

> **Multimodal AI veterinary support platform for pet owners, veterinarians, and clinics.**

Love Vet AI is a full-stack veterinary AI MVP designed to connect pet owners with intelligent veterinary support, relevant veterinary knowledge, veterinarian discovery, appointment availability, and booking.

The platform combines **multimodal AI, RAG, vector retrieval, pet history, veterinary triage, veterinarian matching, and clinic workflows** in one end-to-end system.

**Live MVP:** https://lovevetai.lovable.app/

---

## 🐶🐱🦜🐴 Project Vision

Love Vet AI is designed around a simple workflow:

**Pet Owner → AI Intake → Safety & Triage → Knowledge Retrieval → Veterinarian Matching → Availability → Booking → Clinic Workflow**

The goal is to reduce the friction between a pet owner's first question and the appropriate veterinary next step while giving clinics a structured workflow for incoming cases.

The current MVP is a demonstration and development platform. Clinic, veterinarian, and appointment-slot records currently contain fictional demo data.

---

## 🚀 Current MVP

### 🐾 Pet Owner Experience

- AI veterinary chat
- Pet profiles
- Pet history and case context
- Veterinary intake
- Safety-oriented triage
- Veterinarian discovery
- Clinic information
- Appointment availability
- Appointment booking
- Conversation history
- Multimodal input

### 📷 Multimodal AI

The chat workflow supports:

- Text
- Images
- Image analysis
- OCR / structured extraction
- Video analysis
- Audio input
- Speech-to-text
- Text-to-speech

The system can combine uploaded media with conversational and veterinary context before generating a response.

### 🩺 Veterinary Intelligence

The platform includes retrieval and reasoning flows for:

- Veterinary knowledge
- Clinic information
- Veterinarian/provider discovery
- Private pet history
- Structured triage
- Specialty routing
- Pre-visit case context

### 🏥 Clinic Workflow

The MVP includes the foundation for a clinic-side workflow:

- Clinic information
- Veterinarian directory
- Vet availability
- Appointment management
- Structured appointment case package
- Clinic Staff interface
- Role-based access model

---

# 🧠 AI Architecture

## End-to-End Flow

```text
                    ┌─────────────────────┐
                    │     Pet Owner       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     AI Chat         │
                    │ Text / Image /       │
                    │ Video / Audio       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ AI Orchestration    │
                    │ Context + Routing   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      Clinic Knowledge   Veterinarian      Private Pet
           RAG           Retrieval          History
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Safety / Triage /   │
                    │ Specialty Routing   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Vet Matching        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Live Availability   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Atomic Booking      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Appointment +       │
                    │ Case Package        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Clinic Staff        │
                    └─────────────────────┘
```

---

# 🔎 RAG & Vector Retrieval

Love Vet AI uses **PostgreSQL + pgvector** for vector-based retrieval.

The current architecture separates retrieval into three main flows:

### 1. 🏥 Clinic Knowledge RAG

Uses veterinary/clinic knowledge documents and vector similarity retrieval.

- `knowledge_documents`
- `match_knowledge`

### 2. 👩‍⚕️ Veterinarian / Provider Retrieval

Veterinarians have vector embeddings used for semantic provider retrieval.

- `veterinarians.embedding`
- `match_veterinarians`

### 3. 🐾 Private Patient History Retrieval

Patient history is stored as vectorized chunks and filtered by pet/user access.

- `patient_history_chunks`
- `match_patient_history`
- Pet-level filtering
- Row Level Security

**Important:** appointment availability is retrieved from live `vet_slots` data rather than embedded into the vector database.

---

# 🤖 AI Model Layer

The current architecture uses an AI gateway to route model requests.

| Capability | Model |
|---|---|
| Chat, image analysis, OCR, extraction | `openai/gpt-6-astra` |
| Video analysis | `google/gemini-3.8-flash` |
| Structured triage / specialty selection | `typesafe/jev-latest` |
| Speech-to-text | `google/gemini-3.5-transcribe` |
| Text-to-speech | `google/gemini-3.1-flash-tts-preview` |
| Embeddings | `google/gemini-embedding-2` |

The application routes AI requests through the **Lovable AI Gateway** rather than exposing provider credentials in client-side code.

---

# 🗄️ Database Architecture

The platform uses **Lovable Cloud / PostgreSQL with pgvector**.

Core database tables include:

```text
profiles
user_roles
pets
conversations
conversation_messages
uploaded_files
veterinary_intakes
triage_results
clinic_staff_requests
appointments
clinics
veterinarians
vet_slots
knowledge_documents
patient_history_chunks
reviews
```

### Database capabilities

- PostgreSQL relational data
- pgvector embeddings
- Row Level Security (RLS)
- Role-based access
- Atomic booking RPC
- Pet-filtered patient-history retrieval
- Vector similarity search
- Demo-data flagging

Database roles include:

```text
owner
staff
admin
```

---

# 🔐 Security & Privacy Architecture

The current MVP includes:

- RLS across database tables
- Owner-level data isolation
- Role-controlled staff access
- Pet-filtered patient-history retrieval
- Signed URLs for private uploaded media
- Server-side AI credentials
- Security-definer database functions where required for controlled operations
- Guest media are not persisted

Private media is stored in the `chat-media` bucket using user-specific folders and signed URLs.

---

# 📅 Booking Architecture

The booking workflow is designed around:

```text
AI Intake
   ↓
Case Context
   ↓
Veterinarian Matching
   ↓
Vet Availability
   ↓
Slot Selection
   ↓
Atomic Booking
   ↓
Appointment
   ↓
Case Package
   ↓
Clinic Workflow
```

The appointment record can contain a structured `case_package` snapshot so the relevant pre-visit information can travel with the booking.

---

# 💳 Provider Monetization

Love Vet AI includes a provider subscription interface.

### Independent Veterinarian
**$20 USD / month**

### Clinic
**$50 USD / month**

### Clinic Pro
**$99 USD / month**

The current MVP includes the Payment page, navigation entry, plan presentation, and plan-selection interface.

**Online subscription checkout is currently a demo placeholder. Paddle checkout is not active in the current MVP.**

Pet-owner access is designed as a free user experience.

---

# 🏗️ Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Start
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Radix UI

### Backend / Platform

- Lovable Cloud
- Server-side functions
- API routes
- Edge/serverless runtime
- Lovable AI Gateway

### Data

- PostgreSQL
- pgvector
- Row Level Security
- Private object storage

### AI

- Large Language Models
- Multimodal AI
- Computer vision / image understanding
- OCR
- Video analysis
- Speech-to-text
- Text-to-speech
- Embeddings
- Retrieval-Augmented Generation

---

# 🧩 Major System Components

```text
src/
├── chat/
├── components/
├── routes/
├── server/
├── services/
└── ...

supabase/
├── functions/
├── migrations/
└── ...

public/
drizzle/
```

The repository contains the application source, database configuration, migrations/functions, public assets, and supporting development configuration.

---

# 🐕🐈🐎 Example Product Domains

Love Vet AI is designed to support veterinary workflows across different companion and performance animals.

The current project concept can be extended to:

- 🐶 Dogs
- 🐱 Cats
- 🐴 Horses
- 🐰 Rabbits
- 🦜 Birds
- 🐹 Small companion animals

The architecture is intended to support species-aware veterinary workflows rather than a single fixed animal profile.

---

# 📊 MVP Status

| Area | Status |
|---|---|
| AI veterinary chat | ✅ Implemented |
| Multimodal input | ✅ Implemented |
| Image analysis | ✅ Implemented |
| Video workflow | ✅ Implemented |
| Audio / speech workflow | ✅ Implemented |
| Veterinary RAG | ✅ Implemented |
| Vector retrieval | ✅ Implemented |
| Pet profiles | ✅ Implemented |
| Pet history | ✅ Implemented |
| Vet retrieval | ✅ Implemented |
| Clinic information | ✅ Implemented |
| Availability | ✅ Implemented |
| Booking | ✅ Implemented |
| Clinic Staff interface | 🟡 Partially implemented |
| Payment UI | 🟡 Implemented |
| Subscription checkout | 🟡 Demo placeholder |
| Email confirmation | 🟡 Requires email domain |
| Real clinic/provider data | 🔵 Demo data |
| Calendar synchronization | 🔵 Planned |

---

# 🌐 Live Demo

**Love Vet AI MVP**

https://lovevetai.lovable.app/

The live application is a demonstration environment. Provider, clinic, veterinarian, and availability records currently use fictional demo data.

---

# 🎯 Product Direction

The long-term direction is a scalable veterinary AI ecosystem connecting:

**Pet Owners ↔ AI Veterinary Support ↔ Veterinarians ↔ Clinics**

Future development can extend the platform toward:

- richer multimodal veterinary analysis
- expanded veterinary knowledge
- rehabilitation and monitoring workflows
- deeper clinic integrations
- calendar synchronization
- production provider onboarding
- subscription billing
- expanded species-specific intelligence

---

# ⚠️ Current MVP Limitations

This repository represents an active MVP rather than a finished production veterinary service.

Current limitations include:

- demo clinic and veterinarian records
- demo appointment availability
- subscription checkout not yet active
- email sending requires domain configuration
- clinic staff accounts are not yet provisioned
- some production integrations remain planned

The platform is intended for **AI-assisted information, triage support, workflow assistance, and veterinary decision support**. It does not replace examination or diagnosis by a qualified veterinary professional.

---

# 🧪 Development

Clone the repository:

```bash
git clone https://github.com/Kostratana/love-vet-ai.git
cd love-vet-ai
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The repository is primarily maintained through the Lovable development workflow, with the source code fully owned by the project owner.

---

# 👩‍💻 Project

**Love Vet AI**  
Part of the **Golden Dragon AI Studio** ecosystem.

Built by **Svetlana Rumyantseva**  
AI Systems Architect · AI/ML Engineer · Data Scientist

Golden Dragon AI Studio: https://www.goldendragonai.com/

---

## 🐾 Status

**Active MVP / AI engineering project**

Built to explore multimodal veterinary AI, retrieval-augmented intelligence, pet health workflows, and AI-assisted connections between pet owners and veterinary professionals.

🐶 🐱 🐴 🐰 🦜 🐹
