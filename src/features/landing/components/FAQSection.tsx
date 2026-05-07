import { landingFaq } from '@/features/landing/data/faq';

export function FAQSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-gold">PREGUNTAS FRECUENTES</p>
          <h2 className="max-w-md text-3xl font-semibold text-white sm:text-4xl">Lo esencial, respondido sin vueltas.</h2>
          <p className="max-w-lg text-base leading-7 text-[#C9C9C9]">
            La landing debe dejar claro como entra Barber Flow al negocio incluso antes de probar la plataforma.
          </p>
        </div>

        <div className="space-y-3">
          {landingFaq.map((item) => (
            <details className="rounded-[24px] border border-white/10 bg-[#111111] px-5 py-4" key={item.question}>
              <summary className="cursor-pointer list-none text-lg font-semibold text-white">{item.question}</summary>
              <p className="mt-3 text-sm leading-7 text-[#C9C9C9]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}