import { useEffect, useMemo } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui';
import { isRenderableMediaUrl } from '@/utils/media';

import type { CreateBarberiaFormValues } from './schema';

export function Step3Branding({
  bannerFile,
  bannerUrl,
  errors,
  logoFile,
  logoUrl,
  onBannerChange,
  onLogoChange,
  register,
}: {
  bannerFile: File | null;
  bannerUrl: string;
  errors: FieldErrors<CreateBarberiaFormValues>;
  logoFile: File | null;
  logoUrl: string;
  onBannerChange: (file: File | null) => void;
  onLogoChange: (file: File | null) => void;
  register: UseFormRegister<CreateBarberiaFormValues>;
}) {
  return (
    <div className="grid gap-5">
      <ImagePicker
        description="Ideal cuadrado, minimo 512x512. Puedes subir archivo o pegar URL."
        error={errors.logoUrl?.message}
        file={logoFile}
        label="Logo"
        onChange={onLogoChange}
        registerProps={register('logoUrl')}
        url={logoUrl}
      />
      <ImagePicker
        description="Imagen horizontal para el marketplace, recomendado 1600x600. Puedes subir archivo o pegar URL."
        error={errors.bannerUrl?.message}
        file={bannerFile}
        label="Banner"
        onChange={onBannerChange}
        registerProps={register('bannerUrl')}
        url={bannerUrl}
      />
    </div>
  );
}

function ImagePicker({
  description,
  error,
  file,
  label,
  onChange,
  registerProps,
  url,
}: {
  description: string;
  error?: string;
  file: File | null;
  label: string;
  onChange: (file: File | null) => void;
  registerProps: ReturnType<UseFormRegister<CreateBarberiaFormValues>>;
  url: string;
}) {
  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return isRenderableMediaUrl(url) ? url.trim() : null;
  }, [file, url]);

  useEffect(() => {
    return () => {
      if (file && previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
      <div>
        <span className="font-semibold text-ink">{label}</span>
        <p className="text-slate-500">{description}</p>
      </div>
      {previewUrl ? (
        <img alt={`Preview ${label}`} className="h-40 w-full rounded-md object-cover" src={previewUrl} />
      ) : (
        <div className="grid h-40 place-items-center rounded-md border border-dashed border-slate-300 text-slate-400">
          Sin imagen seleccionada
        </div>
      )}
      <input
        accept="image/*"
        className="text-sm"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />
      <Input label={`URL de ${label.toLowerCase()}`} placeholder="https://..." {...registerProps} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
