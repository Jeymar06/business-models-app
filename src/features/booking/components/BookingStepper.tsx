import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';

const labels = ['Servicio', 'Barbero', 'Fecha', 'Confirmar'];

export function BookingStepper({
  canGoNext,
  children,
  currentStep,
  isFinalLoading,
  onBack,
  onConfirm,
  onNext,
}: {
  currentStep: number;
  canGoNext: boolean;
  onNext: () => void;
  onBack: () => void;
  onConfirm: () => void;
  isFinalLoading?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-7">
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div className="space-y-1">
            <p className="eyebrow text-gold-700">Paso {currentStep} de 4</p>
            <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {labels[currentStep - 1]}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {labels.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isComplete = stepNumber < currentStep;
              return (
                <div
                  aria-current={isActive ? 'step' : undefined}
                  className={[
                    'h-1.5 rounded-full transition-all duration-500',
                    isActive ? 'w-10 bg-gold-500' : isComplete ? 'w-6 bg-gold-300' : 'w-6 bg-ink/10',
                  ].join(' ')}
                  key={label}
                />
              );
            })}
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/6">
          <div
            className="h-full bg-[linear-gradient(90deg,#E8C766,#D4AF37,#B89020)] transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="animate-fade-up">{children}</div>

      <div className="flex flex-col-reverse gap-3 border-t border-ink/8 pt-6 sm:flex-row sm:justify-between">
        <Button disabled={currentStep === 1 || isFinalLoading} onClick={onBack} variant="outline-ink">
          <ArrowLeft size={18} />
          Atrás
        </Button>
        {currentStep < 4 ? (
          <Button disabled={!canGoNext} onClick={onNext} variant="primary">
            Siguiente
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button disabled={!canGoNext || isFinalLoading} onClick={onConfirm} size="lg" variant="gold">
            {isFinalLoading ? 'Confirmando…' : 'Confirmar cita'}
          </Button>
        )}
      </div>
    </section>
  );
}
