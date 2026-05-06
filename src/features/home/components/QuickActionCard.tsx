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
      className="surface-panel group rounded-[24px] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-panel"
      to={to}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/5 text-ink transition group-hover:bg-[#111111] group-hover:text-white">
          {icon}
        </div>
        <ArrowUpRight className="text-steel transition group-hover:text-ink" size={18} />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}
