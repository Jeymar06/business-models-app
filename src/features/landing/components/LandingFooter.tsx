import { BrandSignature } from '@/components/layout/BrandSignature';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

type FooterItem = {
  label: string;
  description: string;
  href?: string;
  targetBlank?: boolean;
  previewImage?: string;
};

const footerColumns: Array<{ title: string; items: FooterItem[] }> = [
  {
    title: 'Producto',
    items: [
      {
        label: 'Reservas online',
        description: 'Tus clientes reservan sin llamadas ni cruces de horario, desde cualquier dispositivo.',
        href: '/register',
      },
      {
        label: 'Agenda por barbero',
        description: 'Cada barbero ve su disponibilidad clara para atender mejor y reducir vacios en la jornada.',
        href: '/register',
      },
      {
        label: 'Metricas y comisiones',
        description: 'Sigue ingresos, rendimiento y calculo operativo para tomar decisiones con datos mas claros.',
        href: '#funciones',
      },
      {
        label: 'Planes',
        description: 'Starter, Pro y Premium alineados al canvas comercial y a distintas etapas del negocio.',
        href: '#planes',
      },
    ],
  },
  {
    title: 'Empresa',
    items: [
      {
        label: 'Barber Flow',
        description: 'Una plataforma pensada para ordenar reservas, operacion y crecimiento comercial en barberias modernas.',
        href: '#inicio',
      },
      {
        label: 'Modelo de negocio',
        description: 'Haz clic para abrir el canvas completo en una pagina independiente.',
        href: '/modelo-de-negocio',
        targetBlank: true,
        previewImage: landingMediaGroups.productShots.businessModelCanvas,
      },
      {
        label: 'Segmentos',
        description: 'Desde barberos independientes hasta cadenas multisede, con foco inicial en Bucaramanga y area metropolitana.',
        href: '#funciones',
      },
      {
        label: 'Canales',
        description: 'Venta directa, barberflow.co, TikTok e Instagram como parte del crecimiento comercial.',
        href: '#como-funciona',
      },
    ],
  },
  {
    title: 'Relacion',
    items: [
      {
        label: 'Primer mes gratis',
        description: 'La entrada comercial esta pensada para facilitar adopcion y bajar friccion inicial.',
        href: '#planes',
      },
      {
        label: 'Acompanamiento de inicio',
        description: 'Cada barberia recibe una puesta en marcha mas guiada y cercana.',
        href: '#como-funciona',
      },
      {
        label: 'Referidos y fidelidad',
        description: 'El modelo contempla recompensas por recomendacion y permanencia.',
        href: '#planes',
      },
    ],
  },
  {
    title: 'Contacto',
    items: [
      {
        label: 'hola@barberflow.co',
        description: 'Canal principal para soporte basico, dudas comerciales, demos y alianzas.',
        href: 'mailto:hola@barberflow.co',
      },
      {
        label: 'Soporte basico',
        description: 'Si necesitas ayuda o mas informacion, escribenos a hola@barberflow.co.',
        href: 'mailto:hola@barberflow.co',
      },
      {
        label: 'Bucaramanga, Colombia',
        description: 'Barber Flow nace con foco local y una lectura cercana del negocio en Bucaramanga y su area metropolitana.',
      },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink" id="contacto">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4 lg:pr-8">
            <BrandSignature subtitle="Edicion editorial" />
            <p className="text-sm leading-7 text-cream/60">
              Plataforma SaaS editorial para barberias modernas. Reservas, equipo, metricas, comisiones y soporte comercial en un solo flujo.
            </p>
            <p className="eyebrow text-cream/40">Edicion 2026 - Hecho en Bucaramanga, Colombia</p>
          </div>

          {footerColumns.map((column) => (
            <FooterColumn items={column.items} key={column.title} title={column.title} />
          ))}
        </div>
        <div className="border-t border-white/8">
          <div className="flex flex-col gap-3 py-6 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© Barber Flow. Plataforma SaaS para barberias.</p>
            <p className="font-display italic text-cream/55">
              Reservas, operacion, fidelizacion y crecimiento en una sola experiencia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ items, title }: { items: FooterItem[]; title: string }) {
  return (
    <div>
      <p className="eyebrow text-gold-300">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <FooterInteractiveItem item={item} key={item.label} />
        ))}
      </div>
    </div>
  );
}

function FooterInteractiveItem({ item }: { item: FooterItem }) {
  const content = (
    <>
      <span className="text-sm text-cream/68 transition-colors duration-200 group-hover:text-cream group-focus-visible:text-cream">
        {item.label}
      </span>
      <div className="mt-2 max-h-0 overflow-hidden rounded-2xl border border-white/0 bg-white/0 opacity-0 transition-all duration-300 group-hover:max-h-80 group-hover:border-white/10 group-hover:bg-white/5 group-hover:p-3 group-hover:opacity-100 group-focus-within:max-h-80 group-focus-within:border-white/10 group-focus-within:bg-white/5 group-focus-within:p-3 group-focus-within:opacity-100">
        {item.previewImage ? (
          <img
            alt={item.label}
            className="mb-3 h-28 w-full rounded-xl object-cover"
            src={item.previewImage}
          />
        ) : null}
        <p className="text-xs leading-6 text-cream/62">{item.description}</p>
      </div>
    </>
  );

  if (item.href) {
    return (
      <a
        className="group block rounded-2xl px-1 py-1 outline-none"
        href={item.href}
        target={item.targetBlank ? '_blank' : undefined}
        rel={item.targetBlank ? 'noreferrer noopener' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className="group block w-full rounded-2xl px-1 py-1 text-left outline-none" type="button">
      {content}
    </button>
  );
}
