// Auto-generated types from Supabase
export type UserRole = 'client' | 'admin' | 'superadmin';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
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
        Row: {
          id: string;
          nombre: string;
          direccion: string;
          telefono: string | null;
          admin_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          nombre: string;
          direccion: string;
          telefono?: string | null;
          admin_id: string;
        };
        Update: {
          nombre?: string;
          direccion?: string;
          telefono?: string | null;
        };
      };
      barberos: {
        Row: {
          id: string;
          nombre: string;
          barberia_id: string;
          foto_url: string | null;
          especialidades: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          nombre: string;
          barberia_id: string;
          foto_url?: string | null;
          especialidades?: string | null;
        };
        Update: {
          nombre?: string;
          foto_url?: string | null;
          especialidades?: string | null;
          activo?: boolean;
        };
      };
      servicios: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          precio: number;
          duracion_min: number;
          barberia_id: string;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          nombre: string;
          descripcion?: string | null;
          precio: number;
          duracion_min?: number;
          barberia_id: string;
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
        Row: {
          id: string;
          cliente_id: string;
          barbero_id: string;
          servicio_id: string;
          fecha: string;
          hora: string;
          estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cliente_id: string;
          barbero_id: string;
          servicio_id: string;
          fecha: string;
          hora: string;
          notas?: string | null;
        };
        Update: {
          estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
          notas?: string | null;
        };
      };
      notificaciones: {
        Row: {
          id: string;
          cita_id: string;
          tipo: 'confirmacion' | 'recordatorio' | 'cancelacion';
          destinatario_email: string;
          enviado_at: string | null;
          created_at: string;
        };
        Insert: {
          cita_id: string;
          tipo: 'confirmacion' | 'recordatorio' | 'cancelacion';
          destinatario_email: string;
        };
      };
    };
  };
};
