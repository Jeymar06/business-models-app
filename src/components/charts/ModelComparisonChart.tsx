import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type ModelComparisonPoint = {
  model: string;
  score: number;
};

const defaultData: ModelComparisonPoint[] = [
  { model: 'SaaS', score: 82 },
  { model: 'Marketplace', score: 76 },
  { model: 'Freemium', score: 69 },
  { model: 'Servicios', score: 58 },
];

export function ModelComparisonChart({ data = defaultData }: { data?: ModelComparisonPoint[] }) {
  return (
    <div className="h-72 rounded-md border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Comparacion de modelos</h2>
        <p className="text-sm text-slate-500">Puntaje agregado por opcion</p>
      </div>
      <ResponsiveContainer height="80%" width="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="model" tickLine={false} />
          <YAxis domain={[0, 100]} tickLine={false} />
          <Tooltip formatter={(value) => [`${value}/100`, 'Puntaje']} />
          <Bar dataKey="score" fill="#3e6f8e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
