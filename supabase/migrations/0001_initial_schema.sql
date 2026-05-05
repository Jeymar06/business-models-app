create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  type text not null default 'canvas',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.canvas_blocks (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.business_models(id) on delete cascade,
  block_type text not null check (
    block_type in (
      'keyPartners',
      'keyActivities',
      'keyResources',
      'valuePropositions',
      'customerRelationships',
      'channels',
      'customerSegments',
      'costStructure',
      'revenueStreams'
    )
  ),
  content jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (model_id, block_type)
);

alter table public.profiles enable row level security;
alter table public.business_models enable row level security;
alter table public.canvas_blocks enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can read their own business models"
  on public.business_models
  for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can create business models"
  on public.business_models
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own business models"
  on public.business_models
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own business models"
  on public.business_models
  for delete
  using (auth.uid() = user_id);

create policy "Users can read canvas blocks for accessible models"
  on public.canvas_blocks
  for select
  using (
    exists (
      select 1
      from public.business_models
      where business_models.id = canvas_blocks.model_id
        and (business_models.user_id = auth.uid() or business_models.user_id is null)
    )
  );

create policy "Users can create canvas blocks for their models"
  on public.canvas_blocks
  for insert
  with check (
    exists (
      select 1
      from public.business_models
      where business_models.id = canvas_blocks.model_id
        and business_models.user_id = auth.uid()
    )
  );

create policy "Users can update canvas blocks for their models"
  on public.canvas_blocks
  for update
  using (
    exists (
      select 1
      from public.business_models
      where business_models.id = canvas_blocks.model_id
        and business_models.user_id = auth.uid()
    )
  );

create policy "Users can delete canvas blocks for their models"
  on public.canvas_blocks
  for delete
  using (
    exists (
      select 1
      from public.business_models
      where business_models.id = canvas_blocks.model_id
        and business_models.user_id = auth.uid()
    )
  );

create index if not exists business_models_user_id_idx
  on public.business_models(user_id);

create index if not exists canvas_blocks_model_id_idx
  on public.canvas_blocks(model_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
