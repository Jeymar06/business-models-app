create table if not exists public.barberos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  barberia_id uuid not null references public.barberias(id) on delete cascade,
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  precio numeric(10, 2) not null,
  duracion_min integer not null default 30 check (duracion_min > 0),
  barberia_id uuid not null references public.barberias(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.disponibilidad (
  id uuid primary key default gen_random_uuid(),
  barbero_id uuid not null references public.barberos(id) on delete cascade,
  dia_semana integer not null check (dia_semana between 0 and 6),
  hora_inicio time not null,
  hora_fin time not null,
  check (hora_inicio < hora_fin)
);

create index if not exists barberos_barberia_id_idx on public.barberos(barberia_id);
create index if not exists servicios_barberia_id_idx on public.servicios(barberia_id);
create index if not exists disponibilidad_barbero_id_idx on public.disponibilidad(barbero_id);
