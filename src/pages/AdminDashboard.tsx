import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Percent,
  Scissors,
  Settings,
  Store,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, ConfirmDialog, Pill, useToast } from '@/components/ui';
import {
  adminService,
  type BarberoInput,
  type BarberiaInput,
  type DisponibilidadInput,
  type ServicioInput,
} from '@/features/admin/adminService';
import { BarberiaForm } from '@/features/admin/barberia/components/BarberiaForm';
import { useBarberia } from '@/features/admin/barberia/hooks/useBarberia';
import { BarberoForm } from '@/features/admin/barberos/components/BarberoForm';
import { BarberoList } from '@/features/admin/barberos/components/BarberoList';
import { useBarberos } from '@/features/admin/barberos/hooks/useBarberos';
import { HorarioForm } from '@/features/admin/horarios/components/HorarioForm';
import { HorarioSemanal } from '@/features/admin/horarios/components/HorarioSemanal';
import { useDisponibilidad } from '@/features/admin/horarios/hooks/useDisponibilidad';
import { ServicioForm } from '@/features/admin/servicios/components/ServicioForm';
import { ServicioList } from '@/features/admin/servicios/components/ServicioList';
import { useServicios } from '@/features/admin/servicios/hooks/useServicios';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Barbero, CitaConDetalles, Disponibilidad, Servicio } from '@/types/supabase.types';
import { AdminCitasPage } from './AdminCitasPage';

type AdminSection =
  | 'resumen'
  | 'estadisticas'
  | 'citas'
  | 'barberos'
  | 'servicios'
  | 'horarios'
  | 'barberia'
  | 'configuracion';

const sections: Array<{ id: AdminSection; label: string; icon: ReactNode }> = [
  { id: 'resumen', label: 'Resumen', icon: <CalendarDays size={16} /> },
  { id: 'estadisticas', label: 'Estadisticas', icon: <BarChart3 size={16} /> },
  { id: 'citas', label: 'Citas', icon: <CalendarCheck size={16} /> },
  { id: 'barberos', label: 'Barberos', icon: <UserRound size={16} /> },
  { id: 'servicios', label: 'Servicios', icon: <Scissors size={16} /> },
  { id: 'horarios', label: 'Horarios', icon: <Clock size={16} /> },
  { id: 'barberia', label: 'Mi barberia', icon: <Store size={16} /> },
  { id: 'configuracion', label: 'Configuracion', icon: <Settings size={16} /> },
];

const adminSectionIds = new Set<AdminSection>(sections.map((section) => section.id));

function isAdminSection(value: string | null): value is AdminSection {
  return value !== null && adminSectionIds.has(value as AdminSection);
}

function formatCurrency(value: number, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

const adminEyebrowClass = 'text-[#8a6420]';
const adminMutedTextClass = 'text-ink/82';
const adminSurfaceClass = 'border border-ink/12 bg-[#f5efe3]';

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
}

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [section, setSection] = useState<AdminSection>(() => {
    const requestedSection = searchParams.get('section');
    return isAdminSection(requestedSection) ? requestedSection : 'resumen';
  });
  const [editingBarbero, setEditingBarbero] = useState<Barbero | null>(null);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [editingHorario, setEditingHorario] = useState<Disponibilidad | null>(null);
  const [confirmDeleteBarberia, setConfirmDeleteBarberia] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { barberia, createBarberia, error: barberiaError, isLoading: isBarberiaLoading, updateBarberia } = useBarberia();
  const { barberos, createBarbero, setBarberoActivo, updateBarbero } = useBarberos(barberia?.id);
  const { createServicio, servicios, setServicioActivo, updateServicio } = useServicios(barberia?.id);
  const { createDisponibilidad, deleteDisponibilidad, disponibilidad, updateDisponibilidad } = useDisponibilidad(barberia?.id);

  const appointmentsQuery = useQuery({
    enabled: Boolean(barberia?.id),
    queryKey: ['admin', 'appointments', barberia?.id],
    queryFn: () => adminService.getAppointments(barberia!.id),
  });

  useEffect(() => {
    const requestedSection = searchParams.get('section');
    const nextSection = isAdminSection(requestedSection) ? requestedSection : 'resumen';
    setSection(nextSection);
  }, [searchParams]);

  function changeSection(nextSection: AdminSection) {
    setSection(nextSection);
    const nextParams = new URLSearchParams(searchParams);
    if (nextSection === 'resumen') {
      nextParams.delete('section');
    } else {
      nextParams.set('section', nextSection);
    }
    setSearchParams(nextParams, { replace: true });
  }

  const appointments = appointmentsQuery.data ?? [];
  const activeBarbers = barberos.filter((barbero) => barbero.activo).length;
  const activeServices = servicios.filter((servicio) => servicio.activo).length;

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const monthKey = today.slice(0, 7);
    const monthAppointments = appointments.filter((appointment) => appointment.fecha.startsWith(monthKey));
    const activeMonthAppointments = monthAppointments.filter((appointment) => appointment.estado !== 'cancelada');
    const completedMonth = monthAppointments.filter((appointment) => appointment.estado === 'completada').length;
    const confirmedMonth = monthAppointments.filter((appointment) => appointment.estado === 'confirmada').length;
    const cancelledMonth = monthAppointments.filter((appointment) => appointment.estado === 'cancelada').length;
    const pendingMonth = monthAppointments.filter((appointment) => appointment.estado === 'pendiente').length;
    const estimatedRevenueMonth = activeMonthAppointments.reduce((total, appointment) => total + appointment.precio, 0);
    const averageTicket = activeMonthAppointments.length ? estimatedRevenueMonth / activeMonthAppointments.length : 0;
    const uniqueClientsMonth = new Set(activeMonthAppointments.map((appointment) => appointment.cliente_id)).size;

    const clientsByVisits = appointments.reduce<Record<string, number>>((accumulator, appointment) => {
      if (appointment.estado === 'cancelada') return accumulator;
      accumulator[appointment.cliente_id] = (accumulator[appointment.cliente_id] ?? 0) + 1;
      return accumulator;
    }, {});

    const recurringClients = Object.values(clientsByVisits).filter((visits) => visits >= 2).length;
    const confirmationRate = monthAppointments.length
      ? Math.round(((confirmedMonth + completedMonth) / monthAppointments.length) * 100)
      : 0;

    const serviceMap = activeMonthAppointments.reduce<Record<string, { name: string; count: number; revenue: number }>>(
      (accumulator, appointment) => {
        const current = accumulator[appointment.servicio_id] ?? {
          name: appointment.nombre_servicio,
          count: 0,
          revenue: 0,
        };
        current.count += 1;
        current.revenue += appointment.precio;
        accumulator[appointment.servicio_id] = current;
        return accumulator;
      },
      {},
    );

    const topServices = Object.values(serviceMap)
      .sort((left, right) => right.count - left.count)
      .slice(0, 4);

    const barberMap = activeMonthAppointments.reduce<Record<string, { name: string; count: number; revenue: number }>>(
      (accumulator, appointment) => {
        const current = accumulator[appointment.barbero_id] ?? {
          name: appointment.nombre_barbero,
          count: 0,
          revenue: 0,
        };
        current.count += 1;
        current.revenue += appointment.precio;
        accumulator[appointment.barbero_id] = current;
        return accumulator;
      },
      {},
    );

    const topBarbers = Object.values(barberMap)
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 4);

    const timeline = getLastSevenDays().map((date) => {
      const isoDate = date.toISOString().slice(0, 10);
      const dayAppointments = appointments.filter((appointment) => appointment.fecha === isoDate);
      const revenue = dayAppointments
        .filter((appointment) => appointment.estado !== 'cancelada')
        .reduce((total, appointment) => total + appointment.precio, 0);

      return {
        date: isoDate,
        label: new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(date).replace('.', ''),
        count: dayAppointments.length,
        revenue,
      };
    });

    const maxTimelineCount = Math.max(...timeline.map((item) => item.count), 1);
    const nextAppointment = appointments
      .filter((appointment) => appointment.fecha >= today && appointment.estado !== 'cancelada' && appointment.estado !== 'completada')
      .sort((left, right) => `${left.fecha}${left.hora_inicio}`.localeCompare(`${right.fecha}${right.hora_inicio}`))[0] ?? null;

    return {
      todayAppointments: appointments.filter((appointment) => appointment.fecha === today).length,
      monthAppointments,
      pendingMonth,
      completedMonth,
      confirmedMonth,
      cancelledMonth,
      estimatedRevenueMonth,
      averageTicket,
      uniqueClientsMonth,
      recurringClients,
      confirmationRate,
      topServices,
      topBarbers,
      timeline,
      maxTimelineCount,
      maxTimelineRevenue: Math.max(...timeline.map((item) => item.revenue), 1),
      nextAppointment,
    };
  }, [appointments]);

  async function saveBarberia(values: BarberiaInput) {
    if (barberia) {
      await updateBarberia.mutateAsync({ id: barberia.id, input: values });
      toast.success('Cambios guardados.', 'Barberia actualizada');
    } else {
      await createBarberia.mutateAsync(values);
      toast.success('Tu barberia esta lista para operar.', 'Barberia creada');
    }
  }

  async function saveBarbero(values: BarberoInput) {
    if (editingBarbero) {
      await updateBarbero.mutateAsync({ id: editingBarbero.id, input: values });
      setEditingBarbero(null);
      toast.success('Barbero actualizado.');
      return;
    }
    await createBarbero.mutateAsync(values);
    toast.success('Barbero creado.');
  }

  async function saveServicio(values: ServicioInput) {
    if (editingServicio) {
      await updateServicio.mutateAsync({ id: editingServicio.id, input: values });
      setEditingServicio(null);
      toast.success('Servicio actualizado.');
      return;
    }
    await createServicio.mutateAsync(values);
    toast.success('Servicio creado.');
  }

  async function saveHorario(values: DisponibilidadInput) {
    if (editingHorario) {
      await updateDisponibilidad.mutateAsync({ id: editingHorario.id, input: values });
      setEditingHorario(null);
      toast.success('Horario actualizado.');
      return;
    }
    await createDisponibilidad.mutateAsync(values);
    toast.success('Horario creado.');
  }

  async function performDeleteBarberia() {
    if (!barberia) return;
    setIsDeleting(true);
    try {
      await adminService.deleteBarberia(barberia.id);
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success('Seras redirigido...', 'Barberia eliminada');
      setTimeout(() => window.location.assign('/'), 1200);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible eliminar la barberia.', 'Error');
    } finally {
      setIsDeleting(false);
      setConfirmDeleteBarberia(false);
    }
  }

  async function performDeleteAccount() {
    setIsDeleting(true);
    try {
      const { authService } = await import('@/features/auth/services/authService');
      await authService.deleteUserAccount();
      window.location.assign('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible eliminar la cuenta.', 'Error');
    } finally {
      setIsDeleting(false);
      setConfirmDeleteAccount(false);
    }
  }

  if (!isSupabaseConfigured) {
    return <PanelEmpty title="Supabase pendiente" text="Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar el panel." />;
  }

  if (isBarberiaLoading) {
    return <PanelEmpty title="Cargando panel" text="Estamos leyendo la barberia asociada a tu usuario admin." />;
  }

  const blocker = barberiaError instanceof Error ? barberiaError.message : null;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[28px] border border-ink/10 bg-white p-4 shadow-soft">
          <div className="px-3 py-3">
            <Pill tone="gold">Panel admin</Pill>
            <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink">
              {barberia?.nombre ?? 'Barber Flow'}
            </h1>
            <p className={`mt-2 text-sm leading-6 ${adminMutedTextClass}`}>
              Navega entre configuracion, operacion y estadisticas de tu barberia.
            </p>
          </div>
          <nav className="mt-3 grid gap-1">
            {sections.map((item) => (
              <button
                className={[
                  'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-300',
                  section === item.id
                    ? 'bg-ink text-cream shadow-soft'
                    : 'text-ink/85 hover:bg-[#f5efe3] hover:text-ink',
                ].join(' ')}
                key={item.id}
                onClick={() => changeSection(item.id)}
                type="button"
              >
                <span className={section === item.id ? 'text-gold-300' : 'text-ink/45'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          {blocker ? (
            <div className="rounded-2xl border border-danger/22 bg-danger/8 p-4 text-sm leading-6 text-danger">
              {blocker}
            </div>
          ) : null}

          {!barberia && section !== 'barberia' ? (
            <PanelEmpty title="Crea tu barberia" text="Antes de crear barberos, servicios y horarios, registra los datos de Mi Barberia." />
          ) : null}

          {section === 'resumen' ? (
            <Section eyebrow="Vista general" title="Resumen operativo">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Metric icon={<CalendarDays size={18} />} label="Citas hoy" value={stats.todayAppointments} />
                <Metric icon={<UserRound size={18} />} label="Barberos activos" value={activeBarbers} />
                <Metric icon={<Scissors size={18} />} label="Servicios activos" value={activeServices} />
                <Metric
                  icon={<CircleDollarSign size={18} />}
                  label="Ingresos del mes"
                  value={formatCurrency(stats.estimatedRevenueMonth, barberia?.moneda)}
                />
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <StatsCard title="Siguiente cita" eyebrow="Agenda">
                  {stats.nextAppointment ? (
                    <div className={`rounded-[22px] p-5 ${adminSurfaceClass}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                            {stats.nextAppointment.nombre_cliente || stats.nextAppointment.email_cliente}
                          </p>
                          <p className={`mt-2 text-sm leading-6 ${adminMutedTextClass}`}>
                            {stats.nextAppointment.nombre_servicio} con {stats.nextAppointment.nombre_barbero}
                          </p>
                        </div>
                        <span className="rounded-full border border-gold-500/25 bg-gold-500/10 px-3 py-1 text-sm font-semibold text-gold-700">
                          {stats.nextAppointment.hora_inicio.slice(0, 5)}
                        </span>
                      </div>
                      <p className={`mt-4 text-sm ${adminMutedTextClass}`}>
                        Fecha: <span className="text-ink">{stats.nextAppointment.fecha}</span>
                      </p>
                    </div>
                  ) : (
                    <EmptyPanel text="No hay citas proximas registradas en este momento." />
                  )}
                </StatsCard>

                <StatsCard title="Lectura rapida" eyebrow="Hoy">
                  <div className="grid gap-3">
                    <InsightRow label="Pendientes del mes" value={stats.pendingMonth} />
                    <InsightRow label="Completadas del mes" value={stats.completedMonth} />
                    <InsightRow label="Clientes del mes" value={stats.uniqueClientsMonth} />
                    <InsightRow label="Confirmacion" value={`${stats.confirmationRate}%`} />
                  </div>
                </StatsCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <StatsCard title="Citas completadas" eyebrow="Rendimiento">
                  <Metric icon={<CheckCircle2 size={18} />} label="Total completadas" value={stats.completedMonth} />
                </StatsCard>
                <StatsCard title="Clientes recurrentes" eyebrow="Fidelizacion">
                  <Metric icon={<Users size={18} />} label="Vuelven este mes" value={stats.recurringClients} />
                </StatsCard>
                <StatsCard title="Conversion" eyebrow="Seguimiento">
                  <Metric icon={<Percent size={18} />} label="Tasa actual" value={`${stats.confirmationRate}%`} />
                </StatsCard>
              </div>
            </Section>
          ) : null}

          {section === 'estadisticas' && barberia ? (
            <Section eyebrow="Estadisticas" title={`Metricas de ${barberia.nombre}`}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <Metric icon={<CalendarRange size={18} />} label="Citas del mes" value={stats.monthAppointments.length} />
                <Metric
                  icon={<CircleDollarSign size={18} />}
                  label="Ingresos del mes"
                  value={formatCurrency(stats.estimatedRevenueMonth, barberia.moneda)}
                />
                <Metric
                  icon={<TrendingUp size={18} />}
                  label="Ticket promedio"
                  value={formatCurrency(stats.averageTicket, barberia.moneda)}
                />
                <Metric icon={<Users size={18} />} label="Clientes unicos" value={stats.uniqueClientsMonth} />
                <Metric icon={<CheckCircle2 size={18} />} label="Completadas" value={stats.completedMonth} />
                <Metric icon={<Percent size={18} />} label="Conversion" value={`${stats.confirmationRate}%`} />
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <StatsCard title="Actividad de los ultimos 7 dias" eyebrow="Movimiento">
                  {stats.timeline.some((item) => item.count > 0) ? (
                    <div className="grid gap-3 sm:grid-cols-7">
                    {stats.timeline.map((item) => (
                      <div className="rounded-[18px] border border-ink/10 bg-[#f5efe3] p-4" key={item.date}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="eyebrow text-ink/90">{item.label}</span>
                          <span className="numeric text-xs font-semibold text-ink">{item.count}</span>
                        </div>
                        <div className="mt-4 flex h-24 items-end">
                          <div
                            className="w-full rounded-t-2xl bg-[linear-gradient(180deg,rgba(212,175,55,0.88),rgba(26,24,22,0.96))]"
                            style={{ height: `${Math.max((item.count / stats.maxTimelineCount) * 100, item.count ? 18 : 6)}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs leading-5 text-ink/88">
                          {formatCurrency(item.revenue, barberia.moneda)}
                        </p>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <EmptyPanel text="Todavia no hay citas registradas en los ultimos 7 dias para mostrar actividad." />
                  )}
                </StatsCard>

                <StatsCard title="Estado de citas del mes" eyebrow="Embudo">
                  <div className="space-y-4">
                    <StatusBar label="Pendientes" total={stats.monthAppointments.length} value={stats.pendingMonth} />
                    <StatusBar label="Confirmadas" total={stats.monthAppointments.length} value={stats.confirmedMonth} />
                    <StatusBar label="Completadas" total={stats.monthAppointments.length} value={stats.completedMonth} />
                    <StatusBar label="Canceladas" total={stats.monthAppointments.length} value={stats.cancelledMonth} />
                  </div>
                </StatsCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <StatsCard title="Ingresos de los ultimos 7 dias" eyebrow="Caja">
                  {stats.timeline.some((item) => item.revenue > 0) ? (
                    <div className="space-y-3">
                    {stats.timeline.map((item) => (
                      <div className="space-y-2" key={`${item.date}-revenue`}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-ink">{item.label}</span>
                          <span className="numeric font-semibold text-ink">
                            {formatCurrency(item.revenue, barberia.moneda)}
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-ink/8">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(33,29,25,0.96),rgba(212,175,55,0.88))]"
                            style={{
                              width: `${Math.max((item.revenue / stats.maxTimelineRevenue) * 100, item.revenue ? 14 : 0)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <EmptyPanel text="Aun no hay ingresos registrados en la ultima semana." />
                  )}
                </StatsCard>

                <StatsCard title="Servicios con mas movimiento" eyebrow="Oferta">
                  {stats.topServices.length ? (
                    <div className="space-y-3">
                      {stats.topServices.map((service) => (
                        <div className="rounded-[18px] border border-ink/10 bg-[#f5efe3] p-4" key={service.name}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-display text-lg font-semibold tracking-tight text-ink">{service.name}</p>
                            <span className="numeric text-sm font-semibold text-gold-700">{service.count} citas</span>
                          </div>
                          <p className="mt-2 text-sm text-ink/88">
                            {formatCurrency(service.revenue, barberia.moneda)} generados en el mes.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel text="Todavia no hay servicios con historial suficiente para mostrar tendencia." />
                  )}
                </StatsCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <StatsCard title="Barberos con mejor rendimiento" eyebrow="Equipo">
                  {stats.topBarbers.length ? (
                    <div className="space-y-3">
                      {stats.topBarbers.map((barber) => (
                        <div className="rounded-[18px] border border-ink/10 bg-[#f5efe3] p-4" key={barber.name}>
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-display text-lg font-semibold tracking-tight text-ink">{barber.name}</p>
                            <span className="numeric text-sm font-semibold text-gold-700">
                              {formatCurrency(barber.revenue, barberia.moneda)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-ink/88">
                            {barber.count} citas gestionadas este mes.
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel text="Aun no hay suficiente actividad para comparar rendimiento por barbero." />
                  )}
                </StatsCard>

                <StatsCard title="Lectura rapida del negocio" eyebrow="Claves">
                  <div className="grid gap-3">
                    <InsightRow label="Clientes recurrentes" value={stats.recurringClients} />
                    <InsightRow label="Barberos activos" value={activeBarbers} />
                    <InsightRow label="Servicios activos" value={activeServices} />
                    <InsightRow label="Conversion a cita gestionada" value={`${stats.confirmationRate}%`} />
                  </div>
                </StatsCard>
              </div>
            </Section>
          ) : null}

          {section === 'citas' && barberia ? <AdminCitasPage /> : null}

          {section === 'barberos' && barberia ? (
            <Section eyebrow="Equipo" title="Barberos">
              <BarberoForm
                barbero={editingBarbero}
                isSaving={createBarbero.isPending || updateBarbero.isPending}
                onCancel={editingBarbero ? () => setEditingBarbero(null) : undefined}
                onSubmit={saveBarbero}
              />
              <BarberoList
                barberos={barberos}
                onEdit={setEditingBarbero}
                onToggle={(barbero) => {
                  void setBarberoActivo
                    .mutateAsync({ id: barbero.id, activo: !barbero.activo })
                    .then(() => toast.success(barbero.activo ? 'Barbero desactivado.' : 'Barbero activado.'));
                }}
              />
            </Section>
          ) : null}

          {section === 'servicios' && barberia ? (
            <Section eyebrow="Oferta" title="Servicios">
              <ServicioForm
                isSaving={createServicio.isPending || updateServicio.isPending}
                onCancel={editingServicio ? () => setEditingServicio(null) : undefined}
                onSubmit={saveServicio}
                servicio={editingServicio}
              />
              <ServicioList
                onEdit={setEditingServicio}
                onToggle={(servicio) => {
                  void setServicioActivo
                    .mutateAsync({ id: servicio.id, activo: !servicio.activo })
                    .then(() => toast.success(servicio.activo ? 'Servicio desactivado.' : 'Servicio activado.'));
                }}
                servicios={servicios}
              />
            </Section>
          ) : null}

          {section === 'horarios' && barberia ? (
            <Section eyebrow="Disponibilidad" title="Horarios">
              <HorarioForm
                barberos={barberos.filter((barbero) => barbero.activo)}
                block={editingHorario}
                isSaving={createDisponibilidad.isPending || updateDisponibilidad.isPending}
                onCancel={editingHorario ? () => setEditingHorario(null) : undefined}
                onSubmit={saveHorario}
              />
              <HorarioSemanal
                barberos={barberos}
                disponibilidad={disponibilidad}
                onDelete={(block) => {
                  void deleteDisponibilidad.mutateAsync(block.id).then(() => toast.success('Horario eliminado.'));
                }}
                onEdit={setEditingHorario}
              />
            </Section>
          ) : null}

          {section === 'barberia' ? (
            <Section eyebrow="Identidad" title="Mi Barberia">
              <BarberiaForm
                barberia={barberia}
                isSaving={createBarberia.isPending || updateBarberia.isPending}
                onSubmit={saveBarberia}
              />
            </Section>
          ) : null}

          {section === 'configuracion' ? (
            <Section eyebrow="Zona critica" title="Configuracion">
              <div className="space-y-5">
                {barberia ? (
                  <DangerZone
                    description="Una vez eliminada, no podras recuperar tu barberia ni los datos asociados."
                    label={isDeleting ? 'Eliminando...' : 'Eliminar barberia'}
                    onClick={() => setConfirmDeleteBarberia(true)}
                    title="Eliminar barberia"
                  />
                ) : null}
                <DangerZone
                  description="Elimina tu cuenta y todos tus datos de la plataforma. Esta accion es irreversible."
                  label={isDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
                  onClick={() => setConfirmDeleteAccount(true)}
                  title="Eliminar cuenta"
                />
              </div>
            </Section>
          ) : null}
        </main>
      </div>

      <ConfirmDialog
        confirmLabel="Si, eliminar barberia"
        description={`Vas a eliminar definitivamente ${barberia?.nombre ?? 'tu barberia'} y todos sus datos asociados (servicios, horarios, barberos).`}
        eyebrow="Zona critica"
        onClose={() => setConfirmDeleteBarberia(false)}
        onConfirm={performDeleteBarberia}
        open={confirmDeleteBarberia}
        title="¿Eliminar tu barberia?"
        warning="Esta accion no se puede deshacer. Las citas existentes y la configuracion se perderan."
      />

      <ConfirmDialog
        confirmLabel="Si, eliminar mi cuenta"
        description="Vas a eliminar definitivamente tu usuario y los datos asociados a tu cuenta."
        eyebrow="Zona critica"
        onClose={() => setConfirmDeleteAccount(false)}
        onConfirm={performDeleteAccount}
        open={confirmDeleteAccount}
        title="¿Eliminar tu cuenta?"
        warning="Perderas acceso permanente a Barber Flow. Esta accion es irreversible."
      />
    </>
  );
}

function Section({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="space-y-6 rounded-[28px] border border-ink/10 bg-white p-7 shadow-soft sm:p-8">
      <div className="space-y-2">
        <p className={`eyebrow ${adminEyebrowClass}`}>{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className={`rounded-[18px] p-5 ${adminSurfaceClass}`}>
      <div className="mb-3 flex items-center gap-2 text-ink">
        {icon}
        <span className="eyebrow text-ink/90">{label}</span>
      </div>
      <p className="font-display numeric break-words text-[clamp(1.9rem,3vw,3rem)] font-semibold leading-tight tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function StatsCard({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-ink/10 bg-white p-5 shadow-soft">
      <p className={`eyebrow ${adminEyebrowClass}`}>{eyebrow}</p>
      <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function StatusBar({ label, total, value }: { label: string; total: number; value: number }) {
  const width = total ? Math.max((value / total) * 100, value ? 12 : 0) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="numeric font-semibold text-ink">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-ink/8">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(212,175,55,0.92),rgba(33,29,25,0.96))]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-[16px] px-4 py-3 text-sm ${adminSurfaceClass}`}>
      <span className="font-medium text-ink">{label}</span>
      <span className="font-display numeric font-semibold tracking-tight text-ink">{value}</span>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-ink/20 bg-[#f5efe3] p-5 text-sm leading-6 text-ink/88">
      {text}
    </div>
  );
}

function DangerZone({
  description,
  label,
  onClick,
  title,
}: {
  description: string;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-danger/22 bg-danger/6 p-5">
      <h3 className="font-display text-xl font-semibold tracking-tight text-danger">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-danger/85">{description}</p>
      <div className="mt-5">
        <Button
          className="!bg-danger !text-paper !ring-danger/20 hover:!bg-[#c8383d]"
          onClick={onClick}
          size="md"
        >
          <Trash2 size={16} />
          {label}
        </Button>
      </div>
    </div>
  );
}

function PanelEmpty({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[28px] border border-ink/10 bg-white p-10 shadow-soft">
      <p className={`eyebrow ${adminEyebrowClass}`}>Admin</p>
      <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink/88">{text}</p>
    </div>
  );
}
