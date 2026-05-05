import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

export function DashboardSummary() {
  const { metrics } = useDashboardMetrics();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <article className="rounded-md border border-slate-200 bg-white p-5 shadow-panel" key={metric.label}>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{metric.value}</p>
          {metric.delta ? <p className="mt-2 text-sm text-mint">{metric.delta}</p> : null}
        </article>
      ))}
    </section>
  );
}
