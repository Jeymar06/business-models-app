import type { ReactNode } from 'react';

export function SuperadminMetricCard({
  helper,
  icon,
  label,
  value,
}: {
  helper: string;
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <article className="surface-panel rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
          <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#171717] text-[#F8F4EB]">{icon}</div>
      </div>
    </article>
  );
}
