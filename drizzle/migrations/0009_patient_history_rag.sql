CREATE TABLE public.patient_history_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  conversation_id uuid,
  appointment_id uuid,
  veterinarian_id uuid,
  clinic_id uuid,
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  content text NOT NULL,
  embedding extensions.vector(3072),
  case_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_type, source_id)
);
CREATE INDEX patient_history_pet_idx ON public.patient_history_chunks (pet_id, user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_history_chunks TO authenticated;
GRANT ALL ON public.patient_history_chunks TO service_role;
ALTER TABLE public.patient_history_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own history" ON public.patient_history_chunks FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.pets p WHERE p.id = pet_id AND p.user_id = auth.uid()));
CREATE POLICY "staff read history" ON public.patient_history_chunks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));

-- Private, authorization-scoped semantic retrieval over ONE pet's history. SECURITY INVOKER: RLS applies before ranking.
CREATE OR REPLACE FUNCTION public.match_patient_history(query_embedding extensions.vector(3072), _pet_id uuid, _exclude_conversation uuid DEFAULT NULL, match_count int DEFAULT 6, min_similarity float DEFAULT 0.5)
RETURNS TABLE (id uuid, conversation_id uuid, appointment_id uuid, veterinarian_id uuid, source_type text, source_id uuid, content text, case_date timestamptz, similarity float)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, extensions AS $$
  SELECT c.id, c.conversation_id, c.appointment_id, c.veterinarian_id, c.source_type, c.source_id, c.content, c.case_date,
         1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.patient_history_chunks c
  WHERE c.pet_id = _pet_id
    AND c.embedding IS NOT NULL
    AND (c.user_id = auth.uid() OR public.has_role(auth.uid(), 'staff'))
    AND (_exclude_conversation IS NULL OR c.conversation_id IS DISTINCT FROM _exclude_conversation)
    AND 1 - (c.embedding <=> query_embedding) >= min_similarity
  ORDER BY c.embedding <=> query_embedding
  LIMIT least(match_count, 12)
$$;
REVOKE ALL ON FUNCTION public.match_patient_history(extensions.vector, uuid, uuid, int, float) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_patient_history(extensions.vector, uuid, uuid, int, float) TO authenticated, service_role;