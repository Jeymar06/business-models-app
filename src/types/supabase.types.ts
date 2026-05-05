// Auto-generated types from Supabase
export type UserRole = 'client' | 'admin' | 'superadmin';
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Barberia {
  id: string;
  nombre: string;
  direccion: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface Barbero {
  id: string;
  nombre: string;
  barberia_id: string;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_min: number;
  barberia_id: string;
  created_at: string;
  updated_at: string;
}

export interface Disponibilidad {
  id: string;
  barbero_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
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
          full_name?: string | null;
          role?: UserRole;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
        };
      };
      barberias: {
        Row: Barberia;
        Insert: {
          nombre: string;
          direccion: string;
          admin_id: string;
        };
        Update: {
          nombre?: string;
          direccion?: string;
        };
      };
      barberos: {
        Row: Barbero;
        Insert: {
          nombre: string;
          barberia_id: string;
          foto_url?: string | null;
        };
        Update: {
          nombre?: string;
          foto_url?: string | null;
        };
      };
      servicios: {
        Row: Servicio;
        Insert: {
          nombre: string;
          precio: number;
          duracion_min?: number;
          barberia_id: string;
        };
        Update: {
          nombre?: string;
          precio?: number;
          duracion_min?: number;
        };
      };
      disponibilidad: {
        Row: {
          id: string;
          barbero_id: string;
          dia_semana: number;
          hora_inicio: string;
          hora_fin: string;
          created_at: string;
        };
        Insert: {
          barbero_id: string;
          dia_semana: number;
          hora_inicio: string;
          hora_fin: string;
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
