import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { pricingPlans } from '@/features/landing/data/pricing';

export function PricingSection() {
  return (
    <section className="border-y border-white/8 bg-[#111111]" id="planes">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">PLANES DE SUSCRIPCION</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Planes pensados para distintas etapas de crecimiento.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#C9C9C9]">
            Si todavia no existe un sistema de pagos integrado para tu flujo, los accesos te llevan al registro para iniciar la cuenta.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              className={[
                'relative rounded-[32px] border bg-[#0F0F0F] p-6',
                plan.isPopular ? 'landing-pro-plan border-gold/40' : 'border-white/10',
              ].join(' ')}
              key={plan.name}
            >
              {plan.isPopular ? (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  <Sparkles size={14} />
                  Mas popular
                </div>
              ) : null}

              <div>
                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{plan.description}</p>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold text-white">{plan.price}</span>
                <span className="pb-1 text-sm text-[#C9C9C9]">{plan.period}</span>
              </div>

              <div className="mt-6">
                <Link to={plan.ctaHref}>
                  <Button className="w-full" size="lg" variant={plan.isPopular ? 'primary' : 'secondary'}>
                    {plan.ctaLabel}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/8 pt-6">
                {plan.features.map((feature) => (
                  <div className="flex items-start gap-3" key={feature}>
                    <span className="mt-1 text-gold">
                      <Check size={16} />
                    </span>
                    <p className="text-sm leading-7 text-[#C9C9C9]">{feature}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}