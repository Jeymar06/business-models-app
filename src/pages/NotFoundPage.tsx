import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';

export function NotFoundPage() {
  return (
    <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-8 shadow-panel">
      <h1 className="text-3xl font-semibold text-ink">Pagina no encontrada</h1>
      <p className="text-slate-600">La ruta solicitada no existe en la aplicacion.</p>
      <Link to="/">
        <Button variant="secondary">Volver al inicio</Button>
      </Link>
    </section>
  );
}
