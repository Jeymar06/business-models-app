export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#0B0B0B]" id="contacto">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <FooterColumn
          title="Producto"
          items={['Reservas online', 'Agenda por barbero', 'Planes', 'Metricas']}
        />
        <FooterColumn
          title="Empresa"
          items={['Barber Flow', 'Como funciona', 'Clientes', 'Barberias']}
        />
        <FooterColumn
          title="Legal"
          items={['Terminos', 'Privacidad', 'Seguridad', 'Uso de plataforma']}
        />
        <FooterColumn
          title="Contacto"
          items={['hola@barberflow.co', 'Soporte para barberias modernas', 'Colombia']}
        />
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-5 text-sm text-white/48 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>Barber Flow. Plataforma SaaS para barberias.</p>
          <p>Reservas, operacion y crecimiento en una sola experiencia.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-[0.18em] text-gold">{title}</p>
      <div className="mt-4 space-y-3 text-sm text-[#C9C9C9]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}