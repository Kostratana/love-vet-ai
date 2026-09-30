CREATE TYPE public.app_role AS ENUM ('owner','staff','admin');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;

CREATE TABLE public.profiles (id uuid PRIMARY KEY, first_name text NOT NULL DEFAULT '', last_name text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '', phone text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.pets (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, name text NOT NULL, species text NOT NULL, breed text, age text, sex text, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO authenticated; GRANT ALL ON public.pets TO service_role;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pets" ON public.pets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff read pets" ON public.pets FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'staff'));

ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL;

CREATE TABLE public.uploaded_files (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE, pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL, kind text NOT NULL, storage_path text NOT NULL, mime_type text NOT NULL, size_bytes bigint NOT NULL, transcription text, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploaded_files TO authenticated; GRANT ALL ON public.uploaded_files TO service_role;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own files" ON public.uploaded_files FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.triage_results (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE, request_type text NOT NULL, urgency text NOT NULL, suggested_destination text NOT NULL, symptoms text[] NOT NULL DEFAULT '{}', short_summary text NOT NULL DEFAULT '', confidence real NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.triage_results TO authenticated; GRANT ALL ON public.triage_results TO service_role;
ALTER TABLE public.triage_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own triage" ON public.triage_results FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff read triage" ON public.triage_results FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'staff'));

CREATE TABLE public.veterinary_intakes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL, pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL, summary text NOT NULL DEFAULT '', symptoms text[] NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'open', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.veterinary_intakes TO authenticated; GRANT ALL ON public.veterinary_intakes TO service_role;
ALTER TABLE public.veterinary_intakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own intakes" ON public.veterinary_intakes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff read intakes" ON public.veterinary_intakes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'staff'));

CREATE TABLE public.clinic_staff_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, intake_id uuid REFERENCES public.veterinary_intakes(id) ON DELETE CASCADE, triage_id uuid REFERENCES public.triage_results(id) ON DELETE SET NULL, pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL, summary text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.clinic_staff_requests TO authenticated; GRANT ALL ON public.clinic_staff_requests TO service_role;
ALTER TABLE public.clinic_staff_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own requests" ON public.clinic_staff_requests FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff manage requests" ON public.clinic_staff_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

CREATE TABLE public.appointments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL, intake_id uuid REFERENCES public.veterinary_intakes(id) ON DELETE SET NULL, requested_at timestamptz NOT NULL, appointment_type text NOT NULL DEFAULT 'consultation', status text NOT NULL DEFAULT 'requested', notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated; GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own appointments" ON public.appointments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff manage appointments" ON public.appointments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE TABLE public.knowledge_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category text NOT NULL, title text NOT NULL, content text NOT NULL, embedding extensions.vector(3072), created_by uuid, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_documents TO authenticated; GRANT ALL ON public.knowledge_documents TO service_role;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read knowledge" ON public.knowledge_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write knowledge" ON public.knowledge_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

CREATE POLICY "own media read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='chat-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own media write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='chat-media' AND (storage.foldername(name))[1] = auth.uid()::text);