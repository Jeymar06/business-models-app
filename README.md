# Barber App - Sistema de Agendamiento de Citas

Aplicación web completa para gestionar barberías con agendamiento de citas inteligente.

## 🏗️ Arquitectura

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployments**: Vercel (Frontend)

## 📋 Roles

- **Super Admin**: Gestión global de barberías
- **Admin**: Gestión de su barbería (barberos, servicios, horarios)
- **Cliente**: Agendamiento de citas

## 🚀 Stack Técnico

```
React 18 + TypeScript + Vite
├── date-fns (manejo de fechas)
├── react-hook-form (formularios)
├── zod (validación)
├── lucide-react (iconos)
└── @supabase/supabase-js (backend)

Tailwind CSS + PostCSS
React Router v6 (navegación)
```

## 📦 Base de Datos

7 tablas principales con Row Level Security:
- `profiles` - Usuarios con roles
- `barberias` - Barbería
- `barberos` - Barberos
- `servicios` - Servicios ofrecidos
- `disponibilidad` - Horarios disponibles
- `citas` - Agendamiento de citas
- `notificaciones` - Email notifications

## 🔧 Instalación

```bash
npm install
cp .env.example .env.local
# Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

## 📝 Licencia

MIT

## 👤 Autor

Jeymar Dev
