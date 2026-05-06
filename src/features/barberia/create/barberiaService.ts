import { supabase } from '@/lib/supabase';
import type { Barberia } from '@/types/supabase.types';

import type { CreateBarberiaFormValues } from './schema';

export interface CreateBarberiaPayload extends CreateBarberiaFormValues {
  adminId: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

export function generateSlug(nombre: string) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'barberia';
}

export const barberiaService = {
  generateSlug,

  async getBarberiaByAdmin(userId: string) {
    const { data, error } = await supabase.from('barberias').select('*').eq('admin_id', userId).maybeSingle();
    if (error) throw error;
    return data as Barberia | null;
  },

  async getUniqueSlug(nombre: string) {
    const baseSlug = generateSlug(nombre);
    const { data, error } = await supabase.from('barberias').select('slug').like('slug', `${baseSlug}%`);
    if (error) throw error;

    const existing = new Set(((data ?? []) as Array<{ slug: string }>).map((item) => item.slug));
    if (!existing.has(baseSlug)) return baseSlug;

    let suffix = 2;
    while (existing.has(`${baseSlug}-${suffix}`)) suffix += 1;
    return `${baseSlug}-${suffix}`;
  },

  async createBarberia(input: CreateBarberiaPayload) {
    const existing = await this.getBarberiaByAdmin(input.adminId);
    if (existing) {
      throw new Error('Ya tienes una barberia registrada.');
    }

    const slug = await this.getUniqueSlug(input.nombre);
    const { data, error } = await supabase
      .from('barberias')
      .insert({
        nombre: input.nombre,
        slug,
        descripcion: input.descripcion,
        telefono: input.telefono,
        email_contacto: input.emailContacto || null,
        sitio_web: null,
        direccion: input.direccion,
        ciudad: input.ciudad,
        estado_provincia: input.estadoProvincia || null,
        pais: input.pais,
        codigo_postal: input.codigoPostal || null,
        logo_url: input.logoUrl || null,
        banner_url: input.bannerUrl || null,
        admin_id: input.adminId,
        activo: true,
        verificada: false,
        acepta_reservas: true,
        horario_apertura: input.horarioApertura || null,
        horario_cierre: input.horarioCierre || null,
        moneda: input.moneda,
        zona_horaria: input.zonaHoraria,
        politica_cancelacion: input.politicaCancelacion,
        tiempo_cancelacion_min: input.tiempoCancelacionMin,
        visible: true,
        destacado: false,
        estado: 'activa',
      } as never)
      .select()
      .single();

    if (error) throw error;
    return data as Barberia;
  },

  async updateBarberia(id: string, input: Partial<CreateBarberiaPayload>) {
    const { data, error } = await supabase
      .from('barberias')
      .update({
        nombre: input.nombre,
        descripcion: input.descripcion,
        telefono: input.telefono,
        email_contacto: input.emailContacto || null,
        direccion: input.direccion,
        ciudad: input.ciudad,
        estado_provincia: input.estadoProvincia || null,
        pais: input.pais,
        codigo_postal: input.codigoPostal || null,
        logo_url: input.logoUrl,
        banner_url: input.bannerUrl,
        horario_apertura: input.horarioApertura || null,
        horario_cierre: input.horarioCierre || null,
        moneda: input.moneda,
        zona_horaria: input.zonaHoraria,
        politica_cancelacion: input.politicaCancelacion,
        tiempo_cancelacion_min: input.tiempoCancelacionMin,
      } as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Barberia;
  },
};
