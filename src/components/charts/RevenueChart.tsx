import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type RevenuePoint = {
  month: string;
  revenue: number;
};

const defaultData: RevenuePoint[] = [
  { month: 'Ene', revenue: 4200 },
  { month: 'Feb', revenue: 6800 },
  { month: 'Mar', revenue: 9100 },
  { month: 'Abr', revenue: 11800 },
  { month: 'May', revenue: 14600 },
  { month: 'Jun', revenue: 18200 },
];

export function RevenueChart({ data = defaultData }: { data?: RevenuePoint[] }) {
  return (
    <div className="h-72 rounded-md border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Ingresos proyectados</h2>
        <p className="text-sm text-slate-500">Evolucion mensual estimada</p>
      </div>
      <ResponsiveContainer height="80%" width="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} tickLine={false} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ingresos']} />
          <Line
            dataKey="revenue"
            dot={{ r: 4 }}
            stroke="#2bbf8a"
            strokeLinecap="round"
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
