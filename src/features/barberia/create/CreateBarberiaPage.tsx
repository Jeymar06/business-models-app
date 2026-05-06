import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { barberiaService } from './barberiaService';
import { uploadBarberiaImage } from './imageUpload';
import { defaultCreateBarberiaValues, type CreateBarberiaFormValues } from './schema';
import { Step1Info } from './Step1Info';
import { Step2Ubicacion } from './Step2Ubicacion';
import { Step3Branding } from './Step3Branding';
import { Step4Config } from './Step4Config';

const steps = ['Informacion', 'Ubicacion', 'Branding', 'Configuracion'];

export function CreateBarberiaPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CreateBarberiaFormValues>({
    defaultValues: defaultCreateBarberiaValues,
    mode: 'onSubmit',
  });

  const watchedName = form.watch('nombre');
  const previewSlug = useMemo(() => barberiaService.generateSlug(watchedName || 'nombre-barberia'), [watchedName]);
  const progress = ((currentStep + 1) / steps.length) * 100;

  function goNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSubmit(values: CreateBarberiaFormValues) {
    console.log('✅ SUBMIT INICIADO');
    if (!user) {
      setError('No hay usuario autenticado');
      console.error('❌ No hay usuario');
      return;
    }
    
    setError(null);
    setIsSaving(true);

    try {
      console.log('🔄 Iniciando creación de barberia...');
      console.log('Valores:', values);

      const [logoUrl, bannerUrl] = await Promise.all([
        logoFile ? uploadBarberiaImage(logoFile, user.id, 'logos') : Promise.resolve(null),
        bannerFile ? uploadBarberiaImage(bannerFile, user.id, 'banners') : Promise.resolve(null),
      ]);

      console.log('✅ Imágenes listas:', { logoUrl, bannerUrl });

      const result = await barberiaService.createBarberia({
        ...values,
        adminId: user.id,
        logoUrl,
        bannerUrl,
      });
      
      console.log('✅ Barberia creada:', result);
      window.location.assign('/admin-dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error completo:', err);
      setError(errorMsg);
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">SaaS para barberias</p>
        <h1 className="text-3xl font-bold text-ink">Crear mi barberia</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Completa el perfil del negocio para publicarlo en el marketplace y empezar a gestionar reservas.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-ink">{steps[currentStep]}</span>
            <span className="text-slate-500">Paso {currentStep + 1} de {steps.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-mint transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mb-5 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          URL sugerida: <span className="font-medium text-ink">/barberias/{previewSlug}</span>
        </div>

        {error ? <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {currentStep === 0 ? <Step1Info errors={form.formState.errors} register={form.register} /> : null}
          {currentStep === 1 ? <Step2Ubicacion errors={form.formState.errors} register={form.register} /> : null}
          {currentStep === 2 ? (
            <Step3Branding
              bannerFile={bannerFile}
              logoFile={logoFile}
              onBannerChange={setBannerFile}
              onLogoChange={setLogoFile}
            />
          ) : null}
          {currentStep === 3 ? <Step4Config errors={form.formState.errors} register={form.register} /> : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button disabled={currentStep === 0 || isSaving} onClick={goBack} type="button" variant="secondary">
              <ArrowLeft size={18} />
              Anterior
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button disabled={isSaving} onClick={goNext} type="button">
                Siguiente
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button disabled={isSaving} type="submit">
                <Check size={18} />
                {isSaving ? 'Creando...' : 'Crear barberia'}
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
