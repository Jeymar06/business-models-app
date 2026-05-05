export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('es-CO', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
