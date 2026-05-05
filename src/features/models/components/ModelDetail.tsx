import { canvasSections, type BusinessModel } from '../types';

export function ModelDetail({ model }: { model: BusinessModel }) {
  return (
    <section className="grid gap-6">
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-sm font-medium uppercase tracking-wide text-steel">{model.modelType}</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">{model.name}</h1>
        <p className="mt-3 max-w-3xl text-slate-600">{model.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {canvasSections.map((section) => (
          <article className="rounded-md border border-slate-200 bg-white p-4" key={section.id}>
            <h2 className="text-sm font-semibold text-ink">{section.title}</h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-600">
              {(model.canvas[section.id] ?? []).map((item) => (
                <li className="rounded-md bg-slate-50 px-3 py-2" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
