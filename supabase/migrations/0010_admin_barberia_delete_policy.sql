-- Add policy for admin to write (including delete) their own barberia
create policy "barberias_admin_write"
  on public.barberias for all
  using (public.admin_owns_barberia(id))
  with check (public.admin_owns_barberia(id));

-- Create trigger function to revert admin role to client when barberia is deleted
create or replace function public.revert_admin_to_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Update the profile role from 'admin' to 'client' when barberia is deleted
  update public.profiles
  set role = 'client'
  where id = old.admin_id and role = 'admin';
  
  return old;
end;
$$;

-- Create trigger that fires after barberia is deleted
drop trigger if exists revert_admin_on_barberia_delete on public.barberias;
create trigger revert_admin_on_barberia_delete
after delete on public.barberias
for each row
execute function public.revert_admin_to_client();
