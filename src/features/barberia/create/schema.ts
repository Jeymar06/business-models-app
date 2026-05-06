import { z } from 'zod';

export const createBarberiaSchema = z.object({
  nombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().trim().min(20, 'Describe la barberia con al menos 20 caracteres'),
  telefono: z.string().trim().min(7, 'Ingresa un telefono valido').regex(/^[+()\d\s-]+$/, 'Ingresa un telefono valido'),
  emailContacto: z.string().trim().refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Email invalido'),
  direccion: z.string().trim().min(3, 'La direccion es requerida'),
  ciudad: z.string().trim().min(2, 'La ciudad es requerida'),
  estadoProvincia: z.string().trim(),
  pais: z.string().trim().min(2, 'El pais es requerido'),
  codigoPostal: z.string().trim(),
  moneda: z.string().trim().min(3).max(3),
  zonaHoraria: z.string().trim().min(3, 'Selecciona una zona horaria'),
  politicaCancelacion: z.string().trim().min(10, 'Agrega una politica corta de cancelacion'),
  tiempoCancelacionMin: z.coerce.number().int().min(0).max(10080),
  horarioApertura: z.string(),
  horarioCierre: z.string(),
});

export type CreateBarberiaFormValues = z.infer<typeof createBarberiaSchema>;

export const defaultCreateBarberiaValues: CreateBarberiaFormValues = {
  nombre: '',
  descripcion: '',
  telefono: '',
  emailContacto: '',
  direccion: '',
  ciudad: '',
  estadoProvincia: '',
  pais: 'Colombia',
  codigoPostal: '',
  moneda: 'USD',
  zonaHoraria: 'America/Bogota',
  politicaCancelacion: 'Puedes cancelar tu cita con al menos 24 horas de anticipacion.',
  tiempoCancelacionMin: 1440,
  horarioApertura: '09:00',
  horarioCierre: '18:00',
};

export const stepFields: Array<Array<keyof CreateBarberiaFormValues>> = [
  ['nombre', 'descripcion', 'telefono', 'emailContacto'],
  ['direccion', 'ciudad', 'estadoProvincia', 'pais', 'codigoPostal'],
  [],
  ['moneda', 'zonaHoraria', 'politicaCancelacion', 'tiempoCancelacionMin', 'horarioApertura', 'horarioCierre'],
];
