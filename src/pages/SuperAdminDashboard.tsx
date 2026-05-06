import { Building2, CalendarDays, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Badge, Button } from '@/components/ui';
import { useSuperadminCitas } from '@/features/superadmin/hooks/useSuperadminCitas';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Barberia, Profile, UserRole } from '@/types/supabase.types';

interface Counts {
  barberias: number;
  profiles: number;
  citas: number;
}

export function SuperAdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ barberias: 0, profiles: 0, citas: 0 });
  const [barberias, setBarberias] = useState<Barberia[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const citasQuery = useSuperadminCitas();

  async function refresh() {
    if (!isSupabaseConfigured) return;
    setError(null);

    const [barberiasCount, profilesCount, citasCount, barberiasResult, profilesResult] = await Promise.all([
      supabase.from('barberias').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('citas').select('id', { count: 'exact', head: true }),
      supabase.from('barberias').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);

    if (barberiasResult.error) throw barberiasResult.error;
    if (profilesResult.error) throw profilesResult.error;

    setCounts({
      barberias: barberiasCount.count ?? 0,
      profiles: profilesCount.count ?? 0,
      citas: citasCount.count ?? 0,
    });
    setBarberias(barberiasResult.data as Barberia[]);
    setProfiles(profilesResult.data as Profile[]);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar superadmin'));
  }, []);

  async function updateBarberiaEstado(id: string, estado: Barberia['estado']) {
    const { error: updateError } = await supabase.from('barberias').update({ estado } as never).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refresh();
  }

  async function updateRole(id: string, role: UserRole) {
    const { error: updateError } = await supabase.from('profiles').update({ role } as never).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="surface-panel-dark rounded-[32px] px-6 py-7 text-white sm:px-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-gold">SUPERADMIN</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Gestión global</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">Administra barberías, citas y usuarios desde una vista más sobria, operativa y legible.</p>
      </section>

      {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={<Building2 size={18} />} label="Barberias" value={counts.barberias} />
        <Metric icon={<Users size={18} />} label="Usuarios" value={counts.profiles} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={counts.citas} />
      </div>

      <section className="surface-panel rounded-[28px] p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Barberias</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Estado de barberías</h2>
        </div>
        <div className="space-y-3">
          {barberias.map((barberia) => (
            <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={barberia.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{barberia.nombre}</p>
                    <Badge variant={barberia.estado === 'activa' ? 'confirmed' : 'neutral'}>{barberia.estado}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{barberia.direccion || 'Sin direccion'} · {barberia.ciudad}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void updateBarberiaEstado(barberia.id, 'activa')} size="sm" variant="secondary">Aprobar</Button>
                  <Button onClick={() => void updateBarberiaEstado(barberia.id, 'suspendida')} size="sm" variant="secondary">Suspender</Button>
                </div>
              </div>
            </article>
          ))}
          {!barberias.length ? <p className="text-sm text-slate-500">No hay barberias.</p> : null}
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Citas</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Actividad reciente</h2>
        </div>
        <div className="space-y-3">
          {(citasQuery.data ?? []).slice(0, 20).map((cita) => (
            <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={cita.cita_id}>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-ink">{cita.nombre_barberia}</p>
                  <p className="text-xs text-slate-500">{cita.nombre_cliente || cita.email_cliente}</p>
                </div>
                <p className="text-sm text-slate-600">{cita.nombre_servicio} · {cita.nombre_barbero}</p>
                <p className="text-sm text-slate-600">{cita.fecha} {cita.hora_inicio.slice(0, 5)}</p>
                <Badge variant={badgeVariantForStatus(cita.estado)}>{cita.estado}</Badge>
              </div>
            </article>
          ))}
          {!citasQuery.isLoading && !(citasQuery.data ?? []).length ? <p className="text-sm text-slate-500">No hay citas.</p> : null}
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Usuarios</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Roles y accesos</h2>
        </div>
        <div className="space-y-3">
          {profiles.map((profile) => (
            <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={profile.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-ink">{profile.full_name || profile.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{profile.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={profile.role === 'superadmin' ? 'info' : profile.role === 'admin' ? 'confirmed' : 'neutral'}>{profile.role}</Badge>
                  <select
                    className="h-11 rounded-xl border border-black/8 bg-white px-3 text-sm outline-none focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
                    disabled={profile.email === 'jeidertorres3@gmail.com'}
                    onChange={(event) => void updateRole(profile.id, event.target.value as UserRole)}
                    value={profile.role}
                  >
                    <option value="client">client</option>
                    <option value="admin">admin</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </div>
              </div>
            </article>
          ))}
          {!profiles.length ? <p className="text-sm text-slate-500">No hay usuarios.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="surface-panel rounded-[24px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
          <div className="mt-3 text-3xl font-bold text-ink">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">{icon}</div>
      </div>
    </div>
  );
}

function badgeVariantForStatus(status: string) {
  if (status === 'pendiente') return 'pending';
  if (status === 'confirmada') return 'confirmed';
  if (status === 'cancelada') return 'cancelled';
  if (status === 'completada') return 'completed';
  return 'neutral';
}
