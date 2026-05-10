import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function QuickActionCard({
  description,
  icon,
  title,
  to,
}: {
  description: string;
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link
      className="group relative overflow-hidden rounded-[24px] border border-ink/8 bg-paper p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-500/35 hover:shadow-panel"
      to={to}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gold-flow opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/8 bg-ink/4 text-ink transition-all duration-300 group-hover:border-gold-500/35 group-hover:bg-ink group-hover:text-gold-300">
          {icon}
        </div>
        <ArrowUpRight
          className="text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-700"
          size={18}
        />
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/55">{description}</p>
    </Link>
  );
}
