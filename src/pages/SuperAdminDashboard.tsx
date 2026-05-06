import { Building2, CalendarDays, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Superadmin</p>
        <h1 className="text-3xl font-bold text-ink">Gestion global</h1>
      </div>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={<Building2 size={18} />} label="Barberias" value={counts.barberias} />
        <Metric icon={<Users size={18} />} label="Usuarios" value={counts.profiles} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={counts.citas} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-4 text-lg font-semibold text-ink">Barberias</h2>
        <div className="space-y-3">
          {barberias.map((barberia) => (
            <article className="flex flex-col gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between" key={barberia.id}>
              <div>
                <p className="font-semibold text-ink">{barberia.nombre}</p>
                <p className="text-xs text-slate-500">{barberia.direccion || 'Sin direccion'} · {barberia.estado}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void updateBarberiaEstado(barberia.id, 'activa')} size="sm" variant="secondary">Aprobar</Button>
                <Button onClick={() => void updateBarberiaEstado(barberia.id, 'suspendida')} size="sm" variant="secondary">Suspender</Button>
              </div>
            </article>
          ))}
          {!barberias.length ? <p className="text-sm text-slate-500">No hay barberias.</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-4 text-lg font-semibold text-ink">Usuarios</h2>
        <div className="space-y-3">
          {profiles.map((profile) => (
            <article className="flex flex-col gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between" key={profile.id}>
              <div>
                <p className="font-semibold text-ink">{profile.full_name || profile.email}</p>
                <p className="text-xs text-slate-500">{profile.email} · {profile.role}</p>
              </div>
              <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                disabled={profile.email === 'jeidertorres3@gmail.com'}
                onChange={(event) => void updateRole(profile.id, event.target.value as UserRole)}
                value={profile.role}
              >
                <option value="client">client</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 flex items-center gap-2 text-slate-500">{icon}{label}</div>
      <div className="text-3xl font-bold text-ink">{value}</div>
    </div>
  );
}
