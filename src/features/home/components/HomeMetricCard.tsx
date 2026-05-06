import type { ReactNode } from 'react';

export function HomeMetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
        <span className="text-steel">{icon}</span>
        {label}
      </div>
      <p className="text-3xl font-bold text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </article>
  );
}
