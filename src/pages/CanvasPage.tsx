import { Save } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { CanvasBoard } from '@/features/canvas/components/CanvasBoard';
import { saveCanvas } from '@/features/canvas/canvasService';
import { useCanvas } from '@/features/canvas/hooks/useCanvas';

export function CanvasPage() {
  const { addItem, canvas, removeItem } = useCanvas();
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    await saveCanvas('local-draft', canvas);
    setStatus('Canvas guardado.');
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Business Model Canvas</h1>
          <p className="mt-2 text-slate-600">Organiza supuestos clave por bloque.</p>
        </div>
        <div className="flex items-center gap-3">
          {status ? <span className="text-sm text-mint">{status}</span> : null}
          <Button onClick={handleSave}>
            <Save aria-hidden size={18} />
            Guardar
          </Button>
        </div>
      </div>

      <CanvasBoard canvas={canvas} onAddItem={addItem} onRemoveItem={removeItem} />
    </section>
  );
}
