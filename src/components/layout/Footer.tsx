export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/8 bg-[#111111] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/60">BARBERAPP</p>
          <p className="mt-1 text-sm text-white/78">Reservas, operacion y crecimiento para barberias modernas.</p>
        </div>
        <p className="text-sm text-white/48">Experiencia premium para clientes, admins y superadmins.</p>
      </div>
    </footer>
  );
}
