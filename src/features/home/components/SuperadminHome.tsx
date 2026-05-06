import { Activity, BarChart3, Building2, CalendarDays, Settings, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import { HomeMetricCard } from '@/features/home/components/HomeMetricCard';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import type { SuperadminHomeData } from '@/features/home/hooks/useHomeData';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function SuperadminHome({ data }: { data: SuperadminHomeData }) {
  const { globalStats } = data;

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="surface-panel-dark relative overflow-hidden rounded-[32px] px-6 py-7 text-white sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_22%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.12),transparent_18%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">SUPERADMIN</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Control global de BarberApp</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              Monitorea barberias, usuarios, actividad e ingresos estimados desde una vista ejecutiva y clara.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Barberias" value={globalStats.totalBarberias} />
            <HeroStat label="Usuarios" value={globalStats.totalUsers} />
            <HeroStat label="Citas del mes" value={globalStats.monthAppointments} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HomeMetricCard icon={<Building2 size={18} />} label="Total barberias" value={globalStats.totalBarberias} />
        <HomeMetricCard icon={<ShieldCheck size={18} />} label="Barberias activas" value={globalStats.activeBarberias} />
        <HomeMetricCard icon={<Users size={18} />} label="Total usuarios" value={globalStats.totalUsers} />
        <HomeMetricCard icon={<Users size={18} />} label="Clientes registrados" value={globalStats.registeredClients} />
        <HomeMetricCard icon={<Users size={18} />} label="Admins registrados" value={globalStats.registeredAdmins} />
        <HomeMetricCard icon={<CalendarDays size={18} />} label="Citas del mes" value={globalStats.monthAppointments} />
        <HomeMetricCard icon={<BarChart3 size={18} />} label="Ingresos globales" value={formatCurrency(globalStats.estimatedRevenue)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Nuevas barberias</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Barberias recientes</h2>
            </div>
            <Link to="/superadmin-dashboard">
              <Button size="sm" variant="secondary">Ver detalle</Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.recentBarberias.length ? (
              data.recentBarberias.map((barberia) => (
                <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={barberia.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{barberia.nombre}</p>
                        <Badge variant={barberia.estado === 'activa' ? 'confirmed' : 'neutral'}>{barberia.estado}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{barberia.owner_name} · {barberia.owner_email}</p>
                    </div>
                    <div className="text-sm text-slate-500">{barberia.ciudad}</div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState description="No hay barberias nuevas para mostrar en este momento." title="Sin barberias recientes" />
            )}
          </div>
        </div>

        <div className="surface-panel-dark rounded-[28px] p-5 text-white sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Monitoreo</p>
            <h2 className="mt-2 text-2xl font-semibold">Actividad reciente</h2>
          </div>

          <div className="mt-5 space-y-3">
            {data.recentActivity.length ? (
              data.recentActivity.map((item) => (
                <article className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3" key={item.id}>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60">{item.description}</p>
                </article>
              ))
            ) : (
              <EmptyState description="Todavia no hay movimientos recientes para listar." title="Actividad vacia" />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">ACCIONES RAPIDAS</p>
          <h2 className="text-2xl font-semibold text-ink">Atajos globales</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <QuickActionCard description="Consulta el estado general de las barberias registradas." icon={<Building2 size={18} />} title="Ver barberias" to="/superadmin-dashboard" />
          <QuickActionCard description="Revisa usuarios y roles de la plataforma." icon={<Users size={18} />} title="Ver usuarios" to="/superadmin-dashboard" />
          <QuickActionCard description="Accede al historial reciente de citas globales." icon={<CalendarDays size={18} />} title="Ver citas globales" to="/superadmin-dashboard" />
          <QuickActionCard description="Consulta el panorama general de crecimiento y uso." icon={<BarChart3 size={18} />} title="Estadisticas globales" to="/superadmin-dashboard" />
          <QuickActionCard description="Administra controles generales y supervision." icon={<Settings size={18} />} title="Configuracion" to="/superadmin-dashboard" />
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Alertas globales</p>
            <h2 className="text-2xl font-semibold text-ink">Monitoreo general</h2>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {data.globalAlerts.length ? (
            data.globalAlerts.map((alert) => (
              <div className="rounded-2xl bg-black/4 px-4 py-3 text-sm text-slate-600" key={alert}>{alert}</div>
            ))
          ) : (
            <div className="rounded-2xl border border-mint/20 bg-mint/12 px-4 py-3 text-sm text-mint">No hay alertas globales activas ahora mismo.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/48">{label}</p>
    </div>
  );
}
