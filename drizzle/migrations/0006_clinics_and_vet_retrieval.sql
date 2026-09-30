CREATE TABLE public.clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  street text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  urgent_care text NOT NULL DEFAULT '',
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clinics TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clinics TO authenticated;
GRANT ALL ON public.clinics TO service_role;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read clinics" ON public.clinics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff manage clinics" ON public.clinics FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

ALTER TABLE public.veterinarians
  ADD COLUMN clinic_id uuid REFERENCES public.clinics(id),
  ADD COLUMN secondary_specialties text[] NOT NULL DEFAULT '{}',
  ADD COLUMN conditions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN urgent_care boolean NOT NULL DEFAULT false,
  ADD COLUMN appointment_durations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN search_text text NOT NULL DEFAULT '',
  ADD COLUMN embedding extensions.vector(3072);

-- Re-embed a vet whenever its searchable text changes
CREATE OR REPLACE FUNCTION public.vet_reset_embedding() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.search_text IS DISTINCT FROM OLD.search_text THEN NEW.embedding := NULL; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER veterinarians_reset_embedding BEFORE UPDATE ON public.veterinarians FOR EACH ROW EXECUTE FUNCTION public.vet_reset_embedding();

CREATE OR REPLACE FUNCTION public.match_veterinarians(query_embedding extensions.vector, match_count integer DEFAULT 10)
RETURNS TABLE(id uuid, similarity double precision)
LANGUAGE sql STABLE SET search_path TO 'public', 'extensions' AS $$
  select v.id, 1 - (v.embedding <=> query_embedding) as similarity
  from public.veterinarians v
  where v.active and v.embedding is not null
  order by v.embedding <=> query_embedding
  limit match_count
$$;