update public.profiles as profile
set role = 'admin', updated_at = now()
where profile.role = 'client'
  and lower(profile.email) <> 'jeidertorres3@gmail.com'
  and exists (
    select 1
    from public.barberias
    where barberias.admin_id = profile.id
  );

create or replace function public.delete_my_barberia()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid := auth.uid();
  target_id uuid;
begin
  if owner_id is null then
    raise exception 'Not authenticated';
  end if;

  select id into target_id
  from public.barberias
  where admin_id = owner_id
  limit 1;

  if target_id is null then
    raise exception 'No barberia found for current user';
  end if;

  delete from public.barberias
  where id = target_id
    and admin_id = owner_id;

  update public.profiles
  set role = 'client', updated_at = now()
  where id = owner_id
    and role = 'admin'
    and not exists (
      select 1
      from public.barberias
      where admin_id = owner_id
    );
end;
$$;

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_id uuid := auth.uid();
begin
  if current_id is null then
    raise exception 'Not authenticated';
  end if;

  if public.is_superadmin() then
    raise exception 'Superadmin account cannot be deleted from the app';
  end if;

  delete from auth.users
  where id = current_id;
end;
$$;

grant execute on function public.delete_my_barberia() to authenticated;
grant execute on function public.delete_current_user() to authenticated;
