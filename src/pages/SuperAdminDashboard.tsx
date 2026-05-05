import { Building2, CalendarDays, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface Counts {
  barberias: number;
  profiles: number;
  citas: number;
}

export function SuperAdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ barberias: 0, profiles: 0, citas: 0 });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void Promise.all([
      supabase.from('barberias').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('citas').select('id', { count: 'exact', head: true }),
    ]).then(([barberias, profiles, citas]) => {
      setCounts({
        barberias: barberias.count ?? 0,
        profiles: profiles.count ?? 0,
        citas: citas.count ?? 0,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Superadmin</p>
        <h1 className="text-3xl font-bold text-ink">Gestion global</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={<Building2 size={18} />} label="Barberias" value={counts.barberias} />
        <Metric icon={<Users size={18} />} label="Usuarios" value={counts.profiles} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={counts.citas} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-2 text-lg font-semibold text-ink">Operacion</h2>
        <p className="text-slate-600">Desde Supabase puedes crear barberias y asignar admins. Las politicas RLS limitan lo que cada rol puede consultar.</p>
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
