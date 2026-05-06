import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart3, CalendarDays, Clock3, Scissors, Store, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge, Button } from '@/components/ui';
import { EmptyState } from '@/features/home/components/EmptyState';
import { HomeMetricCard } from '@/features/home/components/HomeMetricCard';
import { QuickActionCard } from '@/features/home/components/QuickActionCard';
import type { AdminHomeData } from '@/features/home/homeService';
import { bookingService } from '@/features/booking/bookingService';
import type { Profile } from '@/types/supabase.types';

function formatCurrency(value: number, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
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
        <section className="surface-panel-dark rounded-[32px] px-6 py-7 text-white sm:px-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">INICIO ADMIN</p>
          <h1 className="mt-3 text-3xl font-bold">Bienvenido, {profile?.full_name?.trim() || profile?.email || 'admin'}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">Todavia no tienes una barberia creada en tu cuenta.</p>
        </section>
        <EmptyState
          actionLabel="Crear mi barberia"
          actionTo="/crear-barberia"
          description="Crea tu barberia para empezar a gestionar agenda, servicios, barberos y estadisticas desde un solo lugar."
          title="Aun no has creado tu barberia"
        />
      </div>
    );
  }

  const profileComplete = Boolean(barberia.descripcion && barberia.logo_url && barberia.telefono && barberia.direccion);

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="surface-panel-dark relative overflow-hidden rounded-[32px] px-6 py-7 text-white sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_24%),radial-gradient(circle_at_left_center,rgba(212,175,55,0.12),transparent_18%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">INICIO ADMIN</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{barberia.nombre}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
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

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Operacion de hoy</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Proximas citas</h2>
            </div>
            <Link to="/admin-dashboard/citas">
              <Button size="sm" variant="secondary">Ver todas</Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.todayAppointments.length ? (
              data.todayAppointments.slice(0, 5).map((appointment) => (
                <article className="rounded-[24px] border border-black/6 bg-black/3 p-4" key={appointment.cita_id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{appointment.nombre_cliente || appointment.email_cliente}</p>
                        <Badge variant={badgeVariantForStatus(appointment.estado)}>{appointment.estado}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{appointment.nombre_servicio} con {appointment.nombre_barbero}</p>
                      <p className="text-sm text-slate-500">{appointment.hora_inicio.slice(0, 5)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appointment.estado === 'pendiente' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'confirmada' })} size="sm">
                          Confirmar
                        </Button>
                      ) : null}
                      {appointment.estado === 'confirmada' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'completada' })} size="sm">
                          Completar
                        </Button>
                      ) : null}
                      {appointment.estado !== 'cancelada' && appointment.estado !== 'completada' ? (
                        <Button disabled={updateAppointment.isPending} onClick={() => updateAppointment.mutate({ appointmentId: appointment.cita_id, status: 'cancelada' })} size="sm" variant="secondary">
                          Cancelar
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState description="No hay citas programadas para hoy en tu barberia." title="Sin citas para hoy" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface-panel rounded-[28px] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Estado de la barberia</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{barberia.nombre}</h2>
            <div className="mt-5 grid gap-3">
              <StatusRow label="Estado" value={barberia.activo ? 'Activa' : 'Inactiva'} />
              <StatusRow label="Reservas" value={barberia.acepta_reservas ? 'Acepta reservas' : 'Reservas pausadas'} />
              <StatusRow label="Perfil" value={profileComplete ? 'Completo' : 'Incompleto'} />
            </div>
            <div className="mt-5">
              <Link to="/admin-dashboard">
                <Button size="sm" variant="secondary">Editar barberia</Button>
              </Link>
            </div>
          </div>

          <div className="surface-panel-dark rounded-[28px] p-5 text-white sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Pendiente</p>
            <h2 className="mt-2 text-2xl font-semibold">Alertas y tareas</h2>
            <div className="mt-5 space-y-3">
              {data.pendingTasks.length ? (
                data.pendingTasks.map((task) => (
                  <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/76" key={task}>{task}</div>
                ))
              ) : (
                <div className="rounded-2xl border border-mint/20 bg-mint/12 px-4 py-3 text-sm text-mint">Todo al dia. Tu barberia no tiene tareas urgentes ahora mismo.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">GESTION RAPIDA</p>
          <h2 className="text-2xl font-semibold text-ink">Accesos directos</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard description="Abre el panel general de configuracion de tu negocio." icon={<Store size={18} />} title="Mi barberia" to="/admin-dashboard" />
          <QuickActionCard description="Gestiona las citas y estados desde tu agenda." icon={<CalendarDays size={18} />} title="Citas" to="/admin-dashboard/citas" />
          <QuickActionCard description="Administra barberos y sus datos activos." icon={<UserRound size={18} />} title="Barberos" to="/admin-dashboard" />
          <QuickActionCard description="Actualiza servicios y precios disponibles." icon={<Scissors size={18} />} title="Servicios" to="/admin-dashboard" />
          <QuickActionCard description="Completa horarios y disponibilidad semanal." icon={<Clock3 size={18} />} title="Horarios" to="/admin-dashboard" />
          <QuickActionCard description="Consulta el resumen operativo de tu cuenta." icon={<BarChart3 size={18} />} title="Estadisticas" to="/admin-dashboard" />
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/4 px-4 py-3 text-sm">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
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
