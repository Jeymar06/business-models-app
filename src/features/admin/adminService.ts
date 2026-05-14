import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { bookingService } from '@/features/booking/bookingService';
import type { Barbero, Barberia, CitaConDetalles, Disponibilidad, Servicio } from '@/types/supabase.types';

export interface BarberoInput {
  nombre: string;
  fotoUrl?: string;
}

export interface ServicioInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMin: number;
}

export interface DisponibilidadInput {
  barberoId: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface BarberiaInput {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  pais: string;
  logoUrl: string;
  bannerUrl: string;
}

export const adminService = {
  async getMyBarberia(adminId: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('barberias').select('*').eq('admin_id', adminId).maybeSingle();
    if (error) throw error;
    return data as Barberia | null;
  },

  async createMyBarberia(adminId: string, input: BarberiaInput) {
    const { data, error } = await supabase
      .from('barberias')
      .insert({
        admin_id: adminId,
        nombre: input.nombre,
        slug: input.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'barberia',
        descripcion: input.descripcion || 'Barberia profesional disponible para reservas en BarberApp.',
        direccion: input.direccion,
        telefono: input.telefono,
        ciudad: input.ciudad || 'Ciudad pendiente',
        pais: input.pais || 'Colombia',
        logo_url: input.logoUrl?.trim() || null,
        banner_url: input.bannerUrl?.trim() || null,
        estado: 'activa',
      } as never)
      .select()
      .single();
    if (error) throw error;
    return data as Barberia;
  },

  async updateBarberia(id: string, input: BarberiaInput) {
    const { data, error } = await supabase
      .from('barberias')
      .update({
        nombre: input.nombre,
        descripcion: input.descripcion || 'Barberia profesional disponible para reservas en BarberApp.',
        direccion: input.direccion,
        telefono: input.telefono,
        ciudad: input.ciudad || 'Ciudad pendiente',
        pais: input.pais || 'Colombia',
        logo_url: input.logoUrl?.trim() || null,
        banner_url: input.bannerUrl?.trim() || null,
      } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Barberia;
  },

  async deleteBarberia(id: string) {
    const { error } = await (supabase as any).rpc('delete_my_barberia');
    if (error) throw error;
  },

  async getBarbers(barberiaId: string) {
    const { data, error } = await supabase.from('barberos').select('*').eq('barberia_id', barberiaId).order('nombre');
    if (error) throw error;
    return data as Barbero[];
  },

  async createBarber(barberiaId: string, input: BarberoInput) {
    const { data, error } = await supabase
      .from('barberos')
      .insert({
        barberia_id: barberiaId,
        nombre: input.nombre,
        foto_url: input.fotoUrl || null,
        activo: true,
      } as never)
      .select()
      .single();
    if (error) throw error;
    return data as Barbero;
  },

  async updateBarber(id: string, input: BarberoInput) {
    const { data, error } = await supabase
      .from('barberos')
      .update({
        nombre: input.nombre,
        foto_url: input.fotoUrl || null,
      } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Barbero;
  },

  async setBarberActive(id: string, activo: boolean) {
    const { data, error } = await supabase
      .from('barberos')
      .update({ activo } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Barbero;
  },

  async getServices(barberiaId: string) {
    const { data, error } = await supabase.from('servicios').select('*').eq('barberia_id', barberiaId).order('nombre');
    if (error) throw error;
    return data as Servicio[];
  },

  async createService(barberiaId: string, input: ServicioInput) {
    const { data, error } = await supabase
      .from('servicios')
      .insert({
        barberia_id: barberiaId,
        nombre: input.nombre,
        descripcion: input.descripcion || null,
        precio: input.precio,
        duracion_min: input.duracionMin,
        activo: true,
      } as never)
      .select()
      .single();
    if (error) throw error;
    return data as Servicio;
  },

  async updateService(id: string, input: ServicioInput) {
    const { data, error } = await supabase
      .from('servicios')
      .update({
        nombre: input.nombre,
        descripcion: input.descripcion || null,
        precio: input.precio,
        duracion_min: input.duracionMin,
      } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Servicio;
  },

  async setServiceActive(id: string, activo: boolean) {
    const { data, error } = await supabase
      .from('servicios')
      .update({ activo } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Servicio;
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

  async createAvailability(input: DisponibilidadInput) {
    const { data, error } = await supabase
      .from('disponibilidad')
      .insert({
        barbero_id: input.barberoId,
        dia_semana: input.diaSemana,
        hora_inicio: input.horaInicio,
        hora_fin: input.horaFin,
      } as never)
      .select()
      .single();
    if (error) throw error;
    return data as Disponibilidad;
  },

  async updateAvailability(id: string, input: DisponibilidadInput) {
    const { data, error } = await supabase
      .from('disponibilidad')
      .update({
        dia_semana: input.diaSemana,
        hora_inicio: input.horaInicio,
        hora_fin: input.horaFin,
      } as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Disponibilidad;
  },

  async deleteAvailability(id: string) {
    const { error } = await supabase.from('disponibilidad').delete().eq('id', id);
    if (error) throw error;
  },

  async getAppointments(barberiaId: string) {
    return bookingService.getCitasByBarberia(barberiaId);
  },
};
