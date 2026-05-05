# Barber App

Sistema de agendamiento para barberias con React, TypeScript, Vite y Supabase.

## Stack

- React 18 + TypeScript + Vite
- Supabase Auth + PostgreSQL + RLS
- React Router
- React Hook Form + Zod
- date-fns para horarios y slots
- Chart.js para metricas

## Roles

- `client`: agenda y consulta sus citas.
- `admin`: gestiona su barberia, barberos, servicios y agenda.
- `superadmin`: consulta la operacion global.

## Estructura

```txt
src/features/auth
src/features/booking
src/features/admin
src/pages
src/routes
supabase/migrations
```

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`.
