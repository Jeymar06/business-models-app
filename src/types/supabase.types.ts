export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      business_models: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          type: string;
          status: 'draft' | 'active' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          type?: string;
          status?: 'draft' | 'active' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          type?: string;
          status?: 'draft' | 'active' | 'archived';
          created_at?: string;
        };
        Relationships: [];
      };
      canvas_blocks: {
        Row: {
          id: string;
          model_id: string;
          block_type: string;
          content: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          block_type: string;
          content?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          block_type?: string;
          content?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
