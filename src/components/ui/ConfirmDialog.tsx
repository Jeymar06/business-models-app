import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from './Button';
import { Modal } from './Modal';

/* =========================================================
   ConfirmDialog — editorial destructive-action confirmation
   Built on top of Modal. Spanish-friendly defaults.
   ========================================================= */

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
  /** show an extra paragraph (will be styled in red) */
  warning?: ReactNode;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  eyebrow = 'Confirmar acción',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  warning,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    try {
      setPending(true);
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      eyebrow={eyebrow}
      onClose={pending ? () => {} : onClose}
      open={open}
      size="sm"
      title={
        <span className="flex items-center gap-3">
          {tone === 'danger' ? (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-danger/12 text-danger">
              <AlertTriangle size={18} />
            </span>
          ) : null}
          {title}
        </span>
      }
      description={description}
      footer={
        <>
          <Button disabled={pending} onClick={onClose} variant="ghost-ink">
            {cancelLabel}
          </Button>
          <Button
            disabled={pending}
            onClick={handleConfirm}
            variant={tone === 'danger' ? 'primary' : 'gold'}
            className={tone === 'danger' ? '!bg-danger hover:!bg-[#c8383d] !ring-danger/20' : ''}
          >
            {pending ? 'Procesando…' : confirmLabel}
          </Button>
        </>
      }
    >
      {warning ? (
        <div className="rounded-2xl border border-danger/22 bg-danger/8 p-4 text-sm leading-6 text-danger">
          {warning}
        </div>
      ) : null}
    </Modal>
  );
}
