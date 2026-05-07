import { Button } from '@/components/ui';

export function ConfirmActionModal({
  confirmLabel = 'Confirmar',
  description,
  isLoading = false,
  onClose,
  onConfirm,
  open,
  title,
}: {
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="surface-panel w-full max-w-lg rounded-[28px] p-6 text-ink shadow-[0_30px_120px_rgba(17,17,17,0.22)]">
        <p className="text-sm font-semibold tracking-[0.18em] text-danger">CONFIRMAR ACCIÓN</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose} size="md" variant="secondary">
            Cancelar
          </Button>
          <Button className="bg-danger text-white hover:bg-[#b91c1c]" disabled={isLoading} onClick={onConfirm} size="md">
            {isLoading ? 'Procesando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
