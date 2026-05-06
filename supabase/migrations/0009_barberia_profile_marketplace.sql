alter table public.barberias add column if not exists slug text;
alter table public.barberias add column if not exists descripcion text;
alter table public.barberias add column if not exists logo_url text;
alter table public.barberias add column if not exists banner_url text;
alter table public.barberias add column if not exists email_contacto text;
alter table public.barberias add column if not exists sitio_web text;
alter table public.barberias add column if not exists ciudad text;
alter table public.barberias add column if not exists estado_provincia text;
alter table public.barberias add column if not exists pais text;
alter table public.barberias add column if not exists codigo_postal text;
alter table public.barberias add column if not exists latitud numeric(10, 7);
alter table public.barberias add column if not exists longitud numeric(10, 7);
alter table public.barberias add column if not exists activo boolean not null default true;
alter table public.barberias add column if not exists verificada boolean not null default false;
alter table public.barberias add column if not exists acepta_reservas boolean not null default true;
alter table public.barberias add column if not exists horario_apertura time;
alter table public.barberias add column if not exists horario_cierre time;
alter table public.barberias add column if not exists moneda text not null default 'USD';
alter table public.barberias add column if not exists zona_horaria text not null default 'America/Bogota';
alter table public.barberias add column if not exists politica_cancelacion text;
alter table public.barberias add column if not exists tiempo_cancelacion_min integer not null default 1440;
alter table public.barberias add column if not exists visible boolean not null default true;
alter table public.barberias add column if not exists destacado boolean not null default false;

update public.barberias
set
  descripcion = coalesce(descripcion, 'Barberia profesional disponible para reservas en BarberApp.'),
  direccion = coalesce(direccion, 'Direccion pendiente'),
  telefono = coalesce(telefono, '0000000000'),
  ciudad = coalesce(ciudad, 'Ciudad pendiente'),
  pais = coalesce(pais, 'Colombia'),
  moneda = coalesce(moneda, 'USD'),
  zona_horaria = coalesce(zona_horaria, 'America/Bogota'),
  politica_cancelacion = coalesce(politica_cancelacion, 'Puedes cancelar tu cita con al menos 24 horas de anticipacion.'),
  tiempo_cancelacion_min = coalesce(tiempo_cancelacion_min, 1440);

with normalized as (
  select
    id,
    coalesce(
      nullif(
        trim(both '-' from regexp_replace(lower(nombre), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'barberia'
    ) as base_slug
  from public.barberias
  where slug is null or slug = ''
),
ranked as (
  select id, base_slug, row_number() over (partition by base_slug order by id) as rn
  from normalized
)
update public.barberias
set slug = case when ranked.rn = 1 then ranked.base_slug else ranked.base_slug || '-' || ranked.rn::text end
from ranked
where barberias.id = ranked.id;

alter table public.barberias alter column slug set not null;
alter table public.barberias alter column descripcion set not null;
alter table public.barberias alter column direccion set not null;
alter table public.barberias alter column telefono set not null;
alter table public.barberias alter column ciudad set not null;
alter table public.barberias alter column pais set not null;

create unique index if not exists barberias_slug_unique_idx on public.barberias(slug);
create unique index if not exists barberias_admin_id_unique_idx on public.barberias(admin_id);
create index if not exists barberias_ciudad_idx on public.barberias(ciudad);
create index if not exists barberias_pais_idx on public.barberias(pais);
create index if not exists barberias_admin_id_idx on public.barberias(admin_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_barberias_updated_at on public.barberias;

create trigger set_barberias_updated_at
  before update on public.barberias
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('barberias', 'barberias', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "barberia_assets_public_read" on storage.objects;
drop policy if exists "barberia_assets_owner_insert" on storage.objects;
drop policy if exists "barberia_assets_owner_update" on storage.objects;
drop policy if exists "barberia_assets_owner_delete" on storage.objects;

create policy "barberia_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'barberias');

create policy "barberia_assets_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'barberias'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

create policy "barberia_assets_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'barberias'
    and auth.uid()::text = (storage.foldername(name))[2]
  )
  with check (
    bucket_id = 'barberias'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

create policy "barberia_assets_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'barberias'
    and auth.uid()::text = (storage.foldername(name))[2]
  );
