import { Link, useParams } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ModelDetail } from '@/features/models/components/ModelDetail';
import { useModelById } from '@/features/models/hooks/useModelById';

export function ModelDetailPage() {
  const { modelId } = useParams();
  const { data: model, isLoading } = useModelById(modelId);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando modelo...</p>;
  }

  if (!model) {
    return (
      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-ink">Modelo no encontrado</h1>
        <Link to="/models">
          <Button variant="secondary">Volver a modelos</Button>
        </Link>
      </section>
    );
  }

  return <ModelDetail model={model} />;
}
