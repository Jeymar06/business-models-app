export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  isPopular?: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$19.000 COP',
    period: '/ mes',
    description: 'Para barberias pequenas que quieren ordenar reservas y empezar con una base profesional.',
    ctaLabel: 'Crear cuenta',
    ctaHref: '/register',
    features: [
      '1 barberia',
      'Hasta 2 barberos',
      'Hasta 10 servicios',
      'Agenda online',
      'Panel cliente',
      'Panel admin basico',
      'Citas ilimitadas',
      'Soporte basico',
    ],
  },
  {
    name: 'Pro',
    price: '$39.000 COP',
    period: '/ mes',
    description: 'La opcion ideal para barberias que ya operan en serio y quieren mas control diario.',
    ctaLabel: 'Crear cuenta',
    ctaHref: '/register',
    isPopular: true,
    features: [
      '1 barberia',
      'Hasta 8 barberos',
      'Servicios ilimitados',
      'Agenda avanzada',
      'Gestion de horarios',
      'Estados de citas',
      'Recordatorios por email',
      'Metricas mensuales',
      'Soporte prioritario',
    ],
  },
  {
    name: 'Premium',
    price: '$79.000 COP',
    period: '/ mes',
    description: 'Pensado para operaciones mas grandes, multiples sedes y supervision mas profunda.',
    ctaLabel: 'Contactar o registrarme',
    ctaHref: '/register',
    features: [
      'Multiples barberias',
      'Barberos ilimitados',
      'Paneles por sede',
      'Estadisticas avanzadas',
      'Automatizaciones operativas',
      'Notificaciones avanzadas',
      'Seguimiento de clientes frecuentes',
      'Soporte premium',
      'Futuras integraciones de pagos',
    ],
  },
];
