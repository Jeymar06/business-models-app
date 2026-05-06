import { ArrowRight, CalendarCheck, Mail, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === 'admin' ? '/admin-dashboard' : role === 'superadmin' ? '/superadmin-dashboard' : '/client-dashboard';

  return (
    <div className="space-y-16">
      <section className="grid min-h-[68vh] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-sm font-medium text-mint">
            <CalendarCheck size={16} />
            Agenda online para barberias
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-ink">Barber App</h1>
            <p className="max-w-2xl text-xl leading-8 text-slate-600">
              Login por roles, agenda protegida, gestion de barberos y servicios, citas por slots y metricas para operar la barberia sin hojas sueltas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/booking"><Button size="lg">Agendar cita<ArrowRight size={18} /></Button></Link>
                <Link to={dashboardPath}><Button size="lg" variant="secondary">Ir al panel</Button></Link>
                {role === 'client' ? <Link to="/crear-barberia"><Button size="lg" variant="secondary">Crear mi barberia</Button></Link> : null}
              </>
            ) : (
              <>
                <Link to="/register"><Button size="lg">Crear cuenta<ArrowRight size={18} /></Button></Link>
                <Link to="/login"><Button size="lg" variant="secondary">Entrar</Button></Link>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <div className="grid gap-4">
            <Stat label="Flujo de reserva" value="4 pasos" />
            <Stat label="Roles protegidos" value="3" />
            <Stat label="Stack actual" value="Vite + Supabase" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature icon={<ShieldCheck size={20} />} title="RLS por rol" text="Cliente ve sus citas, admin ve su barberia y superadmin ve todo." />
        <Feature icon={<CalendarCheck size={20} />} title="Slots con date-fns" text="La disponibilidad se cruza con citas existentes para ofrecer horarios reales." />
        <Feature icon={<Mail size={20} />} title="Notificaciones listas" text="Tabla preparada para confirmaciones y recordatorios de 24 horas." />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-5"><div className="text-3xl font-bold text-ink">{value}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>;
}

function Feature({ icon, text, title }: { icon: ReactNode; text: string; title: string }) {
  return <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"><div className="mb-3 text-steel">{icon}</div><h2 className="font-semibold text-ink">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>;
}
