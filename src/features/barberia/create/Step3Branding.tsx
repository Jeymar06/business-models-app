export function Step3Branding({
  bannerFile,
  logoFile,
  onBannerChange,
  onLogoChange,
}: {
  bannerFile: File | null;
  logoFile: File | null;
  onBannerChange: (file: File | null) => void;
  onLogoChange: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-5">
      <ImagePicker
        description="Ideal cuadrado, minimo 512x512."
        file={logoFile}
        label="Logo"
        onChange={onLogoChange}
      />
      <ImagePicker
        description="Imagen horizontal para el marketplace, recomendado 1600x600."
        file={bannerFile}
        label="Banner"
        onChange={onBannerChange}
      />
    </div>
  );
}

function ImagePicker({
  description,
  file,
  label,
  onChange,
}: {
  description: string;
  file: File | null;
  label: string;
  onChange: (file: File | null) => void;
}) {
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <label className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
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
    </label>
  );
}
