-- profile + owner role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone, location)
  values (new.id, coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'first_name',''), coalesce(new.raw_user_meta_data->>'last_name',''),
    coalesce(new.raw_user_meta_data->>'phone',''), coalesce(new.raw_user_meta_data->>'location',''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'owner') on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- links
alter table public.uploaded_files add column if not exists intake_id uuid references public.veterinary_intakes(id) on delete set null;
alter table public.clinic_staff_requests add column if not exists conversation_id uuid references public.conversations(id) on delete set null;
alter table public.clinic_staff_requests add column if not exists symptoms text[] not null default '{}';
alter table public.clinic_staff_requests add column if not exists urgency text not null default 'routine';
alter table public.appointments add column if not exists conversation_id uuid references public.conversations(id) on delete set null;
alter table public.appointments add column if not exists owner_email_sent boolean not null default false;
alter table public.triage_results add column if not exists intake_id uuid references public.veterinary_intakes(id) on delete set null;

-- staff read access for escalated cases
create policy "staff read profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'staff'));
create policy "staff read files" on public.uploaded_files for select to authenticated using (public.has_role(auth.uid(),'staff'));
create policy "staff read messages" on public.conversation_messages for select to authenticated using (public.has_role(auth.uid(),'staff'));
create policy "staff read media" on storage.objects for select to authenticated using (bucket_id = 'chat-media' and public.has_role(auth.uid(),'staff'));

-- knowledge retrieval
create or replace function public.match_knowledge(query_embedding extensions.vector(3072), match_count int default 5, min_similarity float default 0.55)
returns table (id uuid, category text, title text, content text, similarity float)
language sql stable security invoker set search_path = public, extensions as $$
  select k.id, k.category, k.title, k.content, 1 - (k.embedding <=> query_embedding) as similarity
  from public.knowledge_documents k
  where k.embedding is not null and 1 - (k.embedding <=> query_embedding) >= min_similarity
  order by k.embedding <=> query_embedding
  limit match_count
$$;
grant execute on function public.match_knowledge(extensions.vector, int, float) to authenticated, anon, service_role;

-- public (guest) Information Desk reads
grant select on public.knowledge_documents to anon;
create policy "anon read knowledge" on public.knowledge_documents for select to anon using (true);