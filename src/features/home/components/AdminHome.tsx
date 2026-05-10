import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart3, CalendarDays, Clock3, Scissors, Store, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, Button, Pill } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import { HomeMetricCard } from '@/features/home/components/HomeMetricCard';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import type { AdminHomeData } from '@/features/home/homeService';
import { bookingService } from '@/features/booking/bookingService';
import type { Profile } from '@/types/supabase.types';

function formatCurrency(value: number, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function AdminHome({ data, profile }: { data: AdminHomeData; profile: Profile | null }) {
  const queryClient = useQueryClient();
  const barberia = data.barberia;

  const updateAppointment = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' }) =>
      bookingService.adminUpdateEstadoCita(appointmentId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['home', 'admin'] });
    },
  });

  if (!barberia) {
    return (
      <div className="space-y-8 animate-fade-up">
        <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_24%)]" />
          <Pill tone="gold">Inicio admin</Pill>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
            Bienvenido, <span className="font-display-italic text-gold-200">{profile?.full_name?.trim() || profile?.email || 'admin'}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">Todavía no tienes una barbería creada en tu cuenta.</p>
        </section>
        <EmptyState
          actionLabel="Crear mi barbería"
          actionTo="/crear-barberia"
          description="Crea tu barbería para empezar a gestionar agenda, servicios, barberos y estadísticas desde un solo lugar."
          title="Aún no has creado tu barbería"
        />
      </div>
    );
  }

  const profileComplete = Boolean(barberia.descripcion && barberia.logo_url && barberia.telefono && barberia.direccion);

  return (
    <div className="space-y-10 animate-fade-up">
      <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] px-7 py-9 text-cream shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.12),transparent_22%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Pill tone="gold">Inicio admin</Pill>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              {barberia.nombre}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cream/68">
              Gestiona citas, barberos, servicios y tareas operativas desde una sola vista.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Hoy" value={data.quickStats.todayAppointments} />
            <HeroStat label="Pendientes" value={data.quickStats.pendingAppointments} />
            <HeroStat label="Barberos" value={data.quickStats.activeBarbers} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <HomeMetricCard icon={<CalendarDays size={18} />} label="Citas de hoy" value={data.quickStats.todayAppointments} />
        <HomeMetricCard icon={<Clock3 size={18} />} label="Citas pendientes" value={data.quickStats.pendingAppointments} />
        <HomeMetricCard icon={<BarChart3 size={18} />} label="Ingresos del mes" value={formatCurrency(data.quickStats.estimatedRevenueMonth, barberia.moneda)} />
        <HomeMetricCard icon={<UserRound size={18} />} label="Barberos activos" value={data.quickStats.activeBarbers} />
        <HomeMetricCard icon={<Scissors size={18} />} label="Servicios activos" value={data.quickStats.activeServices} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow text-gold-700">Operación de hoy</p>
              <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Próximas citas
              </h2>
            </div>
            <Link to="/admin-dashboard/citas">
              <Button size="sm" variant="outline-ink">Ver todas</Button>
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {data.todayAppointments.length ? (
              data.todayAppointments.slice(0, 5).map((appointment) => (
                <article className="rounded-[22px] border border-ink/8 bg-ink/3 p-5 transition-colors duration-300 hover:border-gold-500/22 hover:bg-ink/4" key={appointment.cita_id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-semibold tracking-tight text-ink">
                          {appointment.nombre_cliente || appointment.email_cliente}
                        </p>
                        <Badge variant={badgeVariantForStatus(appointment.estado)}>{appointment.estado}</Badge>
                      </div>
                      <p className="text-sm text-ink/58">
                        {appointment.nombre_servicio} con <span className="text-ink/80">{appointment.nombre_barbero}</span>
                      </p>
                      <p className="numeric text-sm font-semibold text-gold-700">{appointment.hora_inicio.slice(0, 5)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appointment.estado === 'pendiente' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'confirmada' })} size="sm" variant="gold">
                          Confirmar
                        </Button>
                      ) : null}
                      {appointment.estado === 'confirmada' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'completada' })} size="sm" variant="primary">
                          Completar
                        </Button>
                      ) : null}
                      {appointment.estado !== 'cancelada' && appointment.estado !== 'completada' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'cancelada' })} size="sm" variant="outline-ink">
                          Cancelar
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState description="No hay citas programadas para hoy en tu barbería." title="Sin citas para hoy" />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-ink/8 bg-paper p-7 shadow-soft">
            <p className="eyebrow text-gold-700">Estado de la barbería</p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink">
              {barberia.nombre}
            </h2>
            <div className="mt-5 grid gap-3">
              <StatusRow label="Estado" value={barberia.activo ? 'Activa' : 'Inactiva'} />
              <StatusRow label="Reservas" value={barberia.acepta_reservas ? 'Acepta reservas' : 'Reservas pausadas'} />
              <StatusRow label="Perfil" value={profileComplete ? 'Completo' : 'Incompleto'} />
            </div>
            <div className="mt-6">
              <Link to="/admin-dashboard">
                <Button size="sm" variant="outline-ink">Editar barbería</Button>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-gold-500/22 bg-[linear-gradient(180deg,rgba(33,29,25,0.96),rgba(20,18,16,0.98))] p-7 text-cream">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_36%)]" />
            <p className="eyebrow relative text-gold-300">Pendiente</p>
            <h2 className="font-display relative mt-2 text-2xl font-semibold tracking-tight">Alertas y tareas</h2>
            <div className="relative mt-5 space-y-3">
              {data.pendingTasks.length ? (
                data.pendingTasks.map((task) => (
                  <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-cream/78" key={task}>{task}</div>
                ))
              ) : (
                <div className="rounded-2xl border border-mint/22 bg-mint/10 px-4 py-3 text-sm text-mint">Todo al día. Tu barbería no tiene tareas urgentes ahora mismo.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="eyebrow text-gold-300">Gestión rápida</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Accesos <span className="font-display-italic text-gold-200">directos.</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard description="Abre el panel general de configuración de tu negocio." icon={<Store size={18} />} title="Mi barbería" to="/admin-dashboard" />
          <QuickActionCard description="Gestiona las citas y estados desde tu agenda." icon={<CalendarDays size={18} />} title="Citas" to="/admin-dashboard/citas" />
          <QuickActionCard description="Administra barberos y sus datos activos." icon={<UserRound size={18} />} title="Barberos" to="/admin-dashboard" />
          <QuickActionCard description="Actualiza servicios y precios disponibles." icon={<Scissors size={18} />} title="Servicios" to="/admin-dashboard" />
          <QuickActionCard description="Completa horarios y disponibilidad semanal." icon={<Clock3 size={18} />} title="Horarios" to="/admin-dashboard" />
          <QuickActionCard description="Consulta el resumen operativo de tu cuenta." icon={<BarChart3 size={18} />} title="Estadísticas" to="/admin-dashboard" />
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-ink/4 px-4 py-3 text-sm">
      <span className="eyebrow text-ink/45">{label}</span>
      <span className="font-display font-semibold tracking-tight text-ink">{value}</span>
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
