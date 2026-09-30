CREATE OR REPLACE FUNCTION public.ensure_demo_slots()
 RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $function$
  -- Demo clinic runs on US Eastern time: Mon–Fri 08:00–18:00, Sat 09:00–14:00, Sun closed.
  INSERT INTO vet_slots (veterinarian_id, starts_at, duration_min, is_demo)
  SELECT v.id, (d::date + t)::timestamp AT TIME ZONE 'America/New_York', 30, true
  FROM veterinarians v
  CROSS JOIN generate_series(current_date + 1, current_date + 21, interval '1 day') d
  CROSS JOIN (VALUES (time '08:30'),(time '09:00'),(time '10:00'),(time '11:30'),(time '13:00'),(time '14:30'),(time '15:30'),(time '16:30')) AS h(t)
  WHERE v.is_demo AND v.active AND extract(isodow FROM d) < 7
    AND (extract(isodow FROM d) < 6 OR t < time '13:30')
    AND (abs(hashtext(v.slug || d::text || t::text)) % 3) <> 0
  ON CONFLICT (veterinarian_id, starts_at) DO NOTHING;
$function$;