alter table public.profiles enable row level security;
alter table public.barberias enable row level security;
alter table public.barberos enable row level security;
alter table public.servicios enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.citas enable row level security;
alter table public.notificaciones enable row level security;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.admin_owns_barberia(barberia uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.barberias
    where id = barberia
      and (admin_id = auth.uid() or public.current_user_role() = 'superadmin')
  )
$$;

create policy "profiles_select_by_role"
  on public.profiles for select
  using (auth.uid() = id or public.current_user_role() = 'superadmin');

create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id);

create policy "barberias_select_by_owner"
  on public.barberias for select
  using (admin_id = auth.uid() or public.current_user_role() = 'superadmin');

create policy "barberias_write_superadmin"
  on public.barberias for all
  using (public.current_user_role() = 'superadmin')
  with check (public.current_user_role() = 'superadmin');

create policy "barberos_public_read"
  on public.barberos for select
  using (true);

create policy "barberos_admin_write"
  on public.barberos for all
  using (public.admin_owns_barberia(barberia_id))
  with check (public.admin_owns_barberia(barberia_id));

create policy "servicios_public_read"
  on public.servicios for select
  using (true);

create policy "servicios_admin_write"
  on public.servicios for all
  using (public.admin_owns_barberia(barberia_id))
  with check (public.admin_owns_barberia(barberia_id));

create policy "disponibilidad_public_read"
  on public.disponibilidad for select
  using (true);

create policy "disponibilidad_admin_write"
  on public.disponibilidad for all
  using (
    exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.admin_owns_barberia(barberos.barberia_id)
    )
  )
  with check (
    exists (
      select 1 from public.barberos
      where barberos.id = disponibilidad.barbero_id
        and public.admin_owns_barberia(barberos.barberia_id)
    )
  );

create policy "citas_select_by_role"
  on public.citas for select
  using (
    cliente_id = auth.uid()
    or public.current_user_role() = 'superadmin'
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
    )
  );

create policy "citas_client_insert"
  on public.citas for insert
  with check (cliente_id = auth.uid());

create policy "citas_admin_update"
  on public.citas for update
  using (
    cliente_id = auth.uid()
    or public.current_user_role() = 'superadmin'
    or exists (
      select 1
      from public.barberos
      join public.barberias on barberias.id = barberos.barberia_id
      where barberos.id = citas.barbero_id
        and barberias.admin_id = auth.uid()
    )
  );

create policy "notificaciones_admin_read"
  on public.notificaciones for select
  using (
    public.current_user_role() = 'superadmin'
    or exists (
      select 1
      from public.citas
      where citas.id = notificaciones.cita_id
        and citas.cliente_id = auth.uid()
    )
  );
