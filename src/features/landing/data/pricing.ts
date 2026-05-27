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
    description: 'Para barberos independientes y barberias pequenas que quieren ordenar reservas y arrancar facil.',
    ctaLabel: 'Probar primer mes',
    ctaHref: '/register',
    features: [
      'Primer mes gratis',
      '1 barberia',
      'Hasta 2 barberos',
      'Agenda online automatica',
      'Panel cliente',
      'Soporte de inicio',
    ],
  },
  {
    name: 'Pro',
    price: '$39.000 COP',
    period: '/ mes',
    description: 'La opcion ideal para barberias de 2 a 5 sillas que quieren control diario, acompanamiento y datos claros.',
    ctaLabel: 'Crear cuenta',
    ctaHref: '/register',
    isPopular: true,
    features: [
      '1 barberia',
      'Hasta 8 barberos',
      'Servicios ilimitados',
      'Notificaciones internas',
      'Recordatorios operativos',
      'Metricas mensuales',
      'Calculo de comisiones',
      'Programa de referidos',
      'Soporte prioritario',
    ],
  },
  {
    name: 'Premium',
    price: '$79.000 COP',
    period: '/ mes',
    description: 'Pensado para operaciones mas grandes, cadenas multisede y equipos que buscan mas supervision comercial.',
    ctaLabel: 'Contactar o registrarme',
    ctaHref: '/register',
    features: [
      'Multiples barberias',
      'Barberos ilimitados',
      'Paneles por sede',
      'Estadisticas avanzadas',
      'Descuentos por fidelidad',
      'Seguimiento de clientes frecuentes',
      'Activacion comercial por canales digitales',
      'Soporte premium',
      'Futuras integraciones de pagos',
    ],
  },
];
