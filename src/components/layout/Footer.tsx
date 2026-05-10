export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/8 bg-ink-soft text-cream">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-cream">
            Barber Flow<span className="text-gold-300">.</span>
          </p>
          <p className="mt-1 text-sm text-cream/68">Reservas, operación y crecimiento para barberías modernas.</p>
        </div>
        <p className="font-display italic text-sm text-cream/50">Experiencia premium para clientes, admins y superadmins.</p>
      </div>
    </footer>
  );
}
