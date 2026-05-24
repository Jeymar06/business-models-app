import { z } from 'zod';

export const createBarberiaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'Describe la barberia con al menos 10 caracteres'),
  telefono: z.string().min(7, 'Ingresa un telefono valido'),
  emailContacto: z.string().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Email invalido'),
  direccion: z.string().min(3, 'La direccion es requerida'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  estadoProvincia: z.string(),
  pais: z.string().min(2, 'El pais es requerido'),
  codigoPostal: z.string(),
  logoUrl: z.string().refine((val) => !val || /^https?:\/\/.+/i.test(val), 'URL invalida'),
  bannerUrl: z.string().refine((val) => !val || /^https?:\/\/.+/i.test(val), 'URL invalida'),
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
  logoUrl: '',
  bannerUrl: '',
  moneda: 'COP',
  zonaHoraria: 'America/Bogota',
  politicaCancelacion: 'Puedes cancelar tu cita con al menos 24 horas de anticipacion.',
  tiempoCancelacionMin: 1440,
  horarioApertura: '09:00',
  horarioCierre: '18:00',
};

export const stepFields: Array<Array<keyof CreateBarberiaFormValues>> = [
  ['nombre', 'descripcion', 'telefono', 'emailContacto'],
  ['direccion', 'ciudad', 'estadoProvincia', 'pais', 'codigoPostal'],
  ['logoUrl', 'bannerUrl'],
  ['zonaHoraria', 'politicaCancelacion', 'tiempoCancelacionMin', 'horarioApertura', 'horarioCierre'],
];
