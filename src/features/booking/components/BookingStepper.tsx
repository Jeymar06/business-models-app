import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';

const labels = ['Servicio', 'Barbero', 'Fecha', 'Confirmar'];

export function BookingStepper({ canGoNext, children, currentStep, isFinalLoading, onBack, onConfirm, onNext }: { currentStep: number; canGoNext: boolean; onNext: () => void; onBack: () => void; onConfirm: () => void; isFinalLoading?: boolean; children: ReactNode }) {
  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div>
        <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
          <span>{labels[currentStep - 1]}</span>
          <span>Paso {currentStep} de 4</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-mint transition-all" style={{ width: `${(currentStep / 4) * 100}%` }} />
        </div>
      </div>

      {children}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button disabled={currentStep === 1 || isFinalLoading} onClick={onBack} variant="secondary">
          <ArrowLeft size={18} />
          Atras
        </Button>
        {currentStep < 4 ? (
          <Button disabled={!canGoNext} onClick={onNext}>
            Siguiente
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button disabled={!canGoNext || isFinalLoading} onClick={onConfirm}>
            {isFinalLoading ? 'Confirmando...' : 'Confirmar cita'}
          </Button>
        )}
      </div>
    </section>
  );
}
