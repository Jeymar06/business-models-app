import { Plus } from 'lucide-react';

import { landingFaq } from '@/features/landing/data/faq';

export function FAQSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <p className="eyebrow text-gold-300">Preguntas frecuentes</p>
          <h2 className="font-display max-w-md text-4xl font-semibold leading-[1.04] tracking-tight text-cream sm:text-5xl">
            Lo esencial,{' '}
            <span className="font-display-italic text-gold-200">respondido sin vueltas.</span>
          </h2>
          <p className="max-w-lg text-base leading-8 text-cream/68">
            La landing debe dejar claro cómo entra Barber Flow al negocio incluso antes de probar la plataforma.
          </p>
        </div>

        <div className="space-y-3">
          {landingFaq.map((item) => (
            <details
              className="group rounded-[24px] border border-white/8 bg-[#141210] px-6 py-5 transition-colors duration-300 open:border-gold-500/22 open:bg-[#1a1714] hover:border-white/16"
              key={item.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-display text-lg font-semibold tracking-tight text-cream">{item.question}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-cream/70 transition-all duration-300 group-open:rotate-45 group-open:border-gold-500/40 group-open:bg-gold-500/12 group-open:text-gold-300">
                  <Plus size={16} />
                </span>
              </summary>
              <p className="mt-4 text-[0.95rem] leading-7 text-cream/68">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
