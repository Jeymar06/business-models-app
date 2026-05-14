drop policy if exists "profiles_select_related_admin" on public.profiles;

create policy "profiles_select_related_admin"
  on public.profiles for select
  using (
    public.is_superadmin()
    or auth.uid() = id
    or exists (
      select 1
      from public.citas
      join public.barberias on barberias.id = citas.barberia_id
      where citas.cliente_id = profiles.id
        and barberias.admin_id = auth.uid()
        and public.current_user_role() = 'admin'
    )
  );
