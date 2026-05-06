// Auto-generated types from Supabase
export type UserRole = 'client' | 'admin' | 'superadmin';
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Barberia {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  logo_url: string | null;
  banner_url: string | null;
  telefono: string;
  email_contacto: string | null;
  sitio_web: string | null;
  direccion: string;
  ciudad: string;
  estado_provincia: string | null;
  pais: string;
  codigo_postal: string | null;
  latitud: number | null;
  longitud: number | null;
  admin_id: string;
  activo: boolean;
  verificada: boolean;
  acepta_reservas: boolean;
  horario_apertura: string | null;
  horario_cierre: string | null;
  moneda: string;
  zona_horaria: string;
  politica_cancelacion: string | null;
  tiempo_cancelacion_min: number;
  visible: boolean;
  destacado: boolean;
  estado: 'pendiente' | 'activa' | 'suspendida';
  created_at: string;
  updated_at: string;
}

export interface Barbero {
  id: string;
  nombre: string;
  barberia_id: string;
  foto_url: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion_min: number;
  barberia_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Disponibilidad {
  id: string;
  barbero_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  created_at: string;
}

export interface Cita {
  id: string;
  cliente_id: string;
  barbero_id: string;
  servicio_id: string;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          avatar_url?: string | null;
          full_name?: string | null;
          role?: UserRole;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          role?: UserRole;
        };
      };
      barberias: {
        Row: Barberia;
        Insert: {
          nombre: string;
          slug: string;
          descripcion: string;
          logo_url?: string | null;
          banner_url?: string | null;
          telefono: string;
          email_contacto?: string | null;
          sitio_web?: string | null;
          direccion: string;
          ciudad: string;
          estado_provincia?: string | null;
          pais: string;
          codigo_postal?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          admin_id: string;
          activo?: boolean;
          verificada?: boolean;
          acepta_reservas?: boolean;
          horario_apertura?: string | null;
          horario_cierre?: string | null;
          moneda?: string;
          zona_horaria?: string;
          politica_cancelacion?: string | null;
          tiempo_cancelacion_min?: number;
          visible?: boolean;
          destacado?: boolean;
          estado?: 'pendiente' | 'activa' | 'suspendida';
        };
        Update: {
          nombre?: string;
          slug?: string;
          descripcion?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          telefono?: string;
          email_contacto?: string | null;
          sitio_web?: string | null;
          direccion?: string;
          ciudad?: string;
          estado_provincia?: string | null;
          pais?: string;
          codigo_postal?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          activo?: boolean;
          verificada?: boolean;
          acepta_reservas?: boolean;
          horario_apertura?: string | null;
          horario_cierre?: string | null;
          moneda?: string;
          zona_horaria?: string;
          politica_cancelacion?: string | null;
          tiempo_cancelacion_min?: number;
          visible?: boolean;
          destacado?: boolean;
          estado?: 'pendiente' | 'activa' | 'suspendida';
        };
      };
      barberos: {
        Row: Barbero;
        Insert: {
          nombre: string;
          barberia_id: string;
          foto_url?: string | null;
          activo?: boolean;
        };
        Update: {
          nombre?: string;
          foto_url?: string | null;
          activo?: boolean;
        };
      };
      servicios: {
        Row: Servicio;
        Insert: {
          nombre: string;
          descripcion?: string | null;
          precio: number;
          duracion_min?: number;
          barberia_id: string;
          activo?: boolean;
        };
        Update: {
          nombre?: string;
          descripcion?: string | null;
          precio?: number;
          duracion_min?: number;
          activo?: boolean;
        };
      };
      disponibilidad: {
        Row: Disponibilidad;
        Insert: {
          barbero_id: string;
          dia_semana: number;
          hora_inicio: string;
          hora_fin: string;
        };
        Update: {
          dia_semana?: number;
          hora_inicio?: string;
          hora_fin?: string;
        };
      };
      citas: {
        Row: Cita;
        Insert: {
          cliente_id: string;
          barbero_id: string;
          servicio_id: string;
          fecha: string;
          hora: string;
        };
        Update: {
          estado?: AppointmentStatus;
        };
      };
      notificaciones: {
        Row: {
          id: string;
          cita_id: string;
          tipo: 'confirmacion' | 'recordatorio';
          enviado_at: string | null;
          created_at: string;
        };
        Insert: {
          cita_id: string;
          tipo: 'confirmacion' | 'recordatorio';
        };
      };
    };
  };
};
