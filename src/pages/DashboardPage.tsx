import { ModelComparisonChart } from '@/components/charts/ModelComparisonChart';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DashboardSummary } from '@/features/dashboard/components/DashboardSummary';

export function DashboardPage() {
  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-2 text-slate-600">Pulso general del portafolio de modelos.</p>
      </div>
      <DashboardSummary />
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart />
        <ModelComparisonChart />
      </div>
    </section>
  );
}
