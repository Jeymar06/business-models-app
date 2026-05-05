create table if not exists public.barberias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text not null,
  admin_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists barberias_admin_id_idx on public.barberias(admin_id);
