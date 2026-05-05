import { addMinutes, format, isSameDay, parse, startOfDay } from 'date-fns';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Barbero, Barberia, Cita, Disponibilidad, Servicio } from '@/types/supabase.types';

export interface BookingSlot {
  fecha: string;
  hora: string;
  label: string;
}

const demoBarberia: Barberia = {
  id: 'demo-barberia',
  nombre: 'Barberia Central',
  direccion: 'Calle principal #123',
  telefono: null,
  admin_id: 'demo-admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const demoServices: Servicio[] = [
  { id: 'corte', nombre: 'Corte clasico', descripcion: null, precio: 35000, duracion_min: 40, barberia_id: demoBarberia.id, activo: true, created_at: '', updated_at: '' },
  { id: 'barba', nombre: 'Barba premium', descripcion: null, precio: 25000, duracion_min: 30, barberia_id: demoBarberia.id, activo: true, created_at: '', updated_at: '' },
  { id: 'combo', nombre: 'Corte + barba', descripcion: null, precio: 55000, duracion_min: 60, barberia_id: demoBarberia.id, activo: true, created_at: '', updated_at: '' },
];

const demoBarbers: Barbero[] = [
  { id: 'andres', nombre: 'Andres Rivera', barberia_id: demoBarberia.id, foto_url: null, activo: true, created_at: '', updated_at: '' },
  { id: 'mateo', nombre: 'Mateo Cruz', barberia_id: demoBarberia.id, foto_url: null, activo: true, created_at: '', updated_at: '' },
];

export const bookingService = {
  async getBarberias() {
    if (!isSupabaseConfigured) return [demoBarberia];
    const { data, error } = await supabase.from('barberias').select('*').order('nombre');
    if (error) throw error;
    return data as Barberia[];
  },

  async getServices(barberiaId?: string) {
    if (!isSupabaseConfigured) return demoServices;
    let query = supabase.from('servicios').select('*').order('nombre');
    if (barberiaId) query = query.eq('barberia_id', barberiaId);
    const { data, error } = await query;
    if (error) throw error;
    return (data as Servicio[]).filter((service) => service.activo);
  },

  async getBarbers(barberiaId?: string) {
    if (!isSupabaseConfigured) return demoBarbers;
    let query = supabase.from('barberos').select('*').order('nombre');
    if (barberiaId) query = query.eq('barberia_id', barberiaId);
    const { data, error } = await query;
    if (error) throw error;
    return (data as Barbero[]).filter((barber) => barber.activo);
  },

  async getSlots(barberoId: string, servicio: Servicio, date: Date) {
    if (!isSupabaseConfigured) return buildSlots(date, servicio.duracion_min, [], []);

    const weekday = date.getDay();
    const fecha = format(date, 'yyyy-MM-dd');
    const [{ data: availability, error: availabilityError }, { data: appointments, error: appointmentsError }] =
      await Promise.all([
        supabase.from('disponibilidad').select('*').eq('barbero_id', barberoId).eq('dia_semana', weekday),
        supabase.from('citas').select('*').eq('barbero_id', barberoId).eq('fecha', fecha).neq('estado', 'cancelada'),
      ]);

    if (availabilityError) throw availabilityError;
    if (appointmentsError) throw appointmentsError;

    return buildSlots(date, servicio.duracion_min, availability as Disponibilidad[], appointments as Cita[]);
  },

  async createAppointment(input: { clienteId: string; barberoId: string; servicioId: string; fecha: string; hora: string }) {
    if (!isSupabaseConfigured) return { id: crypto.randomUUID(), estado: 'confirmada', ...input };

    const { data, error } = await supabase
      .from('citas')
      .insert({
        cliente_id: input.clienteId,
        barbero_id: input.barberoId,
        servicio_id: input.servicioId,
        fecha: input.fecha,
        hora: input.hora,
      } as never)
      .select()
      .single();

    if (error) throw error;
    return data as Cita;
  },

  async getClientAppointments(clienteId: string) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });
    if (error) throw error;
    return data as Cita[];
  },
};

function buildSlots(date: Date, duration: number, availability: Disponibilidad[], appointments: Cita[]): BookingSlot[] {
  const blocks = availability.length
    ? availability
    : [{ hora_inicio: '09:00', hora_fin: '18:00' } as Disponibilidad];

  return blocks.flatMap((block) => {
    const slots: BookingSlot[] = [];
    let cursor = parse(block.hora_inicio.slice(0, 5), 'HH:mm', startOfDay(date));
    const end = parse(block.hora_fin.slice(0, 5), 'HH:mm', startOfDay(date));

    while (addMinutes(cursor, duration) <= end) {
      const hora = format(cursor, 'HH:mm');
      const isTaken = appointments.some((appointment) => appointment.hora.slice(0, 5) === hora && isSameDay(parse(appointment.fecha, 'yyyy-MM-dd', new Date()), date));
      if (!isTaken) {
        slots.push({ fecha: format(date, 'yyyy-MM-dd'), hora, label: format(cursor, 'h:mm a') });
      }
      cursor = addMinutes(cursor, duration);
    }

    return slots;
  });
}
