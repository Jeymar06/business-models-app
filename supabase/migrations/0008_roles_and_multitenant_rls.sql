alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists role text not null default 'client';
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('client', 'admin', 'superadmin'));

alter table public.barberias add column if not exists estado text not null default 'activa';
alter table public.barberias drop constraint if exists barberias_estado_check;
alter table public.barberias add constraint barberias_estado_check check (estado in ('pendiente', 'activa', 'suspendida'));

update public.profiles
set email = auth.users.email
from auth.users
where profiles.id = auth.users.id
  and (profiles.email is null or profiles.email like 'pending-email-%');

update public.profiles
set email = 'pending-email-' || id::text || '@example.local'
where email is null;

alter table public.profiles alter column email set not null;

update public.profiles
set role = 'superadmin', updated_at = now()
where lower(email) = 'jeidertorres3@gmail.com';

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'superadmin'
      and lower(email) = 'jeidertorres3@gmail.com'
  )
$$;

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.email, 'pending-email-' || new.id::text || '@example.local'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    case
      when lower(coalesce(new.email, '')) = 'jeidertorres3@gmail.com' then 'superadmin'
      else 'client'
    end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    role = case
      when lower(excluded.email) = 'jeidertorres3@gmail.com' then 'superadmin'
      else public.profiles.role
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.ensure_profile_for_current_user()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  profile public.profiles;
  jwt_email text := auth.jwt() ->> 'email';
  jwt_name text := coalesce(auth.jwt() #>> '{user_metadata,full_name}', auth.jwt() #>> '{user_metadata,name}');
  jwt_avatar text := auth.jwt() #>> '{user_metadata,avatar_url}';
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    auth.uid(),
    coalesce(jwt_email, 'pending-email-' || auth.uid()::text || '@example.local'),
    jwt_name,
    jwt_avatar,
    case when lower(coalesce(jwt_email, '')) = 'jeidertorres3@gmail.com' then 'superadmin' else 'client' end
  )
  on conflict (id) do update
  set
    email = coalesce(excluded.email, public.profiles.email),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    role = case
      when lower(coalesce(excluded.email, public.profiles.email)) = 'jeidertorres3@gmail.com' then 'superadmin'
      else public.profiles.role
    end,
    updated_at = now()
  returning * into profile;

  return profile;
end;
$$;

create or replace function public.promote_barberia_owner_to_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set role = 'admin', updated_at = now()
  where id = new.admin_id
    and role = 'client'
    and lower(email) <> 'jeidertorres3@gmail.com';

  return new;
end;
$$;

drop trigger if exists on_barberia_created_promote_admin on public.barberias;

create trigger on_barberia_created_promote_admin
  after insert on public.barberias
  for each row execute function public.promote_barberia_owner_to_admin();

alter table public.profiles enable row level security;
alter table public.barberias enable row level security;
alter table public.barberos enable row level security;
alter table public.servicios enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.citas enable row level security;
alter table public.notificaciones enable row level security;

drop policy if exists "profiles_select_by_role" on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;
drop policy if exists "profiles_select_self_or_superadmin" on public.profiles;
drop policy if exists "profiles_update_self_or_superadmin" on public.profiles;

drop policy if exists "barberias_select_by_owner" on public.barberias;
drop policy if exists "barberias_write_superadmin" on public.barberias;
drop policy if exists "barberias_public_read" on public.barberias;
drop policy if exists "barberias_select_marketplace" on public.barberias;
drop policy if exists "barberias_insert_own" on public.barberias;
drop policy if exists "barberias_update_owner_or_superadmin" on public.barberias;
drop policy if exists "barberias_delete_superadmin" on public.barberias;

drop policy if exists "barberos_public_read" on public.barberos;
drop policy if exists "barberos_admin_write" on public.barberos;
drop policy if exists "barberos_select_marketplace" on public.barberos;
drop policy if exists "barberos_insert_owner_or_superadmin" on public.barberos;
drop policy if exists "barberos_update_owner_or_superadmin" on public.barberos;
drop policy if exists "barberos_delete_owner_or_superadmin" on public.barberos;

drop policy if exists "servicios_public_read" on public.servicios;
drop policy if exists "servicios_admin_write" on public.servicios;
drop policy if exists "servicios_select_marketplace" on public.servicios;
drop policy if exists "servicios_insert_owner_or_superadmin" on public.servicios;
drop policy if exists "servicios_update_owner_or_superadmin" on public.servicios;
drop policy if exists "servicios_delete_owner_or_superadmin" on public.servicios;

drop policy if exists "disponibilidad_public_read" on public.disponibilidad;
drop policy if exists "disponibilidad_admin_write" on public.disponibilidad;
drop policy if exists "disponibilidad_select_marketplace" on public.disponibilidad;
drop policy if exists "disponibilidad_insert_owner_or_superadmin" on public.disponibilidad;
drop policy if exists "disponibilidad_update_owner_or_superadmin" on public.disponibilidad;
drop policy if exists "disponibilidad_delete_owner_or_superadmin" on public.disponibilidad;

drop policy if exists "citas_select_by_role" on public.citas;
drop policy if exists "citas_client_insert" on public.citas;
drop policy if exists "citas_admin_update" on public.citas;
drop policy if exists "citas_select_by_role_v2" on public.citas;
drop policy if exists "citas_insert_own" on public.citas;
drop policy if exists "citas_update_by_role" on public.citas;
drop policy if exists "citas_delete_by_role" on public.citas;

drop policy if exists "notificaciones_admin_read" on public.notificaciones;
drop policy if exists "notificaciones_select_by_role" on public.notificaciones;

create policy "profiles_select_self_or_superadmin"
  on public.profiles for select
  using (auth.uid() = id or public.is_superadmin());

create policy "profiles_update_self_or_superadmin"
  on public.profiles for update
  using (auth.uid() = id or public.is_superadmin())
  with check (
    public.is_superadmin()
    or (
      auth.uid() = id
      and role = public.current_user_role()
    )
  );

create policy "barberias_select_marketplace"
  on public.barberias for select
  using (estado = 'activa' or admin_id = auth.uid() or public.is_superadmin());

create policy "barberias_insert_own"
  on public.barberias for insert
  with check (admin_id = auth.uid() or public.is_superadmin());

create policy "barberias_update_owner_or_superadmin"
  on public.barberias for update
  using (public.is_superadmin() or public.is_admin_of_barberia(id))
  with check (public.is_superadmin() or (admin_id = auth.uid() and public.current_user_role() = 'admin'));

create policy "barberias_delete_superadmin"
  on public.barberias for delete
  using (public.is_superadmin());

create policy "barberos_select_marketplace"
  on public.barberos for select
  using (
    public.is_superadmin()
    or exists (
      select 1 from public.barberias
      where barberias.id = barberos.barberia_id
        and (barberias.estado = 'activa' or barberias.admin_id = auth.uid())
    )
  );

create policy "barberos_insert_owner_or_superadmin"
  on public.barberos for insert
  with check (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "barberos_update_owner_or_superadmin"
  on public.barberos for update
  using (public.is_superadmin() or public.is_admin_of_barberia(barberia_id))
  with check (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "barberos_delete_owner_or_superadmin"
  on public.barberos for delete
  using (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "servicios_select_marketplace"
  on public.servicios for select
  using (
    public.is_superadmin()
    or exists (
      select 1 from public.barberias
      where barberias.id = servicios.barberia_id
        and (barberias.estado = 'activa' or barberias.admin_id = auth.uid())
    )
  );

create policy "servicios_insert_owner_or_superadmin"
  on public.servicios for insert
  with check (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "servicios_update_owner_or_superadmin"
  on public.servicios for update
  using (public.is_superadmin() or public.is_admin_of_barberia(barberia_id))
  with check (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "servicios_delete_owner_or_superadmin"
  on public.servicios for delete
  using (public.is_superadmin() or public.is_admin_of_barberia(barberia_id));

create policy "disponibilidad_select_marketplace"
  on public.disponibilidad for select
  using (
    public.is_superadmin()
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = disponibilidad.barbero_id
        and (barberias.estado = 'activa' or barberias.admin_id = auth.uid())
    )
  );

create policy "disponibilidad_insert_owner_or_superadmin"
  on public.disponibilidad for insert
  with check (
    public.is_superadmin()
    or exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.is_admin_of_barberia(barberos.barberia_id)
    )
  );

create policy "disponibilidad_update_owner_or_superadmin"
  on public.disponibilidad for update
  using (
    public.is_superadmin()
    or exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.is_admin_of_barberia(barberos.barberia_id)
    )
  )
  with check (
    public.is_superadmin()
    or exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.is_admin_of_barberia(barberos.barberia_id)
    )
  );

create policy "disponibilidad_delete_owner_or_superadmin"
  on public.disponibilidad for delete
  using (
    public.is_superadmin()
    or exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.is_admin_of_barberia(barberos.barberia_id)
    )
  );

create policy "citas_select_by_role_v2"
  on public.citas for select
  using (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  );

create policy "citas_insert_own"
  on public.citas for insert
  with check (cliente_id = auth.uid() or public.is_superadmin());

create policy "citas_update_by_role"
  on public.citas for update
  using (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  )
  with check (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  );

create policy "citas_delete_by_role"
  on public.citas for delete
  using (
    public.is_superadmin()
    or cliente_id = auth.uid()
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  );

create policy "notificaciones_select_by_role"
  on public.notificaciones for select
  using (
    public.is_superadmin()
    or exists (
      select 1
      from public.citas
      where citas.id = notificaciones.cita_id
        and citas.cliente_id = auth.uid()
    )
    or exists (
      select 1
      from public.citas
      join public.barberos on barberos.id = citas.barbero_id
      join public.barberias on barberias.id = barberos.barberia_id
      where citas.id = notificaciones.cita_id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  );
