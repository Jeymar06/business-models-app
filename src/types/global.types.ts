export type EntityStatus = 'draft' | 'active' | 'archived';

export type Nullable<T> = T | null;

export type MetricCard = {
  label: string;
  value: string;
  delta?: string;
};
