-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'superadmin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Barberías
CREATE TABLE barberias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT,
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Barberos
CREATE TABLE barberos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  barberia_id UUID NOT NULL REFERENCES barberias(id) ON DELETE CASCADE,
  foto_url TEXT,
  especialidades TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Servicios
CREATE TABLE servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  duracion_min INTEGER NOT NULL DEFAULT 30,
  barberia_id UUID NOT NULL REFERENCES barberias(id) ON DELETE CASCADE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disponibilidad de barberos
CREATE TABLE disponibilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbero_id UUID NOT NULL REFERENCES barberos(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citas
CREATE TABLE citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  barbero_id UUID NOT NULL REFERENCES barberos(id) ON DELETE CASCADE,
  servicio_id UUID NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID NOT NULL REFERENCES citas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('confirmacion', 'recordatorio', 'cancelacion')),
  destinatario_email TEXT NOT NULL,
  enviado_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_barberias_admin_id ON barberias(admin_id);
CREATE INDEX idx_barberos_barberia_id ON barberos(barberia_id);
CREATE INDEX idx_servicios_barberia_id ON servicios(barberia_id);
CREATE INDEX idx_disponibilidad_barbero_id ON disponibilidad(barbero_id);
CREATE INDEX idx_citas_cliente_id ON citas(cliente_id);
CREATE INDEX idx_citas_barbero_id ON citas(barbero_id);
CREATE INDEX idx_citas_fecha ON citas(fecha);
CREATE INDEX idx_notificaciones_cita_id ON notificaciones(cita_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE barberias ENABLE ROW LEVEL SECURITY;
ALTER TABLE barberos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- RLS: Profiles - Users can read their own profile and superadmin reads all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Superadmin can read all profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );

-- RLS: Barberias - Users can read barberias they're admins of
CREATE POLICY "Admins can read their barberia" ON barberias
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    OR admin_id = auth.uid()
  );

-- RLS: Servicios - Users can read servicios from barberia (public reading for booking)
CREATE POLICY "Anyone can read servicios" ON servicios
  FOR SELECT USING (true);

-- RLS: Citas - Users can read their own citas
CREATE POLICY "Clients can read own citas" ON citas
  FOR SELECT USING (cliente_id = auth.uid());

-- RLS: Citas - Admins can read citas of their barberia
CREATE POLICY "Admins can read citas of their barberia" ON citas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM barberos b
      INNER JOIN barberias bar ON b.barberia_id = bar.id
      WHERE b.id = citas.barbero_id
      AND bar.admin_id = auth.uid()
    )
  );

-- RLS: Citas - Superadmin can read all citas
CREATE POLICY "Superadmin can read all citas" ON citas
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );
