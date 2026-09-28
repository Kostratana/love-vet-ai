create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.conversations to authenticated;
grant all on public.conversations to service_role;
alter table public.conversations enable row level security;
create policy "own conversations" on public.conversations for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'user',
  content text not null default '',
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.conversation_messages(conversation_id, created_at);
grant select, insert, update, delete on public.conversation_messages to authenticated;
grant all on public.conversation_messages to service_role;
alter table public.conversation_messages enable row level security;
create policy "own messages" on public.conversation_messages for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);