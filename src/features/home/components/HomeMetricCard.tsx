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
    <article className="surface-panel group rounded-[24px] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-panel">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
          <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-soft transition group-hover:bg-mint">
          {icon}
        </div>
      </div>
      {hint ? <p className="text-sm leading-6 text-slate-500">{hint}</p> : <div className="h-[24px]" />}
    </article>
  );
}
