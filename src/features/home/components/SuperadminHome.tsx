import { Activity, BarChart3, Building2, CalendarDays, Settings, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, Button, Pill } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import { HomeMetricCard } from '@/features/home/components/HomeMetricCard';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import type { SuperadminHomeData } from '@/features/home/hooks/useHomeData';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export function SuperadminHome({ data }: { data: SuperadminHomeData }) {
  const { globalStats } = data;

  return (
    <div className="space-y-10 animate-fade-up">
      <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_24%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.12),transparent_20%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <Pill tone="gold">Superadmin</Pill>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              Control global de <span className="font-display-italic text-gold-200">Barber Flow.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">
              Monitorea barberías, usuarios, actividad e ingresos estimados desde una vista ejecutiva y clara.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Barberías" value={globalStats.totalBarberias} />
            <HeroStat label="Usuarios" value={globalStats.totalUsers} />
            <HeroStat label="Citas del mes" value={globalStats.monthAppointments} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HomeMetricCard icon={<Building2 size={18} />} label="Total barberías" value={globalStats.totalBarberias} />
        <HomeMetricCard icon={<ShieldCheck size={18} />} label="Barberías activas" value={globalStats.activeBarberias} />
        <HomeMetricCard icon={<Users size={18} />} label="Total usuarios" value={globalStats.totalUsers} />
        <HomeMetricCard icon={<Users size={18} />} label="Clientes registrados" value={globalStats.registeredClients} />
        <HomeMetricCard icon={<Users size={18} />} label="Admins registrados" value={globalStats.registeredAdmins} />
        <HomeMetricCard icon={<CalendarDays size={18} />} label="Citas del mes" value={globalStats.monthAppointments} />
        <HomeMetricCard icon={<BarChart3 size={18} />} label="Ingresos globales" value={formatCurrency(globalStats.estimatedRevenue)} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow text-gold-700">Nuevas barberías</p>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Barberías recientes
              </h2>
            </div>
            <Link to="/superadmin-dashboard">
              <Button size="sm" variant="outline-ink">Ver detalle</Button>
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {data.recentBarberias.length ? (
              data.recentBarberias.map((barberia) => (
                <article className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22 hover:bg-ink/4" key={barberia.id}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-semibold tracking-tight text-ink">{barberia.nombre}</p>
                        <Badge variant={barberia.estado === 'activa' ? 'confirmed' : 'neutral'}>{barberia.estado}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-ink/58">
                        {barberia.owner_name} · <span className="text-ink/40">{barberia.owner_email}</span>
                      </p>
                    </div>
                    <div className="font-display italic text-sm text-ink/55">{barberia.ciudad}</div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState description="No hay barberías nuevas para mostrar en este momento." title="Sin barberías recientes" />
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] p-7 text-cream">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_36%)]" />
          <div className="relative">
            <p className="eyebrow text-gold-300">Monitoreo</p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight">Actividad reciente</h2>
          </div>

          <div className="relative mt-6 space-y-3">
            {data.recentActivity.length ? (
              data.recentActivity.map((item) => (
                <article className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm" key={item.id}>
                  <p className="font-display text-sm font-semibold tracking-tight text-cream">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-cream/60">{item.description}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/14 bg-white/3 px-4 py-6 text-center text-sm text-cream/55">
                Todavía no hay movimientos recientes para listar.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="eyebrow text-gold-300">Acciones rápidas</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Atajos <span className="font-display-italic text-gold-200">globales.</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <QuickActionCard description="Consulta el estado general de las barberías registradas." icon={<Building2 size={18} />} title="Ver barberías" to="/superadmin-dashboard" />
          <QuickActionCard description="Revisa usuarios y roles de la plataforma." icon={<Users size={18} />} title="Ver usuarios" to="/superadmin-dashboard" />
          <QuickActionCard description="Accede al historial reciente de citas globales." icon={<CalendarDays size={18} />} title="Ver citas globales" to="/superadmin-dashboard" />
          <QuickActionCard description="Consulta el panorama general de crecimiento y uso." icon={<BarChart3 size={18} />} title="Estadísticas globales" to="/superadmin-dashboard" />
          <QuickActionCard description="Administra controles generales y supervisión." icon={<Settings size={18} />} title="Configuración" to="/superadmin-dashboard" />
        </div>
      </section>

      <section className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-gold-300">
            <Activity size={18} />
          </div>
          <div>
            <p className="eyebrow text-gold-700">Alertas globales</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Monitoreo general
            </h2>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {data.globalAlerts.length ? (
            data.globalAlerts.map((alert) => (
              <div className="rounded-2xl border border-ink/8 bg-ink/4 px-4 py-3 text-sm leading-6 text-ink/68" key={alert}>{alert}</div>
            ))
          ) : (
            <div className="rounded-2xl border border-mint/22 bg-mint/10 px-4 py-3 text-sm text-mint-dark">No hay alertas globales activas ahora mismo.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 backdrop-blur-sm">
      <p className="font-display numeric text-3xl font-semibold tracking-tight text-cream">{value}</p>
      <p className="eyebrow mt-1 text-cream/48">{label}</p>
    </div>
  );
}
