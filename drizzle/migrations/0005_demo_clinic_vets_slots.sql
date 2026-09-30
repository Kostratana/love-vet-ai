CREATE TABLE public.veterinarians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  specialty text NOT NULL,
  species text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  years_experience int NOT NULL DEFAULT 0,
  bio text NOT NULL DEFAULT '',
  appointment_types text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT '',
  initials text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.veterinarians TO anon, authenticated;
GRANT ALL ON public.veterinarians TO service_role;
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read vets" ON public.veterinarians FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff manage vets" ON public.veterinarians FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

CREATE TABLE public.vet_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinarian_id uuid NOT NULL REFERENCES public.veterinarians(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  duration_min int NOT NULL DEFAULT 30,
  booked boolean NOT NULL DEFAULT false,
  is_demo boolean NOT NULL DEFAULT true,
  UNIQUE (veterinarian_id, starts_at)
);
CREATE INDEX vet_slots_open_idx ON public.vet_slots (veterinarian_id, starts_at) WHERE NOT booked;
GRANT SELECT ON public.vet_slots TO anon, authenticated;
GRANT ALL ON public.vet_slots TO service_role;
ALTER TABLE public.vet_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read slots" ON public.vet_slots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "staff manage slots" ON public.vet_slots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));

ALTER TABLE public.appointments ADD COLUMN veterinarian_id uuid REFERENCES public.veterinarians(id);
ALTER TABLE public.appointments ADD COLUMN slot_id uuid REFERENCES public.vet_slots(id);
CREATE UNIQUE INDEX appointments_active_slot_uniq ON public.appointments(slot_id) WHERE slot_id IS NOT NULL AND status <> 'cancelled';
GRANT SELECT ON public.veterinarians TO authenticated;

-- Atomic booking: locks the slot, prevents double-booking, creates a confirmed appointment for the caller.
CREATE OR REPLACE FUNCTION public.book_slot(_slot_id uuid, _pet_id uuid, _intake_id uuid, _conversation_id uuid, _appointment_type text, _notes text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.vet_slots; appt uuid; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not signed in' USING ERRCODE = '42501'; END IF;
  IF _pet_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM pets WHERE id = _pet_id AND user_id = uid) THEN RAISE EXCEPTION 'pet not found' USING ERRCODE = '42501'; END IF;
  IF _conversation_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM conversations WHERE id = _conversation_id AND user_id = uid) THEN _conversation_id := NULL; END IF;
  IF _intake_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM veterinary_intakes WHERE id = _intake_id AND user_id = uid) THEN _intake_id := NULL; END IF;
  SELECT * INTO s FROM vet_slots WHERE id = _slot_id FOR UPDATE;
  IF NOT FOUND OR s.booked OR s.starts_at < now() THEN RAISE EXCEPTION 'slot unavailable' USING ERRCODE = 'P0001'; END IF;
  UPDATE vet_slots SET booked = true WHERE id = _slot_id;
  INSERT INTO appointments (user_id, pet_id, intake_id, conversation_id, requested_at, appointment_type, status, notes, veterinarian_id, slot_id)
  VALUES (uid, _pet_id, _intake_id, _conversation_id, s.starts_at, left(coalesce(_appointment_type,'Consultation'),60), 'confirmed', left(coalesce(_notes,''),2000), s.veterinarian_id, _slot_id)
  RETURNING id INTO appt;
  RETURN appt;
END $$;
REVOKE ALL ON FUNCTION public.book_slot(uuid,uuid,uuid,uuid,text,text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.book_slot(uuid,uuid,uuid,uuid,text,text) TO authenticated;

-- Free the slot again when an appointment is cancelled.
CREATE OR REPLACE FUNCTION public.release_slot_on_cancel() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.slot_id IS NOT NULL AND NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    UPDATE vet_slots SET booked = false WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER appointments_release_slot AFTER UPDATE OF status ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.release_slot_on_cancel();

-- Keeps demo availability rolling: staff/admin or server can top up 21 days of open weekday slots.
CREATE OR REPLACE FUNCTION public.ensure_demo_slots() RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO vet_slots (veterinarian_id, starts_at, duration_min, is_demo)
  SELECT v.id, (d::date + t)::timestamp AT TIME ZONE 'UTC', 30, true
  FROM veterinarians v
  CROSS JOIN generate_series(current_date + 1, current_date + 21, interval '1 day') d
  CROSS JOIN (VALUES (time '14:00'),(time '14:30'),(time '15:30'),(time '16:00'),(time '18:00'),(time '19:30'),(time '20:00'),(time '21:00')) AS h(t)
  WHERE v.is_demo AND v.active AND extract(isodow FROM d) < 7
    AND (abs(hashtext(v.slug || d::text || t::text)) % 3) <> 0
  ON CONFLICT (veterinarian_id, starts_at) DO NOTHING;
$$;
GRANT EXECUTE ON FUNCTION public.ensure_demo_slots() TO anon, authenticated;

INSERT INTO public.veterinarians (slug, name, title, specialty, species, interests, languages, years_experience, bio, appointment_types, availability, initials) VALUES
('demo-general','Dr. Maren Holloway','DVM · General Practice (Demo)','general',ARRAY['dog','cat','rabbit','guinea pig'],ARRAY['preventive care','vaccinations','nutrition','senior pets'],ARRAY['English','Spanish'],12,'Fictional demo veterinarian. Focuses on everyday health checks, vaccinations and first assessment of new symptoms.',ARRAY['Consultation','Routine checkup','Vaccination','Follow-up'],'Mon–Sat','MH'),
('demo-emergency','Dr. Tobias Vance','DVM · Emergency & Urgent Care (Demo)','emergency',ARRAY['dog','cat','rabbit','ferret','bird'],ARRAY['trauma','acute illness','toxin exposure','stabilisation'],ARRAY['English','German'],9,'Fictional demo veterinarian. Sees same-day urgent cases and coordinates emergency stabilisation.',ARRAY['Urgent visit','Consultation'],'Mon–Sat, same-day urgent slots','TV'),
('demo-derm','Dr. Aiko Brennan','DVM · Veterinary Dermatology (Demo)','dermatology',ARRAY['dog','cat','rabbit'],ARRAY['itching','hair loss','skin lesions','ear problems','allergies'],ARRAY['English','Japanese'],8,'Fictional demo veterinarian. Works with skin, coat and ear concerns.',ARRAY['Consultation','Follow-up'],'Mon–Fri','AB'),
('demo-internal','Dr. Rafael Ostrova','DVM · Internal Medicine (Demo)','internal_medicine',ARRAY['dog','cat'],ARRAY['vomiting and diarrhoea','appetite changes','weight loss','chronic conditions'],ARRAY['English','Russian','Portuguese'],15,'Fictional demo veterinarian. Investigates digestive, urinary and long-term medical concerns.',ARRAY['Consultation','Follow-up'],'Mon–Fri','RO'),
('demo-surgery','Dr. Elise Marchetti','DVM · Surgery (Demo)','surgery',ARRAY['dog','cat','rabbit'],ARRAY['lameness','lumps','wounds','post-operative checks','dental surgery'],ARRAY['English','Italian','French'],11,'Fictional demo veterinarian. Assesses surgical concerns such as lumps, wounds and mobility problems.',ARRAY['Consultation','Follow-up'],'Tue–Sat','EM'),
('demo-exotics','Dr. Noor Castellan','DVM · Exotic & Small Mammal Medicine (Demo)','exotics',ARRAY['rabbit','guinea pig','hamster','ferret','bird','reptile','chinchilla'],ARRAY['rabbit gut stasis concerns','dental problems in small mammals','husbandry','reduced appetite'],ARRAY['English','Arabic','Spanish'],10,'Fictional demo veterinarian. Focuses on rabbits, small mammals, birds and reptiles.',ARRAY['Consultation','Urgent visit','Routine checkup','Follow-up'],'Mon–Sat','NC');

SELECT public.ensure_demo_slots();

INSERT INTO public.knowledge_documents (category, title, content) VALUES
('Clinic','About Willowbrook Demo Veterinary Clinic','DEMO / FICTIONAL CLINIC for the Contra × Lovable Challenge — not a real medical facility. Willowbrook Demo Veterinary Clinic is a fictional companion-animal and exotics clinic used to demonstrate Love Vet AI. It offers general practice, urgent care, dermatology, internal medicine, surgery and exotic/small mammal medicine. Contact (fictional): hello@willowbrook-demo.example, phone +1 555 0100 (demo number, not monitored).'),
('Hours','Opening hours','DEMO DATA. Willowbrook Demo Veterinary Clinic opening hours: Monday to Friday 08:00–18:00, Saturday 09:00–14:00, Sunday closed. Online booking through Love Vet AI shows the available demo appointment times for each veterinarian.'),
('Services','Services','DEMO DATA. Services: wellness exams and routine checkups; vaccinations; consultations for new symptoms; urgent same-day visits; dermatology (skin, coat, ears); internal medicine (digestive, urinary, appetite and weight concerns); surgery consultations (lumps, wounds, lameness, dental); exotic and small mammal medicine (rabbits, guinea pigs, hamsters, chinchillas, ferrets, birds, reptiles).'),
('Species','Supported animal types','DEMO DATA. The clinic sees dogs, cats, rabbits, guinea pigs, hamsters, chinchillas, ferrets, pet birds and reptiles. Horses and farm animals are not seen at this demo clinic.'),
('Appointments','Appointment types and durations','DEMO DATA. Appointment types: Consultation 30 minutes; Routine checkup 30 minutes; Vaccination 15–30 minutes; Follow-up 30 minutes; Urgent visit 30 minutes (same-day where available). Appointments booked through Love Vet AI are confirmed immediately in a reserved demo time slot.'),
('Policies','Appointment and cancellation policy','DEMO DATA. Please arrive 10 minutes early. Appointments can be cancelled from your Pet Owner Account while they are upcoming; please cancel at least 24 hours in advance so the time can be offered to another animal. Late arrivals over 15 minutes may need to be rescheduled.'),
('Preparation','Visit preparation','DEMO DATA. Before the visit: bring previous medical records and a list of current medications or supplements; bring dogs on a lead and cats, rabbits and small mammals in a secure carrier; for rabbits and small mammals bring a sample of their usual food and hay; note when symptoms started and any changes in eating, drinking, droppings or behaviour. Photos or videos of the problem are helpful.'),
('Emergency','Emergency guidance','DEMO DATA. The demo clinic is not an emergency service. If your animal has difficulty breathing, collapse, seizures, heavy bleeding, suspected poisoning, a bloated abdomen, inability to urinate, severe trauma, pale gums, or a rabbit has not eaten or passed droppings for 12 hours or more, contact the nearest emergency veterinary hospital immediately. Do not wait for an online appointment.'),
('Veterinarians','Our demo veterinarians','DEMO DATA — fictional people. Dr. Maren Holloway (general practice; dogs, cats, rabbits, guinea pigs; English, Spanish). Dr. Tobias Vance (emergency and urgent care; English, German). Dr. Aiko Brennan (dermatology; English, Japanese). Dr. Rafael Ostrova (internal medicine; dogs and cats; English, Russian, Portuguese). Dr. Elise Marchetti (surgery; English, Italian, French). Dr. Noor Castellan (exotic and small mammal medicine incl. rabbits, birds, reptiles; English, Arabic, Spanish).'),
('FAQ','Frequently asked questions','DEMO DATA. Q: Does Love Vet AI diagnose my pet? A: No. It organises your information and helps you reach the right veterinarian; a veterinarian decides. Q: Can I book without an account? A: You can chat as a guest; booking, saving cases and uploading videos need a free account. Q: Can I send photos or videos? A: Yes, they are stored privately and shared with clinic staff for your case. Q: Prices? A: Prices are not listed for the demo clinic.');