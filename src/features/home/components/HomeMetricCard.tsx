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
    <article className="group relative overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-500/30 hover:shadow-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-500/0 blur-3xl transition-colors duration-500 group-hover:bg-gold-500/12"
      />
      <div className="relative mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-ink/45">{label}</p>
          <p className="font-display numeric mt-3 text-4xl font-semibold tracking-tight text-ink">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/8 bg-ink text-gold-300 transition-all duration-300 group-hover:border-gold-500/35 group-hover:bg-[#141210]">
          {icon}
        </div>
      </div>
      {hint ? (
        <p className="relative text-sm leading-6 text-ink/55">{hint}</p>
      ) : (
        <div className="h-[20px]" />
      )}
    </article>
  );
}
