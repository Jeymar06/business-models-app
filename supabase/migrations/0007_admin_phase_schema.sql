alter table public.barberias add column if not exists telefono text;
alter table public.barberias alter column direccion drop not null;

alter table public.barberos add column if not exists activo boolean not null default true;

alter table public.servicios add column if not exists descripcion text;
alter table public.servicios add column if not exists activo boolean not null default true;

create policy "barberias_public_read"
  on public.barberias for select
  using (true);
