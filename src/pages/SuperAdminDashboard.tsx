import { Building2, CalendarDays, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Badge, Button, Pill, useToast } from '@/components/ui';
import { useSuperadminCitas } from '@/features/superadmin/hooks/useSuperadminCitas';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Barberia, Profile, UserRole } from '@/types/supabase.types';

interface Counts {
  barberias: number;
  profiles: number;
  citas: number;
}

export function SuperAdminDashboard() {
  const toast = useToast();
  const [counts, setCounts] = useState<Counts>({ barberias: 0, profiles: 0, citas: 0 });
  const [barberias, setBarberias] = useState<Barberia[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const citasQuery = useSuperadminCitas();

  async function refresh() {
    if (!isSupabaseConfigured) return;

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
    refresh().catch((err) =>
      toast.error(err instanceof Error ? err.message : 'No se pudo cargar superadmin', 'Error'),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateBarberiaEstado(id: string, estado: Barberia['estado']) {
    const { error: updateError } = await supabase.from('barberias').update({ estado } as never).eq('id', id);
    if (updateError) {
      toast.error(updateError.message, 'Error');
      return;
    }
    toast.success(estado === 'activa' ? 'Barbería aprobada.' : 'Barbería suspendida.');
    await refresh();
  }

  async function updateRole(id: string, role: UserRole) {
    const { error: updateError } = await supabase.from('profiles').update({ role } as never).eq('id', id);
    if (updateError) {
      toast.error(updateError.message, 'Error');
      return;
    }
    toast.success(`Rol actualizado a ${role}.`);
    await refresh();
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.10),transparent_20%)]" />
        <div className="relative">
          <Pill tone="gold">Superadmin</Pill>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
            Gestión <span className="font-display-italic text-gold-200">global.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">
            Administra barberías, citas y usuarios desde una vista sobria, operativa y legible.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric icon={<Building2 size={18} />} label="Barberías" value={counts.barberias} />
        <Metric icon={<Users size={18} />} label="Usuarios" value={counts.profiles} />
        <Metric icon={<CalendarDays size={18} />} label="Citas" value={counts.citas} />
      </div>

      <Section eyebrow="Barberías" title="Estado de barberías">
        <div className="space-y-3">
          {barberias.map((barberia) => (
            <article
              className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22 hover:bg-ink/4"
              key={barberia.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-semibold tracking-tight text-ink">
                      {barberia.nombre}
                    </p>
                    <Badge variant={barberia.estado === 'activa' ? 'confirmed' : 'neutral'}>
                      {barberia.estado}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink/55">
                    {barberia.direccion || 'Sin dirección'} · <span className="font-display italic text-ink/45">{barberia.ciudad}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void updateBarberiaEstado(barberia.id, 'activa')} size="sm" variant="gold">
                    Aprobar
                  </Button>
                  <Button onClick={() => void updateBarberiaEstado(barberia.id, 'suspendida')} size="sm" variant="outline-ink">
                    Suspender
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {!barberias.length ? <p className="text-sm text-ink/50">No hay barberías.</p> : null}
        </div>
      </Section>

      <Section eyebrow="Citas" title="Actividad reciente">
        <div className="space-y-3">
          {(citasQuery.data ?? []).slice(0, 20).map((cita) => (
            <article
              className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22"
              key={cita.cita_id}
            >
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
                <div>
                  <p className="font-display text-base font-semibold tracking-tight text-ink">
                    {cita.nombre_barberia}
                  </p>
                  <p className="text-xs text-ink/55">{cita.nombre_cliente || cita.email_cliente}</p>
                </div>
                <p className="text-sm text-ink/68">
                  {cita.nombre_servicio} · <span className="text-ink/85">{cita.nombre_barbero}</span>
                </p>
                <p className="numeric text-sm text-ink/68">
                  {cita.fecha} <span className="text-gold-700">{cita.hora_inicio.slice(0, 5)}</span>
                </p>
                <Badge variant={badgeVariantForStatus(cita.estado)}>{cita.estado}</Badge>
              </div>
            </article>
          ))}
          {!citasQuery.isLoading && !(citasQuery.data ?? []).length ? (
            <p className="text-sm text-ink/50">No hay citas.</p>
          ) : null}
        </div>
      </Section>

      <Section eyebrow="Usuarios" title="Roles y accesos">
        <div className="space-y-3">
          {profiles.map((profile) => (
            <article
              className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22"
              key={profile.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-base font-semibold tracking-tight text-ink">
                    {profile.full_name || profile.email}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">{profile.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      profile.role === 'superadmin' ? 'info' : profile.role === 'admin' ? 'confirmed' : 'neutral'
                    }
                  >
                    {profile.role}
                  </Badge>
                  <select
                    className="h-11 rounded-2xl border border-ink/10 bg-paper px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 hover:border-ink/22 focus:border-gold-500/70 focus:ring-4 focus:ring-gold-200/50 disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/40"
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
          {!profiles.length ? <p className="text-sm text-ink/50">No hay usuarios.</p> : null}
        </div>
      </Section>
    </div>
  );
}

function Section({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return (
    <section className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="eyebrow text-gold-700">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-500/30 hover:shadow-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-500/0 blur-3xl transition-colors duration-500 group-hover:bg-gold-500/12"
      />
      <div className="relative mb-4 flex items-center justify-between gap-3">
        <p className="eyebrow text-ink/45">{label}</p>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/8 bg-ink text-gold-300">
          {icon}
        </div>
      </div>
      <p className="font-display numeric text-5xl font-semibold tracking-tight text-ink">{value}</p>
    </article>
  );
}

function badgeVariantForStatus(status: string) {
  if (status === 'pendiente') return 'pending';
  if (status === 'confirmada') return 'confirmed';
  if (status === 'cancelada') return 'cancelled';
  if (status === 'completada') return 'completed';
  return 'neutral';
}
