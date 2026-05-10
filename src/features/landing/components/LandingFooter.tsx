export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink" id="contacto">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4 lg:pr-8">
            <p className="font-display text-2xl font-semibold tracking-tight text-cream">
              Barber Flow<span className="text-gold-300">.</span>
            </p>
            <p className="text-sm leading-7 text-cream/60">
              Plataforma SaaS editorial para barberías modernas. Reservas, equipo, servicios, métricas — un solo flujo.
            </p>
            <p className="eyebrow text-cream/40">Edición 2026 — Hecho en Colombia</p>
          </div>

          <FooterColumn title="Producto" items={['Reservas online', 'Agenda por barbero', 'Planes', 'Métricas']} />
          <FooterColumn title="Empresa" items={['Barber Flow', 'Cómo funciona', 'Clientes', 'Barberías']} />
          <FooterColumn title="Legal" items={['Términos', 'Privacidad', 'Seguridad', 'Uso de plataforma']} />
          <FooterColumn title="Contacto" items={['hola@barberflow.co', 'Soporte para barberías', 'Colombia']} />
        </div>
        <div className="border-t border-white/8">
          <div className="flex flex-col gap-3 py-6 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© Barber Flow. Plataforma SaaS para barberías.</p>
            <p className="font-display italic text-cream/55">
              Reservas, operación y crecimiento en una sola experiencia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="eyebrow text-gold-300">{title}</p>
      <div className="mt-4 space-y-3 text-sm text-cream/68">
        {items.map((item) => (
          <p className="transition-colors duration-200 hover:text-cream" key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
