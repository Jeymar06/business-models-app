import { endOfMonth, format, startOfMonth } from 'date-fns';

import { adminService } from '@/features/admin/adminService';
import { bookingService } from '@/features/booking/bookingService';
import { supabase } from '@/lib/supabase';
import type { Barberia, CitaConDetalles, Profile } from '@/types/supabase.types';

export interface ClientAppointmentStats {
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface ClientHomeData {
  nextAppointment: CitaConDetalles | null;
  appointmentStats: ClientAppointmentStats;
  availableBarberias: Barberia[];
}

export interface AdminMonthlyStats {
  appointmentCount: number;
  estimatedRevenue: number;
}

export interface AdminQuickStats {
  todayAppointments: number;
  pendingAppointments: number;
  estimatedRevenueMonth: number;
  activeBarbers: number;
  activeServices: number;
}

export interface AdminHomeData {
  barberia: Barberia | null;
  todayAppointments: CitaConDetalles[];
  monthlyStats: AdminMonthlyStats;
  quickStats: AdminQuickStats;
  pendingTasks: string[];
}

export interface SuperadminGlobalStats {
  totalBarberias: number;
  activeBarberias: number;
  totalUsers: number;
  registeredClients: number;
  registeredAdmins: number;
  monthAppointments: number;
  estimatedRevenue: number;
}

export interface RecentBarberiaItem {
  id: string;
  nombre: string;
  ciudad: string;
  estado: Barberia['estado'];
  created_at: string;
  owner_name: string;
  owner_email: string;
}

export interface RecentActivityItem {
  id: string;
  type: 'appointment' | 'user' | 'barberia';
  title: string;
  description: string;
  created_at: string;
}

function todayIso() {
  return format(new Date(), 'yyyy-MM-dd');
}

function monthRange() {
  const now = new Date();
  return {
    from: format(startOfMonth(now), 'yyyy-MM-dd'),
    to: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}

async function getProfilesByIds(ids: string[]) {
  if (!ids.length) {
    return [] as Profile[];
  }

  const { data, error } = await supabase.from('profiles').select('*').in('id', ids);
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export const homeService = {
  async getCurrentProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },

  async getClientNextAppointment(userId: string) {
    const { data, error } = await (supabase as any)
      .from('citas_con_detalles')
      .select('*')
      .eq('cliente_id', userId)
      .in('estado', ['pendiente', 'confirmada'])
      .gte('fecha', todayIso())
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(1);

    if (error) throw error;
    return ((data ?? [])[0] ?? null) as CitaConDetalles | null;
  },

  async getClientAppointmentStats(userId: string) {
    const appointments = await bookingService.getMisCitas(userId);

    return appointments.reduce<ClientAppointmentStats>(
      (accumulator, appointment) => {
        if (appointment.estado === 'cancelada') accumulator.cancelled += 1;
        if (appointment.estado === 'completada') accumulator.completed += 1;
        if (appointment.estado === 'pendiente' || appointment.estado === 'confirmada') accumulator.upcoming += 1;
        return accumulator;
      },
      { upcoming: 0, completed: 0, cancelled: 0 },
    );
  },

  async getAvailableBarberias(limit = 3) {
    const barberias = await bookingService.getBarberias();
    return barberias.slice(0, limit);
  },

  async getAdminBarberia(userId: string) {
    return adminService.getMyBarberia(userId);
  },

  async getAdminTodayAppointments(barberiaId: string) {
    const appointments = await adminService.getAppointments(barberiaId);
    return appointments.filter((appointment) => appointment.fecha === todayIso());
  },

  async getAdminMonthlyStats(barberiaId: string) {
    const { from, to } = monthRange();
    const { data, error } = await (supabase as any)
      .from('citas_con_detalles')
      .select('*')
      .eq('barberia_id', barberiaId)
      .gte('fecha', from)
      .lte('fecha', to)
      .order('fecha', { ascending: false });

    if (error) throw error;

    const appointments = (data ?? []) as CitaConDetalles[];
    const estimatedRevenue = appointments
      .filter((appointment) => appointment.estado !== 'cancelada')
      .reduce((total, appointment) => total + appointment.precio, 0);

    return {
      appointmentCount: appointments.length,
      estimatedRevenue,
    } satisfies AdminMonthlyStats;
  },

  async getAdminQuickStats(barberiaId: string) {
    const [appointments, barberos, servicios, monthlyStats] = await Promise.all([
      adminService.getAppointments(barberiaId),
      adminService.getBarbers(barberiaId),
      adminService.getServices(barberiaId),
      this.getAdminMonthlyStats(barberiaId),
    ]);

    const today = todayIso();

    return {
      todayAppointments: appointments.filter((appointment) => appointment.fecha === today).length,
      pendingAppointments: appointments.filter((appointment) => appointment.estado === 'pendiente').length,
      estimatedRevenueMonth: monthlyStats.estimatedRevenue,
      activeBarbers: barberos.filter((barbero) => barbero.activo).length,
      activeServices: servicios.filter((servicio) => servicio.activo).length,
    } satisfies AdminQuickStats;
  },

  async getAdminPendingTasks(barberia: Barberia) {
    const [barberos, servicios, disponibilidad, appointments] = await Promise.all([
      adminService.getBarbers(barberia.id),
      adminService.getServices(barberia.id),
      adminService.getAvailability(barberia.id),
      adminService.getAppointments(barberia.id),
    ]);

    const tasks: string[] = [];

    if (!barberos.length || !disponibilidad.length) {
      tasks.push('Agrega horarios para tus barberos');
    }

    if (!barberia.descripcion || barberia.descripcion.trim().length < 30) {
      tasks.push('Completa la descripcion de tu barberia');
    }

    if (!barberia.logo_url) {
      tasks.push('Sube un logo');
    }

    if (!servicios.length) {
      tasks.push('Agrega servicios para empezar a recibir reservas');
    }

    const pendingAppointments = appointments.filter((appointment) => appointment.estado === 'pendiente').length;
    if (pendingAppointments > 0) {
      tasks.push(`Tienes ${pendingAppointments} citas pendientes por confirmar`);
    }

    return tasks;
  },

  async getSuperadminGlobalStats() {
    const { from, to } = monthRange();

    const [barberiasCount, barberiasRows, profilesRows, appointmentsRows] = await Promise.all([
      supabase.from('barberias').select('id', { count: 'exact', head: true }),
      supabase.from('barberias').select('*'),
      supabase.from('profiles').select('*'),
      (supabase as any)
        .from('citas_con_detalles')
        .select('*')
        .gte('fecha', from)
        .lte('fecha', to),
    ]);

    if (barberiasCount.error) throw barberiasCount.error;
    if (barberiasRows.error) throw barberiasRows.error;
    if (profilesRows.error) throw profilesRows.error;
    if (appointmentsRows.error) throw appointmentsRows.error;

    const barberias = (barberiasRows.data ?? []) as Barberia[];
    const profiles = (profilesRows.data ?? []) as Profile[];
    const monthAppointments = (appointmentsRows.data ?? []) as CitaConDetalles[];

    return {
      totalBarberias: barberiasCount.count ?? barberias.length,
      activeBarberias: barberias.filter((barberia) => barberia.activo && barberia.estado === 'activa').length,
      totalUsers: profiles.length,
      registeredClients: profiles.filter((profile) => profile.role === 'client').length,
      registeredAdmins: profiles.filter((profile) => profile.role === 'admin').length,
      monthAppointments: monthAppointments.length,
      estimatedRevenue: monthAppointments
        .filter((appointment) => appointment.estado !== 'cancelada')
        .reduce((total, appointment) => total + appointment.precio, 0),
    } satisfies SuperadminGlobalStats;
  },

  async getRecentBarberias() {
    const { data, error } = await supabase.from('barberias').select('*').order('created_at', { ascending: false }).limit(5);
    if (error) throw error;

    const barberias = (data ?? []) as Barberia[];
    const ownerProfiles = await getProfilesByIds(barberias.map((barberia) => barberia.admin_id));
    const profileMap = new Map(ownerProfiles.map((profile) => [profile.id, profile]));

    return barberias.map((barberia) => {
      const owner = profileMap.get(barberia.admin_id);
      return {
        id: barberia.id,
        nombre: barberia.nombre,
        ciudad: barberia.ciudad,
        estado: barberia.estado,
        created_at: barberia.created_at,
        owner_name: owner?.full_name || owner?.email || 'Sin propietario',
        owner_email: owner?.email || 'Sin correo',
      } satisfies RecentBarberiaItem;
    });
  },

  async getRecentActivity() {
    const [recentAppointments, recentProfiles, recentBarberias] = await Promise.all([
      (supabase as any).from('citas_con_detalles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('barberias').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    if (recentAppointments.error) throw recentAppointments.error;
    if (recentProfiles.error) throw recentProfiles.error;
    if (recentBarberias.error) throw recentBarberias.error;

    const appointmentItems = ((recentAppointments.data ?? []) as CitaConDetalles[]).map((appointment) => ({
      id: `appointment-${appointment.cita_id}`,
      type: 'appointment' as const,
      title: `Nueva cita en ${appointment.nombre_barberia}`,
      description: `${appointment.nombre_cliente || appointment.email_cliente} reservo ${appointment.nombre_servicio}`,
      created_at: appointment.created_at,
    }));

    const profileItems = ((recentProfiles.data ?? []) as Profile[]).map((profile) => ({
      id: `user-${profile.id}`,
      type: 'user' as const,
      title: 'Nuevo usuario registrado',
      description: `${profile.full_name || profile.email} se registro como ${profile.role}`,
      created_at: profile.created_at,
    }));

    const barberiaItems = ((recentBarberias.data ?? []) as Barberia[]).map((barberia) => ({
      id: `barberia-${barberia.id}`,
      type: 'barberia' as const,
      title: 'Nueva barberia creada',
      description: `${barberia.nombre} en ${barberia.ciudad}`,
      created_at: barberia.created_at,
    }));

    return [...appointmentItems, ...profileItems, ...barberiaItems]
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
      .slice(0, 8) satisfies RecentActivityItem[];
  },

  async getGlobalAlerts() {
    const [barberiasRows, profilesRows, appointmentsRows, servicesRows] = await Promise.all([
      supabase.from('barberias').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('citas').select('*').eq('estado', 'pendiente'),
      supabase.from('servicios').select('id, barberia_id'),
    ]);

    if (barberiasRows.error) throw barberiasRows.error;
    if (profilesRows.error) throw profilesRows.error;
    if (appointmentsRows.error) throw appointmentsRows.error;
    if (servicesRows.error) throw servicesRows.error;

    const barberias = (barberiasRows.data ?? []) as Barberia[];
    const profiles = (profilesRows.data ?? []) as Profile[];
    const services = (servicesRows.data ?? []) as Array<{ id: string; barberia_id: string }>;
    const pendingAppointments = appointmentsRows.data?.length ?? 0;

    const alerts: string[] = [];
    const inactiveBarberias = barberias.filter((barberia) => !barberia.activo || barberia.estado !== 'activa').length;
    const barberiasWithoutServices = barberias.filter((barberia) => !services.some((service) => service.barberia_id === barberia.id)).length;
    const adminsWithoutBarberia = profiles.filter(
      (profile) => profile.role === 'admin' && !barberias.some((barberia) => barberia.admin_id === profile.id),
    ).length;

    if (inactiveBarberias > 0) alerts.push(`${inactiveBarberias} barberias inactivas o suspendidas`);
    if (barberiasWithoutServices > 0) alerts.push(`${barberiasWithoutServices} barberias sin servicios configurados`);
    if (adminsWithoutBarberia > 0) alerts.push(`${adminsWithoutBarberia} admins sin barberia creada`);
    if (pendingAppointments > 0) alerts.push(`${pendingAppointments} citas pendientes a nivel global`);

    return alerts;
  },
};
