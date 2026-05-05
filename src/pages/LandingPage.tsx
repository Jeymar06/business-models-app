import { ArrowRight, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LandingPage() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-sm text-mint">
              <Scissors size={16} />
              Tu barber shop digitalizado
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-ink">
              Agendamiento de citas inteligente
            </h1>
            <p className="text-xl text-slate-600">
              Gestiona tu barbería, clientes y citas en un solo lugar. Aumenta eficiencia, reduce cancelaciones.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button size="lg">
                    Entrar
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Crear cuenta
                  </Button>
                </Link>
              </>
            ) : role === 'client' ? (
              <Link to="/booking">
                <Button size="lg">
                  Agendar cita
                  <ArrowRight size={18} />
                </Button>
              </Link>
            ) : role === 'admin' ? (
              <Link to="/admin-dashboard">
                <Button size="lg">
                  Panel de administración
                  <ArrowRight size={18} />
                </Button>
              </Link>
            ) : (
              <Link to="/superadmin-dashboard">
                <Button size="lg">
                  Panel Super Admin
                  <ArrowRight size={18} />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-mint/10 to-coral/10 p-12">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-mint">3</div>
              <p className="text-slate-600">Roles de usuarios</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-coral">∞</div>
              <p className="text-slate-600">Barbería ilimitadas</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-steel">24/7</div>
              <p className="text-slate-600">Agendamiento disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ink">Características</h2>
          <p className="mt-2 text-slate-600">Todo lo que necesitas para gestionar tu barbería</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Agendamiento Inteligente',
              description: 'Sistema de 4 pasos: servicio → barbero → horario → confirmar',
              icon: '📅',
            },
            {
              title: 'Panel Admin Completo',
              description: 'Gestiona barberos, servicios, horarios y estadísticas',
              icon: '⚙️',
            },
            {
              title: 'Notificaciones',
              description: 'Emails de confirmación y recordatorios 24h antes',
              icon: '📧',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
