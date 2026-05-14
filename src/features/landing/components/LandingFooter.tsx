import { BrandSignature } from '@/components/layout/BrandSignature';
import { landingMediaGroups } from '@/features/landing/data/landingMedia';

type FooterItem = {
  label: string;
  description: string;
  href?: string;
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
        label: 'Planes',
        description: 'Compara las etapas de crecimiento y elige la capacidad que mejor se ajuste a tu barberia.',
        href: '#planes',
      },
      {
        label: 'Metricas',
        description: 'Sigue ingresos, citas y rendimiento para tomar decisiones con datos reales del negocio.',
        href: '/register',
      },
    ],
  },
  {
    title: 'Empresa',
    items: [
      {
        label: 'Barber Flow',
        description: 'Una plataforma pensada para ordenar reservas, operacion y experiencia de marca en barberias modernas.',
        href: '#inicio',
      },
      {
        label: 'Como funciona',
        description: 'Desde el registro hasta la agenda diaria, todo el flujo esta disenado para ser rapido y claro.',
        href: '#como-funciona',
      },
      {
        label: 'Clientes',
        description: 'Tus clientes encuentran disponibilidad, reservan facil y reciben una experiencia mas profesional.',
        href: '#funciones',
      },
      {
        label: 'Barberias',
        description: 'Ideal para negocios que quieren crecer con mejor orden interno, mejor atencion y mejor lectura del dia a dia.',
        href: '#funciones',
      },
      {
        label: 'Modelo de negocio',
        description: 'Aqui podras mostrar tu canvas del modelo de negocio. Solo reemplaza esta imagen por tu version final.',
        previewImage: landingMediaGroups.productShots.detail,
      },
    ],
  },
  {
    title: 'Legal',
    items: [
      {
        label: 'Terminos',
        description: 'Define las condiciones de uso de la plataforma, responsabilidades y alcance del servicio.',
      },
      {
        label: 'Privacidad',
        description: 'Explica como se almacenan, procesan y protegen los datos de clientes, admins y barberias.',
      },
      {
        label: 'Seguridad',
        description: 'Describe las medidas de autenticacion, control de acceso y resguardo de informacion.',
      },
      {
        label: 'Uso de plataforma',
        description: 'Aclara buenas practicas, limites de uso y criterios de convivencia dentro del sistema.',
      },
    ],
  },
  {
    title: 'Contacto',
    items: [
      {
        label: 'hola@barberflow.co',
        description: 'Canal principal para dudas comerciales, alianzas o consultas de implementacion.',
        href: 'mailto:hola@barberflow.co',
      },
      {
        label: 'Soporte para barberias',
        description: 'Acompaniamiento para configuracion, operacion y resolucion de incidentes en el dia a dia.',
      },
      {
        label: 'Colombia',
        description: 'Barber Flow nace con foco local y una lectura cercana de las necesidades del negocio en Colombia.',
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
              Plataforma SaaS editorial para barberias modernas. Reservas, equipo, servicios y metricas en un solo flujo.
            </p>
            <p className="eyebrow text-cream/40">Edicion 2026 - Hecho en Colombia</p>
          </div>

          {footerColumns.map((column) => (
            <FooterColumn items={column.items} key={column.title} title={column.title} />
          ))}
        </div>
        <div className="border-t border-white/8">
          <div className="flex flex-col gap-3 py-6 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© Barber Flow. Plataforma SaaS para barberias.</p>
            <p className="font-display italic text-cream/55">
              Reservas, operacion y crecimiento en una sola experiencia.
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
      <a className="group block rounded-2xl px-1 py-1 outline-none" href={item.href}>
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
