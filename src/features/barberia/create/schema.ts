import { z } from 'zod';

// Schema de validación flexible para cada paso
export const step1Schema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'Describe la barberia con al menos 10 caracteres'),
  telefono: z.string().min(7, 'Ingresa un telefono valido'),
  emailContacto: z.string().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Email invalido'),
});

export const step2Schema = z.object({
  direccion: z.string().min(3, 'La direccion es requerida'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  pais: z.string().min(2, 'El pais es requerido'),
});

export const step4Schema = z.object({
  moneda: z.string().min(3).max(3),
  zonaHoraria: z.string().min(3, 'Selecciona una zona horaria'),
  politicaCancelacion: z.string().min(10, 'Agrega una politica corta de cancelacion'),
  tiempoCancelacionMin: z.coerce.number().int().min(0).max(10080),
  horarioApertura: z.string(),
  horarioCierre: z.string(),
});

export const createBarberiaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'Describe la barberia con al menos 10 caracteres'),
  telefono: z.string().min(7, 'Ingresa un telefono valido'),
  emailContacto: z.string().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Email invalido'),
  direccion: z.string().min(3, 'La direccion es requerida'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  estadoProvincia: z.string().optional().default(''),
  pais: z.string().min(2, 'El pais es requerido'),
  codigoPostal: z.string().optional().default(''),
  moneda: z.string().min(3).max(3),
  zonaHoraria: z.string().min(3, 'Selecciona una zona horaria'),
  politicaCancelacion: z.string().min(10, 'Agrega una politica corta de cancelacion'),
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
