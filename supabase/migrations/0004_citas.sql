create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  barbero_id uuid not null references public.barberos(id) on delete cascade,
  servicio_id uuid not null references public.servicios(id) on delete cascade,
  fecha date not null,
  hora time not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada', 'completada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (barbero_id, fecha, hora)
);

create table if not exists public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  cita_id uuid not null references public.citas(id) on delete cascade,
  tipo text not null check (tipo in ('confirmacion', 'recordatorio')),
  enviado_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists citas_cliente_id_idx on public.citas(cliente_id);
create index if not exists citas_barbero_fecha_idx on public.citas(barbero_id, fecha);
create index if not exists notificaciones_cita_id_idx on public.notificaciones(cita_id);
