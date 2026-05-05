import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Barbero, Barberia, Cita, Disponibilidad, Servicio } from '@/types/supabase.types';

export const adminService = {
  async getMyBarberia(adminId: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('barberias').select('*').eq('admin_id', adminId).maybeSingle();
    if (error) throw error;
    return data as Barberia | null;
  },

  async getBarbers(barberiaId: string) {
    const { data, error } = await supabase.from('barberos').select('*').eq('barberia_id', barberiaId).order('nombre');
    if (error) throw error;
    return data as Barbero[];
  },

  async createBarber(input: { barberiaId: string; nombre: string; fotoUrl?: string }) {
    const { error } = await supabase.from('barberos').insert({
      barberia_id: input.barberiaId,
      nombre: input.nombre,
      foto_url: input.fotoUrl || null,
    } as never);
    if (error) throw error;
  },

  async updateBarber(input: { id: string; nombre: string; fotoUrl?: string }) {
    const { error } = await supabase
      .from('barberos')
      .update({
        nombre: input.nombre,
        foto_url: input.fotoUrl || null,
      } as never)
      .eq('id', input.id);
    if (error) throw error;
  },

  async deleteBarber(id: string) {
    const { error } = await supabase.from('barberos').delete().eq('id', id);
    if (error) throw error;
  },

  async getServices(barberiaId: string) {
    const { data, error } = await supabase.from('servicios').select('*').eq('barberia_id', barberiaId).order('nombre');
    if (error) throw error;
    return data as Servicio[];
  },

  async createService(input: { barberiaId: string; nombre: string; precio: number; duracionMin: number }) {
    const { error } = await supabase.from('servicios').insert({
      barberia_id: input.barberiaId,
      nombre: input.nombre,
      precio: input.precio,
      duracion_min: input.duracionMin,
    } as never);
    if (error) throw error;
  },

  async updateService(input: { id: string; nombre: string; precio: number; duracionMin: number }) {
    const { error } = await supabase
      .from('servicios')
      .update({
        nombre: input.nombre,
        precio: input.precio,
        duracion_min: input.duracionMin,
      } as never)
      .eq('id', input.id);
    if (error) throw error;
  },

  async deleteService(id: string) {
    const { error } = await supabase.from('servicios').delete().eq('id', id);
    if (error) throw error;
  },

  async getAvailability(barberiaId: string) {
    const { data, error } = await supabase
      .from('disponibilidad')
      .select('*, barberos!inner(barberia_id)')
      .eq('barberos.barberia_id', barberiaId)
      .order('dia_semana', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    return data as unknown as Disponibilidad[];
  },

  async createAvailability(input: { barberoId: string; diaSemana: number; horaInicio: string; horaFin: string }) {
    const { error } = await supabase.from('disponibilidad').insert({
      barbero_id: input.barberoId,
      dia_semana: input.diaSemana,
      hora_inicio: input.horaInicio,
      hora_fin: input.horaFin,
    } as never);
    if (error) throw error;
  },

  async updateAvailability(input: { id: string; diaSemana: number; horaInicio: string; horaFin: string }) {
    const { error } = await supabase
      .from('disponibilidad')
      .update({
        dia_semana: input.diaSemana,
        hora_inicio: input.horaInicio,
        hora_fin: input.horaFin,
      } as never)
      .eq('id', input.id);
    if (error) throw error;
  },

  async deleteAvailability(id: string) {
    const { error } = await supabase.from('disponibilidad').delete().eq('id', id);
    if (error) throw error;
  },

  async getAppointments(barberiaId: string) {
    const { data, error } = await supabase
      .from('citas')
      .select('*, barberos!inner(barberia_id)')
      .eq('barberos.barberia_id', barberiaId)
      .order('fecha', { ascending: true });
    if (error) throw error;
    return data as unknown as Cita[];
  },
};
