ALTER TABLE public.veterinarians
  ADD COLUMN IF NOT EXISTS provider_type text NOT NULL DEFAULT 'clinic',
  ADD COLUMN IF NOT EXISTS home_visit boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_visit_types text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS service_area text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS clinic_id uuid REFERENCES public.clinics(id),
  ADD COLUMN IF NOT EXISTS case_package jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS visit_location text NOT NULL DEFAULT '';

UPDATE public.appointments a SET clinic_id = v.clinic_id FROM public.veterinarians v WHERE a.veterinarian_id = v.id AND a.clinic_id IS NULL;

INSERT INTO public.veterinarians (slug, name, title, specialty, species, interests, languages, years_experience, bio, appointment_types, availability, initials, active, is_demo,
  clinic_id, secondary_specialties, conditions, urgent_care, appointment_durations, provider_type, home_visit, home_visit_types, service_area, search_text)
VALUES ('demo-homevisit', 'Dr. Clara Wendell', 'Independent / Home-Visit Veterinarian (DEMO)', 'general',
  ARRAY['dog','cat','rabbit'], ARRAY['low-stress handling','senior pets','anxious pets'], ARRAY['English','Spanish'], 14,
  'Fictional demo provider. Independent veterinarian who visits pets at home within the stored Fairmont Heights demo service area — suited to anxious, senior or mobility-limited dogs, cats and rabbits.',
  ARRAY['Home visit consultation','Home senior check','Home vaccination','Home urgent visit'],
  'Mon–Sat home visits (demo availability)', 'CW', true, true,
  NULL, ARRAY['senior care','behaviour'], ARRAY['mobility problems','anxiety','appetite loss','skin irritation','ear scratching','vaccination','senior check'], true,
  '{"Home visit consultation":45,"Home senior check":45,"Home vaccination":30,"Home urgent visit":45}'::jsonb,
  'home_visit', true, ARRAY['consultation','senior check','vaccination','same-day urgent (non-emergency)'],
  ARRAY['Fairmont Heights','12601','Willowbrook','Poughkeepsie'],
  'Dr. Clara Wendell, independent home-visit veterinarian (demo). Visits dogs, cats and rabbits at home in Fairmont Heights, 12601, Willowbrook, Poughkeepsie demo area. General practice, senior care, anxious pets, mobility problems, appetite loss, skin and ear problems, vaccinations, same-day non-emergency urgent home visits. Languages English, Spanish.')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  appointment_id uuid NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  veterinarian_id uuid REFERENCES public.veterinarians(id),
  clinic_id uuid REFERENCES public.clinics(id),
  overall_rating int NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  vet_rating int NOT NULL CHECK (vet_rating BETWEEN 1 AND 5),
  matched_expectations boolean,
  comment text NOT NULL DEFAULT '' CHECK (char_length(comment) <= 3000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reviews read" ON public.reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff read reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));
CREATE POLICY "review completed own visit" ON public.reviews FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.user_id = auth.uid() AND a.status = 'completed'
      AND a.veterinarian_id IS NOT DISTINCT FROM reviews.veterinarian_id));