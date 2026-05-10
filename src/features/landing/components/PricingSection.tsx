import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button, Pill } from '@/components/ui';
import { pricingPlans } from '@/features/landing/data/pricing';

export function PricingSection() {
  return (
    <section className="border-y border-white/8 bg-ink-soft" id="planes">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="text-center">
          <p className="eyebrow text-gold-300">Planes de suscripción</p>
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Planes pensados para distintas{' '}
            <span className="font-display-italic text-gold-200">etapas de crecimiento.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-cream/68">
            Si todavía no existe un sistema de pagos integrado para tu flujo, los accesos te llevan al registro para iniciar la cuenta.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {pricingPlans.map((plan, idx) => (
            <article
              className={[
                'relative flex flex-col rounded-[32px] border bg-[#141210] p-7 transition-all duration-500',
                plan.isPopular
                  ? 'landing-pro-plan border-gold-500/45 lg:-translate-y-3 lg:scale-[1.02]'
                  : 'border-white/10 hover:-translate-y-1 hover:border-white/20',
              ].join(' ')}
              key={plan.name}
            >
              {plan.isPopular ? (
                <Pill icon={<Sparkles size={12} />} tone="gold" className="mb-5 self-start">
                  Más popular
                </Pill>
              ) : (
                <span className="font-display numeric mb-5 self-start text-sm text-cream/30">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              )}

              <div>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-cream">{plan.name}</h3>
                <p className="mt-3 text-sm leading-7 text-cream/68">{plan.description}</p>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="font-display numeric text-5xl font-semibold tracking-tight text-cream">{plan.price}</span>
                <span className="pb-2 text-sm text-cream/55">{plan.period}</span>
              </div>

              <div className="mt-7">
                <Link to={plan.ctaHref}>
                  <Button className="w-full" size="lg" variant={plan.isPopular ? 'gold' : 'outline'}>
                    {plan.ctaLabel}
                  </Button>
                </Link>
              </div>

              <div className="mt-7 space-y-3 border-t border-white/8 pt-6">
                {plan.features.map((feature) => (
                  <div className="flex items-start gap-3" key={feature}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/14 text-gold-300">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <p className="text-sm leading-7 text-cream/72">{feature}</p>
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
