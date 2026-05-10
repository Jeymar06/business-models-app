export function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/12 bg-ink/3 p-6 text-center">
      <p className="font-display text-lg font-semibold tracking-tight text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink/55">{text}</p>
    </div>
  );
}
