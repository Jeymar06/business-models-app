import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button, Input } from '@/components/ui';
import { canvasSections, type Canvas, type CanvasSectionId } from '@/features/models/types';

type CanvasBoardProps = {
  canvas: Canvas;
  onAddItem: (sectionId: CanvasSectionId, item: string) => void;
  onRemoveItem: (sectionId: CanvasSectionId, index: number) => void;
};

function createDrafts() {
  return canvasSections.reduce((drafts, section) => {
    drafts[section.id] = '';
    return drafts;
  }, {} as Record<CanvasSectionId, string>);
}

export function CanvasBoard({ canvas, onAddItem, onRemoveItem }: CanvasBoardProps) {
  const [drafts, setDrafts] = useState(createDrafts);

  function handleAdd(sectionId: CanvasSectionId) {
    const value = drafts[sectionId].trim();

    if (!value) {
      return;
    }

    onAddItem(sectionId, value);
    setDrafts((currentDrafts) => ({ ...currentDrafts, [sectionId]: '' }));
  }

  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {canvasSections.map((section) => (
        <article className="grid min-h-64 gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-panel" key={section.id}>
          <h2 className="text-sm font-semibold text-ink">{section.title}</h2>

          <ul className="grid content-start gap-2">
            {(canvas[section.id] ?? []).map((item, index) => (
              <li
                className="flex items-start justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
                key={`${section.id}-${item}-${index}`}
              >
                <span>{item}</span>
                <button
                  aria-label={`Eliminar ${item}`}
                  className="rounded p-1 text-slate-400 transition hover:bg-white hover:text-red-600"
                  onClick={() => onRemoveItem(section.id, index)}
                  type="button"
                >
                  <Trash2 aria-hidden size={14} />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid gap-2">
            <Input
              aria-label={`Agregar en ${section.title}`}
              onChange={(event) => setDrafts((currentDrafts) => ({ ...currentDrafts, [section.id]: event.target.value }))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAdd(section.id);
                }
              }}
              placeholder="Nueva nota"
              value={drafts[section.id]}
            />
            <Button onClick={() => handleAdd(section.id)} size="sm" variant="secondary">
              <Plus aria-hidden size={16} />
              Agregar
            </Button>
          </div>
        </article>
      ))}
    </section>
  );
}
