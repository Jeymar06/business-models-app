import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="grid gap-6 rounded-md border border-slate-200 bg-white p-8 shadow-panel">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-steel">Business Models App</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">Portafolio vivo de modelos de negocio</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Organiza modelos, compara escenarios y convierte cada idea en un canvas accionable.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/models">
            <Button>
              <Plus aria-hidden size={18} />
              Crear modelo
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">
              Ver dashboard
              <ArrowRight aria-hidden size={18} />
            </Button>
          </Link>
        </div>
      </div>

      <aside className="grid gap-3 rounded-md border border-slate-200 bg-ink p-5 text-white shadow-panel">
        <p className="text-sm text-white/70">Foco actual</p>
        <h2 className="text-2xl font-semibold">Validacion de propuesta de valor</h2>
        <p className="text-sm leading-6 text-white/75">
          Priorizacion por segmentos, canales y fuentes de ingreso antes de invertir en operacion.
        </p>
      </aside>
    </section>
  );
}
