import { ModelCard } from '@/features/models/components/ModelCard';
import { ModelForm } from '@/features/models/components/ModelForm';
import { useModels } from '@/features/models/hooks/useModels';

export function ModelsPage() {
  const { createModel, error, isCreating, isLoading, models } = useModels();

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <ModelForm isSubmitting={isCreating} onSubmit={createModel} />

      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Modelos</h1>
          <p className="mt-2 text-slate-600">Explora y edita el portafolio de modelos de negocio.</p>
        </div>

        {isLoading ? <p className="text-sm text-slate-500">Cargando modelos...</p> : null}
        {error ? <p className="text-sm text-red-600">No se pudieron cargar los modelos.</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
}
