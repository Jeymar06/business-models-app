create extension if not exists btree_gist;

alter table public.citas add column if not exists barberia_id uuid references public.barberias(id) on delete cascade;
alter table public.citas add column if not exists hora_inicio time;
alter table public.citas add column if not exists hora_fin time;
alter table public.citas add column if not exists notas text;

update public.citas
set barberia_id = barberos.barberia_id
from public.barberos
where citas.barbero_id = barberos.id
  and citas.barberia_id is null;

update public.citas
set hora_inicio = hora
where hora_inicio is null
  and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'citas'
      and column_name = 'hora'
  );

update public.citas
set hora_inicio = coalesce(hora_inicio, '09:00'::time);

update public.citas
set hora_fin = hora_inicio + make_interval(mins => coalesce(servicios.duracion_min, 30))
from public.servicios
where citas.servicio_id = servicios.id
  and citas.hora_fin is null;

update public.citas
set hora_fin = hora_inicio + interval '30 minutes'
where hora_fin is null;

alter table public.citas alter column barberia_id set not null;
alter table public.citas alter column hora_inicio set not null;
alter table public.citas alter column hora_fin set not null;

alter table public.citas drop constraint if exists citas_barbero_id_fecha_hora_key;
alter table public.citas drop constraint if exists citas_estado_check;
alter table public.citas add constraint citas_estado_check
  check (estado in ('pendiente', 'confirmada', 'cancelada', 'completada'));

alter table public.citas drop constraint if exists citas_barbero_id_fkey;
alter table public.citas add constraint citas_barbero_id_fkey
  foreign key (barbero_id) references public.barberos(id) on delete restrict;

alter table public.citas drop constraint if exists citas_servicio_id_fkey;
alter table public.citas add constraint citas_servicio_id_fkey
  foreign key (servicio_id) references public.servicios(id) on delete restrict;

create index if not exists citas_cliente_id_idx on public.citas(cliente_id);
create index if not exists citas_barberia_id_idx on public.citas(barberia_id);
create index if not exists citas_barbero_fecha_idx on public.citas(barbero_id, fecha);
create index if not exists citas_fecha_hora_inicio_idx on public.citas(fecha, hora_inicio);
create index if not exists citas_estado_idx on public.citas(estado);

drop index if exists citas_no_double_booking_idx;
create unique index citas_no_double_booking_idx
  on public.citas(barbero_id, fecha, hora_inicio)
  where estado in ('pendiente', 'confirmada');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_citas_updated_at on public.citas;
create trigger set_citas_updated_at
  before update on public.citas
  for each row execute function public.set_updated_at();

create or replace function public.is_admin_of_barberia(barberia_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.barberias
    where id = barberia_id
      and admin_id = auth.uid()
      and public.current_user_role() = 'admin'
  )
$$;

create or replace function public.validate_cita_integrity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  barbero_barberia uuid;
  servicio_barberia uuid;
begin
  if tg_op = 'INSERT' then
    if new.fecha < current_date then
      raise exception 'No puedes crear una cita en una fecha pasada.';
    end if;

    select barberia_id into barbero_barberia
    from public.barberos
    where id = new.barbero_id and activo = true;

    select barberia_id into servicio_barberia
    from public.servicios
    where id = new.servicio_id and activo = true;

    if barbero_barberia is null or servicio_barberia is null then
      raise exception 'El barbero o servicio no esta disponible.';
    end if;

    if barbero_barberia <> new.barberia_id or servicio_barberia <> new.barberia_id then
      raise exception 'La cita no coincide con la barberia seleccionada.';
    end if;

    if exists (
      select 1
      from public.citas
      where cliente_id = new.cliente_id
        and fecha = new.fecha
        and hora_inicio = new.hora_inicio
        and estado in ('pendiente', 'confirmada')
    ) then
      raise exception 'Ya tienes una cita en ese horario.';
    end if;
  end if;

  if tg_op = 'UPDATE' then
    if not public.is_superadmin()
      and not public.is_admin_of_barberia(old.barberia_id)
      and auth.uid() = old.cliente_id
      and not (old.estado = 'pendiente' and new.estado = 'cancelada')
    then
      raise exception 'Solo puedes cancelar citas pendientes.';
    end if;

    if not public.is_superadmin()
      and public.is_admin_of_barberia(old.barberia_id)
      and (
        new.cliente_id <> old.cliente_id
        or new.barberia_id <> old.barberia_id
        or new.barbero_id <> old.barbero_id
        or new.servicio_id <> old.servicio_id
        or new.fecha <> old.fecha
        or new.hora_inicio <> old.hora_inicio
        or new.hora_fin <> old.hora_fin
      )
    then
      raise exception 'No puedes modificar los datos principales de la cita.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_cita_integrity_trigger on public.citas;
create trigger validate_cita_integrity_trigger
  before insert or update on public.citas
  for each row execute function public.validate_cita_integrity();

alter table public.citas enable row level security;

drop policy if exists "citas_select_by_role_v2" on public.citas;
drop policy if exists "citas_insert_own" on public.citas;
drop policy if exists "citas_update_by_role" on public.citas;
drop policy if exists "citas_delete_by_role" on public.citas;
drop policy if exists "citas_select_booking_phase" on public.citas;
drop policy if exists "citas_insert_booking_phase" on public.citas;
drop policy if exists "citas_update_booking_phase" on public.citas;

create policy "citas_select_booking_phase"
  on public.citas for select
  using (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or public.is_admin_of_barberia(barberia_id)
  );

create policy "citas_insert_booking_phase"
  on public.citas for insert
  with check (
    public.is_superadmin()
    or cliente_id = auth.uid()
  );

create policy "citas_update_booking_phase"
  on public.citas for update
  using (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or public.is_admin_of_barberia(barberia_id)
  )
  with check (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or public.is_admin_of_barberia(barberia_id)
  );

drop view if exists public.citas_con_detalles;
create view public.citas_con_detalles as
select
  citas.id as cita_id,
  citas.cliente_id,
  profiles.full_name as nombre_cliente,
  profiles.email as email_cliente,
  citas.barberia_id,
  barberias.nombre as nombre_barberia,
  barberias.admin_id,
  citas.barbero_id,
  barberos.nombre as nombre_barbero,
  citas.servicio_id,
  servicios.nombre as nombre_servicio,
  servicios.precio,
  servicios.duracion_min,
  citas.fecha,
  citas.hora_inicio,
  citas.hora_fin,
  citas.estado,
  citas.notas,
  citas.created_at,
  citas.updated_at
from public.citas
join public.profiles on profiles.id = citas.cliente_id
join public.barberias on barberias.id = citas.barberia_id
join public.barberos on barberos.id = citas.barbero_id
join public.servicios on servicios.id = citas.servicio_id;
