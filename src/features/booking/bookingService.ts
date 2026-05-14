import { format, getDay, isBefore, isSameDay, parseISO, startOfDay } from 'date-fns';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppointmentStatus, Barbero, Barberia, Cita, CitaConDetalles, Disponibilidad, Servicio } from '@/types/supabase.types';

export interface BookingSlot {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  barbero_id?: string;
  nombre_barbero?: string;
}

export interface CreateCitaInput {
  cliente_id: string;
  barberia_id: string;
  barbero_id: string;
  servicio_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  notas?: string | null;
}

export interface GenerateSlotsParams {
  disponibilidad: Pick<Disponibilidad, 'dia_semana' | 'hora_inicio' | 'hora_fin'>[];
  fecha: Date;
  duracionMin: number;
  citasExistentes: Pick<Cita, 'hora_inicio' | 'hora_fin' | 'estado'>[];
}

const blockingStatuses: AppointmentStatus[] = ['pendiente', 'confirmada'];

export function timeToMinutes(time: string) {
  const [hours = '0', minutes = '0'] = time.slice(0, 5).split(':');
  return Number(hours) * 60 + Number(minutes);
}

export function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}

export function isToday(date: Date) {
  return isSameDay(date, new Date());
}

export function isPastSlot(date: Date, horaInicio: string) {
  if (!isToday(date)) return false;
  const now = new Date();
  const slot = new Date(date);
  const [hours, minutes] = horaInicio.split(':').map(Number);
  slot.setHours(hours, minutes, 0, 0);
  return slot <= now;
}

export function generateSlots({ citasExistentes, disponibilidad, duracionMin, fecha }: GenerateSlotsParams): BookingSlot[] {
  const diaSemana = getDay(fecha);
  const blocks = disponibilidad.filter((block) => block.dia_semana === diaSemana);

  return blocks.flatMap((block) => {
    const slots: BookingSlot[] = [];
    let cursor = timeToMinutes(block.hora_inicio);
    const end = timeToMinutes(block.hora_fin);

    while (cursor + duracionMin <= end) {
      const horaInicio = minutesToTime(cursor);
      const horaFin = minutesToTime(cursor + duracionMin);
      const isTaken = citasExistentes.some((cita) => (
        blockingStatuses.includes(cita.estado)
        && rangesOverlap(horaInicio, horaFin, cita.hora_inicio, cita.hora_fin)
      ));

      if (!isTaken && !isPastSlot(fecha, horaInicio)) {
        slots.push({ hora_inicio: horaInicio, hora_fin: horaFin, disponible: true });
      }

      cursor += duracionMin;
    }

    return slots;
  });
}

function normalizeError(error: unknown) {
  if (error instanceof Error) return error;
  if (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof (error as { message?: unknown }).message === 'string'
  ) {
    return new Error((error as { message: string }).message);
  }
  return new Error('No fue posible completar la operacion.');
}

function toIsoDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export const bookingService = {
  async getBarberias() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('barberias')
      .select('*')
      .eq('activo', true)
      .eq('visible', true)
      .eq('acepta_reservas', true)
      .order('nombre');

    if (error) throw error;
    return data as Barberia[];
  },

  async getBarberiaById(barberiaId: string) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('barberias')
      .select('*')
      .eq('id', barberiaId)
      .maybeSingle();

    if (error) throw error;
    return data as Barberia | null;
  },

  async getServiciosByBarberia(barberiaId: string) {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('barberia_id', barberiaId)
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data as Servicio[];
  },

  async getBarberosByBarberia(barberiaId: string) {
    const { data, error } = await supabase
      .from('barberos')
      .select('*')
      .eq('barberia_id', barberiaId)
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data as Barbero[];
  },

  async getDisponibilidadByBarbero(barberoId: string) {
    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('barbero_id', barberoId)
      .order('dia_semana')
      .order('hora_inicio');

    if (error) throw error;
    return data as Disponibilidad[];
  },

  async getDisponibilidadByBarberos(barberoIds: string[]) {
    if (!barberoIds.length) return [];

    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*')
      .in('barbero_id', barberoIds)
      .order('dia_semana')
      .order('hora_inicio');

    if (error) throw error;
    return data as Disponibilidad[];
  },

  async getCitasByBarberoFecha(barberoId: string, fecha: string) {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .eq('barbero_id', barberoId)
      .eq('fecha', fecha)
      .in('estado', blockingStatuses);

    if (error) throw error;
    return data as Cita[];
  },

  async getCitasByBarberosFecha(barberoIds: string[], fecha: string) {
    if (!barberoIds.length) return [];

    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .in('barbero_id', barberoIds)
      .eq('fecha', fecha)
      .in('estado', blockingStatuses);

    if (error) throw error;
    return data as Cita[];
  },

  async getMisCitas(clienteId: string) {
    const { data, error } = await (supabase as any)
      .from('citas_con_detalles')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) throw error;
    return data as CitaConDetalles[];
  },

  async getCitasByBarberia(barberiaId: string) {
    const { data, error } = await (supabase as any)
      .from('citas_con_detalles')
      .select('*')
      .eq('barberia_id', barberiaId)
      .order('fecha', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) throw error;
    return data as CitaConDetalles[];
  },

  async getTodasLasCitas() {
    const { data, error } = await (supabase as any)
      .from('citas_con_detalles')
      .select('*')
      .order('fecha', { ascending: false })
      .order('hora_inicio', { ascending: false });

    if (error) throw error;
    return data as CitaConDetalles[];
  },

  async checkSlotDisponible(input: Pick<CreateCitaInput, 'barbero_id' | 'fecha' | 'hora_inicio' | 'hora_fin'>) {
    const citas = await this.getCitasByBarberoFecha(input.barbero_id, input.fecha);
    return !citas.some((cita) => rangesOverlap(input.hora_inicio, input.hora_fin, cita.hora_inicio, cita.hora_fin));
  },

  async checkClienteNoTieneCitaMismaHora(input: Pick<CreateCitaInput, 'cliente_id' | 'fecha' | 'hora_inicio'>) {
    const { data, error } = await supabase
      .from('citas')
      .select('id')
      .eq('cliente_id', input.cliente_id)
      .eq('fecha', input.fecha)
      .eq('hora_inicio', input.hora_inicio)
      .in('estado', blockingStatuses);

    if (error) throw error;
    return (data ?? []).length === 0;
  },

  async createCita(input: CreateCitaInput) {
    if (isBefore(startOfDay(parseISO(input.fecha)), startOfDay(new Date()))) {
      throw new Error('No puedes agendar una fecha pasada.');
    }

    const [slotDisponible, clienteDisponible] = await Promise.all([
      this.checkSlotDisponible(input),
      this.checkClienteNoTieneCitaMismaHora(input),
    ]);

    if (!slotDisponible) throw new Error('Este horario ya no esta disponible. Elige otro.');
    if (!clienteDisponible) throw new Error('Ya tienes una cita en ese horario.');

    const { data, error } = await supabase
      .from('citas')
      .insert({ ...input, hora: input.hora_inicio, estado: 'pendiente' } as never)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Este horario ya no esta disponible. Elige otro.');
      throw normalizeError(error);
    }

    return data as Cita;
  },

  async cancelarCita(citaId: string) {
    const { data, error } = await supabase
      .from('citas')
      .update({ estado: 'cancelada' } as never)
      .eq('id', citaId)
      .select()
      .single();

    if (error) throw error;
    return data as Cita;
  },

  async adminUpdateEstadoCita(citaId: string, estado: AppointmentStatus) {
    const { data, error } = await supabase
      .from('citas')
      .update({ estado } as never)
      .eq('id', citaId)
      .select()
      .single();

    if (error) throw error;
    return data as Cita;
  },

  formatDate(date: Date) {
    return toIsoDate(date);
  },
};
