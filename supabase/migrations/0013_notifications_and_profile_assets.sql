alter table public.notificaciones add column if not exists user_id uuid references public.profiles(id) on delete cascade;
alter table public.notificaciones add column if not exists titulo text;
alter table public.notificaciones add column if not exists mensaje text;
alter table public.notificaciones add column if not exists leido_at timestamptz;
alter table public.notificaciones add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.notificaciones drop constraint if exists notificaciones_tipo_check;

update public.notificaciones
set
  user_id = coalesce(user_id, citas.cliente_id),
  titulo = coalesce(titulo, 'Notificacion de cita'),
  mensaje = coalesce(mensaje, 'Tienes una actualizacion relacionada con una cita.'),
  tipo = case when tipo = 'confirmacion' then 'cita_confirmada' else tipo end
from public.citas
where public.notificaciones.cita_id = citas.id
  and public.notificaciones.user_id is null;

update public.notificaciones
set
  titulo = coalesce(titulo, 'Notificacion de cita'),
  mensaje = coalesce(mensaje, 'Tienes una actualizacion relacionada con una cita.'),
  tipo = case when tipo = 'confirmacion' then 'cita_confirmada' else tipo end;

alter table public.notificaciones add constraint notificaciones_tipo_check
  check (tipo in ('cita_creada', 'cita_pendiente', 'cita_confirmada', 'cita_cancelada', 'cita_completada', 'recordatorio', 'sistema'));

create index if not exists notificaciones_user_id_created_at_idx on public.notificaciones(user_id, created_at desc);
create index if not exists notificaciones_user_id_leido_at_idx on public.notificaciones(user_id, leido_at);

alter table public.notificaciones enable row level security;

drop policy if exists "notificaciones_admin_read" on public.notificaciones;
drop policy if exists "notificaciones_select_by_role" on public.notificaciones;
drop policy if exists "notificaciones_select_own_or_superadmin" on public.notificaciones;
drop policy if exists "notificaciones_update_own_or_superadmin" on public.notificaciones;

create policy "notificaciones_select_own_or_superadmin"
  on public.notificaciones for select
  using (user_id = auth.uid() or public.is_superadmin());

create policy "notificaciones_update_own_or_superadmin"
  on public.notificaciones for update
  using (user_id = auth.uid() or public.is_superadmin())
  with check (user_id = auth.uid() or public.is_superadmin());

create or replace function public.create_app_notification(
  target_user_id uuid,
  target_cita_id uuid,
  notification_type text,
  notification_title text,
  notification_message text,
  notification_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_user_id is null then
    return;
  end if;

  insert into public.notificaciones (user_id, cita_id, tipo, titulo, mensaje, metadata)
  values (
    target_user_id,
    target_cita_id,
    notification_type,
    notification_title,
    notification_message,
    coalesce(notification_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.notify_cita_events()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  details record;
  admin_target uuid;
  client_target uuid;
  appointment_label text;
begin
  select
    citas.id,
    citas.cliente_id,
    citas.barberia_id,
    citas.fecha,
    citas.hora_inicio,
    citas.hora_fin,
    citas.estado,
    barberias.nombre as nombre_barberia,
    barberias.admin_id,
    barberos.nombre as nombre_barbero,
    servicios.nombre as nombre_servicio,
    profiles.full_name as nombre_cliente,
    profiles.email as email_cliente
  into details
  from public.citas
  join public.barberias on barberias.id = citas.barberia_id
  join public.barberos on barberos.id = citas.barbero_id
  join public.servicios on servicios.id = citas.servicio_id
  join public.profiles on profiles.id = citas.cliente_id
  where citas.id = new.id;

  admin_target := details.admin_id;
  client_target := details.cliente_id;
  appointment_label := details.nombre_servicio || ' con ' || details.nombre_barbero || ' el ' || details.fecha::text || ' a las ' || left(details.hora_inicio::text, 5);

  if tg_op = 'INSERT' then
    perform public.create_app_notification(
      client_target,
      new.id,
      'cita_pendiente',
      'Cita solicitada',
      'Tu cita en ' || details.nombre_barberia || ' quedo pendiente de confirmacion: ' || appointment_label || '.',
      jsonb_build_object('estado', new.estado, 'barberia_id', new.barberia_id)
    );

    perform public.create_app_notification(
      admin_target,
      new.id,
      'cita_creada',
      'Nueva cita pendiente',
      coalesce(details.nombre_cliente, details.email_cliente) || ' solicito ' || appointment_label || '.',
      jsonb_build_object('estado', new.estado, 'cliente_id', new.cliente_id)
    );

    return new;
  end if;

  if tg_op = 'UPDATE' and old.estado is distinct from new.estado then
    perform public.create_app_notification(
      client_target,
      new.id,
      case
        when new.estado = 'confirmada' then 'cita_confirmada'
        when new.estado = 'cancelada' then 'cita_cancelada'
        when new.estado = 'completada' then 'cita_completada'
        else 'sistema'
      end,
      case
        when new.estado = 'confirmada' then 'Cita confirmada'
        when new.estado = 'cancelada' then 'Cita cancelada'
        when new.estado = 'completada' then 'Cita completada'
        else 'Cita actualizada'
      end,
      'Tu cita en ' || details.nombre_barberia || ' ahora esta ' || new.estado || ': ' || appointment_label || '.',
      jsonb_build_object('estado_anterior', old.estado, 'estado', new.estado, 'barberia_id', new.barberia_id)
    );

    perform public.create_app_notification(
      admin_target,
      new.id,
      case
        when new.estado = 'confirmada' then 'cita_confirmada'
        when new.estado = 'cancelada' then 'cita_cancelada'
        when new.estado = 'completada' then 'cita_completada'
        else 'sistema'
      end,
      'Estado de cita actualizado',
      'La cita de ' || coalesce(details.nombre_cliente, details.email_cliente) || ' ahora esta ' || new.estado || ': ' || appointment_label || '.',
      jsonb_build_object('estado_anterior', old.estado, 'estado', new.estado, 'cliente_id', new.cliente_id)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists notify_cita_events_trigger on public.citas;
create trigger notify_cita_events_trigger
  after insert or update of estado on public.citas
  for each row execute function public.notify_cita_events();

insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "profile_assets_public_read" on storage.objects;
drop policy if exists "profile_assets_owner_insert" on storage.objects;
drop policy if exists "profile_assets_owner_update" on storage.objects;
drop policy if exists "profile_assets_owner_delete" on storage.objects;

create policy "profile_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'profiles');

create policy "profile_assets_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'profiles'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "profile_assets_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'profiles'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'profiles'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "profile_assets_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'profiles'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
