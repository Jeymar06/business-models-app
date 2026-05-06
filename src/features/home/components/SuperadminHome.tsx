import { Activity, BarChart3, Building2, CalendarDays, Settings, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
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
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
        <p className="text-sm font-medium text-steel">Superadmin</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Panel global</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Resumen general de BarberApp.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HomeMetricCard icon={<Building2 size={18} />} label="Total barberias" value={globalStats.totalBarberias} />
        <HomeMetricCard icon={<ShieldCheck size={18} />} label="Barberias activas" value={globalStats.activeBarberias} />
        <HomeMetricCard icon={<Users size={18} />} label="Total usuarios" value={globalStats.totalUsers} />
        <HomeMetricCard icon={<Users size={18} />} label="Clientes registrados" value={globalStats.registeredClients} />
        <HomeMetricCard icon={<Users size={18} />} label="Admins registrados" value={globalStats.registeredAdmins} />
        <HomeMetricCard icon={<CalendarDays size={18} />} label="Citas del mes" value={globalStats.monthAppointments} />
        <HomeMetricCard icon={<BarChart3 size={18} />} label="Ingresos estimados globales" value={formatCurrency(globalStats.estimatedRevenue)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-steel">Nuevas barberias</p>
              <h2 className="text-2xl font-semibold text-ink">Barberias recientes</h2>
            </div>
            <Link to="/superadmin-dashboard">
              <Button size="sm" variant="secondary">Ver detalle</Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.recentBarberias.length ? (
              data.recentBarberias.map((barberia) => (
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={barberia.id}>
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-ink">{barberia.nombre}</p>
                      <p className="mt-1 text-sm text-slate-500">{barberia.owner_name} · {barberia.owner_email}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      {barberia.ciudad} · {barberia.estado}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState description="No hay barberias nuevas para mostrar en este momento." title="Sin barberias recientes" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
          <div>
            <p className="text-sm font-medium text-steel">Monitoreo</p>
            <h2 className="text-2xl font-semibold text-ink">Actividad reciente</h2>
          </div>

          <div className="mt-5 space-y-3">
            {data.recentActivity.length ? (
              data.recentActivity.map((item) => (
                <article className="rounded-2xl bg-slate-50 px-4 py-3" key={item.id}>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
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
          <p className="text-sm font-medium text-steel">Acciones rapidas</p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-2">
          <Activity className="text-steel" size={18} />
          <h2 className="text-2xl font-semibold text-ink">Alertas globales</h2>
        </div>
        <div className="mt-5 space-y-3">
          {data.globalAlerts.length ? (
            data.globalAlerts.map((alert) => (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600" key={alert}>{alert}</div>
            ))
          ) : (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">No hay alertas globales activas ahora mismo.</div>
          )}
        </div>
      </section>
    </div>
  );
}
